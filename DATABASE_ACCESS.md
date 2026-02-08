# 🗄️ UAE7Guard Database Access

## Connection Details

**Connection String:**
```
postgresql://postgres:TNIPYYeVqAIVCWnhISZYUBgzIKIbcuCT@turntable.proxy.rlwy.net:15072/railway
```

**Broken Down:**
```
Host: turntable.proxy.rlwy.net
Port: 15072
User: postgres
Password: TNIPYYeVqAIVCWnhISZYUBgzIKIbcuCT
Database: railway
```

---

## 🔌 Direct Access (psql)

### Connect to Database:
```bash
PGPASSWORD=TNIPYYeVqAIVCWnhISZYUBgzIKIbcuCT psql -h turntable.proxy.rlwy.net -U postgres -p 15072 -d railway
```

### Quick Commands:
```sql
-- List all tables
\dt

-- Show table structure
\d users

-- Count records
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM scam_reports;

-- Recent users
SELECT id, email, created_at FROM users ORDER BY created_at DESC LIMIT 10;

-- Recent scam reports
SELECT address, network, status FROM scam_reports ORDER BY created_at DESC LIMIT 10;

-- Exit
\q
```

---

## 🛠️ Database Management Tools

### Option 1: pgAdmin (GUI)
```
Download: https://www.pgadmin.org/download/

Connection:
- Host: turntable.proxy.rlwy.net
- Port: 15072
- Database: railway
- Username: postgres
- Password: TNIPYYeVqAIVCWnhISZYUBgzIKIbcuCT
```

### Option 2: DBeaver (Free)
```
Download: https://dbeaver.io/download/

Connection:
- Type: PostgreSQL
- Host: turntable.proxy.rlwy.net
- Port: 15072
- Database: railway
- Username: postgres
- Password: TNIPYYeVqAIVCWnhISZYUBgzIKIbcuCT
```

### Option 3: TablePlus (Mac - Best!)
```
Download: https://tableplus.com/

Connection:
- Type: PostgreSQL
- Name: UAE7Guard Production
- Host: turntable.proxy.rlwy.net
- Port: 15072
- User: postgres
- Password: TNIPYYeVqAIVCWnhISZYUBgzIKIbcuCT
- Database: railway
```

---

## 📊 Database Schema

### Main Tables:

```sql
-- Users
users (id, email, subscription_plan, created_at)

-- Scam Reports
scam_reports (id, address, network, status, risk_score)

-- Alerts
alerts (id, user_id, type, message, read)

-- Watchlist
watchlist (id, user_id, address, network)

-- Live Monitoring
live_monitoring (id, user_id, address, network, active)

-- Escrow Transactions
escrow_transactions (id, buyer_id, seller_id, amount, status)
```

---

## 🔄 Database Operations

### Backup Database:
```bash
PGPASSWORD=TNIPYYeVqAIVCWnhISZYUBgzIKIbcuCT pg_dump \
  -h turntable.proxy.rlwy.net \
  -U postgres \
  -p 15072 \
  -d railway \
  -F c \
  -f uae7guard_backup_$(date +%Y%m%d).dump
```

### Restore Database:
```bash
PGPASSWORD=TNIPYYeVqAIVCWnhISZYUBgzIKIbcuCT pg_restore \
  -h turntable.proxy.rlwy.net \
  -U postgres \
  -p 15072 \
  -d railway \
  -c \
  uae7guard_backup_20260208.dump
```

### Export to SQL:
```bash
PGPASSWORD=TNIPYYeVqAIVCWnhISZYUBgzIKIbcuCT pg_dump \
  -h turntable.proxy.rlwy.net \
  -U postgres \
  -p 15072 \
  -d railway \
  > uae7guard_backup.sql
```

---

## 📈 Useful Queries

### User Statistics:
```sql
-- Total users
SELECT COUNT(*) as total_users FROM users;

-- Users by subscription plan
SELECT subscription_plan, COUNT(*) as count 
FROM users 
GROUP BY subscription_plan 
ORDER BY count DESC;

-- New users today
SELECT COUNT(*) as new_today 
FROM users 
WHERE created_at > CURRENT_DATE;

-- Active users (last 7 days)
SELECT COUNT(DISTINCT user_id) as active_users
FROM security_logs
WHERE created_at > NOW() - INTERVAL '7 days';
```

