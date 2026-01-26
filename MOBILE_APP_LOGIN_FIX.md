# Mobile App Login Fix - Network Error Resolution

## Problem Summary / ملخص المشكلة

The mobile app was showing two errors when trying to log in:
1. **"500: Login failed"** - Authentication password mismatch
2. **"Network error. Please check your internet connection"** - Cannot connect to backend server

التطبيق كان يعرض خطأين عند محاولة تسجيل الدخول:
1. **"500: Login failed"** - عدم تطابق كلمة مرور المصادقة
2. **"Network error"** - عدم القدرة على الاتصال بخادم الباك إند

---

## Root Causes / الأسباب الجذرية

### Issue 1: Password Mismatch ❌
**Before Fix:**
- `.env` file: `APPLE_REVIEW_PASSWORD=AppleReview2025!`
- `replitAuth.ts` fallback: `AppleReview2025!`
- `seed.ts` database: `AppleReview2026`
- Documentation: `AppleReview2026`

**Problem:** The bypass authentication used `AppleReview2025!` but the database hash was created with `AppleReview2026`, causing login failures.

### Issue 2: Wrong Backend URL ❌
**Before Fix:**
- Mobile app configured to connect to: `https://uae7guard.com`
- Actual backend hosted on: Replit (different URL)

**Problem:** The mobile app couldn't connect because it was trying to reach the wrong server.

---

## What I Fixed / ما تم إصلاحه

### ✅ Fix 1: Password Consistency
**Files Changed:**
1. `/home/user/UAE7Guard/.env`
   - Changed: `APPLE_REVIEW_PASSWORD=AppleReview2025!`
   - To: `APPLE_REVIEW_PASSWORD=AppleReview2026`

2. `/home/user/UAE7Guard/server/replit_integrations/auth/replitAuth.ts`
   - Changed: `process.env.APPLE_REVIEW_PASSWORD || "AppleReview2025!"`
   - To: `process.env.APPLE_REVIEW_PASSWORD || "AppleReview2026"`

**Result:** Now all password references are consistent with `AppleReview2026`

### ✅ Fix 2: Configurable API URL
**Files Changed:**
1. `/home/user/UAE7Guard/client/src/lib/api-config.ts`
   - Added support for `VITE_API_BASE_URL` environment variable
   - Allows dynamic configuration at build time
   - Falls back to `https://uae7guard.com` if not set

2. `/home/user/UAE7Guard/codemagic.yaml`
   - Added `VITE_API_BASE_URL` environment variable to iOS workflow
   - Added `VITE_API_BASE_URL` environment variable to Android workflow
   - Added `APPLE_REVIEW_PASSWORD` environment variable to both workflows
   - Split build steps to show environment configuration

**Result:** API URL can now be configured per build without code changes

---

## Next Steps Required / الخطوات التالية المطلوبة

### Option A: Deploy Backend to uae7guard.com Domain ✅ RECOMMENDED

If you want to use the custom domain `https://uae7guard.com`:

1. **Set up DNS** to point `uae7guard.com` to your backend server
2. **Deploy the backend** to a hosting service that serves at that domain
3. **Configure SSL certificate** for HTTPS
4. **No Codemagic changes needed** - builds will automatically use the default URL

### Option B: Use Replit Deployment URL 🔧 QUICK FIX

If you want to keep using Replit as your backend:

1. **Find your Replit deployment URL**:
   - Go to your Replit project
   - Click "Deploy" or look for the public URL
   - It should look like: `https://uae7guard-username.repl.co`
   - Or: `https://[repl-id].repl.co`

2. **Update Codemagic Environment Variable**:
   - Go to Codemagic app settings
   - Navigate to Environment Variables
   - Update `VITE_API_BASE_URL` to your Replit URL
   - Example: `VITE_API_BASE_URL=https://uae7guard-m6220505.repl.co`

3. **OR Update codemagic.yaml**:
   ```yaml
   vars:
     VITE_API_BASE_URL: "https://your-repl-url.repl.co"
     APPLE_REVIEW_PASSWORD: "AppleReview2026"
   ```

4. **Ensure Replit backend is running**:
   - Make sure your Replit deployment is active
   - Test the URL: `curl https://your-repl-url.repl.co/api/auth/user`
   - Should return 401 (Unauthorized) - this is correct for unauthenticated requests

5. **Update Capacitor Config** (if needed):
   Edit `/home/user/UAE7Guard/capacitor.config.ts`:
   ```typescript
   server: {
     allowNavigation: [
       'https://uae7guard.com',
       'https://*.uae7guard.com',
       'https://*.repl.co',  // Add this line
       'https://*.replit.app' // Add this line
     ]
   }
   ```

### Option C: Use Replit Reserved Domain 🌐

1. **Set up Replit Reserved Domain**:
   - In Replit, go to your deployment settings
   - Reserve a custom subdomain (e.g., `uae7guard.replit.app`)
   - Update `VITE_API_BASE_URL` to this URL

---

## Testing the Fix / اختبار الإصلاح

### 1. Test Locally (Development)

