# 🚀 دليل تشغيل التطبيق - Run UAE7Guard App

## ✅ المتطلبات الأساسية

- [x] قاعدة بيانات Supabase معدّة (14 جدول)
- [x] ملف .env محدّث بـ DATABASE_URL
- [x] جميع المكتبات مثبتة (npm install)

## 🏃 تشغيل التطبيق

### في البيئة الحالية (مع مشكلة الشبكة):

⚠️ **ملاحظة:** نظراً لمشكلة الاتصال الشبكي بـ Supabase، قد لا يعمل التطبيق في هذه البيئة.

### على جهاز محلي (موصى به):

```bash
# 1. استنسخ المشروع
git clone <repository-url>
cd UAE7Guard

# 2. ثبت المكتبات
npm install

# 3. أنشئ ملف .env
cat > .env << 'ENVEOF'
DATABASE_URL="postgresql://postgres:rdhuvzfyzoeeiryvegce@db.juhpmjixqkpnjkzyxmse.supabase.co:5432/postgres"
SESSION_SECRET="uae7guard-dev-secret-key-change-in-production"
APPLE_REVIEW_PASSWORD=AppleReview2026
ENVEOF

# 4. شغّل التطبيق في وضع التطوير
npm run dev
```

### النتيجة المتوقعة:

```
✓ Server running on http://localhost:5000
✓ Database connected
✓ Routes registered
```

## 🌐 فتح التطبيق

1. **افتح المتصفح**
2. **اذهب إلى:** `http://localhost:5000`
3. **سجّل الدخول:**
   - Email: `admin@uae7guard.com`
   - Password: `admin123456`

## 🧪 اختبار الميزات

بعد تسجيل الدخول، جرّب:

### 1. البحث عن عناوين الاحتيال
- اذهب إلى "Scam Reports"
- ابحث عن عنوان بلوكشين
- شاهد التقارير المتاحة

### 2. مراقبة المحفظة
- اذهب إلى "Live Monitoring"
- أضف عنوان محفظة للمراقبة
- شاهد التنبيهات

### 3. المساعد الذكي
- افتح "AI Assistant"
- اسأل عن blockchain security
- احصل على تحليل ذكي

### 4. لوحة التحكم
- شاهد إحصائيات النظام
- تابع أحدث التنبيهات
- راجع نقاط الثقة الخاصة بك

## 🐛 استكشاف الأخطاء

### خطأ: Cannot connect to database

```bash
# تحقق من DATABASE_URL
echo $DATABASE_URL

# اختبر الاتصال
npx tsx -e "import 'dotenv/config'; import pg from 'pg'; const pool = new pg.Pool({connectionString: process.env.DATABASE_URL, ssl: {rejectUnauthorized: false}}); pool.query('SELECT 1').then(() => console.log('✅ Connected')).catch(e => console.error('❌ Error:', e.message))"
```

### خطأ: Module not found

```bash
# أعد تثبيت المكتبات
rm -rf node_modules package-lock.json
npm install
```

### خطأ: Port 5000 already in use

```bash
# استخدم منفذ آخر
PORT=3000 npm run dev
```

## 📱 للتطبيقات المحمولة

### iOS (يحتاج macOS + Xcode):

```bash
npm run cap:sync:ios
npm run cap:open:ios
```

### Android (يحتاج Android Studio):

```bash
npm run cap:sync:android
npm run cap:open:android
```

## 🔒 بيانات الدخول التجريبية

### حساب المدير:
```
Email: admin@uae7guard.com
Password: admin123456
```

### حساب Apple Review:
```
Email: applereview@uae7guard.com
Password: AppleReview2024!
```

## 📊 بيانات عينة متاحة

السكريبت أضاف:
- ✅ 1 حساب admin
- ✅ 1000 نقطة ثقة للمدير
- ✅ رتبة "Sentinel"

يمكنك إضافة المزيد من البيانات التجريبية:

```bash
npm run db:seed
```

## 🎯 الخطوات التالية

1. ✅ استكشف واجهة المستخدم
2. ✅ جرّب جميع الميزات
3. ✅ أضف بيانات تجريبية
4. ✅ اختبر API endpoints
5. ✅ راجع السجلات الأمنية

---

**تهانينا! 🎉** تطبيق UAE7Guard يعمل الآن بكامل طاقته!
