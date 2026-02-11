"use client"

import React, { useState, useEffect, useCallback } from "react"
import { useI18n } from "@/lib/i18n"
import {
  Brain,
  Search,
  AlertTriangle,
  CheckCircle,
  Activity,
  TrendingUp,
  Shield,
  Zap,
  BarChart3,
  Target,
  Loader2,
  Info,
} from "lucide-react"

// --- Types ---

type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"

interface ScamPattern {
  id: string
  name: string
  severity: Severity
  description: string
  victims: number
  icon: React.ElementType
}

interface MatchedPattern {
  name: string
  severity: Severity
  description: string
  matchScore: number
}

interface AnalysisResult {
  address: string
  riskScore: number
  riskLevel: string
  confidence: number
  matchedPatterns: MatchedPattern[]
  warnings: string[]
  recommendations: string[]
}

interface AnalysisStep {
  label: string
  complete: boolean
  active: boolean
}

// --- Data ---

const KNOWN_SCAM_PATTERNS: ScamPattern[] = [
  {
    id: "ponzi",
    name: "Ponzi Scheme",
    severity: "CRITICAL",
    description:
      "Fraudulent investment operation paying returns from new investors rather than profit.",
    victims: 48200,
    icon: TrendingUp,
  },
  {
    id: "fake-ico",
    name: "Fake ICO",
    severity: "CRITICAL",
    description:
      "Counterfeit initial coin offerings designed to steal investor funds during token sales.",
    victims: 32100,
    icon: Target,
  },
  {
    id: "rug-pull",
    name: "Rug Pull",
    severity: "CRITICAL",
    description:
      "Developers abandon a project and run away with investor funds after inflating token value.",
    victims: 51800,
    icon: AlertTriangle,
  },
  {
    id: "phishing",
    name: "Phishing",
    severity: "HIGH",
    description:
      "Deceptive websites or messages tricking users into revealing private keys or seed phrases.",
    victims: 89400,
    icon: Search,
  },
  {
    id: "pump-dump",
    name: "Pump and Dump",
    severity: "HIGH",
    description:
      "Artificially inflating token price through misleading hype, then selling at the peak.",
    victims: 27600,
    icon: BarChart3,
  },
  {
    id: "fake-exchange",
    name: "Fake Exchange",
    severity: "HIGH",
    description:
      "Fraudulent trading platforms that mimic legitimate exchanges to steal deposits.",
    victims: 18900,
    icon: Shield,
  },
  {
    id: "honeypot",
    name: "Honeypot Token",
    severity: "MEDIUM",
    description:
      "Tokens with hidden smart contract restrictions preventing holders from selling.",
    victims: 34500,
    icon: Zap,
  },
  {
    id: "impersonation",
    name: "Impersonation",
    severity: "MEDIUM",
    description:
      "Scammers posing as well-known crypto figures or projects to gain trust and steal funds.",
    victims: 22300,
    icon: Activity,
  },
  {
    id: "mev-bot",
    name: "MEV Bot",
    severity: "MEDIUM",
    description:
      "Fake MEV bot contracts promising automated profits but draining deposited funds instead.",
    victims: 15700,
    icon: Brain,
  },
  {
    id: "romance",
    name: "Romance / Pig Butchering",
    severity: "LOW",
    description:
      "Long-term social engineering scams building trust before directing victims to fake platforms.",
    victims: 41200,
    icon: Info,
  },
]

// --- Helpers ---

function severityColor(severity: Severity): string {
  switch (severity) {
    case "CRITICAL":
      return "bg-red-500/10 text-red-500 border-red-500/20"
    case "HIGH":
      return "bg-orange-500/10 text-orange-500 border-orange-500/20"
    case "MEDIUM":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
    case "LOW":
      return "bg-blue-500/10 text-blue-500 border-blue-500/20"
  }
}

