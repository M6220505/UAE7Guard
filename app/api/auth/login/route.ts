import { NextResponse } from "next/server"
import { createSession, verifyPassword, type User } from "@/lib/auth"
import { createLogger } from "@/lib/logger"

const logger = createLogger("auth")

// Demo users (replace with database in production)
const users: Record<string, { password: string; user: User }> = {
  "demo@example.com": {
    password: "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918", // admin
    user: {
      id: "1",
      email: "demo@example.com",
      name: "Demo User",
      role: "admin",
      createdAt: "2024-01-01T00:00:00.000Z",
    },
  },
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const userRecord = users[email.toLowerCase()]

    if (!userRecord) {
      logger.warn("Login attempt for unknown user", { email })
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const isValid = await verifyPassword(password, userRecord.password)

    if (!isValid) {
      logger.warn("Invalid password attempt", { email })
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const session = await createSession(userRecord.user)

    logger.info("User logged in", { userId: userRecord.user.id, email })

    return NextResponse.json({
      success: true,
      user: session.user,
    })
  } catch (error) {
    logger.error("Login error", { error: error instanceof Error ? error.message : "Unknown error" })
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
