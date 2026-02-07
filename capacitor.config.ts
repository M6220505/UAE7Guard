import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.uae7guard.crypto',
  appName: 'UAE7Guard',
  webDir: 'dist/public',
  server: {
    androidScheme: 'https',
    // Allow the app to make requests to the backend
    allowNavigation: [
      'https://uae7guard.com',
      'https://*.uae7guard.com',
      'https://*.railway.app',
      'https://*.up.railway.app',
      'https://*.repl.co',
      'https://*.replit.dev',
      'capacitor://localhost',
      'ionic://localhost'
    ],
    // Enable for development with local backend
    // cleartext: true,
    // url: 'http://localhost:5000'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#0a0a0b",
      showSpinner: false,
      androidSpinnerStyle: "small",
      spinnerColor: "#22c55e",
      launchAutoHide: true
    },
    Keyboard: {
      resize: 'body',
      style: 'dark',
      resizeOnFullScreen: true
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#0a0a0b'
    }
  },
  ios: {
    contentInset: 'automatic',
    preferredContentMode: 'mobile'
  },
  android: {
    backgroundColor: '#0a0a0b',
    allowMixedContent: false,
    minWebViewVersion: 60
  }
};

export default config;
