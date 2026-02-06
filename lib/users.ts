import type { User } from "./auth"

export interface StoredUser {
  passwordHash: string
  user: User
}

// Shared in-memory user storage (use database in production)
// This ensures login and signup share the same user data
const users = new Map<string, StoredUser>()

// Initialize with demo user
// Password hash for "admin" with AUTH_SECRET
users.set("demo@example.com", {
  passwordHash: "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918",
  user: {
    id: "1",
    email: "demo@example.com",
    name: "Demo User",
    role: "admin",
    createdAt: "2024-01-01T00:00:00.000Z",
  },
})

export function getUser(email: string): StoredUser | undefined {
  return users.get(email.toLowerCase().trim())
}

export function userExists(email: string): boolean {
  return users.has(email.toLowerCase().trim())
}

export function createUser(email: string, passwordHash: string, userData: Omit<User, "id" | "createdAt">): User {
  const normalizedEmail = email.toLowerCase().trim()

  const newUser: User = {
    id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    email: normalizedEmail,
    name: userData.name,
    role: userData.role || "user",
    createdAt: new Date().toISOString(),
  }

  users.set(normalizedEmail, {
    passwordHash,
    user: newUser,
  })

  return newUser
}

export function getAllUsers(): Map<string, StoredUser> {
  return users
}
