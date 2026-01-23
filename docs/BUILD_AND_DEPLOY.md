# UAE7Guard - Build and Deploy Guide

## Quick Start

### Prerequisites

- Node.js 20+
- npm or yarn
- For iOS: macOS with Xcode
- For Android: Android Studio

### Install Dependencies

```bash
npm install
```

### Available Scripts

```bash
# Development server (web only)
npm run dev

# Build web app
npm run build

# Start production server
npm start

# Type checking
npm run check

# Database migrations
npm run db:push

# Build and sync Capacitor (iOS + Android)
npm run cap:build

# Sync Capacitor only (no build)
npm run cap:sync

# Sync iOS only
npm run cap:sync:ios

# Sync Android only
npm run cap:sync:android

# Open iOS in Xcode
npm run cap:open:ios

# Open Android in Android Studio
npm run cap:open:android
```

---

## Building for Production

### 1. Web Application

```bash
# Build the web app
npm run build

# The output will be in dist/
# dist/public - Frontend assets
# dist/index.cjs - Backend server

# Test production build locally
npm start
```

### 2. iOS App

#### Prerequisites

- macOS with Xcode installed
- Apple Developer account
- Code signing certificates

#### Steps

```bash
# 1. Build and sync
npm run cap:sync:ios

# 2. Open in Xcode
npm run cap:open:ios

# 3. In Xcode:
#    - Select your team in Signing & Capabilities
#    - Select a target device or Generic iOS Device
#    - Product → Archive
#    - Distribute App → App Store Connect
```

#### Using Codemagic CI/CD

The project includes `codemagic.yaml` for automated builds:

1. Connect your repository to Codemagic
2. Configure App Store Connect API key
3. Push to trigger automated build
4. Build will be submitted to TestFlight automatically

See `docs/CODEMAGIC_IOS_BUILD_GUIDE.md` for detailed instructions.

### 3. Android App

#### Prerequisites

- Android Studio
- Android SDK
- Keystore for signing (production)

#### Steps

```bash
# 1. Build and sync
npm run cap:sync:android

# 2. Open in Android Studio
npm run cap:open:android

# 3. In Android Studio:
#    - Build → Generate Signed Bundle / APK
#    - Select release variant
#    - Sign with your keystore
```

#### Using Codemagic CI/CD

```bash
# The codemagic.yaml includes Android workflow
# It will build APK automatically when you push
```

---

## Environment Variables

Create a `.env` file in the root directory:

```bash
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Session Secret
SESSION_SECRET=your-secret-key-here

# SendGrid (Email)
SENDGRID_API_KEY=your-sendgrid-api-key
FROM_EMAIL=noreply@uae7guard.com

# Alchemy (Blockchain)
ALCHEMY_API_KEY=your-alchemy-api-key

# OpenAI (AI Analysis)
OPENAI_API_KEY=your-openai-api-key

# Stripe (Payments)
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

# Environment
NODE_ENV=production
```

---

## Deployment

### Web Deployment (Replit)

The app is configured for Replit deployment:

1. Push to your Replit repository
2. Replit will automatically build and deploy
3. Custom domain: uae7guard.com

### Mobile App Deployment

#### iOS (App Store)

1. **TestFlight (Beta Testing)**
   - Build IPA using Xcode or Codemagic
   - Upload to App Store Connect
   - Submit to TestFlight
   - Add beta testers

2. **App Store (Production)**
   - Complete App Store listing:
     - App name, description, keywords
     - Screenshots (see `docs/APP_STORE_SCREENSHOTS_GUIDE.md`)
     - Privacy policy, support URL
   - Submit for review
   - Wait for approval (typically 1-3 days)

#### Android (Google Play)

1. **Internal Testing**
   - Build signed APK/AAB
   - Upload to Play Console
   - Create internal testing release

2. **Production**
   - Complete Play Store listing
   - Screenshots, description, graphics
   - Submit for review
   - Wait for approval

---

## Capacitor Configuration

The app is configured in `capacitor.config.ts`:

