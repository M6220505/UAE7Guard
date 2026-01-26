# UAE7Guard Database Setup Guide

This guide explains how to set up your UAE7Guard database automatically using the provided setup script.

## Quick Start

### Option 1: Full Setup (Recommended)

Run this command to set up everything automatically:

```bash
npm run db:setup
```

This will:
- ✅ Create all 14 database tables
- ✅ Add indexes for optimal performance
- ✅ Set up automatic timestamp triggers
- ✅ Create demo user accounts
- ✅ Add sample scam reports for testing
- ✅ Configure Stripe subscription products

### Option 2: Force Reset (⚠️ Deletes All Data)

To completely reset your database:

```bash
npm run db:setup:force
```

**WARNING:** This will drop all existing tables and data before recreating them.

### Option 3: Custom Options

You can customize the setup with these flags:

```bash
# Skip demo data seeding
npm run db:setup -- --skip-seed

# Skip Stripe product setup
npm run db:setup -- --skip-stripe

# Force reset without demo data
npm run db:setup -- --force --skip-seed
```

## What Gets Created

### Database Tables (14 total)

1. **sessions** - User session management
2. **users** - Core user accounts with subscription status
3. **user_reputation** - Trust scores and investigator ranks
4. **scam_reports** - Blockchain scam reports with verification
5. **alerts** - User notifications and warnings
6. **watchlist** - Monitored blockchain addresses
7. **security_logs** - Security audit trail
8. **live_monitoring** - Real-time wallet monitoring
9. **monitoring_alerts** - Transaction alerts from monitoring
10. **escrow_transactions** - Smart lock transactions
11. **slippage_calculations** - Token slippage analysis
12. **conversations** - AI chat conversations
13. **messages** - Chat message history
14. **encrypted_audit_logs** - Legal-grade encrypted audit logs

### Demo Accounts

Two demo accounts are created for testing:

#### Admin Account
```
Email: admin@uae7guard.com
Password: admin123456
```

#### Apple Review Account
```
Email: applereview@uae7guard.com
Password: AppleReview2024!
```

### Sample Data

The setup includes:
- 7 investigator accounts with various reputation ranks
- 15 known scam addresses across Ethereum and Bitcoin
- Sample watchlist entries
- Sample alerts and notifications

### Stripe Products

Two subscription tiers are created:

**Basic Plan**
- Monthly: $4.99/month
- Yearly: $49.90/year (save 17%)

**Pro Plan**
- Monthly: $14.99/month
- Yearly: $149.90/year (save 17%)

## Environment Variables Required

Make sure these are set in your `.env` file:

```bash
# Required for database
DATABASE_URL=your_supabase_or_postgres_connection_string

# Optional for Stripe setup
STRIPE_SECRET_KEY=your_stripe_secret_key
```

## Troubleshooting

### Connection Error

If you see "Failed to connect to database":
1. Check your `DATABASE_URL` in `.env`
2. Verify your database is running
3. Ensure network connectivity to Supabase

### "Already exists" Errors

These are normal if tables exist. The script will skip existing tables unless you use `--force`.

### Stripe Setup Skipped

If you see "Skipping Stripe setup", this means:
- `STRIPE_SECRET_KEY` is not configured in `.env`
- You can add it later and run: `tsx server/seed-products.ts`

## Manual Database Operations

### Backup Database

```bash
./scripts/backup-database.sh
```

### Restore Database

```bash
./scripts/restore-database.sh path/to/backup.sql.gz
```

### Seed Only

To just add demo data without schema changes:

```bash
npm run db:seed
```

### Push Schema Changes

To push schema changes from Drizzle ORM:

```bash
npm run db:push
```

## Database Schema Files

The database setup uses these files:

- **`supabase-schema.sql`** - Complete SQL schema with all tables
- **`server/seed.ts`** - Demo data seeding logic
- **`server/seed-products.ts`** - Stripe product creation
- **`shared/schema.ts`** - Drizzle ORM schema definitions

## Next Steps

After setup is complete:

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Visit your app:**
   ```
   http://localhost:5000
   ```

3. **Login with demo credentials** (see above)

4. **Test key features:**
   - Scam address lookup
   - Wallet monitoring
   - AI assistant
   - Subscription management

## Advanced Usage

### Programmatic Setup

You can also import and use the setup function in your code:

```typescript
import { setupDatabase } from './scripts/setup-database';

// Full setup
await setupDatabase();

// With options
await setupDatabase({
  force: true,      // Drop and recreate
  skipSeed: false,  // Include demo data
  skipStripe: false // Setup Stripe products
});
```

### Database Migrations

For schema changes during development:

1. Modify `shared/schema.ts` (Drizzle ORM)
2. Run `npm run db:push` to apply changes
3. For production, use Drizzle migrations:
   ```bash
   drizzle-kit generate:pg
   drizzle-kit migrate
   ```

## Support

For issues or questions:
- Check the [GitHub repository](https://github.com/yourusername/UAE7Guard)
- Review logs in `./logs/` directory
- Contact support at support@uae7guard.com
