/**
 * Rate Limiting Middleware
 *
 * Provides sophisticated rate limiting to protect against abuse and DDoS attacks
 */

import rateLimit from 'express-rate-limit';
import config from '../config';

/**
 * General API Rate Limiter
 * Applied to all API routes
 */
export const apiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    error: 'Too Many Requests',
    message: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.ceil(config.rateLimit.windowMs / 1000),
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  // Store in memory (consider Redis for production with multiple instances)
  // store: new RedisStore({ ... })
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too Many Requests',
      message: 'Too many requests from this IP, please try again later.',
      retryAfter: Math.ceil(config.rateLimit.windowMs / 1000),
    });
  },
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path.startsWith('/api/health');
  },
});

/**
 * Strict Rate Limiter for Authentication Endpoints
 * Prevents brute force attacks on login/register
 */
export const authLimiter = rateLimit({
  windowMs: config.rateLimit.auth.windowMs,
  max: config.rateLimit.auth.maxRequests,
  message: {
    error: 'Too Many Login Attempts',
    message: 'Too many authentication attempts from this IP, please try again later.',
    retryAfter: Math.ceil(config.rateLimit.auth.windowMs / 1000),
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful logins
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too Many Login Attempts',
      message: 'Too many authentication attempts. Please try again in 15 minutes.',
      retryAfter: Math.ceil(config.rateLimit.auth.windowMs / 1000),
    });
  },
});

/**
 * Password Reset Rate Limiter
 * Prevents password reset abuse
 */
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 requests per hour
  message: {
    error: 'Too Many Password Reset Requests',
    message: 'Too many password reset requests. Please try again later.',
    retryAfter: 3600,
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});

/**
 * Email Sending Rate Limiter
 * Prevents email spam
 */
export const emailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 emails per hour
  message: {
    error: 'Too Many Email Requests',
    message: 'Too many email requests. Please try again later.',
    retryAfter: 3600,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * File Upload Rate Limiter
 * Prevents upload abuse
 */
export const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 uploads per 15 minutes
  message: {
    error: 'Too Many Upload Requests',
    message: 'Too many file uploads. Please try again later.',
    retryAfter: 900,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Search Rate Limiter
 * Prevents search query abuse
 */
export const searchLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 searches per minute
  message: {
    error: 'Too Many Search Requests',
    message: 'Too many search requests. Please slow down.',
    retryAfter: 60,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Report Creation Rate Limiter
 * Prevents report spam
 */
export const reportLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 reports per hour
  message: {
    error: 'Too Many Report Submissions',
    message: 'Too many reports submitted. Please try again later.',
    retryAfter: 3600,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Payment Rate Limiter
 * Prevents payment abuse
 */
export const paymentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 payment attempts per hour
  message: {
    error: 'Too Many Payment Requests',
    message: 'Too many payment requests. Please try again later.',
    retryAfter: 3600,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * AI/OpenAI Rate Limiter
 * Prevents AI API abuse (costly)
 */
export const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // 20 AI requests per hour
  message: {
    error: 'Too Many AI Requests',
    message: 'Too many AI requests. Please try again later.',
    retryAfter: 3600,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Blockchain Query Rate Limiter
 * Prevents blockchain API abuse (costly)
 */
export const blockchainLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 blockchain queries per minute
  message: {
    error: 'Too Many Blockchain Requests',
    message: 'Too many blockchain queries. Please slow down.',
    retryAfter: 60,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Create custom rate limiter with options
 */
export function createRateLimiter(options: {
  windowMs: number;
  max: number;
  message?: string;
  skipSuccessfulRequests?: boolean;
}) {
  return rateLimit({
    windowMs: options.windowMs,
    max: options.max,
    message: {
      error: 'Too Many Requests',
      message: options.message || 'Too many requests, please try again later.',
      retryAfter: Math.ceil(options.windowMs / 1000),
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: options.skipSuccessfulRequests || false,
  });
}

/**
 * Rate limit by user ID instead of IP
 * Useful for authenticated endpoints
 */
export function createUserRateLimiter(options: {
  windowMs: number;
  max: number;
  message?: string;
}) {
  return rateLimit({
    windowMs: options.windowMs,
    max: options.max,
    message: {
      error: 'Too Many Requests',
      message: options.message || 'Too many requests, please try again later.',
      retryAfter: Math.ceil(options.windowMs / 1000),
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
      // Use user ID if authenticated, otherwise use IP
      return req.user?.id?.toString() || req.ip || 'anonymous';
    },
  });
}
