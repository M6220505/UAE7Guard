/**
 * Constructs DATABASE_URL from various credential sources.
 * Returns null if no database is configured (instead of crashing).
 */
export function getDatabaseUrl(): string | null {
  // If DATABASE_URL is set and not pointing to localhost, use it
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('localhost')) {
    return process.env.DATABASE_URL;
  }

  // If Replit PG credentials are available, construct the URL
  const { PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE } = process.env;
  if (PGHOST && PGPORT && PGUSER && PGPASSWORD && PGDATABASE) {
    const databaseUrl = `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}:${PGPORT}/${PGDATABASE}`;
    console.log(`✅ Using Replit database: ${PGHOST}:${PGPORT}/${PGDATABASE}`);
    return databaseUrl;
  }

  // Railway injects DATABASE_URL automatically when PostgreSQL is linked
  if (process.env.DATABASE_PRIVATE_URL) {
    return process.env.DATABASE_PRIVATE_URL;
  }

  // Fall back to DATABASE_URL (for local development)
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  console.warn("⚠️ DATABASE_URL not set. Server will start in limited mode.");
  return null;
}
