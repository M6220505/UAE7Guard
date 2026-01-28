import { cookies } from "next/headers"

export interface User {
  id: string
  email: string
  name?: string
  role: "user" | "admin"
  createdAt: string
}

export interface Session {
  user: User
  expiresAt: number
  token: string
}

// Session storage (use a database in production)
const sessions = new Map<string, Session>()

// Generate secure token
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

// Hash password (simplified - use bcrypt in production)
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + process.env.AUTH_SECRET)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password)
  return passwordHash === hash
}

// Create session
export async function createSession(user: User): Promise<Session> {
  const token = generateToken()
  const session: Session = {
    user,
    token,
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  }

  sessions.set(token, session)

  // Set cookie
  const cookieStore = await cookies()
  cookieStore.set("session_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: "/",
  })

  return session
}

// Get current session
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

// Get current user
export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession()
  return session?.user || null
}

// Destroy session
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  const token = cookieStore.get("session_token")?.value

  if (token) {
    sessions.delete(token)
    cookieStore.delete("session_token")
  }
}

// Check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession()
  return session !== null
}

// Check if user has required role
export async function hasRole(requiredRole: "user" | "admin"): Promise<boolean> {
  const user = await getCurrentUser()
  if (!user) return false
  if (requiredRole === "user") return true
  return user.role === "admin"
}

// Require authentication (throws if not authenticated)
export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("Unauthorized")
  }
  return user
}

// Require admin role
export async function requireAdmin(): Promise<User> {
  const user = await requireAuth()
  if (user.role !== "admin") {
    throw new Error("Forbidden")
  }
  return user
}
