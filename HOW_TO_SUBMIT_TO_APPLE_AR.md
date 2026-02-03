# دليل تقديم التطبيق لـ Apple App Store - خطوة بخطوة

## 📋 المتطلبات قبل البدء

### ✅ تأكد من وجود:
1. **حساب Apple Developer** - ($99 سنوياً)
   - سجل على: https://developer.apple.com
2. **جهاز Mac** - (ضروري لـ Xcode)
3. **Xcode** - حمله مجاناً من Mac App Store
4. **ملفات التطبيق جاهزة** - (موجودة في هذا المشروع)

---

## 📱 الخطوات التفصيلية

### الخطوة 1️⃣: تحضير التطبيق

#### أ. تحميل المشروع من Replit
```bash
# في Replit:
1. اضغط على القائمة (⋮) بجانب اسم المشروع
2. اختر "Download as zip"
3. استخرج الملفات على جهاز Mac
```

#### ب. بناء التطبيق
```bash
# افتح Terminal في مجلد المشروع:
cd UAE7Guard

# ثبت المكتبات:
npm install

# ابنِ التطبيق:
npm run build

# زامن مع iOS:
npx cap sync ios
```

---

### الخطوة 2️⃣: فتح المشروع في Xcode

```bash
# افتح Xcode:
npx cap open ios
```

#### في Xcode:
1. انتظر حتى يتم تحميل المشروع بالكامل
2. اختر المشروع من الشريط الجانبي (أيقونة زرقاء)
3. اختر Target: **App**

---

### الخطوة 3️⃣: إعداد الـ Signing & Capabilities

#### في تبويب "Signing & Capabilities":

**أ. Team:**
1. ✅ فعّل "Automatically manage signing"
2. اختر Team: حسابك في Apple Developer

**ب. Bundle Identifier:**
```
com.uae7guard.crypto
```
⚠️ **مهم:** يجب أن يكون فريداً! إذا كان محجوزاً، غيّره إلى:
- `com.yourname.uae7guard`
- `com.uae7guard.checker`

**ج. Version & Build:**
- **Version:** 1.0
- **Build:** 1 (أو أي رقم)

---

### الخطوة 4️⃣: إنشاء App في App Store Connect

#### أ. الدخول إلى App Store Connect:
1. افتح: https://appstoreconnect.apple.com
2. سجل دخول بحساب Apple Developer
3. اضغط **"My Apps"**
4. اضغط زر **"+"** → **"New App"**

#### ب. ملء معلومات التطبيق:

| الحقل | القيمة |
|-------|--------|
| **Platform** | iOS |
| **Name** | UAE7Guard |
| **Primary Language** | English (أو Arabic) |
| **Bundle ID** | اختر Bundle ID الذي أنشأته في Xcode |
| **SKU** | uae7guard-001 (أي كود فريد) |
| **User Access** | Full Access |

اضغط **"Create"**

---

### الخطوة 5️⃣: ملء معلومات التطبيق في App Store Connect

#### أ. App Information (معلومات التطبيق):

**1. Subtitle** (30 حرف):
```
Crypto Scam Address Checker
```

**2. Category:**
- **Primary:** Utilities
- **Secondary:** Reference

**3. Privacy Policy URL:**
```
https://uae7guard.com/privacy
```

**4. Support URL:**
```
https://uae7guard.com/contact
```

#### ب. App Description (الوصف):

**انسخ هذا النص بالكامل:**
```
UAE7Guard - Crypto Address Safety Checker

A FREE educational tool that helps you verify wallet addresses against a community-maintained database of reported scams.

WHAT THIS APP DOES:
• Checks wallet addresses against a public scam report database
• Displays color-coded safety results (green=safe, yellow=caution, red=danger)
• Provides educational content about common cryptocurrency scam types
• Allows community members to report suspicious addresses
• Supports both English and Arabic languages

WHAT THIS APP DOES NOT DO:
• Does NOT store, hold, or manage any cryptocurrency
• Does NOT facilitate buying, selling, or trading of any digital assets
• Does NOT provide financial, investment, or legal advice
• Does NOT connect to any wallet or exchange
• Does NOT require access to your cryptocurrency or private keys
• Does NOT process any financial transactions

EDUCATIONAL PURPOSE:
This app is designed purely for educational and informational purposes. All information provided is based on community-submitted reports and publicly available data. Users should always conduct their own research and consult licensed professionals before making any financial decisions.

PRIVACY-FIRST:
• No account required to check addresses
• Searches are not stored or tracked
• We do not collect personal financial information
• Fully compliant with UAE PDPL regulations

DISCLAIMER:
UAE7Guard is an educational resource only. It is not a regulated financial service. The information provided should not be considered as financial, legal, or investment advice. Always verify information independently and consult with licensed professionals.
```