```typescript
{
  appId: 'com.uae7guard.crypto',
  appName: 'UAE7Guard',
  webDir: 'dist/public',
  // ... plugins configuration
}
```

### Mobile App Backend Connection

**IMPORTANT**: Mobile apps need to connect to the backend server. See `docs/MOBILE_API_CONFIGURATION.md` for complete setup instructions.

Quick setup:
1. Edit `client/src/lib/api-config.ts` - Set your backend URL
2. Build and sync: `npm run build && npm run cap:sync`
3. Test login functionality on mobile device

### Native Plugins Used

- **Splash Screen** - Custom launch screen
- **Keyboard** - Keyboard handling
- **Status Bar** - Status bar styling

---

## Troubleshooting

### iOS Build Issues

**Problem:** "No signing certificate found"
**Solution:**
- Open Xcode
- Preferences → Accounts → Add Apple ID
- Project → Signing & Capabilities → Select Team

**Problem:** "Pod install failed"
**Solution:**
```bash
cd ios/App
pod repo update
pod install
```

### Android Build Issues

**Problem:** "SDK not found"
**Solution:**
- Open Android Studio
- Tools → SDK Manager → Install required SDKs

**Problem:** "Gradle build failed"
**Solution:**
```bash
cd android
./gradlew clean
./gradlew build
```

### Capacitor Sync Issues

**Problem:** "Web assets not found"
**Solution:**
```bash
# Make sure you build first
npm run build
npm run cap:sync
```

### Mobile App Login Issues

**Problem:** "Login failed - The string did not match the expected pattern"
**Solution:**
This error occurs when the mobile app cannot connect to the backend server.

```bash
# 1. Configure the backend URL
# Edit client/src/lib/api-config.ts and set PRODUCTION_API_URL

# 2. Rebuild and resync
npm run build
npm run cap:sync

# 3. Reinstall the app on your device
# Uninstall from device, then reinstall from Xcode/Android Studio
```

See `docs/MOBILE_API_CONFIGURATION.md` for detailed troubleshooting.

---

## Performance Optimization

### Web App

- Vite automatically optimizes the build
- Code splitting is enabled
- Assets are minified and compressed

### Mobile App

- Use release builds for production
- Enable ProGuard (Android)
- Enable App Thinning (iOS)

---

## Testing

### Web Testing

```bash
# Run development server
npm run dev

# Test in browser
open http://localhost:5000
```

### Mobile Testing

**iOS Simulator:**
```bash
npm run cap:open:ios
# In Xcode, select simulator and run
```

**Android Emulator:**
```bash
npm run cap:open:android
# In Android Studio, select emulator and run
```

**Physical Devices:**
- iOS: Connect device, select in Xcode, run
- Android: Enable USB debugging, connect device, run in Android Studio

---

## App Store Requirements

### iOS App Store

- ✅ App Icon (1024x1024px)
- ✅ Screenshots (multiple sizes)
- ✅ Privacy Policy
- ✅ Support URL
- ✅ Age Rating
- ✅ Categories
- ✅ Keywords
- ✅ App Description

See `docs/FINAL_REVIEW_CHECKLIST_AR.md` for complete checklist.

### Google Play Store

- ✅ Feature Graphic (1024x500px)
- ✅ App Icon (512x512px)
- ✅ Screenshots (multiple sizes)
- ✅ Privacy Policy
- ✅ Content Rating
- ✅ Categories
- ✅ Short & Full Description

---

## Continuous Integration

The project uses Codemagic for CI/CD:

- **iOS:** Automatic TestFlight submission
- **Android:** Automatic APK generation
- **Triggers:** Push to main branch or manual trigger

Configuration in `codemagic.yaml`.

---

## Support

For issues or questions:
- Check documentation in `docs/` folder
- Review commit history for recent changes
- Check Codemagic build logs for CI/CD issues

---

## Version History

- **1.0.0** - Initial release
  - Multi-chain wallet verification
  - AI-powered threat analysis
  - Bilingual support (EN/AR)
  - Dark mode
  - Mobile apps (iOS + Android)
