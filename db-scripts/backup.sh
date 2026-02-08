#!/bin/bash
# Backup UAE7Guard Database

BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/uae7guard_$TIMESTAMP.sql"

# Create backup directory
mkdir -p "$BACKUP_DIR"

echo "🗄️ Backing up UAE7Guard database..."
echo "📁 File: $BACKUP_FILE"

export PGPASSWORD='TNIPYYeVqAIVCWnhISZYUBgzIKIbcuCT'

pg_dump -h turntable.proxy.rlwy.net \
  -U postgres \
  -p 15072 \
  -d railway \
  --no-owner \
  --no-acl \
  -f "$BACKUP_FILE"

if [ $? -eq 0 ]; then
  echo "✅ Backup successful!"
  echo "📊 Size: $(du -h $BACKUP_FILE | cut -f1)"
  
  # Compress
  gzip "$BACKUP_FILE"
  echo "🗜️ Compressed: ${BACKUP_FILE}.gz"
else
  echo "❌ Backup failed!"
  exit 1
fi
