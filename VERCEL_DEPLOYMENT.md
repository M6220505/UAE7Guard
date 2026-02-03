# Vercel Deployment Guide for UAE7Guard

## Quick Start Deployment

### Step 1: Prerequisites
- ✅ GitHub repository with UAE7Guard code
- ✅ Vercel account (free or pro)
- ✅ Supabase account with database created
- ✅ SendGrid account with API key

### Step 2: Database Setup (Supabase)

1. **Create Supabase Project**
   - Go to https://supabase.com/dashboard
   - Click "New Project"
   - Fill in project details
   - Wait for database to initialize (~2 minutes)

2. **Get Database Connection String**
   - Go to Project Settings → Database
   - Scroll to "Connection string" section
   - Select "URI" format
   - Copy the connection pooler URL:
     ```
     postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres
     ```

3. **Run Database Schema**
   - Go to SQL Editor in Supabase Dashboard
   - Click "New Query"
   - Copy contents of `supabase-schema.sql` from repository
   - Click "Run"
   - Verify all tables created successfully

4. **Create Demo Users** (Optional but Recommended)
   ```bash
   # On your local machine:
   export DATABASE_URL="your_supabase_connection_string"
   npm install
   npm run db:setup
   ```

### Step 3: Configure Environment Variables

**Required Variables for Vercel:**

| Variable | Where to Get | Example Value |
|----------|--------------|---------------|
| `DATABASE_URL` | Supabase → Settings → Database | `postgresql://postgres.[ref]:[pass]@...` |
| `SESSION_SECRET` | Generate: `openssl rand -base64 32` | `xK8v3pL9mN4qR7wT2yU5...` |
| `APPLE_REVIEW_PASSWORD` | Set your own | `AppleReview2026` |
| `NODE_ENV` | Set manually | `production` |
| `SENDGRID_API_KEY` | SendGrid Dashboard → API Keys | `SG.xxxxx` |
| `SENDGRID_FROM_EMAIL` | Your verified email | `noreply@uae7guard.com` |
| `SENDGRID_FROM_NAME` | Your app name | `UAE7Guard` |

**Optional Variables:**

| Variable | Purpose | Where to Get |
|----------|---------|--------------|
| `ALCHEMY_API_KEY` | Blockchain features | https://dashboard.alchemy.com |
| `OPENAI_API_KEY` | AI chat assistant | https://platform.openai.com/api-keys |
| `STRIPE_SECRET_KEY` | Payment processing | https://dashboard.stripe.com/apikeys |
| `STRIPE_PUBLISHABLE_KEY` | Payment processing | https://dashboard.stripe.com/apikeys |

### Step 4: Deploy to Vercel

#### Option A: Via Vercel Dashboard (Recommended)

1. **Connect Repository**
   - Go to https://vercel.com/dashboard
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Select "UAE7Guard"

2. **Configure Build Settings**
   ```
   Framework Preset: Other
   Build Command: npm run build
   Output Directory: dist/public
   Install Command: npm install
   ```

3. **Add Environment Variables**
   - Click "Environment Variables"
   - Add each variable from the table above
   - For each variable, select: ✅ Production ✅ Preview ✅ Development
   - Click "Deploy"

4. **Wait for Deployment**
   - First deployment takes ~3-5 minutes
   - Watch build logs for any errors
   - Note your deployment URL: `https://uae7guard.vercel.app`

#### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Link to existing project or create new
# - Set production: Yes
# - Environment variables will be prompted

# Add environment variables
vercel env add DATABASE_URL production
# Paste your Supabase URL when prompted

vercel env add SESSION_SECRET production
# Generate and paste: openssl rand -base64 32

vercel env add NODE_ENV production
# Type: production

# Deploy to production
vercel --prod
```

### Step 5: Verify Deployment

1. **Health Check**
   ```bash
   curl https://uae7guard.vercel.app/api/health
   ```

   Expected response:
   ```json
   {
     "status": "ok",
     "timestamp": "2024-01-28T...",
     "database": "connected",
     "uptime": 123.45
   }
   ```

2. **Test Login**
   - Go to: `https://uae7guard.vercel.app`
   - Click "Sign In"
   - Use demo account:
     - Email: `admin@uae7guard.com`
     - Password: `admin123456`
   - Should successfully log in

3. **Check Logs**
   ```bash
   # View real-time logs
   vercel logs https://uae7guard.vercel.app --follow
   ```

### Step 6: Update Mobile App Configuration

1. **Update API URL**
   ```bash
   # Edit client/src/lib/api-config.ts
   const PRODUCTION_API_URL = 'https://uae7guard.vercel.app';
   ```

2. **Update Capacitor Config**
   ```typescript
   // Edit capacitor.config.ts
   allowNavigation: [
     'https://uae7guard.vercel.app',
     'https://*.vercel.app',
     'capacitor://localhost'
   ]
   ```

3. **Rebuild Mobile Apps**
   ```bash
   npm run build
   npx cap sync
   npx cap open ios
   npx cap open android
   ```

### Step 7: Custom Domain (Optional)

1. **Add Domain in Vercel**
   - Go to Project Settings → Domains
   - Click "Add"
   - Enter your domain: `uae7guard.com`
   - Follow DNS configuration instructions

