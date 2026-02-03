# 🚀 UAE7Guard - دليل Submit باستخدام Codemagic

## ✅ لماذا Codemagic أفضل؟

**مقارنة سريعة:**

| الطريقة | Xcode يدوي | Codemagic |
|---------|------------|-----------|
| **الوقت** | 30-60 دقيقة | 5-10 دقائق |
| **الخطوات** | 15+ خطوة | 3 خطوات فقط |
| **الأخطاء** | شائعة | نادرة جداً |
| **Mac مطلوب؟** | ✅ نعم | ❌ لا |
| **Certificates** | يدوياً | أوتوماتيكي |
| **Build** | محلياً | في السحابة |

---

## 🎯 الحالة الحالية

**✅ كل شي جاهز!**

- ✅ **ملف codemagic.yaml:** موجود ومُعد
- ✅ **Bundle ID:** com.uae7guard.crypto
- ✅ **Version:** 1.0
- ✅ **Build System:** Unix timestamp (فريد تلقائياً)
- ✅ **Integration:** App Store Connect

---

## 📋 المتطلبات

### 1. حساب Codemagic (مجاني)
- اذهب إلى: https://codemagic.io/signup
- سجل دخول بحساب GitHub/GitLab/Bitbucket

### 2. حساب Apple Developer (مدفوع - $99/سنة)
- يجب أن يكون عندك Apple Developer Program membership
- رابط: https://developer.apple.com/programs/

### 3. App Store Connect API Key
- هذا المفتاح يسمح لـ Codemagic بالرفع تلقائياً
- سنشرح كيف تحصل عليه أدناه

---

## 🔑 الخطوة 1: إنشاء App Store Connect API Key

### 1.1 تسجيل الدخول:
```
https://appstoreconnect.apple.com
```

### 1.2 إنشاء API Key:

1. اذهب إلى **Users and Access**
2. اختر تبويب **Keys** (في الأعلى)
3. اضغط **Generate API Key** (أو الزائد +)

### 1.3 املأ المعلومات:

```
Name: Codemagic UAE7Guard
Access: App Manager (أو Admin إذا تريد صلاحيات كاملة)
```

4. اضغط **Generate**

### 1.4 حفظ المعلومات المهمة:

بعد الإنشاء، ستحتاج **3 أشياء مهمة:**

```
1. Issuer ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   (موجود في أعلى صفحة Keys)

2. Key ID: XXXXXXXXXX
   (موجود في عمود Key ID)

3. API Key (.p8 file):
   - اضغط Download
   - احفظ الملف في مكان آمن!
   - ⚠️ لن تقدر تحمله مرة ثانية!
```

### 1.5 افتح ملف .p8:

```bash
# افتح الملف بمحرر نصوص
cat AuthKey_XXXXXXXXXX.p8
```

**انسخ المحتوى كاملاً:**
```
-----BEGIN PRIVATE KEY-----
MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQg...
(عدة أسطر)
-----END PRIVATE KEY-----
```

---

## ⚙️ الخطوة 2: إعداد Codemagic

### 2.1 تسجيل الدخول:
```
https://codemagic.io/apps
```

### 2.2 ربط Repository:

1. اضغط **Add application**
2. اختر مصدر الكود:
   - **GitHub** (إذا المشروع على GitHub)
   - **GitLab** / **Bitbucket**
3. اختر repository: `UAE7Guard`
4. اضغط **Finish**

### 2.3 إضافة App Store Connect Integration:

1. في Codemagic dashboard، اذهب إلى:
   ```
   Teams → [Your Team] → Integrations
   ```

2. اضغط **Add integration**

3. اختر **App Store Connect**

4. املأ المعلومات (من الخطوة 1.4):

```
Name: UAE7Guard Production Key

Issuer ID: [من App Store Connect]

Key ID: [من App Store Connect]

API Key: [الصق محتوى ملف .p8 كاملاً]
```

5. اضغط **Save**

---

## 🚀 الخطوة 3: تشغيل Build

### طريقة 1: من Codemagic Dashboard (الأسهل)

1. اذهب إلى **Applications**
2. اختر **UAE7Guard**
3. اختر **Start new build**
4. اختر:
   ```
   Workflow: ios-release
   Branch: main (أو البرانش المطلوب)
   ```
5. اضغط **Start new build**

### طريقة 2: Push to GitHub (أوتوماتيكي)

إذا أعددت Triggers، كل ما تعمل push، Codemagic يبني تلقائياً:

```bash
git add .
git commit -m "Ready for App Store submission"
git push origin main
```

---

## ⏱️ انتظر اكتمال Build

### المراحل:

