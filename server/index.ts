import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import { seedDatabase } from "./seed";
import { runMigrations } from 'stripe-replit-sync';
import { getStripeSync } from './stripeClient';
import { WebhookHandlers } from './webhookHandlers';

// Import production middleware and utilities
import config, { validateConfig } from './config';
import { helmet, maintenanceMode } from './middleware/security';
import { apiLimiter } from './middleware/rateLimit';
import { logger, requestLogger, errorLogger } from './utils/logger';
import { monitoringMiddleware } from './utils/monitoring';
import {
  healthCheck,
  detailedHealthCheck,
  readinessCheck,
  livenessCheck,
  getMetrics,
} from './middleware/healthCheck';

const app = express();
const httpServer = createServer(app);

// For Vercel serverless: export app and initialization function
export { app, httpServer };
export let isInitialized = false;

// Validate production configuration
if (config.isProduction) {
  try {
    validateConfig();
  } catch (error) {
    logger.error('Configuration validation failed', error);
    process.exit(1);
  }
}

// Configure CORS to allow mobile app requests
// This is critical for Capacitor mobile apps to connect to the backend
const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Allow requests with no origin (mobile apps, curl, Postman, etc.)
    // or from capacitor:// and ionic:// schemes used by mobile apps
    if (!origin ||
        origin.startsWith('capacitor://') ||
        origin.startsWith('ionic://') ||
        origin.startsWith('file://') ||
        origin === 'http://localhost:5173' || // Vite dev server
        origin === 'http://localhost:5000' || // Production server
        origin.endsWith('.replit.dev') || // Replit preview
        origin === 'https://uae7guard.com' || // Production domain
        origin.endsWith('.uae7guard.com')) { // Production subdomains
      callback(null, true);
    } else {
      callback(null, true); // Allow all origins for now (can be restricted later)
    }
  },
  credentials: true, // Allow cookies and sessions
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

// Apply security middleware first
app.use(helmet());

// Maintenance mode check
app.use(maintenanceMode);

// CORS configuration
app.use(cors(corsOptions));

// Monitoring middleware
app.use(monitoringMiddleware);

// Request logging
app.use(requestLogger);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

async function initStripe() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.log('DATABASE_URL not set, skipping Stripe initialization');
    return;
  }

  try {
    console.log('Initializing Stripe schema...');
    await runMigrations({ databaseUrl });
    console.log('Stripe schema ready');

    const stripeSync = await getStripeSync();

    console.log('Setting up managed webhook...');
    const replitDomains = process.env.REPLIT_DOMAINS;
    if (replitDomains) {
      const webhookBaseUrl = `https://${replitDomains.split(',')[0]}`;
      try {
        const result = await stripeSync.findOrCreateManagedWebhook(
          `${webhookBaseUrl}/api/stripe/webhook`
        );
        if (result?.webhook?.url) {
          console.log(`Webhook configured: ${result.webhook.url}`);
        } else {
          console.log('Webhook setup returned but no URL available');
        }
      } catch (webhookError) {
        console.log('Webhook setup skipped (may need Stripe CLI or production deployment)');
      }
    } else {
      console.log('REPLIT_DOMAINS not set, skipping webhook setup');
    }

    console.log('Syncing Stripe data...');
    stripeSync.syncBackfill()
      .then(() => console.log('Stripe data synced'))
      .catch((err: Error) => console.error('Error syncing Stripe data:', err));
  } catch (error) {
    console.error('Failed to initialize Stripe:', error);
  }
}

// Register Stripe webhook route BEFORE express.json()
app.post(
  '/api/stripe/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const signature = req.headers['stripe-signature'];
    if (!signature) {
      return res.status(400).json({ error: 'Missing stripe-signature' });
    }

    try {
      const sig = Array.isArray(signature) ? signature[0] : signature;
      if (!Buffer.isBuffer(req.body)) {
        console.error('STRIPE WEBHOOK ERROR: req.body is not a Buffer');
        return res.status(500).json({ error: 'Webhook processing error' });
      }

      await WebhookHandlers.processWebhook(req.body as Buffer, sig);
      res.status(200).json({ received: true });
    } catch (error: any) {
      console.error('Webhook error:', error.message);
      res.status(400).json({ error: 'Webhook processing error' });
    }
  }
);

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

// Legacy log function for backward compatibility
export function log(message: string, source = "express") {
  logger.info(message, { source });
}

// Health check endpoints (must be before rate limiting and other routes)
app.get("/", healthCheck);
app.get("/api/health", healthCheck);
app.get("/api/health/detailed", detailedHealthCheck);
app.get("/api/health/ready", readinessCheck);
app.get("/api/health/live", livenessCheck);
app.get("/api/health/metrics", getMetrics);

// Apply rate limiting to API routes
app.use("/api", apiLimiter);

// Initialize the application
export async function initializeApp() {
  if (isInitialized) {
    return app;
  }

  // Initialize Stripe first
  await initStripe();

  await registerRoutes(httpServer, app);

  // Seed database with initial data
  try {
    await seedDatabase();
  } catch (error) {
    console.log("Seed completed or skipped (data may already exist)");
  }

  // Error logging middleware
  app.use(errorLogger);

  // Global error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    // Log error with appropriate level
    if (status >= 500) {
      logger.error('Server error', err);
    } else if (status >= 400) {
      logger.warn('Client error', { status, message });
    }

    // Don't leak error details in production
    const errorResponse = config.isProduction
      ? { error: status >= 500 ? 'Internal Server Error' : message }
      : { error: message, stack: err.stack };

    res.status(status).json(errorResponse);
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  isInitialized = true;
  return app;
}

// Check if running in Vercel serverless environment
const isVercelServerless = process.env.VERCEL === '1' && !process.env.PORT;

// Only start the server if not in Vercel serverless mode
if (!isVercelServerless) {
  (async () => {
    await initializeApp();

    // ALWAYS serve the app on the port specified in the environment variable PORT
    // Other ports are firewalled. Default to 5000 if not specified.
    // this serves both the API and the client.
    // It is the only port that is not firewalled.
    const port = config.server.port;
    const host = config.server.host;

    httpServer.listen(
      {
        port,
        host,
        reusePort: true,
      },
      () => {
        logger.info(`🚀 Server started successfully`, {
          port,
          host,
          environment: config.env,
          nodeVersion: process.version,
        });

        // Log configuration info
        if (config.isProduction) {
          logger.info('Production mode enabled');
          logger.info('Security features active');
        } else {
          logger.info('Development mode enabled');
        }
      },
    );

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      logger.info(`${signal} received, starting graceful shutdown...`);

      // Stop accepting new connections
      httpServer.close(() => {
        logger.info('HTTP server closed');

        // Close database connections, cleanup, etc.
        process.exit(0);
      });

      // Force shutdown after 30 seconds
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 30000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  })().catch((error) => {
    logger.error('Fatal server error during initialization', error);
    process.exit(1);
  });
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception - this should never happen!', error);

  // In production, try to keep running but mark as unhealthy
  if (config.isProduction) {
    logger.error('Server marked as unhealthy but continuing...');
  } else {
    // In development, exit to catch errors early
    process.exit(1);
  }
});

process.on('unhandledRejection', (reason: any, promise) => {
  logger.error('Unhandled promise rejection', reason, {
    promise: promise.toString(),
  });

  // Don't exit in production for unhandled rejections
  if (!config.isProduction) {
    process.exit(1);
  }
});