#### ج. Keywords (الكلمات المفتاحية):
```
scam,checker,crypto,safety,fraud,protection,wallet,address,verify,security,arabic,UAE
```

---

### الخطوة 6️⃣: تحضير الصور المطلوبة

#### أ. App Icon (1024x1024):
- صورة أيقونة التطبيق
- بدون شفافية
- بدون حواف مدورة (Apple تضيفها تلقائياً)

#### ب. Screenshots (لقطات الشاشة):

**للـ iPhone (مطلوب على الأقل نوع واحد):**

**6.7" Display (iPhone 15 Pro Max):**
- الحجم: 1290 x 2796 بكسل
- على الأقل 3 صور، حتى 10 صور

**6.5" Display:**
- الحجم: 1284 x 2778 بكسل

**5.5" Display:**
- الحجم: 1242 x 2208 بكسل

**كيفية أخذ Screenshots:**
```bash
# في Xcode:
1. اختر Simulator: iPhone 15 Pro Max
2. شغّل التطبيق: Cmd + R
3. في التطبيق، اذهب للصفحات المهمة
4. اضغط Cmd + S لحفظ Screenshot
5. الصور تحفظ على Desktop
```

**Screenshots المقترحة:**
1. الصفحة الرئيسية مع مربع البحث
2. نتيجة فحص عنوان آمن (أخضر)
3. نتيجة فحص عنوان خطير (أحمر)
4. صفحة Learning Center
5. اللغة العربية (إظهار RTL)
6. صفحة Dashboard بعد تسجيل الدخول

---

### الخطوة 7️⃣: إنشاء Archive وتحميله

#### أ. في Xcode - إنشاء Archive:

**1. اختيار الجهاز:**
- من القائمة العلوية، اختر **"Any iOS Device (arm64)"**

**2. إنشاء Archive:**
```
Menu: Product → Archive
```

⏳ انتظر حتى ينتهي (قد يأخذ 5-15 دقيقة)

**3. نافذة Organizer ستفتح تلقائياً:**
- إذا لم تفتح: `Window → Organizer`
- اختر Archive الذي أنشأته (الأحدث)

#### ب. توزيع التطبيق (Distribute):

**1. اضغط "Distribute App"**

**2. اختر:**
- ✅ **App Store Connect**
- اضغط Next

**3. Destination:**
- ✅ **Upload**
- اضغط Next

**4. App Store Connect Distribution Options:**
- ✅ Upload your app's symbols...
- ✅ Manage Version and Build Number
- اضغط Next

**5. Signing:**
- ✅ Automatically manage signing
- اضغط Next

**6. Review التفاصيل:**
- اضغط **Upload**

⏳ انتظر التحميل (5-20 دقيقة حسب سرعة النت)

---

### الخطوة 8️⃣: اختيار Build في App Store Connect

#### أ. الانتظار على Processing:
- بعد التحميل من Xcode، انتظر 10-30 دقيقة
- App Store Connect يعالج التطبيق

#### ب. اختيار Build:
1. ارجع لـ App Store Connect
2. اختر تطبيقك UAE7Guard
3. اضغط على تبويب **"App Store"** من اليسار
4. قسم **"Build"**:
   - اضغط **"+"** بجانب Build
   - اختر Build رقم الذي رفعته
   - اضغط **Done**

---

### الخطوة 9️⃣: Age Rating (التصنيف العمري)

في قسم **"Age Rating"**:

اضغط **Edit** واملأ الاستبيان:

| السؤال | الإجابة |
|--------|---------|
| Cartoon or Fantasy Violence | None |
| Realistic Violence | None |
| Sexual Content or Nudity | None |
| Profanity or Crude Humor | None |
| Alcohol, Tobacco, or Drug Use | None |
| Simulated Gambling | None |
| Horror/Fear Themes | None |
| Mature/Suggestive Themes | None |
| Medical/Treatment Information | None |
| Unrestricted Web Access | **No** |
| Gambling & Contests | None |

