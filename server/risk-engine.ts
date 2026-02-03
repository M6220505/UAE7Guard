export interface RiskInput {
  walletAddress: string;
  walletAgeDays: number;
  transactionCount: number;
  balanceEth: number;
  threatScore: number;
  blacklistAssociations: number;
  isDirectlyBlacklisted: boolean;
  transactionValue?: number;
  isSmartContract?: boolean;
}

export interface RiskBreakdown {
  ageComponent: number;
  activityComponent: number;
  valueComponent: number;
  patternComponent: number;
  threatComponent: number;
}

export interface RiskOutput {
  riskScore: number;
  riskLevel: "low" | "moderate" | "high" | "critical";
  color: "green" | "yellow" | "orange" | "red";
  recommendation: string;
  recommendationAr: string;
  confidence: number;
  breakdown: RiskBreakdown;
  formula: {
    weights: {
      age: number;
      activity: number;
      value: number;
      pattern: number;
      threat: number;
    };
    calculation: string;
  };
}

const WEIGHTS = {
  AGE: 0.20,
  ACTIVITY: 0.25,
  VALUE: 0.20,
  PATTERN: 0.20,
  THREAT: 0.15,
};

function calculateAgeRisk(walletAgeDays: number): number {
  if (walletAgeDays === 0) return 100;
  if (walletAgeDays < 7) return 80;
  if (walletAgeDays < 30) return 60;
  if (walletAgeDays < 90) return 40;
  if (walletAgeDays < 365) return 20;
  return 0;
}

function calculateActivityRisk(transactionCount: number): number {
  if (transactionCount === 0) return 100;
  if (transactionCount < 5) return 80;
  if (transactionCount < 20) return 50;
  if (transactionCount < 100) return 20;
  return 0;
}

function calculateValueRisk(balanceEth: number): number {
  if (balanceEth === 0) return 80;
  if (balanceEth < 0.01) return 60;
  if (balanceEth < 0.1) return 40;
  if (balanceEth < 1) return 20;
  return 10;
}

function calculatePatternRisk(
  isSmartContract: boolean,
  blacklistAssociations: number,
  isDirectlyBlacklisted: boolean
): number {
  if (isDirectlyBlacklisted) return 100;
  if (blacklistAssociations >= 3) return 90;
  if (blacklistAssociations === 2) return 70;
  if (blacklistAssociations === 1) return 50;
  if (isSmartContract) return 40;
  return 30;
}

export function calculateEnhancedRisk(input: RiskInput): RiskOutput {
  const {
    walletAgeDays,
    transactionCount,
    balanceEth,
    threatScore,
    blacklistAssociations,
    isDirectlyBlacklisted,
    isSmartContract = false,
  } = input;

  const ageRisk = calculateAgeRisk(walletAgeDays);
  const activityRisk = calculateActivityRisk(transactionCount);
  const valueRisk = calculateValueRisk(balanceEth);
  const patternRisk = calculatePatternRisk(isSmartContract, blacklistAssociations, isDirectlyBlacklisted);
  const threatRisk = threatScore * 100;

  const ageComponent = WEIGHTS.AGE * ageRisk;
  const activityComponent = WEIGHTS.ACTIVITY * activityRisk;
  const valueComponent = WEIGHTS.VALUE * valueRisk;
  const patternComponent = WEIGHTS.PATTERN * patternRisk;
  const threatComponent = WEIGHTS.THREAT * threatRisk;

  const rawScore = ageComponent + activityComponent + valueComponent + patternComponent + threatComponent;
  const riskScore = Math.min(Math.max(Math.round(rawScore), 0), 100);

  let riskLevel: "low" | "moderate" | "high" | "critical";
  let color: "green" | "yellow" | "orange" | "red";
  let recommendation: string;
  let recommendationAr: string;

  if (riskScore <= 25) {
    riskLevel = "low";
    color = "green";
    recommendation = "LOW RISK - Proceed with standard protocols. Wallet shows healthy activity patterns.";
    recommendationAr = "مخاطر منخفضة - يمكنك المتابعة بالإجراءات العادية. المحفظة تظهر أنماط نشاط سليمة.";
  } else if (riskScore <= 50) {
    riskLevel = "moderate";
    color = "yellow";
    recommendation = "MODERATE RISK - Enhanced due diligence recommended before proceeding.";
    recommendationAr = "مخاطر متوسطة - ننصح بإجراء فحص إضافي قبل المتابعة.";
  } else if (riskScore <= 75) {
    riskLevel = "high";
    color = "orange";
    recommendation = "HIGH RISK - Additional verification required. Exercise caution.";
    recommendationAr = "مخاطر عالية - يتطلب تحقق إضافي. كن حذراً.";
  } else {
    riskLevel = "critical";
    color = "red";
    recommendation = "CRITICAL RISK - Transaction not recommended without thorough investigation.";
    recommendationAr = "مخاطر حرجة - لا ننصح بالمعاملة بدون تحقيق شامل.";
  }

  const confidence = Math.min(
    95,
    50 + (walletAgeDays > 0 ? 15 : 0) + (transactionCount > 0 ? 15 : 0) + (balanceEth > 0 ? 10 : 0) + 5
  );

  const calculationString = `(${ageRisk}×0.20) + (${activityRisk}×0.25) + (${valueRisk}×0.20) + (${patternRisk}×0.20) + (${Math.round(threatRisk)}×0.15) = ${riskScore}`;

  return {
    riskScore,
    riskLevel,
    color,
    recommendation,
    recommendationAr,
    confidence: Math.round(confidence),
    breakdown: {
      ageComponent: Math.round(ageComponent * 100) / 100,
      activityComponent: Math.round(activityComponent * 100) / 100,
      valueComponent: Math.round(valueComponent * 100) / 100,
      patternComponent: Math.round(patternComponent * 100) / 100,
      threatComponent: Math.round(threatComponent * 100) / 100,
    },
    formula: {
      weights: {
        age: WEIGHTS.AGE,
        activity: WEIGHTS.ACTIVITY,
        value: WEIGHTS.VALUE,
        pattern: WEIGHTS.PATTERN,
        threat: WEIGHTS.THREAT,
      },
      calculation: calculationString,
    },
  };
}

export function calculateMillionDirhamRisk(input: RiskInput): RiskOutput {
  return calculateEnhancedRisk(input);
}

export function getRiskColor(riskLevel: string): string {
  switch (riskLevel) {
    case "critical":
      return "#ef4444";
    case "high":
      return "#f97316";
    case "moderate":
      return "#eab308";
    case "low":
      return "#22c55e";
    default:
      return "#6b7280";
  }
}

export function getRiskLevelFromScore(score: number): "low" | "moderate" | "high" | "critical" {
  if (score <= 25) return "low";
  if (score <= 50) return "moderate";
  if (score <= 75) return "high";
  return "critical";
}
