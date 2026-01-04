import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertScamReportSchema, insertAlertSchema, insertWatchlistSchema, insertSecurityLogSchema, insertLiveMonitoringSchema, insertEscrowTransactionSchema, insertSlippageCalculationSchema } from "@shared/schema";
import { z } from "zod";
import OpenAI from "openai";

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

  return httpServer;
}
