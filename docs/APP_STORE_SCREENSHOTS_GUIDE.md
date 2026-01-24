# دليل شامل لتوليد Screenshots للـ App Store

## المتطلبات الأساسية

### أحجام الشاشات المطلوبة من Apple

حسب App Store Connect، تحتاج لرفع screenshots لجميع أحجام الـ iPhone:

| حجم الشاشة | الدقة المطلوبة | الأجهزة |
|------------|----------------|----------|
| **6.9" Display** | 1242×2688px, 2688×1242px, 1284×2778px, 2778×1284px | iPhone 16 Pro Max, 15 Pro Max, 14 Pro Max |
| **6.7" Display** | 1290×2796px, 2796×1290px | iPhone 15 Plus, 14 Plus |
| **6.5" Display** | 1242×2688px, 2688×1242px | iPhone XS Max, 11 Pro Max |
| **6.3" Display** | 1290×2796px, 2796×1290px | iPhone 16 Pro, 15 Pro, 14 Pro |
| **6.1" Display** | 1170×2532px, 2532×1170px | iPhone 14, 13, 12, 11, XR |
| **5.5" Display** | 1242×2208px, 2208×1242px | iPhone 8 Plus, 7 Plus, 6s Plus |
| **4.7" Display** | 750×1334px, 1334×750px | iPhone SE (2nd/3rd gen), 8, 7, 6s |
| **4" Display** | 640×1136px, 1136×640px | iPhone SE (1st gen), 5s |
| **3.5" Display** | 640×960px, 960×640px | iPhone 4s (نادر الاستخدام) |

**ملاحظات مهمة:**
- الـ 3 صور الأولى ستظهر في صفحة التطبيق الرئيسية
- يمكنك رفع حتى 10 screenshots لكل حجم شاشة
- Screenshots مطلوبة فقط لـ iOS (Android اختياري)

---

## الطريقة 1: استخدام Xcode iOS Simulator (الأفضل)

### الخطوات:

#### 1. افتح المشروع في Xcode

```bash
# من مجلد المشروع
npm run cap:open:ios
```

هذا سيفتح `ios/App/App.xcworkspace` في Xcode.

#### 2. اختر الـ Simulator المطلوب

