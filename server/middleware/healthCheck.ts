/**
 * Health Check Middleware
 *
 * Provides comprehensive health check endpoints for monitoring
 */

import { Request, Response } from 'express';
import { db } from '../db';
import config from '../config';
import { sql } from 'drizzle-orm';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
  checks: {
    database: CheckResult;
    memory: CheckResult;
    disk?: CheckResult;
  };
}

interface CheckResult {
  status: 'pass' | 'warn' | 'fail';
  message?: string;
  responseTime?: number;
  details?: any;
}

/**
 * Basic health check - lightweight, no dependencies
 */
export async function healthCheck(req: Request, res: Response): Promise<void> {
  res.status(200).json({
    status: 'ok',
    service: 'UAE7Guard API',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.env,
  });
}

/**
 * Detailed health check - includes all dependencies
 */
export async function detailedHealthCheck(req: Request, res: Response): Promise<void> {
  const startTime = Date.now();
  const checks: HealthStatus['checks'] = {
    database: await checkDatabase(),
    memory: checkMemory(),
  };

  // Determine overall status
  let overallStatus: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

  if (checks.database.status === 'fail') {
    overallStatus = 'unhealthy';
  } else if (checks.database.status === 'warn' || checks.memory.status === 'warn') {
    overallStatus = 'degraded';
  }

  const response: HealthStatus = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
    environment: config.env,
    checks,
  };

  const statusCode = overallStatus === 'unhealthy' ? 503 : overallStatus === 'degraded' ? 200 : 200;

  res.status(statusCode).json(response);
}

/**
 * Readiness check - determines if app is ready to receive traffic
 */
export async function readinessCheck(req: Request, res: Response): Promise<void> {
  try {
    // Check database connection
    const dbCheck = await checkDatabase();

    if (dbCheck.status === 'fail') {
      res.status(503).json({
        ready: false,
        reason: 'Database not available',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Check if in maintenance mode
    if (config.maintenance.enabled) {
      res.status(503).json({
        ready: false,
        reason: 'Maintenance mode enabled',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    res.status(200).json({
      ready: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      ready: false,
      reason: 'Health check failed',
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Liveness check - determines if app is alive
 */
export async function livenessCheck(req: Request, res: Response): Promise<void> {
  res.status(200).json({
    alive: true,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
}

/**
 * Check database connectivity and performance
 */
async function checkDatabase(): Promise<CheckResult> {
  const start = Date.now();

  try {
    // Simple query to check database connection
    await db.execute(sql`SELECT 1`);

    const responseTime = Date.now() - start;

    if (responseTime > 1000) {
      return {
        status: 'warn',
        message: 'Database response time is slow',
        responseTime,
      };
    }

    return {
      status: 'pass',
      message: 'Database is healthy',
      responseTime,
    };
  } catch (error: any) {
    return {
      status: 'fail',
      message: 'Database connection failed',
      details: error.message,
    };
  }
}

/**
 * Check memory usage
 */
function checkMemory(): CheckResult {
  const usage = process.memoryUsage();
  const heapUsedMB = Math.round(usage.heapUsed / 1024 / 1024);
  const heapTotalMB = Math.round(usage.heapTotal / 1024 / 1024);
  const rssMB = Math.round(usage.rss / 1024 / 1024);

  const heapPercentage = (usage.heapUsed / usage.heapTotal) * 100;

  if (heapPercentage > 90) {
    return {
      status: 'fail',
      message: 'Memory usage critical',
      details: {
        heapUsedMB,
        heapTotalMB,
        rssMB,
        heapPercentage: `${heapPercentage.toFixed(2)}%`,
      },
    };
  }

  if (heapPercentage > 75) {
    return {
      status: 'warn',
      message: 'Memory usage high',
      details: {
        heapUsedMB,
        heapTotalMB,
        rssMB,
        heapPercentage: `${heapPercentage.toFixed(2)}%`,
      },
    };
  }

  return {
    status: 'pass',
    message: 'Memory usage normal',
    details: {
      heapUsedMB,
      heapTotalMB,
      rssMB,
      heapPercentage: `${heapPercentage.toFixed(2)}%`,
    },
  };
}

/**
 * Get system metrics
 */
export async function getMetrics(req: Request, res: Response): Promise<void> {
  const usage = process.memoryUsage();

  const metrics = {
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: {
      heapUsed: usage.heapUsed,
      heapTotal: usage.heapTotal,
      rss: usage.rss,
      external: usage.external,
    },
    cpu: process.cpuUsage(),
    environment: config.env,
    nodeVersion: process.version,
    platform: process.platform,
  };

  res.status(200).json(metrics);
}
