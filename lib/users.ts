import type { User } from "./auth"
import bcrypt from "bcryptjs"
import { supabaseAdmin, isSupabaseConfigured } from "./supabase"

export interface StoredUser {
  passwordHash: string
  user: User
}

// Fallback in-memory storage (only used if Supabase is not configured)
const usersMemory = new Map<string, StoredUser>()

// Initialize with demo user for fallback
usersMemory.set("demo@example.com", {
  passwordHash: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5P.MnL2uxGa9K", // admin123456
  user: {
    id: "1",
    email: "demo@example.com",
    name: "Demo User",
    role: "admin",
    createdAt: "2024-01-01T00:00:00.000Z",
  },
})

export async function getUser(email: string): Promise<StoredUser | undefined> {
  const normalizedEmail = email.toLowerCase().trim()

  // Try Supabase first
  if (isSupabaseConfigured() && supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('email', normalizedEmail)
        .single()

      if (data && !error) {
        return {
          passwordHash: data.password || '',
          user: {
            id: data.id,
            email: data.email,
            name: `${data.first_name || ''} ${data.last_name || ''}`.trim() || data.username,
            role: data.role as "user" | "admin",
            createdAt: data.created_at,
          }
        }
      }
    } catch {
      // Fall through to memory storage
    }
  }

  // Fallback to memory
  return usersMemory.get(normalizedEmail)
}

export async function userExists(email: string): Promise<boolean> {
  const normalizedEmail = email.toLowerCase().trim()

  // Try Supabase first
  if (isSupabaseConfigured() && supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('email', normalizedEmail)
        .single()

      if (data && !error) {
        return true
      }
    } catch {
      // Fall through to memory storage
    }
  }

  // Fallback to memory
  return usersMemory.has(normalizedEmail)
}

export async function createUser(
  email: string,
  passwordHash: string,
  userData: Omit<User, "id" | "createdAt">
): Promise<User> {
  const normalizedEmail = email.toLowerCase().trim()
  const userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  const createdAt = new Date().toISOString()

  // Try Supabase first
  if (isSupabaseConfigured() && supabaseAdmin) {
    try {
      const nameParts = (userData.name || '').split(' ')
      const firstName = nameParts[0] || ''
      const lastName = nameParts.slice(1).join(' ') || ''

      const { data, error } = await supabaseAdmin
        .from('users')
        .insert({
          id: userId,
          email: normalizedEmail,
          password: passwordHash,
          first_name: firstName,
          last_name: lastName,
          role: userData.role || 'user',
          created_at: createdAt,
        })
        .select()
        .single()

      if (data && !error) {
        return {
          id: data.id,
          email: data.email,
          name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
          role: data.role as "user" | "admin",
          createdAt: data.created_at,
        }
      }
    } catch {
      // Fall through to memory storage
    }
  }

  // Fallback to memory
  const newUser: User = {
    id: userId,
    email: normalizedEmail,
    name: userData.name,
    role: userData.role || "user",
    createdAt,
  }

  usersMemory.set(normalizedEmail, {
    passwordHash,
    user: newUser,
  })

  return newUser
}

export function getAllUsers(): Map<string, StoredUser> {
  return usersMemory
}

// Hash password using bcrypt (secure)
export async function hashPasswordSecure(password: string): Promise<string> {
  const rounds = parseInt(process.env.BCRYPT_ROUNDS || '12', 10)
  return bcrypt.hash(password, rounds)
}

// Verify password using bcrypt
export async function verifyPasswordSecure(password: string, hash: string): Promise<boolean> {
  // Handle both bcrypt and legacy SHA-256 hashes
  if (hash.startsWith('$2')) {
    // bcrypt hash
    return bcrypt.compare(password, hash)
  }

  // Legacy SHA-256 hash (for backward compatibility)
  const encoder = new TextEncoder()
  const data = encoder.encode(password + process.env.AUTH_SECRET)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const legacyHash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  return legacyHash === hash
}
