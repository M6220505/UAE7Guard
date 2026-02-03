# حالة قاعدة البيانات - Database Status

## 📊 الوضع الحالي (Current Status)

### ✅ ما تم إنجازه
- ملف `supabase-schema.sql` موجود وجاهز للتشغيل
- سكريبت الإعداد `scripts/setup-database.ts` جاهز
- جميع الأوامر معدة في `package.json`
- دليل الإعداد بالعربية تم إنشاؤه: `SUPABASE_SETUP_AR.md`

### ⚠️ ما يحتاج إلى إعداد

**قاعدة البيانات غير متصلة حالياً!**

الملف `.env` الحالي يحتوي على:
```
DATABASE_URL="postgresql://uae7guard:uae7guard_dev_password@localhost:5432/uae7guard"
```

هذا رابط لقاعدة بيانات محلية (localhost) غير موجودة حالياً.

## 🚀 الخطوات التالية المطلوبة

### الخيار 1: استخدام Supabase (موصى به للإنتاج)

1. **إنشاء مشروع Supabase:**
   ```
   https://supabase.com
   ```

2. **الحصول على رابط الاتصال:**
   - Settings → Database → Connection String → URI
   - مثال:
   ```
   postgresql://postgres:your_password@db.xxxxxx.supabase.co:5432/postgres
   ```

3. **تحديث `.env`:**
   ```bash
   DATABASE_URL="postgresql://postgres:your_password@db.xxxxxx.supabase.co:5432/postgres"
   ```

4. **تشغيل سكريبت الإعداد:**
   ```bash
   npm run db:setup
   ```

للمزيد من التفاصيل، راجع: **[SUPABASE_SETUP_AR.md](./SUPABASE_SETUP_AR.md)**

### الخيار 2: استخدام قاعدة بيانات PostgreSQL محلية

1. **تثبيت PostgreSQL:**
   ```bash
   # Ubuntu/Debian
   sudo apt-get install postgresql

   # macOS
   brew install postgresql
   ```

2. **إنشاء قاعدة بيانات:**
   ```bash
   sudo -u postgres psql
   CREATE DATABASE uae7guard;
   CREATE USER uae7guard WITH PASSWORD 'uae7guard_dev_password';
   GRANT ALL PRIVILEGES ON DATABASE uae7guard TO uae7guard;
   \q
   ```

3. **تشغيل سكريبت الإعداد:**
   ```bash
   npm run db:setup
   ```

### الخيار 3: استخدام Docker

1. **تشغيل PostgreSQL في Docker:**
   ```bash
   docker run --name uae7guard-db \
     -e POSTGRES_USER=uae7guard \
     -e POSTGRES_PASSWORD=uae7guard_dev_password \
     -e POSTGRES_DB=uae7guard \
     -p 5432:5432 \
     -d postgres:16
   ```

2. **تشغيل سكريبت الإعداد:**
   ```bash
   npm run db:setup
   ```

## 📋 محتويات supabase-schema.sql

السكريبت جاهز لإنشاء:

### الجداول (14 جدول)
1. ✅ `sessions` - جلسات المستخدمين
2. ✅ `users` - حسابات المستخدمين
3. ✅ `user_reputation` - نقاط الثقة
4. ✅ `scam_reports` - تقارير الاحتيال
5. ✅ `alerts` - الإشعارات
6. ✅ `watchlist` - قائمة المراقبة
7. ✅ `security_logs` - السجلات الأمنية
8. ✅ `live_monitoring` - المراقبة الحية
9. ✅ `monitoring_alerts` - تنبيهات المراقبة
10. ✅ `escrow_transactions` - معاملات الضمان
11. ✅ `slippage_calculations` - حسابات الانزلاق
12. ✅ `conversations` - المحادثات
13. ✅ `messages` - الرسائل
14. ✅ `encrypted_audit_logs` - سجلات التدقيق المشفرة
15. ✅ `ai_predictions` - توقعات الذكاء الاصطناعي

### البيانات الأولية
- ✅ حساب Admin (admin@uae7guard.com / admin123456)
- ✅ حساب Apple Review (applereview@uae7guard.com / AppleReview2024!)
- ✅ 7 حسابات محققين مع درجات ثقة مختلفة
- ✅ 15 عنوان احتيال معروف

### Triggers التلقائية
- ✅ تحديث تلقائي لـ `updated_at` في جدول المستخدمين
- ✅ تحديث تلقائي لـ `updated_at` في معاملات الضمان

## 🛠️ الأوامر المتاحة

```bash
# إعداد كامل (جداول + بيانات تجريبية)
npm run db:setup

# إعادة ضبط كاملة (يحذف كل شيء!)
npm run db:setup:force

# إعداد بدون بيانات تجريبية
npm run db:setup -- --skip-seed

# إعداد بدون Stripe
npm run db:setup -- --skip-stripe

# إضافة بيانات تجريبية فقط
npm run db:seed

# دفع تغييرات المخطط (Drizzle ORM)
npm run db:push
```

## 🔍 كيفية التحقق من الإعداد

بعد تشغيل `npm run db:setup`، يجب أن ترى:

```
====================================================
DATABASE SETUP COMPLETE
====================================================

📊 Database Statistics:
   Tables created: 14

📋 Tables:
   • ai_predictions
   • alerts
   • conversations
   • encrypted_audit_logs
   • escrow_transactions
   • live_monitoring
   • messages
   • monitoring_alerts
   • scam_reports
   • security_logs
   • sessions
   • slippage_calculations
   • user_reputation
   • users
   • watchlist

🔑 Demo Accounts:
   Admin User:
     Email: admin@uae7guard.com
     Password: admin123456
```

## 📞 الدعم

إذا واجهت أي مشاكل:

1. **اقرأ دليل الإعداد المفصل:**
   - العربية: [SUPABASE_SETUP_AR.md](./SUPABASE_SETUP_AR.md)
   - English: [DATABASE_SETUP.md](./DATABASE_SETUP.md)

2. **تحقق من السجلات:**
   ```bash
   tail -f ./logs/app.log
   ```

3. **تحقق من اتصال قاعدة البيانات:**
   ```bash
   # اختبار الاتصال
   psql $DATABASE_URL -c "SELECT 1"
   ```

4. **تواصل مع الدعم:**
   - Email: support@uae7guard.com
   - GitHub: https://github.com/yourusername/UAE7Guard/issues

## ✅ قائمة تحقق سريعة

- [ ] إنشاء مشروع Supabase أو تشغيل PostgreSQL محلياً
- [ ] الحصول على DATABASE_URL
- [ ] تحديث ملف `.env`
- [ ] تشغيل `npm run db:setup`
- [ ] التحقق من إنشاء 14 جدول
- [ ] تسجيل الدخول بحساب admin
- [ ] تشغيل التطبيق: `npm run dev`

---

**ملاحظة:** بمجرد إعداد قاعدة البيانات وتشغيل السكريبت، سيكون التطبيق جاهزاً للاستخدام بالكامل! 🎉
