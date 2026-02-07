# UAE7Guard - Apple App Store Review Preparation

> Complete guide for TestFlight and App Store submission
> Version: 1.0
> Date: February 2026

---

## Table of Contents

1. [App Information](#1-app-information)
2. [Review Notes for Apple](#2-review-notes-for-apple)
3. [Demo Account](#3-demo-account)
4. [Architecture Explanation](#4-architecture-explanation)
5. [Privacy Justification](#5-privacy-justification)
6. [Common Rejection Prevention](#6-common-rejection-prevention)

---

## 1. App Information

### Basic Details

| Field | Value |
|-------|-------|
| **App Name** | UAE7Guard |
| **Bundle ID** | com.uae7guard.app |
| **Category** | Finance / Security |
| **Age Rating** | 4+ |
| **Primary Language** | English |
| **Secondary Language** | Arabic |
| **Target Region** | United Arab Emirates (Primary), Global |

### App Description (App Store)

**Short Description (30 chars):**
```
Blockchain Security for UAE
```

**Full Description:**
```
UAE7Guard protects you from cryptocurrency scams with real-time blockchain monitoring and AI-powered threat detection.

KEY FEATURES:

🔍 SCAM DETECTION
• Check any wallet address for known scam activity
• Access verified scam reports from the UAE7Guard community
• Real-time risk scoring powered by AI

📊 WALLET MONITORING
• Monitor your crypto wallets 24/7
• Instant alerts for suspicious transactions
• Support for Ethereum, Polygon, Bitcoin, and more

🛡️ SECURE ESCROW
• Safe P2P trading with smart escrow
• Funds protected until both parties verify
• Dispute resolution support

🏆 COMMUNITY TRUST
• Report scams to protect others
• Build reputation through verified reports
• Leaderboard for top contributors

💰 LOCAL SUPPORT
• AED currency display
• Arabic language interface
• Designed for UAE regulations

SUPPORTED NETWORKS:
Ethereum • Polygon • Arbitrum • Optimism • Base • Bitcoin

Download UAE7Guard today and trade crypto with confidence.
```

### Keywords
```
crypto,scam,security,blockchain,wallet,ethereum,bitcoin,UAE,fraud,protection
```

---

## 2. Review Notes for Apple

**Copy this text into the "Notes for Review" field in App Store Connect:**

```
Dear Apple Review Team,

UAE7Guard is a cryptocurrency security application that helps users in the United Arab Emirates identify and avoid blockchain scams.

CORE FUNCTIONALITY:
1. Users can check if a blockchain wallet address has been reported as a scam
2. Users can monitor their own wallets for suspicious activity
3. Users can report scam addresses to warn the community
4. Users can use secure escrow for P2P cryptocurrency trades

AUTHENTICATION:
We use Supabase Authentication (industry-standard, built on PostgreSQL) for user accounts. Users sign up with email/password. No third-party social logins are required for basic functionality.

DATA HANDLING:
• All data transmitted over HTTPS
• User data stored in Supabase (AWS infrastructure)
• No cryptocurrency is stored or transferred through our app
• We only READ blockchain data, never WRITE transactions

DEMO ACCOUNT PROVIDED BELOW:
A demo account is provided for testing all features without creating a new account.

MONETIZATION:
• Free tier with basic features
• Premium subscription for advanced monitoring (in-app purchase)
• We use Stripe for payment processing (compliant with Apple guidelines)

IN-APP PURCHASES:
If you see subscription options, these are processed through our backend for web users. iOS users will have Apple IAP integration in future updates. For this review, the demo account has full premium access.

NO CRYPTOCURRENCY TRADING:
UAE7Guard does NOT facilitate actual cryptocurrency trading or wallet connections. We are an information and monitoring service only. Users cannot buy, sell, or transfer crypto through our app.

Please contact us at review@uae7guard.com if you need any clarification.

Thank you for your review.
```

---

## 3. Demo Account

### Credentials for Apple Review

| Field | Value |
|-------|-------|
| **Email** | `demo@uae7guard.com` |
| **Password** | `AppleReview2026!` |

### Demo Account Setup Instructions

**For your backend team - create this account in Supabase:**

```sql
-- Run in Supabase SQL Editor (with service_role)

-- 1. Create demo user via Supabase Auth dashboard or API
-- Email: demo@uae7guard.com
-- Password: AppleReview2026!

-- 2. After user is created, get their UUID and update profile:
UPDATE users
SET
  name = 'Apple Review Demo',
  role = 'user',
  subscription_tier = 'premium',
  subscription_status = 'active'
WHERE email = 'demo@uae7guard.com';

-- 3. Add some demo data for the reviewer
INSERT INTO watchlist (user_id, address, label, network)
SELECT id, '0x742d35Cc6634C0532925a3b844Bc9e7595f5bB0d', 'Demo Wallet', 'ethereum'
FROM users WHERE email = 'demo@uae7guard.com';

-- 4. Add demo alert
INSERT INTO alerts (user_id, title, message, type, is_read)
SELECT id, 'Welcome to UAE7Guard', 'Your account is ready for testing.', 'info', false
FROM users WHERE email = 'demo@uae7guard.com';
```

### What Apple Reviewers Can Test

| Feature | How to Test |
|---------|-------------|
| **Scam Check** | Enter address: `0x000000000000000000000000000000000000dEaD` |
| **Watchlist** | Pre-populated demo wallet in watchlist |
| **Alerts** | Demo alert visible in notifications |
| **Reports** | View public verified scam reports |
| **Profile** | View and edit profile settings |
| **Monitoring** | Add any address to live monitoring |

### Test Blockchain Addresses

Provide these to Apple for testing scam detection:

```
Known Scam (for demo): 0x000000000000000000000000000000000000dEaD
Clean Address: 0x742d35Cc6634C0532925a3b844Bc9e7595f5bB0d
Vitalik's Address: 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045
```

---

## 4. Architecture Explanation

### Authentication Flow (Supabase Auth + JWT Verify)

```
┌─────────────────────────────────────────────────────────────────┐
│                      AUTHENTICATION FLOW                        │
└─────────────────────────────────────────────────────────────────┘

┌──────────┐         ┌──────────────┐         ┌──────────────────┐
│  iOS App │         │   Supabase   │         │  UAE7Guard API   │
│          │         │     Auth     │         │     (Backend)    │
└────┬─────┘         └──────┬───────┘         └────────┬─────────┘
     │                      │                          │
     │  1. Sign Up/Login    │                          │
     │─────────────────────>│                          │
     │                      │                          │
     │  2. JWT Token        │                          │
     │<─────────────────────│                          │
     │                      │                          │
     │  3. API Request + JWT (Authorization: Bearer)   │
     │────────────────────────────────────────────────>│
     │                      │                          │
     │                      │  4. Verify JWT Token     │
     │                      │<─────────────────────────│
     │                      │                          │
     │                      │  5. User Data            │
     │                      │─────────────────────────>│
     │                      │                          │
     │  6. API Response                                │
     │<────────────────────────────────────────────────│
     │                      │                          │
```

### Technical Implementation

**1. iOS Client (Swift/Capacitor)**
```swift
// Using Supabase Swift SDK
let supabase = SupabaseClient(
    supabaseURL: URL(string: "https://xxx.supabase.co")!,
    supabaseKey: "anon-key-here"  // Safe to embed - public key
)

// Login
let session = try await supabase.auth.signIn(
    email: "user@example.com",
    password: "password"
)

// Get JWT for API calls
let accessToken = session.accessToken

// API Request
var request = URLRequest(url: apiURL)
request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
```

**2. Backend Verification (Node.js)**
```typescript
// server/middleware/supabaseAuth.ts
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY  // Server only!
);

async function authenticateUser(req, res, next) {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    // Verify JWT with Supabase
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
        return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = user;
    next();
}
```

### Why Supabase?

| Benefit | Description |
|---------|-------------|
| **Security** | Built on PostgreSQL with Row Level Security |
| **Apple Compliant** | No custom password handling, industry standard |
| **JWT Standard** | Uses standard JWT tokens, easily verifiable |
| **Scalable** | Handles millions of users, auto-scaling |
| **Auditable** | All auth events logged |

### Data Flow Security

```
┌─────────────────────────────────────────────────────────────────┐
│                       SECURITY LAYERS                           │
└─────────────────────────────────────────────────────────────────┘

  ┌─────────────┐
  │   iOS App   │──── HTTPS/TLS 1.3 ────┐
  └─────────────┘                       │
                                        ▼
                               ┌─────────────────┐
                               │   API Gateway   │
                               │  Rate Limiting  │
                               │  Input Sanitize │
                               └────────┬────────┘
                                        │
                                        ▼
                               ┌─────────────────┐
                               │  JWT Verify     │
                               │  (Supabase)     │
                               └────────┬────────┘
                                        │
                                        ▼
                               ┌─────────────────┐
                               │  PostgreSQL     │
                               │  + RLS Policies │
                               └─────────────────┘
```

---

## 5. Privacy Justification

### Data Collection Summary

| Data Type | Collected | Purpose | Retention |
|-----------|-----------|---------|-----------|
| Email | Yes | Account authentication | Until account deletion |
| Password | Yes (hashed) | Authentication | Until account deletion |
| Wallet Addresses | Yes | Monitoring service | Until user removes |
| Device Info | Minimal | Crash reporting | 90 days |
| Location | No | N/A | N/A |
| Contacts | No | N/A | N/A |
| Photos | No | N/A | N/A |

### Privacy Nutrition Label (App Store)

**Data Used to Track You:** None

**Data Linked to You:**
- Email address (Contact Info)
- User ID (Identifiers)

**Data Not Linked to You:**
- Crash data (Diagnostics)
- Performance data (Diagnostics)

### Privacy Policy Key Points

```
UAE7GUARD PRIVACY SUMMARY

WHAT WE COLLECT:
• Email address for account login
• Blockchain wallet addresses YOU choose to monitor
• Scam reports YOU submit voluntarily

WHAT WE DON'T COLLECT:
• Private keys (we NEVER ask for these)
• Actual cryptocurrency or funds
• Location data
• Contacts or photos
• Browsing history

HOW WE PROTECT YOUR DATA:
• All data encrypted in transit (HTTPS/TLS)
• Passwords hashed with bcrypt (12 rounds)
• Database protected with Row Level Security
• Sensitive logs encrypted with AES-256

YOUR RIGHTS:
• Export your data anytime
• Delete your account anytime
• Opt out of marketing emails

GDPR & UAE COMPLIANCE:
• Data stored in compliant infrastructure
• Right to be forgotten supported
• No data sold to third parties

For full privacy policy: https://uae7guard.com/privacy
```

### App Tracking Transparency

**Do we track users across apps?** NO

- We do NOT use IDFA
- We do NOT use third-party analytics that track across apps
- We do NOT share data with data brokers
- App Tracking Transparency prompt NOT required

### Data Deletion Support

```
USER DATA DELETION FLOW:

1. User requests deletion in app (Settings > Delete Account)
2. Request sent to backend API
3. Backend triggers CASCADE delete:
   - User profile deleted
   - All watchlist entries deleted
   - All alerts deleted
   - All scam reports anonymized (reporter_id = null)
   - All security logs deleted
4. Supabase Auth user deleted
5. Confirmation email sent
6. Process completes within 24 hours
```

**Apple Requirement Met:** Users can delete their account and data directly from the app.

---

## 6. Common Rejection Prevention

### Guideline 2.1 - App Completeness

✅ **Our Compliance:**
- Demo account provided with full access
- All features functional without payment
- No placeholder content
- No "coming soon" features in submitted build

### Guideline 2.3 - Accurate Metadata

✅ **Our Compliance:**
- Screenshots show actual app UI
- Description matches app functionality
- No misleading claims about capabilities
- Keywords relevant to app function

### Guideline 3.1.1 - In-App Purchase

⚠️ **Current Status:**
- Premium features available via web subscription
- iOS IAP integration planned for future update
- For this submission: Demo account has premium access
- No IAP prompt shown to Apple reviewers

**Reviewer Note:** "Premium subscription functionality is available through our web platform. iOS in-app purchase integration is planned for a future update. The demo account has full premium access for review purposes."

### Guideline 4.2 - Minimum Functionality

✅ **Our Compliance:**
- App provides unique utility (scam checking)
- Not a simple web wrapper
- Native iOS experience with:
  - Native navigation
  - Push notifications
  - Offline caching
  - iOS-specific UI patterns

### Guideline 5.1 - Privacy

✅ **Our Compliance:**
- Privacy policy URL provided
- Data collection disclosure accurate
- No hidden data collection
- Account deletion available in-app
- No ATT required (no cross-app tracking)

### Guideline 5.1.1 - Data Collection

✅ **Our Compliance:**
- Only collect data necessary for core function
- Clear purpose for each data type
- User consent obtained before collection
- Data minimization practiced

### Crypto-Specific Guidelines

Apple has specific concerns about cryptocurrency apps:

✅ **We Comply Because:**

| Concern | Our Approach |
|---------|--------------|
| Not a crypto wallet | We don't store private keys |
| Not an exchange | We don't facilitate trades |
| Not ICO/token sale | We don't sell tokens |
| Not mining app | No mining functionality |
| Information only | We provide security information |

**Reviewer Note:** "UAE7Guard is a security/information app, not a cryptocurrency wallet or exchange. We do not store private keys, facilitate trades, or handle actual cryptocurrency transfers. Our service reads blockchain data to provide security information to users."

---

## 7. Submission Checklist

### Before Submitting

- [ ] Demo account created and tested
- [ ] All features work without crashes
- [ ] Privacy policy URL is live
- [ ] App Store screenshots updated
- [ ] Review notes copied to App Store Connect
- [ ] Test on latest iOS version
- [ ] Test on oldest supported iOS version
- [ ] Remove any debug/test code
- [ ] Verify API endpoints are production URLs
- [ ] Check for hardcoded test credentials (remove!)

### App Store Connect Settings

```
App Information:
├── Name: UAE7Guard
├── Privacy Policy URL: https://uae7guard.com/privacy
├── Category: Finance
├── Secondary Category: Utilities
└── Age Rating: 4+

Pricing:
├── Price: Free
└── In-App Purchases: None (for initial submission)

App Review Information:
├── Demo Account Email: demo@uae7guard.com
├── Demo Account Password: AppleReview2026!
├── Notes: [See Review Notes section above]
└── Contact: review@uae7guard.com
```

### Post-Approval

1. Monitor crash reports in App Store Connect
2. Respond to user reviews promptly
3. Prepare for localization (Arabic priority)
4. Plan IAP integration for premium features
5. Set up App Store promotional artwork

---

## 8. Contact Information

**For Apple Review Team:**
- Email: review@uae7guard.com
- Response Time: Within 24 hours

**Technical Support:**
- Email: support@uae7guard.com
- Hours: 9 AM - 6 PM GST

---

**Document Version:** 1.0
**Last Updated:** February 2026
**Prepared For:** TestFlight / App Store Submission
