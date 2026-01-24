# Mobile App API Configuration Guide

## Problem

When building a Capacitor mobile app from a web application, the frontend code runs locally on the device, but API requests need to connect to the backend server. Without proper configuration, API requests will fail with errors like:

- "Login failed - The string did not match the expected pattern"
- Network connection errors
- CORS errors
- 404 errors for API endpoints

## Solution

The UAE7Guard app now includes automatic platform detection and API URL configuration that works for both web and mobile platforms.

## How It Works

### 1. API Configuration (`client/src/lib/api-config.ts`)

The app automatically detects the platform and uses the appropriate API base URL:

- **Web App**: Uses relative URLs (`/api/auth/login`)
  - In development: Proxied by Vite dev server
  - In production: Same-origin requests to the deployed server

- **Mobile App**: Uses absolute URLs (`https://uae7guard.com/api/auth/login`)
  - Connects to the production backend server
  - Works offline when cached

### 2. Configuration

#### Production Backend URL

Edit `client/src/lib/api-config.ts`:

```typescript
// Your production backend URL
const PRODUCTION_API_URL = 'https://uae7guard.com';
```

#### Development Backend URL

For testing mobile apps with a local backend:

```typescript
// Local development backend
const DEV_API_URL = 'http://localhost:5000';
// Or use ngrok/similar for external access
const DEV_API_URL = 'https://your-ngrok-url.ngrok.io';
```

Then update `capacitor.config.ts`:

```typescript
server: {
  cleartext: true,  // Allow HTTP in development
  url: 'http://localhost:5000'
}
```

## Building and Testing

### 1. Build for Production

```bash
# Build the web app
npm run build

# Sync to mobile platforms
npm run cap:sync
```

### 2. Testing on Mobile

#### iOS Simulator/Device

```bash
npm run cap:open:ios
# In Xcode: Select device and click Run
```

#### Android Emulator/Device

```bash
npm run cap:open:android
# In Android Studio: Select device and click Run
```

### 3. Verify the Configuration

Add this debug code to your app temporarily:

```typescript
import { getPlatformInfo } from '@/lib/api-config';

console.log('Platform Info:', getPlatformInfo());
// Output on web:     { isNative: false, platform: 'web', apiBaseUrl: '' }
// Output on mobile:  { isNative: true, platform: 'ios', apiBaseUrl: 'https://uae7guard.com' }
```

## Common Issues and Solutions

### Issue 1: Login Still Fails

**Cause**: Old build cached in mobile app

**Solution**:
```bash
# Clean and rebuild
npm run build
npm run cap:sync
# Uninstall app from device/simulator
# Reinstall from Xcode/Android Studio
```

### Issue 2: CORS Errors

**Cause**: Backend not allowing requests from mobile app

**Solution**: Ensure your backend server has proper CORS configuration:

```typescript
// server/index.ts
app.use(cors({
  origin: true,  // Or specify allowed origins
  credentials: true
}));
```

### Issue 3: Session/Cookies Not Working

**Cause**: Cross-origin cookies require special configuration

**Solution**: The app already uses `credentials: "include"` in fetch requests. Ensure your backend:
- Sets `SameSite=None; Secure` for cookies
- Returns proper CORS headers
- Uses HTTPS in production

### Issue 4: Cannot Connect to Local Backend

**Cause**: Mobile device/simulator cannot access `localhost`

**Solutions**:

**Option A**: Use your computer's IP address
```typescript
const DEV_API_URL = 'http://192.168.1.100:5000';  // Your computer's IP
```

**Option B**: Use ngrok or similar service
```bash
ngrok http 5000
# Use the provided URL in DEV_API_URL
```

**Option C**: iOS Simulator can use localhost directly
```typescript
const DEV_API_URL = 'http://localhost:5000';  // Works on iOS Simulator
```

## Environment-Specific Configuration

### Development

```typescript
// api-config.ts
const DEV_API_URL = 'http://localhost:5000';

// capacitor.config.ts
server: {
  cleartext: true,
  url: 'http://localhost:5000'
}
```

### Staging

```typescript
// api-config.ts
const PRODUCTION_API_URL = 'https://staging.uae7guard.com';
```

### Production

```typescript
// api-config.ts
const PRODUCTION_API_URL = 'https://uae7guard.com';

// capacitor.config.ts
server: {
  androidScheme: 'https',
  allowNavigation: ['https://uae7guard.com', 'https://*.uae7guard.com']
}
```

## Testing Checklist

Before submitting to App Store/Play Store:

- [ ] Set correct PRODUCTION_API_URL
- [ ] Build with `npm run build`
- [ ] Sync with `npm run cap:sync`
- [ ] Test login on physical device
- [ ] Test all API-dependent features
- [ ] Verify app works without internet (cached data)
- [ ] Check error messages are user-friendly
- [ ] Test on both iOS and Android

## Monitoring

Add error tracking to monitor API issues:

```typescript
try {
  const response = await apiRequest('POST', '/api/auth/login', data);
} catch (error) {
  console.error('API Error:', {
    error: error.message,
    platform: Capacitor.getPlatform(),
    apiBaseUrl: getApiBaseUrl()
  });
  // Send to your error tracking service
}
```

## Support

If you continue to experience issues:

1. Check the browser/device console for errors
2. Verify the backend is accessible from the mobile device
3. Check network tab in device dev tools (if available)
4. Test with a simple curl command from the device's network:
   ```bash
   curl -i https://uae7guard.com/api/auth/user
   ```

## Related Files

- `client/src/lib/api-config.ts` - Platform detection and URL configuration
- `client/src/lib/queryClient.ts` - HTTP client with automatic URL handling
- `capacitor.config.ts` - Capacitor platform configuration
- `server/routes.ts` - Backend API routes
- `server/replit_integrations/auth/replitAuth.ts` - Authentication logic
