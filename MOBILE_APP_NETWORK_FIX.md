# Mobile App Network Error - Fix Guide

## Problem Summary

The mobile app was showing "**Login failed - Network error. Please check your internet connection**" when attempting to log in. This document explains the issue and the fixes applied.

---

## Root Cause

The mobile app's API configuration (`client/src/lib/api-config.ts`) had an **empty production URL**:

```typescript
const PRODUCTION_API_URL = import.meta.env.VITE_API_BASE_URL || '';
```

When the app was built for production and installed on a device, it attempted to make API requests to an empty URL, resulting in network errors.

---

## Fixes Applied

### 1. Updated API Configuration with Default Backend URL

**File**: `client/src/lib/api-config.ts`

- Set default production URL to: `https://uae7guard-m6220505.repl.co`
- Added comprehensive documentation about configuration options
- Set default development URL to: `http://localhost:5000`
- Added instructions for testing with physical devices

### 2. Installed Capacitor Network Plugin

**Package**: `@capacitor/network@^7.0.0`

Provides native network status detection on mobile devices for:
- Real-time network connectivity monitoring
- Connection type detection (WiFi, Cellular, etc.)
- More reliable offline detection than browser APIs

### 3. Enhanced Network Utilities

**File**: `client/src/lib/network-utils.ts`

Enhanced with Capacitor Network plugin support:
- Uses native network detection on mobile apps
- Falls back to browser APIs on web
- Provides detailed network status information
- Real-time network status change notifications

### 4. Existing Login Error Handling

The login page already had robust error handling:
- Network status indicator
- Disabled login button when offline
- Specific error messages for timeout and connection errors
- Real-time network status monitoring

---

## Configuration Options

### Option 1: Deploy Backend and Update URL (Recommended)

1. **Deploy your backend** to one of these platforms:
   - **Vercel** (recommended): `https://uae7guard.vercel.app`
   - **Replit**: `https://your-repl-name.replit.app`
   - **Custom domain**: `https://api.uae7guard.com`

2. **Update the API configuration** before building:
   ```bash
   export VITE_API_BASE_URL="https://your-backend-url.com"
   npm run build
   npx cap copy
   ```

3. **Build and deploy the mobile app** in Xcode or Android Studio

### Option 2: Test with Local Backend

For development and testing on a physical device:

1. **Find your computer's local IP address**:
   ```bash
   # Mac/Linux
   ifconfig | grep "inet "

   # Windows
   ipconfig
   ```
   Look for your local network IP (e.g., `192.168.1.100`)

2. **Start your backend**:
   ```bash
   npm run dev
   ```

3. **Update the API URL**:
   ```bash
   export VITE_DEV_API_URL="http://192.168.1.100:5000"
   npm run build
   npx cap copy
   ```

4. **Open in IDE and run**:
   ```bash
   # For iOS
   npx cap open ios

   # For Android
   npx cap open android
   ```

### Option 3: Use iOS Simulator/Android Emulator

For testing on simulators/emulators, `localhost` works:

1. **Start your backend**:
   ```bash
   npm run dev
   ```

2. **Build and copy**:
   ```bash
   npm run build
   npx cap copy
   ```

3. **Run in simulator/emulator**:
   ```bash
   # iOS Simulator
   npx cap open ios

   # Android Emulator
   npx cap open android
   ```

---

## Current Configuration

### API URLs

**Production**: `https://uae7guard-m6220505.repl.co`
- This is the default backend URL for production builds
- Can be overridden with `VITE_API_BASE_URL` environment variable

**Development**: `http://localhost:5000`
- For testing on iOS Simulator or Android Emulator
- For physical devices, set `VITE_DEV_API_URL` to your local IP

### Allowed Navigation Domains

In `capacitor.config.ts`, the app can make requests to:
- `https://uae7guard.com`
- `https://*.uae7guard.com`
- `https://*.repl.co`
- `https://*.replit.dev`
- `https://uae7guard-m6220505.repl.co`

