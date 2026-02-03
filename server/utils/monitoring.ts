/**
 * Monitoring and Metrics Utility
 *
 * Provides application monitoring, metrics collection, and alerting
 */

import { logger } from './logger';
import config from '../config';

interface Metric {
  name: string;
  value: number;
  timestamp: number;
  tags?: Record<string, string>;
}

interface Alert {
  level: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  timestamp: number;
  details?: any;
}

class MonitoringService {
  private metrics: Metric[] = [];
  private alerts: Alert[] = [];
  private maxMetricsStored = 1000;
  private maxAlertsStored = 100;

  // Performance counters
  private counters: Map<string, number> = new Map();
  private timers: Map<string, number> = new Map();

  constructor() {
    // Start periodic metrics collection
    setInterval(() => this.collectSystemMetrics(), 60000); // Every minute
  }

  /**
   * Record a metric
   */
  recordMetric(name: string, value: number, tags?: Record<string, string>): void {
    const metric: Metric = {
      name,
      value,
      timestamp: Date.now(),
      tags,
    };

    this.metrics.push(metric);

    // Keep only recent metrics
    if (this.metrics.length > this.maxMetricsStored) {
      this.metrics.shift();
    }

    logger.debug('Metric recorded', { name, value, tags });
  }

  /**
   * Increment a counter
   */
  increment(name: string, value: number = 1): void {
    const current = this.counters.get(name) || 0;
    this.counters.set(name, current + value);
  }

  /**
   * Get counter value
   */
  getCounter(name: string): number {
    return this.counters.get(name) || 0;
  }

  /**
   * Reset counter
   */
  resetCounter(name: string): void {
    this.counters.set(name, 0);
  }

  /**
   * Start a timer
   */
  startTimer(name: string): void {
    this.timers.set(name, Date.now());
  }

  /**
   * End a timer and record duration
   */
  endTimer(name: string, tags?: Record<string, string>): number {
    const start = this.timers.get(name);

    if (!start) {
      logger.warn('Timer not found', { name });
      return 0;
    }

    const duration = Date.now() - start;
    this.recordMetric(`${name}.duration`, duration, tags);
    this.timers.delete(name);

    return duration;
  }

  /**
   * Time a function execution
   */
  async timeFunction<T>(
    name: string,
    fn: () => Promise<T>,
    tags?: Record<string, string>
  ): Promise<T> {
    const start = Date.now();

    try {
      const result = await fn();
      const duration = Date.now() - start;
      this.recordMetric(`${name}.duration`, duration, { ...tags, status: 'success' });
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      this.recordMetric(`${name}.duration`, duration, { ...tags, status: 'error' });
      throw error;
    }
  }

  /**
   * Record an alert
   */
  recordAlert(level: Alert['level'], message: string, details?: any): void {
    const alert: Alert = {
      level,
      message,
      timestamp: Date.now(),
      details,
    };

    this.alerts.push(alert);

    // Keep only recent alerts
    if (this.alerts.length > this.maxAlertsStored) {
      this.alerts.shift();
    }

    // Log alert
    if (level === 'critical' || level === 'error') {
      logger.error(message, undefined, details);
    } else if (level === 'warning') {
      logger.warn(message, details);
    } else {
      logger.info(message, details);
    }
  }

  /**
   * Get all metrics
   */
  getMetrics(since?: number): Metric[] {
    if (since) {
      return this.metrics.filter(m => m.timestamp >= since);
    }
    return [...this.metrics];
  }

  /**
   * Get metrics by name
   */
  getMetricsByName(name: string, since?: number): Metric[] {
    let filtered = this.metrics.filter(m => m.name === name);

    if (since) {
      filtered = filtered.filter(m => m.timestamp >= since);
    }

    return filtered;
  }

  /**
   * Get all alerts
   */
  getAlerts(level?: Alert['level']): Alert[] {
    if (level) {
      return this.alerts.filter(a => a.level === level);
    }
    return [...this.alerts];
  }

  /**
   * Get recent alerts
   */
  getRecentAlerts(minutes: number = 60): Alert[] {
    const since = Date.now() - minutes * 60 * 1000;
    return this.alerts.filter(a => a.timestamp >= since);
  }

  /**
   * Collect system metrics
   */
  private collectSystemMetrics(): void {
    // Memory metrics
    const memory = process.memoryUsage();
    this.recordMetric('system.memory.heap_used', memory.heapUsed);
    this.recordMetric('system.memory.heap_total', memory.heapTotal);
    this.recordMetric('system.memory.rss', memory.rss);

    // CPU metrics
    const cpu = process.cpuUsage();
    this.recordMetric('system.cpu.user', cpu.user);
    this.recordMetric('system.cpu.system', cpu.system);

    // Uptime
    this.recordMetric('system.uptime', process.uptime());

    // Check for memory warnings
    const heapPercentage = (memory.heapUsed / memory.heapTotal) * 100;
    if (heapPercentage > 90) {
      this.recordAlert('critical', 'Memory usage critical', {
        heapPercentage: heapPercentage.toFixed(2),
      });
    } else if (heapPercentage > 75) {
      this.recordAlert('warning', 'Memory usage high', {
        heapPercentage: heapPercentage.toFixed(2),
      });
    }
  }

  /**
   * Get monitoring summary
   */
  getSummary(): {
    metrics: { total: number; recent: number };
    alerts: { total: number; recent: number; byLevel: Record<string, number> };
    counters: Record<string, number>;
  } {
    const oneHourAgo = Date.now() - 60 * 60 * 1000;

    const recentMetrics = this.metrics.filter(m => m.timestamp >= oneHourAgo);
    const recentAlerts = this.alerts.filter(a => a.timestamp >= oneHourAgo);

    const alertsByLevel: Record<string, number> = {
      info: 0,
      warning: 0,
      error: 0,
      critical: 0,
    };

    for (const alert of this.alerts) {
      alertsByLevel[alert.level]++;
    }

    return {
      metrics: {
        total: this.metrics.length,
        recent: recentMetrics.length,
      },
      alerts: {
        total: this.alerts.length,
        recent: recentAlerts.length,
        byLevel: alertsByLevel,
      },
      counters: Object.fromEntries(this.counters),
    };
  }

  /**
   * Clear all metrics and alerts
   */
  clear(): void {
    this.metrics = [];
    this.alerts = [];
    this.counters.clear();
    this.timers.clear();
    logger.info('Monitoring data cleared');
  }
}

// Export singleton instance
export const monitoring = new MonitoringService();

/**
 * Express middleware for monitoring requests
 */
export function monitoringMiddleware(req: any, res: any, next: any): void {
  const start = Date.now();

  monitoring.increment('http.requests.total');
  monitoring.increment(`http.requests.${req.method.toLowerCase()}`);

  res.on('finish', () => {
    const duration = Date.now() - start;

    // Record request duration
    monitoring.recordMetric('http.request.duration', duration, {
      method: req.method,
      path: req.path,
      status: res.statusCode.toString(),
    });

    // Increment status code counters
    monitoring.increment(`http.responses.${res.statusCode}`);

    // Alert on errors
    if (res.statusCode >= 500) {
      monitoring.recordAlert('error', `HTTP ${res.statusCode} error`, {
        method: req.method,
        path: req.path,
        duration,
      });
    }

    // Alert on slow requests
    if (duration > 5000) {
      monitoring.recordAlert('warning', 'Slow request detected', {
        method: req.method,
        path: req.path,
        duration,
      });
    }
  });

  next();
}

export default monitoring;
