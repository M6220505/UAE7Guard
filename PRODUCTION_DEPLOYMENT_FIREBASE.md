# Firebase Production Deployment Guide for UAE7Guard

This guide will help you deploy UAE7Guard to production with Firebase Authentication on Vercel.

## Prerequisites

- ✅ UAE7Guard app built successfully (`npm run build`)
- ✅ Vercel account (free or pro)
- ✅ Firebase project created
- ✅ Firebase Authentication enabled (Email/Password + Sign in with Apple)
- ✅ Supabase database with schema deployed
- ✅ Apple Developer account (for Sign in with Apple)

---

## Step 1: Configure Firebase for Production

### 1.1 Get Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your UAE7Guard project
3. Click the **gear icon** → **Project settings**
4. Scroll to "Your apps" section
5. Find your Web app or click "Add app" → Web icon
6. Copy all the configuration values:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "uae7guard-xxxxx.firebaseapp.com",
  projectId: "uae7guard-xxxxx",
  storageBucket: "uae7guard-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef",
  measurementId: "G-XXXXXXXXX"
};
```

**SAVE THESE VALUES** - you'll need them in Step 2.

### 1.2 Update Firebase Authorized Domains

1. In Firebase Console, go to **Authentication** → **Settings** → **Authorized domains**
2. Click **Add domain**
3. Add your production domain:
   - `uae7guard.vercel.app` (or your custom domain)
4. Click **Add**

### 1.3 Update Apple Sign In Return URLs

1. Go to [Apple Developer Portal](https://developer.apple.com/account)
2. Navigate to **Certificates, Identifiers & Profiles**
3. Click **Identifiers** → **Service IDs**
4. Select your Sign in with Apple Service ID
5. Click **Configure** next to "Sign in with Apple"
6. Under "Return URLs", add:
   ```
   https://uae7guard-xxxxx.firebaseapp.com/__/auth/handler
   ```
   (Replace `uae7guard-xxxxx` with your Firebase project ID)
7. Click **Save** → **Continue** → **Save**

---

## Step 2: Set Environment Variables in Vercel

### 2.1 Access Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your **UAE7Guard** project (or import from GitHub if not yet deployed)
3. Click **Settings** → **Environment Variables**

### 2.2 Add Required Variables

Add the following environment variables. For each variable:
- ✅ Select: **Production**, **Preview**, **Development**
- Click **Save**

#### Firebase Configuration (REQUIRED)

| Variable Name | Value | Notes |
|--------------|-------|-------|
| `VITE_FIREBASE_API_KEY` | `AIzaSy...` | From Firebase config |
| `VITE_FIREBASE_AUTH_DOMAIN` | `uae7guard-xxxxx.firebaseapp.com` | From Firebase config |
| `VITE_FIREBASE_PROJECT_ID` | `uae7guard-xxxxx` | From Firebase config |
| `VITE_FIREBASE_STORAGE_BUCKET` | `uae7guard-xxxxx.appspot.com` | From Firebase config |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `123456789` | From Firebase config |
| `VITE_FIREBASE_APP_ID` | `1:123456789:web:abcdef` | From Firebase config |
| `VITE_FIREBASE_MEASUREMENT_ID` | `G-XXXXXXXXX` | From Firebase config (optional) |

#### Database Configuration (REQUIRED)

| Variable Name | Value | Notes |
|--------------|-------|-------|
| `DATABASE_URL` | `postgresql://postgres...` | From Supabase Dashboard → Settings → Database |
| `SESSION_SECRET` | Generate with `openssl rand -base64 32` | Must be random 32+ chars |
| `NODE_ENV` | `production` | Set manually |

#### Apple Review (REQUIRED for App Store)

| Variable Name | Value | Notes |
|--------------|-------|-------|
| `APPLE_REVIEW_PASSWORD` | `AppleReview2026` | Password for demo account |

### 2.3 Verify All Variables Are Set

After adding all variables, you should have:
- ✅ 7 Firebase variables (VITE_FIREBASE_*)
- ✅ 3 required variables (DATABASE_URL, SESSION_SECRET, NODE_ENV)
- ✅ 1 Apple Review variable (APPLE_REVIEW_PASSWORD)

**Total: 11 environment variables**

---

## Step 3: Deploy to Vercel

### Option A: Deploy via Dashboard (Recommended)

1. In Vercel Dashboard, go to your UAE7Guard project
2. Click **Deployments** tab
3. Click **"..."** on the latest deployment
4. Click **Redeploy**
5. Check **"Use existing Build Cache"** → **Redeploy**
6. Wait for deployment (~3-5 minutes)

### Option B: Deploy via Git Push

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "feat: Production deployment with Firebase"
   git push origin claude/build-app-m6220505-E7Wke
   ```

2. Vercel will automatically detect the push and deploy

3. Monitor deployment at: `https://vercel.com/[your-account]/uae7guard/deployments`

