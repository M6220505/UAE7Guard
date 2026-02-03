/**
 * Constructs DATABASE_URL from Replit PG credentials if available.
 * This allows the app to work in both development (.env) and production (Replit).
 */
export function getDatabaseUrl(): string {
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

  // Fall back to DATABASE_URL (for local development)
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}