---

## Testing the Fix

### Prerequisites

1. **Backend must be running** at the configured URL
2. **Database must be set up** with demo data
3. **Demo account must exist**: `admin@uae7guard.com` / `admin123456`

### Steps to Test

1. **Build the app**:
   ```bash
   npm run build
   npx cap copy
   ```

2. **Open in Xcode or Android Studio**:
   ```bash
   # iOS
   npx cap open ios

   # Android
   npx cap open android
   ```

3. **Run on device or simulator**

4. **Test login**:
   - Email: `admin@uae7guard.com`
   - Password: `admin123456`

5. **Expected behavior**:
   - Login should succeed if backend is reachable
   - Network indicator should show online status
   - If backend is unreachable, you'll see a clear error message
   - If device is offline, login button will be disabled with "Offline" indicator

---

## Troubleshooting

### "Network error" still appears

**Check:**
1. ✅ Backend is running and accessible
2. ✅ Correct backend URL is configured
3. ✅ Device/simulator has internet connection
4. ✅ Backend URL is allowed in `capacitor.config.ts`
5. ✅ App was rebuilt and synced after configuration changes

**Test backend accessibility**:
```bash
# From your computer
curl https://your-backend-url.com/api/health

# Expected response:
# {"status":"ok","timestamp":"..."}
```

### "Cannot reach server"

**Possible causes:**
1. Backend is not running
2. Backend URL is incorrect
3. Firewall blocking requests
4. SSL certificate issues (for HTTPS)

**Solutions:**
1. Verify backend is running: `npm run dev`
2. Check backend logs for errors
3. Test with curl or browser
4. For local testing, ensure device is on same network

### iOS App Transport Security Error

If you see ATS errors on iOS, the backend URL must use HTTPS. For local testing:

1. Use ngrok for HTTPS tunnel:
   ```bash
   ngrok http 5000
   ```

2. Use the ngrok HTTPS URL:
   ```bash
   export VITE_DEV_API_URL="https://xyz.ngrok.io"
   npm run build
   npx cap copy
   ```

### Android cleartext traffic error

For local HTTP testing on Android, add to `capacitor.config.ts`:

```typescript
server: {
  cleartext: true,
  url: 'http://192.168.1.100:5000'
}
```

---

## Production Deployment Checklist

Before deploying to production:

- [ ] Deploy backend to production server (Vercel/Replit/Custom)
- [ ] Configure production database (Supabase recommended)
- [ ] Set all required environment variables
- [ ] Run database setup: `npm run db:setup`
- [ ] Test backend health endpoint
- [ ] Update `VITE_API_BASE_URL` to production URL
- [ ] Build mobile app: `npm run build && npx cap copy`
- [ ] Test on physical devices
- [ ] Submit to App Store / Play Store

---

## Files Modified

1. **client/src/lib/api-config.ts**
   - Added default production URL
   - Enhanced documentation
   - Added configuration examples

2. **client/src/lib/network-utils.ts**
   - Integrated Capacitor Network plugin
   - Enhanced network status detection
   - Added detailed status information

3. **package.json**
   - Added `@capacitor/network@^7.0.0`

---

## Additional Resources

- [Capacitor Network Plugin Docs](https://capacitorjs.com/docs/apis/network)
- [API Configuration Guide](./docs/MOBILE_API_CONFIGURATION.md)
- [Database Setup Guide](./DATABASE_SETUP.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)

---

## Summary

The mobile app network error was caused by an empty API URL in the production configuration. The fix includes:

1. ✅ Default backend URL configured
2. ✅ Capacitor Network plugin installed
3. ✅ Enhanced network detection
4. ✅ Comprehensive configuration documentation
5. ✅ Multiple deployment options documented

**Next Steps**: Deploy your backend to a production server and update the `VITE_API_BASE_URL` before building the final production app.
