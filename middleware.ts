import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Security headers
const securityHeaders = {
  "X-DNS-Prefetch-Control": "on",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "X-XSS-Protection": "1; mode=block",
  "X-Frame-Options": "SAMEORIGIN",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
}

// Simple in-memory rate limiting
const rateLimit = new Map<string, { count: number; reset: number }>()

function checkRateLimit(ip: string, limit: number = 100, windowMs: number = 60000): boolean {
  const now = Date.now()
  const record = rateLimit.get(ip)

  if (!record || now > record.reset) {
    rateLimit.set(ip, { count: 1, reset: now + windowMs })
    return true
  }

  if (record.count >= limit) {
    return false
  }

  record.count++
  return true
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get client IP
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1"

  // Check rate limit for API routes
  if (pathname.startsWith("/api")) {
    const limit = pathname.includes("/auth") ? 10 : 100

    if (!checkRateLimit(ip, limit)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 })
    }
  }

  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGINS || "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400",
      },
    })
  }

  // Create response
  const response = NextResponse.next()

  // Apply security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  // Add CORS headers for API routes
  if (pathname.startsWith("/api")) {
    response.headers.set("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGINS || "*")
    response.headers.set("Access-Control-Allow-Credentials", "true")
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
