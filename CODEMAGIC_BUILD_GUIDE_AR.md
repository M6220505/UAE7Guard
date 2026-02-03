# 🚀 دليل بناء التطبيق بدون Mac - Codemagic

## 🎯 الحل: استخدام Codemagic لبناء iOS بدون Mac

**Codemagic** هو خدمة CI/CD تبني التطبيقات في السحابة.

---

## ✅ المتطلبات:

1. ✅ حساب GitHub (لرفع الكود)
2. ✅ حساب Apple Developer ($99/سنة)
3. ✅ أي كمبيوتر أو حتى iPad (للإعداد)
4. ✅ إنترنت سريع

---

## 📝 الخطوة 1: رفع المشروع على GitHub

### أ. إنشاء Repository:
1. اذهب إلى https://github.com
2. اضغط **"New repository"**
3. اسم الـ repo: **UAE7Guard**
4. اجعله **Private** (خاص)
5. اضغط **"Create repository"**

### ب. رفع الكود:
```bash
# في terminal المشروع الحالي:
git remote add github https://github.com/[username]/UAE7Guard.git
git push github claude/build-app-m6220505-E7Wke:main -f
```

---

## 📝 الخطوة 2: التسجيل في Codemagic

### أ. إنشاء حساب:
1. اذهب إلى https://codemagic.io
2. اضغط **"Sign up for free"**
3. سجل دخول بحساب GitHub
4. اسمح لـ Codemagic بالوصول لـ repositories

### ب. اختيار الـ Plan:
- **Free tier:** 500 دقيقة/شهر (كافية لـ 5-10 builds)
- إذا احتجت أكثر: **Pro Plan** $49/شهر

---

## 📝 الخطوة 3: ربط المشروع

### أ. إضافة التطبيق:
1. في Codemagic dashboard، اضغط **"Add application"**
2. اختر **"Connect repository"**
3. اختر **UAE7Guard** من القائمة
4. اضغط **"Next"**

### ب. اختيار Framework:
1. Project type: اختر **"Capacitor"**
2. اضغط **"Finish"**

---

## 📝 الخطوة 4: إعداد iOS Certificates

### ⚠️ هذه الخطوة مهمة جداً!

### أ. Apple Developer Credentials:
1. في Codemagic، اذهب إلى **"Teams" → "Integrations"**
2. اضغط **"Add integration"**
3. اختر **"Apple Developer Portal"**
4. أدخل:
   - **Apple ID:** بريدك في Apple Developer
   - **App-specific password:** (اصنعه من appleid.apple.com)

### ب. إنشاء App-specific Password:
1. اذهب إلى https://appleid.apple.com
2. **Security** → **App-Specific Passwords**
3. اضغط **"+"** واصنع password جديد
4. الاسم: "Codemagic"
5. انسخ الـ password (تظهر مرة واحدة!)
6. ارجع لـ Codemagic والصق الـ password

### ج. Provisioning:
Codemagic سيصنع Certificates و Provisioning Profiles تلقائياً!

---

## 📝 الخطوة 5: إعداد Build Configuration

### أ. Workflow Editor:
1. في مشروع UAE7Guard على Codemagic
2. اذهب إلى **"Workflow Editor"**

### ب. iOS Configuration:
```yaml
workflows:
  ios-release:
    name: iOS Release
    max_build_duration: 60
    instance_type: mac_mini
    environment:
      groups:
        - app_store
      vars:
        BUNDLE_ID: "com.uae7guard.crypto"
        XCODE_WORKSPACE: "ios/App/App.xcworkspace"
        XCODE_SCHEME: "App"
      node: 18
    scripts:
      - name: Install dependencies
        script: |
          npm install
      - name: Build web app
        script: |
          npm run build
      - name: Sync Capacitor
        script: |
          npx cap sync ios
      - name: Set up code signing
        script: |
          xcode-project use-profiles
      - name: Build iOS
        script: |
          xcode-project build-ipa \
            --workspace "$XCODE_WORKSPACE" \
            --scheme "$XCODE_SCHEME"
    artifacts:
      - build/ios/ipa/*.ipa
    publishing:
      app_store_connect:
        api_key: $APP_STORE_CONNECT_KEY_ID
        submit_to_testflight: true
```

**لكن أسهل:** استخدم الـ UI الجاهز!

### ج. Build Settings (من الـ UI):

#### 1. **Build triggers:**
- ✅ Trigger on push (يبني تلقائياً عند push)
- أو يدوي (Manual)

#### 2. **Build environment:**
- **Xcode version:** Latest stable
- **CocoaPods version:** Default

#### 3. **Build arguments:**
- **iOS Bundle ID:** `com.uae7guard.crypto`
- **App name:** UAE7Guard
- **Build number:** Automatic

#### 4. **Distribution:**
- **Type:** App Store
- ✅ Submit to TestFlight
- ✅ Submit to App Store (اختياري)

---

## 📝 الخطوة 6: إضافة Environment Variables

### في Workflow Editor → Environment variables:

```
BUNDLE_ID = com.uae7guard.crypto
APP_NAME = UAE7Guard
```

---

## 📝 الخطوة 7: البناء الأول!

### أ. Start Build:
1. اضغط **"Start new build"**
2. اختر Branch: **main**
3. اختر Workflow: **ios-release**
4. اضغط **"Start build"** 🚀

