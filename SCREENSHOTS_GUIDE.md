# UAE7Guard - Screenshots Guide

## Required Screenshots

You need **6 screenshots** for app store submission:

1. **Home Screen** - Address search interface
2. **Safe Result** - Green status showing safe address
3. **Dangerous Result** - Red status showing dangerous address
4. **Learning Center** - Educational content page
5. **About Page** - Disclaimers and information
6. **Arabic Version** - Any screen in Arabic language

## Required Dimensions

### iOS (Apple App Store)
- **iPhone 6.5"**: 1284 x 2778 pixels (iPhone 13/14/15 Pro Max)
- **iPhone 5.5"**: 1242 x 2208 pixels (iPhone 8 Plus)
- **iPad Pro 12.9"**: 2048 x 2732 pixels (optional)

### Android (Google Play Store)
- **Phone**: 1080 x 1920 pixels (minimum)
- **Tablet**: 1200 x 1920 pixels (optional)

---

## Method 1: iOS Simulator (Mac Only)

### Step 1: Start the App
\`\`\`bash
# Build and sync
npm run build
npx cap sync ios

# Open Xcode
npx cap open ios
\`\`\`

### Step 2: Run in Simulator
1. In Xcode, select a device:
   - iPhone 15 Pro Max (6.5")
   - iPhone 8 Plus (5.5")
2. Click the Play button to run
3. Wait for the app to launch

### Step 3: Take Screenshots
1. Navigate to each required screen
2. Press: \`Cmd + S\` (saves to Desktop)
3. Or use: \`Simulator > Window > Screenshot\`

### Step 4: Organize Screenshots
\`\`\`bash
# Move screenshots to project folder
mv ~/Desktop/Simulator\ Screen\ Shot*.png screenshots/ios/
\`\`\`

---

## Method 2: Android Emulator

### Step 1: Start the App
\`\`\`bash
# Build and sync
npm run build
npx cap sync android

# Open Android Studio
npx cap open android
\`\`\`

### Step 2: Run in Emulator
1. In Android Studio, click "Device Manager"
2. Create/start a device:
   - Pixel 6 (1080 x 2340)
   - Pixel 4 XL (1440 x 3040)
3. Click Run button

### Step 3: Take Screenshots
1. Navigate to each required screen
2. Click the camera icon in emulator controls
3. Or press: \`Ctrl + S\` (Windows/Linux) or \`Cmd + S\` (Mac)

### Step 4: Organize Screenshots
Screenshots are saved in:
- Mac: \`~/Library/Android/sdk/emulator/screenshots/\`
- Linux: \`~/Android/Sdk/emulator/screenshots/\`

---

## Method 3: Browser with Device Emulation (Quickest)

### Step 1: Start Development Server
\`\`\`bash
npm run dev
\`\`\`

### Step 2: Open in Browser
1. Open Chrome/Brave/Edge
2. Navigate to: \`http://localhost:5000\`
3. Open DevTools: \`F12\` or \`Ctrl+Shift+I\` (Windows/Linux) or \`Cmd+Opt+I\` (Mac)

### Step 3: Set Device Dimensions
1. Click "Toggle device toolbar" (or press \`Ctrl+Shift+M\`)
2. Click "Dimensions" dropdown
3. Select "Responsive"
4. Set custom dimensions:
   - **For iOS**: 1284 x 2778
   - **For Android**: 1080 x 1920

### Step 4: Take Screenshots
1. Navigate to each required screen
2. Right-click on page
3. Select "Capture screenshot" or "Capture full size screenshot"
4. Screenshots save to Downloads folder

### Step 5: Organize Screenshots
\`\`\`bash
# Move from Downloads to project
mv ~/Downloads/localhost_*.png screenshots/ios/
\`\`\`

---

## What to Capture for Each Screenshot

### 1. Home Screen
- **URL**: \`http://localhost:5000/\`
- Show the address search input field
- Display the logo and branding
- Include "Scan Address" button

### 2. Safe Result (Green)
- **Test Address**: Use any valid Ethereum address not in scam database
- Example: \`0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb\`
- Should show green status
- Display safety indicators

### 3. Dangerous Result (Red)
- **Test Address**: Use a known scam address from your database
- Should show red status
- Display warnings and risk information

### 4. Learning Center
- **URL**: Navigate to learning/educational content section
- Show educational content
- Display scam type cards
- Include navigation elements

### 5. About Page
- **URL**: Navigate to about/info section
- Show disclaimers
- Display terms and information
- Include app version/credits

### 6. Arabic Version
- Switch language to Arabic (usually a button in settings)
- Take screenshot of any main screen
- Ensure all text is in Arabic
- RTL layout should be visible

---

## Quick Start (Recommended)

The **easiest method** is using your browser:

\`\`\`bash
# Start the dev server
npm run dev
\`\`\`

Then:
1. Open browser to http://localhost:5000
2. Press F12 to open DevTools
3. Press Ctrl+Shift+M (or Cmd+Shift+M on Mac) for device toolbar
4. Set dimensions to 1284 x 2778 (for iOS) or 1080 x 1920 (for Android)
5. Navigate through the app and take screenshots

---

## After Taking Screenshots

1. Save all screenshots to \`screenshots/ios/\` and \`screenshots/android/\`
2. Rename files descriptively:
   - \`01-home-screen-1284x2778.png\`
   - \`02-safe-result-1284x2778.png\`
   - \`03-dangerous-result-1284x2778.png\`
   - \`04-learning-center-1284x2778.png\`
   - \`05-about-page-1284x2778.png\`
   - \`06-arabic-version-1284x2778.png\`

3. Upload to App Store Connect / Google Play Console

---

## Screenshot Checklist

Before submitting, ensure each screenshot:
- [ ] Is the correct dimensions (1284x2778 for iOS, 1080x1920 for Android)
- [ ] Shows the app in a realistic usage scenario
- [ ] Has clear, readable text
- [ ] Displays the correct UI state (no loading spinners)
- [ ] Includes no personal or test data
- [ ] Is in PNG or JPEG format
- [ ] Is under 10MB file size