**النتيجة المتوقعة:** 4+ (مناسب لجميع الأعمار)

---

### الخطوة 🔟: App Review Information (معلومات المراجعة)

#### أ. Contact Information:
```
First Name: [اسمك]
Last Name: [اسم العائلة]
Phone Number: [رقم هاتفك مع كود الدولة]
Email: [بريدك الإلكتروني]
```

#### ب. Demo Account (حساب تجريبي):

⚠️ **مهم جداً! يجب إضافة هذه المعلومات:**

**Sign-in Required:** ✅ Yes (اختر هذا الخيار)

```
Username: applereview@uae7guard.com
Password: AppleReview2026
```

**Additional Information (ملاحظات إضافية):**

**انسخ هذا النص بالكامل في حقل "Notes":**

```
Dear App Review Team,

UAE7Guard is a FREE EDUCATIONAL TOOL for checking cryptocurrency wallet addresses against a community-maintained database of reported scams.

DEMO ACCOUNT:
Email: applereview@uae7guard.com
Password: AppleReview2026

CLASSIFICATION CLARIFICATION:

This app is NOT:
• A cryptocurrency wallet (we do not store any crypto)
• A cryptocurrency exchange (we do not facilitate any trades)
• A financial advisory service (we provide information only)
• A money transmission service (no money flows through our app)

This app IS:
• An educational reference tool (similar to a virus scanner)
• A community reporting platform (like a fraud reporting website)
• An informational database lookup service

HOW IT WORKS:
1. User enters a wallet address (just text input)
2. App checks our database of community-reported scam addresses
3. App displays a color-coded result (safe/caution/danger)
4. App shows educational content about scam types

NO FINANCIAL TRANSACTIONS:
• We never ask for private keys
• We never connect to any wallet
• We never process any payments
• We never handle, store, or transmit cryptocurrency

TESTING INSTRUCTIONS:
1. Launch the app
2. Use demo account to sign in
3. Enter test wallet address: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
4. View verification result
5. Toggle language to Arabic using 🌐 icon
6. All features work in both English and Arabic (RTL)

PRIVACY & COMPLIANCE:
• UAE PDPL compliant
• No personal data collected for searches
• No tracking or analytics beyond essential app functionality
• Privacy policy available at: https://uae7guard.com/privacy

This is comparable to:
• A phone number spam checker
• A website safety checker
• A fraud awareness educational app

We are happy to provide any additional clarification needed.

Thank you for your review!
```

---

### الخطوة 1️⃣1️⃣: Pricing & Availability (السعر والتوفر)

#### في قسم Pricing:

**1. Price:**
- اختر **Free** (مجاني)

**2. Availability:**
- ✅ Make this app available in all territories
- أو اختر دول محددة (UAE, Saudi Arabia, etc.)

---

### الخطوة 1️⃣2️⃣: Submit for Review (إرسال للمراجعة)

#### التحقق النهائي:

**تأكد من إكمال كل شيء:**
- ✅ App Description
- ✅ Keywords
- ✅ Screenshots (على الأقل نوع واحد من iPhone)
- ✅ App Icon (1024x1024)
- ✅ Build Number محدد
- ✅ Privacy Policy URL
- ✅ Support URL
- ✅ Age Rating
- ✅ Demo Account معلومات
- ✅ Review Notes

#### الإرسال:

1. اضغط **"Submit for Review"** (زر أزرق في الأعلى)
2. اقرأ وافق على الشروط
3. اضغط **"Submit"**

---

## 🎉 تم الإرسال بنجاح!

### ماذا يحدث الآن؟

**1. Waiting for Review (في الانتظار):**
- المدة: 1-7 أيام عادةً
- ستصلك إيميلات من Apple عن حالة المراجعة

**2. In Review (قيد المراجعة):**
- المدة: 24-48 ساعة
- فريق Apple يختبر تطبيقك

**3. النتائج المحتملة:**

#### ✅ **Approved (تم القبول):**
- 🎊 مبروك! التطبيق صار على App Store
- سيظهر على Store خلال 24 ساعة

#### ❌ **Rejected (تم الرفض):**
**لا تقلق! هذا طبيعي في المرة الأولى**

**الأسباب الشائعة:**
1. معلومات حساب Demo غير صحيحة
2. Screenshots غير واضحة
3. Crash أو Bug في التطبيق
4. مخالفة لقواعد App Store

