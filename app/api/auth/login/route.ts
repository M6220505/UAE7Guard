import { NextResponse } from "next/server"
import { createSession, type User } from "@/lib/auth"
import { createLogger } from "@/lib/logger"

const logger = createLogger("auth")

// =============================================================================
// DEPRECATED: Authentication is now handled by Supabase Auth (client-side)
// This endpoint only exists for Apple Review demo account
// =============================================================================

// Apple Review Demo Account (for TestFlight & App Store Review)
const APPLE_REVIEW_EMAIL = "applereview@uae7guard.com"
const APPLE_REVIEW_PASSWORD = process.env.APPLE_REVIEW_PASSWORD || "AppleReview2026"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Apple Review Demo Account ONLY (for TestFlight & App Store Review)
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

    // All other login attempts: 410 Gone
    // Authentication is handled exclusively by Supabase Auth (client-side)
    logger.info("Login attempt rejected - use Supabase Auth", { email })
    return NextResponse.json(
      {
        error: "This endpoint is deprecated. Use Supabase Auth for authentication.",
        code: "AUTH_DEPRECATED"
      },
      { status: 410 }
    )
  } catch (error) {
    logger.error("Login error", { error: error instanceof Error ? error.message : "Unknown error" })
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
