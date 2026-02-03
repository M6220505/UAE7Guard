# 🚀 UAE7Guard Deployment Guide - Vercel + Supabase

This guide will help you deploy UAE7Guard to production using **Vercel** (hosting) and **Supabase** (database).

## 📋 Prerequisites

- GitHub account
- Vercel account (free tier available)
- Supabase account (free tier available)

---

## 🗄️ Step 1: Setup Supabase Database

### 1.1 Create Supabase Project

1. Go to [Supabase](https://supabase.com)
2. Click "New Project"
3. Fill in:
   - **Project Name**: `uae7guard`
   - **Database Password**: [Generate strong password]
   - **Region**: Choose closest to your users (e.g., `Singapore` for UAE)
4. Click "Create New Project" (takes ~2 minutes)

### 1.2 Run Database Schema

1. In your Supabase project, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `supabase-schema.sql` (in project root)
4. Paste into the SQL editor
5. Click "Run" or press `Ctrl+Enter`
6. You should see: ✅ "UAE7Guard database schema created successfully!"

### 1.3 Get Database Connection String

1. In Supabase dashboard, go to **Settings** → **Database**
2. Scroll to **Connection String** section
3. Select **URI** tab
4. Copy the connection string (looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres`)
5. Replace `[YOUR-PASSWORD]` with your actual database password
6. Save this - you'll need it for Vercel

**Example:**
```
postgresql://postgres:mySecurePass123@db.abcdefghij.supabase.co:5432/postgres
```

---

## ☁️ Step 2: Deploy to Vercel

### 2.1 Connect GitHub Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository: `UAE7Guard`
4. Click "Import"

### 2.2 Configure Build Settings

Vercel should auto-detect the settings, but verify:

- **Framework Preset**: Other
- **Root Directory**: `./`
- **Build Command**: `npm run build`
- **Output Directory**: `dist/public`
- **Install Command**: `npm install`

### 2.3 Add Environment Variables

Click "Environment Variables" and add these:

| Variable Name | Value | Notes |
|--------------|-------|-------|
| `NODE_ENV` | `production` | Required |
| `DATABASE_URL` | `postgresql://postgres:...` | From Supabase (Step 1.3) |
| `SESSION_SECRET` | [Generate 32+ char secret] | Use: `openssl rand -base64 32` |
| `APPLE_REVIEW_PASSWORD` | `AppleReview2026` | For TestFlight demo account |
| `PORT` | `5000` | Optional (default: 5000) |

**How to generate SESSION_SECRET:**
```bash
# On Mac/Linux:
openssl rand -base64 32

# Example output:
# xK8v3pL9mN4qR7wT2yU5hJ6fG1dS0aZ8
```

### 2.4 Deploy

1. Click "Deploy"
2. Wait 2-3 minutes for build to complete
3. You'll get a URL like: `https://uae7guard.vercel.app`
4. Save this URL - you'll need it for the mobile app

---

## 📱 Step 3: Update Mobile App API URL

### 3.1 Update API Configuration

Edit `client/src/lib/api-config.ts`:

```typescript
// Replace this line:
const PRODUCTION_API_URL = import.meta.env.VITE_API_BASE_URL || 'https://uae7guard-m6220505.repl.co';

// With your Vercel URL:
const PRODUCTION_API_URL = import.meta.env.VITE_API_BASE_URL || 'https://uae7guard.vercel.app';
```

### 3.2 Rebuild Mobile App

```bash
# Build the web app with new API URL
npm run build

# Sync with Capacitor
npx cap sync

# Open in Xcode (iOS)
npx cap open ios

# Open in Android Studio (Android)
npx cap open android
```

### 3.3 Test the App

1. Run the mobile app on simulator/device
2. Try logging in with test account:
   - **Email**: `applereview@uae7guard.com`
   - **Password**: `AppleReview2026`
3. Should work without "Network error" ✅

---

## ✅ Step 4: Verify Deployment

### 4.1 Test Backend Health

Open in browser: `https://your-app.vercel.app/api/health`

Should return:
```json
{
  "status": "ok",
  "timestamp": "2026-01-26T...",
  "environment": "production"
}
```

### 4.2 Test Login API

```bash
curl -X POST https://your-app.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"applereview@uae7guard.com","password":"AppleReview2026"}'
```

Should return:
```json
{
  "success": true,
  "user": {
    "id": "demo-apple-review",
    "email": "applereview@uae7guard.com",
    ...
  }
}
```

---

## 🎯 Production Checklist

- [ ] Supabase database created and schema imported
- [ ] Vercel deployment successful
- [ ] Environment variables configured
- [ ] Health endpoint returns 200 OK
- [ ] Login API works (demo account)
- [ ] Mobile app updated with new API URL
- [ ] Mobile app tested on iOS/Android
- [ ] No "Network error" messages
- [ ] All features working correctly

---

## 🔧 Troubleshooting

### Issue: "Cannot connect to server"

**Solution:**
1. Check Vercel deployment status (should show green checkmark)
2. Visit `https://your-app.vercel.app/api/health` in browser
3. Verify `CORS` is enabled (already configured in `server/index.ts`)

### Issue: "Database connection failed"

**Solution:**
1. Check `DATABASE_URL` environment variable in Vercel
2. Verify password is correct (no special URL encoding needed)
3. Test connection from Supabase SQL Editor

### Issue: "Session not persisting"

**Solution:**
1. Check `SESSION_SECRET` is set in Vercel environment variables
2. Must be at least 32 characters long
3. Ensure `secure: true` in production (already configured)

### Issue: "Build failed on Vercel"

**Solution:**
1. Check build logs in Vercel dashboard
2. Ensure `package.json` scripts are correct
3. Verify Node.js version compatibility (18.x or 20.x)

---

## 📊 Cost Estimate (Free Tier)

| Service | Free Tier | Estimated Monthly Cost |
|---------|-----------|----------------------|
| **Vercel** | 100GB bandwidth | $0 |
| **Supabase** | 500MB database, 2GB bandwidth | $0 |
| **Total** | | **$0/month** |

Perfect for testing and initial launch! 🎉

---

## 🔐 Security Notes

1. **Never commit** `.env` files to git
2. **Rotate** `SESSION_SECRET` every 90 days in production
3. **Use strong passwords** for Supabase database
4. **Enable** Supabase RLS (Row Level Security) for production
5. **Monitor** Vercel logs for suspicious activity

---

## 📚 Next Steps

After successful deployment:

1. **Custom Domain**: Add your domain in Vercel settings
2. **SSL Certificate**: Auto-configured by Vercel
3. **CDN**: Consider Cloudflare (free tier)
4. **Monitoring**: Set up Sentry for error tracking
5. **Analytics**: Add Google Analytics or Mixpanel

---

## 🆘 Support

If you need help:

1. Check Vercel deployment logs
2. Check Supabase logs (Database → Logs)
3. Review `server/utils/logger.ts` for application logs
4. Test API endpoints using Postman/curl

---

**Deployment completed!** 🎉

Your UAE7Guard app is now live on Vercel with Supabase database.
