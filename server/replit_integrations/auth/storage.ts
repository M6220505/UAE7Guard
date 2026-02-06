import { users, type User, type UpsertUser } from "@shared/schema.ts";
import { db, isDatabaseAvailable } from "../../db";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

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
  isAvailable(): boolean;
}

// Helper to check database availability before operations
function checkDatabaseAvailable(): void {
  if (!isDatabaseAvailable || !db) {
    throw new Error("DATABASE_NOT_CONFIGURED");
  }
}

class AuthStorage implements IAuthStorage {
  isAvailable(): boolean {
    return isDatabaseAvailable && db !== null;
  }

  async getUser(id: string): Promise<User | undefined> {
    checkDatabaseAvailable();
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserById(id: string): Promise<User | undefined> {
    checkDatabaseAvailable();
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    checkDatabaseAvailable();
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    checkDatabaseAvailable();
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
    checkDatabaseAvailable();
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
    checkDatabaseAvailable();
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
    checkDatabaseAvailable();
    await db.delete(users).where(eq(users.id, userId));
  }
}

export const authStorage = new AuthStorage();