---

## 🔧 ماذا تفعل إذا تم الرفض؟

### الخطوات:

**1. اقرأ رسالة الرفض بعناية:**
- Apple ترسل سبب الرفض تفصيلياً
- عادة في Resolution Center

**2. الرد على Apple:**

**أ. إذا كان سوء فهم:**
```
Dear App Review Team,

Thank you for reviewing UAE7Guard.

We would like to clarify the following points:

[اشرح المشكلة بالتفصيل]

This app is purely educational and does not:
• Handle cryptocurrency transactions
• Store or manage crypto assets
• Provide financial advice

Demo Account (if needed again):
Email: applereview@uae7guard.com
Password: AppleReview2026

We have also prepared a detailed guide at:
https://github.com/[your-repo]/APPLE_REVIEW_DEMO_ACCOUNT.md

Please let us know if you need any additional information.

Thank you!
```

**ب. إذا كان يحتاج تعديل:**
1. صلّح المشكلة في الكود
2. Build جديد
3. Upload مرة ثانية
4. Submit for Review مرة ثانية

---

## 📞 معلومات الدعم

**إذا واجهت مشاكل:**

**1. Apple Developer Support:**
- https://developer.apple.com/contact/
- Phone: (اختلف حسب البلد)

**2. App Store Connect Help:**
- https://developer.apple.com/app-store-connect/

**3. ملفات المساعدة في المشروع:**
- `APP_STORE_SUBMISSION.md` - دليل التقديم
- `APPLE_REVIEW_DEMO_ACCOUNT.md` - معلومات الحساب التجريبي
- `MOBILE_APP_GUIDE.md` - دليل البناء والنشر

---

## ✅ Checklist النهائي

قبل Submit، تأكد من:

- [ ] حساب Apple Developer نشط ($99 مدفوعة)
- [ ] Xcode محدث لآخر إصدار
- [ ] Bundle ID فريد
- [ ] App Icon 1024x1024 موجود
- [ ] Screenshots على الأقل 3 صور لجهاز واحد
- [ ] Privacy Policy URL يعمل
- [ ] Support URL يعمل
- [ ] Demo Account يعمل ومختبر
- [ ] App Description مكتوب كامل
- [ ] Keywords أقل من 100 حرف
- [ ] Age Rating مكتمل
- [ ] Review Notes مكتوبة بالتفصيل
- [ ] Build تم تحميله ومعالجته
- [ ] اختبرت التطبيق ولا يوجد crashes

---

## 🚀 نصائح للنجاح

**1. الصبر:**
- المراجعة قد تأخذ أسبوع
- لا تستعجل

**2. الوضوح:**
- اشرح التطبيق بوضوح
- لا تترك مجال للتفسيرات الخاطئة

**3. الجودة:**
- اختبر التطبيق جيداً قبل الإرسال
- تأكد من عدم وجود bugs

**4. الرد السريع:**
- إذا رفضوا التطبيق، رد خلال 24-48 ساعة
- كن مهذباً ومحترفاً

**5. المستندات:**
- احتفظ بنسخة من كل شيء
- Screenshots, Descriptions, Notes

---

## 📊 Timeline المتوقع

| المرحلة | المدة |
|---------|-------|
| بناء التطبيق في Xcode | 10-20 دقيقة |
| Upload إلى App Store Connect | 5-20 دقيقة |
| Processing على App Store | 10-60 دقيقة |
| Waiting for Review | 1-7 أيام |
| In Review | 24-48 ساعة |
| **إجمالي** | **2-10 أيام** |

---

## 🎓 موارد إضافية

**Apple Documentation:**
- App Store Review Guidelines: https://developer.apple.com/app-store/review/guidelines/
- App Store Connect Help: https://help.apple.com/app-store-connect/

**فيديوهات:**
- How to Submit iOS App: (ابحث على YouTube)
- App Store Connect Tutorial

---

**آخر تحديث:** 22 يناير 2026
**النسخة:** 1.0
**المؤلف:** Mohamed (M6220505)

---

# بالتوفيق! 🍀

إذا اتبعت هذه الخطوات بدقة، إن شاء الله التطبيق يتقبل من أول مرة!

لا تتردد في السؤال إذا واجهت أي مشكلة في أي خطوة. 💪
