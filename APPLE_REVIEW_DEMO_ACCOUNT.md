# 🍎 Apple App Store Review - Demo Account Information

## ✅ Demo Account Credentials

**For Apple App Review Team:**

```
Email: applereview@uae7guard.com
Password: AppleReview2026
```

**Account Details:**
- **First Name:** Apple
- **Last Name:** Reviewer
- **Role:** Standard User (Free Tier)
- **Status:** Active
- **Created:** January 22, 2026

---

## 📱 How to Test the App

### Step 1: Launch the App
1. Open UAE7Guard on your iPhone
2. You'll see the home screen with language toggle (🌐)

### Step 2: Sign In
1. Tap on the user icon (top right) or go to Login
2. Enter credentials:
   - **Email:** applereview@uae7guard.com
   - **Password:** AppleReview2026
3. Tap "Sign In"

### Step 3: Test Main Features

#### A. **Check Wallet Address** (Main Feature)
1. From the home page, enter a wallet address:
   ```
   0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
   ```
2. Tap "Check" or "فحص"
3. You'll see the verification result with threat assessment

#### B. **Language Support**
1. Tap the 🌐 globe icon in the header
2. The app switches between:
   - English (LTR)
   - Arabic العربية (RTL)
3. All pages update including login, signup, and dashboard

#### C. **Dashboard** (After Login)
1. Navigate through the sidebar menu
2. Explore:
   - Threat Reports
   - Wallet Verification Tools
   - Analytics
   - Settings

#### D. **Threat Lookup**
1. Go to "Check Tool" from the menu
2. Enter any Ethereum wallet address
3. View real-time threat assessment

---

## 🎯 Test Scenarios

### Scenario 1: Basic Wallet Verification
```
Address: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
Expected: Shows "Safe" status (no scam reports)
```

### Scenario 2: Known Scam Address
```
Address: 0x0000000000000000000000000000000000000001
Expected: Shows warning with scam reports (if available in DB)
```

### Scenario 3: Arabic Language
```
1. Switch to Arabic using 🌐
2. Navigate through app
3. All UI text should be in Arabic
4. Text direction should be RTL
```

### Scenario 4: Account Management
```
1. Sign out from the menu
2. Create a new test account via "Sign Up"
3. Sign in with new credentials
4. Both accounts should work independently
```

---

## 🔍 App Features Overview

### Core Features:
1. **Wallet Verification**
   - Real-time blockchain address checking
   - Scam report database lookup
   - Risk assessment scoring

2. **User Authentication**
   - Email/Password signup and login
   - Secure session management
   - Password encryption with bcrypt

3. **Multilingual Support**
   - English (Default)
   - Arabic (Full RTL support)
   - Dynamic language switching

4. **Threat Intelligence**
   - Community-reported scams
   - Verified threat database
   - Real-time updates

5. **Data Protection**
   - AES-256 encryption
   - UAE PDPL compliant
   - No personal data storage for searches

### Additional Features:
- Dark/Light theme toggle
- Responsive mobile design
- Offline capability (PWA)
- Secure HTTPS communication

---

## 🌐 API Backend

**Production URL:** https://uae-7-guard-2.replit.app

The app connects to our production API hosted on Replit which provides:
- User authentication endpoints
- Wallet verification API
- Threat report database
- Real-time blockchain data integration

---

## 📋 App Information

**Bundle ID:** com.uae7guard.crypto
**App Name:** UAE7Guard
**Version:** 1.0 (Build 1768947941)
**Platform:** iOS 13.0+
**Categories:** Finance, Utilities

**Privacy:**
- No tracking
- No data selling
- Optional account creation
- Anonymous wallet searches

---

## 🔐 Data & Privacy

### What We Collect:
- Email address (for account)
- Password (encrypted)
- User preferences (language, theme)

### What We DON'T Collect:
- Wallet addresses searched
- Transaction history
- Personal identification
- Location data
- Device information

### Storage:
- All data encrypted at rest
- PostgreSQL database
- Secure HTTPS transmission
- Session-based authentication

---

## 🛡️ Security Features

1. **Password Security**
   - Bcrypt hashing (10 rounds)
   - Minimum 6 characters
   - No password recovery (contact support)

2. **API Security**
   - HTTPS only
   - CORS protection
   - Rate limiting
   - Session timeout (7 days)

3. **Data Protection**
   - AES-256 encryption for sensitive data
   - UAE PDPL compliant
   - No third-party data sharing

---

## 🎨 Screenshots Guide

### Recommended Screenshots:
1. **Home Screen** - Shows wallet checker and language toggle
2. **Login Screen** - Arabic & English versions
3. **Verification Result** - Safe address example
4. **Verification Warning** - Scam address example
5. **Dashboard** - User dashboard with features
6. **Language Toggle** - Shows Arabic RTL support

---

## 💬 Review Notes for Apple

### Why This App?

UAE7Guard addresses a critical need in the cryptocurrency space:
- **Problem:** Crypto scams cost investors billions annually
- **Solution:** Pre-transaction wallet verification
- **Target:** UAE residents and crypto investors
- **Benefit:** Prevents fraud before money is sent

### Compliance:

✅ **UAE Data Protection Law Compliant**
- Full data privacy disclosure
- User consent for data collection
- Secure data storage
- Right to deletion

✅ **App Store Guidelines**
- No gambling/betting
- No in-app purchases (planned for future)
- Educational purpose
- Finance category appropriate

✅ **Technical Standards**
- iOS 13.0+ support
- Full RTL support for Arabic
- Accessibility features
- Dark mode support

### Future Updates:

**Version 1.1 (Planned):**
- Subscription tiers (Basic, Pro, Enterprise)
- Advanced analytics
- Multi-chain support (Polygon, BSC, etc.)
- Browser extension

---

## 📞 Support Information

**Developer Contact:**
- Email: admin@uae7guard.com
- Support URL: https://uae-7-guard-2.replit.app/contact
- Privacy Policy: https://uae-7-guard-2.replit.app/privacy
- Terms of Service: https://uae-7-guard-2.replit.app/terms

**App Store Connect:**
- Organization: UAE7Guard
- Team ID: [Your Apple Developer Team ID]
- Primary Contact: [Your name/email]

---

## ✅ Testing Checklist

Before approving, please verify:

- [ ] Demo account login works
- [ ] Wallet verification returns results
- [ ] Language toggle works (EN ↔ AR)
- [ ] Text direction changes with language (LTR/RTL)
- [ ] All navigation menus accessible
- [ ] Sign out works correctly
- [ ] Theme toggle works (Dark/Light)
- [ ] No crashes or freezes
- [ ] Network requests complete successfully
- [ ] UI renders correctly on iPhone

---

## 🚀 Thank You!

We appreciate the App Review team's time and diligence in reviewing UAE7Guard.

This app aims to protect cryptocurrency investors in the UAE and globally from scams and fraud. Your approval will help us reach users who need this protection.

If you have any questions or need additional information, please don't hesitate to contact us through App Store Connect.

---

**Last Updated:** January 22, 2026
**Review Build:** 1.0 (1768947941)
**Submitted By:** Mohamed (M6220505)