### Scam Reports Statistics:
```sql
-- Total scam reports
SELECT COUNT(*) as total_reports FROM scam_reports;

-- Reports by status
SELECT status, COUNT(*) as count 
FROM scam_reports 
GROUP BY status;

-- Reports by network
SELECT network, COUNT(*) as count 
FROM scam_reports 
GROUP BY network 
ORDER BY count DESC;

-- High risk addresses (score > 80)
SELECT address, network, risk_score 
FROM scam_reports 
WHERE risk_score > 80 
ORDER BY risk_score DESC 
LIMIT 20;
```

### Revenue Analytics:
```sql
-- Total revenue (from subscriptions)
SELECT 
  subscription_plan,
  COUNT(*) as subscribers,
  CASE subscription_plan
    WHEN 'basic' THEN COUNT(*) * 9.99
    WHEN 'pro' THEN COUNT(*) * 29.99
    WHEN 'enterprise' THEN COUNT(*) * 199
    ELSE 0
  END as monthly_revenue
FROM users
WHERE subscription_plan != 'free'
GROUP BY subscription_plan;
```

---

## 🔐 Security Best Practices

1. **Never commit credentials**
   - Keep this file in .gitignore
   - Use environment variables in code

2. **Read-only access for analytics**
   - Create separate read-only user for reports
   - Use main credentials only for admin tasks

3. **Regular backups**
   - Daily automated backups
   - Store in secure location (S3, etc.)

4. **Monitor connections**
   - Check Railway logs for unusual access
   - Set up alerts for failed login attempts

5. **Rotate passwords**
   - Change database password every 90 days
   - Update in Railway variables after rotation

---

## 🧪 Test Database Connection

```bash
# Quick test
PGPASSWORD=TNIPYYeVqAIVCWnhISZYUBgzIKIbcuCT psql \
  -h turntable.proxy.rlwy.net \
  -U postgres \
  -p 15072 \
  -d railway \
  -c "SELECT NOW();"

# Should output current timestamp
```

---

## 📊 Database Monitoring

### Check Database Size:
```sql
SELECT 
  pg_database.datname,
  pg_size_pretty(pg_database_size(pg_database.datname)) AS size
FROM pg_database
WHERE datname = 'railway';
```

### Check Table Sizes:
```sql
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Active Connections:
```sql
SELECT count(*) as active_connections 
FROM pg_stat_activity 
WHERE datname = 'railway';
```

---

## 🚨 Emergency Operations

### Kill All Connections (if stuck):
```sql
SELECT pg_terminate_backend(pg_stat_activity.pid)
FROM pg_stat_activity
WHERE datname = 'railway'
  AND pid <> pg_backend_pid();
```

### Vacuum Database (cleanup):
```sql
VACUUM ANALYZE;
```

### Reindex Everything:
```sql
REINDEX DATABASE railway;
```

---

## 📞 Support

**Railway Database Issues:**
- Railway Dashboard → Database Service → Logs
- Check connection health
- Restart service if needed

**PostgreSQL Issues:**
- Docs: https://www.postgresql.org/docs/
- Railway Discord: https://discord.gg/railway

---

## ⚠️ Important Notes

- **Connection Limit:** Railway free tier has connection limits
- **Storage:** Monitor database size (free tier has limits)
- **Backups:** Railway handles automatic backups
- **SSL:** Connection is SSL-encrypted by default

---

## 🎯 Quick Reference

**Connect:**
```bash
PGPASSWORD=TNIPYYeVqAIVCWnhISZYUBgzIKIbcuCT psql -h turntable.proxy.rlwy.net -U postgres -p 15072 -d railway
```

**Backup:**
```bash
pg_dump ... -f backup.dump
```

**Access via GUI:**
- pgAdmin / DBeaver / TablePlus
- Use connection details above

**Monitor:**
- Railway Dashboard → Database → Metrics
- Check logs for errors
