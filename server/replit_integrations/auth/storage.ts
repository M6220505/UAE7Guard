import { users, type User, type UpsertUser } from "@shared/schema.ts";
import { db } from "../../db";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// In-memory password reset token storage with TTL
// Note: For production at scale, consider migrating to database or Redis storage
interface ResetToken {
  userId: string;
  email: string;
  firstName?: string;
  expiresAt: Date;
}

const resetTokens = new Map<string, ResetToken>();

// Clean expired tokens every 15 minutes
setInterval(() => {
  const now = new Date();
  for (const [token, data] of resetTokens.entries()) {
    if (data.expiresAt < now) {
      resetTokens.delete(token);
    }
  }
}, 15 * 60 * 1000);

export interface IAuthStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserById(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  createUserWithPassword(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<User>;
  verifyPassword(user: User, password: string): Promise<boolean>;
  updatePassword(userId: string, newPassword: string): Promise<void>;
  deleteUser(userId: string): Promise<void>;
  createPasswordResetToken(user: User): string;
  verifyPasswordResetToken(token: string): ResetToken | null;
  invalidatePasswordResetToken(token: string): void;
}

class AuthStorage implements IAuthStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  
  async getUserById(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          profileImageUrl: userData.profileImageUrl,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async createUserWithPassword(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    
    const [user] = await db
      .insert(users)
      .values({
        email: userData.email,
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: "user",
      })
      .returning();
    
    return user;
  }

  async verifyPassword(user: User, password: string): Promise<boolean> {
    if (!user.password) {
      return false;
    }
    return bcrypt.compare(password, user.password);
  }

  async updatePassword(userId: string, newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await db
      .update(users)
      .set({
        password: hashedPassword,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));
  }

  async deleteUser(userId: string): Promise<void> {
    await db.delete(users).where(eq(users.id, userId));
  }

  // Generate a secure password reset token (valid for 1 hour)
  createPasswordResetToken(user: User): string {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    resetTokens.set(token, {
      userId: user.id,
      email: user.email || '',
      firstName: user.firstName || undefined,
      expiresAt,
    });

    return token;
  }

  // Verify and return token data if valid
  verifyPasswordResetToken(token: string): ResetToken | null {
    const data = resetTokens.get(token);
    if (!data) {
      return null;
    }

    if (data.expiresAt < new Date()) {
      resetTokens.delete(token);
      return null;
    }

    return data;
  }

  // Remove a token after use
  invalidatePasswordResetToken(token: string): void {
    resetTokens.delete(token);
  }
}

export const authStorage = new AuthStorage();
