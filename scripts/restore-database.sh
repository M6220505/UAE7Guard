#!/bin/bash
# =============================================================================
# Database Restore Script
# =============================================================================
# Restore PostgreSQL database from backup
#
# Usage:
#   ./scripts/restore-database.sh <backup-file>
#
# Example:
#   ./scripts/restore-database.sh ./backups/uae7guard_backup_20260126_120000.sql.gz
# =============================================================================

set -e

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

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

# Check arguments
if [ $# -eq 0 ]; then
    log_error "No backup file specified"
    echo "Usage: $0 <backup-file>"
    exit 1
fi

BACKUP_FILE="$1"

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    log_error "Backup file not found: $BACKUP_FILE"
    exit 1
fi

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    log_error "DATABASE_URL environment variable is not set"
    exit 1
fi

# Warning
log_warn "⚠️  WARNING: This will restore the database from backup"
log_warn "⚠️  All current data will be replaced!"
log_warn ""
log_info "Backup file: $BACKUP_FILE"
read -p "Are you sure you want to continue? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    log_info "Restore cancelled"
    exit 0
fi

# Start restore
log_info "Starting database restore..."

# Decompress and restore
if gunzip -c "$BACKUP_FILE" | psql "$DATABASE_URL"; then
    log_info "Database restored successfully"
else
    log_error "Restore failed"
    exit 1
fi

log_info "Restore process completed successfully"
