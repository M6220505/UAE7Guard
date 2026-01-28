/**
 * Network utilities for checking connectivity and handling offline scenarios
 */

import { Network } from '@capacitor/network';
import { Capacitor } from '@capacitor/core';

/**
 * Check if the device has an active internet connection
 * Uses Capacitor Network plugin on mobile, falls back to navigator.onLine on web
 */
export function isOnline(): boolean {
  return typeof navigator !== 'undefined' && navigator.onLine;
}

/**
 * Get detailed network status using Capacitor Network plugin
 * Returns connection type and status for native apps
 */
export async function getNetworkStatus() {
  if (Capacitor.isNativePlatform()) {
    try {
      const status = await Network.getStatus();
      return status;
    } catch (error) {
      console.error('Failed to get network status:', error);
    }
  }

  // Fallback for web
  return {
    connected: isOnline(),
    connectionType: 'unknown'
  };
}

/**
 * Wait for the device to come online
 * Returns a promise that resolves when the device is online
 */
export function waitForOnline(timeoutMs: number = 30000): Promise<boolean> {
  return new Promise((resolve) => {
    if (isOnline()) {
      resolve(true);
      return;
    }

    const timeoutId = setTimeout(() => {
      window.removeEventListener('online', onlineHandler);
      resolve(false);
    }, timeoutMs);

    const onlineHandler = () => {
      clearTimeout(timeoutId);
      window.removeEventListener('online', onlineHandler);
      resolve(true);
    };

    window.addEventListener('online', onlineHandler);
  });
}

/**
 * Add online/offline event listeners
 * Uses Capacitor Network plugin on mobile for more reliable network detection
 */
export function addNetworkListeners(
  onOnline: () => void,
  onOffline: () => void
): () => void {
  // Use Capacitor Network plugin on native platforms
  if (Capacitor.isNativePlatform()) {
    let cleanupFn: (() => void) | null = null;

    // Add listener asynchronously
    Network.addListener('networkStatusChange', (status) => {
      if (status.connected) {
        onOnline();
      } else {
        onOffline();
      }
    }).then((listenerHandle) => {
      cleanupFn = () => listenerHandle.remove();
    }).catch((error) => {
      console.error('Failed to add network listener:', error);
    });

    return () => {
      if (cleanupFn) {
        cleanupFn();
      }
    };
  }

  // Fallback to browser APIs on web
  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);

  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  };
}

/**
 * Check if an error is a network connectivity error
 */
export function isNetworkError(error: Error): boolean {
  const message = error.message.toLowerCase();
  return (
    message.includes('network') ||
    message.includes('connection') ||
    message.includes('timeout') ||
    message.includes('fetch') ||
    message.includes('failed to fetch') ||
    error instanceof TypeError
  );
}
