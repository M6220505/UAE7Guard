# 🔧 إصلاح مشكلة تسجيل الدخول على Vercel

## المشكلة
عند محاولة تسجيل الدخول على **uae7guard.com**، تظهر رسالة خطأ:
```
Login failed
500: {"error":"Login failed"}
```

### السبب
التطبيق المنشور على Vercel يحاول الاتصال بقاعدة بيانات **localhost** بدلاً من **Supabase**.

---

## ✅ الحل السريع (5 دقائق)

### الخطوة 1️⃣: احصل على DATABASE_URL من Supabase

1. افتح [Supabase Dashboard](https://supabase.com/dashboard)
2. اختر مشروعك
3. اذهب إلى: **Settings** → **Database**
4. ابحث عن قسم **Connection string**
5. اختر **URI** format
6. انسخ الـ URL (يبدأ بـ `postgresql://`)

يجب أن يكون شكله:
```
postgresql://postgres.xxxxx:password@aws-xxx.pooler.supabase.com:5432/postgres
```

### الخطوة 2️⃣: أنشئ SESSION_SECRET جديد

في Terminal، نفذ الأمر:
```bash
openssl rand -base64 32
```

ستحصل على نتيجة مثل:
```
xK8v3pL9mN4qR7wT2yU5hJ6fG1dS0aZ8cBvNmQ3wE4r=
```
احفظ هذا النص.

### الخطوة 3️⃣: حدّث متغيرات البيئة على Vercel

1. افتح [Vercel Dashboard](https://vercel.com/dashboard)
2. اختر مشروع **UAE7Guard**
3. اذهب إلى: **Settings** → **Environment Variables**
4. حدّث أو أضف المتغيرات التالية:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `DATABASE_URL` | القيمة من Supabase (الخطوة 1) | Production, Preview, Development |
| `SESSION_SECRET` | القيمة من الخطوة 2 | Production, Preview, Development |
| `APPLE_REVIEW_PASSWORD` | `AppleReview2026` | Production, Preview, Development |
| `NODE_ENV` | `production` | Production only |

**مهم**:
- عند إضافة/تحديث متغير، اختر **All** environments أو على الأقل **Production**
- تأكد من عدم وجود مسافات زائدة في القيم

### الخطوة 4️⃣: أعد نشر التطبيق

1. في Vercel Dashboard → اذهب إلى تبويب **Deployments**
2. اضغط على أحدث deployment
3. اضغط على النقاط الثلاث **"..."** → **Redeploy**
4. اختر **Use existing Build Cache** → **Redeploy**
5. انتظر 2-3 دقائق

### الخطوة 5️⃣: اختبر التطبيق

1. افتح: `https://uae7guard.com/api/health`
2. يجب أن ترى:
   ```json
   {
     "status": "ok",
     "database": "connected",
     ...
   }
   ```

3. جرب تسجيل الدخول:
   - Email: `applereview@uae7guard.com`
   - Password: `AppleReview2026`

---

## 🔍 التحقق من التكوين المحلي

لفحص تكوين `.env` المحلي، نفذ:

```bash
npm run check-env
```

أو:

```bash
npx tsx scripts/check-env-config.ts
```

سيعطيك تقرير مفصل عن أي مشاكل في التكوين.

---

## ❓ الأسئلة الشائعة

### لماذا يظهر خطأ 500؟
لأن `DATABASE_URL` في Vercel يشير إلى `localhost` أو غير موجود. قاعدة البيانات غير متاحة.

### هل أحتاج لتحديث الكود؟
لا! المشكلة فقط في متغيرات البيئة على Vercel.

### هل أحتاج لإعادة build المشروع؟
لا، فقط Redeploy بعد تحديث متغيرات البيئة.

### كيف أتأكد من أن Supabase يعمل؟
افتح Supabase Dashboard → Table Editor → تأكد من وجود جدول `users`.

---

## 🆘 إذا استمرت المشكلة

### 1. تحقق من Logs على Vercel
1. Vercel Dashboard → Deployments
2. اختر أحدث deployment
3. اضغط على **View Function Logs**
4. ابحث عن أخطاء متعلقة بـ database connection

### 2. تأكد من صحة DATABASE_URL
يجب أن يكون بالشكل:
```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE
```

### 3. تأكد من Supabase Connection Pooler
في Supabase → Settings → Database:
- استخدم **Connection Pooling** (Port 5432) وليس Direct Connection (Port 6543)
- استخدم **Transaction mode** أو **Session mode**

---

## 📞 الدعم

إذا واجهت أي مشكلة:
1. شغّل سكريبت الفحص: `npm run check-env`
2. راجع logs على Vercel
3. تأكد من أن Supabase schema تم تطبيقه بنجاح

---

**آخر تحديث**: 2026-01-26
