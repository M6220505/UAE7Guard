import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  role: text("role").default("user").notNull(), // user, admin, investigator
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  reputation: one(userReputation),
  reports: many(scamReports),
  alerts: many(alerts),
  watchlist: many(watchlist),
  securityLogs: many(securityLogs),
}));

// User Reputation table
export const userReputation = pgTable("user_reputation", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id).unique(),
  trustScore: integer("trust_score").default(0).notNull(),
  rank: text("rank").default("Novice").notNull(), // Novice, Analyst, Investigator, Sentinel
  verifiedReports: integer("verified_reports").default(0).notNull(),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
});

export const userReputationRelations = relations(userReputation, ({ one }) => ({
  user: one(users, { fields: [userReputation.userId], references: [users.id] }),
}));

// Scam Reports table with index on scammerAddress for fast lookup
export const scamReports = pgTable("scam_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  scammerAddress: text("scammer_address").notNull(),
  reporterId: varchar("reporter_id").notNull().references(() => users.id),
  scamType: text("scam_type").notNull(), // phishing, rugpull, honeypot, fake_ico, pump_dump, other
  description: text("description").notNull(),
  evidenceUrl: text("evidence_url"),
  amountLost: text("amount_lost"),
  status: text("status").default("pending").notNull(), // pending, verified, rejected
  severity: text("severity").default("medium").notNull(), // low, medium, high, critical
  verifiedBy: varchar("verified_by").references(() => users.id),
  verifiedAt: timestamp("verified_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("scammer_address_idx").on(table.scammerAddress),
]);

export const scamReportsRelations = relations(scamReports, ({ one }) => ({
  reporter: one(users, { fields: [scamReports.reporterId], references: [users.id] }),
  verifier: one(users, { fields: [scamReports.verifiedBy], references: [users.id] }),
}));

// Alerts table
export const alerts = pgTable("alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  message: text("message").notNull(),
  severity: text("severity").default("medium").notNull(), // low, medium, high
  read: boolean("read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const alertsRelations = relations(alerts, ({ one }) => ({
  user: one(users, { fields: [alerts.userId], references: [users.id] }),
}));

// Watchlist table
export const watchlist = pgTable("watchlist", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  address: text("address").notNull(),
  label: text("label"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const watchlistRelations = relations(watchlist, ({ one }) => ({
  user: one(users, { fields: [watchlist.userId], references: [users.id] }),
}));

// Security Logs table (audit trail)
export const securityLogs = pgTable("security_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  actionType: text("action_type").notNull(), // EMERGENCY_SECURE_ASSETS, REVOKE_PERMISSIONS, DOCUMENT_INCIDENT
  targetAddress: text("target_address"),
  details: text("details"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const securityLogsRelations = relations(securityLogs, ({ one }) => ({
  user: one(users, { fields: [securityLogs.userId], references: [users.id] }),
}));

// Insert Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
});

export const insertScamReportSchema = createInsertSchema(scamReports).omit({
  id: true,
  status: true,
  verifiedBy: true,
  verifiedAt: true,
  createdAt: true,
});

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
  read: true,
  createdAt: true,
});

export const insertWatchlistSchema = createInsertSchema(watchlist).omit({
  id: true,
  createdAt: true,
});

export const insertSecurityLogSchema = createInsertSchema(securityLogs).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type UserReputation = typeof userReputation.$inferSelect;
export type ScamReport = typeof scamReports.$inferSelect;
export type Alert = typeof alerts.$inferSelect;
export type Watchlist = typeof watchlist.$inferSelect;
export type SecurityLog = typeof securityLogs.$inferSelect;
export type InsertScamReport = z.infer<typeof insertScamReportSchema>;
export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type InsertWatchlist = z.infer<typeof insertWatchlistSchema>;
export type InsertSecurityLog = z.infer<typeof insertSecurityLogSchema>;
