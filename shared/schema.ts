import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, index, serial } from "drizzle-orm/pg-core";
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

// Live Monitoring - Wallet Watch for real-time alerts
export const liveMonitoring = pgTable("live_monitoring", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  walletAddress: text("wallet_address").notNull(),
  label: text("label"),
  network: text("network").default("ethereum").notNull(), // ethereum, bsc, polygon
  isActive: boolean("is_active").default(true).notNull(),
  lastChecked: timestamp("last_checked"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("live_monitoring_wallet_idx").on(table.walletAddress),
]);

export const liveMonitoringRelations = relations(liveMonitoring, ({ one, many }) => ({
  user: one(users, { fields: [liveMonitoring.userId], references: [users.id] }),
  alerts: many(monitoringAlerts),
}));

// Monitoring Alerts - Real-time movement alerts
export const monitoringAlerts = pgTable("monitoring_alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  monitoringId: varchar("monitoring_id").notNull().references(() => liveMonitoring.id),
  alertType: text("alert_type").notNull(), // outgoing, incoming, large_transfer
  amount: text("amount"),
  toAddress: text("to_address"),
  fromAddress: text("from_address"),
  txHash: text("tx_hash"),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const monitoringAlertsRelations = relations(monitoringAlerts, ({ one }) => ({
  monitoring: one(liveMonitoring, { fields: [monitoringAlerts.monitoringId], references: [liveMonitoring.id] }),
}));

// Escrow Transactions - Smart Lock for secure transactions
export const escrowTransactions = pgTable("escrow_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  buyerId: varchar("buyer_id").notNull().references(() => users.id),
  sellerId: varchar("seller_id"),
  assetType: text("asset_type").notNull(), // real_estate, luxury_watch, vehicle, crypto, other
  assetDescription: text("asset_description").notNull(),
  amount: text("amount").notNull(),
  currency: text("currency").default("AED").notNull(),
  buyerWallet: text("buyer_wallet").notNull(),
  sellerWallet: text("seller_wallet"),
  status: text("status").default("pending").notNull(), // pending, funded, verified, released, disputed, cancelled
  buyerVerified: boolean("buyer_verified").default(false).notNull(),
  sellerVerified: boolean("seller_verified").default(false).notNull(),
  assetTransferred: boolean("asset_transferred").default(false).notNull(),
  releaseConditions: text("release_conditions"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const escrowTransactionsRelations = relations(escrowTransactions, ({ one }) => ({
  buyer: one(users, { fields: [escrowTransactions.buyerId], references: [users.id] }),
}));

// Price Slippage Calculations
export const slippageCalculations = pgTable("slippage_calculations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  tokenSymbol: text("token_symbol").notNull(),
  tokenAddress: text("token_address"),
  amount: text("amount").notNull(),
  currentPrice: text("current_price"),
  estimatedSlippage: text("estimated_slippage"),
  liquidityDepth: text("liquidity_depth"),
  recommendation: text("recommendation"), // proceed, caution, avoid
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const slippageCalculationsRelations = relations(slippageCalculations, ({ one }) => ({
  user: one(users, { fields: [slippageCalculations.userId], references: [users.id] }),
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

export const insertLiveMonitoringSchema = createInsertSchema(liveMonitoring).omit({
  id: true,
  isActive: true,
  lastChecked: true,
  createdAt: true,
});

export const insertMonitoringAlertSchema = createInsertSchema(monitoringAlerts).omit({
  id: true,
  isRead: true,
  createdAt: true,
});

export const insertEscrowTransactionSchema = createInsertSchema(escrowTransactions).omit({
  id: true,
  status: true,
  buyerVerified: true,
  sellerVerified: true,
  assetTransferred: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSlippageCalculationSchema = createInsertSchema(slippageCalculations).omit({
  id: true,
  createdAt: true,
});

// Conversations table for AI chat
export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

// Messages table for AI chat
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  role: text("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  createdAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

// Encrypted Audit Logs - Legal-grade transaction documentation (AES-256)
export const encryptedAuditLogs = pgTable("encrypted_audit_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  transactionHash: text("transaction_hash").notNull(),
  walletAddress: text("wallet_address").notNull(),
  transactionValueAED: text("transaction_value_aed").notNull(),
  riskScore: integer("risk_score").notNull(),
  riskLevel: text("risk_level").notNull(),
  encryptedData: text("encrypted_data").notNull(),
  encryptionIV: text("encryption_iv").notNull(),
  dataHash: text("data_hash").notNull(),
  timestampUtc: timestamp("timestamp_utc").defaultNow().notNull(),
  blockNumber: text("block_number"),
  network: text("network").default("ethereum").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("audit_logs_wallet_idx").on(table.walletAddress),
  index("audit_logs_timestamp_idx").on(table.timestampUtc),
]);

export const insertEncryptedAuditLogSchema = createInsertSchema(encryptedAuditLogs).omit({
  id: true,
  createdAt: true,
});

// AI Scam Predictions table
export const aiPredictions = pgTable("ai_predictions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  walletAddress: text("wallet_address").notNull(),
  riskScore: integer("risk_score").notNull(),
  riskLevel: text("risk_level").notNull(), // safe, suspicious, dangerous
  aiAnalysis: text("ai_analysis").notNull(),
  factors: text("factors").notNull(), // JSON string of risk factors
  recommendation: text("recommendation").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("ai_predictions_wallet_idx").on(table.walletAddress),
]);

export const insertAiPredictionSchema = createInsertSchema(aiPredictions).omit({
  id: true,
  createdAt: true,
});

// Types
export type Conversation = typeof conversations.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type AiPrediction = typeof aiPredictions.$inferSelect;
export type InsertAiPrediction = z.infer<typeof insertAiPredictionSchema>;
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
export type LiveMonitoring = typeof liveMonitoring.$inferSelect;
export type MonitoringAlert = typeof monitoringAlerts.$inferSelect;
export type EscrowTransaction = typeof escrowTransactions.$inferSelect;
export type SlippageCalculation = typeof slippageCalculations.$inferSelect;
export type InsertLiveMonitoring = z.infer<typeof insertLiveMonitoringSchema>;
export type InsertMonitoringAlert = z.infer<typeof insertMonitoringAlertSchema>;
export type InsertEscrowTransaction = z.infer<typeof insertEscrowTransactionSchema>;
export type InsertSlippageCalculation = z.infer<typeof insertSlippageCalculationSchema>;
export type EncryptedAuditLog = typeof encryptedAuditLogs.$inferSelect;
export type InsertEncryptedAuditLog = z.infer<typeof insertEncryptedAuditLogSchema>;
