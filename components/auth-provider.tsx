"use client"

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import type { User, Session } from "@supabase/supabase-js"
import {
  restoreSession,
  onAuthStateChange,
  clearProfileCache,
  prefetchDashboardData,
  type SessionRestoreResult,
} from "@/lib/auth-client"
import { signOut as supabaseSignOut } from "@/lib/supabase"
import DashboardLoading from "@/app/dashboard/loading"

interface AuthContextValue {
  user: User | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
  error: Error | null
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

// Public routes that don't require authentication
const PUBLIC_ROUTES = ["/login", "/signup", "/reset-password", "/"]

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter()
  const pathname = usePathname()

  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const initializedRef = useRef(false)

  // Session restore on mount
  const initializeAuth = useCallback(async () => {
    if (initializedRef.current) return
    initializedRef.current = true

    setIsLoading(true)
    setError(null)

    try {
      const result: SessionRestoreResult = await restoreSession()

      if (result.error) {
        setError(result.error)
      }

      if (result.isAuthenticated && result.session && result.user) {
        setSession(result.session)
        setUser(result.user)

        // If on login page and authenticated, redirect to dashboard
        if (pathname === "/login") {
          router.replace("/dashboard")
        }
      } else {
        // Not authenticated
        setSession(null)
        setUser(null)

        // If on protected route, redirect to login
        const isPublicRoute = PUBLIC_ROUTES.includes(pathname || "")
        if (!isPublicRoute && pathname?.startsWith("/dashboard")) {
          router.replace("/login")
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Authentication failed"))
    } finally {
      setIsLoading(false)
    }
  }, [pathname, router])

  // Initialize auth on mount
  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  // Listen for auth state changes
  useEffect(() => {
    const { unsubscribe } = onAuthStateChange(async (event, newSession) => {
      if (event === "SIGNED_IN" && newSession) {
        setSession(newSession)
        const { data: { user: newUser } } = await (await import("@/lib/supabase")).supabase!.auth.getUser()
        setUser(newUser)

        // Prefetch dashboard data after sign in
        await prefetchDashboardData()
      } else if (event === "SIGNED_OUT") {
        setSession(null)
        setUser(null)
        clearProfileCache()
      } else if (event === "TOKEN_REFRESHED" && newSession) {
        setSession(newSession)
      }
    })

    return () => unsubscribe()
  }, [])

  const signOut = useCallback(async () => {
    try {
      setIsLoading(true)
      await supabaseSignOut()
      clearProfileCache()
      setSession(null)
      setUser(null)

      // Clear cookie
      await fetch("/api/auth/logout", { method: "POST" })

      router.replace("/login")
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Sign out failed"))
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const refreshSession = useCallback(async () => {
    initializedRef.current = false
    await initializeAuth()
  }, [initializeAuth])

  const value: AuthContextValue = {
    user,
    session,
    isLoading,
    isAuthenticated: !!session && !!user,
    error,
    signOut,
    refreshSession,
  }

  // Show skeleton loading for protected routes during initial load
  const isProtectedRoute = pathname?.startsWith("/dashboard")
  if (isLoading && isProtectedRoute) {
    return (
      <AuthContext.Provider value={value}>
        <DashboardLoading />
      </AuthContext.Provider>
    )
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
