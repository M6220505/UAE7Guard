# ✅ Checklist: التحقق من نزول التحديثات

## 🌐 تحديث الموقع/Backend

- [ ] 1. عملت `git push` للكود الجديد
- [ ] 2. أعدت تشغيل السيرفر في Replit
- [ ] 3. فتحت الموقع وعملت Hard Refresh (Ctrl+Shift+R)
- [ ] 4. جربت الميزة الجديدة في المتصفح
- [ ] 5. شفت الـ logs: لا توجد errors

**كيف أتحقق:**
```bash
# شوف آخر commit
git log -1 --oneline

# اختبر الموقع
curl https://your-url.repl.co
```

---

## 📱 تحديث تطبيق iOS

### المرحلة 1: الكود والـ Build

- [ ] 1. عدّلت الكود محلياً
- [ ] 2. رفعت رقم الإصدار في `capacitor.config.ts`
  ```typescript
  version: "1.0.1" // ← غيّر هذا
  ```
- [ ] 3. عملت build محلي
  ```bash
  npm run build
  npx cap sync ios
  ```
- [ ] 4. اختبرت محلياً في Simulator (اختياري)
- [ ] 5. عملت commit & push
  ```bash
  git add .
  git commit -m "iOS v1.0.1: وصف التحديث"
  git push origin main
  ```

### المرحلة 2: Codemagic Build

- [ ] 6. فتحت Codemagic.io
- [ ] 7. بدأت build جديد (Workflow: ios-release)
- [ ] 8. Build نجح (Status: ✅ Success) - انتظر 15-20 دقيقة
- [ ] 9. شفت الـ artifacts (IPA file موجود)

**كيف أتحقق:**
- Codemagic Dashboard → Builds → آخر build
- Status لازم يكون: ✅ Success (مو ❌ Failed)

### المرحلة 3: TestFlight

- [ ] 10. فتحت App Store Connect
- [ ] 11. ذهبت إلى TestFlight → Builds
- [ ] 12. Build الجديد ظهر (انتظر 10-15 دقيقة للـ Processing)
- [ ] 13. Status: "Ready to Submit" أو "Ready for Testing"
- [ ] 14. نزّلت TestFlight على جهازي
- [ ] 15. جربت Build الجديد من TestFlight
- [ ] 16. الميزة الجديدة شغالة ✅

**كيف أتحقق:**
```
App Store Connect → My Apps → UAE7Guard → TestFlight
- شوف Build Number الجديد
- شوف Version Number (1.0.1)
```

### المرحلة 4: App Store (نشر للعامة)

- [ ] 17. في App Store Connect، اخترت Build الجديد
- [ ] 18. ملأت "What's New in This Version"
  ```
  الإصدار 1.0.1:
  - إصلاح مشكلة تسجيل الدخول
  - تحسين سرعة البحث
  - إضافة دعم اللغة العربية
  ```
- [ ] 19. اضغطت "Submit for Review"
- [ ] 20. انتظرت موافقة Apple (1-3 أيام)
- [ ] 21. Status تغير إلى: "Ready for Sale" ✅
- [ ] 22. فتحت App Store على الجوال
- [ ] 23. بحثت عن "UAE7Guard"
- [ ] 24. شفت Version الجديد في "What's New"
- [ ] 25. نزّلت التطبيق من App Store
- [ ] 26. جربت الميزة الجديدة

**كيف أتحقق:**
```
App Store (على iPhone) → ابحث عن UAE7Guard
- Version number لازم يطابق (1.0.1)
- "What's New" يعرض آخر التحديثات
```

---

## 🤖 تحديث تطبيق Android

- [ ] 1. نفس خطوات iOS (1-5)
- [ ] 2. Codemagic → Workflow: android-release
- [ ] 3. نزّل APK/AAB من Artifacts
- [ ] 4. رفع إلى Google Play Console
- [ ] 5. Submit for Review
- [ ] 6. بعد الموافقة، التطبيق ينزل في Google Play

---

## 🔍 طرق التحقق السريع

### طريقة 1: شوف رقم الإصدار داخل التطبيق

أضف في صفحة Settings:

```typescript
// في صفحة Settings
<div>
  <p>Version: {packageJson.version}</p>
  <p>Build: {BUILD_NUMBER}</p>
  <p>Last Updated: {new Date().toLocaleDateString('ar-AE')}</p>
</div>
```

### طريقة 2: شوف Git Commits

```bash
# آخر commit محلي
git log -1 --oneline

# آخر commit في GitHub
git log origin/main -1 --oneline

# لو مختلفين، معناته ما عملت push
```

### طريقة 3: شوف Build Numbers

| المكان | كيف أشوف Build Number |
|--------|----------------------|
| **Codemagic** | Dashboard → Build #123 |
| **App Store Connect** | TestFlight → Build (12345) |
| **Git** | `git rev-list --count HEAD` |
| **داخل التطبيق** | Settings → About → Build |

---

## ⏱️ الوقت المتوقع لكل مرحلة

| المرحلة | iOS | Android | Website |
|---------|-----|---------|---------|
| الكود + Build محلي | 5 دقائق | 5 دقائق | 2 دقيقة |
| Push إلى Git | 1 دقيقة | 1 دقيقة | 1 دقيقة |
| Codemagic Build | 15-20 دقيقة | 10-15 دقيقة | - |
| Processing | 10-15 دقيقة | 5-10 دقيقة | - |
| TestFlight/Internal Testing | فوري | فوري | فوري |
| App Store/Play Store Review | 1-3 أيام | 1-2 أيام | - |
| **الإجمالي (للعامة)** | **1-3 أيام** | **1-2 أيام** | **فوري** |

---

## 🚨 Red Flags: علامات أن التحديث ما نزل

| المشكلة | السبب | الحل |
|---------|-------|------|
| ❌ Build failed في Codemagic | خطأ في الكود | شوف الـ logs وصلح الخطأ |
| ❌ Build ما ظهر في TestFlight | لسه قيد المعالجة | انتظر 15 دقيقة أخرى |
| ❌ الميزة الجديدة مو موجودة | نسيت `npm run build` | Build مرة ثانية |
| ❌ Version number ما تغير | نسيت ترفع الـ version | غيّر في capacitor.config.ts |
| ❌ الموقع ما تحدث | Cache | Hard Refresh (Ctrl+Shift+R) |

---

## 💡 نصائح Pro

### 1. استخدم Tags في Git

```bash
# كل ما تصدر نسخة جديدة
git tag -a v1.0.1 -m "Release v1.0.1: Fix login bug"
git push origin v1.0.1

# شوف كل الـ versions
git tag -l
```

### 2. اعمل Changelog

أنشئ ملف `CHANGELOG.md`:

```markdown
# Changelog

## [1.0.1] - 2026-01-24
### Fixed
- مشكلة تسجيل الدخول
- بطء البحث

### Added
- دعم اللغة العربية الكامل

## [1.0.0] - 2026-01-20
- الإصدار الأول
```

### 3. اختبر على TestFlight أولاً

**دائماً** جرب على TestFlight قبل ما ترسل للـ App Store!

```
TestFlight → جرب كل شيء → لو كل شيء تمام → Submit to App Store
```

### 4. اعمل Automated Version في الكود

```typescript
// في client/src/lib/version.ts
export const APP_VERSION = import.meta.env.PACKAGE_VERSION || "1.0.0";
export const BUILD_DATE = new Date().toISOString();

// في التطبيق
console.log(`UAE7Guard v${APP_VERSION} - Built: ${BUILD_DATE}`);
```

---

## 📞 إذا واجهت مشكلة

### مشكلة: Build نجح بس التحديث مو موجود

```bash
# 1. تحقق من الـ version
cat capacitor.config.ts | grep version

# 2. تحقق من آخر build
git log -1

# 3. امسح الـ cache
npm run build
npx cap sync ios --force

# 4. Build مرة ثانية في Codemagic
```

### مشكلة: App Store ما قبل التحديث

- شوف سبب الرفض في App Store Connect → Resolution Center
- صلح المشكلة
- ارفع Build جديد

---

**تم إنشاء هذا الملف:** 2026-01-24
**آخر تحديث:** 2026-01-24
