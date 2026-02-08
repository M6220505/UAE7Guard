# 🚂 UAE7Guard - Complete Railway Setup

## ✅ What You Have:
- ✅ Database: Railway PostgreSQL
- ✅ Email: admin@uae7guard.com (Google Workspace)
- ✅ Domain: uae7guard.com (ready to connect)

---

## 📋 Complete Environment Variables

Copy ALL these to Railway → Variables:

```bash
# === DATABASE ===
DATABASE_URL=postgresql://postgres:TNIPYYeVqAIVCWnhISZYUBgzIKIbcuCT@turntable.proxy.rlwy.net:15072/railway

# === SESSION ===
SESSION_SECRET=uae7guard_super_secret_key_2026_production

# === EMAIL (Gmail SMTP) ===
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=admin@uae7guard.com
SMTP_PASSWORD=YOUR_APP_PASSWORD_HERE
EMAIL_FROM=admin@uae7guard.com
EMAIL_SUPPORT=admin@uae7guard.com
EMAIL_ADMIN=admin@uae7guard.com
EMAIL_ENABLED=true
EMAIL_PROVIDER=gmail

# === BLOCKCHAIN APIs ===
ALCHEMY_API_KEY=your_alchemy_key_here
ETHERSCAN_API_KEY=your_etherscan_key_here

# === AI (OpenAI) ===
AI_INTEGRATIONS_OPENAI_API_KEY=your_openai_key_here
AI_INTEGRATIONS_OPENAI_BASE_URL=https://api.openai.com/v1

# === STRIPE (Payment) ===
STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key

# === ENVIRONMENT ===
NODE_ENV=production
PORT=5000
```

---

## 🔑 Keys You Need to Get:

### 1. Email App Password (REQUIRED - 2 min)
```
1. Login: admin@uae7guard.com
2. https://myaccount.google.com/apppasswords
3. Generate for "UAE7Guard"
4. Copy password
5. Replace SMTP_PASSWORD above
```

### 2. Alchemy API Key (Blockchain - Optional)
```
1. https://www.alchemy.com
2. Create account (FREE)
3. Create app (Ethereum Mainnet)
4. Copy API Key
5. Add to ALCHEMY_API_KEY
```

### 3. OpenAI API Key (AI Analysis - Optional)
```
1. https://platform.openai.com
2. Create API Key
3. Add to AI_INTEGRATIONS_OPENAI_API_KEY
```

### 4. Stripe Keys (Payments - Optional)
```
1. https://stripe.com
2. Get test keys from Dashboard
3. Add to STRIPE_SECRET_KEY and STRIPE_PUBLISHABLE_KEY
```

---

## 🚀 Railway Setup Steps

### Step 1: Add Variables (5 min)

**Option A: Manual (Recommended)**
```
1. railway.app → Login
2. Select UAE7Guard project
3. Click service (web-production-...)
4. Variables tab
5. + New Variable
6. Copy/paste each variable (name = value)
7. Repeat for all variables
```

**Option B: CLI (Faster)**
```bash
cd /root/UAE7Guard
railway login
railway link
# Then add variables one by one:
railway variables set DATABASE_URL="postgresql://..."
railway variables set SMTP_PASSWORD="your_password"
# etc...
```

---

### Step 2: Connect Domain (5 min)

```
1. Railway → Settings → Domains
2. + Custom Domain
3. Enter: uae7guard.com
4. Copy DNS records Railway gives you
5. Add to your domain registrar (Namecheap/GoDaddy/etc)
6. Wait 30-60 minutes for DNS propagation
```

**Expected DNS Records:**
```
Type: A
Name: @
Value: [Railway IP]

Type: CNAME
Name: www
Value: [your-app].up.railway.app
```

---

### Step 3: Test Everything (10 min)

**1. Check Health:**
```bash
curl https://web-production-2731e.up.railway.app/api/health
# Should return: {"status":"ok"}
```

**2. Test Database:**
```bash
curl https://web-production-2731e.up.railway.app/api/stats/real
# Should return statistics
```

**3. Test Email:**
```bash
curl -X POST https://web-production-2731e.up.railway.app/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"to":"YOUR_EMAIL","type":"welcome"}'
# Check your inbox!
```

**4. Test Landing Page:**
```
Open browser: https://web-production-2731e.up.railway.app
Should see landing page!
```

---

## ✅ Deployment Checklist

**Required (Must Have):**
- [x] DATABASE_URL ✅ (You have it!)
- [ ] SESSION_SECRET (generate random string)
- [ ] SMTP_PASSWORD (get from Google)
- [ ] NODE_ENV=production

**Optional (Can add later):**
- [ ] ALCHEMY_API_KEY (for blockchain features)
- [ ] AI_INTEGRATIONS_OPENAI_API_KEY (for AI analysis)
- [ ] STRIPE keys (for payments)

**Minimum to work:**
Just add SESSION_SECRET and SMTP_PASSWORD!

---

## 🎯 Priority Setup (15 minutes)

**Do these NOW:**

1. **Add Required Variables** (5 min)
   - DATABASE_URL ✅ (already have)
   - SESSION_SECRET (copy from below)
   - SMTP_PASSWORD (get from Google)

2. **Test Basic Functionality** (5 min)
   - Health check
   - Database connection
   - Email sending

3. **Optional: Add Domain** (5 min)
   - Connect uae7guard.com
   - Add DNS records
   - Wait for SSL

---

## 🔐 Generate SESSION_SECRET

Run this to generate a secure random key:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Or use this one:
```
uae7guard_production_secret_key_$(date +%s)_secure
```

---

## 📊 After Setup - What Works:

✅ **Landing Page** (/)
✅ **Health Check** (/api/health)
✅ **Statistics** (/api/stats/real)
✅ **Case Studies** (/api/case-studies)
✅ **Pricing Plans** (/api/pricing/plans)
✅ **Email System** (password resets, alerts)
✅ **Database** (user data, reports)

**With Alchemy:**
✅ Blockchain verification
✅ Wallet analysis
✅ Live monitoring

**With OpenAI:**
✅ AI-powered scam detection
✅ Risk analysis
✅ Smart recommendations

**With Stripe:**
✅ Subscription payments
✅ Plan upgrades
✅ Billing management

---

## 🆘 Troubleshooting

**Deployment failed?**
- Check Railway logs
- Verify DATABASE_URL is correct
- Make sure NODE_ENV=production

**Emails not sending?**
- Test connection endpoint first
- Check SMTP_PASSWORD is correct
- Verify admin@uae7guard.com can send emails

**Database errors?**
- Check DATABASE_URL format
- Verify PostgreSQL is running
- Run migrations if needed

---

## 📞 Support

**Railway Issues:**
- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway

**UAE7Guard Issues:**
- Logs: `railway logs`
- GitHub: Check commits
- This file: RAILWAY_COMPLETE_SETUP.md

---

## 🎉 You're Almost There!

Just need:
1. ✅ Database URL (you have it!)
2. ⏳ Email App Password (2 min)
3. ⏳ Add to Railway Variables (5 min)
4. ✅ Test (2 min)

**Total: 10 minutes to production!** 🚀