---

## Step 4: Verify Production Deployment

### 4.1 Check Deployment Status

1. Open your production URL: `https://uae7guard.vercel.app`
2. You should see the UAE7Guard login page
3. Check browser console for errors (F12 → Console)

### 4.2 Test Firebase Authentication

**Test Email/Password Sign Up:**
1. Go to: `https://uae7guard.vercel.app`
2. Click **Sign Up**
3. Enter test credentials:
   - Email: `test@example.com`
   - Password: `Test123456`
   - First Name: `Test`
   - Last Name: `User`
4. Click **Create Account**
5. You should be redirected to dashboard

**Test Sign in with Apple (Web):**
1. Sign out from the app
2. Click **Sign In**
3. Click **Sign in with Apple** button
4. Apple popup should appear
5. Sign in with your Apple ID
6. You should be redirected to dashboard

**Test Sign in with Apple (iOS):**
1. Open the iOS app (after syncing with production)
2. Tap **Sign in with Apple**
3. Native Apple Sign In screen should appear
4. Sign in with your Apple ID
5. You should be redirected to dashboard

### 4.3 Verify User Data Sync

1. After signing up, go to Firebase Console → **Authentication** → **Users**
2. You should see your test user listed
3. Check Supabase → **Table Editor** → **users** table
4. Verify the user has a `firebase_uid` matching Firebase

### 4.4 Check Health Endpoint

```bash
curl https://uae7guard.vercel.app/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-01-29T...",
  "database": "connected",
  "uptime": 123.45
}
```

---

## Step 5: Update Mobile App for Production

### 5.1 Update iOS App

1. Open `ios/App/App/GoogleService-Info.plist` in Xcode
2. Ensure it contains your **production** Firebase iOS configuration
3. In Xcode, select your target → **Signing & Capabilities**
4. Verify **Sign in with Apple** capability is added

### 5.2 Update Android App

1. Open `android/app/google-services.json`
2. Ensure it contains your **production** Firebase Android configuration

### 5.3 Sync Capacitor

```bash
# Build the web app with production Firebase config
npm run build

# Sync to iOS and Android
npx cap sync

# Open in Xcode
npx cap open ios

# Open in Android Studio
npx cap open android
```

### 5.4 Test Mobile Apps

**iOS:**
1. Run app on simulator or device
2. Test Sign in with Apple (native flow)
3. Test Email/Password authentication
4. Verify dashboard loads correctly

**Android:**
1. Run app on emulator or device
2. Test Email/Password authentication
3. Verify dashboard loads correctly

---

## Step 6: Production Checklist

Before going live, verify:

### Firebase Setup
- [ ] Firebase project created
- [ ] Web app registered in Firebase
- [ ] iOS app registered in Firebase (with GoogleService-Info.plist)
- [ ] Android app registered in Firebase (with google-services.json)
- [ ] Email/Password authentication enabled
- [ ] Sign in with Apple authentication enabled
- [ ] Production domain added to Authorized domains
- [ ] All Firebase env vars added to Vercel

### Apple Sign In Setup
- [ ] Apple Developer account active
- [ ] Service ID created for Sign in with Apple
- [ ] Return URLs updated with production Firebase URL
- [ ] Private key (.p8 file) uploaded to Firebase
- [ ] Team ID and Key ID configured in Firebase

### Database Setup
- [ ] Supabase database created
- [ ] Schema deployed (with `firebaseUid` field)
- [ ] DATABASE_URL added to Vercel
- [ ] Connection pooler URL used (port 5432)

### Vercel Deployment
- [ ] All 11 environment variables set in Vercel
- [ ] Production deployment successful
- [ ] Health endpoint returns 200 OK
- [ ] Web app loads without console errors
- [ ] Firebase Authentication working on web

### Mobile Apps
- [ ] Production Firebase config files added
- [ ] Capacitor synced with production build
- [ ] iOS app builds successfully
- [ ] Android app builds successfully
- [ ] Sign in with Apple works on iOS
- [ ] Email/Password works on both platforms

### Testing
- [ ] Can sign up with email/password
- [ ] Can sign in with email/password
- [ ] Can sign in with Apple (web)
- [ ] Can sign in with Apple (iOS native)
- [ ] User data syncs to Supabase
- [ ] firebase_uid is stored correctly
- [ ] Profile data loads after login
- [ ] Can sign out successfully

---

## Troubleshooting

### Firebase Configuration Errors

**Error: "Firebase configuration incomplete"**
- **Solution**: Verify all 7 `VITE_FIREBASE_*` variables are set in Vercel
- **Check**: Go to Vercel → Settings → Environment Variables
- **Verify**: All variables are enabled for Production

**Error: "Firebase: Firebase App named '[DEFAULT]' already exists"**
- **Solution**: This is a duplicate initialization error
- **Check**: Ensure `client/src/lib/firebase.ts` only initializes once
- **Fix**: Clear browser cache and reload

