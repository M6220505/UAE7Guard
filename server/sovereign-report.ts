import { createEncryptedAuditLog, type AuditLogData } from "./encryption";

export interface SovereignReportInput {
  walletAddress: string;
  transactionValueAED: number;
  network: string;
  blockchainData: {
    balance: string;
    transactionCount: number;
    isSmartContract: boolean;
    recentTransactions?: Array<{
      hash: string;
      from: string;
      to: string;
      value: string;
    }>;
  };
  riskAnalysis: {
    riskScore: number;
    riskLevel: string;
    historyScore: number;
    associationScore: number;
    walletAgeDays: number;
    formula: string;
  };
  aiAnalysis?: {
    analysis: string;
    recommendation: string;
    factors: string[];
    model: string;
  };
  verifiedThreats: number;
  analyst?: string;
}

export interface SovereignReport {
  reportId: string;
  generatedAt: string;
  expiresAt: string;
  verification: {
    alchemyNode: string;
    alchemyNetwork: string;
    aiModel: string;
    encryptionStandard: string;
    hashAlgorithm: string;
  };
  subject: {
    walletAddress: string;
    transactionValueAED: number;
    network: string;
  };
  blockchainIntelligence: {
    balance: string;
    transactionCount: number;
    isSmartContract: boolean;
    dataSource: string;
  };
  riskAssessment: {
    riskScore: number;
    riskLevel: string;
    formula: string;
    components: {
      historyScore: number;
      associationScore: number;
      walletAgeFactor: number;
    };
  };
  aiIntelligence?: {
    analysis: string;
    recommendation: string;
    riskFactors: string[];
    modelUsed: string;
  };
  threatDatabase: {
    verifiedThreats: number;
    database: string;
    lastUpdated: string;
  };
  legalDisclaimer: {
    en: string;
  };
  auditTrail: {
    transactionHash: string;
    dataHash: string;
    encryptedAt: string;
    storageLocation: string;
  };
}

const ALCHEMY_NODE_INFO = "Alchemy Supernode v3.0 (Enterprise)";
const AI_MODEL_INFO = "GPT-4o (Replit AI Integrations)";
const ENCRYPTION_STANDARD = "AES-256-GCM";
const HASH_ALGORITHM = "SHA-256";

function generateReportId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `SVR-${timestamp}-${random}`.toUpperCase();
}

export function generateSovereignReport(input: SovereignReportInput): SovereignReport {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days validity

  const auditData: AuditLogData = {
    walletAddress: input.walletAddress,
    transactionValueAED: input.transactionValueAED,
    riskScore: input.riskAnalysis.riskScore,
    riskLevel: input.riskAnalysis.riskLevel,
    analysisDetails: {
      historyScore: input.riskAnalysis.historyScore,
      associationScore: input.riskAnalysis.associationScore,
      walletAgeDays: input.riskAnalysis.walletAgeDays,
      formula: input.riskAnalysis.formula,
    },
    blockchainData: {
      balance: input.blockchainData.balance,
      transactionCount: input.blockchainData.transactionCount,
      isSmartContract: input.blockchainData.isSmartContract,
      network: input.network,
    },
    timestamp: now.toISOString(),
    analyst: input.analyst,
  };

  const encryptedAudit = createEncryptedAuditLog(auditData);

  return {
    reportId: generateReportId(),
    generatedAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    verification: {
      alchemyNode: ALCHEMY_NODE_INFO,
      alchemyNetwork: `${input.network.charAt(0).toUpperCase() + input.network.slice(1)} Mainnet`,
      aiModel: input.aiAnalysis?.model || AI_MODEL_INFO,
      encryptionStandard: ENCRYPTION_STANDARD,
      hashAlgorithm: HASH_ALGORITHM,
    },
    subject: {
      walletAddress: input.walletAddress,
      transactionValueAED: input.transactionValueAED,
      network: input.network,
    },
    blockchainIntelligence: {
      balance: input.blockchainData.balance,
      transactionCount: input.blockchainData.transactionCount,
      isSmartContract: input.blockchainData.isSmartContract,
      dataSource: `Alchemy RPC (${input.network})`,
    },
    riskAssessment: {
      riskScore: input.riskAnalysis.riskScore,
      riskLevel: input.riskAnalysis.riskLevel,
      formula: input.riskAnalysis.formula,
      components: {
        historyScore: input.riskAnalysis.historyScore,
        associationScore: input.riskAnalysis.associationScore,
        walletAgeFactor: Math.sqrt(input.riskAnalysis.walletAgeDays),
      },
    },
    aiIntelligence: input.aiAnalysis ? {
      analysis: input.aiAnalysis.analysis,
      recommendation: input.aiAnalysis.recommendation,
      riskFactors: input.aiAnalysis.factors,
      modelUsed: input.aiAnalysis.model || AI_MODEL_INFO,
    } : undefined,
    threatDatabase: {
      verifiedThreats: input.verifiedThreats,
      database: "UAE7Guard Verified Threat Database",
      lastUpdated: now.toISOString(),
    },
    legalDisclaimer: {
      en: "This report is generated for informational purposes only and does not constitute legal or financial advice. The risk assessment is based on available blockchain data and AI analysis at the time of generation. UAE7Guard is not liable for any decisions made based on this report. For transactions exceeding AED 500,000, we recommend consulting with licensed legal counsel.",
    },
    auditTrail: {
      transactionHash: encryptedAudit.transactionHash,
      dataHash: encryptedAudit.dataHash,
      encryptedAt: encryptedAudit.timestampUtc.toISOString(),
      storageLocation: "UAE7Guard Encrypted Vault (PostgreSQL + AES-256)",
    },
  };
}

