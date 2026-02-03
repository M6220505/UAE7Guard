# Production Deployment Checklist

This checklist ensures UAE7Guard is properly configured for production deployment to the App Store and web hosting.

## 🔒 Security Configuration

### Environment Variables
- [ ] **Generate Strong Session Secret**
  ```bash
  openssl rand -base64 32
  ```
  Update `SESSION_SECRET` in production environment

- [ ] **Verify API Keys are Set**
  - [ ] `AI_INTEGRATIONS_OPENAI_API_KEY` (for AI features)
  - [ ] `SENDGRID_API_KEY` or SendGrid connector configured
  - [ ] `STRIPE_SECRET_KEY` (for payments)
  - [ ] `ALCHEMY_API_KEY` (for blockchain data)

- [ ] **Database Configuration**
  - [ ] Production DATABASE_URL configured
  - [ ] Database migrations run: `npm run db:push`
  - [ ] Database seeded with initial data: Run seed script

- [ ] **Remove Development Secrets**
  - [ ] No hardcoded passwords in .env
  - [ ] No API keys committed to git
  - [ ] Verify .gitignore includes .env files

### Code Security
- [ ] **Remove Debug Code**
  - [ ] Remove or gate console.log statements
  - [ ] Remove debugger statements
  - [ ] Remove development comments with sensitive info

- [ ] **HTTPS Configuration**
  - [ ] Verify all API calls use HTTPS
  - [ ] Check App Transport Security in Info.plist
  - [ ] Confirm no mixed content warnings

## 🏗️ Build Configuration

### Frontend Build
- [ ] **Run Production Build**
  ```bash
  npm run build
  ```

- [ ] **Verify Build Output**
  - [ ] Check `dist/public` directory contains built files
  - [ ] Verify index.html loads correctly
  - [ ] Test assets (images, icons, fonts) load

- [ ] **PWA Configuration**
  - [ ] Service worker registered
  - [ ] manifest.json present and valid
  - [ ] Icons (192x192, 512x512) present
  - [ ] Test offline functionality

### Mobile Build (iOS)
- [ ] **Sync Capacitor**
  ```bash
  npm run cap:sync:ios
  ```

- [ ] **Xcode Configuration**
  - [ ] Open project: `npm run cap:open:ios`
  - [ ] Set Team & Signing identity
  - [ ] Set Bundle Identifier: `com.uae7guard.crypto`
  - [ ] Set Version & Build Number
  - [ ] Verify all icons present in Assets.xcassets
  - [ ] Test on physical device

