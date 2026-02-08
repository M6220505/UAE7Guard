# 📧 UAE7Guard Email Quick Setup (5 Minutes)

## Your Emails:
- ✅ **noreply@uae7guard.com** (System emails)
- ✅ **support@uae7guard.com** (Customer support)
- ✅ **admin@uae7guard.com** (Internal/admin)

---

## 🚀 Quick Setup (Follow These Steps)

### Step 1: Get App Passwords (2 minutes)

**For noreply@uae7guard.com:**
1. Login to noreply@uae7guard.com
2. Go to: https://myaccount.google.com/apppasswords
3. App: **Mail** | Device: **UAE7Guard**
4. Click **Generate**
5. Copy password: `xxxx xxxx xxxx xxxx`
6. Save it somewhere safe!

**Repeat for support@ and admin@** (if you want to send from them later)

---

### Step 2: Add to Railway (1 minute)

1. Go to: https://railway.app
2. Your Project → **Variables** tab
3. Click **+ New Variable**
4. Add these (one by one):

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=noreply@uae7guard.com
SMTP_PASSWORD=xxxx xxxx xxxx xxxx  # Your app password from Step 1

EMAIL_FROM=noreply@uae7guard.com
EMAIL_SUPPORT=support@uae7guard.com
EMAIL_ADMIN=admin@uae7guard.com
EMAIL_ENABLED=true
```

5. Click **Deploy** (restart automatically)

---

### Step 3: Test It! (1 minute)

Wait 2-3 minutes for Railway to deploy, then:

```bash
# Test connection
curl -X POST https://uae7guard.com/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"type":"connection"}'

# Send test email to yourself
curl -X POST https://uae7guard.com/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"to":"YOUR_PERSONAL_EMAIL@gmail.com","type":"welcome"}'
```

✅ Check your inbox! You should receive a welcome email.

---

## 📨 Email Usage

### noreply@uae7guard.com (Automated - Don't Check Inbox)
**Used for:**
- ✉️ Password reset emails
- ✉️ Email verification links
- ✉️ Scam alert notifications
- ✉️ Subscription confirmations

**Setup:** App Password → Railway
**Check inbox:** NO (it's noreply!)

---

### support@uae7guard.com (Customer Support - Check Daily!)
**Used for:**
- 💬 Customer questions
- 🐛 Bug reports
- 💡 Feature requests
- 🆘 Help inquiries

**Setup:** Receive emails in Gmail
**Check inbox:** YES! Reply to customers here

**How to check:**
1. Login to Gmail as support@uae7guard.com
2. Reply to customer emails
3. Use professional signature (see below)

---

### admin@uae7guard.com (Internal - Check Weekly)
**Used for:**
- 🔔 Admin notifications
- 📊 System reports
- ⚠️ Critical alerts
- 🔐 Security notifications

**Setup:** Receive emails in Gmail
**Check inbox:** YES (for internal team)

---

## 📧 Email Signatures

### For support@uae7guard.com:

```
---
Best regards,
Support Team
UAE7Guard

📧 support@uae7guard.com
🌐 https://uae7guard.com
🛡️ Enterprise Crypto Fraud Detection

Protecting your digital assets since 2026
```

### For admin@uae7guard.com:

```
---
UAE7Guard Team
admin@uae7guard.com
https://uae7guard.com
```

---

## 🧪 Testing Commands

**Test SMTP connection:**
```bash
curl -X POST https://uae7guard.com/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"type":"connection"}'

# Expected: {"success":true,"message":"SMTP connection successful"}
```

**Send welcome email:**
```bash
curl -X POST https://uae7guard.com/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"to":"your@email.com","type":"welcome"}'

# Check your inbox!
```

**Send test email:**
```bash
curl -X POST https://uae7guard.com/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"to":"your@email.com","type":"test"}'
```

---

## 🔒 Security Tips

1. **Never share App Passwords** - they're like passwords!
2. **Enable 2FA** on all 3 Gmail accounts
3. **Use strong passwords** for Gmail login
4. **Rotate App Passwords** every 90 days
5. **Monitor "Sent" folder** in noreply@ for suspicious activity

---

## 📊 Email Limits

**Google Workspace:**
- 2,000 emails/day per account
- 10,000 emails/day total

**Enough for:**
- 1,000 new signups/day ✅
- 500 password resets/day ✅
- 500 alert emails/day ✅

If you hit limits → Use SendGrid as backup

---

## ❓ Troubleshooting

**"Invalid credentials"**
→ Check you're using App Password (not Gmail password)
→ Remove spaces from password

**"Connection timeout"**
→ Check Railway has SMTP_PORT=587
→ Check SMTP_SECURE=false

**"Emails not sending"**
→ Check Railway logs: `railway logs`
→ Test connection endpoint first

**"Emails going to spam"**
→ Add SPF record to DNS (see GMAIL_SMTP_SETUP.md)
→ Warm up email by sending gradually

---

## ✅ Checklist

- [ ] Generated App Password for noreply@
- [ ] Added variables to Railway
- [ ] Restarted Railway service
- [ ] Tested connection (success!)
- [ ] Sent test email (received!)
- [ ] Set up Gmail signatures
- [ ] Configured inbox filters
- [ ] Tested password reset flow

---

## 🎯 Next Steps

After emails work:
1. Test actual password reset in app
2. Setup email forwarding (optional)
3. Add DNS SPF record (improve deliverability)
4. Monitor sent emails first week

---

## 📞 Need Help?

Check full guide: `GMAIL_SMTP_SETUP.md`

**Common issues all solved in troubleshooting section above!**
