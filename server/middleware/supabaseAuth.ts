/**
 * Supabase JWT Authentication Middleware
 *
 * Supports both:
 * 1. Supabase JWT (iOS/Mobile) - Authorization: Bearer <token>
 * 2. Legacy Session (Web) - req.session.userId
 */

import { Request, Response, NextFunction, RequestHandler } from 'express';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';

// ============================================================================
// SUPABASE ADMIN CLIENT (for JWT verification)
// ============================================================================

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

let supabaseAdmin: SupabaseClient | null = null;

if (supabaseUrl && supabaseServiceKey) {
  supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
  console.log('[SUPABASE_AUTH] Admin client initialized for JWT verification');
} else {
  console.warn('[SUPABASE_AUTH] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY - JWT verification disabled');
}

// ============================================================================
// TYPES
// ============================================================================

export interface VerifiedUser {
  id: string;
  email: string;
  role: string;
  authMethod: 'supabase_jwt' | 'session';
}

// Extend Express Request
declare global {
  namespace Express {
    interface Request {
      verifiedUser?: VerifiedUser;
    }
  }
}

// ============================================================================
// JWT VERIFICATION
// ============================================================================

/**
 * Extract Bearer token from Authorization header
 */
function extractBearerToken(authHeader: string | undefined): string | null {
  if (!authHeader) return null;
  if (!authHeader.startsWith('Bearer ')) return null;
  return authHeader.substring(7);
}

/**
 * Verify Supabase JWT using Admin API
 * This calls Supabase servers which verify the signature
 */
async function verifySupabaseJWT(accessToken: string): Promise<VerifiedUser | null> {
  if (!supabaseAdmin) {
    console.warn('[SUPABASE_AUTH] Cannot verify JWT - Admin client not configured');
    return null;
  }

  try {
    // Supabase Admin SDK verifies the token signature internally
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);

    if (error) {
      console.log('[SUPABASE_AUTH] JWT verification failed:', error.message);
      return null;
    }

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email || '',
      role: user.role || 'authenticated',
      authMethod: 'supabase_jwt',
    };
  } catch (error) {
    console.error('[SUPABASE_AUTH] JWT verification error:', error);
    return null;
  }
}

// ============================================================================
// MIDDLEWARE
// ============================================================================

/**
 * Authentication middleware that supports both Supabase JWT and legacy sessions
 *
 * Priority:
 * 1. Check Authorization header for Supabase JWT
 * 2. Fall back to session-based auth
 */
export const authenticateUser: RequestHandler = async (req, res, next) => {
  // Try Supabase JWT first (for iOS/Mobile)
  const authHeader = req.headers.authorization;
  const bearerToken = extractBearerToken(authHeader);

  if (bearerToken) {
    const verifiedUser = await verifySupabaseJWT(bearerToken);

    if (verifiedUser) {
      req.verifiedUser = verifiedUser;
      // Also set legacy format for compatibility
      (req as any).user = {
        claims: { sub: verifiedUser.id },
        id: verifiedUser.id,
        email: verifiedUser.email,
        role: verifiedUser.role,
      };
      return next();
    }

    // JWT provided but invalid
    return res.status(401).json({
      error: 'Invalid or expired token',
      code: 'INVALID_TOKEN'
    });
  }

  // Fall back to session-based auth (for Web legacy)
  const sessionUserId = (req.session as any)?.userId;

  if (sessionUserId) {
    req.verifiedUser = {
      id: sessionUserId,
      email: (req.session as any)?.user?.email || '',
      role: (req.session as any)?.user?.role || 'user',
      authMethod: 'session',
    };
    // Also set legacy format
    (req as any).user = {
      claims: { sub: sessionUserId },
      ...(req.session as any).user,
    };
    return next();
  }

  // No authentication found
  return res.status(401).json({
    error: 'Authentication required',
    code: 'UNAUTHORIZED'
  });
};

/**
 * Optional authentication - sets user if available but doesn't require it
 */
export const optionalAuth: RequestHandler = async (req, res, next) => {
  // Try Supabase JWT
  const authHeader = req.headers.authorization;
  const bearerToken = extractBearerToken(authHeader);

  if (bearerToken) {
    const verifiedUser = await verifySupabaseJWT(bearerToken);
    if (verifiedUser) {
      req.verifiedUser = verifiedUser;
      (req as any).user = {
        claims: { sub: verifiedUser.id },
        id: verifiedUser.id,
        email: verifiedUser.email,
        role: verifiedUser.role,
      };
    }
  } else {
    // Try session
    const sessionUserId = (req.session as any)?.userId;
    if (sessionUserId) {
      req.verifiedUser = {
        id: sessionUserId,
        email: (req.session as any)?.user?.email || '',
        role: (req.session as any)?.user?.role || 'user',
        authMethod: 'session',
      };
      (req as any).user = {
        claims: { sub: sessionUserId },
        ...(req.session as any).user,
      };
    }
  }

  return next();
};

/**
 * Admin-only middleware
 */
export const requireAdmin: RequestHandler = async (req, res, next) => {
  // First authenticate
  const authHeader = req.headers.authorization;
  const bearerToken = extractBearerToken(authHeader);

  let verifiedUser: VerifiedUser | null = null;

  if (bearerToken) {
    verifiedUser = await verifySupabaseJWT(bearerToken);
    if (!verifiedUser) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  } else {
    const sessionUserId = (req.session as any)?.userId;
    if (!sessionUserId) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    verifiedUser = {
      id: sessionUserId,
      email: (req.session as any)?.user?.email || '',
      role: (req.session as any)?.user?.role || 'user',
      authMethod: 'session',
    };
  }

  // Check admin role
  // Note: For Supabase, check user_metadata or app_metadata for admin flag
  // For now, check if role is 'admin' or 'service_role'
  if (verifiedUser.role !== 'admin' && verifiedUser.role !== 'service_role') {
    return res.status(403).json({
      error: 'Admin access required',
      code: 'FORBIDDEN'
    });
  }

  req.verifiedUser = verifiedUser;
  (req as any).user = {
    claims: { sub: verifiedUser.id },
    id: verifiedUser.id,
    email: verifiedUser.email,
    role: verifiedUser.role,
  };

  return next();
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get user ID from request (works with both auth methods)
 */
export function getUserId(req: Request): string | null {
  return req.verifiedUser?.id || null;
}

/**
 * Check if Supabase auth is configured
 */
export function isSupabaseAuthConfigured(): boolean {
  return supabaseAdmin !== null;
}
