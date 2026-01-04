export interface RiskInput {
  walletAddress: string;
  walletAgeDays: number;
  transactionCount: number;
  blacklistAssociations: number;
  isDirectlyBlacklisted: boolean;
  transactionValue?: number;
  isSmartContract?: boolean;
}

export interface RiskOutput {
  riskScore: number;
  riskLevel: "safe" | "suspicious" | "danger";
  historyScore: number;
  associationScore: number;
  walletAgeFactor: number;
  formula: {
    history: number;
    associations: number;
    walletAge: number;
    calculation: string;
  };
  recommendation: string;
  confidence: number;
}

export function calculateMillionDirhamRisk(input: RiskInput): RiskOutput {
  const {
    walletAgeDays,
    transactionCount,
    blacklistAssociations,
    isDirectlyBlacklisted,
    transactionValue = 500000,
    isSmartContract = false,
  } = input;

  let historyScore = 0;
  if (transactionCount < 5) historyScore = 100;
  else if (transactionCount < 20) historyScore = 70;
  else if (transactionCount < 50) historyScore = 40;
  else if (transactionCount < 100) historyScore = 20;
  else historyScore = 10;

  if (walletAgeDays < 30) historyScore += 30;
  else if (walletAgeDays < 90) historyScore += 15;
  else if (walletAgeDays < 180) historyScore += 5;

  historyScore = Math.min(historyScore, 100);

  let associationScore = 0;
  if (isDirectlyBlacklisted) {
    associationScore = 100;
  } else if (blacklistAssociations >= 3) {
    associationScore = 90;
  } else if (blacklistAssociations === 2) {
    associationScore = 70;
  } else if (blacklistAssociations === 1) {
    associationScore = 40;
  } else {
    associationScore = 0;
  }

  if (isSmartContract && blacklistAssociations > 0) {
    associationScore = Math.min(associationScore + 20, 100);
  }

  const walletAgeFactor = Math.sqrt(Math.max(walletAgeDays, 1));

  const historyComponent = historyScore * 0.4;
  const associationComponent = (associationScore * 0.6) / walletAgeFactor;
  const rawScore = historyComponent + associationComponent;
  const riskScore = Math.min(Math.max(Math.round(rawScore), 0), 100);

  let riskLevel: "safe" | "suspicious" | "danger";
  let recommendation: string;

  if (riskScore >= 70) {
    riskLevel = "danger";
    recommendation = "HIGH RISK - Do not proceed with this transaction. Multiple risk indicators detected.";
  } else if (riskScore >= 40) {
    riskLevel = "suspicious";
    recommendation = "CAUTION - Additional verification recommended before proceeding.";
  } else {
    riskLevel = "safe";
    recommendation = "LOW RISK - Transaction appears safe based on available data.";
  }

  const confidence = Math.min(90, 50 + (walletAgeDays / 10) + (transactionCount / 5));

  const calculationString = `(${historyScore} × 0.4) + (${associationScore} × 0.6) / √${walletAgeDays} = ${riskScore}`;

  return {
    riskScore,
    riskLevel,
    historyScore,
    associationScore,
    walletAgeFactor: Math.round(walletAgeFactor * 100) / 100,
    formula: {
      history: historyScore,
      associations: associationScore,
      walletAge: walletAgeDays,
      calculation: calculationString,
    },
    recommendation,
    confidence: Math.round(confidence),
  };
}

export function getRiskColor(riskLevel: string): string {
  switch (riskLevel) {
    case "danger":
      return "#ef4444";
    case "suspicious":
      return "#f59e0b";
    case "safe":
      return "#22c55e";
    default:
      return "#6b7280";
  }
}
