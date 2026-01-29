import { Router } from "express";
import { db } from "../../db";
import { users } from "../../../shared/schema";
import { eq } from "drizzle-orm";
import type { User } from "../../../shared/schema";

const router = Router();

/**
 * Verify Firebase ID token
 * Note: In production, you should verify the token with Firebase Admin SDK
 * For now, we're trusting the frontend verification
 */
async function verifyFirebaseToken(token: string): Promise<{ uid: string; email: string | null }> {
  try {
    // In production, use Firebase Admin SDK to verify:
    // const decodedToken = await admin.auth().verifyIdToken(token);
    // return { uid: decodedToken.uid, email: decodedToken.email || null };

    // For development, decode the JWT manually (not secure for production!)
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }

    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());

    if (!payload.user_id && !payload.sub) {
      throw new Error('Invalid token payload');
    }

    return {
      uid: payload.user_id || payload.sub,
      email: payload.email || null,
    };
  } catch (error) {
    console.error('Error verifying Firebase token:', error);
    throw new Error('Invalid authentication token');
  }
}

/**
 * Middleware to authenticate Firebase requests
 */
async function authenticateFirebase(req: any, res: any, next: any) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No authentication token provided' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const decoded = await verifyFirebaseToken(token);

    req.firebaseUser = decoded;
    next();
  } catch (error: any) {
    console.error('Firebase authentication error:', error);
    res.status(401).json({ error: error.message || 'Authentication failed' });
  }
}

/**
 * POST /api/auth/firebase/sync
 * Sync Firebase user with our database
 * Creates a new user or updates existing user
 */
router.post("/sync", authenticateFirebase, async (req, res) => {
  try {
    const { firebaseUid, email, displayName, photoURL } = req.body;
    const firebaseUser = req.firebaseUser;

    // Verify the Firebase UID matches the authenticated user
    if (firebaseUser.uid !== firebaseUid) {
      return res.status(403).json({ error: 'Firebase UID mismatch' });
    }

    // Check if user already exists
    const existingUsers = await db
      .select()
      .from(users)
      .where(eq(users.firebaseUid, firebaseUid))
      .limit(1);

    let user: User;

    if (existingUsers.length > 0) {
      // User exists, update their info
      const [updatedUser] = await db
        .update(users)
        .set({
          email: email || existingUsers[0].email,
          profileImageUrl: photoURL || existingUsers[0].profileImageUrl,
          updatedAt: new Date(),
        })
        .where(eq(users.firebaseUid, firebaseUid))
        .returning();

      user = updatedUser;
    } else {
      // Create new user
      // Parse displayName into firstName and lastName
      let firstName = "User";
      let lastName = "";

      if (displayName) {
        const parts = displayName.trim().split(/\s+/);
        if (parts.length === 1) {
          firstName = parts[0];
        } else if (parts.length >= 2) {
          firstName = parts[0];
          lastName = parts.slice(1).join(' ');
        }
      }

      const [newUser] = await db
        .insert(users)
        .values({
          firebaseUid,
          email: email || '',
          firstName,
          lastName,
          profileImageUrl: photoURL || null,
          role: 'user',
          subscriptionTier: 'free',
          subscriptionStatus: 'inactive',
          password: null, // No password for Firebase users
        })
        .returning();

      user = newUser;
    }

    // Return user without sensitive fields
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error: any) {
    console.error('Error syncing Firebase user:', error);
    res.status(500).json({ error: 'Failed to sync user data' });
  }
});

/**
 * GET /api/auth/firebase/user/:firebaseUid
 * Fetch user by Firebase UID
 */
router.get("/user/:firebaseUid", authenticateFirebase, async (req, res) => {
  try {
    const { firebaseUid } = req.params;
    const firebaseUser = req.firebaseUser;

    // Verify the Firebase UID matches the authenticated user
    if (firebaseUser.uid !== firebaseUid) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    const result = await db
      .select()
      .from(users)
      .where(eq(users.firebaseUid, firebaseUid))
      .limit(1);

    if (result.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return user without sensitive fields
    const { password: _, ...userWithoutPassword } = result[0];
    res.json(userWithoutPassword);
  } catch (error: any) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

export default router;
