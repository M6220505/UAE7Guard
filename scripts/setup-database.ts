#!/usr/bin/env tsx
/**
 * UAE7Guard Database Setup Script
 *
 * This script automatically initializes the database with:
 * - All required tables and indexes
 * - Trigger functions for automatic timestamps
 * - Demo admin user account
 * - Sample data for testing
 * - Stripe subscription products
 *
 * Usage:
 *   npm run db:setup              # Run full setup
 *   npm run db:setup -- --skip-seed   # Setup without demo data
 *   npm run db:setup -- --force       # Drop and recreate all tables
 */

import 'dotenv/config';
import { sql } from 'drizzle-orm';
import { db } from '../server/db';
import { seedDatabase } from '../server/seed';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Color output for CLI
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step: number, total: number, message: string) {
  log(`\n[${step}/${total}] ${message}`, 'cyan');
}

function logSuccess(message: string) {
  log(`✓ ${message}`, 'green');
}

function logError(message: string) {
  log(`✗ ${message}`, 'red');
}

function logWarning(message: string) {
  log(`⚠ ${message}`, 'yellow');
}

interface SetupOptions {
  force?: boolean;
  skipSeed?: boolean;
  skipStripe?: boolean;
}

async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await db.execute(sql`SELECT 1`);
    return true;
  } catch (error) {
    return false;
  }
}

async function runSQLFile(filePath: string): Promise<void> {
  const sqlContent = fs.readFileSync(filePath, 'utf-8');

  // Split by semicolons, but be careful with function definitions
  const statements = sqlContent
    .split(/;\s*\n/)
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  for (const statement of statements) {
    if (statement) {
      try {
        await db.execute(sql.raw(statement));
      } catch (error: any) {
        // Ignore "already exists" errors if not forcing
        if (!error.message?.includes('already exists')) {
          throw error;
        }
      }
    }
  }
}

async function dropAllTables(): Promise<void> {
  log('Dropping all existing tables...', 'yellow');

  const tables = [
    'encrypted_audit_logs',
    'ai_predictions',
    'messages',
    'conversations',
    'slippage_calculations',
    'escrow_transactions',
    'monitoring_alerts',
    'live_monitoring',
    'security_logs',
    'watchlist',
    'alerts',
    'scam_reports',
    'user_reputation',
    'users',
    'sessions',
  ];

  for (const table of tables) {
    try {
      await db.execute(sql.raw(`DROP TABLE IF EXISTS ${table} CASCADE`));
    } catch (error) {
      // Ignore errors on drop
    }
  }

  logSuccess('All tables dropped');
}

async function createTables(): Promise<void> {
  const schemaPath = path.join(process.cwd(), 'supabase-schema.sql');

  if (!fs.existsSync(schemaPath)) {
    throw new Error(`Schema file not found at: ${schemaPath}`);
  }

  log('Creating database tables from schema...', 'blue');
  await runSQLFile(schemaPath);
  logSuccess('Database tables created successfully');
}

async function verifyTables(): Promise<string[]> {
  const result = await db.execute(sql`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY table_name
  `) as any;

  return result.rows.map((row: any) => row.table_name);
}

async function seedDemoData(): Promise<void> {
  log('Seeding database with demo data...', 'blue');
  await seedDatabase();
  logSuccess('Demo data seeded successfully');
}

async function setupStripeProducts(): Promise<void> {
  log('Setting up Stripe subscription products...', 'blue');

  try {
    // Dynamic import to handle the seed-products script
    const seedProducts = await import('../server/seed-products.js');
    if (typeof seedProducts.default === 'function') {
      await seedProducts.default();
    }
    logSuccess('Stripe products created successfully');
  } catch (error: any) {
    if (error.message?.includes('STRIPE_SECRET_KEY')) {
      logWarning('Skipping Stripe setup: STRIPE_SECRET_KEY not configured');
    } else {
      throw error;
    }
  }
}

