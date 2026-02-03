# UAE7Guard Mobile App - App Store Deployment Guide

This guide will help you deploy UAE7Guard to the Apple App Store and Google Play Store.

## Prerequisites

### For iOS (App Store)
- Mac computer with macOS
- Xcode (free from Mac App Store)
- Apple Developer Account ($99/year) - [developer.apple.com](https://developer.apple.com)

### For Android (Google Play)
- Android Studio (free) - [developer.android.com/studio](https://developer.android.com/studio)
- Google Play Developer Account ($25 one-time) - [play.google.com/console](https://play.google.com/console)

---

## Step 1: Download Your Project

1. In Replit, click the three dots menu (⋮) next to your project name
2. Select "Download as zip"
3. Extract the zip file on your local computer

---

## Step 2: Build the Web App

Open a terminal in your project folder and run:

```bash
npm install
npm run build
```

This creates the `dist/public` folder with your built web app.

---

## Step 3: Sync with Capacitor

After building, sync the web assets to native projects:

```bash
npx cap sync
```

---

## Step 4: Build for Android (Google Play)

### Open in Android Studio
```bash
npx cap open android
```

### Generate Signed APK/Bundle
1. In Android Studio, go to **Build > Generate Signed Bundle/APK**
2. Select **Android App Bundle** (recommended for Play Store)
3. Create a new keystore or use existing one:
   - Key store path: Choose a secure location
   - Password: Create a strong password (SAVE THIS!)
   - Key alias: `uae7guard`
   - Key password: Create a strong password
   - Validity: 25 years
   - Fill in your organization details
4. Select **release** build variant
5. Click **Finish**

The signed `.aab` file will be in `android/app/release/`

### Submit to Google Play
1. Go to [Google Play Console](https://play.google.com/console)
2. Create a new app
3. Fill in the store listing:
   - App name: UAE7Guard
   - Short description: Free cryptocurrency safety checker for UAE
   - Full description: (see below)
   - Screenshots (required): Take screenshots of your app
   - App icon: 512x512 PNG
4. Upload your `.aab` file under **Production > Create new release**
5. Complete content rating questionnaire
6. Set up pricing (free)
7. Submit for review

---

## Step 5: Build for iOS (App Store)

### Open in Xcode
```bash
npx cap open ios
```

### Configure Signing
1. In Xcode, select your project in the navigator
2. Select the **App** target
3. Go to **Signing & Capabilities** tab
4. Check **Automatically manage signing**
5. Select your Team (Apple Developer account)
6. Bundle Identifier: `com.uae7guard.app`

### Create Archive
1. Select **Product > Archive** from the menu
2. Wait for the build to complete
3. In the Organizer window, click **Distribute App**
4. Select **App Store Connect**
5. Follow the prompts to upload

### Submit to App Store
1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Create a new app:
   - Platform: iOS
   - Name: UAE7Guard
   - Primary Language: English (or Arabic)
   - Bundle ID: com.uae7guard.app
   - SKU: uae7guard001
3. Fill in app information:
   - Screenshots for each device size
   - App icon (1024x1024)
   - Description, keywords, support URL
   - Privacy policy URL (your-app.replit.app/privacy)
4. Select your uploaded build
5. Submit for review

---

## App Store Description Template

### English
```
UAE7Guard - Free Cryptocurrency Safety Checker

Protect yourself from crypto scams with UAE7Guard, a free tool designed for UAE investors.

FEATURES:
• Check any wallet address against our scam database
• Color-coded results: Green (safe), Yellow (under review), Red (dangerous)
• Educational content about common crypto scams
• Report suspicious addresses
• Full Arabic/English support
• Privacy-first: No tracking, no data collection

LEARN ABOUT:
• Ponzi schemes
• Rug pulls
• Phishing attacks
• Fake exchanges
• Romance scams
• Pump and dump schemes

DISCLAIMER:
This tool is for educational purposes only. It is not financial or legal advice. Always do your own research before making investment decisions.
```

### Arabic
```
UAE7Guard - أداة فحص سلامة العملات الرقمية المجانية

احمِ نفسك من عمليات الاحتيال في العملات الرقمية مع UAE7Guard، أداة مجانية مصممة للمستثمرين في الإمارات.

المميزات:
• فحص أي عنوان محفظة مقابل قاعدة بيانات الاحتيال
• نتائج ملونة: أخضر (آمن)، أصفر (قيد المراجعة)، أحمر (خطير)
• محتوى تعليمي حول عمليات الاحتيال الشائعة
• الإبلاغ عن العناوين المشبوهة
• دعم كامل للعربية والإنجليزية
• الخصوصية أولاً: لا تتبع، لا جمع بيانات
```

---

## App Icons and Screenshots

### Required Sizes

**iOS App Icon:**
- 1024x1024 (App Store)
- 180x180 (iPhone)
- 167x167 (iPad Pro)
- 152x152 (iPad)
- 120x120 (iPhone Spotlight)

**Android App Icon:**
- 512x512 (Play Store)
- 192x192 (xxxhdpi)
- 144x144 (xxhdpi)
- 96x96 (xhdpi)
- 72x72 (hdpi)
- 48x48 (mdpi)

### Screenshot Requirements

**iOS:**
- 6.5" (1284 x 2778)
- 5.5" (1242 x 2208)
- iPad Pro 12.9" (2048 x 2732)

**Android:**
- Phone: 1080 x 1920 minimum
- Tablet: 1200 x 1920 (if supporting tablets)

---

## Troubleshooting

### Android Build Fails
```bash
# Clean and rebuild
cd android
./gradlew clean
cd ..
npx cap sync android
```

### iOS Signing Issues
1. Ensure you have a valid Apple Developer account
2. In Xcode: **Preferences > Accounts** - add your Apple ID
3. Let Xcode manage signing automatically

### App Rejected

Common reasons:
- Missing privacy policy
- Placeholder content
- Crashes or bugs
- Misleading description

---

## Updating Your App

When you make changes:

1. Update version in `capacitor.config.ts`
2. Run `npm run build`
3. Run `npx cap sync`
4. Open native IDE and build new version
5. Upload to respective store

---

## Need Help?

- Capacitor Docs: https://capacitorjs.com/docs
- iOS Guidelines: https://developer.apple.com/app-store/review/guidelines/
- Android Guidelines: https://play.google.com/about/developer-content-policy/
