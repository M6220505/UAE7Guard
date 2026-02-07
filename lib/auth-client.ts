"use client"

import { supabase, getSession, getCurrentUser } from "./supabase"
import type { User, Session } from "@supabase/supabase-js"

// Session restore timeout (8-10 seconds as specified)
const SESSION_RESTORE_TIMEOUT = 8000

// Debounce delay for session-dependent operations
const DEBOUNCE_DELAY = 300

// Cache for minimal profile data (id, role)
interface MinimalProfile {
  id: string
  email: string
  role: string
}

let profileCache: MinimalProfile | null = null
let profileCacheExpiry: number = 0
const PROFILE_CACHE_TTL = 5 * 60 * 1000 // 5 minutes

/**
 * Debounce utility for session-dependent fetch operations
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number = DEBOUNCE_DELAY
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      fn(...args)
      timeoutId = null
    }, delay)
  }
}

/**
 * Fetch with timeout wrapper
 */
export async function fetchWithTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number = SESSION_RESTORE_TIMEOUT,
  errorMessage: string = "Request timed out. Please check your connection."
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error(errorMessage))
    }, timeoutMs)
  })

  return Promise.race([promise, timeoutPromise])
}

/**
 * Session restore result
 */
export interface SessionRestoreResult {
  session: Session | null
  user: User | null
  profile: MinimalProfile | null
  error: Error | null
  isAuthenticated: boolean
}

/**
 * Restore session from Supabase with proper timeout handling
 * Critical path: 1. Restore Session -> 2. Fetch minimal profile -> 3. Render UI
 */
export async function restoreSession(): Promise<SessionRestoreResult> {
  const result: SessionRestoreResult = {
    session: null,
    user: null,
    profile: null,
    error: null,
    isAuthenticated: false,
  }

  if (!supabase) {
    result.error = new Error("Authentication service is not configured")
    return result
  }

  try {
    // Step 1: Try to restore session from Supabase
    const sessionPromise = getSession()
    const session = await fetchWithTimeout(
      sessionPromise,
      SESSION_RESTORE_TIMEOUT,
      "Session restore timed out. Please try logging in again."
    )

    if (!session) {
      return result
    }

    result.session = session
    result.isAuthenticated = true

    // Step 2: Get user data (minimal profile: id, role)
    const userPromise = getCurrentUser()
    const user = await fetchWithTimeout(
      userPromise,
      SESSION_RESTORE_TIMEOUT,
      "Failed to load user profile. Please try again."
    )

    if (user) {
      result.user = user
      result.profile = {
        id: user.id,
        email: user.email || "",
        role: user.role || "authenticated",
      }

      // Cache the profile
      profileCache = result.profile
      profileCacheExpiry = Date.now() + PROFILE_CACHE_TTL
    }

    return result
  } catch (error) {
    result.error = error instanceof Error ? error : new Error("Session restore failed")

    // If session expired, try to refresh token automatically
    if (error instanceof Error && error.message.includes("expired")) {
      try {
        const { data, error: refreshError } = await supabase.auth.refreshSession()
        if (!refreshError && data.session) {
          result.session = data.session
          result.isAuthenticated = true
          result.error = null

          if (data.user) {
            result.user = data.user
            result.profile = {
              id: data.user.id,
              email: data.user.email || "",
              role: data.user.role || "authenticated",
            }
          }
        }
      } catch {
        // Refresh failed, user needs to login again
      }
    }

    return result
  }
}

/**
 * Get cached profile or fetch fresh
 */
export async function getMinimalProfile(): Promise<MinimalProfile | null> {
  // Return cached profile if valid
  if (profileCache && Date.now() < profileCacheExpiry) {
    return profileCache
  }

  // Fetch fresh profile
  const result = await restoreSession()
  return result.profile
}

/**
 * Clear profile cache (call on logout)
 */
export function clearProfileCache(): void {
  profileCache = null
  profileCacheExpiry = 0
}

/**
 * Create Authorization header for backend requests
 * CRITICAL: All backend requests must include this header
 */
export async function getAuthHeader(): Promise<Record<string, string>> {
  if (!supabase) {
    return {}
  }

  try {
    const session = await getSession()
    if (session?.access_token) {
      return {
        "Authorization": `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      }
    }
  } catch {
    // Session not available
  }

  return {
    "Content-Type": "application/json",
  }
}

/**
 * Make authenticated fetch request with proper headers
 */
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const headers = await getAuthHeader()

  const response = await fetchWithTimeout(
    fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    }),
    SESSION_RESTORE_TIMEOUT,
    "Request timed out. Please check your connection and try again."
  )

  // Handle 401/403 errors - don't fail silently
  if (response.status === 401 || response.status === 403) {
    const errorData = await response.json().catch(() => ({}))
    const errorMessage = response.status === 401
      ? "Your session has expired. Please log in again."
      : "You don't have permission to access this resource."

    throw new AuthError(errorMessage, response.status, errorData)
  }

  return response
}

/**
 * Custom error class for auth-related errors
 */
export class AuthError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public data?: unknown
  ) {
    super(message)
    this.name = "AuthError"
  }
}

/**
 * Prefetch dashboard data after successful auth
 * This should be called immediately after login
 */
export async function prefetchDashboardData(): Promise<void> {
  // Prefetch user profile
  await getMinimalProfile()

  // Add any other dashboard data prefetch here
  // Keep it minimal: max 2 requests (Auth + Data)
}

/**
 * Listen for auth state changes
 */
export function onAuthStateChange(
  callback: (event: string, session: Session | null) => void
): { unsubscribe: () => void } {
  if (!supabase) {
    return { unsubscribe: () => {} }
  }

  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session)

    // Clear cache on sign out
    if (event === "SIGNED_OUT") {
      clearProfileCache()
    }
  })

  return { unsubscribe: () => data.subscription.unsubscribe() }
}