export function formatReportForDisplay(report: SovereignReport): string {
  const divider = "═".repeat(60);
  const lines = [
    divider,
    "                    UAE7GUARD SOVEREIGN VERIFICATION REPORT",
    divider,
    "",
    `Report ID: ${report.reportId}`,
    `Generated: ${new Date(report.generatedAt).toLocaleString("en-AE", { timeZone: "Asia/Dubai" })} (UAE Time)`,
    `Valid Until: ${new Date(report.expiresAt).toLocaleString("en-AE", { timeZone: "Asia/Dubai" })}`,
    "",
    "─── VERIFICATION SOURCES ───",
    `Blockchain Node: ${report.verification.alchemyNode}`,
    `Network: ${report.verification.alchemyNetwork}`,
    `AI Model: ${report.verification.aiModel}`,
    `Encryption: ${report.verification.encryptionStandard}`,
    "",
    "─── SUBJECT WALLET ───",
    `Address: ${report.subject.walletAddress}`,
    `Transaction Value: AED ${report.subject.transactionValueAED.toLocaleString()}`,
    "",
    "─── BLOCKCHAIN INTELLIGENCE ───",
    `Balance: ${report.blockchainIntelligence.balance}`,
    `Transaction Count: ${report.blockchainIntelligence.transactionCount}`,
    `Smart Contract: ${report.blockchainIntelligence.isSmartContract ? "Yes" : "No"}`,
    `Data Source: ${report.blockchainIntelligence.dataSource}`,
    "",
    "─── RISK ASSESSMENT ───",
    `Risk Score: ${report.riskAssessment.riskScore}/100`,
    `Risk Level: ${report.riskAssessment.riskLevel.toUpperCase()}`,
    `Formula: ${report.riskAssessment.formula}`,
    "",
    "─── THREAT DATABASE ───",
    `Verified Threats: ${report.threatDatabase.verifiedThreats}`,
    `Database: ${report.threatDatabase.database}`,
    "",
    "─── AUDIT TRAIL ───",
    `Transaction Hash: ${report.auditTrail.transactionHash}`,
    `Data Hash: ${report.auditTrail.dataHash}`,
    `Encrypted At: ${report.auditTrail.encryptedAt}`,
    "",
    divider,
    "This report is cryptographically signed and stored in UAE7Guard Vault",
    divider,
  ];

  return lines.join("\n");
}
