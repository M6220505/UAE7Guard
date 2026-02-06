import { NextResponse } from "next/server"
import { createSession, hashPassword } from "@/lib/auth"
import { userExists, createUser } from "@/lib/users"
import { createLogger } from "@/lib/logger"

const logger = createLogger("auth")

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, firstName, lastName } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Check if user already exists
    if (userExists(normalizedEmail)) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      )
    }

    // Hash the password
    const passwordHash = await hashPassword(password)

    // Create the user name
    const userName = firstName && lastName
      ? `${firstName} ${lastName}`.trim()
      : firstName || email.split("@")[0]

    // Create and store the user
    const newUser = createUser(normalizedEmail, passwordHash, {
      email: normalizedEmail,
      name: userName,
      role: "user",
    })

    logger.info("New user registered", { userId: newUser.id, email: normalizedEmail })

    // Create session and log them in automatically
    const session = await createSession(newUser)

    return NextResponse.json({
      success: true,
      message: "Account created successfully",
      user: session.user,
    })
  } catch (error) {
    logger.error("Signup error", { error: error instanceof Error ? error.message : "Unknown error" })
    return NextResponse.json(
      { error: "Failed to create account. Please try again." },
      { status: 500 }
    )
  }
}
