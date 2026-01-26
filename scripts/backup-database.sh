#!/bin/bash
# =============================================================================
# Database Backup Script
# =============================================================================
# Automated PostgreSQL database backup with compression and rotation
#
# Usage:
#   ./scripts/backup-database.sh
#
# Environment Variables:
#   DATABASE_URL - PostgreSQL connection string
#   BACKUP_DIR - Backup directory (default: ./backups)
#   BACKUP_RETENTION_DAYS - Number of days to keep backups (default: 30)
# =============================================================================

set -e

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Configuration
BACKUP_DIR="${BACKUP_DIR:-./backups}"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-30}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/uae7guard_backup_${TIMESTAMP}.sql.gz"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    log_error "DATABASE_URL environment variable is not set"
    exit 1
fi

# Create backup directory if it doesn't exist
if [ ! -d "$BACKUP_DIR" ]; then
    log_info "Creating backup directory: $BACKUP_DIR"
    mkdir -p "$BACKUP_DIR"
fi

# Start backup
log_info "Starting database backup..."
log_info "Backup file: $BACKUP_FILE"

# Perform backup with pg_dump and compress
if pg_dump "$DATABASE_URL" | gzip > "$BACKUP_FILE"; then
    BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    log_info "Backup completed successfully"
    log_info "Backup size: $BACKUP_SIZE"
else
    log_error "Backup failed"
    exit 1
fi

# Remove old backups
log_info "Removing backups older than $RETENTION_DAYS days..."
find "$BACKUP_DIR" -name "uae7guard_backup_*.sql.gz" -type f -mtime +$RETENTION_DAYS -delete

# Count remaining backups
BACKUP_COUNT=$(find "$BACKUP_DIR" -name "uae7guard_backup_*.sql.gz" -type f | wc -l)
log_info "Total backups: $BACKUP_COUNT"

# List recent backups
log_info "Recent backups:"
ls -lh "$BACKUP_DIR" | tail -n 5

log_info "Backup process completed successfully"
