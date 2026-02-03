import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema.ts";
import { getDatabaseUrl } from "./getDatabaseUrl";

const { Pool } = pg;

const databaseUrl = getDatabaseUrl();

// Database is optional - server starts in limited mode without it
export const isDatabaseAvailable = databaseUrl !== null;
export const pool = databaseUrl ? new Pool({ connectionString: databaseUrl }) : null;
export const db = pool ? drizzle(pool, { schema }) : null as any;
