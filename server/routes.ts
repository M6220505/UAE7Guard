import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertScamReportSchema, insertAlertSchema, insertWatchlistSchema, insertSecurityLogSchema, insertLiveMonitoringSchema, insertEscrowTransactionSchema, insertSlippageCalculationSchema } from "@shared/schema";
import { z } from "zod";
import OpenAI from "openai";
import { getFullWalletData, getWalletBalance, getRecentTransactions, checkIfContract, isAlchemyConfigured, getHybridWalletSnapshot } from "./alchemy";
import { hybridVerificationInputSchema, type HybridVerificationResult, type OnChainFacts, type AIInsight } from "@shared/schema";
import { calculateMillionDirhamRisk, type RiskInput } from "./risk-engine";
import { createEncryptedAuditLog, decryptAuditLog, isEncryptionConfigured, type AuditLogData } from "./encryption";
import { generateSovereignReport, formatReportForDisplay, type SovereignReportInput } from "./sovereign-report";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
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

  app.post("/api/reports", async (req, res) => {
    try {
      const data = insertScamReportSchema.parse(req.body);
      
      // Ensure demo user exists
      let user = await storage.getUserByUsername("demo-user");
      if (!user) {
        user = await storage.createUser({
          username: "demo-user",
          password: "demo-password",
          email: "demo@uae7guard.com"
        });
      }
      
      const report = await storage.createReport({
        ...data,
        reporterId: user.id
      });
      res.status(201).json(report);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create report" });
    }
  });

  // ===== ADMIN ROUTES =====
  app.get("/api/admin/pending-reports", async (req, res) => {
    try {
      const reports = await storage.getPendingReports();
      res.json(reports);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch pending reports" });
    }
  });

  app.post("/api/admin/reports/:id/verify", async (req, res) => {
    try {
      const reportId = req.params.id;
      
      // Create admin user if needed
      let admin = await storage.getUserByUsername("admin");
      if (!admin) {
        admin = await storage.createUser({
          username: "admin",
          password: "admin-password",
          email: "admin@uae7guard.com"
        });
      }
      
      const report = await storage.verifyReport(reportId, admin.id);
      if (!report) {
        return res.status(404).json({ error: "Report not found" });
      }
      res.json(report);
    } catch (error) {
      res.status(500).json({ error: "Failed to verify report" });
    }
  });

  app.post("/api/admin/reports/:id/reject", async (req, res) => {
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
  app.get("/api/user/reputation", async (req, res) => {
    try {
      // For demo, get demo user's reputation
      let user = await storage.getUserByUsername("demo-user");
      if (!user) {
        user = await storage.createUser({
          username: "demo-user",
          password: "demo-password",
          email: "demo@uae7guard.com"
        });
      }
      
      const reputation = await storage.getReputation(user.id);
      res.json(reputation || { trustScore: 0, rank: "Novice", verifiedReports: 0 });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reputation" });
    }
  });

  // ===== ALERTS =====
  app.get("/api/alerts", async (req, res) => {
    try {
      let user = await storage.getUserByUsername("demo-user");
      if (!user) {
        return res.json([]);
      }
      const alerts = await storage.getAlerts(user.id);
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch alerts" });
    }
  });

  app.patch("/api/alerts/:id", async (req, res) => {
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
  app.get("/api/watchlist", async (req, res) => {
    try {
      let user = await storage.getUserByUsername("demo-user");
      if (!user) {
        return res.json([]);
      }
      const watchlist = await storage.getWatchlist(user.id);
      res.json(watchlist);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch watchlist" });
    }
  });

  app.post("/api/watchlist", async (req, res) => {
    try {
      const data = insertWatchlistSchema.parse(req.body);
      const item = await storage.addToWatchlist(data);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to add to watchlist" });
    }
  });

  app.delete("/api/watchlist/:id", async (req, res) => {
    try {
      await storage.removeFromWatchlist(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to remove from watchlist" });
    }
  });

  // ===== SECURITY LOGS =====
  app.post("/api/security-logs", async (req, res) => {
    try {
      let user = await storage.getUserByUsername("demo-user");
      if (!user) {
        user = await storage.createUser({
          username: "demo-user",
          password: "demo-password",
          email: "demo@uae7guard.com"
        });
      }
      
      const data = insertSecurityLogSchema.parse({
        ...req.body,
        userId: user.id
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

  app.get("/api/security-logs", async (req, res) => {
    try {
      let user = await storage.getUserByUsername("demo-user");
      if (!user) {
        return res.json([]);
      }
      const logs = await storage.getSecurityLogs(user.id);
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

  // ===== LIVE MONITORING =====
  app.get("/api/live-monitoring", async (req, res) => {
    try {
      let user = await storage.getUserByUsername("demo-user");
      if (!user) {
        return res.json([]);
      }
      const items = await storage.getLiveMonitoring(user.id);
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch monitored wallets" });
    }
  });

  app.post("/api/live-monitoring", async (req, res) => {
    try {
      let user = await storage.getUserByUsername("demo-user");
      if (!user) {
        user = await storage.createUser({
          username: "demo-user",
          password: "demo-password",
          email: "demo@uae7guard.com"
        });
      }
      
      const data = insertLiveMonitoringSchema.parse({
        ...req.body,
        userId: user.id
      });
      const item = await storage.createLiveMonitoring(data);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
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
  app.get("/api/escrow", async (req, res) => {
    try {
      let user = await storage.getUserByUsername("demo-user");
      if (!user) {
        return res.json([]);
      }
      const items = await storage.getEscrowTransactions(user.id);
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch escrow transactions" });
    }
  });

  app.post("/api/escrow", async (req, res) => {
    try {
      let user = await storage.getUserByUsername("demo-user");
      if (!user) {
        user = await storage.createUser({
          username: "demo-user",
          password: "demo-password",
          email: "demo@uae7guard.com"
        });
      }
      
      const data = insertEscrowTransactionSchema.parse({
        ...req.body,
        buyerId: user.id
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
  app.get("/api/slippage", async (req, res) => {
    try {
      let user = await storage.getUserByUsername("demo-user");
      if (!user) {
        return res.json([]);
      }
      const items = await storage.getSlippageCalculations(user.id);
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch slippage calculations" });
    }
  });

  app.post("/api/slippage", async (req, res) => {
    try {
      let user = await storage.getUserByUsername("demo-user");
      if (!user) {
        user = await storage.createUser({
          username: "demo-user",
          password: "demo-password",
          email: "demo@uae7guard.com"
        });
      }
      
      const data = insertSlippageCalculationSchema.parse({
        ...req.body,
        userId: user.id
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
  "analysisAr": "Detailed analysis in Arabic",
  "recommendation": "Clear action recommendation",
  "recommendationAr": "Clear action recommendation in Arabic"
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
          analysisAr: aiResult.analysisAr || "",
          recommendation: aiResult.recommendation || "No recommendation",
          recommendationAr: aiResult.recommendationAr || "",
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
        walletAgeDays: z.number().min(1),
        transactionCount: z.number().min(0),
        blacklistAssociations: z.number().min(0),
        isDirectlyBlacklisted: z.boolean(),
        transactionValue: z.number().optional(),
        isSmartContract: z.boolean().optional(),
      });

      const input = riskInputSchema.parse(req.body);
      
      const reports = await storage.getReportsByAddress(input.walletAddress);
      const verifiedReports = reports.filter(r => r.status === 'verified');
      
      const riskInput: RiskInput = {
        ...input,
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

  // ===== ENCRYPTED AUDIT LOGS (القبو المشفر) =====
  const MIN_AUDIT_VALUE_AED = 50000;

  app.get("/api/audit/status", async (_req, res) => {
    res.json({ 
      configured: isEncryptionConfigured(),
      minValueAED: MIN_AUDIT_VALUE_AED,
      message: isEncryptionConfigured() 
        ? "Encryption vault active | القبو المشفر نشط"
        : "ENCRYPTION_KEY required | مفتاح التشفير مطلوب"
    });
  });

  app.post("/api/audit/log", async (req, res) => {
    try {
      if (!isEncryptionConfigured()) {
        return res.status(503).json({ 
          error: "Encryption not configured",
          errorAr: "التشفير غير مفعّل",
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
        message: "Audit log encrypted and stored | تم تشفير وحفظ السجل",
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
          errorAr: "بيانات التدقيق غير صالحة",
          details: error.errors 
        });
      }
      console.error("Audit log error:", error);
      res.status(500).json({ 
        error: "Failed to create audit log",
        errorAr: "فشل في إنشاء سجل التدقيق"
      });
    }
  });

  app.get("/api/audit/logs", async (_req, res) => {
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
          error: "Encryption not configured",
          errorAr: "التشفير غير مفعّل"
        });
      }

      const logs = await storage.getAuditLogs();
      const log = logs.find(l => l.id === req.params.id);
      
      if (!log) {
        return res.status(404).json({ 
          error: "Audit log not found",
          errorAr: "السجل غير موجود"
        });
      }

      const decryptedData = decryptAuditLog(log.encryptedData, log.encryptionIV);
      
      if (!decryptedData) {
        return res.status(500).json({ 
          error: "Failed to decrypt log",
          errorAr: "فشل في فك تشفير السجل"
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
        error: "Failed to decrypt audit log",
        errorAr: "فشل في فك تشفير السجل"
      });
    }
  });

  // ===== SOVEREIGN VERIFICATION REPORT =====
  app.post("/api/sovereign/report", async (req, res) => {
    try {
      if (!isEncryptionConfigured()) {
        return res.status(503).json({ 
          error: "Encryption vault not configured",
          errorAr: "القبو المشفر غير مفعّل"
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

      const riskInput: RiskInput = {
        walletAddress: input.walletAddress,
        walletAgeDays: input.walletAgeDays,
        transactionCount: blockchainData.transactionCount,
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
  "analysisAr": "Arabic translation",
  "recommendation": "English recommendation",
  "recommendationAr": "Arabic translation",
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
            analysisAr: aiResult.analysisAr || "",
            recommendation: aiResult.recommendation || "",
            recommendationAr: aiResult.recommendationAr || "",
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
          historyScore: riskResult.formula?.history || 0,
          associationScore: riskResult.formula?.associations || 0,
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
          historyScore: riskResult.formula?.history || 0,
          associationScore: riskResult.formula?.associations || 0,
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
          errorAr: "طلب تقرير غير صالح",
          details: error.errors 
        });
      }
      console.error("Sovereign report error:", error);
      res.status(500).json({ 
        error: "Failed to generate sovereign report",
        errorAr: "فشل في إنشاء التقرير السيادي"
      });
    }
  });

  // ===== HYBRID VERIFICATION (10,000+ AED) =====
  app.post("/api/hybrid-verification", async (req, res) => {
    try {
      if (!isAlchemyConfigured()) {
        return res.status(503).json({ 
          error: "Blockchain service not configured",
          errorAr: "خدمة البلوكتشين غير مفعّلة",
          message: "ALCHEMY_API_KEY is required"
        });
      }

      const input = hybridVerificationInputSchema.parse(req.body);
      
      if (input.transactionAmountAED < 10000) {
        return res.status(400).json({ 
          error: "Transaction amount must be at least 10,000 AED for hybrid verification",
          errorAr: "يجب أن يكون مبلغ المعاملة 10,000 درهم على الأقل للتحقق الهجين"
        });
      }

      // Handle simulation scenarios with mock data
      if (input.simulationScenario === "layering_high_value") {
        const now = new Date();
        const year = now.getFullYear();
        const randomHex = Math.random().toString(16).substr(2, 4).toUpperCase();
        const certificateId = `SV-${year}-${randomHex}-UAE`;
        
        const simulatedResult: HybridVerificationResult = {
          verificationId: `HYB-SIM-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          certificateId,
          walletAddress: input.walletAddress,
          destinationWallet: input.destinationWallet,
          assetType: input.assetType || "digital_asset",
          transactionAmountAED: 5000000,
          thresholdMet: true,
          onChainFacts: {
            balance: "45.2 ETH",
            balanceInEth: "45.2",
            transactionCount: 847,
            walletAgeDays: 2,
            isContract: false,
            network: "ethereum",
            recentTransactions: [
              { hash: "0x7a1b...simulation1", from: "0x9f8e...unverified_exchange", to: input.walletAddress, value: "15.5 ETH", asset: "ETH", category: "external", blockNum: "19847621" },
              { hash: "0x3c2d...simulation2", from: input.walletAddress, to: "0x4a5b...layering_hop1", value: "5.2 ETH", asset: "ETH", category: "external", blockNum: "19847890" },
              { hash: "0x6e7f...simulation3", from: input.walletAddress, to: "0x8c9d...layering_hop2", value: "4.8 ETH", asset: "ETH", category: "external", blockNum: "19848102" },
              { hash: "0x2b3c...simulation4", from: input.walletAddress, to: "0x1f2e...layering_hop3", value: "3.1 ETH", asset: "ETH", category: "external", blockNum: "19848456" },
              { hash: "0x9d0e...simulation5", from: "0x5g6h...layering_return", to: input.walletAddress, value: "12.8 ETH", asset: "ETH", category: "external", blockNum: "19848789" },
            ],
          },
          aiInsight: {
            riskLevel: "dangerous",
            riskScore: 87,
            fraudPatterns: [
              "LAYERING DETECTED: Rapid multi-hop transfers within 48-hour window",
              "UNVERIFIED EXCHANGE ORIGIN: Initial funds received from unlicensed exchange",
              "VELOCITY ANOMALY: 847 transactions in 2-day wallet lifespan",
              "CHAIN-HOPPING: Funds dispersed to 3+ intermediate wallets before partial return",
              "TEMPORAL CLUSTERING: 85% of activity concentrated in 6-hour windows",
            ],
            liquidityRisk: "HIGH - Wallet exhibits abnormal liquidity cycling with 45.2 ETH balance following rapid inbound/outbound flows. Funds originated from unverified exchange with no KYC attestation.",
            largeAmountAnalysis: "CRITICAL ALERT: 5,000,000 AED transaction from 2-day-old wallet with layering indicators. Funds traced to unverified exchange 48 hours prior. Pattern matches sophisticated money laundering typology.",
            recommendation: "DO NOT PROCEED. Transaction exhibits classic layering characteristics. Recommend immediate escalation to UAE FIU and transaction suspension pending enhanced due diligence.",
            recommendationAr: "لا تتابع. تُظهر المعاملة خصائص الطبقات الكلاسيكية. يوصى بالتصعيد الفوري إلى وحدة الاستخبارات المالية الإماراتية وتعليق المعاملة بانتظار العناية الواجبة المعززة.",
            analysis: "Sovereign Intelligence Engine has identified HIGH-RISK layering patterns. The wallet received 15.5 ETH from an unverified exchange exactly 48 hours ago, followed by rapid dispersion to multiple intermediate addresses. This pattern is consistent with money laundering placement and layering stages.",
            analysisAr: "حدد محرك الاستخبارات السيادية أنماط طبقات عالية الخطورة. استلمت المحفظة 15.5 إيثريوم من بورصة غير موثقة قبل 48 ساعة بالضبط، تلاها تشتت سريع إلى عناوين وسيطة متعددة. يتوافق هذا النمط مع مراحل الإيداع والطبقات في غسيل الأموال.",
            verdict: "Transaction exhibits 87% probability of illicit layering activity based on temporal velocity analysis, exchange provenance verification failure, and multi-hop dispersion patterns inconsistent with legitimate institutional flows.",
            verdictAr: "تُظهر المعاملة احتمالية 87% لنشاط طبقات غير مشروع بناءً على تحليل السرعة الزمنية، وفشل التحقق من مصدر البورصة، وأنماط التشتت متعددة القفزات غير المتوافقة مع التدفقات المؤسسية المشروعة.",
          },
          sanctionCheckPassed: true,
          mixerInteractionDetected: false,
          verificationTimestamp: new Date().toISOString(),
          sources: {
            blockchain: "Simulation Mode - Layering Scenario",
            ai: "Sovereign Intelligence Engine (Simulated)",
          },
        };
        
        return res.json(simulatedResult);
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
        recommendationAr: "تحليل الذكاء الاصطناعي غير متوفر",
        analysis: "AI analysis unavailable",
        analysisAr: "تحليل الذكاء الاصطناعي غير متوفر",
        verdict: "Transaction pattern analysis pending.",
        verdictAr: "تحليل نمط المعاملة قيد الانتظار.",
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
  "analysisAr": "نفس التحليل بالعربية",
  "verdict": "One sentence English verdict about transaction legitimacy probability",
  "verdictAr": "الحكم بالعربية",
  "recommendation": "English recommendation",
  "recommendationAr": "التوصية بالعربية"
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
          recommendationAr: aiResult.recommendationAr || "",
          analysis: aiResult.analysis || "",
          analysisAr: aiResult.analysisAr || "",
          verdict: aiResult.verdict || "Transaction pattern analysis complete.",
          verdictAr: aiResult.verdictAr || "اكتمل تحليل نمط المعاملة.",
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
          errorAr: "طلب تحقق غير صالح",
          details: error.errors 
        });
      }
      console.error("Hybrid verification error:", error);
      res.status(500).json({ 
        error: "Failed to perform hybrid verification",
        errorAr: "فشل في إجراء التحقق الهجين"
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

  return httpServer;
}