async function displaySummary(tables: string[]): Promise<void> {
  log('\n' + '='.repeat(60), 'bright');
  log('DATABASE SETUP COMPLETE', 'green');
  log('='.repeat(60), 'bright');

  log(`\n📊 Database Statistics:`, 'cyan');
  log(`   Tables created: ${tables.length}`, 'green');

  log(`\n📋 Tables:`, 'cyan');
  tables.forEach(table => {
    log(`   • ${table}`, 'reset');
  });

  log(`\n🔑 Demo Accounts:`, 'cyan');
  log(`   Admin User:`, 'yellow');
  log(`     Email: admin@uae7guard.com`, 'reset');
  log(`     Password: admin123456`, 'reset');

  log(`   Apple Review Account:`, 'yellow');
  log(`     Email: applereview@uae7guard.com`, 'reset');
  log(`     Password: AppleReview2024!`, 'reset');

  log(`\n💳 Subscription Plans:`, 'cyan');
  log(`   • Basic Plan: $4.99/month or $49.90/year`, 'reset');
  log(`   • Pro Plan: $14.99/month or $149.90/year`, 'reset');

  log(`\n🚀 Next Steps:`, 'cyan');
  log(`   1. Start the development server: npm run dev`, 'reset');
  log(`   2. Visit: http://localhost:5000`, 'reset');
  log(`   3. Login with demo credentials above`, 'reset');

  log('\n' + '='.repeat(60), 'bright');
}

async function setupDatabase(options: SetupOptions = {}): Promise<void> {
  const totalSteps = 6;
  let currentStep = 0;

  try {
    // Step 1: Check connection
    logStep(++currentStep, totalSteps, 'Checking database connection');
    const connected = await checkDatabaseConnection();
    if (!connected) {
      throw new Error('Failed to connect to database. Check your DATABASE_URL environment variable.');
    }
    logSuccess('Database connection established');

    // Step 2: Drop tables if force option
    if (options.force) {
      logStep(++currentStep, totalSteps, 'Dropping existing tables (--force)');
      await dropAllTables();
    } else {
      currentStep++;
    }

    // Step 3: Create tables
    logStep(++currentStep, totalSteps, 'Creating database schema');
    await createTables();

    // Step 4: Verify tables
    logStep(++currentStep, totalSteps, 'Verifying table creation');
    const tables = await verifyTables();
    logSuccess(`${tables.length} tables verified`);

    // Step 5: Seed data
    if (!options.skipSeed) {
      logStep(++currentStep, totalSteps, 'Seeding demo data');
      await seedDemoData();
    } else {
      logWarning('Skipping demo data (--skip-seed)');
      currentStep++;
    }

    // Step 6: Setup Stripe
    if (!options.skipStripe) {
      logStep(++currentStep, totalSteps, 'Setting up Stripe products');
      await setupStripeProducts();
    } else {
      logWarning('Skipping Stripe setup (--skip-stripe)');
      currentStep++;
    }

    // Display summary
    await displaySummary(tables);

  } catch (error: any) {
    logError(`\nSetup failed: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

// Parse CLI arguments
function parseArgs(): SetupOptions {
  const args = process.argv.slice(2);
  return {
    force: args.includes('--force'),
    skipSeed: args.includes('--skip-seed'),
    skipStripe: args.includes('--skip-stripe'),
  };
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const options = parseArgs();

  log('\n' + '='.repeat(60), 'bright');
  log('UAE7Guard Database Setup', 'bright');
  log('='.repeat(60), 'bright');

  if (options.force) {
    logWarning('\n⚠️  WARNING: --force will DROP ALL EXISTING DATA!');
    log('Press Ctrl+C to cancel, or wait 3 seconds to continue...', 'yellow');

    setTimeout(() => {
      setupDatabase(options);
    }, 3000);
  } else {
    setupDatabase(options);
  }
}

export { setupDatabase };
