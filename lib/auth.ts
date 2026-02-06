import { cookies } from "next/headers"
import { verifySupabaseToken, extractBearerToken, type VerifiedUser } from "./supabase"

// ============================================================================
// USER TYPES
// ============================================================================

export interface User {
  id: string
  email: string
  name?: string
  role: "user" | "admin"
  createdAt: string
}

export interface Session {
  user: User
  accessToken: string
  expiresAt: number
}

// ============================================================================
// JWT VERIFICATION MIDDLEWARE (Backend trusts Supabase JWT only)
// ============================================================================

/**
 * Verify request authentication using Supabase JWT
 * Backend should ONLY verify tokens - never create them
 */
export async function verifyAuth(request: Request): Promise<VerifiedUser | null> {
  // Try Authorization header first (iOS/API calls)
  const authHeader = request.headers.get('Authorization')
  const bearerToken = extractBearerToken(authHeader)

  if (bearerToken) {
    return await verifySupabaseToken(bearerToken)
  }

  // Try cookie for web (SSR/browser)
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('sb-access-token')?.value

  if (accessToken) {
    return await verifySupabaseToken(accessToken)
  }

  return null
}

/**
 * Require authentication - throws if not authenticated
 */
export async function requireAuth(request: Request): Promise<VerifiedUser> {
  const user = await verifyAuth(request)
  if (!user) {
    throw new Error('Unauthorized')
  }
  return user
}

/**
 * Check if user has admin role
 */
export async function requireAdmin(request: Request): Promise<VerifiedUser> {
  const user = await requireAuth(request)
  // Note: Check your Supabase user metadata or app_metadata for admin role
  if (user.role !== 'service_role') {
    throw new Error('Forbidden')
  }
  return user
}

// ============================================================================
// LEGACY SESSION SUPPORT (For Apple Review demo account)
// Remove this section once Supabase Auth is fully integrated
// ============================================================================

const sessions = new Map<string, Session>()

function generateToken(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let token = ""
  const randomValues = new Uint8Array(64)
  crypto.getRandomValues(randomValues)
  for (let i = 0; i < 64; i++) {
    token += chars[randomValues[i] % chars.length]
  }
  return token
}

/**
 * @deprecated Use Supabase Auth directly instead
 * Only kept for Apple Review demo account
 */
export async function createSession(user: User): Promise<Session> {
  const token = generateToken()
  const session: Session = {
    user,
    accessToken: token,
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  }

  sessions.set(token, session)

  const cookieStore = await cookies()
  cookieStore.set("session_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  })

  return session
}

/**
 * @deprecated Use Supabase Auth directly instead
 */
export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("session_token")?.value

  if (!token) return null

  const session = sessions.get(token)
  if (!session) return null

  if (Date.now() > session.expiresAt) {
    sessions.delete(token)
    return null
  }

  return session
}

/**
 * @deprecated Use Supabase Auth directly instead
 */
export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession()
  return session?.user || null
}

/**
 * @deprecated Use Supabase signOut instead
 */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  const token = cookieStore.get("session_token")?.value

  if (token) {
    sessions.delete(token)
    cookieStore.delete("session_token")
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession()
  return session !== null
}

export async function hasRole(requiredRole: "user" | "admin"): Promise<boolean> {
  const user = await getCurrentUser()
  if (!user) return false
  if (requiredRole === "user") return true
  return user.role === "admin"
}
