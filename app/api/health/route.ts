import { NextResponse } from "next/server"
import { getSystemHealth, getLiveness, getReadiness } from "@/lib/healthCheck"

// GET /api/health - Full health check
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type")

  try {
    switch (type) {
      case "live":
      case "liveness":
        return NextResponse.json(getLiveness())

      case "ready":
      case "readiness":
        const readiness = await getReadiness()
        return NextResponse.json(readiness, {
          status: readiness.status === "ready" ? 200 : 503,
        })

      default:
        const health = await getSystemHealth()
        return NextResponse.json(health, {
          status: health.status === "unhealthy" ? 503 : 200,
        })
    }
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        error: error instanceof Error ? error.message : "Health check failed",
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    )
  }
}
