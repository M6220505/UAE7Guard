/**
 * Production-safe Logger Utility
 * Replaces console.log statements with controlled logging
 */

const isDevelopment = process.env.NODE_ENV === 'development';
const isServer = typeof window === 'undefined';

export const logger = {
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },

  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },

  warn: (...args: any[]) => {
    // Always log warnings
    console.warn(...args);
  },

  error: (...args: any[]) => {
    // Always log errors
    console.error(...args);
  },

  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  },

  // Server-only logging
  server: (...args: any[]) => {
    if (isServer && isDevelopment) {
      console.log('[SERVER]', ...args);
    }
  },

  // Client-only logging
  client: (...args: any[]) => {
    if (!isServer && isDevelopment) {
      console.log('[CLIENT]', ...args);
    }
  }
};

// Export as default for easier imports
export default logger;
