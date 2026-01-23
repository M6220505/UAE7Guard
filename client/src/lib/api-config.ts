import { Capacitor } from '@capacitor/core';

/**
 * API Configuration for web and mobile platforms
 *
 * - Web: Uses relative URLs (proxied by Vite dev server or same-origin in production)
 * - Mobile: Uses absolute URL to backend server
 */

// Default backend URL for production mobile builds
// This should match your deployed backend URL
const PRODUCTION_API_URL = 'https://uae7guard.com';

// Development API URL (when testing mobile app locally)
const DEV_API_URL = 'https://uae7guard.com';

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
