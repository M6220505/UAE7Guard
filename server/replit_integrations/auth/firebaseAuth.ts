import { Router } from "express";
import { db, isDatabaseAvailable } from "../../db";
import { users } from "../../../shared/schema";
import { eq } from "drizzle-orm";
import type { User } from "../../../shared/schema";

const router = Router();

/**
 * Initialize Firebase Admin SDK
 * CRITICAL: This requires firebase-admin to be installed AND Firebase service account credentials
 * to be configured via GOOGLE_APPLICATION_CREDENTIALS environment variable
 */
let admin: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  admin = require('firebase-admin');
  
  // Only initialize if not already initialized
  if (!admin.apps.length && process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    admin.initializeApp();
  }
} catch (error) {
  console.error('WARNING: firebase-admin not installed. Token verification will be disabled.');
  console.error('Install firebase-admin: npm install firebase-admin');
  console.error('Set GOOGLE_APPLICATION_CREDENTIALS environment variable to your service account JSON file');
}

/**
 * Verify Firebase ID token with cryptographic signature validation
 * SECURITY CRITICAL: This function MUST verify the JWT signature to prevent token forgery attacks
 * 
 * Requirements:
 * 1. firebase-admin must be installed: npm install firebase-admin
 * 2. GOOGLE_APPLICATION_CREDENTIALS env var must point to service account JSON file
 * 
 * NEVER use the legacy manual JWT decoding approach - it does NOT verify signatures
 * and allows attackers to forge arbitrary tokens with any user ID.
 */
async function verifyFirebaseToken(token: string): Promise<{ uid: string; email: string | null }> {
  try {
    // Ensure admin is initialized
    if (!admin || !admin.auth) {
      throw new Error(
        'Firebase Admin SDK not properly initialized. ' +
        'Ensure firebase-admin is installed and GOOGLE_APPLICATION_CREDENTIALS is set.'
      );
    }

    // Verify the token signature cryptographically
    // This is the ONLY secure way to verify Firebase tokens
    const decodedToken = await admin.auth().verifyIdToken(token);

    return {
      uid: decodedToken.uid,
      email: decodedToken.email || null,
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
    // Check database availability
    if (!isDatabaseAvailable || !db) {
      console.error("[FIREBASE] Sync failed: Database not configured");
      return res.status(503).json({
        error: "Service temporarily unavailable. Please try again later.",
        code: "SERVICE_UNAVAILABLE"
      });
    }

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
    // Check database availability
    if (!isDatabaseAvailable || !db) {
      console.error("[FIREBASE] User fetch failed: Database not configured");
      return res.status(503).json({
        error: "Service temporarily unavailable. Please try again later.",
        code: "SERVICE_UNAVAILABLE"
      });
    }

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
