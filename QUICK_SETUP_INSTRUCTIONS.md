# 🚀 إعداد سريع لقاعدة البيانات - Quick Database Setup

## الطريقة الأسهل: استخدام Supabase SQL Editor

### الخطوة 1: احصل على الملف

**خيار أ: من GitHub (إذا كان المشروع على GitHub)**
1. اذهب إلى repository على GitHub
2. افتح ملف `supabase-schema.sql`
3. اضغط على زر **"Raw"** في أعلى اليمين
4. انسخ كل المحتوى (Ctrl+A ثم Ctrl+C)

**خيار ب: تحميل مباشر**
إذا كان المشروع منشور، استخدم هذا الأمر في terminal لتحميل الملف:
```bash
curl -O https://raw.githubusercontent.com/YOUR_USERNAME/UAE7Guard/main/supabase-schema.sql
```

**خيار ج: افتح الملف محلياً**
إذا كان المشروع على جهازك:
1. افتح ملف `supabase-schema.sql` في محرر نصوص
2. اضغط Ctrl+A لتحديد الكل
3. اضغط Ctrl+C للنسخ

### الخطوة 2: شغّل في Supabase

1. افتح: https://supabase.com/dashboard/project/rdhuvzfyzoeeiryvegce
2. اضغط على **"SQL Editor"** في القائمة اليسرى
3. اضغط **"+ New query"**
4. الصق المحتوى (Ctrl+V)
5. اضغط **"Run"** أو F5

### الخطوة 3: تحقق من النجاح

بعد التشغيل، يجب أن ترى:
```
✅ UAE7Guard database schema created successfully!
```

ثم:
1. اذهب إلى **"Table Editor"**
2. يجب أن ترى 15 جدول جديد

## 📋 قائمة الجداول المتوقعة

- [ ] sessions
- [ ] users
- [ ] user_reputation
- [ ] scam_reports
- [ ] alerts
- [ ] watchlist
- [ ] security_logs
- [ ] live_monitoring
- [ ] monitoring_alerts
- [ ] escrow_transactions
- [ ] slippage_calculations
- [ ] conversations
- [ ] messages
- [ ] encrypted_audit_logs
- [ ] ai_predictions

## 🔐 حسابات الدخول

بعد تشغيل السكريبت، يمكنك الدخول بـ:

**Admin Account:**
```
Email: admin@uae7guard.com
Password: admin123456
```

**Apple Review Account:**
```
Email: applereview@uae7guard.com
Password: AppleReview2024!
```

## ❓ إذا واجهت مشاكل

### "already exists" errors
- هذا طبيعي إذا كانت بعض الجداول موجودة مسبقاً
- السكريبت يستخدم `CREATE TABLE IF NOT EXISTS`

### لا تظهر الجداول
- تأكد من تشغيل السكريبت كاملاً
- تحقق من عدم وجود أخطاء في SQL Editor
- حاول تحديث الصفحة

### لا يوجد مستخدم admin
- تحقق من جدول `users` في Table Editor
- يجب أن تجد مستخدم بـ email: admin@uae7guard.com

## 🎯 بعد الإعداد

قاعدة البيانات الآن جاهزة! يمكنك:
1. تشغيل التطبيق: `npm run dev`
2. زيارة: http://localhost:5000
3. تسجيل الدخول بحساب admin

---

**ملاحظة:** الملف `supabase-schema.sql` موجود في مجلد المشروع الرئيسي.
