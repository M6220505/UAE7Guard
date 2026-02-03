# UAE7Guard Production Setup Guide

## 📋 جدول المحتويات

- [نظرة عامة](#نظرة-عامة)
- [المتطلبات الأساسية](#المتطلبات-الأساسية)
- [التثبيت](#التثبيت)
- [التكوين](#التكوين)
- [النشر](#النشر)
- [المراقبة](#المراقبة)
- [النسخ الاحتياطي](#النسخ-الاحتياطي)
- [الأمان](#الأمان)
- [استكشاف الأخطاء](#استكشاف-الأخطاء)

## 🎯 نظرة عامة

هذا الدليل يوفر تعليمات شاملة لإعداد ونشر تطبيق UAE7Guard في بيئة الإنتاج.

### الميزات المطبقة

✅ **الأمان (Security)**
- تشفير SSL/TLS
- Security Headers (CSP, HSTS, X-Frame-Options)
- Rate Limiting متعدد المستويات
- Input Sanitization
- Session Management آمن

✅ **الأداء (Performance)**
- Caching System
- Database Connection Pooling
- Compression
- Optimized Docker Images

✅ **المراقبة (Monitoring)**
- Health Check Endpoints
- Metrics Collection
- Request/Response Logging
- Error Tracking

✅ **التوافر العالي (High Availability)**
- Database Backups
- Graceful Shutdown
- Container Orchestration Ready

✅ **CI/CD**
- Automated Testing
- Security Scanning
- Automated Deployment

## 💻 المتطلبات الأساسية

### البرامج المطلوبة

- **Node.js**: 20.x أو أحدث
- **PostgreSQL**: 16.x أو أحدث
- **Docker**: 24.x أو أحدث (اختياري)
- **Redis**: 7.x أو أحدث (اختياري، للتخزين المؤقت)

### الحسابات الخارجية

- **SendGrid**: لإرسال البريد الإلكتروني
- **Stripe**: للمدفوعات
- **OpenAI**: للميزات الذكية
- **Alchemy**: للبلوكشين

## 🚀 التثبيت

### 1. استنساخ المشروع

\`\`\`bash
git clone https://github.com/your-org/UAE7Guard.git
cd UAE7Guard
\`\`\`

### 2. تثبيت التبعيات

\`\`\`bash
npm ci --production
\`\`\`

### 3. إعداد متغيرات البيئة

\`\`\`bash
# نسخ ملف المثال
cp .env.example .env

# تحرير الملف بالقيم الفعلية
nano .env
\`\`\`

**⚠️ مهم جداً:**
- لا تستخدم القيم الافتراضية في الإنتاج
- استخدم كلمات مرور قوية ومفاتيح عشوائية
- لا تشارك ملف `.env` أبداً

### 4. إنشاء قاعدة البيانات

\`\`\`bash
# إنشاء قاعدة البيانات
createdb uae7guard

# تطبيق المخططات
npm run db:push
\`\`\`

### 5. بناء التطبيق

\`\`\`bash
npm run build
\`\`\`

## ⚙️ التكوين

### متغيرات البيئة الأساسية

#### قاعدة البيانات

\`\`\`bash
DATABASE_URL=postgresql://user:password@localhost:5432/uae7guard?sslmode=require
DB_POOL_MIN=2
DB_POOL_MAX=10
\`\`\`

#### الأمان

\`\`\`bash
# توليد SESSION_SECRET بـ:
# openssl rand -base64 64
SESSION_SECRET=your-very-long-random-secret-here
SESSION_SECURE=true
SESSION_SAME_SITE=strict
BCRYPT_ROUNDS=12
\`\`\`

#### Rate Limiting

\`\`\`bash
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_AUTH_MAX=5
\`\`\`

#### CORS

\`\`\`bash
CORS_ALLOWED_ORIGINS=https://uae7guard.com,https://app.uae7guard.com
CORS_CREDENTIALS=true
\`\`\`

### التكوينات المتقدمة

راجع ملف `.env.example` للحصول على قائمة كاملة بالمتغيرات المتاحة.

## 🐳 النشر باستخدام Docker

### النشر السريع

\`\`\`bash
# بناء الصور
docker-compose build

# بدء الخدمات
docker-compose up -d

# التحقق من الحالة
docker-compose ps
\`\`\`

### النشر في الإنتاج

\`\`\`bash
# استخدام ملف الإنتاج
docker-compose -f docker-compose.yml --profile production up -d
\`\`\`

### إدارة الحاويات

\`\`\`bash
# عرض السجلات
docker-compose logs -f app

# إعادة التشغيل
docker-compose restart app

# إيقاف الخدمات
docker-compose down
\`\`\`

## 📦 النشر التقليدي

### استخدام PM2

\`\`\`bash
# تثبيت PM2
npm install -g pm2

# بدء التطبيق
pm2 start npm --name "uae7guard" -- start

# حفظ التكوين
pm2 save

# إعداد بدء التشغيل التلقائي
pm2 startup
\`\`\`

### استخدام Systemd

إنشاء ملف `/etc/systemd/system/uae7guard.service`:

\`\`\`ini
[Unit]
Description=UAE7Guard Application
After=network.target postgresql.service

[Service]
Type=simple
User=nodejs
WorkingDirectory=/opt/uae7guard
Environment="NODE_ENV=production"
ExecStart=/usr/bin/node dist/index.cjs
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
\`\`\`

تفعيل الخدمة:

\`\`\`bash
sudo systemctl enable uae7guard
sudo systemctl start uae7guard
sudo systemctl status uae7guard
\`\`\`

## 📊 المراقبة

### Health Checks

التطبيق يوفر عدة endpoints للمراقبة:

- **Basic Health**: `GET /api/health`
- **Detailed Health**: `GET /api/health/detailed`
- **Readiness**: `GET /api/health/ready`
- **Liveness**: `GET /api/health/live`
- **Metrics**: `GET /api/health/metrics`

### مثال استخدام

\`\`\`bash
# التحقق من صحة التطبيق
curl https://your-domain.com/api/health

# الحصول على معلومات مفصلة
curl https://your-domain.com/api/health/detailed

# الحصول على المقاييس
curl https://your-domain.com/api/health/metrics
\`\`\`

### مراقبة السجلات

\`\`\`bash
# عرض السجلات في الوقت الفعلي
tail -f logs/application.log

# مع Docker
docker-compose logs -f app

# مع PM2
pm2 logs uae7guard
\`\`\`

## 💾 النسخ الاحتياطي

### النسخ الاحتياطي التلقائي

\`\`\`bash
# تشغيل النسخ الاحتياطي يدوياً
./scripts/backup-database.sh

# إعداد Cron للنسخ الاحتياطي اليومي
crontab -e

# إضافة: النسخ الاحتياطي كل يوم في الساعة 2 صباحاً
0 2 * * * /path/to/UAE7Guard/scripts/backup-database.sh
\`\`\`

### استعادة من النسخة الاحتياطية

\`\`\`bash
./scripts/restore-database.sh ./backups/uae7guard_backup_YYYYMMDD_HHMMSS.sql.gz
\`\`\`

### تخزين النسخ الاحتياطية

يُنصح بتخزين النسخ الاحتياطية في:
- خدمة سحابية (AWS S3, Google Cloud Storage)
- خادم منفصل
- نظام NAS

## 🔒 الأمان

### قائمة التحقق الأمنية

- [ ] استخدام HTTPS في الإنتاج
- [ ] تفعيل Firewall
- [ ] تحديث جميع التبعيات
- [ ] استخدام مفاتيح قوية لـ SESSION_SECRET
- [ ] تفعيل Rate Limiting
- [ ] مراجعة CORS origins
- [ ] تفعيل Database SSL
- [ ] إخفاء معلومات الخادم
- [ ] تفعيل Security Headers
- [ ] مراجعة أذونات الملفات

### تحديثات الأمان

\`\`\`bash
# فحص الثغرات الأمنية
npm audit

# تحديث التبعيات بأمان
npm audit fix

# تحديث التبعيات الرئيسية (بحذر)
npm update
\`\`\`

### Firewall Configuration

\`\`\`bash
# السماح بالمنافذ الأساسية فقط
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw enable
\`\`\`

## 🔧 استكشاف الأخطاء

### التطبيق لا يبدأ

1. **التحقق من السجلات:**
   \`\`\`bash
   docker-compose logs app
   # أو
   pm2 logs uae7guard
   \`\`\`

2. **التحقق من متغيرات البيئة:**
   \`\`\`bash
   # التأكد من وجود جميع المتغيرات المطلوبة
   cat .env | grep -v '^#' | grep -v '^$'
   \`\`\`

3. **التحقق من الاتصال بقاعدة البيانات:**
   \`\`\`bash
   psql "$DATABASE_URL" -c "SELECT 1"
   \`\`\`

### مشاكل الأداء

1. **مراقبة استخدام الموارد:**
   \`\`\`bash
   # مع Docker
   docker stats

   # مع PM2
   pm2 monit
   \`\`\`

2. **فحص الاستعلامات البطيئة:**
   \`\`\`sql
   -- في PostgreSQL
   SELECT query, calls, total_time, mean_time
   FROM pg_stat_statements
   ORDER BY mean_time DESC
   LIMIT 10;
   \`\`\`

### مشاكل الاتصال

1. **التحقق من Health Endpoint:**
   \`\`\`bash
   curl -v http://localhost:5000/api/health
   \`\`\`

2. **التحقق من الشبكة:**
   \`\`\`bash
   # مع Docker
   docker network inspect uae7guard-network
   \`\`\`

## 📞 الدعم

### الموارد

- **الوثائق**: [docs/](./docs/)
- **API Reference**: [API.md](./docs/API.md)
- **GitHub Issues**: https://github.com/your-org/UAE7Guard/issues

### الاتصال

- **البريد الإلكتروني**: support@uae7guard.com
- **Discord**: [رابط الخادم]

## 📝 License

[رخصة المشروع]

---

**ملاحظة**: هذا الدليل يُحدث باستمرار. آخر تحديث: 2026-01-26
