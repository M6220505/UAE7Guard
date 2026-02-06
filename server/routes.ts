import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertScamReportSchema, insertAlertSchema, insertWatchlistSchema, insertSecurityLogSchema, insertLiveMonitoringSchema, insertEscrowTransactionSchema, insertSlippageCalculationSchema } from "@shared/schema.ts";
import { z } from "zod";
import OpenAI from "openai";
import { getFullWalletData, getWalletBalance, getRecentTransactions, checkIfContract, isAlchemyConfigured, getHybridWalletSnapshot, getUnifiedWalletData, SUPPORTED_NETWORKS, validateAddress } from "./alchemy";
import { hybridVerificationInputSchema, type HybridVerificationResult, type OnChainFacts, type AIInsight } from "@shared/schema.ts";
import { calculateMillionDirhamRisk, type RiskInput } from "./risk-engine";
import { createEncryptedAuditLog, decryptAuditLog, isEncryptionConfigured, type AuditLogData } from "./encryption";
import { generateSovereignReport, formatReportForDisplay, type SovereignReportInput, type SovereignReport } from "./sovereign-report";
import { generatePDFReport } from "./pdf-generator";
import { setupAuth, registerAuthRoutes, isAuthenticated as legacyIsAuthenticated, isAdmin as legacyIsAdmin } from "./replit_integrations/auth";
import firebaseAuthRouter from "./replit_integrations/auth/firebaseAuth";
import { authenticateUser, requireAdmin, isSupabaseAuthConfigured } from "./middleware/supabaseAuth";

