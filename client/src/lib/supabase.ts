import { createClient } from '@supabase/supabase-js'

// ============================================================================
// SUPABASE CLIENT FOR WEB
// ============================================================================
// Direct connection to Supabase Auth - Use this instead of Backend for auth
// ============================================================================

// Get Supabase credentials from environment
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Check if Supabase is configured
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ============================================================================
// AUTH FUNCTIONS
// ============================================================================

/**
 * Sign up with email and password
 */
export async function signUp(
  email: string,
  password: string,
  metadata?: { firstName?: string; lastName?: string }
) {
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
 */
export async function signIn(email: string, password: string) {
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
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

/**
 * Get current session (includes access_token for API calls)
 */
export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error) throw error
  return session
}

/**
 * Get current user
 */
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) return null
  return user
}

/**
 * Get access token for Backend API calls
 */
export async function getAccessToken(): Promise<string | null> {
  const session = await getSession()
  return session?.access_token || null
}

/**
 * Reset password
 */
export async function resetPassword(email: string) {
  const appUrl = import.meta.env.VITE_APP_URL || window.location.origin
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${appUrl}/reset-password`,
  })
  if (error) throw error
}

/**
 * Update password (after reset)
 */
export async function updatePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })
  if (error) throw error
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(callback: (user: any) => void) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user || null)
  })
}

// ============================================================================
// API HELPER (For Backend calls with Supabase JWT)
// ============================================================================

/**
 * Make authenticated API request to Backend
 * Backend verifies Supabase JWT - no custom auth needed
 */
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const accessToken = await getAccessToken()

  const headers = new Headers(options.headers)
  headers.set('Content-Type', 'application/json')

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`)
  }

  return fetch(url, {
    ...options,
    headers,
  })
}
