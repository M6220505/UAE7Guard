/**
 * Network utilities for checking connectivity and handling offline scenarios
 */

/**
 * Check if the device has an active internet connection
 * This is a basic check using navigator.onLine
 * Note: navigator.onLine can have false positives (device connected to WiFi but no internet)
 */
export function isOnline(): boolean {
  return typeof navigator !== 'undefined' && navigator.onLine;
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
 */
export function addNetworkListeners(
  onOnline: () => void,
  onOffline: () => void
): () => void {
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