```
1. ⏳ Preparing build machine     (~1 min)
2. ⏳ Setup Node.js               (~30 sec)
3. ⏳ Install dependencies        (~2-3 min)
4. ⏳ Copy Capacitor assets       (~10 sec)
5. ⏳ Install CocoaPods           (~1-2 min)
6. ⏳ Set up code signing         (~30 sec)
7. ⏳ Increment build number      (~5 sec)
8. ⏳ Build IPA                   (~5-10 min)
9. ⏳ Upload to App Store Connect (~2-5 min)
10. ✅ Done!
```

**الوقت الإجمالي:** 15-25 دقيقة

---

## ✅ عند نجاح Build

ستحصل على:

### 1. Build Artifacts:
```
✅ UAE7Guard.ipa (ملف التطبيق)
✅ Archive files
```

### 2. Upload إلى TestFlight:
```
✅ تلقائياً! (submit_to_testflight: true في codemagic.yaml)
```

### 3. Email Notification:
```
من: Codemagic
الموضوع: "Build #XX succeeded"
```

---

## 📱 الخطوة 4: App Store Connect - إعداد التطبيق

### 4.1 انتظر معالجة Build:

بعد رفع Build من Codemagic:
- اذهب إلى: https://appstoreconnect.apple.com
- **My Apps** → سيظهر build جديد في TestFlight
- انتظر **5-15 دقيقة** حتى يكتمل Processing

### 4.2 إنشاء App Listing (إذا أول مرة):

إذا ما سويت App Listing بعد:

1. **My Apps** → **+ New App**
2. املأ المعلومات:

```
Platform: ✅ iOS

Name: UAE7Guard - Crypto Safety

Primary Language: English (U.S.)

Bundle ID: com.uae7guard.crypto

SKU: uae7guard-crypto-001

User Access: Full Access
```

3. اضغط **Create**

### 4.3 ملء معلومات App Store:

**استخدم الملف الجاهز:**
```
ملف: APP_STORE_METADATA.md
```

**الأقسام المطلوبة:**

#### A. Screenshots:
- **iPhone 6.7":** 3-10 screenshots
- استخدم دليل: `docs/APP_STORE_SCREENSHOTS_GUIDE.md`

#### B. Description:
```
انسخ من: APP_STORE_METADATA.md → Description section
```

#### C. Keywords:
```
scam,checker,crypto,safety,fraud,protection,wallet,blockchain,security,verification
```

#### D. Privacy Policy:
```
URL: https://uae7guard.com/privacy
```

#### E. Support URL:
```
URL: https://uae7guard.com/contact
```

#### F. Demo Account (مهم جداً!):

في **App Review Information:**

```
Sign-in Required: ✅ Yes

Demo Account:
  Email: applereview@uae7guard.com
  Password: AppleReview2026

Notes: [انسخ من APP_STORE_SUBMISSION_GUIDE.md]
```

### 4.4 إضافة Build:

1. اذهب إلى **1.0 Prepare for Submission**
2. في قسم **Build**:
   - اضغط **+ Select a build**
   - اختر Build الذي رفعه Codemagic
   - اضغط **Done**

### 4.5 Submit for Review:

```
✅ راجع كل الحقول
✅ تأكد من Screenshots
✅ تأكد من Demo Account
✅ اضغط "Submit to App Review"
```

---

## 🔄 التحديثات المستقبلية

### لرفع نسخة جديدة:

1. **حدّث Version في المشروع:**

```bash
# في ios/App/App/Info.plist
CFBundleShortVersionString: 1.1  (مثلاً)
```

2. **Push التغييرات:**

```bash
git add .
git commit -m "Version 1.1 - New features"
git push origin main
```

3. **Codemagic يبني تلقائياً:**
   - Build number جديد (Unix timestamp)
   - Upload تلقائي لـ TestFlight

4. **في App Store Connect:**
   - أنشئ **New Version (1.1)**
   - اختر Build الجديد
   - Submit for Review

---

## ⚙️ تعديلات إضافية على codemagic.yaml

### لو تبي Submit مباشرة للـ App Store (بدون TestFlight):

```yaml
publishing:
  app_store_connect:
    auth: integration
    submit_to_testflight: false  # غيّره لـ false
    submit_to_app_store: true     # غيّره لـ true
```

⚠️ **ملاحظة:** هذا سيرفع مباشرة للمراجعة، لكن موصى به تستخدم TestFlight للاختبار أولاً.

### لو تبي Environment Variables:

```yaml
environment:
  vars:
    NODE_VERSION: "20"
    API_URL: "https://api.uae7guard.com"  # مثلاً
    # أضف متغيرات أخرى هنا
```

---

## 🐛 استكشاف الأخطاء

### خطأ: "Code signing failed"

**الحل:**

1. تأكد من App Store Connect API Key صحيح
2. في Codemagic:
   - **Team Settings** → **Integrations**
   - تحقق من **UAE7Guard Production Key**
3. تأكد من Bundle ID مُسجل في Apple Developer:
   - https://developer.apple.com/account/resources/identifiers/list

