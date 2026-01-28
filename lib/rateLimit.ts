import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// In-memory store for rate limiting (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Max requests per window
  message?: string // Custom error message
  keyGenerator?: (request: NextRequest) => string // Custom key generator
}

const defaultConfig: RateLimitConfig = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100, // 100 requests per minute
  message: "Too many requests, please try again later.",
}

// Get client identifier (IP address or custom key)
function getClientKey(request: NextRequest, keyGenerator?: (req: NextRequest) => string): string {
  if (keyGenerator) {
    return keyGenerator(request)
  }

  // Try to get real IP from various headers
  const forwarded = request.headers.get("x-forwarded-for")
  const realIp = request.headers.get("x-real-ip")
  const cfIp = request.headers.get("cf-connecting-ip")

  return cfIp || realIp || forwarded?.split(",")[0].trim() || "anonymous"
}

// Clean up expired entries periodically
function cleanupExpiredEntries(): void {
  const now = Date.now()
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}

// Run cleanup every minute
if (typeof setInterval !== "undefined") {
  setInterval(cleanupExpiredEntries, 60 * 1000)
}

// Rate limiter function
export function rateLimit(config: Partial<RateLimitConfig> = {}) {
  const { windowMs, maxRequests, message, keyGenerator } = { ...defaultConfig, ...config }

  return {
    check: (request: NextRequest): { success: boolean; remaining: number; reset: number } => {
      const key = getClientKey(request, keyGenerator)
      const now = Date.now()
      const record = rateLimitStore.get(key)

      if (!record || now > record.resetTime) {
        // First request or window expired
        rateLimitStore.set(key, { count: 1, resetTime: now + windowMs })
        return { success: true, remaining: maxRequests - 1, reset: now + windowMs }
      }

      if (record.count >= maxRequests) {
        // Rate limit exceeded
        return { success: false, remaining: 0, reset: record.resetTime }
      }

      // Increment count
      record.count++
      return { success: true, remaining: maxRequests - record.count, reset: record.resetTime }
    },

    getResponse: (request: NextRequest): NextResponse | null => {
      const result = rateLimit(config).check(request)

      if (!result.success) {
        return NextResponse.json(
          { error: message, retryAfter: Math.ceil((result.reset - Date.now()) / 1000) },
          {
            status: 429,
            headers: {
              "Retry-After": String(Math.ceil((result.reset - Date.now()) / 1000)),
              "X-RateLimit-Limit": String(maxRequests),
              "X-RateLimit-Remaining": "0",
              "X-RateLimit-Reset": String(result.reset),
            },
          }
        )
      }

      return null
    },
  }
}

// Pre-configured rate limiters for different use cases
export const apiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100,
  message: "API rate limit exceeded. Please try again later.",
})

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5,
  message: "Too many authentication attempts. Please try again later.",
})

export const strictRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10,
  message: "Rate limit exceeded. Please slow down.",
})
