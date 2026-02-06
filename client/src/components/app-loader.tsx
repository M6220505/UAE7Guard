import { useEffect, useState } from 'react';
import { Shield, Wifi, WifiOff } from 'lucide-react';
import { isFirebaseAvailable } from '@/lib/firebase';

interface AppLoaderProps {
  children: React.ReactNode;
  minLoadTime?: number;
}

/**
 * App Loader Component
 * Shows a branded loading screen while the app initializes
 * Handles network status and Firebase availability
 */
export function AppLoader({ children, minLoadTime = 1000 }: AppLoaderProps) {
  const [isReady, setIsReady] = useState(false);
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [loadingMessage, setLoadingMessage] = useState('Initializing...');

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    const startTime = Date.now();

    async function initialize() {
      try {
        // Check Firebase availability (but don't fail if not available)
        if (isFirebaseAvailable()) {
          setLoadingMessage('Connecting...');
        } else {
          setLoadingMessage('Starting in offline mode...');
        }

        // Wait for minimum load time (for splash screen UX)
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, minLoadTime - elapsed);

        if (remaining > 0) {
          await new Promise((resolve) => setTimeout(resolve, remaining));
        }

        if (mounted) {
          setIsReady(true);
        }
      } catch (error) {
        console.error('App initialization error:', error);
        // Still show the app even if there's an error
        if (mounted) {
          setIsReady(true);
        }
      }
    }

    initialize();

    return () => {
      mounted = false;
    };
  }, [minLoadTime]);

  if (isReady) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0b] flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-6">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="h-24 w-24 rounded-2xl bg-[#1a1f2e] flex items-center justify-center animate-pulse">
            <Shield className="h-12 w-12 text-green-500" />
          </div>
        </div>

        {/* App Name */}
        <div>
          <h1 className="text-3xl font-bold text-white">UAE7Guard</h1>
          <p className="text-gray-500 text-sm mt-1">Crypto Safety Tool</p>
        </div>

        {/* Loading Spinner */}
        <div className="flex justify-center">
          <div className="h-8 w-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
        </div>

        {/* Loading Message */}
        <p className="text-gray-400 text-sm">{loadingMessage}</p>

        {/* Network Status */}
        <div className="flex items-center justify-center gap-2 text-xs">
          {isOnline ? (
            <>
              <Wifi className="h-3 w-3 text-green-500" />
              <span className="text-green-500">Connected</span>
            </>
          ) : (
            <>
              <WifiOff className="h-3 w-3 text-yellow-500" />
              <span className="text-yellow-500">Offline Mode</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
