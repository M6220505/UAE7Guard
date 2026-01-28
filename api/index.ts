// Vercel Serverless Function for UAE7Guard
// This wraps the Express app to work with Vercel's serverless platform

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { app, initializeApp, isInitialized } from '../server/index';

// Set Vercel environment flag before initialization
process.env.VERCEL = '1';

let initializationPromise: Promise<any> | null = null;

async function ensureAppInitialized() {
  if (isInitialized) {
    return app;
  }

  // If initialization is already in progress, wait for it
  if (initializationPromise) {
    await initializationPromise;
    return app;
  }

  // Start initialization
  console.log('Initializing Express app for Vercel serverless...');
  initializationPromise = initializeApp()
    .then(() => {
      console.log('Express app initialized successfully');
      return app;
    })
    .catch((error) => {
      console.error('Failed to initialize Express app:', error);
      initializationPromise = null; // Reset to allow retry
      throw error;
    });

  await initializationPromise;
  return app;
}

// Vercel serverless handler
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const expressApp = await ensureAppInitialized();

    // Let Express handle the request
    return expressApp(req, res);
  } catch (error) {
    console.error('Serverless function error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