في Xcode، من القائمة العلوية:
- اضغط على اسم الجهاز بجانب زر الـ Play
- اختر الجهاز المناسب، مثل:
  - **iPhone 16 Pro Max** (6.9")
  - **iPhone 15 Pro** (6.3")
  - **iPhone 14** (6.1")
  - **iPhone 8 Plus** (5.5")
  - **iPhone SE (3rd gen)** (4.7")

#### 3. شغل التطبيق

- اضغط على زر Play (▶️) أو `Cmd+R`
- انتظر حتى يشتغل الـ Simulator

#### 4. التقط Screenshots

**طريقة آلية (مستحسنة):**

استخدم Xcode Screenshot Tool:
1. Xcode → Debug → View Debugging → **Take Screenshot**
2. أو استخدم shortcut: `Cmd+S` بعد فتح الـ Debug Menu

**طريقة يدوية:**
1. في الـ Simulator، اذهب للصفحة المطلوبة
2. اضغط `Cmd+S` في الـ Simulator
3. أو: Screenshot → Save Screen

#### 5. أين تجد الصور؟

الصور تُحفظ في:
- **Desktop** (المكتب)
- أو: `~/Desktop/`
- اسم الملف: `Simulator Screen Shot - Device - Date-Time.png`

---

## الطريقة 2: استخدام Fastlane Snapshot (آلي 100%)

### التثبيت

```bash
# ثبت Fastlane
sudo gem install fastlane

# اذهب لمجلد iOS
cd ios/App

# أعد Snapshot
fastlane snapshot init
```

### إعداد UI Tests

أنشئ ملف `ios/App/AppUITests/SnapshotTests.swift`:

```swift
import XCTest

class SnapshotTests: XCTestCase {

    override func setUp() {
        super.setUp()

        let app = XCUIApplication()
        setupSnapshot(app)
        app.launch()
    }

    func testTakeScreenshots() {
        let app = XCUIApplication()

        // الصفحة الرئيسية
        sleep(2)
        snapshot("01-Home")

        // صفحة التحقق
        app.buttons["Verify"].tap()
        sleep(2)
        snapshot("02-Verification")

        // صفحة Dashboard
        app.buttons["Dashboard"].tap()
        sleep(2)
        snapshot("03-Dashboard")

        // صفحة Analytics
        app.buttons["Analytics"].tap()
        sleep(2)
        snapshot("04-Analytics")

        // صفحة التعليم
        app.buttons["Learn"].tap()
        sleep(2)
        snapshot("05-Learn")
    }
}
```

### ملف Snapfile

أنشئ `ios/App/Snapfile`:

```ruby
# UAE7Guard Screenshot Configuration

# الأجهزة المطلوبة
devices([
  "iPhone 16 Pro Max",    # 6.9"
  "iPhone 15 Pro",        # 6.3"
  "iPhone 14",            # 6.1"
  "iPhone 8 Plus",        # 5.5"
  "iPhone SE (3rd generation)" # 4.7"
])

# اللغات (إنجليزي وعربي)
languages([
  "en-US",
  "ar-SA"
])

# الـ Scheme
scheme("App")

# مجلد الحفظ
output_directory("./screenshots")

# امسح الـ screenshots القديمة
clear_previous_screenshots(true)

# اظهر الـ Simulator
override_status_bar(true)

# تخصيص Status Bar
status_bar_content_type("light")
```

### التشغيل

```bash
cd ios/App
fastlane snapshot
```

هذا سيولد **جميع الـ screenshots تلقائياً** لكل الأجهزة واللغات!

---

## الطريقة 3: أدوات Online (بدون Mac)

إذا ما عندك Mac، استخدم هذه الأدوات:

### 1. App Store Screenshot Generator
**الرابط:** https://www.appstorescreenshot.com/

**الميزات:**
- رفع screenshot واحد
- يولد جميع الأحجام تلقائياً
- مجاني

**الطريقة:**
1. التقط screenshot من التطبيق (أي حجم)
2. ارفعه للموقع
3. حمل جميع الأحجام المطلوبة

### 2. Previewed
**الرابط:** https://previewed.app/

**الميزات:**
- إضافة Device Frames
- تخصيص الخلفية
- Text overlays (نصوص توضيحية)

**الطريقة:**
1. رفع Screenshots
2. اختر iPhone Frame
3. أضف نصوص باللغة العربية
4. حمل بجميع الأحجام

### 3. Figma + App Store Screenshot Plugin
**الرابط:** https://www.figma.com/

**الطريقة:**
1. أنشئ Artboards بالأحجام المطلوبة
2. استورد screenshots من التطبيق
3. أضف تصاميم وتأثيرات
4. Export بدقة عالية

---

## الطريقة 4: استخدام Android Emulator + تحويل الأحجام

إذا عندك Android Studio فقط:

```bash
# شغل الـ emulator
npm run cap:open:android

# شغل التطبيق
# التقط screenshots داخل الـ emulator

# استخدم ImageMagick لتغيير الحجم:
convert screenshot.png -resize 1242x2688 iphone-promax.png
```

---

## أفضل الممارسات للـ Screenshots

### 1. اختر أهم 3-5 صفحات فقط

**مقترحاتي لـ UAE7Guard:**

1. **Home/Landing** - تعرض قوة التطبيق
2. **Sovereign Verification Report** - الميزة الرئيسية
3. **Platform Analytics** - الإحصائيات المباشرة
4. **Wallet Verification** - أمثلة Safe/Dangerous
5. **AI Prediction** - التحليل الذكي

### 2. استخدم Dark Mode

تطبيقك يدعم Dark Mode، والـ screenshots تطلع أحلى:
- تأكد أن الـ theme مضبوط على Dark
- يعطي انطباع احترافي

### 3. أضف Captions (نصوص توضيحية)

في App Store Connect، يمكنك إضافة نصوص تحت كل screenshot:

**أمثلة بالإنجليزية:**
- "Enterprise-grade blockchain verification"
- "Real-time threat intelligence"
- "AI-powered scam detection"

**أمثلة بالعربية:**
- "تحقق احترافي من المعاملات"
- "استخبارات تهديدات فورية"
- "كشف الاحتيال بالذكاء الصناعي"

### 4. تجنب النصوص الصغيرة

- اختر صفحات فيها عناصر واضحة
- تجنب الصفحات المزدحمة
- استخدم Zoom على العناصر الهامة

---

## خطوات الرفع على App Store Connect

### 1. افتح Media Manager

```
App Store Connect → My Apps → UAE7Guard →
iOS App → Version 1.0 → Media Manager
```

### 2. اضغط على حجم الشاشة

مثلاً: **iPhone 6.9" Display**

### 3. ارفع الصور

- اسحب الصور (Drag & Drop)
- أو اضغط "Choose File"
- رتب الصور (الأهم أولاً)

### 4. كرر لكل حجم شاشة

افعل نفس الشيء لـ:
- 6.9" Display
- 6.5" Display
- 6.3" Display
- 6.1" Display
- 5.5" Display (اختياري)
- 4.7" Display (اختياري)

**ملاحظة:** Apple تقبل screenshots من أكبر جهاز لكل فئة، لكن الأفضل رفع لكل حجم.

### 5. احفظ

اضغط **Save** في الأعلى.

---

## السكريبتات الجاهزة في المشروع

أضفت لك scripts في `package.json`:

```bash
# بناء التطبيق ومزامنة Capacitor
npm run cap:build

# مزامنة iOS فقط
npm run cap:sync:ios

# مزامنة Android فقط
npm run cap:sync:android

# فتح Xcode
npm run cap:open:ios

# فتح Android Studio
npm run cap:open:android
```

---

## نصائح إضافية

### للغة العربية

إذا تريد screenshots بالعربية:
1. غير اللغة في التطبيق للعربية
2. التقط screenshots جديدة
3. ارفعها في قسم "ar-SA" في App Store Connect

### الـ iPad Screenshots (اختياري)

إذا تريد تدعم iPad:

**الأحجام المطلوبة:**
- **12.9" iPad Pro**: 2048×2732px
- **11" iPad Pro**: 1668×2388px
- **10.5" iPad Pro**: 1668×2224px

**الطريقة:**
نفس الخطوات، لكن اختر iPad Simulator في Xcode.

---

## الحل السريع (Quick Start)

إذا تريد تخلص بسرعة:

1. **شغل التطبيق في Simulator:**
   ```bash
   npm run cap:open:ios
   # في Xcode، اختر iPhone 16 Pro Max
   # اضغط Play
   ```

2. **التقط 5 screenshots:**
   - Home screen
   - Verification screen
   - Analytics screen
   - Learn screen
   - Settings screen

3. **استخدم موقع لتوليد الأحجام:**
   - اذهب لـ https://www.appstorescreenshot.com/
   - ارفع الـ 5 صور
   - حمل جميع الأحجام

4. **ارفع في App Store Connect**

---

## الخلاصة

**الطريقة الأسهل:**
1. استخدم Xcode Simulator
2. شغل التطبيق على iPhone 16 Pro Max
3. التقط screenshots
4. استخدم appstorescreenshot.com لتوليد الأحجام

**الطريقة الأحترافية:**
1. استخدم Fastlane Snapshot
2. اكتب UI Tests مرة واحدة
3. ولد جميع الـ screenshots تلقائياً
4. بلغات متعددة (EN + AR)

---

## الملفات المرفقة

في هذا المجلد ستجد:
- ✅ `Snapfile` - إعدادات Fastlane
- ✅ `SnapshotTests.swift` - UI Tests جاهزة
- ✅ Screenshot templates بأحجام مختلفة

---

**أي استفسار؟ تواصل معي وسأساعدك!** 🚀