```bash
# Set the environment variable
export VITE_API_BASE_URL="https://your-backend-url.com"

# Build the app
npm run build

# Sync to mobile platforms
npx cap sync ios

# Open in Xcode and test
npx cap open ios
```

### 2. Test in Codemagic (Production Build)

1. **Update the environment variable** in Codemagic (see Option B above)
2. **Trigger a new build** in Codemagic
3. **Check build logs** to verify the URL:
   ```
   Building with API URL: https://your-backend-url.com
   ```
4. **Download the IPA** from Codemagic
5. **Install on TestFlight** and test login

### 3. Verify Login Works

1. **Open the app** on your device
2. **Enter credentials**:
   - Email: `applereview@uae7guard.com`
   - Password: `AppleReview2026`
3. **Expected result**: Successful login, redirected to dashboard
4. **No more errors**: ✅ No 500 errors, ✅ No network errors

---

## How to Find Your Replit URL / كيفية العثور على رابط Replit الخاص بك

### Method 1: From Replit Dashboard
1. Go to https://replit.com
2. Open your UAE7Guard project
3. Look for "Webview" or "Open in new tab" button
4. The URL in the browser is your Replit URL

### Method 2: From Deployment Tab
1. In your Repl, click on "Deployments" tab
2. Look for the deployment URL
3. Copy the HTTPS URL (e.g., `https://uae7guard.username.repl.co`)

### Method 3: From .replit File
Check the `/home/user/UAE7Guard/.replit` file - it may contain deployment URL information

---

## Troubleshooting / استكشاف الأخطاء وإصلاحها

### Still Getting Network Error?

**Check 1: Is backend accessible?**
```bash
curl -i https://your-backend-url.com/api/auth/user
```
- Expected: HTTP 401 (Unauthorized)
- If you get timeout or connection refused, backend is not accessible

**Check 2: Is VITE_API_BASE_URL set correctly?**
- Check Codemagic build logs
- Should show: "Building with API URL: https://..."

**Check 3: Did you rebuild the app?**
- After changing `VITE_API_BASE_URL`, you MUST rebuild:
  ```bash
  npm run build
  npx cap sync ios
  ```
- Or trigger a new Codemagic build

**Check 4: Clear app cache**
- Uninstall the app completely
- Reinstall from TestFlight or Xcode
- Try logging in again

### Still Getting Login Failed?

**Check 1: Is password consistent?**
```bash
# Check .env file
grep APPLE_REVIEW_PASSWORD /home/user/UAE7Guard/.env
# Should show: APPLE_REVIEW_PASSWORD=AppleReview2026

# Check replitAuth.ts
grep "AppleReview" /home/user/UAE7Guard/server/replit_integrations/auth/replitAuth.ts
# Should show: AppleReview2026
```

**Check 2: Is environment variable in Codemagic?**
- Go to Codemagic → Your App → Environment Variables
- Check if `APPLE_REVIEW_PASSWORD=AppleReview2026` is set

**Check 3: Backend logs**
- Check Replit console logs when you try to login
- Should show: `[AUTH] Apple Review demo login successful`

---

## Summary of Changes / ملخص التغييرات

### Files Modified:
1. ✅ `.env` - Updated password to AppleReview2026
2. ✅ `server/replit_integrations/auth/replitAuth.ts` - Updated fallback password
3. ✅ `client/src/lib/api-config.ts` - Added VITE_API_BASE_URL support
4. ✅ `codemagic.yaml` - Added environment variables for both iOS and Android builds

### Environment Variables Added:
- `VITE_API_BASE_URL` - Backend API URL (configurable per build)
- `APPLE_REVIEW_PASSWORD` - Apple review account password (in Codemagic)

### What You Need to Do:
1. 🔴 **REQUIRED**: Set the correct backend URL
   - Either: Deploy to uae7guard.com domain
   - Or: Update `VITE_API_BASE_URL` to your Replit URL
2. 🔴 **REQUIRED**: Trigger a new Codemagic build with the updated environment variable
3. ✅ **OPTIONAL**: Test locally first before building on Codemagic

---

## Quick Reference / مرجع سريع

### Current Configuration:
```bash
# Demo Account
Email: applereview@uae7guard.com
Password: AppleReview2026

# Default Backend URL (change if needed)
Production: https://uae7guard.com

# Environment Variables in Codemagic
VITE_API_BASE_URL=https://uae7guard.com (or your Replit URL)
APPLE_REVIEW_PASSWORD=AppleReview2026
```

### Build Commands:
```bash
# Local build with custom API URL
VITE_API_BASE_URL=https://your-url.com npm run build

# Sync to mobile
npx cap sync ios

# Open in Xcode
npx cap open ios
```

---

## Contact / التواصل

If you need further assistance:
- Check Codemagic build logs for detailed error messages
- Verify backend is accessible: `curl https://your-backend-url.com/api/auth/user`
- Check mobile app console logs for API request failures

**All fixes have been committed to the codebase. You just need to set the correct backend URL and rebuild.**

✅ **The authentication password is now fixed and consistent**
🔧 **The API URL is now configurable - you need to set it to your actual backend URL**