function severityBadgeColor(severity: Severity): string {
  switch (severity) {
    case "CRITICAL":
      return "bg-red-500/15 text-red-400 border border-red-500/30"
    case "HIGH":
      return "bg-orange-500/15 text-orange-400 border border-orange-500/30"
    case "MEDIUM":
      return "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30"
    case "LOW":
      return "bg-blue-500/15 text-blue-400 border border-blue-500/30"
  }
}

function riskLevelFromScore(score: number): string {
  if (score >= 80) return "CRITICAL"
  if (score >= 60) return "HIGH"
  if (score >= 35) return "MEDIUM"
  return "LOW"
}

function riskColorFromScore(score: number): string {
  if (score >= 80) return "text-red-500"
  if (score >= 60) return "text-orange-500"
  if (score >= 35) return "text-yellow-500"
  return "text-emerald-500"
}

function riskMeterColor(score: number): string {
  if (score >= 80) return "bg-red-500"
  if (score >= 60) return "bg-orange-500"
  if (score >= 35) return "bg-yellow-500"
  return "bg-emerald-500"
}

function simulateAnalysis(address: string): AnalysisResult {
  // Deterministic-ish mock based on address length and characters
  const hash = address.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const riskScore = ((hash * 7 + 23) % 80) + 15 // Range 15-94
  const confidence = Math.min(98, Math.max(72, ((hash * 3) % 27) + 72))
  const riskLevel = riskLevelFromScore(riskScore)

  const patternPool: MatchedPattern[] = [
    {
      name: "Rug Pull",
      severity: "CRITICAL",
      description: "Token liquidity was removed within 48 hours of launch. Contract owner retains mint authority.",
      matchScore: 94,
    },
    {
      name: "Honeypot Token",
      severity: "HIGH",
      description: "Transfer function contains hidden conditions preventing token sale by non-owner addresses.",
      matchScore: 87,
    },
    {
      name: "Pump and Dump",
      severity: "MEDIUM",
      description: "Abnormal volume spike detected followed by coordinated sell-off from connected wallets.",
      matchScore: 73,
    },
    {
      name: "Phishing",
      severity: "HIGH",
      description: "Address has received funds from known phishing campaigns targeting DeFi users.",
      matchScore: 81,
    },
    {
      name: "Ponzi Scheme",
      severity: "CRITICAL",
      description: "Circular fund flow detected: new deposits directly fund older withdrawal requests.",
      matchScore: 91,
    },
  ]

  const numPatterns = Math.max(1, (hash % 4) + 1)
  const startIdx = hash % patternPool.length
  const matchedPatterns: MatchedPattern[] = []
  for (let i = 0; i < numPatterns; i++) {
    matchedPatterns.push(patternPool[(startIdx + i) % patternPool.length])
  }

  const warningPool = [
    "This address has interacted with known blacklisted contracts.",
    "Unusual fund flow patterns detected consistent with layering techniques.",
    "Contract was deployed with no verified source code on block explorers.",
    "High-frequency transactions to mixer protocols observed in the last 30 days.",
    "Multiple small deposits followed by rapid large withdrawals detected.",
    "Address associated with newly deployed unaudited token contract.",
  ]

  const recommendationPool = [
    "Avoid sending any funds to this address until further verification.",
    "Cross-reference this address with ChainAbuse and Etherscan labels before interacting.",
    "Enable transaction monitoring alerts for any wallet that has interacted with this address.",
    "Report this address to relevant authorities if you have been affected.",
    "Revoke any token approvals granted to contracts associated with this address.",
    "Consider using a hardware wallet for all future transactions.",
  ]

  const numWarnings = Math.max(2, (hash % 4) + 2)
  const numRecs = Math.max(2, ((hash + 1) % 4) + 2)
  const warnings = warningPool.slice(0, numWarnings)
  const recommendations = recommendationPool.slice(0, numRecs)

  return {
    address,
    riskScore,
    riskLevel,
    confidence,
    matchedPatterns,
    warnings,
    recommendations,
  }
}

