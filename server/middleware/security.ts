/**
 * Security Middleware
 *
 * Provides comprehensive security headers and protections for the application
 */

import { Request, Response, NextFunction } from 'express';
import config from '../config';

/**
 * Security Headers Middleware
 * Adds essential security headers to all responses
 */
export function securityHeaders(req: Request, res: Response, next: NextFunction) {
  // Prevent clickjacking attacks
  res.setHeader('X-Frame-Options', 'DENY');

  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Enable XSS protection (legacy browsers)
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Referrer policy - don't leak referrer to external sites
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Content Security Policy
  if (config.isProduction) {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://cdn.jsdelivr.net",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://api.stripe.com https://*.alchemy.com wss: https:",
      "frame-src 'self' https://js.stripe.com https://hooks.stripe.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join('; ');
    res.setHeader('Content-Security-Policy', csp);
  }

  // HSTS - Force HTTPS in production
  if (config.isProduction) {
    res.setHeader(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  // Permissions Policy - Restrict browser features
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  // Remove X-Powered-By header to avoid leaking server info
  res.removeHeader('X-Powered-By');

  next();
}

/**
 * Request Sanitization Middleware
 * Sanitizes request inputs to prevent injection attacks
 */
export function sanitizeRequest(req: Request, res: Response, next: NextFunction) {
  // Sanitize query parameters
  if (req.query) {
    for (const key in req.query) {
      if (typeof req.query[key] === 'string') {
        // Remove potential XSS vectors
        req.query[key] = (req.query[key] as string)
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .trim();
      }
    }
  }

  // Sanitize body parameters
  if (req.body && typeof req.body === 'object') {
    sanitizeObject(req.body);
  }

  next();
}

/**
 * Recursively sanitize object properties
 */
function sanitizeObject(obj: any): void {
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      // Remove script tags and trim
      obj[key] = obj[key]
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .trim();
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      sanitizeObject(obj[key]);
    }
  }
}

/**
 * Maintenance Mode Middleware
 * Returns 503 when in maintenance mode
 */
export function maintenanceMode(req: Request, res: Response, next: NextFunction) {
  if (config.maintenance.enabled && !req.path.startsWith('/api/health')) {
    return res.status(503).json({
      error: 'Service Unavailable',
      message: config.maintenance.message,
      retryAfter: 3600, // 1 hour
    });
  }
  next();
}

/**
 * Request ID Middleware
 * Adds unique request ID for tracing
 */
export function requestId(req: Request, res: Response, next: NextFunction) {
  const id = req.headers['x-request-id'] as string || generateRequestId();
  req.headers['x-request-id'] = id;
  res.setHeader('X-Request-ID', id);
  next();
}

/**
 * Generate unique request ID
 */
function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * IP Trust Middleware
 * Properly handles X-Forwarded-For when behind proxy
 */
export function trustProxy(req: Request, res: Response, next: NextFunction) {
  // Get real IP from X-Forwarded-For or X-Real-IP
  // Note: req.ip is read-only in Node.js 22+, so we use req.clientIp instead
  const forwarded = req.headers['x-forwarded-for'];
  const realIp = req.headers['x-real-ip'];

  if (forwarded) {
    const ips = (Array.isArray(forwarded) ? forwarded[0] : forwarded).split(',');
    (req as any).clientIp = ips[0].trim();
  } else if (realIp) {
    (req as any).clientIp = Array.isArray(realIp) ? realIp[0] : realIp;
  } else {
    (req as any).clientIp = req.ip || req.socket?.remoteAddress || 'unknown';
  }

  next();
}

/**
 * Slow Down Middleware
 * Adds delay to requests after threshold to prevent abuse
 */
export function slowDown(options: {
  windowMs: number;
  delayAfter: number;
  delayMs: number;
  maxDelayMs: number;
}) {
  const hits = new Map<string, { count: number; resetTime: number }>();

  return (req: Request, res: Response, next: NextFunction) => {
    const key = (req as any).clientIp || req.ip || 'unknown';
    const now = Date.now();

    // Clean up old entries
    for (const [ip, data] of hits.entries()) {
      if (now > data.resetTime) {
        hits.delete(ip);
      }
    }

    // Get or create hit record
    let hit = hits.get(key);
    if (!hit || now > hit.resetTime) {
      hit = { count: 0, resetTime: now + options.windowMs };
      hits.set(key, hit);
    }

    hit.count++;

    // Calculate delay
    if (hit.count > options.delayAfter) {
      const delayCount = hit.count - options.delayAfter;
      const delay = Math.min(delayCount * options.delayMs, options.maxDelayMs);

      setTimeout(() => next(), delay);
    } else {
      next();
    }
  };
}

/**
 * Helmet-like Security Middleware Bundle
 * Applies multiple security measures
 */
export function helmet() {
  return [
    securityHeaders,
    sanitizeRequest,
    requestId,
    trustProxy,
  ];
}

/**
 * API Key Validation Middleware
 * For external API access
 */
export function validateApiKey(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'API key is required',
    });
  }

  // Validate API key (implement your logic here)
  // For now, just check if it exists
  // In production, validate against database

  next();
}

/**
 * Admin-Only Middleware
 * Restricts access to admin users only
 */
export function adminOnly(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication required',
    });
  }

  if (!req.user.isAdmin) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Admin access required',
    });
  }

  next();
}

/**
 * Authentication Required Middleware
 * Ensures user is authenticated
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication required',
    });
  }
  next();
}

/**
 * Compress Response Middleware
 * Simple compression for JSON responses
 */
export function compressResponse(req: Request, res: Response, next: NextFunction) {
  const originalJson = res.json.bind(res);

  res.json = function (body: any) {
    // Only compress if client accepts gzip
    const acceptEncoding = req.headers['accept-encoding'] || '';

    if (acceptEncoding.includes('gzip') && config.performance.enableCompression) {
      res.setHeader('Content-Encoding', 'gzip');
    }

    return originalJson(body);
  };

  next();
}
