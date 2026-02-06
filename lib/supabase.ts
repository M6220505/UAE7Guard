import { createClient, SupabaseClient, User } from '@supabase/supabase-js'

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Check if Supabase is properly configured
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey)
}

// Create clients only if configured (prevents errors with empty URLs)
const createSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null
  }
  return createClient(supabaseUrl, supabaseAnonKey)
}

const createSupabaseAdminClient = () => {
  if (!supabaseUrl) {
    return null
  }
  if (supabaseServiceKey) {
    return createClient(supabaseUrl, supabaseServiceKey)
  }
  return createSupabaseClient()
}

// Public client (respects RLS) - use in browser/iOS
export const supabase: SupabaseClient | null = createSupabaseClient()

// Admin client (bypasses RLS) - use ONLY on server
export const supabaseAdmin: SupabaseClient | null = createSupabaseAdminClient()

// ============================================================================
// JWT VERIFICATION (Backend use only)
// ============================================================================

export interface VerifiedUser {
  id: string
  email: string
  role: string
  aud: string
}

/**
 * Verify Supabase JWT token
 * Use this in Backend to verify access_token from iOS/Web
 */
export async function verifySupabaseToken(accessToken: string): Promise<VerifiedUser | null> {
  if (!accessToken || !supabaseAdmin) return null

  try {
    // Use Supabase Admin to get user from token
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken)

    if (error || !user) {
      return null
    }

    return {
      id: user.id,
      email: user.email || '',
      role: user.role || 'authenticated',
      aud: user.aud || 'authenticated',
    }
  } catch {
    return null
  }
}

/**
 * Extract Bearer token from Authorization header
 */
export function extractBearerToken(authHeader: string | null): string | null {
  if (!authHeader) return null
  if (!authHeader.startsWith('Bearer ')) return null
  return authHeader.substring(7)
}

// ============================================================================
// SUPABASE AUTH (For direct use - iOS/Web client)
// ============================================================================

/**
 * Sign up with email and password
 * Use directly from iOS/Web - NOT through Backend
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  metadata?: { firstName?: string; lastName?: string }
) {
  if (!supabase) throw new Error('Supabase is not configured')

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: metadata?.firstName,
        last_name: metadata?.lastName,
      }
    }
  })

  if (error) throw error
  return data
}

/**
 * Sign in with email and password
 * Use directly from iOS/Web - NOT through Backend
 */
export async function signInWithEmail(email: string, password: string) {
  if (!supabase) throw new Error('Supabase is not configured')

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

/**
 * Sign out
 */
export async function signOut() {
  if (!supabase) throw new Error('Supabase is not configured')

  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

/**
 * Get current session (includes access_token)
 */
export async function getSession() {
  if (!supabase) return null

  const { data: { session }, error } = await supabase.auth.getSession()
  if (error) throw error
  return session
}

/**
 * Get current user
 */
export async function getCurrentUser(): Promise<User | null> {
  if (!supabase) return null

  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) return null
  return user
}

/**
 * Reset password
 */
export async function resetPassword(email: string) {
  if (!supabase) throw new Error('Supabase is not configured')

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.APP_URL || 'https://uae7guard.com'}/reset-password`,
  })
  if (error) throw error
}

/**
 * Update password (after reset)
 */
export async function updatePassword(newPassword: string) {
  if (!supabase) throw new Error('Supabase is not configured')

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })
  if (error) throw error
}
