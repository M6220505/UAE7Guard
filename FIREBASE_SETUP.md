# Firebase Authentication Setup Guide

This guide will help you set up Firebase Authentication for UAE7Guard with Sign in with Apple and Email/Password authentication.

## Prerequisites

- Google/Gmail account
- Apple Developer Account (for Sign in with Apple)
- UAE7Guard project with Firebase integration code (already implemented)

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project" or "Add project"
3. Enter project name: `UAE7Guard` (or your preferred name)
4. Disable Google Analytics (optional, you can enable it later)
5. Click "Create project"
6. Wait for the project to be created

## Step 2: Register Your Web App

1. In the Firebase Console, click the **Web icon** (`</>`) to add a web app
2. Enter app nickname: `UAE7Guard Web`
3. **Check** "Also set up Firebase Hosting" (optional)
4. Click "Register app"
5. You'll see your Firebase configuration - **SAVE THESE VALUES**:
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
6. Click "Continue to console"

## Step 3: Enable Authentication Methods

### Enable Email/Password Authentication

1. In the Firebase Console, go to **Authentication**
2. Click "Get started" (if first time)
3. Go to **Sign-in method** tab
4. Click on **Email/Password**
5. Enable the first toggle: "Email/Password"
6. Keep "Email link (passwordless sign-in)" disabled for now
7. Click "Save"

### Enable Sign in with Apple

1. Still in **Sign-in method** tab, click **Apple**
2. Enable the toggle
3. You'll need to provide:
   - **Service ID**: Create one in Apple Developer Portal
   - **Team ID**: Found in Apple Developer Account
   - **Key ID**: From Apple Developer Portal
   - **Private Key**: Download from Apple Developer Portal

#### How to Get Apple Sign In Credentials:

