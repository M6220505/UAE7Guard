import { NextResponse } from "next/server"
import { createSession, verifyPassword, type User } from "@/lib/auth"
import { createLogger } from "@/lib/logger"

const logger = createLogger("auth")

// Apple Review Demo Account (for TestFlight & App Store Review)
const APPLE_REVIEW_EMAIL = "applereview@uae7guard.com"
const APPLE_REVIEW_PASSWORD = process.env.APPLE_REVIEW_PASSWORD || "AppleReview2026"

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

    // Apple Review Demo Account Bypass (for TestFlight & App Store Review)
    // This account works without database lookup for Apple review testing
    if (email.toLowerCase() === APPLE_REVIEW_EMAIL && password === APPLE_REVIEW_PASSWORD) {
      logger.info("Apple Review demo login successful")

      const appleReviewUser: User = {
        id: "demo-apple-review",
        email: APPLE_REVIEW_EMAIL,
        name: "Apple Reviewer",
        role: "user",
        createdAt: new Date().toISOString(),
      }

      const session = await createSession(appleReviewUser)

      return NextResponse.json({
        success: true,
        user: session.user,
      })
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
