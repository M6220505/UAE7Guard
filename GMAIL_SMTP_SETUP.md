# 📧 Gmail SMTP Setup for UAE7Guard

## Quick Setup (5 minutes)

### Step 1: Create App Password

Google Workspace requires **App Passwords** for SMTP access.

1. Go to: https://myaccount.google.com/security
2. Enable **2-Step Verification** (if not enabled)
3. Go to: https://myaccount.google.com/apppasswords
4. Select:
   - App: **Mail**
   - Device: **Other (Custom name)** → "UAE7Guard"
5. Click **Generate**
6. **Copy the 16-character password** (looks like: `xxxx xxxx xxxx xxxx`)

⚠️ **Save this password** - you won't see it again!

---

### Step 2: Update Environment Variables

Add to `/root/UAE7Guard/.env`:

```bash
# Gmail SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=noreply@uae7guard.com
SMTP_PASSWORD=your_16_char_app_password_here

# Email Addresses
EMAIL_FROM=noreply@uae7guard.com
EMAIL_SUPPORT=support@uae7guard.com
EMAIL_ADMIN=admin@uae7guard.com
```

**Replace:**
- `noreply@uae7guard.com` → Your actual Gmail address
- `your_16_char_app_password_here` → The password from Step 1

---

### Step 3: Test Configuration

```bash
# Test SMTP connection
curl -X POST http://localhost:5000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"to":"your@email.com","subject":"Test","body":"Test email from UAE7Guard"}'
```

---

## Email Addresses Needed

Create these accounts in Google Workspace:

1. **noreply@uae7guard.com** (System emails)
   - Password resets
   - Account notifications
   - Automated alerts

2. **support@uae7guard.com** (Customer support)
   - User inquiries
   - Bug reports
   - Help requests

3. **admin@uae7guard.com** (Internal)
   - Admin notifications
   - System alerts
   - Reports

4. **security@uae7guard.com** (Security)
   - Security reports
   - Vulnerability disclosures
   - Incident notifications

---

## SMTP Settings Reference

**For Gmail/Google Workspace:**

| Setting | Value |
|---------|-------|
| Host | smtp.gmail.com |
| Port | 587 (TLS) or 465 (SSL) |
| Encryption | STARTTLS (587) or SSL (465) |
| Authentication | Required |
| Username | Full email address |
| Password | App Password (16 chars) |

---

## Troubleshooting

### "Invalid credentials" error

**Solution:**
1. Make sure you're using **App Password** (not regular password)
2. Remove spaces from app password
3. Enable "Less secure app access" (if using old Gmail)

### "Connection timeout"

**Solution:**
1. Check port is 587 (not 465)
2. Set `SMTP_SECURE=false` for port 587
3. Check firewall/railway allows port 587

### "Daily sending limit exceeded"

**Solution:**
- Free Gmail: 500 emails/day
- Google Workspace: 2,000 emails/day
- Use SendGrid as backup for high volume

---

## Email Limits

**Google Workspace:**
- 2,000 emails/day per account
- 10,000 emails/day (all accounts combined)
- 500 recipients per email

**Recommendations:**
- Use noreply@ for automated emails
- Use support@ for customer replies
- Spread load across multiple accounts if needed

---

## Security Best Practices

1. **Use App Passwords** (Never use main password)
2. **Enable 2FA** on all accounts
3. **Rotate passwords** every 90 days
4. **Monitor usage** in Gmail admin console
5. **Log all emails** for audit trail

---

## Railway Deployment

Add environment variables in Railway dashboard:

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=noreply@uae7guard.com
SMTP_PASSWORD=xxxx xxxx xxxx xxxx
EMAIL_FROM=noreply@uae7guard.com
```

**Steps:**
1. Railway → Project → Variables
2. Add each variable
3. Restart service
4. Test email sending

---

## Testing Checklist

- [ ] App password generated
- [ ] Environment variables updated
- [ ] SMTP connection successful
- [ ] Test email received
- [ ] Password reset email works
- [ ] Alert notifications work
- [ ] No spam folder issues

---

## Email Templates Ready

We've created professional email templates for:
- ✅ Welcome email
- ✅ Password reset
- ✅ Email verification
- ✅ Scam alert notifications
- ✅ Subscription confirmations

All templates are branded and responsive!

---

## Cost

**Google Workspace:**
- $6/user/month
- 3 users needed (noreply, support, admin)
- **Total: $18/month**

**Alternative (FREE):**
- Use personal Gmail + App Password
- Limited to 500 emails/day
- Good for testing/MVP

---

## Quick Start Commands

```bash
# 1. Update .env with Gmail credentials
nano /root/UAE7Guard/.env

# 2. Add these lines:
echo "SMTP_HOST=smtp.gmail.com" >> .env
echo "SMTP_PORT=587" >> .env
echo "SMTP_USER=noreply@uae7guard.com" >> .env
echo "SMTP_PASSWORD=your_app_password" >> .env

# 3. Restart server
npm run dev

# 4. Test
curl -X POST http://localhost:5000/api/test-email
```

---

## Support

**Need help?**
- Google Workspace Admin: https://admin.google.com
- App Passwords: https://myaccount.google.com/apppasswords
- SMTP Issues: Check Railway logs

**Common issues resolved in docs above!**
