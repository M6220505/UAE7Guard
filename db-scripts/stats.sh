#!/bin/bash
# Get UAE7Guard Database Statistics

export PGPASSWORD='TNIPYYeVqAIVCWnhISZYUBgzIKIbcuCT'

echo "📊 UAE7Guard Database Statistics"
echo "=================================="
echo ""

# Database size
echo "💾 Database Size:"
psql -h turntable.proxy.rlwy.net -U postgres -p 15072 -d railway -t -c "
SELECT pg_size_pretty(pg_database_size('railway')) as size;
"

# Tables count
echo "📋 Total Tables:"
psql -h turntable.proxy.rlwy.net -U postgres -p 15072 -d railway -t -c "
SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public';
"

# Users count
echo "👥 Total Users:"
psql -h turntable.proxy.rlwy.net -U postgres -p 15072 -d railway -t -c "
SELECT COUNT(*) FROM users;
" 2>/dev/null || echo "Table not found"

# Scam reports
echo "🚨 Total Scam Reports:"
psql -h turntable.proxy.rlwy.net -U postgres -p 15072 -d railway -t -c "
SELECT COUNT(*) FROM scam_reports;
" 2>/dev/null || echo "Table not found"

# Active connections
echo "🔌 Active Connections:"
psql -h turntable.proxy.rlwy.net -U postgres -p 15072 -d railway -t -c "
SELECT count(*) FROM pg_stat_activity WHERE datname = 'railway';
"

echo ""
echo "✅ Done!"