2. **Configure DNS**
   - Add CNAME record:
     ```
     Type: CNAME
     Name: @
     Value: cname.vercel-dns.com
     ```
   - Add CNAME for www:
     ```
     Type: CNAME
     Name: www
     Value: cname.vercel-dns.com
     ```

3. **Update Environment Variables**
   ```bash
   vercel env add APP_URL production
   # Enter: https://uae7guard.com
   ```

4. **Redeploy**
   ```bash
   vercel --prod
   ```

## SendGrid Configuration

### Step 1: Create SendGrid Account
1. Go to https://sendgrid.com
2. Sign up for free account (100 emails/day)
3. Verify your email address

### Step 2: Get API Key
1. Go to https://app.sendgrid.com/settings/api_keys
2. Click "Create API Key"
3. Name: `UAE7Guard Production`
4. Permissions: "Full Access"
5. Copy the API key (save it securely!)

### Step 3: Verify Sender Email
1. Go to Settings → Sender Authentication
2. Click "Verify a Single Sender"
3. Fill in details:
   - From Name: `UAE7Guard`
   - From Email: `noreply@uae7guard.com`
   - Reply To: `support@uae7guard.com`
4. Check your email and verify

### Step 4: Add to Vercel
```bash
vercel env add SENDGRID_API_KEY production
# Paste your SendGrid API key

vercel env add SENDGRID_FROM_EMAIL production
# Enter: noreply@uae7guard.com

vercel env add SENDGRID_FROM_NAME production
# Enter: UAE7Guard
```

### Step 5: Test Email Sending
```bash
curl -X POST https://uae7guard.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456",
    "username": "testuser"
  }'
```

Check if welcome email is received.

## Troubleshooting

### Build Fails

**Error: Cannot find module**
```bash
# Solution: Check package.json dependencies
npm install
npm run build
```

**Error: TypeScript errors**
```bash
# Solution: Fix TypeScript errors
npm run check
```

### Database Connection Fails

**Error: Database connection failed**
1. Verify DATABASE_URL is correct
2. Check Supabase project is running
3. Ensure using Connection Pooler URL (port 5432)
4. Test connection locally:
   ```bash
   export DATABASE_URL="your_url"
   npm run db:push
   ```

### Health Endpoint Returns 500

1. **Check Logs**
   ```bash
   vercel logs --follow
   ```

2. **Common Issues**
   - Missing SESSION_SECRET
   - Invalid DATABASE_URL
   - Database schema not created

3. **Verify Environment Variables**
   ```bash
   vercel env ls
   ```

### Mobile App Can't Connect

1. **Check API URL in api-config.ts**
   ```typescript
   const PRODUCTION_API_URL = 'https://uae7guard.vercel.app';
   ```

2. **Verify CORS Settings**
   - Check vercel.json has correct CORS headers
   - Ensure `capacitor://localhost` is in CORS_ALLOWED_ORIGINS

3. **Rebuild and Sync**
   ```bash
   npm run build
   npx cap sync
   ```

### SendGrid Emails Not Sending

1. **Verify API Key**
   ```bash
   curl -X POST https://api.sendgrid.com/v3/mail/send \
     -H "Authorization: Bearer YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "personalizations": [{"to": [{"email": "test@example.com"}]}],
       "from": {"email": "noreply@uae7guard.com"},
       "subject": "Test",
       "content": [{"type": "text/plain", "value": "Test"}]
     }'
   ```

2. **Check Sender Verification**
   - Ensure `noreply@uae7guard.com` is verified in SendGrid

3. **Check Logs**
   ```bash
   vercel logs --follow | grep sendgrid
   ```

## Maintenance

### Update Environment Variables
```bash
# Add new variable
vercel env add NEW_VAR production

# Remove variable
vercel env rm OLD_VAR production

# Pull environment variables locally
vercel env pull .env.local
```

### Redeploy
```bash
# Redeploy latest commit
vercel --prod

# Redeploy specific commit
vercel --prod --force
```

### Monitor Application
```bash
# View logs
vercel logs --follow

# View deployment info
vercel inspect https://uae7guard.vercel.app
```

### Database Backups
```bash
# Backup database (run locally)
export DATABASE_URL="your_supabase_url"
pg_dump $DATABASE_URL > backup.sql

# Or use Supabase Dashboard → Database → Backups
```

## Production Checklist

- [ ] Database schema created in Supabase
- [ ] All required environment variables set in Vercel
- [ ] SendGrid API key configured and sender verified
- [ ] Deployment successful (no build errors)
- [ ] Health endpoint returns 200 OK
- [ ] Can login with demo account
- [ ] Mobile app API URL updated
- [ ] Mobile apps rebuilt and synced
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active (automatic with Vercel)
- [ ] Email sending tested
- [ ] Logs monitored for errors

## Support

If you encounter issues:

1. **Check Logs**: `vercel logs --follow`
2. **Review Health**: `curl https://your-domain.com/api/health`
3. **Test Database**: `npm run db:push` locally
4. **Verify Env Vars**: `vercel env ls`

For more help:
- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- SendGrid Docs: https://docs.sendgrid.com

## Next Steps

After deployment:
1. ✅ Test all features thoroughly
2. ✅ Monitor application logs daily
3. ✅ Set up error tracking (Sentry)
4. ✅ Configure automated backups
5. ✅ Deploy mobile apps to stores
6. ✅ Set up CI/CD pipeline
7. ✅ Configure monitoring alerts

Your UAE7Guard application is now live! 🎉
