import { createLogger } from "./logger"

const logger = createLogger("monitoring")

// Metrics storage
interface MetricData {
  count: number
  sum: number
  min: number
  max: number
  values: number[]
  timestamps: number[]
}

class MetricsCollector {
  private metrics = new Map<string, MetricData>()
  private gauges = new Map<string, number>()
  private readonly maxSamples = 1000

  // Increment a counter
  increment(name: string, value: number = 1, tags?: Record<string, string>): void {
    const key = this.buildKey(name, tags)
    const metric = this.getOrCreateMetric(key)
    metric.count += value
  }

  // Record a value (histogram/timing)
  record(name: string, value: number, tags?: Record<string, string>): void {
    const key = this.buildKey(name, tags)
    const metric = this.getOrCreateMetric(key)

    metric.count++
    metric.sum += value
    metric.min = Math.min(metric.min, value)
    metric.max = Math.max(metric.max, value)

    // Keep limited samples for percentile calculation
    if (metric.values.length >= this.maxSamples) {
      metric.values.shift()
      metric.timestamps.shift()
    }
    metric.values.push(value)
    metric.timestamps.push(Date.now())
  }

  // Set a gauge value
  gauge(name: string, value: number, tags?: Record<string, string>): void {
    const key = this.buildKey(name, tags)
    this.gauges.set(key, value)
  }

  // Time a function execution
  async time<T>(name: string, fn: () => Promise<T>, tags?: Record<string, string>): Promise<T> {
    const start = Date.now()
    try {
      const result = await fn()
      this.record(name, Date.now() - start, { ...tags, status: "success" })
      return result
    } catch (error) {
      this.record(name, Date.now() - start, { ...tags, status: "error" })
      throw error
    }
  }

  // Get metrics summary
  getMetrics(): Record<
    string,
    {
      count: number
      sum: number
      avg: number
      min: number
      max: number
      p50: number
      p95: number
      p99: number
    }
  > {
    const result: Record<string, ReturnType<typeof this.calculateStats>> = {}

    for (const [key, metric] of this.metrics.entries()) {
      result[key] = this.calculateStats(metric)
    }

    return result
  }

  // Get gauge values
  getGauges(): Record<string, number> {
    return Object.fromEntries(this.gauges)
  }

  // Reset all metrics
  reset(): void {
    this.metrics.clear()
    this.gauges.clear()
  }

  private buildKey(name: string, tags?: Record<string, string>): string {
    if (!tags || Object.keys(tags).length === 0) return name
    const tagStr = Object.entries(tags)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join(",")
    return `${name}{${tagStr}}`
  }

  private getOrCreateMetric(key: string): MetricData {
    if (!this.metrics.has(key)) {
      this.metrics.set(key, {
        count: 0,
        sum: 0,
        min: Infinity,
        max: -Infinity,
        values: [],
        timestamps: [],
      })
    }
    return this.metrics.get(key)!
  }

  private calculateStats(metric: MetricData) {
    const sorted = [...metric.values].sort((a, b) => a - b)
    return {
      count: metric.count,
      sum: metric.sum,
      avg: metric.count > 0 ? metric.sum / metric.count : 0,
      min: metric.min === Infinity ? 0 : metric.min,
      max: metric.max === -Infinity ? 0 : metric.max,
      p50: this.percentile(sorted, 50),
      p95: this.percentile(sorted, 95),
      p99: this.percentile(sorted, 99),
    }
  }

  private percentile(sorted: number[], p: number): number {
    if (sorted.length === 0) return 0
    const index = Math.ceil((p / 100) * sorted.length) - 1
    return sorted[Math.max(0, index)]
  }
}

// Global metrics instance
export const metrics = new MetricsCollector()

// Error tracking
interface ErrorRecord {
  message: string
  stack?: string
  count: number
  firstSeen: number
  lastSeen: number
  context?: Record<string, unknown>
}

class ErrorTracker {
  private errors = new Map<string, ErrorRecord>()
  private readonly maxErrors = 100

  track(error: Error, context?: Record<string, unknown>): void {
    const key = `${error.name}:${error.message}`

    logger.error(error.message, {
      name: error.name,
      stack: error.stack,
      ...context,
    })

    const existing = this.errors.get(key)
    if (existing) {
      existing.count++
      existing.lastSeen = Date.now()
    } else {
      // Enforce max errors
      if (this.errors.size >= this.maxErrors) {
        const oldest = [...this.errors.entries()].sort((a, b) => a[1].lastSeen - b[1].lastSeen)[0]
        if (oldest) this.errors.delete(oldest[0])
      }

      this.errors.set(key, {
        message: error.message,
        stack: error.stack,
        count: 1,
        firstSeen: Date.now(),
        lastSeen: Date.now(),
        context,
      })
    }

    metrics.increment("errors_total", 1, { type: error.name })
  }

  getErrors(): ErrorRecord[] {
    return [...this.errors.values()].sort((a, b) => b.lastSeen - a.lastSeen)
  }

  clear(): void {
    this.errors.clear()
  }
}

// Global error tracker
export const errorTracker = new ErrorTracker()

// Request metrics helper
export function trackRequest(method: string, path: string, statusCode: number, duration: number): void {
  metrics.increment("http_requests_total", 1, { method, path, status: String(statusCode) })
  metrics.record("http_request_duration_ms", duration, { method, path })

  if (statusCode >= 400) {
    metrics.increment("http_errors_total", 1, {
      method,
      path,
      status: String(statusCode),
    })
  }
}

// Performance observer for web vitals (client-side)
export function reportWebVitals(metric: { name: string; value: number; id: string }): void {
  metrics.record(`web_vitals_${metric.name.toLowerCase()}`, metric.value)
  logger.info(`Web Vital: ${metric.name}`, { value: metric.value, id: metric.id })
}
