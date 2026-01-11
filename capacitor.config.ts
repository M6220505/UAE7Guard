import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.uae7guard.app',
  appName: 'UAE7Guard',
  webDir: 'dist/public',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#0a0a0b",
      showSpinner: false,
      androidSpinnerStyle: "small",
      spinnerColor: "#22c55e"
    }
  }
};

export default config;