// --- Component ---

export default function AIAnalysisPage() {
  const { t } = useI18n()

  const [address, setAddress] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [currentStep, setCurrentStep] = useState(-1)

  const analysisSteps: AnalysisStep[] = [
    { label: "Fetching on-chain data", complete: currentStep > 0, active: currentStep === 0 },
    { label: "Running pattern detection", complete: currentStep > 1, active: currentStep === 1 },
    { label: "AI risk assessment", complete: currentStep > 2, active: currentStep === 2 },
    { label: "Generating recommendations", complete: currentStep > 3, active: currentStep === 3 },
  ]

  const handleAnalyze = useCallback(() => {
    if (!address.trim() || isAnalyzing) return

    setIsAnalyzing(true)
    setResult(null)
    setCurrentStep(0)

    // Simulate multi-step analysis
    const stepDurations = [1200, 1400, 1800, 1000]
    let elapsed = 0

    stepDurations.forEach((duration, index) => {
      elapsed += duration
      setTimeout(() => {
        setCurrentStep(index + 1)
      }, elapsed)
    })

    const totalDuration = stepDurations.reduce((a, b) => a + b, 0)
    setTimeout(() => {
      setResult(simulateAnalysis(address.trim()))
      setIsAnalyzing(false)
      setCurrentStep(-1)
    }, totalDuration + 400)
  }, [address, isAnalyzing])

  // Handle Enter key in input
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleAnalyze()
      }
    },
    [handleAnalyze]
  )

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t.aiAnalysis.title}</h1>
          <p className="text-muted-foreground">{t.aiAnalysis.subtitle}</p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1.5">
          <Brain className="h-4 w-4 text-purple-500" />
          <span className="text-xs font-medium text-purple-500">{t.aiAnalysis.aiPowered}</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t.aiAnalysis.analyzeAddress}
              disabled={isAnalyzing}
              className="h-10 w-full rounded-lg border border-border bg-background pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/25 disabled:opacity-50"
            />
          </div>
          <button
            onClick={handleAnalyze}
            disabled={!address.trim() || isAnalyzing}
            className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t.aiAnalysis.analyzing}
              </>
            ) : (
              <>
                <Brain className="h-4 w-4" />
                {t.aiAnalysis.analyzeAddress}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis Progress Steps */}
      {isAnalyzing && (
        <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500 animate-pulse" />
            <span className="text-sm font-medium text-purple-400">{t.aiAnalysis.analyzing}</span>
          </div>
          <div className="space-y-3">
            {analysisSteps.map((step, index) => (
              <div
                key={index}
                className="flex items-center gap-3"
                style={{
                  animation: currentStep >= index ? `fadeSlideIn 0.4s ease-out forwards` : "none",
                  opacity: currentStep >= index ? 1 : 0.3,
                }}
              >
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center">
                  {step.complete ? (
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                  ) : step.active ? (
                    <Loader2 className="h-5 w-5 text-purple-500 animate-spin" />
                  ) : (
                    <div className="h-3 w-3 rounded-full border-2 border-muted-foreground/30" />
                  )}
                </div>
                <span
                  className={`text-sm ${
                    step.complete
                      ? "text-emerald-500"
                      : step.active
                      ? "text-purple-400 font-medium"
                      : "text-muted-foreground"
                  }`}
                >
                  Step {index + 1}: {step.label}
                </span>
              </div>
            ))}
          </div>
          {/* Progress bar */}
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-1.5 rounded-full bg-purple-500 transition-all duration-700 ease-out"
              style={{ width: `${Math.min(100, ((currentStep) / 4) * 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Analysis Results */}
      {result && !isAnalyzing && (
        <div className="space-y-6">
          {/* Top Row: Risk Prediction + Risk Meter */}
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Risk Prediction Card */}
            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-500" />
                  {t.aiAnalysis.riskPrediction}
                </h2>
                <span className="text-xs text-muted-foreground font-mono truncate max-w-[180px]">
                  {result.address}
                </span>
              </div>

              <div className="flex items-center gap-6">
                {/* Score */}
                <div className="text-center">
                  <div className={`text-5xl font-bold ${riskColorFromScore(result.riskScore)}`}>
                    {result.riskScore}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">/ 100</div>
                </div>

                {/* Details */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Risk Level</span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${severityBadgeColor(
                        result.riskLevel as Severity
                      )}`}
                    >
                      {result.riskLevel}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t.aiAnalysis.confidence}</span>
                    <span className="text-sm font-medium text-purple-400">{result.confidence}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t.aiAnalysis.matchedPatterns}</span>
                    <span className="text-sm font-medium">{result.matchedPatterns.length} found</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Meter / Gauge */}
            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-500" />
                Risk Meter
              </h2>
              <div className="space-y-3">
                {/* Visual gauge */}
                <div className="relative pt-2">
                  <div className="flex h-4 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${riskMeterColor(
                        result.riskScore
                      )}`}
                      style={{ width: `${result.riskScore}%` }}
                    />
                  </div>
                  {/* Tick marks */}
                  <div className="mt-1 flex justify-between px-0.5">
                    <span className="text-[10px] text-emerald-500">0</span>
                    <span className="text-[10px] text-yellow-500">35</span>
                    <span className="text-[10px] text-orange-500">60</span>
                    <span className="text-[10px] text-red-500">80</span>
                    <span className="text-[10px] text-red-500">100</span>
                  </div>
                </div>
                {/* Risk zones */}
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div
                    className={`rounded-lg p-2 ${
                      result.riskScore < 35 ? "bg-emerald-500/15 ring-1 ring-emerald-500/40" : "bg-muted/50"
                    }`}
                  >
                    <div className="text-xs font-medium text-emerald-500">{t.common.low}</div>
                    <div className="text-[10px] text-muted-foreground">0-34</div>
                  </div>
                  <div
                    className={`rounded-lg p-2 ${
                      result.riskScore >= 35 && result.riskScore < 60
                        ? "bg-yellow-500/15 ring-1 ring-yellow-500/40"
                        : "bg-muted/50"
                    }`}
                  >
                    <div className="text-xs font-medium text-yellow-500">{t.common.medium}</div>
                    <div className="text-[10px] text-muted-foreground">35-59</div>
                  </div>
                  <div
                    className={`rounded-lg p-2 ${
                      result.riskScore >= 60 && result.riskScore < 80
                        ? "bg-orange-500/15 ring-1 ring-orange-500/40"
                        : "bg-muted/50"
                    }`}
                  >
                    <div className="text-xs font-medium text-orange-500">{t.common.high}</div>
                    <div className="text-[10px] text-muted-foreground">60-79</div>
                  </div>
                  <div
                    className={`rounded-lg p-2 ${
                      result.riskScore >= 80 ? "bg-red-500/15 ring-1 ring-red-500/40" : "bg-muted/50"
                    }`}
                  >
                    <div className="text-xs font-medium text-red-500">{t.common.critical}</div>
                    <div className="text-[10px] text-muted-foreground">80-100</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Matched Scam Patterns */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              {t.aiAnalysis.matchedPatterns}
            </h2>
            <div className="space-y-3">
              {result.matchedPatterns.map((pattern, index) => (
                <div
                  key={index}
                  className={`rounded-lg border p-4 ${severityColor(pattern.severity)}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{pattern.name}</span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${severityBadgeColor(
                            pattern.severity
                          )}`}
                        >
                          {pattern.severity}
                        </span>
                      </div>
                      <p className="text-sm opacity-80">{pattern.description}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-lg font-bold">{pattern.matchScore}%</div>
                      <div className="text-[10px] opacity-60">match</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Warnings + Recommendations Row */}
          <div className="grid gap-4 lg:grid-cols-2">
            {/* AI Warnings */}
            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                {t.aiAnalysis.warnings}
              </h2>
              <div className="space-y-2">
                {result.warnings.map((warning, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 rounded-lg bg-yellow-500/5 border border-yellow-500/10 p-3"
                  >
                    <AlertTriangle className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-yellow-200/80">{warning}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                {t.aiAnalysis.recommendations}
              </h2>
              <div className="space-y-2">
                {result.recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10 p-3"
                  >
                    <Shield className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-emerald-200/80">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Historical Data */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-500" />
              {t.aiAnalysis.historicalData}
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg bg-muted/50 p-4 text-center space-y-1">
                <div className="text-2xl font-bold text-red-500">$14B+</div>
                <div className="text-xs text-muted-foreground">Total Documented Scam Losses</div>
              </div>
              <div className="rounded-lg bg-muted/50 p-4 text-center space-y-1">
                <div className="text-2xl font-bold text-orange-500">380K+</div>
                <div className="text-xs text-muted-foreground">Reported Scam Addresses</div>
              </div>
              <div className="rounded-lg bg-muted/50 p-4 text-center space-y-1">
                <div className="text-2xl font-bold text-emerald-500">92.4%</div>
                <div className="text-xs text-muted-foreground">AI Detection Accuracy</div>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-purple-500/5 border border-purple-500/10 p-3">
              <Info className="h-4 w-4 text-purple-500 flex-shrink-0" />
              <span className="text-xs text-muted-foreground">
                {t.aiAnalysis.realTimeData}: Our AI model is continuously trained on the latest blockchain data, covering
                Ethereum, Bitcoin, Polygon, Arbitrum, and 20+ other networks.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Known Scam Patterns Grid (shown when no results) */}
      {!result && !isAnalyzing && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-500" />
              {t.aiAnalysis.scamPatterns}
            </h2>
            <span className="text-xs text-muted-foreground">
              {KNOWN_SCAM_PATTERNS.length} patterns tracked
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {KNOWN_SCAM_PATTERNS.map((pattern) => {
              const Icon = pattern.icon
              return (
                <div
                  key={pattern.id}
                  className="rounded-xl border border-border bg-card p-5 space-y-3 transition-all hover:shadow-md hover:border-purple-500/20"
                >
                  <div className="flex items-start justify-between">
                    <div className={`rounded-lg p-2 ${severityColor(pattern.severity)}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${severityBadgeColor(
                        pattern.severity
                      )}`}
                    >
                      {pattern.severity}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">{pattern.name}</h3>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                      {pattern.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <TrendingUp className="h-3 w-3" />
                    <span>{pattern.victims.toLocaleString()} victims</span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Historical Data Summary */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-500" />
              {t.aiAnalysis.historicalData}
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg bg-muted/50 p-4 text-center space-y-1">
                <div className="text-2xl font-bold text-red-500">$14B+</div>
                <div className="text-xs text-muted-foreground">Total Documented Scam Losses</div>
              </div>
              <div className="rounded-lg bg-muted/50 p-4 text-center space-y-1">
                <div className="text-2xl font-bold text-orange-500">380K+</div>
                <div className="text-xs text-muted-foreground">Reported Scam Addresses</div>
              </div>
              <div className="rounded-lg bg-muted/50 p-4 text-center space-y-1">
                <div className="text-2xl font-bold text-emerald-500">92.4%</div>
                <div className="text-xs text-muted-foreground">AI Detection Accuracy</div>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-purple-500/5 border border-purple-500/10 p-3">
              <Info className="h-4 w-4 text-purple-500 flex-shrink-0" />
              <span className="text-xs text-muted-foreground">
                {t.aiAnalysis.realTimeData}: Enter a blockchain address above to run a full AI-powered risk analysis
                against our database of known scam patterns and on-chain behavioral models.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Inline keyframe for step animation */}
      <style jsx>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateX(-8px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  )
}
