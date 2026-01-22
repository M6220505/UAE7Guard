# 📱 UAE7Guard - دليل النشر على iOS

## المتطلبات الأساسية

### 1. **جهاز Mac**
- macOS 13.0 (Ventura) أو أحدث
- Xcode 15.0 أو أحدث
- CocoaPods مثبت

### 2. **حساب Apple Developer**
- حساب Apple Developer ($99/سنة)
- تسجيل الدخول إلى [Apple Developer Portal](https://developer.apple.com)

### 3. **الأدوات المطلوبة**
```bash
# تثبيت Xcode من Mac App Store
# ثم تثبيت Command Line Tools
xcode-select --install

# تثبيت CocoaPods
sudo gem install cocoapods

# تثبيت Capacitor CLI (إذا لم يكن مثبتاً)
npm install -g @capacitor/cli
```

---

## 🚀 خطوات النشر

### الخطوة 1: بناء التطبيق

```bash
# في مجلد المشروع
cd /path/to/UAE7Guard

# بناء التطبيق
npm run build

# مزامنة Capacitor مع iOS
npx cap sync ios
```

### الخطوة 2: فتح المشروع في Xcode

```bash
# فتح المشروع في Xcode
npx cap open ios

# أو يدوياً:
open ios/App/App.xcworkspace
```

**⚠️ مهم:** افتح ملف `.xcworkspace` وليس `.xcodeproj`

### الخطوة 3: إعداد Xcode Project

#### أ. **General Settings**
1. في Xcode، افتح ملف المشروع من الشريط الجانبي
2. اختر Target: **App**
3. في تبويب **General**:
   - **Display Name:** `UAE7Guard`
   - **Bundle Identifier:** `com.uae7guard.crypto`
   - **Version:** `1.0.0`
   - **Build:** `1`
   - **Deployment Target:** iOS 13.0 أو أحدث

#### ب. **Signing & Capabilities**
1. اذهب إلى تبويب **Signing & Capabilities**
2. ✅ فعّل **Automatically manage signing**
3. اختر **Team:** حسابك في Apple Developer
4. تأكد من ظهور Provisioning Profile تلقائياً

#### ج. **إضافة الـ Capabilities (إذا لزم الأمر)**
- اضغط **+ Capability** وأضف:
  - Push Notifications (للإشعارات)
  - Background Modes (للتحديثات في الخلفية)

### الخطوة 4: تثبيت Dependencies

في Terminal من داخل مجلد المشروع:

```bash
cd ios/App
pod install
cd ../..
```

### الخطوة 5: الاختبار على جهاز حقيقي

#### أ. **توصيل الجهاز**
1. وصّل iPhone/iPad عبر كابل USB
2. افتح Xcode
3. من القائمة العلوية، اختر جهازك من قائمة الأجهزة
4. اضغط ▶️ **Run** (أو Command + R)

#### ب. **الثقة في المطور (Trust Developer)**
على الجهاز:
1. اذهب إلى **Settings > General > VPN & Device Management**
2. اضغط على حساب المطور
3. اضغط **Trust**

### الخطوة 6: إنشاء Archive للنشر

#### أ. **إنشاء Archive**
1. في Xcode، اختر من القائمة:
   ```
   Product > Archive
   ```
2. انتظر حتى ينتهي البناء
3. ستفتح نافذة **Organizer** تلقائياً

#### ب. **رفع التطبيق إلى App Store Connect**
1. في نافذة **Organizer**، اختر أحدث Archive
2. اضغط **Distribute App**
3. اختر **App Store Connect**
4. اضغط **Upload**
5. اتبع التعليمات حتى النهاية

---

## 🎯 النشر على TestFlight (للتجربة)

### 1. **إعداد App Store Connect**

1. اذهب إلى [App Store Connect](https://appstoreconnect.apple.com)
2. اضغط **My Apps**
3. اضغط **+** ثم **New App**
4. املأ المعلومات:
   - **Platform:** iOS
   - **Name:** UAE7Guard
   - **Primary Language:** English
   - **Bundle ID:** `com.uae7guard.crypto`
   - **SKU:** `uae7guard-001`
   - **User Access:** Full Access

### 2. **رفع Build**

بعد رفع التطبيق من Xcode (الخطوة 6ب أعلاه):

1. انتظر 5-10 دقائق حتى يظهر Build في App Store Connect
2. اذهب إلى **TestFlight** tab
3. اختر Build المرفوع
4. املأ **What to Test** (معلومات للمختبرين)
5. اضغط **Save**

### 3. **إضافة مختبرين**

#### أ. **Internal Testing** (داخلي - حتى 100 مختبر)
1. في TestFlight، اضغط **Internal Testing**
2. اضغط **+** بجانب Testers
3. أضف بريد Apple ID للمختبرين
4. سيصلهم دعوة عبر البريد و TestFlight App

#### ب. **External Testing** (خارجي - حتى 10,000 مختبر)
1. في TestFlight، اضغط **External Testing**
2. اضغط **Create New Group**
3. أضف معلومات المجموعة
4. أضف Build
5. اضغط **Submit for Review** (يحتاج موافقة Apple - يومين تقريباً)

---

## 📲 النشر النهائي على App Store

### 1. **إعداد صفحة التطبيق**

في App Store Connect > App Information:

#### أ. **App Information**
- **Name:** UAE7Guard - Crypto Scam Protection
- **Subtitle:** Protect Your Crypto Investments
- **Category:** Finance
- **Secondary Category:** Utilities

#### ب. **App Privacy**
- أضف سياسة الخصوصية URL: `https://uae-7-guard-2.replit.app/privacy`
- أجب على أسئلة الخصوصية بناءً على بيانات التطبيق

#### ج. **Pricing and Availability**
- **Price:** Free
- **Availability:** جميع الدول أو اختر دول محددة (UAE مثلاً)

### 2. **إعداد Version للنشر**

في **App Store** tab:

#### أ. **Screenshots** (لقطات الشاشة)
قم برفع:
- 6.5" iPhone (iPhone 14 Pro Max):
  - 3-10 صور (1290 x 2796 pixels)
- 5.5" iPhone (Optional):
  - 3-10 صور (1242 x 2208 pixels)

**نصيحة:** استخدم أدوات مثل [Figma](https://figma.com) أو [Canva](https://canva.com) لتصميم screenshots احترافية

#### ب. **Description** (الوصف)

**العربية:**
```
حماية استثماراتك في العملات الرقمية من عمليات الاحتيال

UAE7Guard هو تطبيقك الموثوق للحماية من عمليات الاحتيال في عالم العملات الرقمية. تحقق من عناوين المحافظ قبل إرسال أي أموال.

المميزات:
• فحص فوري لعناوين المحافظ
• قاعدة بيانات محدثة بتقارير الاحتيال المؤكدة
• حماية في الوقت الفعلي
• دعم اللغة العربية الكامل
• تشفير AES-256 لبياناتك
• متوافق مع قوانين حماية البيانات الإماراتية

كيفية الاستخدام:
1. أدخل عنوان المحفظة
2. انتظر نتيجة الفحص الفوري
3. اتخذ قرارك بناءً على التقرير

الأمان أولاً مع UAE7Guard!
```

**English:**
```
Protect Your Crypto Investments from Scams

UAE7Guard is your trusted companion for protection against cryptocurrency scams. Verify wallet addresses before sending any funds.

Features:
• Instant wallet address verification
• Updated database of confirmed scam reports
• Real-time protection
• Full Arabic language support
• AES-256 encryption for your data
• UAE Data Protection Law compliant

How to use:
1. Enter the wallet address
2. Get instant verification results
3. Make informed decisions based on reports

Safety first with UAE7Guard!
```

#### ج. **Keywords** (الكلمات المفتاحية)
```
crypto,scam,protection,wallet,blockchain,security,UAE,guard,bitcoin,ethereum
```

#### د. **Support URL**
```
https://uae-7-guard-2.replit.app/contact
```

#### هـ. **Marketing URL** (Optional)
```
https://uae-7-guard-2.replit.app
```

### 3. **Build Information**
- اختر Build من TestFlight
- **Export Compliance:** No (إذا لم تستخدم تشفير خاص)

### 4. **Age Rating**
اضغط **Edit** واختر:
- **4+** (مناسب لجميع الأعمار)

### 5. **Submit for Review**
1. راجع جميع المعلومات
2. اضغط **Submit for Review**
3. انتظر المراجعة (1-3 أيام عادةً)

---

## ⚙️ إعدادات متقدمة

### API Configuration في التطبيق

إذا كنت تريد استخدام API مخصص بدلاً من Replit:

1. افتح `capacitor.config.ts`
2. أضف:
```typescript
server: {
  url: 'https://your-production-api.com',
  cleartext: false
}
```

### دعم الوضع الداكن (Dark Mode)

التطبيق يدعم الوضع الداكن تلقائياً عبر ThemeProvider

### دعم اللغات (RTL)

التطبيق يدعم:
- العربية (RTL)
- الإنجليزية (LTR)

---

## 🔧 حل المشاكل الشائعة

### مشكلة: "No signing certificate found"
**الحل:**
1. افتح Xcode Preferences > Accounts
2. أضف Apple ID
3. اضغط **Manage Certificates**
4. اضغط **+** واختر **Apple Development**

### مشكلة: "Provisioning profile doesn't match"
**الحل:**
1. في Xcode، Signing & Capabilities
2. غيّر Team ثم أرجعه مرة أخرى
3. أو احذف Provisioning Profile يدوياً واتركه يُنشأ تلقائياً

### مشكلة: "CocoaPods could not find compatible versions"
**الحل:**
```bash
cd ios/App
rm Podfile.lock
rm -rf Pods
pod repo update
pod install
```

### مشكلة: "Archive failed"
**الحل:**
1. نظّف المشروع: Product > Clean Build Folder (Shift+Cmd+K)
2. أعد فتح Xcode
3. حاول مرة أخرى

---

## 📋 Checklist قبل النشر

قبل Submit للمراجعة، تأكد من:

- [ ] جميع Screenshots مرفوعة (6.5" iPhone على الأقل)
- [ ] App Icon موجود (1024x1024 بدون شفافية)
- [ ] الوصف بالعربية والإنجليزية
- [ ] Privacy Policy URL صحيح
- [ ] Support URL صحيح
- [ ] جربت التطبيق على TestFlight
- [ ] لا توجد crashes أو bugs واضحة
- [ ] Keywords مناسبة
- [ ] Age Rating صحيح
- [ ] معلومات الخصوصية كاملة

---

## 📞 الدعم

### مراجع مفيدة
- [Apple Developer Documentation](https://developer.apple.com/documentation/)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Capacitor iOS Documentation](https://capacitorjs.com/docs/ios)

### مشاكل شائعة أخرى
- [App Store Connect Help](https://developer.apple.com/help/app-store-connect/)
- [TestFlight Beta Testing](https://developer.apple.com/testflight/)

---

## 🎉 بعد الموافقة

بعد موافقة Apple على التطبيق:

1. التطبيق سيظهر في App Store خلال 24 ساعة
2. شارك رابط App Store مع المستخدمين
3. راقب التقييمات والمراجعات
4. استجب لمشاكل المستخدمين بسرعة

---

## 🔄 التحديثات المستقبلية

عند إصدار نسخة جديدة:

```bash
# 1. حدّث رقم الإصدار في capacitor.config.ts
# 2. ابنِ التطبيق
npm run build

# 3. زامن مع iOS
npx cap sync ios

# 4. افتح Xcode
npx cap open ios

# 5. في Xcode:
# - زِد Build Number (+1)
# - غيّر Version إذا لزم (مثال: 1.0.0 → 1.1.0)

# 6. اعمل Archive جديد
# 7. ارفع إلى App Store Connect
# 8. أضف "What's New" في App Store Connect
# 9. Submit for Review
```

---

**تم التحديث:** 2026-01-22

**Bundle ID:** com.uae7guard.crypto
**App Name:** UAE7Guard
**Version:** 1.0.0