### خطأ: "Build failed - dependencies"

**الحل:**

```yaml
# في codemagic.yaml، تأكد من:
scripts:
  - name: Install dependencies
    script: |
      npm ci  # بدلاً من npm install (أسرع وأكثر استقراراً)
```

### خطأ: "Upload to App Store Connect failed"

**الحل:**

1. تحقق من App Store Connect API Key:
   - Issuer ID صحيح؟
   - Key ID صحيح؟
   - API Key (.p8) كامل؟

2. تحقق من Bundle ID مُسجل:
   - https://appstoreconnect.apple.com
   - **My Apps** → تأكد من وجود `com.uae7guard.crypto`

### خطأ: "Build number already exists"

**الحل:**

✅ **لن يحدث!** لأن codemagic.yaml يستخدم Unix timestamp (فريد دائماً)

---

## 📊 مراقبة Builds

### في Codemagic:

```
Applications → UAE7Guard → Builds
```

**تشوف:**
- ✅ Build history
- ⏱️ Build duration
- 📊 Success/failure rate
- 📥 Download artifacts (IPA)

### Logs:

كل خطوة في Build عندها logs تفصيلية:
- اضغط على Build number
- شوف كل script وoutput

---

## 💰 التكاليف

### Codemagic Pricing:

**Free Tier:**
```
✅ 500 build minutes/month
✅ Unlimited team size
✅ Unlimited builds
```

**كل Build iOS تقريباً:** 15-20 دقيقة

**يعني:** ~25 builds مجاناً شهرياً

**إذا تحتاج أكثر:**
- **Pay as you go:** $0.038/minute
- **Professional:** $99/month (unlimited)

---

## 🎯 Workflow مثالي للتطوير

### Development → Production:

```
1. طور في local
   ↓
2. Push to GitHub (branch: develop)
   ↓
3. Codemagic يبني TestFlight build تلقائياً
   ↓
4. اختبر على TestFlight
   ↓
5. إذا كل شي تمام:
   - Merge to main
   - Codemagic يبني production build
   ↓
6. Submit to App Store من App Store Connect
```

### Branches Strategy:

```yaml
# في codemagic.yaml، أضف:
triggering:
  events:
    - push
  branch_patterns:
    - pattern: 'main'
      include: true
      source: true
    - pattern: 'develop'
      include: true
      source: true
```

---

## ✅ Checklist قبل أول Build

```
[ ] حساب Codemagic جاهز
[ ] Repository مربوط بـ Codemagic
[ ] Apple Developer membership نشط
[ ] App Store Connect API Key مُنشأ
[ ] API Key مضاف في Codemagic Integrations
[ ] Bundle ID مُسجل في Apple Developer
[ ] ملف codemagic.yaml موجود في root
[ ] Node dependencies يبنون بنجاح محلياً
[ ] Capacitor sync شغال
```

---

## 🎉 مزايا Codemagic الإضافية

### 1. Environment Variables (أسرار):
```
Team Settings → Environment variables
```
- أضف API keys، tokens، إلخ
- آمنة ومشفرة

### 2. Notifications:
```
Workflow settings → Publishing → Email/Slack
```
- تنبيهات عند نجاح/فشل

### 3. Badges:
```
[![Codemagic build status](https://api.codemagic.io/apps/...)](https://codemagic.io/apps/...)
```
- أضفها في README.md

### 4. Testing:
```yaml
scripts:
  - name: Run tests
    script: |
      npm run test
```

---

## 📚 روابط مفيدة

**Codemagic:**
- Dashboard: https://codemagic.io/apps
- Docs: https://docs.codemagic.io/
- iOS Publishing: https://docs.codemagic.io/yaml-publishing/app-store-connect/

**Apple:**
- App Store Connect: https://appstoreconnect.apple.com
- Developer Portal: https://developer.apple.com/account/
- API Keys: https://appstoreconnect.apple.com/access/api

**دلائل إضافية في المشروع:**
- `APP_STORE_SUBMISSION_GUIDE.md` - دليل التقديم الكامل
- `APP_STORE_METADATA.md` - النصوص الجاهزة
- `docs/APP_STORE_SCREENSHOTS_GUIDE.md` - دليل Screenshots

---

## 🚀 ابدأ الآن - ملخص سريع

### 3 خطوات فقط:

```bash
# 1. سجل في Codemagic
https://codemagic.io/signup

# 2. احصل على App Store Connect API Key
https://appstoreconnect.apple.com → Users and Access → Keys

# 3. اضغط "Start new build" في Codemagic
Workflow: ios-release
```

**كل شي أوتوماتيكي بعدها! 🎉**

---

**آخر تحديث:** 24 يناير 2026
**الحالة:** ✅ codemagic.yaml جاهز ومختبر
**Build System:** Unix timestamp (unique builds guaranteed)

**بالتوفيق! 🚀**
