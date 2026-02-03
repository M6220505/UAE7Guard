# 🔧 حل مشكلة تسجيل الدخول - خطأ 500

## 📱 المشكلة

عند محاولة تسجيل الدخول في التطبيق على **uae7guard.com**، تظهر رسالة خطأ:

```
Login failed
500: {"error":"Login failed"}
```

![Login Error Screenshot](https://i.imgur.com/example.png)

---

## 🔍 تشخيص المشكلة

### السبب الرئيسي
التطبيق المنشور على Vercel يحاول الاتصال بقاعدة بيانات **localhost** بدلاً من **Supabase**.

### لماذا حدثت المشكلة؟
عندما قمت بالانتقال من Replit إلى Vercel + Supabase، لم يتم تحديث متغيرات البيئة (Environment Variables) على Vercel بشكل صحيح.

### كيف أتحقق من المشكلة؟
نفذ هذا الأمر في Terminal:

```bash
npm run check-env
```

ستحصل على تقرير مفصل عن حالة التكوين:

```
❌ DATABASE_URL points to localhost! This will fail in production.
❌ SESSION_SECRET using default value
✅ APPLE_REVIEW_PASSWORD configured
```

---

## ✅ الحل (5 خطوات - 10 دقائق)

### 1️⃣ احصل على DATABASE_URL من Supabase

1. افتح [Supabase Dashboard](https://supabase.com/dashboard)
2. اختر مشروعك **UAE7Guard**
3. من القائمة الجانبية: **Settings** → **Database**
4. ابحث عن **Connection string**
5. اختر تبويب **URI** (وليس Session mode)
6. انسخ الـ URL كاملاً

**مثال على الشكل الصحيح:**
```
postgresql://postgres.abcdefgh:YourPassword123@aws-0-us-east-1.pooler.supabase.com:5432/postgres
```

**⚠️ ملاحظات مهمة:**
- استخدم **Connection Pooler** (Port 5432) وليس Direct Connection
- تأكد من نسخ كلمة المرور كاملة
- لا تترك مسافات في البداية أو النهاية

---

### 2️⃣ أنشئ SESSION_SECRET آمن

في Terminal، نفذ:

```bash
openssl rand -base64 32
```

**مثال على النتيجة:**
```
xK8v3pL9mN4qR7wT2yU5hJ6fG1dS0aZ8cBvNmQ3wE4r=
```

**📋 انسخ هذا النص واحفظه** - ستحتاجه في الخطوة التالية.

---

### 3️⃣ حدّث متغيرات البيئة على Vercel

#### الطريقة الأولى: من Dashboard (الأسهل)

1. افتح [Vercel Dashboard](https://vercel.com/dashboard)
2. اختر مشروع **UAE7Guard**
3. اذهب إلى: **Settings** → **Environment Variables**
4. ابحث عن `DATABASE_URL`:
   - إذا كان موجوداً: اضغط **Edit** → الصق القيمة الجديدة
   - إذا لم يكن موجوداً: اضغط **Add New**
5. كرر العملية لـ `SESSION_SECRET`

**المتغيرات المطلوبة:**

| Name | Value | Environment |
|------|-------|-------------|
| `DATABASE_URL` | القيمة من Supabase | Production, Preview, Development |
| `SESSION_SECRET` | القيمة من الخطوة 2 | Production, Preview, Development |
| `APPLE_REVIEW_PASSWORD` | `AppleReview2026` | Production, Preview, Development |
| `NODE_ENV` | `production` | Production فقط |

**💡 نصيحة:** عند إضافة متغير جديد، اختر **All environments** لتطبيقه على Production و Preview معاً.

#### الطريقة الثانية: من Vercel CLI (متقدم)

```bash
# تسجيل الدخول
vercel login

# ربط المشروع
vercel link

# إضافة المتغيرات
vercel env add DATABASE_URL production
# الصق DATABASE_URL عندما يُطلب منك

vercel env add SESSION_SECRET production
# الصق SESSION_SECRET عندما يُطلب منك
```

---

### 4️⃣ أعد نشر التطبيق (Redeploy)

بعد تحديث المتغيرات:

1. في Vercel Dashboard → تبويب **Deployments**
2. اضغط على أحدث deployment (الأول في القائمة)
3. اضغط على النقاط الثلاث **"..."** في الزاوية
4. اختر **Redeploy**
5. في النافذة المنبثقة، اختر **Redeploy**
6. انتظر 2-3 دقائق حتى ينتهي النشر

**✅ علامات النجاح:**
- يتحول لون Status إلى أخضر
- تظهر رسالة "Building completed"
- يظهر رابط Production جاهز

---

### 5️⃣ اختبر التطبيق

#### أ) اختبار الاتصال بقاعدة البيانات

افتح في المتصفح:
```
https://uae7guard.com/api/health
```

**الناتج المتوقع:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-26T...",
  "database": "connected",
  "environment": "production",
  "features": {
    "database": true,
    "sessions": true,
    ...
  }
}
```

**❌ إذا رأيت:**
```json
{
  "status": "error",
  "database": "connection failed"
}
```
→ ارجع للخطوة 3 وتأكد من صحة DATABASE_URL

#### ب) اختبار تسجيل الدخول

1. افتح التطبيق على **uae7guard.com**
2. انتقل لصفحة **Sign In**
3. استخدم حساب Demo:
   - **Email**: `applereview@uae7guard.com`
   - **Password**: `AppleReview2026`
4. اضغط **Sign In**

**✅ نجح التسجيل:**
- يتم توجيهك لصفحة Dashboard
- لا تظهر رسائل خطأ
- تظهر بيانات المستخدم في الأعلى

**❌ ما زال الخطأ موجوداً:**
- راجع الخطوات من البداية
- تأكد من إعادة النشر (Redeploy)
- افحص Logs على Vercel (انظر القسم التالي)

---

## 🔍 استكشاف الأخطاء (Troubleshooting)

### المشكلة: ما زال خطأ 500 يظهر

#### 1. تحقق من Vercel Logs

1. Vercel Dashboard → **Deployments**
2. اضغط على أحدث deployment
3. اضغط على تبويب **Function Logs**
4. ابحث عن سطور تحتوي على "error" أو "failed"

**أخطاء شائعة:**

| رسالة الخطأ | السبب | الحل |
|------------|-------|------|
| `Connection refused` | DATABASE_URL خاطئ | راجع الخطوة 1 |
| `Authentication failed` | كلمة المرور خاطئة في DATABASE_URL | انسخ DATABASE_URL مرة أخرى من Supabase |
| `relation "users" does not exist` | لم يتم تطبيق schema على Supabase | نفذ `supabase-schema.sql` في Supabase SQL Editor |

#### 2. تحقق من Supabase Connection

افتح Supabase Dashboard → **Database** → **Connection Pooler**

تأكد من:
- ✅ Pooler Status: **Active**
- ✅ Mode: **Transaction** أو **Session**
- ✅ Port: **5432**

#### 3. اختبر DATABASE_URL محلياً

أنشئ ملف `.env.test`:

```bash
DATABASE_URL="postgresql://postgres.xxxxx:password@..."
```

نفذ:
```bash
npm run check-env
```

يجب أن ترى:
```
✅ DATABASE_URL configured correctly
```

---

## 📋 Checklist النهائي

استخدم هذه القائمة للتأكد من إكمال كل شيء:

- [ ] ✅ حصلت على DATABASE_URL من Supabase (يبدأ بـ `postgresql://`)
- [ ] ✅ أنشأت SESSION_SECRET جديد (32+ حرف)
- [ ] ✅ أضفت/حدثت المتغيرات على Vercel
- [ ] ✅ اخترت **All environments** عند إضافة المتغيرات
- [ ] ✅ أعدت نشر التطبيق (Redeploy)
- [ ] ✅ اختبرت `/api/health` ورأيت `"database": "connected"`
- [ ] ✅ نجح تسجيل الدخول بحساب Demo
- [ ] ✅ لا توجد أخطاء في Function Logs

---

## 🎯 الخطوات التالية

بعد حل مشكلة تسجيل الدخول:

### 1. حدّث Mobile App
إذا كنت تستخدم التطبيق على iOS/Android، حدّث API URL:

```typescript
// client/src/lib/api-config.ts
const PRODUCTION_API_URL = 'https://uae7guard.com';
```

ثم:
```bash
npm run build
npx cap sync
npx cap open ios  # أو android
```

### 2. أنشئ حسابات مستخدمين

الآن يمكنك إنشاء حسابات حقيقية:

1. اذهب إلى `/signup`
2. أدخل البيانات
3. سجل الدخول

### 3. راقب الأداء

- تابع Vercel Analytics
- راقب Supabase Database Usage
- فعّل Logging للأخطاء

---

## 📚 ملفات مفيدة

- **`VERCEL_ENV_FIX.md`** - دليل تفصيلي لإصلاح متغيرات البيئة
- **`.env.production.example`** - مثال على التكوين الصحيح
- **`DEPLOYMENT_GUIDE.md`** - دليل النشر الكامل (English)
- **`scripts/check-env-config.ts`** - سكريبت فحص التكوين

---

## 🆘 تحتاج مساعدة؟

### نفذ سكريبت التشخيص
```bash
npm run check-env
```

### افحص Logs على Vercel
```bash
vercel logs --follow
```

### تأكد من Supabase Schema
في Supabase SQL Editor، نفذ:
```sql
SELECT * FROM users LIMIT 1;
```

يجب أن يعمل بدون أخطاء.

---

**آخر تحديث:** 26 يناير 2026
**الإصدار:** 2.0
**حالة الحل:** ✅ تم الاختبار
