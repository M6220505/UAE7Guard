import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import { authStorage } from "./storage";
import { z } from "zod";

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true, // Auto-create sessions table if it doesn't exist
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // 'none' required for cross-origin in mobile apps
      maxAge: sessionTtl,
    },
  });
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
}

export function registerAuthRoutes(app: Express) {
  // Login with email/password
  app.post("/api/auth/login", async (req, res) => {
    try {
      console.log("[AUTH] Login attempt for:", req.body?.email);

      const data = loginSchema.parse(req.body);

      // Apple Review Demo Account Bypass (for TestFlight & App Store Review)
      const APPLE_REVIEW_EMAIL = "applereview@uae7guard.com";
      const APPLE_REVIEW_PASSWORD = process.env.APPLE_REVIEW_PASSWORD || "AppleReview2026";

      if (data.email === APPLE_REVIEW_EMAIL && data.password === APPLE_REVIEW_PASSWORD) {
        console.log("[AUTH] Apple Review demo login successful");

        // Create demo user session without database lookup
        const demoUser = {
          id: "demo-apple-review",
          email: APPLE_REVIEW_EMAIL,
          firstName: "Apple",
          lastName: "Reviewer",
          role: "user" as const,
          subscriptionTier: "pro" as const,
          profileImageUrl: null,
        };

        (req.session as any).userId = demoUser.id;
        (req.session as any).user = demoUser;

        return res.json({
          success: true,
          user: demoUser,
        });
      }

      const user = await authStorage.getUserByEmail(data.email);
      if (!user) {
        console.log("[AUTH] Login failed: User not found");
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const isValid = await authStorage.verifyPassword(user, data.password);
      if (!isValid) {
        console.log("[AUTH] Login failed: Invalid password");
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Set user in session
      (req.session as any).userId = user.id;
      (req.session as any).user = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        profileImageUrl: user.profileImageUrl,
      };

      console.log("[AUTH] Login successful for user:", user.id);
      res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("[AUTH] Login validation error:", error.errors);
        return res.status(400).json({ error: "Invalid email or password format" });
      }
      console.error("[AUTH] Login error:", error);
      // CRITICAL: Never return 500 for login failures - Apple rejects apps with 500 errors during login
      res.status(401).json({ error: "Invalid email or password" });
    }
  });

  // Signup with email/password
  app.post("/api/auth/signup", async (req, res) => {
    try {
      console.log("[AUTH] Signup attempt for:", req.body?.email);

      const data = signupSchema.parse(req.body);

      // Check if email already exists
      const existingUser = await authStorage.getUserByEmail(data.email);
      if (existingUser) {
        console.log("[AUTH] Signup failed: Email already registered");
        return res.status(400).json({ error: "Email already registered" });
      }

      // Create new user
      const user = await authStorage.createUserWithPassword(data);
      console.log("[AUTH] User created successfully:", user.id);

      // Set user in session
      (req.session as any).userId = user.id;
      (req.session as any).user = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        profileImageUrl: user.profileImageUrl,
      };

      console.log("[AUTH] Signup successful for user:", user.id);
      res.status(201).json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("[AUTH] Signup validation error:", error.errors);
        return res.status(400).json({ error: "Invalid signup data", details: error.errors });
      }
      console.error("[AUTH] Signup error:", error);
      // Return 400 instead of 500 for client errors
      res.status(400).json({ error: "Signup failed. Please try again." });
    }
  });

  // Get current user
  app.get("/api/auth/user", (req, res) => {
    const sessionUser = (req.session as any).user;
    if (!sessionUser) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    res.json(sessionUser);
  });

  // Logout
  app.post("/api/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Session destroy error:", err);
        return res.status(500).json({ error: "Logout failed" });
      }
      res.clearCookie("connect.sid");
      res.json({ success: true });
    });
  });
}

// Middleware to check if user is authenticated
export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const userId = (req.session as any).userId;
  
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  // Attach user info to request for route handlers
  (req as any).user = {
    claims: {
      sub: userId,
    },
    ...(req.session as any).user,
  };
  
  return next();
};

// Middleware to check if user is an admin
export const isAdmin: RequestHandler = async (req, res, next) => {
  const userId = (req.session as any).userId;
  
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  try {
    const dbUser = await authStorage.getUserById(userId);
    if (!dbUser || dbUser.role !== "admin") {
      return res.status(403).json({ message: "Forbidden - Admin access required" });
    }
    
    // Attach user info to request
    (req as any).user = {
      claims: {
        sub: userId,
      },
      ...(req.session as any).user,
    };
    
    return next();
  } catch (error) {
    return res.status(403).json({ message: "Forbidden" });
  }
};
