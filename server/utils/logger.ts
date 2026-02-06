/**
 * Advanced Logger Utility
 *
 * Provides structured logging with multiple levels and formats
 */

import config from '../config';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

const LOG_LEVELS: Record<string, LogLevel> = {
  debug: LogLevel.DEBUG,
  info: LogLevel.INFO,
  warn: LogLevel.WARN,
  error: LogLevel.ERROR,
};

class Logger {
  private level: LogLevel;
  private format: 'json' | 'simple';

  constructor() {
    this.level = LOG_LEVELS[config.logging.level] || LogLevel.INFO;
    this.format = config.logging.format === 'json' ? 'json' : 'simple';
  }

  /**
   * Format log entry
   */
  private formatLog(level: string, message: string, meta?: any): string {
    const timestamp = new Date().toISOString();

    if (this.format === 'json') {
      return JSON.stringify({
        timestamp,
        level,
        message,
        ...meta,
        environment: config.env,
      });
    }

    const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
    return `${timestamp} [${level.toUpperCase()}] ${message}${metaStr}`;
  }

  /**
   * Log debug message
   */
  debug(message: string, meta?: any): void {
    if (this.level <= LogLevel.DEBUG) {
      console.log(this.formatLog('debug', message, meta));
    }
  }

  /**
   * Log info message
   */
  info(message: string, meta?: any): void {
    if (this.level <= LogLevel.INFO) {
      console.log(this.formatLog('info', message, meta));
    }
  }

  /**
   * Log warning message
   */
  warn(message: string, meta?: any): void {
    if (this.level <= LogLevel.WARN) {
      console.warn(this.formatLog('warn', message, meta));
    }
  }

  /**
   * Log error message
   */
  error(message: string, error?: Error | any, meta?: any): void {
    if (this.level <= LogLevel.ERROR) {
      const errorInfo = error instanceof Error ? {
        error: error.message,
        stack: error.stack,
        ...meta,
      } : { error, ...meta };

      console.error(this.formatLog('error', message, errorInfo));
    }
  }

  /**
   * Log HTTP request
   */
  logRequest(method: string, path: string, statusCode: number, duration: number, meta?: any): void {
    const level = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';

    const logData = {
      method,
      path,
      statusCode,
      duration: `${duration}ms`,
      ...meta,
    };

    if (level === 'error') {
      this.error(`${method} ${path} ${statusCode}`, undefined, logData);
    } else if (level === 'warn') {
      this.warn(`${method} ${path} ${statusCode}`, logData);
    } else {
      this.info(`${method} ${path} ${statusCode}`, logData);
    }
  }

  /**
   * Log database query
   */
  logQuery(query: string, duration: number, params?: any): void {
    if (config.development.debug) {
      this.debug('Database query', {
        query,
        duration: `${duration}ms`,
        params,
      });
    }
  }

  /**
   * Log security event
   */
  logSecurity(event: string, severity: 'low' | 'medium' | 'high' | 'critical', meta?: any): void {
    const level = severity === 'critical' || severity === 'high' ? 'error' : 'warn';

    const logData = {
      securityEvent: event,
      severity,
      ...meta,
    };

    if (level === 'error') {
      this.error(`Security Event: ${event}`, undefined, logData);
    } else {
      this.warn(`Security Event: ${event}`, logData);
    }
  }

  /**
   * Log performance metric
   */
  logPerformance(operation: string, duration: number, meta?: any): void {
    const level = duration > 5000 ? 'warn' : 'info';

    const logData = {
      operation,
      duration: `${duration}ms`,
      ...meta,
    };

    if (level === 'warn') {
      this.warn(`Slow operation: ${operation}`, logData);
    } else {
      this.info(`Performance: ${operation}`, logData);
    }
  }

  /**
   * Log external API call
   */
  logExternalApi(service: string, endpoint: string, statusCode: number, duration: number, meta?: any): void {
    const level = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';

    const logData = {
      service,
      endpoint,
      statusCode,
      duration: `${duration}ms`,
      ...meta,
    };

    if (level === 'error') {
      this.error(`External API error: ${service}`, undefined, logData);
    } else if (level === 'warn') {
      this.warn(`External API warning: ${service}`, logData);
    } else {
      this.info(`External API call: ${service}`, logData);
    }
  }
}

// Export singleton instance
export const logger = new Logger();

/**
 * Express middleware for request logging
 */
export function requestLogger(req: any, res: any, next: any): void {
  if (!config.logging.logRequests) {
    return next();
  }

  const start = Date.now();
  const path = req.path;
  const method = req.method;

  // Capture response
  res.on('finish', () => {
    const duration = Date.now() - start;

    // Skip health check logs in production
    if (path.startsWith('/api/health') && config.isProduction) {
      return;
    }

    logger.logRequest(method, path, res.statusCode, duration, {
      ip: (req as any).clientIp || req.ip,
      userAgent: req.headers['user-agent'],
      userId: req.user?.id,
    });
  });

  next();
}

/**
 * Express error logging middleware
 */
export function errorLogger(err: any, req: any, res: any, next: any): void {
  logger.error('Unhandled error', err, {
    method: req.method,
    path: req.path,
    ip: (req as any).clientIp || req.ip,
    userId: req.user?.id,
  });

  next(err);
}

export default logger;
