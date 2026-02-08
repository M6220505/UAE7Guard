# 🚂 Railway Custom Domain Setup

## Steps to Connect uae7guard.com to Railway

### 1. Get Railway Domain Settings

1. Go to: https://railway.app/project/YOUR_PROJECT
2. Click on your service (web-production-...)
3. Go to **Settings** tab
4. Scroll to **Domains** section
5. Click **+ Custom Domain**
6. Enter: `uae7guard.com`
7. Railway will show you DNS records to add

### 2. Expected DNS Records

Railway will ask you to add these records to your domain registrar:

**A Record (Root Domain):**
```
Type: A
Name: @
Value: [Railway IP - they'll provide]
TTL: 3600
```

**CNAME Record (www subdomain):**
```
Type: CNAME
Name: www
Value: [your-app].up.railway.app
TTL: 3600
```

### 3. Where to Add DNS Records

**If domain is on:**

**Namecheap:**
1. Login → Domain List → Manage
2. Advanced DNS
3. Add New Record

**GoDaddy:**
1. My Products → DNS
2. Add Record

**Cloudflare:**
1. DNS → Records
2. Add Record

**Google Domains:**
1. DNS → Custom Records
2. Create new record

### 4. Verify Setup

After adding DNS records (takes 5-60 minutes):

```bash
# Check DNS propagation
nslookup uae7guard.com

# Should return Railway IP
```

### 5. SSL Certificate

Railway automatically provisions SSL certificate via Let's Encrypt.
HTTPS will work within 5-10 minutes after DNS propagation.

---

## Current Setup

**Railway Deployment:**
- URL: https://web-production-2731e.up.railway.app
- Status: ✅ Live

**Domain:**
- uae7guard.com
- Currently pointing to: (check with your registrar)

---

## Quick Commands

```bash
# Check current DNS
curl -I https://uae7guard.com

# Check Railway health
curl https://web-production-2731e.up.railway.app/api/health

# After setup, should work:
curl https://uae7guard.com/api/health
```

---

## Troubleshooting

**DNS not updating?**
- Wait 30-60 minutes (propagation time)
- Clear browser cache (Cmd+Shift+R)
- Try incognito mode

**SSL errors?**
- Wait 10 minutes after DNS propagates
- Railway auto-provisions certificates
- Check Railway logs for errors

**Still not working?**
- Verify DNS records exactly match Railway's requirements
- Check Railway service is running
- Contact Railway support if needed
