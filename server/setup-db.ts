/**
 * Simple database setup utility
 * Can be imported and called from other backend code
 */

import { setupDatabase } from '../scripts/setup-database';

/**
 * Initialize the database with all tables and demo data
 * @param force - Drop existing tables before creating
 * @param skipSeed - Skip demo data seeding
 * @param skipStripe - Skip Stripe product setup
 */
export async function initializeDatabase(options?: {
  force?: boolean;
  skipSeed?: boolean;
  skipStripe?: boolean;
}) {
  return await setupDatabase(options);
}

/**
 * Quick setup with defaults
 */
export async function quickSetup() {
  return await setupDatabase({
    force: false,
    skipSeed: false,
    skipStripe: false,
  });
}

/**
 * Reset database (WARNING: Deletes all data)
 */
export async function resetDatabase() {
  console.warn('⚠️  Resetting database - all data will be lost!');
  return await setupDatabase({
    force: true,
    skipSeed: false,
    skipStripe: false,
  });
}

// Allow running directly: tsx server/setup-db.ts
if (import.meta.url === `file://${process.argv[1]}`) {
  quickSetup();
}
