import type { VercelRequest, VercelResponse } from '@vercel/node';

// Set VERCEL env before importing server to prevent auto-start
process.env.VERCEL = '1';

// Import the Express app and initialization function
import { app, initializeApp, isInitialized } from '../server/index';

// Track initialization state for serverless cold starts
let serverInitialized = false;

/**
 * Vercel Serverless Function Handler
 *
 * This handler wraps the Express app for Vercel's serverless environment.
 * On cold starts, it initializes the app (database, routes, middleware).
 * Subsequent requests reuse the initialized app instance.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Initialize the app on first request (cold start)
    if (!serverInitialized && !isInitialized) {
      console.log('[Vercel] Cold start - initializing app...');
      await initializeApp();
      serverInitialized = true;
      console.log('[Vercel] App initialized successfully');
    }

    // Handle the request using Express app
    return new Promise<void>((resolve, reject) => {
      // Create a mock response end handler to resolve the promise
      const originalEnd = res.end.bind(res);
      (res as any).end = function(...args: any[]) {
        originalEnd(...args);
        resolve();
      };

      // Pass request to Express
      app(req as any, res as any, (err: any) => {
        if (err) {
          console.error('[Vercel] Express error:', err);
          if (!res.headersSent) {
            res.status(500).json({
              error: 'Internal Server Error',
              message: process.env.NODE_ENV === 'production' ? undefined : err.message,
            });
          }
          resolve();
        }
      });
    });
  } catch (error) {
    console.error('[Vercel] Handler error:', error);

    if (!res.headersSent) {
      res.status(500).json({
        error: 'Server Initialization Error',
        message: process.env.NODE_ENV === 'production'
          ? 'The server encountered an error during initialization'
          : (error instanceof Error ? error.message : 'Unknown error'),
      });
    }
  }
}

// Export config for Vercel
export const config = {
  api: {
    bodyParser: false, // Let Express handle body parsing
    externalResolver: true, // Tell Vercel we're using Express
  },
};
