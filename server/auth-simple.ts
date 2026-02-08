/**
 * Simple Authentication System
 * Direct database auth without Supabase
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from './db';
import { users } from '@db/schema';
import { eq } from 'drizzle-orm';

const JWT_SECRET = process.env.SESSION_SECRET || 'uae7guard_secret_key';
const JWT_EXPIRES_IN = '7d';

export interface AuthUser {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
}

/**
 * Sign up new user
 */
export async function signup(
  email: string,
  password: string,
  firstName?: string,
  lastName?: string
): Promise<{ user: AuthUser; token: string }> {
  try {
    // Check if user exists
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existing.length > 0) {
      throw new Error('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        subscriptionPlan: 'free',
        createdAt: new Date(),
      })
      .returning();

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: newUser.id, 
        email: newUser.email 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return {
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName || undefined,
        lastName: newUser.lastName || undefined,
      },
      token,
    };
  } catch (error: any) {
    console.error('[AUTH] Signup error:', error);
    throw error;
  }
}

/**
 * Sign in existing user
 */
export async function signin(
  email: string,
  password: string
): Promise<{ user: AuthUser; token: string }> {
  try {
    // Find user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password || '');
    if (!validPassword) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName || undefined,
        lastName: user.lastName || undefined,
      },
      token,
    };
  } catch (error: any) {
    console.error('[AUTH] Signin error:', error);
    throw error;
  }
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): { userId: number; email: string } {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return {
      userId: decoded.userId,
      email: decoded.email,
    };
  } catch (error) {
    throw new Error('Invalid token');
  }
}

/**
 * Get user by ID
 */
export async function getUserById(userId: number): Promise<AuthUser | null> {
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName || undefined,
      lastName: user.lastName || undefined,
    };
  } catch (error) {
    console.error('[AUTH] Get user error:', error);
    return null;
  }
}

/**
 * Request password reset
 */
export async function requestPasswordReset(email: string): Promise<boolean> {
  try {
    // Find user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      // Don't reveal if email exists
      return true;
    }

    // Generate reset token (expires in 1 hour)
    const resetToken = jwt.sign(
      { userId: user.id, type: 'password_reset' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // TODO: Send email with reset link
    console.log(`[AUTH] Password reset token for ${email}: ${resetToken}`);
    
    return true;
  } catch (error) {
    console.error('[AUTH] Password reset error:', error);
    throw error;
  }
}

/**
 * Reset password with token
 */
export async function resetPassword(
  token: string,
  newPassword: string
): Promise<boolean> {
  try {
    // Verify reset token
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    if (decoded.type !== 'password_reset') {
      throw new Error('Invalid reset token');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, decoded.userId));

    return true;
  } catch (error) {
    console.error('[AUTH] Reset password error:', error);
    throw error;
  }
}
