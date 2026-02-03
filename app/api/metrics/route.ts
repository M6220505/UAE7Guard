import { NextResponse } from "next/server"
import { metrics, errorTracker } from "@/lib/monitoring"
import { cache } from "@/lib/cache"
import { getCurrentUser } from "@/lib/auth"

export async function GET() {
  try {
    // Optionally require admin role
    const user = await getCurrentUser()
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      metrics: metrics.getMetrics(),
      gauges: metrics.getGauges(),
      cache: cache.getStats(),
      errors: errorTracker.getErrors().slice(0, 10), // Last 10 errors
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