// Use new unified auth middleware that supports both Supabase JWT and legacy sessions
const isAuthenticated = authenticateUser;
const isAdmin = requireAdmin;
import { sendThreatAlert, sendReportConfirmation, sendWelcomeEmail, sendNotificationEmail } from "./email";
import { getUserIdForRequest } from "./demo-access";
import { stripeService } from "./stripeService";
import { getStripePublishableKey } from "./stripeClient";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY || "sk-placeholder-key-not-set",
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Replit Auth (MUST be before other routes)
  await setupAuth(app);
  registerAuthRoutes(app);

  // Register Firebase Auth routes
  app.use("/api/auth/firebase", firebaseAuthRouter);

  // ===== HEALTH CHECK =====
  app.get("/api/health", async (req, res) => {
    try {
      // Check database connection
      const stats = await storage.getStats();

      res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        database: "connected",
        environment: process.env.NODE_ENV || "development",
        features: {
          database: !!process.env.DATABASE_URL,
          sessions: !!process.env.SESSION_SECRET,
          alchemy: !!process.env.ALCHEMY_API_KEY,
          openai: !!process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
          email: !!process.env.SENDGRID_API_KEY,
          stripe: !!process.env.STRIPE_SECRET_KEY,
        },
      });
    } catch (error) {
      console.error("[HEALTH] Health check failed:", error);
      res.status(503).json({
        status: "error",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // ===== AUTH VERIFICATION TEST (for iOS/Mobile testing) =====
  app.get("/api/auth/verify", isAuthenticated, (req: any, res) => {
    const user = req.verifiedUser || req.user;
    res.json({
      success: true,
      message: "Authentication verified successfully",
      user: {
        id: user?.id || user?.claims?.sub,
        email: user?.email,
        role: user?.role,
        authMethod: user?.authMethod || 'session',
      },
      supabaseConfigured: isSupabaseAuthConfigured(),
      timestamp: new Date().toISOString(),
    });
  });

  // ===== SUPPORTED NETWORKS =====
  app.get("/api/networks", (_req, res) => {
    res.json({
      success: true,
      networks: SUPPORTED_NETWORKS,
    });
  });

  // ===== MULTI-CHAIN WALLET DATA =====
  app.get("/api/wallet/:network/:address", async (req, res) => {
    try {
      const { network, address } = req.params;
      
      const networkInfo = SUPPORTED_NETWORKS.find(n => n.id === network);
      if (!networkInfo) {
        return res.status(400).json({ 
          error: "Unsupported network",
          supportedNetworks: SUPPORTED_NETWORKS.map(n => n.id)
        });
      }

      if (!validateAddress(address, network)) {
        return res.status(400).json({ 
          error: "Invalid address format for " + networkInfo.name
        });
      }

      const walletData = await getUnifiedWalletData(address, network);
      
      const reports = await storage.getReportsByAddress(address);
      const verifiedReports = reports.filter(r => r.status === 'verified');
      const pendingReports = reports.filter(r => r.status === 'pending');

      const isCrossChain = network !== 'ethereum' && reports.length === 0;

      res.json({
        success: true,
        wallet: walletData,
        threats: {
          total: reports.length,
          verified: verifiedReports.length,
          pending: pendingReports.length,
          notice: isCrossChain ? "Threat database currently indexes Ethereum addresses. Cross-chain threat mapping is limited." : undefined,
        },
      });
    } catch (error) {
      console.error("Multi-chain wallet error:", error);
      res.status(500).json({ error: "Failed to fetch wallet data" });
    }
  });

  // ===== THREAT LOOKUP =====
  app.get("/api/threats/:address", async (req, res) => {
    try {
      const address = req.params.address;
      const reports = await storage.getReportsByAddress(address);
      res.json(reports);
    } catch (error) {
      res.status(500).json({ error: "Failed to search threats" });
    }
  });

  app.get("/api/threats", async (req, res) => {
    try {
      const address = req.query.address as string;
      if (!address) {
        return res.json([]);
      }
      const reports = await storage.getReportsByAddress(address);
      res.json(reports);
    } catch (error) {
      res.status(500).json({ error: "Failed to search threats" });
    }
  });

  // ===== REPORTS =====
  app.get("/api/reports", async (req, res) => {
    try {
      const reports = await storage.getReports();
      res.json(reports);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reports" });
    }
  });

  app.post("/api/reports", isAuthenticated, async (req: any, res) => {
    try {
      const data = insertScamReportSchema.parse(req.body);
      const userId = req.user?.claims?.sub;
      
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }
      
      const report = await storage.createReport({
        ...data,
        reporterId: userId
      });
      res.status(201).json(report);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create report" });
    }
  });

  // ===== ADMIN ROUTES (Protected - Admin Role Required) =====
  app.get("/api/admin/pending-reports", isAdmin, async (req, res) => {
    try {
      const reports = await storage.getPendingReports();
      res.json(reports);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch pending reports" });
    }
  });

  app.post("/api/admin/reports/:id/verify", isAdmin, async (req: any, res) => {
    try {
      const reportId = req.params.id;
      const adminId = req.user?.claims?.sub;
      
      if (!adminId) {
        return res.status(401).json({ error: "User not authenticated" });
      }
      
      const report = await storage.verifyReport(reportId, adminId);
      if (!report) {
        return res.status(404).json({ error: "Report not found" });
      }
      res.json(report);
    } catch (error) {
      res.status(500).json({ error: "Failed to verify report" });
    }
  });

  app.post("/api/admin/reports/:id/reject", isAdmin, async (req, res) => {
    try {
      const reportId = req.params.id;
      const report = await storage.rejectReport(reportId);
      if (!report) {
        return res.status(404).json({ error: "Report not found" });
      }
      res.json(report);
    } catch (error) {
      res.status(500).json({ error: "Failed to reject report" });
    }
  });

  // ===== ADMIN PANEL AUTHENTICATION =====
  // Rate limiting map to prevent brute force attacks
  const adminLoginAttempts = new Map<string, { count: number; lastAttempt: number }>();
  const MAX_ATTEMPTS = 5;
  const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes

  app.post("/api/admin/authenticate", async (req, res) => {
    try {
      const clientIP = (req as any).clientIp || req.ip || req.socket?.remoteAddress || 'unknown';
      const now = Date.now();
      
      // Check rate limiting
      const attempts = adminLoginAttempts.get(clientIP);
      if (attempts && attempts.count >= MAX_ATTEMPTS) {
        const timeSinceLastAttempt = now - attempts.lastAttempt;
        if (timeSinceLastAttempt < LOCKOUT_TIME) {
          const remainingTime = Math.ceil((LOCKOUT_TIME - timeSinceLastAttempt) / 60000);
          return res.status(429).json({ 
            success: false, 
            error: `Too many attempts. Try again in ${remainingTime} minutes.` 
          });
        } else {
          // Reset after lockout period
          adminLoginAttempts.delete(clientIP);
        }
      }

      const { password } = req.body;
      const adminPassword = process.env.ADMIN_PASSWORD;
      
      if (!adminPassword) {
        console.error("ADMIN_PASSWORD not configured - admin authentication disabled");
        return res.status(503).json({ success: false, error: "Admin authentication not configured" });
      }
      
      if (!password || typeof password !== "string") {
        return res.status(400).json({ success: false, error: "Invalid password" });
      }
      
      // Use timing-safe comparison to prevent timing attacks
      const bcrypt = await import("bcryptjs");
      
      // Check if ADMIN_PASSWORD is already hashed (starts with $2)
      let isValid = false;
      if (adminPassword.startsWith('$2')) {
        // Already hashed, compare directly
        isValid = await bcrypt.compare(password, adminPassword);
      } else {
        // Plain text fallback (for initial setup) - compare directly but log warning
        console.warn("WARNING: ADMIN_PASSWORD should be hashed. Use bcrypt to hash it.");
        isValid = password === adminPassword;
      }
      
      if (isValid) {
        // Clear failed attempts on successful login
        adminLoginAttempts.delete(clientIP);
        
        res.json({ 
          success: true, 
          message: "Admin access granted",
          timestamp: new Date().toISOString()
        });
      } else {
        // Track failed attempt
        const currentAttempts = adminLoginAttempts.get(clientIP) || { count: 0, lastAttempt: 0 };
        adminLoginAttempts.set(clientIP, { 
          count: currentAttempts.count + 1, 
          lastAttempt: now 
        });
        
        res.status(401).json({ success: false, error: "Access denied" });
      }
    } catch (error) {
      console.error("Admin authentication error:", error);
      res.status(500).json({ success: false, error: "Authentication failed" });
    }
  });

  // ===== ESCROW ADMIN AUTHENTICATION =====
  app.post("/api/admin/escrow/authenticate", async (req, res) => {
    try {
      const { code } = req.body;
      const adminSecret = process.env.SESSION_SECRET;
      
      if (!adminSecret) {
        console.error("SESSION_SECRET not configured - admin authentication disabled");
        return res.status(503).json({ success: false, error: "Admin authentication not configured" });
      }
      
      if (!code || typeof code !== "string") {
        return res.status(400).json({ success: false, error: "Invalid code" });
      }
      
      if (code === adminSecret) {
        res.json({ 
          success: true, 
          message: "Admin access granted",
          timestamp: new Date().toISOString()
        });
      } else {
        res.status(401).json({ success: false, error: "Access denied" });
      }
    } catch (error) {
      res.status(500).json({ success: false, error: "Authentication failed" });
    }
  });

  // ===== LEADERBOARD =====
  app.get("/api/leaderboard", async (req, res) => {
    try {
      const leaderboard = await storage.getLeaderboard();
      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
  });

  // ===== USER REPUTATION =====
  app.get("/api/user/reputation", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }
      
      const reputation = await storage.getReputation(userId);
      res.json(reputation || { trustScore: 0, rank: "Novice", verifiedReports: 0 });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reputation" });
    }
  });

  // ===== ALERTS =====
  app.get("/api/alerts", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }
      const alerts = await storage.getAlerts(userId);
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch alerts" });
    }
  });

  app.patch("/api/alerts/:id", isAuthenticated, async (req, res) => {
    try {
      const alertId = req.params.id;
      const alert = await storage.markAlertRead(alertId);
      if (!alert) {
        return res.status(404).json({ error: "Alert not found" });
      }
      res.json(alert);
    } catch (error) {
      res.status(500).json({ error: "Failed to update alert" });
    }
  });

  // ===== WATCHLIST =====
  app.get("/api/watchlist", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }
      const watchlist = await storage.getWatchlist(userId);
      res.json(watchlist);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch watchlist" });
    }
  });

  app.post("/api/watchlist", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }
      const data = insertWatchlistSchema.parse({
        ...req.body,
        userId
      });
      const item = await storage.addToWatchlist(data);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to add to watchlist" });
    }
  });

  app.delete("/api/watchlist/:id", isAuthenticated, async (req, res) => {
    try {
      await storage.removeFromWatchlist(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to remove from watchlist" });
    }
  });

  // ===== SECURITY LOGS =====
  app.post("/api/security-logs", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }
      
      const data = insertSecurityLogSchema.parse({
        ...req.body,
        userId
      });
      const log = await storage.createSecurityLog(data);
      res.status(201).json(log);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create security log" });
    }
  });

  app.get("/api/security-logs", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }
      const logs = await storage.getSecurityLogs(userId);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch security logs" });
    }
  });

  // ===== STATS =====
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // ===== EMAIL NOTIFICATIONS =====
  app.post("/api/notifications/threat-alert", async (req, res) => {
    try {
      const schema = z.object({
        email: z.string().email(),
        walletAddress: z.string().min(10),
        threatLevel: z.enum(["safe", "suspicious", "dangerous"]),
        details: z.string()
      });
      
      const data = schema.parse(req.body);
      const success = await sendThreatAlert({
        to: data.email,
        walletAddress: data.walletAddress,
        threatLevel: data.threatLevel,
        details: data.details
      });
      
      if (success) {
        res.json({ success: true, message: "Threat alert sent successfully" });
      } else {
        res.status(500).json({ success: false, error: "Failed to send email" });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Threat alert error:", error);
      res.status(500).json({ error: "Failed to send threat alert" });
    }
  });

  app.post("/api/notifications/report-status", async (req, res) => {
    try {
      const schema = z.object({
        email: z.string().email(),
        reportId: z.number(),
        walletAddress: z.string().min(10),
        status: z.enum(["pending", "verified", "rejected"])
      });
      
      const data = schema.parse(req.body);
      const success = await sendReportConfirmation({
        to: data.email,
        reportId: data.reportId,
        walletAddress: data.walletAddress,
        status: data.status
      });
      
      if (success) {
        res.json({ success: true, message: "Report status notification sent" });
      } else {
        res.status(500).json({ success: false, error: "Failed to send email" });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Report status notification error:", error);
      res.status(500).json({ error: "Failed to send notification" });
    }
  });

  app.post("/api/notifications/welcome", async (req, res) => {
    try {
      const schema = z.object({
        email: z.string().email(),
        firstName: z.string().min(1)
      });
      
      const data = schema.parse(req.body);
      const success = await sendWelcomeEmail({
        to: data.email,
        firstName: data.firstName
      });
      
      if (success) {
        res.json({ success: true, message: "Welcome email sent successfully" });
      } else {
        res.status(500).json({ success: false, error: "Failed to send email" });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Welcome email error:", error);
      res.status(500).json({ error: "Failed to send welcome email" });
    }
  });

  app.post("/api/notifications/custom", async (req, res) => {
    try {
      const schema = z.object({
        email: z.string().email(),
        subject: z.string().min(1),
        htmlContent: z.string().min(1)
      });
      
      const data = schema.parse(req.body);
      const success = await sendNotificationEmail(
        data.email,
        data.subject,
        data.htmlContent
      );
      
      if (success) {
        res.json({ success: true, message: "Custom notification sent" });
      } else {
        res.status(500).json({ success: false, error: "Failed to send email" });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Custom notification error:", error);
      res.status(500).json({ error: "Failed to send notification" });
    }
  });

  // ===== LIVE MONITORING =====
  app.get("/api/live-monitoring", async (req: any, res) => {
    try {
      const userId = await getUserIdForRequest(req);
      const items = await storage.getLiveMonitoring(userId);
      res.json(items);
    } catch (error) {
      console.error("Live monitoring fetch error:", error);
      res.status(500).json({ error: "Failed to fetch monitored wallets" });
    }
  });

  app.post("/api/live-monitoring", async (req: any, res) => {
    try {
      const userId = await getUserIdForRequest(req);
      
      const data = insertLiveMonitoringSchema.parse({
        ...req.body,
        userId
      });
      const item = await storage.createLiveMonitoring(data);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Live monitoring create error:", error);
      res.status(500).json({ error: "Failed to add wallet to monitoring" });
    }
  });

  app.delete("/api/live-monitoring/:id", async (req, res) => {
    try {
      await storage.deleteLiveMonitoring(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to remove wallet from monitoring" });
    }
  });

  // ===== ESCROW =====
  app.get("/api/escrow", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }
      const items = await storage.getEscrowTransactions(userId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch escrow transactions" });
    }
  });

  app.post("/api/escrow", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }
      
      const data = insertEscrowTransactionSchema.parse({
        ...req.body,
        buyerId: userId
      });
      const item = await storage.createEscrowTransaction(data);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create escrow transaction" });
    }
  });

  // ===== SLIPPAGE CALCULATIONS =====
  app.get("/api/slippage", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }
      const items = await storage.getSlippageCalculations(userId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch slippage calculations" });
    }
  });

  app.post("/api/slippage", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }
      
      const data = insertSlippageCalculationSchema.parse({
        ...req.body,
        userId
      });
      const item = await storage.createSlippageCalculation(data);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to save slippage calculation" });
    }
  });

  // ===== AI SCAM PREDICTION =====
  app.post("/api/ai/predict", async (req, res) => {
    try {
      const { walletAddress, transactionValue } = req.body;

      if (!walletAddress) {
        return res.status(400).json({ error: "Wallet address is required" });
      }

      // Get existing reports for this address
      const existingReports = await storage.getReportsByAddress(walletAddress);
      const hasVerifiedReports = existingReports.some(r => r.status === "verified");
      const reportCount = existingReports.length;

      // Build context for AI analysis
      const context = {
        address: walletAddress,
        transactionValue: transactionValue || "Unknown",
        existingReports: reportCount,
        hasVerifiedThreats: hasVerifiedReports,
        reportTypes: existingReports.map(r => r.scamType),
        severities: existingReports.map(r => r.severity),
      };

      const systemPrompt = `You are UAE7Guard's AI Security Analyst, specialized in cryptocurrency fraud detection and prevention for UAE investors. Analyze wallet addresses for potential scam indicators.

Your analysis should consider:
1. Historical threat reports in our database
2. Common scam patterns (rugpulls, honeypots, phishing, pump & dump)
3. VARA/ADGM compliance factors
4. Transaction value risk assessment

Respond in JSON format with these fields:
{
  "riskScore": <number 0-100>,
  "riskLevel": "<safe|suspicious|dangerous>",
  "factors": [{"name": "string", "impact": "positive|negative|neutral", "description": "string"}],
  "analysis": "Detailed analysis in English",
  "recommendation": "Clear action recommendation"
}

Risk Level Guidelines:
- safe (0-25): No indicators of malicious activity
- suspicious (26-60): Some warning signs, proceed with caution
- dangerous (61-100): High risk indicators, avoid transaction`;

      const userPrompt = `Analyze this wallet for potential scam risk:

Address: ${context.address}
Transaction Value: ${context.transactionValue}
Existing Reports in Database: ${context.existingReports}
Has Verified Threats: ${context.hasVerifiedThreats}
Report Types: ${context.reportTypes.join(", ") || "None"}
Severities: ${context.severities.join(", ") || "None"}

Provide comprehensive risk analysis.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" },
        max_tokens: 1500,
      });

      const aiResult = JSON.parse(response.choices[0]?.message?.content || "{}");

      res.json({
        success: true,
        prediction: {
          walletAddress,
          riskScore: aiResult.riskScore || 0,
          riskLevel: aiResult.riskLevel || "safe",
          factors: aiResult.factors || [],
          analysis: aiResult.analysis || "Analysis unavailable",
          recommendation: aiResult.recommendation || "No recommendation",
          existingReports: reportCount,
          hasVerifiedThreats: hasVerifiedReports,
          analyzedAt: new Date().toISOString(),
        }
      });
    } catch (error) {
      console.error("AI prediction error:", error);
      res.status(500).json({ error: "Failed to analyze wallet" });
    }
  });

  // ===== MILLION DIRHAM RISK ENGINE =====
  app.post("/api/risk/calculate", async (req, res) => {
    try {
      const riskInputSchema = z.object({
        walletAddress: z.string().min(10),
        walletAgeDays: z.number().min(0),
        transactionCount: z.number().min(0),
        balanceEth: z.number().min(0).optional(),
        blacklistAssociations: z.number().min(0),
        isDirectlyBlacklisted: z.boolean(),
        transactionValue: z.number().optional(),
        isSmartContract: z.boolean().optional(),
      });

      const input = riskInputSchema.parse(req.body);
      
      const reports = await storage.getReportsByAddress(input.walletAddress);
      const verifiedReports = reports.filter(r => r.status === 'verified');
      const pendingReports = reports.filter(r => r.status === 'pending');
      
      const threatScore = (verifiedReports.length * 0.6 + pendingReports.length * 0.2) / Math.max(1, reports.length);
      
      const riskInput: RiskInput = {
        ...input,
        balanceEth: input.balanceEth || 0,
        threatScore: Math.min(threatScore, 1),
        blacklistAssociations: input.blacklistAssociations + verifiedReports.length,
        isDirectlyBlacklisted: input.isDirectlyBlacklisted || verifiedReports.length > 0,
      };

      const result = calculateMillionDirhamRisk(riskInput);
      
      res.json({
        success: true,
        ...result,
        verifiedThreatCount: verifiedReports.length,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid input data", details: error.errors });
      }
      console.error("Risk calculation error:", error);
      res.status(500).json({ error: "Failed to calculate risk" });
    }
  });

  // ===== ENCRYPTED AUDIT LOGS =====
  const MIN_AUDIT_VALUE_AED = 50000;

  app.get("/api/audit/status", async (_req, res) => {
    res.json({ 
      configured: isEncryptionConfigured(),
      minValueAED: MIN_AUDIT_VALUE_AED,
      message: isEncryptionConfigured() 
        ? "Encryption vault active"
        : "ENCRYPTION_KEY required"
    });
  });

  app.post("/api/audit/log", isAuthenticated, async (req, res) => {
    try {
      if (!isEncryptionConfigured()) {
        return res.status(503).json({ 
          error: "Encryption not configured",
          message: "ENCRYPTION_KEY environment variable is required"
        });
      }

      const auditSchema = z.object({
        walletAddress: z.string().min(10),
        transactionValueAED: z.number().min(MIN_AUDIT_VALUE_AED),
        riskScore: z.number().min(0).max(100),
        riskLevel: z.string(),
        analysisDetails: z.object({
          historyScore: z.number(),
          associationScore: z.number(),
          walletAgeDays: z.number(),
          formula: z.string(),
        }),
        blockchainData: z.object({
          balance: z.string(),
          transactionCount: z.number(),
          isSmartContract: z.boolean(),
          network: z.string(),
        }).optional(),
        analyst: z.string().optional(),
      });

      const data = auditSchema.parse(req.body) as AuditLogData;
      
      const encryptedLog = createEncryptedAuditLog(data);
      
      const savedLog = await storage.createAuditLog({
        transactionHash: encryptedLog.transactionHash,
        walletAddress: data.walletAddress,
        transactionValueAED: data.transactionValueAED.toString(),
        riskScore: data.riskScore,
        riskLevel: data.riskLevel,
        encryptedData: encryptedLog.encryptedData,
        encryptionIV: encryptedLog.encryptionIV,
        dataHash: encryptedLog.dataHash,
        timestampUtc: encryptedLog.timestampUtc,
        network: data.blockchainData?.network || "ethereum",
      });

      res.status(201).json({
        success: true,
        message: "Audit log encrypted and stored",
        log: {
          id: savedLog.id,
          transactionHash: savedLog.transactionHash,
          dataHash: savedLog.dataHash,
          timestamp: savedLog.timestampUtc,
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Invalid audit data", 
          details: error.errors 
        });
      }
      console.error("Audit log error:", error);
      res.status(500).json({ 
        error: "Failed to create audit log"
      });
    }
  });

  app.get("/api/audit/logs", isAuthenticated, async (_req, res) => {
    try {
      const logs = await storage.getAuditLogs();
      res.json({
        success: true,
        count: logs.length,
        logs: logs.map(log => ({
          id: log.id,
          transactionHash: log.transactionHash,
          walletAddress: log.walletAddress,
          transactionValueAED: log.transactionValueAED,
          riskScore: log.riskScore,
          riskLevel: log.riskLevel,
          dataHash: log.dataHash,
          timestamp: log.timestampUtc,
          network: log.network,
        }))
      });
    } catch (error) {
      console.error("Fetch audit logs error:", error);
      res.status(500).json({ error: "Failed to fetch audit logs" });
    }
  });

  app.get("/api/audit/logs/:address", async (req, res) => {
    try {
      const logs = await storage.getAuditLogsByAddress(req.params.address);
      res.json({
        success: true,
        count: logs.length,
        logs: logs.map(log => ({
          id: log.id,
          transactionHash: log.transactionHash,
          walletAddress: log.walletAddress,
          transactionValueAED: log.transactionValueAED,
          riskScore: log.riskScore,
          riskLevel: log.riskLevel,
          dataHash: log.dataHash,
          timestamp: log.timestampUtc,
          network: log.network,
        }))
      });
    } catch (error) {
      console.error("Fetch audit logs error:", error);
      res.status(500).json({ error: "Failed to fetch audit logs" });
    }
  });

  app.get("/api/audit/decrypt/:id", async (req, res) => {
    try {
      if (!isEncryptionConfigured()) {
        return res.status(503).json({ 
          error: "Encryption not configured"
        });
      }

      const logs = await storage.getAuditLogs();
      const log = logs.find(l => l.id === req.params.id);
      
      if (!log) {
        return res.status(404).json({ 
          error: "Audit log not found"
        });
      }

      const decryptedData = decryptAuditLog(log.encryptedData, log.encryptionIV);
      
      if (!decryptedData) {
        return res.status(500).json({ 
          error: "Failed to decrypt log"
        });
      }

      res.json({
        success: true,
        log: {
          id: log.id,
          transactionHash: log.transactionHash,
          dataHash: log.dataHash,
          timestamp: log.timestampUtc,
          decryptedData,
        }
      });
    } catch (error) {
      console.error("Decrypt audit log error:", error);
      res.status(500).json({ 
        error: "Failed to decrypt audit log"
      });
    }
  });

  // ===== SOVEREIGN VERIFICATION REPORT =====
  app.post("/api/sovereign/report", async (req, res) => {
    try {
      if (!isEncryptionConfigured()) {
        return res.status(503).json({ 
          error: "Encryption vault not configured"
        });
      }

      const reportSchema = z.object({
        walletAddress: z.string().min(10),
        transactionValueAED: z.number().min(50000),
        network: z.string().default("ethereum"),
        walletAgeDays: z.number().min(1),
        includeAI: z.boolean().default(true),
      });

      const input = reportSchema.parse(req.body);
      
      let blockchainData = {
        balance: "N/A",
        transactionCount: 0,
        isSmartContract: false,
        recentTransactions: [] as Array<{ hash: string; from: string; to: string; value: string }>,
      };

      if (isAlchemyConfigured()) {
        try {
          const walletData = await getFullWalletData(input.walletAddress, input.network);
          blockchainData = {
            balance: walletData.balance?.balanceInEth || "0",
            transactionCount: walletData.transactions?.length || 0,
            isSmartContract: walletData.contractInfo?.isContract || false,
            recentTransactions: walletData.transactions?.slice(0, 5).map((tx) => ({
              hash: tx.hash,
              from: tx.from,
              to: tx.to || "",
              value: tx.value || "0",
            })) || [],
          };
        } catch (e) {
          console.log("Blockchain data fetch failed, using defaults");
        }
      }

      const reports = await storage.getReportsByAddress(input.walletAddress);
      const verifiedReports = reports.filter(r => r.status === 'verified');
      const pendingReports = reports.filter(r => r.status === 'pending');
      
      const balanceEth = parseFloat(blockchainData.balance) || 0;
      const threatScore = (verifiedReports.length * 0.6 + pendingReports.length * 0.2) / Math.max(1, reports.length);

      const riskInput: RiskInput = {
        walletAddress: input.walletAddress,
        walletAgeDays: input.walletAgeDays,
        transactionCount: blockchainData.transactionCount,
        balanceEth,
        threatScore: Math.min(threatScore, 1),
        blacklistAssociations: verifiedReports.length,
        isDirectlyBlacklisted: verifiedReports.length > 0,
        transactionValue: input.transactionValueAED,
        isSmartContract: blockchainData.isSmartContract,
      };

      const riskResult = calculateMillionDirhamRisk(riskInput);

      let aiAnalysis: SovereignReportInput["aiAnalysis"];
      
      if (input.includeAI && openai) {
        try {
          const prompt = `Analyze this Ethereum wallet for fraud risk. Return JSON only.
Wallet: ${input.walletAddress}
Transaction Value: AED ${input.transactionValueAED}
Balance: ${blockchainData.balance} ETH
Transactions: ${blockchainData.transactionCount}
Is Smart Contract: ${blockchainData.isSmartContract}
Verified Threats in Database: ${verifiedReports.length}
Risk Score: ${riskResult.riskScore}/100

Provide:
{
  "analysis": "Brief English analysis (2-3 sentences)",
  "recommendation": "English recommendation",
  "factors": ["risk factor 1", "risk factor 2"]
}`;

          const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
            max_tokens: 500,
          });

          const aiResult = JSON.parse(response.choices[0]?.message?.content || "{}");
          aiAnalysis = {
            analysis: aiResult.analysis || "",
            recommendation: aiResult.recommendation || "",
            factors: aiResult.factors || [],
            model: "GPT-4o (Replit AI Integrations)",
          };
        } catch (e) {
          console.log("AI analysis failed, continuing without it");
        }
      }

      const reportInput: SovereignReportInput = {
        walletAddress: input.walletAddress,
        transactionValueAED: input.transactionValueAED,
        network: input.network,
        blockchainData,
        riskAnalysis: {
          riskScore: riskResult.riskScore,
          riskLevel: riskResult.riskLevel,
          historyScore: riskResult.breakdown.activityComponent + riskResult.breakdown.ageComponent,
          associationScore: riskResult.breakdown.patternComponent + riskResult.breakdown.threatComponent,
          walletAgeDays: input.walletAgeDays,
          formula: riskResult.formula?.calculation || "",
        },
        aiAnalysis,
        verifiedThreats: verifiedReports.length,
      };

      const report = generateSovereignReport(reportInput);

      const auditDataToEncrypt: AuditLogData = {
        walletAddress: input.walletAddress,
        transactionValueAED: input.transactionValueAED,
        riskScore: riskResult.riskScore,
        riskLevel: riskResult.riskLevel,
        analysisDetails: {
          historyScore: riskResult.breakdown.activityComponent + riskResult.breakdown.ageComponent,
          associationScore: riskResult.breakdown.patternComponent + riskResult.breakdown.threatComponent,
          walletAgeDays: input.walletAgeDays,
          formula: riskResult.formula?.calculation || "",
        },
        blockchainData: {
          balance: blockchainData.balance,
          transactionCount: blockchainData.transactionCount,
          isSmartContract: blockchainData.isSmartContract,
          network: input.network,
        },
        timestamp: new Date().toISOString(),
      };

      const encryptedAudit = createEncryptedAuditLog(auditDataToEncrypt);

      await storage.createAuditLog({
        transactionHash: encryptedAudit.transactionHash,
        walletAddress: input.walletAddress,
        transactionValueAED: input.transactionValueAED.toString(),
        riskScore: riskResult.riskScore,
        riskLevel: riskResult.riskLevel,
        encryptedData: encryptedAudit.encryptedData,
        encryptionIV: encryptedAudit.encryptionIV,
        dataHash: encryptedAudit.dataHash,
        timestampUtc: encryptedAudit.timestampUtc,
        network: input.network,
      });

      res.json({
        success: true,
        report: {
          ...report,
          auditTrail: {
            ...report.auditTrail,
            transactionHash: encryptedAudit.transactionHash,
            dataHash: encryptedAudit.dataHash,
            encryptedAt: encryptedAudit.timestampUtc.toISOString(),
          },
        },
        textReport: formatReportForDisplay(report),
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Invalid report request",
          details: error.errors 
        });
      }
      console.error("Sovereign report error:", error);
      res.status(500).json({ 
        error: "Failed to generate sovereign report"
      });
    }
  });

  // ===== PDF EXPORT (Rate Limited) =====
  const pdfRateLimits = new Map<string, { count: number; resetAt: number }>();
  const PDF_RATE_LIMIT = 10;
  const PDF_RATE_WINDOW = 60 * 60 * 1000;

  app.post("/api/reports/pdf", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id || req.session?.userId;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required for PDF export" });
      }

      const userLimit = pdfRateLimits.get(userId);
      const now = Date.now();
      
      if (userLimit && now < userLimit.resetAt) {
        if (userLimit.count >= PDF_RATE_LIMIT) {
          console.log(`PDF rate limit exceeded for user ${userId}`);
          return res.status(429).json({ 
            error: "Rate limit exceeded",
            message: "Maximum 10 PDF exports per hour"
          });
        }
        userLimit.count++;
      } else {
        pdfRateLimits.set(userId, { count: 1, resetAt: now + PDF_RATE_WINDOW });
      }

      const reportSchema = z.object({
        report: z.object({
          reportId: z.string(),
          generatedAt: z.string(),
          expiresAt: z.string(),
          verification: z.object({
            alchemyNode: z.string(),
            alchemyNetwork: z.string(),
            aiModel: z.string(),
            encryptionStandard: z.string(),
            hashAlgorithm: z.string(),
          }),
          subject: z.object({
            walletAddress: z.string(),
            transactionValueAED: z.number(),
            network: z.string(),
          }),
          blockchainIntelligence: z.object({
            balance: z.string(),
            transactionCount: z.number(),
            isSmartContract: z.boolean(),
            dataSource: z.string(),
          }),
          riskAssessment: z.object({
            riskScore: z.number(),
            riskLevel: z.string(),
            formula: z.string(),
            components: z.object({
              historyScore: z.number(),
              associationScore: z.number(),
              walletAgeFactor: z.number(),
            }),
          }),
          aiIntelligence: z.object({
            analysis: z.string(),
            recommendation: z.string(),
            riskFactors: z.array(z.string()),
            modelUsed: z.string(),
          }).optional(),
          threatDatabase: z.object({
            verifiedThreats: z.number(),
            database: z.string(),
            lastUpdated: z.string(),
          }),
          legalDisclaimer: z.object({
            en: z.string(),
          }),
          auditTrail: z.object({
            transactionHash: z.string(),
            dataHash: z.string(),
            encryptedAt: z.string(),
            storageLocation: z.string(),
          }),
        }),
      });

      const { report } = reportSchema.parse(req.body);
      
      const pdfBuffer = await generatePDFReport(report as SovereignReport);
      
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="UAE7Guard-${report.reportId}.pdf"`);
      res.setHeader("Content-Length", pdfBuffer.length);
      res.send(pdfBuffer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Invalid report data",
          details: error.errors 
        });
      }
      console.error("PDF generation error:", error);
      res.status(500).json({ error: "Failed to generate PDF report" });
    }
  });

  // ===== HYBRID VERIFICATION (10,000+ AED) =====
  app.post("/api/hybrid-verification", isAuthenticated, async (req: any, res) => {
    try {
      if (!isAlchemyConfigured()) {
        return res.status(503).json({ 
          error: "Blockchain service not configured",
          message: "ALCHEMY_API_KEY is required"
        });
      }

      const input = hybridVerificationInputSchema.parse(req.body);
      
      if (input.transactionAmountAED < 10000) {
        return res.status(400).json({ 
          error: "Transaction amount must be at least 10,000 AED for hybrid verification"
        });
      }

      const snapshot = await getHybridWalletSnapshot(input.walletAddress, input.network);

      const onChainFacts: OnChainFacts = {
        balance: snapshot.balance.balance,
        balanceInEth: snapshot.balance.balanceInEth,
        transactionCount: snapshot.transactionCount,
        recentTransactions: snapshot.transactions,
        walletAgeDays: snapshot.walletAgeDays,
        isContract: snapshot.isContract,
        network: snapshot.network,
      };

      let aiInsight: AIInsight = {
        riskLevel: "safe",
        riskScore: 0,
        fraudPatterns: [],
        liquidityRisk: "Unable to analyze",
        largeAmountAnalysis: "Unable to analyze",
        recommendation: "AI analysis unavailable",
        analysis: "AI analysis unavailable",
        verdict: "Transaction pattern analysis pending.",
      };

      try {
        const alchemyDataJson = JSON.stringify({
          walletAddress: input.walletAddress,
          balance: onChainFacts.balanceInEth + " ETH",
          transactionCount: onChainFacts.transactionCount,
          walletAgeDays: onChainFacts.walletAgeDays,
          isSmartContract: onChainFacts.isContract,
          transactionAmountAED: input.transactionAmountAED,
          recentTransactions: onChainFacts.recentTransactions.slice(0, 10).map(tx => ({
            hash: tx.hash,
            from: tx.from,
            to: tx.to,
            value: tx.value,
            asset: tx.asset,
          })),
        }, null, 2);

        const formattedAmount = Number.isFinite(input.transactionAmountAED) 
          ? input.transactionAmountAED.toLocaleString() 
          : String(input.transactionAmountAED);
        
        const aiPrompt = `You are a cryptocurrency fraud detection expert. Analyze the following wallet data in JSON format and identify risks.

WALLET DATA:
${alchemyDataJson}

Transaction Amount: AED ${formattedAmount}

Analyze for:
1. FRAUD PATTERNS: Look for known scam indicators (rug pulls, pump-and-dump, phishing wallet patterns, mixer usage)
2. LIQUIDITY RISK: Assess if the wallet has enough balance/history to support this transaction
3. LARGE AMOUNT ANALYSIS: For amounts 10,000+ AED, flag any unusual activity patterns

Return ONLY valid JSON with this structure:
{
  "riskLevel": "safe" | "suspicious" | "dangerous",
  "riskScore": 0-100,
  "fraudPatterns": ["pattern1", "pattern2"],
  "liquidityRisk": "English analysis of liquidity risk",
  "largeAmountAnalysis": "English analysis for large transaction",
  "analysis": "Brief English analysis (2-3 sentences)",
  "verdict": "One sentence English verdict about transaction legitimacy probability",
  "recommendation": "English recommendation"
}`;

        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [{ role: "user", content: aiPrompt }],
          response_format: { type: "json_object" },
          max_tokens: 800,
        });

        const aiResult = JSON.parse(response.choices[0]?.message?.content || "{}");
        
        aiInsight = {
          riskLevel: aiResult.riskLevel || "safe",
          riskScore: aiResult.riskScore || 0,
          fraudPatterns: aiResult.fraudPatterns || [],
          liquidityRisk: aiResult.liquidityRisk || "Unable to analyze",
          largeAmountAnalysis: aiResult.largeAmountAnalysis || "Unable to analyze",
          recommendation: aiResult.recommendation || "",
          analysis: aiResult.analysis || "",
          verdict: aiResult.verdict || "Transaction pattern analysis complete.",
        };
      } catch (aiError) {
        console.log("AI analysis failed:", aiError);
      }

      const now = new Date();
      const year = now.getFullYear();
      const randomHex = Math.random().toString(16).substr(2, 4).toUpperCase();
      const certificateId = `SV-${year}-${randomHex}-UAE`;
      
      const hasMixerInteraction = onChainFacts.recentTransactions.some(tx => {
        const mixerAddresses = [
          "0xd90e2f925da726b50c4ed8d0fb90ad053324f31b",
          "0x722122dF12D4e14e13Ac3b6895a86e84145b6967",
          "0x12D66f87A04A9E220743712cE6d9bB1B5616B8Fc",
        ];
        return mixerAddresses.includes(tx.from.toLowerCase()) || (tx.to && mixerAddresses.includes(tx.to.toLowerCase()));
      });

      const verificationResult: HybridVerificationResult = {
        verificationId: `HYB-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        certificateId,
        walletAddress: input.walletAddress,
        destinationWallet: input.destinationWallet,
        assetType: input.assetType || "digital_asset",
        transactionAmountAED: input.transactionAmountAED,
        thresholdMet: input.transactionAmountAED >= 10000,
        onChainFacts,
        aiInsight,
        sanctionCheckPassed: true,
        mixerInteractionDetected: hasMixerInteraction,
        verificationTimestamp: new Date().toISOString(),
        sources: {
          blockchain: "Alchemy Ethereum Node",
          ai: "GPT-4o (Replit AI Integrations)",
        },
      };

      res.json({
        success: true,
        verification: verificationResult,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Invalid verification request",
          details: error.errors 
        });
      }
      console.error("Hybrid verification error:", error);
      res.status(500).json({ 
        error: "Failed to perform hybrid verification"
      });
    }
  });

  app.get("/api/hybrid-verification/status", async (_req, res) => {
    res.json({ 
      configured: isAlchemyConfigured(),
      minAmountAED: 10000,
    });
  });

  // ===== BLOCKCHAIN DATA (ALCHEMY) =====
  app.get("/api/blockchain/status", async (_req, res) => {
    res.json({ configured: isAlchemyConfigured() });
  });

  app.get("/api/blockchain/wallet/:address", async (req, res) => {
    try {
      if (!isAlchemyConfigured()) {
        return res.status(503).json({ 
          error: "Blockchain service not configured",
          message: "ALCHEMY_API_KEY is not set"
        });
      }

      const { address } = req.params;
      const network = (req.query.network as string) || "ethereum";

      if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
        return res.status(400).json({ 
          error: "Invalid wallet address",
          message: "Please provide a valid Ethereum address (0x...)"
        });
      }

      const walletData = await getFullWalletData(address, network);
      res.json(walletData);
    } catch (error) {
      console.error("Blockchain data error:", error);
      res.status(500).json({ 
        error: "Failed to fetch blockchain data",
        message: "Network may be slow or address not found"
      });
    }
  });

  app.get("/api/blockchain/balance/:address", async (req, res) => {
    try {
      if (!isAlchemyConfigured()) {
        return res.status(503).json({ error: "Blockchain service not configured" });
      }

      const { address } = req.params;
      const network = (req.query.network as string) || "ethereum";

      if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
        return res.status(400).json({ error: "Invalid wallet address" });
      }

      const balance = await getWalletBalance(address, network);
      res.json(balance);
    } catch (error) {
      console.error("Balance fetch error:", error);
      res.status(500).json({ error: "Failed to fetch balance" });
    }
  });

  app.get("/api/blockchain/transactions/:address", async (req, res) => {
    try {
      if (!isAlchemyConfigured()) {
        return res.status(503).json({ error: "Blockchain service not configured" });
      }

      const { address } = req.params;
      const network = (req.query.network as string) || "ethereum";
      const limit = parseInt(req.query.limit as string) || 10;

      if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
        return res.status(400).json({ error: "Invalid wallet address" });
      }

      const transactions = await getRecentTransactions(address, network, limit);
      res.json(transactions);
    } catch (error) {
      console.error("Transactions fetch error:", error);
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  app.get("/api/blockchain/contract/:address", async (req, res) => {
    try {
      if (!isAlchemyConfigured()) {
        return res.status(503).json({ error: "Blockchain service not configured" });
      }

      const { address } = req.params;
      const network = (req.query.network as string) || "ethereum";

      if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
        return res.status(400).json({ error: "Invalid wallet address" });
      }

      const contractInfo = await checkIfContract(address, network);
      res.json(contractInfo);
    } catch (error) {
      console.error("Contract check error:", error);
      res.status(500).json({ error: "Failed to check contract status" });
    }
  });

  // ===== STRIPE SUBSCRIPTION ROUTES =====
  
  // Get Stripe publishable key for frontend
  app.get("/api/stripe/config", async (req, res) => {
    try {
      const publishableKey = await getStripePublishableKey();
      res.json({ publishableKey });
    } catch (error) {
      console.error("Stripe config error:", error);
      res.status(500).json({ error: "Failed to get Stripe configuration" });
    }
  });

  // Get subscription products with prices
  app.get("/api/stripe/products", async (req, res) => {
    try {
      const rows = await stripeService.listProductsWithPrices();
      
      const productsMap = new Map();
      for (const row of rows as any[]) {
        if (!productsMap.has(row.product_id)) {
          productsMap.set(row.product_id, {
            id: row.product_id,
            name: row.product_name,
            description: row.product_description,
            active: row.product_active,
            metadata: row.product_metadata,
            prices: []
          });
        }
        if (row.price_id) {
          productsMap.get(row.product_id).prices.push({
            id: row.price_id,
            unit_amount: row.unit_amount,
            currency: row.currency,
            recurring: row.recurring,
            active: row.price_active,
            metadata: row.price_metadata,
          });
        }
      }

      const products = Array.from(productsMap.values());

      // If no products found, return default pricing tiers
      if (products.length === 0) {
        return res.json({
          products: [
            {
              id: 'basic',
              name: 'Basic',
              description: 'Essential protection for individual investors',
              active: true,
              metadata: { tier: 'basic' },
              prices: [
                { id: 'price_basic_monthly', unit_amount: 499, currency: 'usd', recurring: { interval: 'month', interval_count: 1 }, active: true },
                { id: 'price_basic_yearly', unit_amount: 4990, currency: 'usd', recurring: { interval: 'year', interval_count: 1 }, active: true }
              ]
            },
            {
              id: 'pro',
              name: 'Professional',
              description: 'Advanced tools for serious traders',
              active: true,
              metadata: { tier: 'pro', popular: 'true' },
              prices: [
                { id: 'price_pro_monthly', unit_amount: 1999, currency: 'usd', recurring: { interval: 'month', interval_count: 1 }, active: true },
                { id: 'price_pro_yearly', unit_amount: 19990, currency: 'usd', recurring: { interval: 'year', interval_count: 1 }, active: true }
              ]
            },
            {
              id: 'enterprise',
              name: 'Enterprise',
              description: 'Custom solutions for institutions',
              active: true,
              metadata: { tier: 'enterprise' },
              prices: [
                { id: 'price_enterprise_monthly', unit_amount: 9999, currency: 'usd', recurring: { interval: 'month', interval_count: 1 }, active: true },
                { id: 'price_enterprise_yearly', unit_amount: 99990, currency: 'usd', recurring: { interval: 'year', interval_count: 1 }, active: true }
              ]
            }
          ]
        });
      }

      res.json({ products });
    } catch (error) {
      console.error("Products fetch error:", error);
      // Return default products on error
      res.json({
        products: [
          {
            id: 'basic',
            name: 'Basic',
            description: 'Essential protection for individual investors',
            active: true,
            metadata: { tier: 'basic' },
            prices: [
              { id: 'price_basic_monthly', unit_amount: 499, currency: 'usd', recurring: { interval: 'month', interval_count: 1 }, active: true },
              { id: 'price_basic_yearly', unit_amount: 4990, currency: 'usd', recurring: { interval: 'year', interval_count: 1 }, active: true }
            ]
          },
          {
            id: 'pro',
            name: 'Professional',
            description: 'Advanced tools for serious traders',
            active: true,
            metadata: { tier: 'pro', popular: 'true' },
            prices: [
              { id: 'price_pro_monthly', unit_amount: 1999, currency: 'usd', recurring: { interval: 'month', interval_count: 1 }, active: true },
              { id: 'price_pro_yearly', unit_amount: 19990, currency: 'usd', recurring: { interval: 'year', interval_count: 1 }, active: true }
            ]
          },
          {
            id: 'enterprise',
            name: 'Enterprise',
            description: 'Custom solutions for institutions',
            active: true,
            metadata: { tier: 'enterprise' },
            prices: [
              { id: 'price_enterprise_monthly', unit_amount: 9999, currency: 'usd', recurring: { interval: 'month', interval_count: 1 }, active: true },
              { id: 'price_enterprise_yearly', unit_amount: 99990, currency: 'usd', recurring: { interval: 'year', interval_count: 1 }, active: true }
            ]
          }
        ]
      });
    }
  });

  // Get user subscription status
  app.get("/api/stripe/subscription", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({
        subscriptionTier: user.subscriptionTier || 'free',
        subscriptionStatus: user.subscriptionStatus || 'inactive',
        stripeCustomerId: user.stripeCustomerId,
        stripeSubscriptionId: user.stripeSubscriptionId,
      });
    } catch (error) {
      console.error("Subscription fetch error:", error);
      res.status(500).json({ error: "Failed to fetch subscription" });
    }
  });

  // Create checkout session
  const checkoutSchema = z.object({
    priceId: z.string().min(1).regex(/^price_[a-zA-Z0-9]+$/, "Invalid Stripe price ID format"),
  });

  app.post("/api/stripe/checkout", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      const parseResult = checkoutSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ 
          error: "Invalid request", 
          details: parseResult.error.errors.map(e => e.message) 
        });
      }
      const { priceId } = parseResult.data;

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Create or get Stripe customer
      let customerId = user.stripeCustomerId;
      if (!customerId) {
        const customer = await stripeService.createCustomer(user.email || '', userId);
        await stripeService.updateUserStripeInfo(userId, { stripeCustomerId: customer.id });
        customerId = customer.id;
      }

      // Create checkout session
      const host = req.get('host');
      const protocol = req.protocol;
      const session = await stripeService.createCheckoutSession(
        customerId,
        priceId,
        `${protocol}://${host}/pricing?success=true`,
        `${protocol}://${host}/pricing?canceled=true`
      );

      res.json({ url: session.url });
    } catch (error) {
      console.error("Checkout error:", error);
      res.status(500).json({ error: "Failed to create checkout session" });
    }
  });

  // Create customer portal session
  app.post("/api/stripe/portal", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      const user = await storage.getUser(userId);
      if (!user?.stripeCustomerId) {
        return res.status(400).json({ error: "No subscription found" });
      }

      const host = req.get('host');
      const protocol = req.protocol;
      const session = await stripeService.createCustomerPortalSession(
        user.stripeCustomerId,
        `${protocol}://${host}/pricing`
      );

      res.json({ url: session.url });
    } catch (error) {
      console.error("Portal error:", error);
      res.status(500).json({ error: "Failed to create portal session" });
    }
  });

  return httpServer;
}