### ب. انتظر:
- Build يأخذ **15-30 دقيقة**
- راقب الـ Logs للتأكد من سير العملية
- إذا فشل، اقرأ الـ error وصلحه

---

## 📝 الخطوة 8: تحميل إلى App Store Connect

### أ. Automatic Upload:
إذا فعّلت **"Submit to TestFlight"**:
- Codemagic سيرفع التطبيق تلقائياً
- سيظهر في App Store Connect خلال 10-20 دقيقة

### ب. Manual Upload:
إذا اخترت Manual:
1. Download الـ `.ipa` file من Artifacts
2. استخدم **Transporter app** (على Mac) لرفعه
3. أو استخدم **App Store Connect API**

---

## 📝 الخطوة 9: بعد الـ Build

### أ. تحقق من App Store Connect:
1. افتح https://appstoreconnect.apple.com
2. My Apps → UAE7Guard
3. TestFlight → Builds
4. يجب أن تشوف Build جديد خلال 10-30 دقيقة

### ب. معالجة Build:
- Apple ستعالج Build (10-30 دقيقة)
- بعد المعالجة، يصير Build جاهز للـ Submit

### ج. Submit for Review:
- اتبع الخطوات في **HOW_TO_SUBMIT_TO_APPLE_AR.md**
- انسخ النصوص من **APPLE_SUBMISSION_COPY_PASTE_AR.md**
- اضغط Submit! 🚀

---

## ⚠️ المشاكل الشائعة وحلولها:

### 1. Build Failed - Signing Error:
**السبب:** Certificates غير صحيحة
**الحل:**
- تأكد من Apple ID صحيح
- تأكد من App-specific password صحيح
- في Codemagic: **Code signing identities** → Re-fetch

### 2. Build Failed - Capacitor Sync Error:
**السبب:** Dependencies غير محدثة
**الحل:**
```bash
# محلياً، حدّث:
npm install
npx cap sync ios
git add -A
git commit -m "Update dependencies"
git push
```

### 3. Upload Failed:
**السبب:** Bundle ID غير موجود في App Store Connect
**الحل:**
1. اذهب إلى App Store Connect
2. My Apps → + → New App
3. أنشئ التطبيق بـ Bundle ID: com.uae7guard.crypto

### 4. Free Minutes Finished:
**السبب:** استخدمت 500 دقيقة
**الحل:**
- Upgrade لـ **Pro Plan** ($49/شهر)
- أو انتظر الشهر الجديد
- أو استخدم خدمة أخرى (EAS Build)

---

## 💰 التكاليف:

### Codemagic:
| Plan | السعر | Build Minutes | مناسب لـ |
|------|-------|---------------|---------|
| **Free** | $0 | 500 دقيقة/شهر | 5-10 builds |
| **Pro** | $49/شهر | 3000 دقيقة/شهر | مشاريع متعددة |
| **Team** | $99/شهر | 10000 دقيقة/شهر | فرق كبيرة |

### Build Time:
- **iOS Build:** 15-30 دقيقة
- **Android Build:** 10-20 دقيقة
- **كلاهما:** 25-50 دقيقة

### مثال:
- 10 iOS builds = 300 دقيقة تقريباً
- Free tier (500 دقيقة) = كافي لـ 15 build تقريباً

---

## 🔄 البدائل الأخرى:

### 1. **EAS Build (Expo):**
- يحتاج تحويل المشروع من Capacitor لـ Expo
- **التكلفة:** $29/شهر
- **الموقع:** https://expo.dev

### 2. **Bitrise:**
- مشابه لـ Codemagic
- **التكلفة:** Free tier (200 build credits)
- **الموقع:** https://www.bitrise.io

### 3. **GitHub Actions + MacStadium:**
- أكثر تعقيداً
- **التكلفة:** GitHub free + MacStadium $99/شهر
- للمطورين المحترفين

---

## 🎯 خطة العمل السريعة:

### اليوم:
1. ✅ سجل في Codemagic (10 دقائق)
2. ✅ ارفع المشروع على GitHub (5 دقائق)
3. ✅ اربط Codemagic بـ GitHub (5 دقائق)

### اليوم الثاني:
4. ✅ إعداد Apple Developer credentials (15 دقيقة)
5. ✅ إعداد Build configuration (20 دقيقة)
6. ✅ أول Build! (30 دقيقة)

### اليوم الثالث:
7. ✅ تحقق من App Store Connect
8. ✅ Submit for Review
9. ✅ انتظر الموافقة (2-7 أيام)

---

## 📞 مساعدة:

### Codemagic Docs:
- https://docs.codemagic.io/getting-started/capacitor/

### Codemagic Support:
- Email: support@codemagic.io
- Chat: في الـ dashboard

### فيديوهات:
- YouTube: "Codemagic Capacitor iOS"
- Codemagic Blog: https://blog.codemagic.io

---

## ✅ الخلاصة:

**✅ نعم، يمكنك بناء iOS بدون Mac!**

**باستخدام Codemagic:**
- 🚀 سهل وسريع
- 💰 مجاني (لأول 500 دقيقة)
- 📱 يدعم Capacitor مباشرة
- ⚡ Build جاهز خلال 30 دقيقة

**خطوتك التالية:**
1. سجل في Codemagic
2. ارفع المشروع على GitHub
3. اتبع الخطوات أعلاه
4. Build جاهز! 🎉

---

**بالتوفيق! 🚀**

Last Updated: January 22, 2026
