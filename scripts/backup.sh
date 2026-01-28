#!/bin/bash

# Database Backup Script
# Usage: ./scripts/backup.sh

set -e

# Configuration
BACKUP_DIR="${BACKUP_DIR:-./backups}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="backup_${TIMESTAMP}.sql"
RETENTION_DAYS="${RETENTION_DAYS:-7}"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

echo "Starting backup at $(date)"

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "Warning: DATABASE_URL is not set. Skipping database backup."
else
    echo "Backing up database..."
    # For PostgreSQL
    # pg_dump "$DATABASE_URL" > "$BACKUP_DIR/$BACKUP_FILE"
    
    # For MySQL
    # mysqldump --single-transaction -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" > "$BACKUP_DIR/$BACKUP_FILE"
    
    echo "Database backup created: $BACKUP_DIR/$BACKUP_FILE"
fi

# Backup application files (if needed)
echo "Backing up application files..."
tar -czf "$BACKUP_DIR/app_${TIMESTAMP}.tar.gz" \
    --exclude='node_modules' \
    --exclude='.next' \
    --exclude='backups' \
    --exclude='.git' \
    . 2>/dev/null || true

echo "Application backup created: $BACKUP_DIR/app_${TIMESTAMP}.tar.gz"

# Clean up old backups
echo "Cleaning up backups older than $RETENTION_DAYS days..."
find "$BACKUP_DIR" -type f -mtime +$RETENTION_DAYS -delete 2>/dev/null || true

echo "Backup completed at $(date)"
echo "Backup location: $BACKUP_DIR"