### Sign in with Apple Errors

**Error: "auth/invalid-credential" on Apple Sign In**
- **Solution**: Check Apple Developer Portal Service ID configuration
- **Verify**: Return URLs include `https://[project-id].firebaseapp.com/__/auth/handler`
- **Check**: Service ID matches the one configured in Firebase

**Error: Apple popup doesn't open**
- **Solution**: Check Firebase Authorized Domains
- **Verify**: `uae7guard.vercel.app` is in the authorized domains list
- **Clear**: Browser cookies and try again

### Database Sync Errors

**Error: "User sync failed" after Firebase login**
- **Solution**: Check backend API endpoint `/api/auth/firebase/sync`
- **Verify**: Firebase ID token is being sent in the request
- **Check**: Vercel logs for error details:
  ```bash
  vercel logs https://uae7guard.vercel.app --follow
  ```

**Error: "firebaseUid column does not exist"**
- **Solution**: Database schema not updated
- **Fix**: Run database migration:
  ```bash
  export DATABASE_URL="your_supabase_url"
  npm run db:push
  ```

### Vercel Deployment Errors

**Error: Build fails with "MODULE_NOT_FOUND"**
- **Solution**: Missing dependencies
- **Fix**: Ensure `package.json` includes all dependencies
- **Verify**: `firebase` package is in dependencies (not devDependencies)

**Error: Environment variables not loading**
- **Solution**: Redeploy after adding env vars
- **Fix**: Vercel → Deployments → Redeploy
- **Note**: Changes to env vars require redeployment

### Mobile App Errors

**Error: iOS app crashes on Sign in with Apple**
- **Solution**: Missing GoogleService-Info.plist or capability
- **Check**: File exists at `ios/App/App/GoogleService-Info.plist`
- **Verify**: Sign in with Apple capability added in Xcode
- **Rebuild**: Clean build folder and rebuild

**Error: Android app can't connect to Firebase**
- **Solution**: Missing or incorrect google-services.json
- **Check**: File exists at `android/app/google-services.json`
- **Verify**: Package name matches in Firebase and app
- **Sync**: Run `npx cap sync android`

---

## Monitoring & Maintenance

### View Logs

```bash
# View Vercel logs
vercel logs https://uae7guard.vercel.app --follow

# Filter for errors
vercel logs https://uae7guard.vercel.app | grep error

# Filter for Firebase auth
vercel logs https://uae7guard.vercel.app | grep firebase
```

### Monitor Firebase Usage

1. Go to Firebase Console → **Usage and billing**
2. Monitor:
   - Authentication requests
   - Active users
   - Firestore/Realtime Database usage (if used)

### Check Firebase Authentication Logs

1. Go to Firebase Console → **Authentication** → **Users**
2. Monitor new user registrations
3. Check for failed authentication attempts

---

## Security Best Practices

### Environment Variables

- ✅ Never commit `.env` files to git
- ✅ Use different Firebase projects for dev/staging/production
- ✅ Rotate SESSION_SECRET regularly
- ✅ Use strong random values for all secrets

### Firebase Security

- ✅ Enable Firebase Security Rules
- ✅ Set up Firebase App Check to prevent abuse
- ✅ Monitor authentication logs for suspicious activity
- ✅ Enable multi-factor authentication for admin accounts

### Database Security

- ✅ Use connection pooler (not direct connection)
- ✅ Enable Row Level Security (RLS) in Supabase
- ✅ Regularly backup database
- ✅ Monitor for unusual query patterns

---

## Next Steps After Deployment

1. **Monitor Application**
   - Set up error tracking (Sentry, LogRocket)
   - Monitor Firebase quotas
   - Watch Vercel usage metrics

2. **Performance Optimization**
   - Enable Vercel Edge Caching
   - Optimize Firebase queries
   - Implement rate limiting

3. **Mobile App Submission**
   - Build production iOS app
   - Build production Android app
   - Submit to App Store and Google Play

4. **User Documentation**
   - Create user guides
   - Set up support email
   - Prepare FAQ documentation

---

## Support Resources

- **Firebase Documentation**: https://firebase.google.com/docs
- **Vercel Documentation**: https://vercel.com/docs
- **Supabase Documentation**: https://supabase.com/docs
- **Apple Sign In**: https://developer.apple.com/sign-in-with-apple

---

## Summary

Your UAE7Guard app is now deployed to production with Firebase Authentication! 🎉

**What's Live:**
- ✅ Web app at `https://uae7guard.vercel.app`
- ✅ Firebase Authentication (Email/Password + Sign in with Apple)
- ✅ User data syncing to Supabase database
- ✅ Mobile apps ready for iOS and Android

**Production URL**: https://uae7guard.vercel.app

**Next**: Test thoroughly and prepare for App Store submission!
