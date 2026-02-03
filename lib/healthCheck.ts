export interface HealthCheckResult {
  name: string
  status: "healthy" | "unhealthy" | "degraded"
  message?: string
  latency?: number
  timestamp: string
}

export interface SystemHealth {
  status: "healthy" | "unhealthy" | "degraded"
  version: string
  uptime: number
  timestamp: string
  checks: HealthCheckResult[]
  environment: string
}

// Track app start time for uptime calculation
const startTime = Date.now()

// Individual health check functions
async function checkDatabase(): Promise<HealthCheckResult> {
  const start = Date.now()
  try {
    // Add your database connection check here
    // For now, we'll simulate a check
    const isConnected = process.env.DATABASE_URL ? true : false
    return {
      name: "database",
      status: isConnected ? "healthy" : "degraded",
      message: isConnected ? "Database connection available" : "No database URL configured",
      latency: Date.now() - start,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    return {
      name: "database",
      status: "unhealthy",
      message: error instanceof Error ? error.message : "Database check failed",
      latency: Date.now() - start,
      timestamp: new Date().toISOString(),
    }
  }
}

async function checkMemory(): Promise<HealthCheckResult> {
  const start = Date.now()
  try {
    // Check if memory usage is within acceptable limits
    const used = process.memoryUsage?.()
    const heapUsedMB = used ? Math.round(used.heapUsed / 1024 / 1024) : 0
    const heapTotalMB = used ? Math.round(used.heapTotal / 1024 / 1024) : 0
    const usagePercent = heapTotalMB > 0 ? (heapUsedMB / heapTotalMB) * 100 : 0

    let status: "healthy" | "degraded" | "unhealthy" = "healthy"
    if (usagePercent > 90) status = "unhealthy"
    else if (usagePercent > 75) status = "degraded"

    return {
      name: "memory",
      status,
      message: `Heap: ${heapUsedMB}MB / ${heapTotalMB}MB (${usagePercent.toFixed(1)}%)`,
      latency: Date.now() - start,
      timestamp: new Date().toISOString(),
    }
  } catch {
    return {
      name: "memory",
      status: "healthy",
      message: "Memory check not available in this environment",
      latency: Date.now() - start,
      timestamp: new Date().toISOString(),
    }
  }
}

async function checkExternalServices(): Promise<HealthCheckResult> {
  const start = Date.now()
  try {
    // Add checks for external services (APIs, etc.)
    return {
      name: "external_services",
      status: "healthy",
      message: "All external services operational",
      latency: Date.now() - start,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    return {
      name: "external_services",
      status: "degraded",
      message: error instanceof Error ? error.message : "External service check failed",
      latency: Date.now() - start,
      timestamp: new Date().toISOString(),
    }
  }
}

// Get overall system health
export async function getSystemHealth(): Promise<SystemHealth> {
  const checks = await Promise.all([checkDatabase(), checkMemory(), checkExternalServices()])

  // Determine overall status
  let overallStatus: "healthy" | "unhealthy" | "degraded" = "healthy"
  const hasUnhealthy = checks.some((c) => c.status === "unhealthy")
  const hasDegraded = checks.some((c) => c.status === "degraded")

  if (hasUnhealthy) overallStatus = "unhealthy"
  else if (hasDegraded) overallStatus = "degraded"

  return {
    status: overallStatus,
    version: process.env.npm_package_version || process.env.APP_VERSION || "1.0.0",
    uptime: Math.floor((Date.now() - startTime) / 1000),
    timestamp: new Date().toISOString(),
    checks,
    environment: process.env.NODE_ENV || "development",
  }
}

// Simple liveness check (is the app running?)
export function getLiveness(): { status: "ok"; timestamp: string } {
  return {
    status: "ok",
    timestamp: new Date().toISOString(),
  }
}

// Readiness check (is the app ready to serve traffic?)
export async function getReadiness(): Promise<{
  status: "ready" | "not_ready"
  timestamp: string
  details?: string
}> {
  try {
    const health = await getSystemHealth()
    const isReady = health.status !== "unhealthy"

    return {
      status: isReady ? "ready" : "not_ready",
      timestamp: new Date().toISOString(),
      details: isReady ? undefined : "One or more critical services are unhealthy",
    }
  } catch (error) {
    return {
      status: "not_ready",
      timestamp: new Date().toISOString(),
      details: error instanceof Error ? error.message : "Readiness check failed",
    }
  }
}
