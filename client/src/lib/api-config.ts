import { Capacitor } from '@capacitor/core';

/**
 * API Configuration for web and mobile platforms
 *
 * - Web: Uses relative URLs (proxied by Vite dev server or same-origin in production)
 * - Mobile: Uses absolute URL to backend server
 */

// Default backend URL for production mobile builds
// Can be overridden with VITE_API_BASE_URL environment variable during build
// 🔥 IMPORTANT: Update this URL to your deployed backend
//
// Options:
//   1. Vercel: 'https://uae7guard.vercel.app'
//   2. Custom domain: 'https://api.uae7guard.com'
//   3. Replit: 'https://your-repl-name.replit.app'
//
// To override at build time:
//   export VITE_API_BASE_URL="https://your-backend-url.com"
//   npm run build
//   npm run cap:sync
//
// For testing with local backend on physical device:
//   1. Get your computer's local IP: ipconfig (Windows) or ifconfig (Mac/Linux)
//   2. Start backend: npm run dev
//   3. Use: http://YOUR_LOCAL_IP:5000 (e.g., http://192.168.1.100:5000)
//
const PRODUCTION_API_URL = import.meta.env.VITE_API_BASE_URL || 'https://uae7guard-m6220505.repl.co';

// Development API URL (when testing mobile app locally)
// Can be overridden with VITE_DEV_API_URL environment variable
// For physical device testing, use your computer's local IP address
// Example: 'http://192.168.1.100:5000' (find your IP with ipconfig/ifconfig)
const DEV_API_URL = import.meta.env.VITE_DEV_API_URL || 'http://localhost:5000';

/**
 * Get the appropriate API base URL based on the platform
 */
export function getApiBaseUrl(): string {
  // Check if we're running in a native mobile environment
  const isNative = Capacitor.isNativePlatform();

  if (!isNative) {
    // Web app - use relative URLs
    return '';
  }

  // Mobile app - use absolute URL to backend
  const isDev = import.meta.env.DEV;
  return isDev ? DEV_API_URL : PRODUCTION_API_URL;
}

/**
 * Build a full API URL
 */
export function buildApiUrl(path: string): string {
  const baseUrl = getApiBaseUrl();

  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return `${baseUrl}${normalizedPath}`;
}

/**
 * Check if we're running in native mobile app
 */
export function isNativeApp(): boolean {
  return Capacitor.isNativePlatform();
}

/**
 * Get platform information for debugging
 */
export function getPlatformInfo() {
  return {
    isNative: Capacitor.isNativePlatform(),
    platform: Capacitor.getPlatform(),
    apiBaseUrl: getApiBaseUrl(),
  };
}
