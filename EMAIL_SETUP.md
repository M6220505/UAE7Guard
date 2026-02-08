# 📧 UAE7Guard Email Setup Guide

## Professional Email Addresses

Setup custom emails for your domain: **@uae7guard.com**

---

## Recommended Addresses

```
support@uae7guard.com    - Customer support
admin@uae7guard.com      - Admin/internal
noreply@uae7guard.com    - System notifications
security@uae7guard.com   - Security reports
sales@uae7guard.com      - Business inquiries
```

---

## Setup Options

### Option 1: Google Workspace (Recommended)

**Cost:** $6/user/month

**Benefits:**
- Professional Gmail interface
- 30GB storage per user
- Google Meet, Calendar, Drive
- 99.9% uptime SLA

**Setup:**
1. Go to: https://workspace.google.com
2. Sign up with uae7guard.com
3. Verify domain ownership (DNS TXT record)
4. Add users (support@, admin@, etc.)
5. Configure MX records

**DNS Records (Google provides these):**
```
Type: MX
Priority: 1
Value: ASPMX.L.GOOGLE.COM

Type: MX
Priority: 5
Value: ALT1.ASPMX.L.GOOGLE.COM
```

---

### Option 2: Cloudflare Email Routing (FREE)

**Cost:** FREE

**Benefits:**
- Email forwarding only (no sending)
- Forward to your personal email
- Simple DNS setup
- Great for receiving only

**Setup:**
1. Add domain to Cloudflare
2. Go to Email Routing
3. Enable email routing
4. Add destination email (your personal email)
5. Create routes:
   - support@uae7guard.com → your@gmail.com
   - admin@uae7guard.com → your@gmail.com

**Limitations:**
- Can't send FROM @uae7guard.com
- Forwarding only

---

### Option 3: Zoho Mail (Budget)

**Cost:** FREE (up to 5 users) or $1/user/month

**Benefits:**
- Full email hosting
- Can send & receive
- 5GB storage (free) / 30GB (paid)
- Mobile apps

**Setup:**
1. Go to: https://zoho.com/mail
2. Sign up with uae7guard.com
3. Verify domain
4. Add MX records
5. Create mailboxes

---

### Option 4: SendGrid + Gmail (Current Setup)

**For system emails only** (password resets, notifications)

Already configured in `.env`:
```bash
SENDGRID_API_KEY=your_key
SENDGRID_FROM_EMAIL=noreply@uae7guard.com
```

**This is for:**
- Password reset emails
- Alert notifications
- System messages

**NOT for:**
- Customer support replies
- Manual emails

---

## DNS Records Example

**For Google Workspace:**

```
Type: MX
Name: @
Priority: 1
Value: ASPMX.L.GOOGLE.COM
TTL: 3600

Type: MX
Name: @
Priority: 5
Value: ALT1.ASPMX.L.GOOGLE.COM
TTL: 3600

Type: TXT
Name: @
Value: v=spf1 include:_spf.google.com ~all
TTL: 3600

Type: TXT
Name: _dmarc
Value: v=DMARC1; p=quarantine; rua=mailto:admin@uae7guard.com
TTL: 3600
```

---

## Verify Email Setup

After DNS propagation (30-60 minutes):

```bash
# Check MX records
nslookup -type=MX uae7guard.com

# Check SPF
nslookup -type=TXT uae7guard.com

# Send test email
echo "Test" | mail -s "Test Email" support@uae7guard.com
```

---

## Email Signatures

**Professional Signature Template:**

```
---
[Your Name]
[Your Title]
UAE7Guard

📧 support@uae7guard.com
🌐 https://uae7guard.com
🛡️ Enterprise Crypto Fraud Detection

Protecting your digital assets since 2026
```

---

## Autoresponders

**Support Email Autoresponder:**

```
Subject: We received your message

Thank you for contacting UAE7Guard Support!

We've received your message and will respond within 24 hours.

For immediate assistance:
- Check our FAQ: https://uae7guard.com/faq
- API Docs: https://uae7guard.com/api-docs
- Status: https://status.uae7guard.com

Best regards,
UAE7Guard Team
```

---

## Best Practices

1. **Use separate emails for different purposes**
   - Don't use admin@ for customer support
   - Keep security@ for security reports only

2. **Setup SPF, DKIM, DMARC**
   - Prevents email spoofing
   - Improves deliverability

3. **Enable 2FA**
   - Especially for admin@
   - Use authenticator app

4. **Regular backups**
   - Export important emails monthly
   - Keep offline backups

5. **Professional tone**
   - Use signatures
   - Respond within 24h
   - Be helpful and clear

---

## Current Status

- [x] SendGrid configured (system emails)
- [ ] Custom domain email (setup needed)
- [ ] Support@ email (pending)
- [ ] Admin@ email (pending)

---

## Recommendation

**For UAE7Guard:**

**Start with Cloudflare Email Routing (FREE)**
- Forward support@ → your personal email
- Easy setup, no cost
- Good enough for now

**Later upgrade to Google Workspace**
- When you have >50 customers
- Need professional support
- Multiple team members

---

## Quick Start (Cloudflare - 5 minutes)

1. Login to Cloudflare
2. Select uae7guard.com
3. Email Routing → Get Started
4. Add destination: your@gmail.com
5. Create route: support@uae7guard.com → your@gmail.com
6. Done! ✅

Test it:
```bash
echo "Test" | mail -s "Test" support@uae7guard.com
```