1. Go to [Apple Developer Portal](https://developer.apple.com/account)
2. Navigate to **Certificates, Identifiers & Profiles**
3. Click **Identifiers** → **App IDs**
4. Create or select your app ID
5. Enable "Sign in with Apple"
6. Click **Identifiers** → **Service IDs**
7. Create a new Service ID:
   - Description: `UAE7Guard Sign in with Apple`
   - Identifier: `com.uae7guard.signin` (or your bundle ID)
   - Enable "Sign in with Apple"
   - Configure:
     - Primary App ID: Your app's bundle ID
     - Domains: `uae7guard-xxxxx.firebaseapp.com`
     - Return URLs: `https://uae7guard-xxxxx.firebaseapp.com/__/auth/handler`
       (Replace `uae7guard-xxxxx` with your Firebase project ID)
8. Click **Keys** → **+** (Create new key)
9. Key Name: `UAE7Guard Apple Auth Key`
10. Enable "Sign in with Apple"
11. Configure → Select your Primary App ID
12. Download the `.p8` key file - **YOU CAN ONLY DOWNLOAD THIS ONCE**
13. Save the **Key ID** (shown on the page)

#### Complete Firebase Apple Setup:

1. Back in Firebase Console, enter:
   - **Service ID**: `com.uae7guard.signin`
   - **Team ID**: Found in Apple Developer → Membership page (10-character ID)
   - **Key ID**: From the key you created
   - **Private Key**: Open the `.p8` file and copy the entire contents
2. Click "Save"

## Step 4: Configure Firebase for iOS

1. In Firebase Console, click the **iOS icon** to add an iOS app
2. Enter iOS Bundle ID: `com.uae7guard.app` (must match your Capacitor app)
3. Enter App Nickname: `UAE7Guard iOS`
4. Download `GoogleService-Info.plist`
5. Place this file in `/ios/App/App/GoogleService-Info.plist`
6. Click "Next" → "Continue to console"

## Step 5: Configure Firebase for Android

1. In Firebase Console, click the **Android icon** to add an Android app
2. Enter Android package name: `com.uae7guard.app` (must match your Capacitor app)
3. Download `google-services.json`
4. Place this file in `/android/app/google-services.json`
5. Click "Next" → "Continue to console"

## Step 6: Add Firebase Config to UAE7Guard

1. Open `.env` file in the project root
2. Add the Firebase configuration values from Step 2:

```bash
# Firebase Configuration (REQUIRED for authentication)
VITE_FIREBASE_API_KEY="AIzaSy..."
VITE_FIREBASE_AUTH_DOMAIN="uae7guard-xxxxx.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="uae7guard-xxxxx"
VITE_FIREBASE_STORAGE_BUCKET="uae7guard-xxxxx.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="123456789"
VITE_FIREBASE_APP_ID="1:123456789:web:abcdef"
VITE_FIREBASE_MEASUREMENT_ID="G-XXXXXXXXX"
```

3. Save the file

## Step 7: Update Database Schema

Run the following command to add the `firebaseUid` field to your users table:

```bash
npm run db:push
```

If you get a network error, make sure your database is accessible.

## Step 8: Test Firebase Authentication

### Test Web App (Development)

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open `http://localhost:5173` in your browser

3. Test Email/Password Sign Up:
   - Go to Sign Up page
   - Fill in your details
   - Click "Create Account"
   - You should be redirected to the dashboard

4. Test Email/Password Login:
   - Sign out
   - Go to Login page
   - Enter your credentials
   - Click "Sign In"
   - You should be redirected to the dashboard

5. Test Sign in with Apple (Web):
   - Sign out
   - Go to Login page
   - Click "Sign in with Apple"
   - You'll see an Apple popup
   - Sign in with your Apple ID
   - You should be redirected to the dashboard

### Test iOS App

1. Build the iOS app:
   ```bash
   npm run cap:build
   npm run cap:open:ios
   ```

2. In Xcode:
   - Ensure `GoogleService-Info.plist` is in the project
   - Add Sign in with Apple capability:
     - Select your target
     - Go to "Signing & Capabilities"
     - Click "+ Capability"
     - Add "Sign in with Apple"
   - Run the app on a simulator or device

3. Test Sign in with Apple (iOS):
   - Open the app
   - Tap "Sign in with Apple"
   - You'll see the native Apple Sign In screen
   - Sign in with your Apple ID
   - You should be redirected to the dashboard

4. Test Email/Password on iOS:
   - Sign out
   - Enter email and password
   - Tap "Sign In"
   - You should be redirected to the dashboard

## Step 9: Verify User Data in Firebase

1. Go to Firebase Console → Authentication → Users
2. You should see all users who signed up
3. Verify that users have:
   - UID (Firebase User ID)
   - Email
   - Provider (apple.com or password)
   - Created date

## Step 10: Verify User Data in Your Database

1. Check your PostgreSQL database
2. Run this query:
   ```sql
   SELECT id, firebase_uid, email, first_name, last_name, created_at
   FROM users
   ORDER BY created_at DESC;
   ```
3. Verify that:
   - `firebase_uid` matches the Firebase UID
   - User data is correctly synced

## Troubleshooting

### "Firebase configuration incomplete" Error

- Make sure all `VITE_FIREBASE_*` variables are set in `.env`
- Restart the dev server after updating `.env`

### "Sign in with Apple" Not Working on Web

- Check that your Firebase project has the correct Service ID
- Verify that the Return URL in Apple Developer matches Firebase's auth handler URL
- Try clearing cookies and cache

### "Sign in with Apple" Not Working on iOS

- Ensure `GoogleService-Info.plist` is in the Xcode project
- Verify that Sign in with Apple capability is added in Xcode
- Check that the Bundle ID matches exactly in:
  - Firebase Console
  - Apple Developer Portal
  - Xcode project
  - `capacitor.config.ts`

### Database Sync Failing

- Check that `firebaseUid` field was added to the database schema
- Verify that the backend endpoint `/api/auth/firebase/sync` is working
- Check browser console for error messages

### Users Not Appearing in Database

- Check that the Firebase ID token is being sent correctly
- Verify that the `/api/auth/firebase/sync` endpoint is returning user data
- Check server logs for errors

## Security Best Practices

1. **Never commit `.env` to git** - It's already in `.gitignore`
2. **Use environment variables** for all Firebase config in production
3. **Enable Firebase Security Rules** to protect user data
4. **Set up Firebase App Check** to prevent abuse
5. **Implement rate limiting** on authentication endpoints (already done)

## Production Deployment

When deploying to production:

1. Set all `VITE_FIREBASE_*` environment variables in your hosting platform:
   - Vercel: Project Settings → Environment Variables
   - Netlify: Site Settings → Environment Variables
   - Railway: Variables → New Variable

2. Update Firebase authorized domains:
   - Firebase Console → Authentication → Settings → Authorized domains
   - Add your production domain (e.g., `uae7guard.com`)

3. Update Apple Sign In Return URLs:
   - Apple Developer Portal → Service IDs → Configure
   - Add production callback URL:
     `https://uae7guard-xxxxx.firebaseapp.com/__/auth/handler`

4. Test thoroughly in production environment

## Additional Resources

- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [Sign in with Apple Documentation](https://developer.apple.com/documentation/sign_in_with_apple)
- [Capacitor Firebase Plugin](https://github.com/capacitor-community/firebase)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)

## Support

If you encounter issues:

1. Check Firebase Console for error logs
2. Check browser console for client-side errors
3. Check server logs for backend errors
4. Verify all configuration steps were completed
5. Check that database schema was updated

---

**You're all set!** Your UAE7Guard app now has Firebase Authentication with Sign in with Apple and Email/Password support. Users can seamlessly authenticate across web and mobile platforms with a secure, Apple-approved authentication system.
