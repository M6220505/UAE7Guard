# 🚀 نشر سريع - UAE7Guard على Vercel

## ✅ الوضع الحالي

تم إعداد جميع الملفات والتكوينات بنجاح. المشروع جاهز 100% للنشر.

---

## 📝 خطوات النشر (15 دقيقة)

### 1. Supabase - قاعدة البيانات

```bash
# افتح:
https://supabase.com/dashboard

# الخطوات:
1. New Project
2. اسم المشروع: UAE7Guard
3. كلمة مرور قوية (احفظها!)
4. المنطقة: أقرب منطقة لك
5. انتظر 2 دقيقة
```

**تشغيل Schema:**
```bash
1. افتح: SQL Editor في Supabase
2. New Query
3. انسخ محتوى ملف: supabase-schema.sql
4. الصق في المحرر
5. اضغط Run
6. انتظر حتى ينتهي
```

**احصل على DATABASE_URL:**
```
Settings → Database → Connection String → URI (Transaction mode)
انسخ الرابط الكامل
```

---

### 2. SendGrid - البريد الإلكتروني

```bash
# افتح:
https://app.sendgrid.com/settings/api_keys

# الخطوات:
1. Create API Key
2. الاسم: UAE7Guard Production
3. Permissions: Full Access
4. Create & View
5. انسخ API Key (يظهر مرة واحدة فقط!)
```

**تحقق من المرسل:**
```
Settings → Sender Authentication → Verify a Single Sender
البريد: noreply@uae7guard.com (أو أي بريد تملكه)
تحقق من البريد الوارد
```

---

### 3. Vercel - النشر

```bash
# افتح:
https://vercel.com/new

# الخطوات:
1. Import Git Repository
2. اختر: UAE7Guard من GitHub
3. اضغط Import
```

**إضافة Environment Variables:**
```
اضغط على: Environment Variables

أضف هذه المتغيرات (إلزامية):

┌────────────────────────┬─────────────────────────────────┐
│ Name                   │ Value                           │
├────────────────────────┼─────────────────────────────────┤
│ NODE_ENV               │ production                      │
│ DATABASE_URL           │ [من Supabase]                   │
│ SESSION_SECRET         │ [أي نص عشوائي طويل 32+ حرف]    │
│ APPLE_REVIEW_PASSWORD  │ AppleReview2026                 │
│ SENDGRID_API_KEY       │ [من SendGrid]                   │
│ SENDGRID_FROM_EMAIL    │ noreply@uae7guard.com          │
│ SENDGRID_FROM_NAME     │ UAE7Guard                       │
└────────────────────────┴─────────────────────────────────┘

لكل متغير، حدد: ✅ Production ✅ Preview ✅ Development
```

**تكوين Build:**
```
Build Command: npm run build
Output Directory: dist/public
Install Command: npm install
Root Directory: ./
```

**اضغط Deploy!**

---

### 4. بعد النشر

**احصل على URL الفعلي:**
```
بعد انتهاء النشر، ستحصل على رابط مثل:
https://uae7guard-xxxx.vercel.app

أو

https://[اسم-المشروع].vercel.app
```

**تحديث التطبيق بالـ URL الجديد:**
```bash
# عدل ملف: client/src/lib/api-config.ts
# السطر 29، غير إلى URL الفعلي من Vercel:
const PRODUCTION_API_URL = 'https://[الرابط-الفعلي].vercel.app';

# عدل ملف: capacitor.config.ts
# أضف الرابط الجديد في allowNavigation

# احفظ وشغل:
npm run build
npx cap sync
git add -A
git commit -m "Update production URL from Vercel"
git push
```

---

## ✅ التحقق من النشر

**اختبر الصحة:**
```bash
curl https://[الرابط-الفعلي].vercel.app/api/health

# يجب أن يرجع:
{
  "status": "ok",
  "database": "connected",
  "timestamp": "...",
  "uptime": 123.45
}
```

**اختبر تسجيل الدخول:**
```
افتح: https://[الرابط-الفعلي].vercel.app
اضغط Sign In
البريد: admin@uae7guard.com
كلمة المرور: admin123456
```

---

## 🔧 إذا واجهت مشاكل

### خطأ Database Connection
```
تحقق من:
1. DATABASE_URL صحيح من Supabase
2. استخدمت Connection Pooler URI (Transaction mode)
3. Schema تم تشغيله بنجاح
```

### خطأ 500 Internal Server Error
```
افتح Vercel Dashboard → Project → Logs
شاهد الأخطاء
عادة تكون:
- متغير بيئي ناقص
- DATABASE_URL خاطئ
- SESSION_SECRET غير موجود
```

### البريد الإلكتروني لا يُرسل
```
تحقق من:
1. SENDGRID_API_KEY صحيح
2. البريد المرسل محقق في SendGrid
3. لم تتجاوز حد الإرسال اليومي (100/يوم للمجاني)
```

---

## 📱 النشر على Mobile

**بعد نجاح Vercel:**
```bash
# تأكد من URL محدث في الكود
npm run build
npx cap sync

# iOS
npx cap open ios
# في Xcode: Product → Archive → Distribute

# Android
npx cap open android
# في Android Studio: Build → Generate Signed Bundle
```

---

## 🎯 الملخص

| المرحلة | الوقت | الحالة |
|---------|-------|--------|
| Supabase Setup | 5 دقائق | ⏳ بانتظار |
| SendGrid Setup | 5 دقائق | ⏳ بانتظار |
| Vercel Deploy | 5 دقائق | ⏳ بانتظار |
| Update URLs | 2 دقيقة | ⏳ بانتظار |
| Testing | 3 دقائق | ⏳ بانتظار |

**المجموع: ~20 دقيقة**

---

## 📞 روابط مهمة

- Vercel Dashboard: https://vercel.com/dashboard
- Supabase Dashboard: https://supabase.com/dashboard
- SendGrid Dashboard: https://app.sendgrid.com
- GitHub Repo: https://github.com/[username]/UAE7Guard

---

**✅ كل شيء جاهز للنشر!**