- [ ] **App Store Assets**
  - [ ] App icons (all sizes: 20pt to 1024pt)
  - [ ] Launch screens configured
  - [ ] Screenshots (6.7", 6.5", 5.5" iPhone)
  - [ ] App Store preview video (optional)

## 📱 iOS-Specific Checks

### Info.plist Verification
- [ ] **Bundle Configuration**
  - [ ] CFBundleDisplayName: "UAE7Guard"
  - [ ] CFBundleIdentifier: matches App Store Connect
  - [ ] CFBundleShortVersionString: correct version
  - [ ] CFBundleVersion: correct build number

- [ ] **Privacy Strings**
  - [ ] NSCameraUsageDescription: Present and clear
  - [ ] NSPhotoLibraryUsageDescription: Present and clear
  - [ ] NSFaceIDUsageDescription: Present and clear

- [ ] **Localizations**
  - [ ] English (en) supported
  - [ ] Arabic (ar) supported

- [ ] **App Transport Security**
  - [ ] NSAllowsArbitraryLoads: false
  - [ ] Domains configured correctly

- [ ] **Encryption Declaration**
  - [ ] ITSAppUsesNonExemptEncryption: false (for standard HTTPS)

### Capacitor Configuration
- [ ] **capacitor.config.ts**
  - [ ] appId matches Info.plist
  - [ ] webDir points to build output
  - [ ] Server configuration for production domain
  - [ ] Splash screen configured
  - [ ] Status bar styling set

## 🧪 Testing

### Functionality Testing
- [ ] **Core Features**
  - [ ] Search wallet addresses (no auth)
  - [ ] Create account and login
  - [ ] Submit scam report (authenticated)
  - [ ] Admin panel (admin role)
  - [ ] AI risk prediction
  - [ ] Live monitoring
  - [ ] Escrow transactions
  - [ ] Subscription management

- [ ] **Mobile Features**
  - [ ] Camera QR code scanning
  - [ ] Photo library import
  - [ ] Face ID / Touch ID authentication
  - [ ] Bottom navigation works
  - [ ] Splash screen displays
  - [ ] App icons display correctly

- [ ] **Bilingual Support**
  - [ ] English language works
  - [ ] Arabic language works
  - [ ] RTL layout for Arabic
  - [ ] All text translated

### Performance Testing
- [ ] **Load Times**
  - [ ] App launches in < 3 seconds
  - [ ] API responses in < 2 seconds
  - [ ] Images load quickly

- [ ] **Memory Usage**
  - [ ] No memory leaks in Xcode Instruments
  - [ ] Smooth scrolling
  - [ ] No crashes during normal use

### Security Testing
- [ ] **Authentication**
  - [ ] Cannot access protected routes without login
  - [ ] Admin routes require admin role
  - [ ] Session expires after period of inactivity
  - [ ] Password reset works (if implemented)

- [ ] **API Security**
  - [ ] API validates all inputs
  - [ ] SQL injection protection (parameterized queries)
  - [ ] XSS protection (React default + validation)
  - [ ] CSRF protection (SameSite cookies)

## 📝 Legal & Compliance

### App Store Connect
- [ ] **App Information**
  - [ ] App name: "UAE7Guard - Crypto Safety"
  - [ ] Subtitle: Set and under 30 characters
  - [ ] Category: Finance
  - [ ] Age rating: 4+
  - [ ] Keywords: crypto, wallet, security, fraud, scam, blockchain, UAE

- [ ] **Pricing & Availability**
  - [ ] Free app with in-app purchases
  - [ ] Available in all territories (or selected)
  - [ ] Subscription tiers configured in Stripe

- [ ] **App Review Information**
  - [ ] Demo account: applereview@uae7guard.com / AppleReview2026
  - [ ] Contact email set
  - [ ] Phone number provided
  - [ ] Review notes written

- [ ] **Legal Documents**
  - [ ] Privacy policy URL: https://uae7guard.com/privacy
  - [ ] Terms of service URL: https://uae7guard.com/terms
  - [ ] Support URL: https://uae7guard.com/contact

### Privacy & Data
- [ ] **App Privacy Details** (App Store Connect)
  - [ ] Data collection types declared
  - [ ] Data usage purposes explained
  - [ ] Data sharing practices disclosed
  - [ ] Data retention policy documented

- [ ] **Compliance Verification**
  - [ ] PDPL compliant (UAE law)
  - [ ] GDPR considerations (if EU users)
  - [ ] Apple's cryptocurrency policy followed
  - [ ] No prohibited content (gambling, adult, etc.)

## 🚀 Deployment

### Backend Deployment
- [ ] **Server Configuration**
  - [ ] Production domain configured
  - [ ] SSL certificate installed and valid
  - [ ] Database connection tested
  - [ ] Environment variables set on server

- [ ] **Monitoring Setup**
  - [ ] Error tracking (Sentry or similar)
  - [ ] Uptime monitoring
  - [ ] Performance monitoring
  - [ ] Log aggregation

### iOS App Submission
- [ ] **Build & Archive**
  - [ ] Archive built in Xcode (Product > Archive)
  - [ ] Archive validated successfully
  - [ ] App uploaded to App Store Connect

- [ ] **App Store Connect Review**
  - [ ] Build submitted for review
  - [ ] Screenshots uploaded (all required sizes)
  - [ ] App description finalized
  - [ ] Review notes provided
  - [ ] Demo account credentials confirmed

### Post-Submission
- [ ] **Monitor Review Status**
  - [ ] Check App Store Connect daily
  - [ ] Respond to Apple feedback within 24 hours
  - [ ] Test app thoroughly if approved

- [ ] **Marketing Preparation**
  - [ ] Landing page ready
  - [ ] Social media posts prepared
  - [ ] Press release (if applicable)
  - [ ] App Store optimization (ASO)

## 🔄 Post-Launch

### Week 1
- [ ] Monitor crash reports daily
- [ ] Track user feedback in App Store reviews
- [ ] Monitor API performance and errors
- [ ] Check database performance
- [ ] Verify payment processing working
- [ ] Respond to support requests

### Month 1
- [ ] Analyze user metrics
- [ ] Identify most-used features
- [ ] Plan first update based on feedback
- [ ] Optimize performance bottlenecks
- [ ] Update threat database regularly
- [ ] Review and improve security

## 📊 Success Metrics

### Key Performance Indicators
- [ ] **Technical Metrics**
  - App Store rating > 4.5 stars
  - Crash rate < 1%
  - App load time < 3 seconds
  - API response time < 2 seconds

- [ ] **User Metrics**
  - Daily active users
  - Wallet searches performed
  - Scam reports submitted
  - Subscription conversion rate

- [ ] **Security Metrics**
  - Verified threat reports in database
  - False positive rate
  - Community trust score
  - Admin verification time

## 🛠️ Tools & Resources

### Development Tools
- Xcode (latest version)
- Node.js (v18+)
- npm or yarn
- PostgreSQL
- Git

### Testing Tools
- Xcode Instruments (performance)
- TestFlight (beta testing)
- Charles Proxy (network debugging)
- Postman (API testing)

### Deployment Tools
- Capacitor CLI
- App Store Connect
- CodeMagic CI/CD (configured)
- Stripe Dashboard

### Monitoring Tools
- Sentry (error tracking)
- LogRocket (session replay)
- Mixpanel/Plausible (analytics)
- Uptime Robot (uptime monitoring)

---

**Important Notes:**

1. **Never Skip Security:** Always complete security checklist before deployment
2. **Test on Real Devices:** Simulator doesn't catch all issues
3. **Backup Data:** Always backup database before migrations
4. **Version Control:** Tag releases in git
5. **Documentation:** Keep this checklist updated with each release

**Emergency Contacts:**
- Technical Lead: [Add contact]
- App Store Support: developer.apple.com/contact
- Hosting Provider: [Add contact]

---

**Checklist Version:** 1.0
**Last Updated:** January 23, 2026
**Next Review:** Before each major release
