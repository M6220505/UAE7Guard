export type LogLevel = "debug" | "info" | "warn" | "error"

export interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  context?: string
  metadata?: Record<string, unknown>
  requestId?: string
  userId?: string
  ip?: string
  userAgent?: string
  duration?: number
  statusCode?: number
  method?: string
  path?: string
}

// Log level priorities
const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

// Get minimum log level from environment
function getMinLevel(): LogLevel {
  const envLevel = process.env.LOG_LEVEL?.toLowerCase() as LogLevel
  return LOG_LEVELS[envLevel] !== undefined ? envLevel : "info"
}

// Check if log level should be output
function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[getMinLevel()]
}

// Format log entry for output
function formatLogEntry(entry: LogEntry): string {
  const { timestamp, level, message, context, metadata, ...rest } = entry

  const baseLog = {
    timestamp,
    level: level.toUpperCase(),
    message,
    ...(context && { context }),
    ...rest,
    ...(metadata && Object.keys(metadata).length > 0 && { metadata }),
  }

  if (process.env.NODE_ENV === "production") {
    return JSON.stringify(baseLog)
  }

  // Pretty print in development
  const color = {
    debug: "\x1b[36m", // Cyan
    info: "\x1b[32m", // Green
    warn: "\x1b[33m", // Yellow
    error: "\x1b[31m", // Red
  }[level]
  const reset = "\x1b[0m"

  return `${color}[${level.toUpperCase()}]${reset} ${timestamp} - ${message}${
    context ? ` [${context}]` : ""
  }${metadata ? ` ${JSON.stringify(metadata)}` : ""}`
}

// Create log entry
function createLogEntry(
  level: LogLevel,
  message: string,
  context?: string,
  metadata?: Record<string, unknown>
): LogEntry {
  return {
    timestamp: new Date().toISOString(),
    level,
    message,
    context,
    metadata,
  }
}

// Log output function
function log(entry: LogEntry): void {
  if (!shouldLog(entry.level)) return

  const formattedLog = formatLogEntry(entry)

  switch (entry.level) {
    case "error":
      console.error(formattedLog)
      break
    case "warn":
      console.warn(formattedLog)
      break
    default:
      console.log(formattedLog)
  }
}

// Logger class for contextualized logging
export class Logger {
  private context: string

  constructor(context: string) {
    this.context = context
  }

  debug(message: string, metadata?: Record<string, unknown>): void {
    log(createLogEntry("debug", message, this.context, metadata))
  }

  info(message: string, metadata?: Record<string, unknown>): void {
    log(createLogEntry("info", message, this.context, metadata))
  }

  warn(message: string, metadata?: Record<string, unknown>): void {
    log(createLogEntry("warn", message, this.context, metadata))
  }

  error(message: string, metadata?: Record<string, unknown>): void {
    log(createLogEntry("error", message, this.context, metadata))
  }

  // Log HTTP request
  request(req: {
    method: string
    path: string
    statusCode: number
    duration: number
    ip?: string
    userAgent?: string
    userId?: string
  }): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: req.statusCode >= 400 ? "error" : "info",
      message: `${req.method} ${req.path} ${req.statusCode} ${req.duration}ms`,
      context: this.context,
      ...req,
    }
    log(entry)
  }
}

// Default logger
export const logger = new Logger("app")

// Create contextual logger
export function createLogger(context: string): Logger {
  return new Logger(context)
}

// Request logging middleware helper
export function logRequest(
  startTime: number,
  method: string,
  path: string,
  statusCode: number,
  ip?: string,
  userAgent?: string
): void {
  const duration = Date.now() - startTime
  logger.request({ method, path, statusCode, duration, ip, userAgent })
}
