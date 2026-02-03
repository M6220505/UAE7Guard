# 📱 UAE7Guard Setup for iPhone

## Step 1: Setup Database (From Your iPhone!)

### Option A: Copy Schema Directly

1. **Open Supabase SQL Editor** on your iPhone:
   ```
   https://supabase.com/dashboard/project/rdhuvzfyzoeeiryvegce/sql/new
   ```

2. **Copy the full schema from GitHub:**
   - Go to: https://github.com/[your-username]/UAE7Guard/blob/claude/build-app-m6220505-E7Wke/supabase-schema.sql
   - Tap "Raw" button
   - Select all and copy
   - Paste into Supabase SQL Editor
   - Tap "Run" or press F5

### Option B: Use the Helper Tool (Easiest!)

1. **Open the copy-schema.html file** from the repository on your computer
2. It will have a "Copy Script" button
3. Copy the schema and paste in Supabase

### What You'll Get:
- ✅ 15 database tables created
- ✅ Admin account created
- ✅ Sample data loaded

---

## Step 2: Deploy to Vercel

### From Your iPhone or Computer:

1. **Push code to GitHub** (if not already done):
   ```bash
   git push origin claude/build-app-m6220505-E7Wke
   ```

2. **Open Vercel** on your iPhone:
   ```
   https://vercel.com/new
   ```

3. **Import your GitHub repository:**
   - Select "Import Git Repository"
   - Choose "UAE7Guard"
   - Select branch: `claude/build-app-m6220505-E7Wke`

4. **Add Environment Variables** in Vercel:
   ```
   DATABASE_URL=postgresql://postgres:rdhuvzfyzoeeiryvegce@db.juhpmjixqkpnjkzyxmse.supabase.co:5432/postgres
   SESSION_SECRET=uae7guard-dev-secret-key-change-in-production
   NODE_ENV=production
   APPLE_REVIEW_PASSWORD=AppleReview2026
   ```

5. **Deploy!**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your app will be live at: `https://uae7guard-[random].vercel.app`

---

## Step 3: Access from Your iPhone

1. **Open Safari** on your iPhone
2. **Go to your Vercel URL:**
   ```
   https://uae7guard-[your-url].vercel.app
   ```

3. **Login with demo account:**
   ```
   Email: admin@uae7guard.com
   Password: admin123456
   ```

4. **Add to Home Screen:**
   - Tap Share button in Safari
   - Tap "Add to Home Screen"
   - Now UAE7Guard is an app icon on your iPhone!

---

## 🎉 You're Done!

### Features You Can Use:
- 🛡️ Check blockchain addresses for scams
- 📊 Monitor wallets in real-time
- 🤖 AI-powered security analysis
- 💰 Multi-chain support (ETH, BTC, etc.)
- 🔒 Secure escrow transactions

### Need Help?
- Check Vercel deployment logs
- Check Supabase connection
- Contact support

---

## Troubleshooting

### Database Connection Error:
- Make sure you ran the SQL schema in Supabase
- Check that DATABASE_URL is correct in Vercel environment variables

### Can't Access App:
- Check Vercel deployment status
- Make sure build succeeded
- Try accessing from incognito/private mode

### Login Doesn't Work:
- Make sure database schema was created
- Check that the admin account was created in the schema
- Try resetting your password
