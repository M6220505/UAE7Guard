import { NextResponse } from "next/server"
import { destroySession, getCurrentUser } from "@/lib/auth"
import { createLogger } from "@/lib/logger"

const logger = createLogger("auth")

export async function POST() {
  try {
    const user = await getCurrentUser()

    await destroySession()

    if (user) {
      logger.info("User logged out", { userId: user.id, email: user.email })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error("Logout error", { error: error instanceof Error ? error.message : "Unknown error" })
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
