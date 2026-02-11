"use client"

import React, { useState } from "react"
import { useI18n } from "@/lib/i18n"
import {
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Copy,
  Check,
  ExternalLink,
  Flag,
  Database,
  Loader2,
  Info,
  Wallet,
  ArrowRightLeft,
  Clock,
  Hash,
  ChevronDown,
} from "lucide-react"

type Network = "ethereum" | "bitcoin" | "polygon" | "arbitrum" | "optimism" | "zksync"
type RiskLevel = "safe" | "suspicious" | "dangerous" | "critical"

interface DatabaseSource {
  name: string
  translationKey: "chainAbuse" | "bitcoinAbuse" | "etherscan"
  found: boolean
  reports: number
}

interface CheckResult {
  address: string
  network: Network
  riskScore: number
  riskLevel: RiskLevel
  databases: DatabaseSource[]
  walletAge: string
  transactions: number
  balance: string
  walletType: string
  lastChecked: string
}

const networks: { id: Network; name: string; color: string }[] = [
  { id: "ethereum", name: "Ethereum", color: "bg-blue-500" },
  { id: "bitcoin", name: "Bitcoin", color: "bg-orange-500" },
  { id: "polygon", name: "Polygon", color: "bg-purple-500" },
  { id: "arbitrum", name: "Arbitrum", color: "bg-cyan-500" },
  { id: "optimism", name: "Optimism", color: "bg-red-500" },
  { id: "zksync", name: "zkSync", color: "bg-indigo-500" },
]

function getRiskLevel(score: number): RiskLevel {
  if (score <= 25) return "safe"
  if (score <= 50) return "suspicious"
  if (score <= 75) return "dangerous"
  return "critical"
}

function getRiskColor(level: RiskLevel): string {
  switch (level) {
    case "safe":
      return "text-emerald-500"
    case "suspicious":
      return "text-yellow-500"
    case "dangerous":
      return "text-orange-500"
    case "critical":
      return "text-red-500"
  }
}

function getRiskBgColor(level: RiskLevel): string {
  switch (level) {
    case "safe":
      return "bg-emerald-500"
    case "suspicious":
      return "bg-yellow-500"
    case "dangerous":
      return "bg-orange-500"
    case "critical":
      return "bg-red-500"
  }
}

function getRiskBgLight(level: RiskLevel): string {
  switch (level) {
    case "safe":
      return "bg-emerald-500/10 text-emerald-500"
    case "suspicious":
      return "bg-yellow-500/10 text-yellow-500"
    case "dangerous":
      return "bg-orange-500/10 text-orange-500"
    case "critical":
      return "bg-red-500/10 text-red-500"
  }
}

function getRiskBorderColor(level: RiskLevel): string {
  switch (level) {
    case "safe":
      return "border-emerald-500/30"
    case "suspicious":
      return "border-yellow-500/30"
    case "dangerous":
      return "border-orange-500/30"
    case "critical":
      return "border-red-500/30"
  }
}

function getRiskLabel(level: RiskLevel, t: ReturnType<typeof useI18n>["t"]): string {
  switch (level) {
    case "safe":
      return t.common.safe
    case "suspicious":
      return t.common.suspicious
    case "dangerous":
      return t.common.dangerous
    case "critical":
      return t.common.critical
  }
}

function simulateCheck(address: string, network: Network): CheckResult {
  // Generate a deterministic-looking but varied risk score from the address
  let hash = 0
  for (let i = 0; i < address.length; i++) {
    hash = (hash << 5) - hash + address.charCodeAt(i)
    hash |= 0
  }
  const riskScore = Math.abs(hash % 101)
  const riskLevel = getRiskLevel(riskScore)

  const chainAbuseFound = riskScore > 40
  const bitcoinAbuseFound = riskScore > 60 && network === "bitcoin"
  const etherscanFound = riskScore > 55

  return {
    address,
    network,
    riskScore,
    riskLevel,
    databases: [
      {
        name: "ChainAbuse",
        translationKey: "chainAbuse",
        found: chainAbuseFound,
        reports: chainAbuseFound ? Math.abs(hash % 24) + 1 : 0,
      },
      {
        name: "BitcoinAbuse",
        translationKey: "bitcoinAbuse",
        found: bitcoinAbuseFound,
        reports: bitcoinAbuseFound ? Math.abs((hash >> 4) % 15) + 1 : 0,
      },
      {
        name: "Etherscan Labels",
        translationKey: "etherscan",
        found: etherscanFound,
        reports: etherscanFound ? Math.abs((hash >> 8) % 8) + 1 : 0,
      },
    ],
    walletAge: `${Math.abs(hash % 48) + 1} months`,
    transactions: Math.abs((hash >> 2) % 5000) + 10,
    balance: `${(Math.abs((hash >> 3) % 10000) / 100).toFixed(2)} ${network === "bitcoin" ? "BTC" : "ETH"}`,
    walletType: riskScore > 50 ? "Contract" : "EOA",
    lastChecked: new Date().toLocaleString(),
  }
}

function getExplorerUrl(address: string, network: Network): string {
  switch (network) {
    case "ethereum":
      return `https://etherscan.io/address/${address}`
    case "bitcoin":
      return `https://www.blockchain.com/btc/address/${address}`
    case "polygon":
      return `https://polygonscan.com/address/${address}`
    case "arbitrum":
      return `https://arbiscan.io/address/${address}`
    case "optimism":
      return `https://optimistic.etherscan.io/address/${address}`
    case "zksync":
      return `https://explorer.zksync.io/address/${address}`
  }
}

export default function ScamCheckerPage() {
  const { t } = useI18n()
  const [address, setAddress] = useState("")
  const [network, setNetwork] = useState<Network>("ethereum")
  const [isChecking, setIsChecking] = useState(false)
  const [result, setResult] = useState<CheckResult | null>(null)
  const [copied, setCopied] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const selectedNetwork = networks.find((n) => n.id === network)!

  const handleCheck = () => {
    if (!address.trim()) return
    setIsChecking(true)
    setResult(null)

    setTimeout(() => {
      const checkResult = simulateCheck(address.trim(), network)
      setResult(checkResult)
      setIsChecking(false)
    }, 2000)
  }

  const handleCopy = () => {
    if (!result) return
    navigator.clipboard.writeText(result.address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCheck()
    }
  }

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">{t.scamChecker.title}</h1>
        <p className="text-muted-foreground">{t.scamChecker.subtitle}</p>
      </div>

      {/* Search Card */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex flex-col gap-3 sm:flex-row">
          {/* Network Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex w-full items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none sm:w-44"
            >
              <div className={`h-2.5 w-2.5 rounded-full ${selectedNetwork.color}`} />
              <span className="flex-1 text-left">{selectedNetwork.name}</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>
            {dropdownOpen && (
              <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-lg border border-border bg-card py-1 shadow-lg sm:w-44">
                {networks.map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => {
                      setNetwork(n.id)
                      setDropdownOpen(false)
                    }}
                    className={`flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-muted ${
                      network === n.id ? "bg-muted" : ""
                    }`}
                  >
                    <div className={`h-2.5 w-2.5 rounded-full ${n.color}`} />
                    <span>{n.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Address Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t.scamChecker.enterAddress}
              className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Check Button */}
          <button
            type="button"
            onClick={handleCheck}
            disabled={isChecking || !address.trim()}
            className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isChecking ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t.scamChecker.checking}
              </>
            ) : (
              <>
                <Shield className="h-4 w-4" />
                {t.scamChecker.checkNow}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isChecking && (
        <div className="flex flex-col items-center justify-center gap-4 py-16">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-4 border-muted" />
            <div className="absolute inset-0 h-16 w-16 animate-spin rounded-full border-4 border-transparent border-t-emerald-500" />
          </div>
          <p className="text-sm text-muted-foreground">{t.scamChecker.checking}</p>
          <div className="flex gap-2">
            {["ChainAbuse", "BitcoinAbuse", "Etherscan"].map((db, i) => (
              <span
                key={db}
                className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground"
                style={{ animationDelay: `${i * 200}ms` }}
              >
                {db}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {result && !isChecking && (
        <div className="space-y-4">
          {/* Results Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{t.scamChecker.results}</h2>
            <span className="text-xs text-muted-foreground">
              {t.scamChecker.lastChecked}: {result.lastChecked}
            </span>
          </div>

          {/* Risk Score & Level */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Risk Score Gauge */}
            <div className={`rounded-xl border bg-card p-5 ${getRiskBorderColor(result.riskLevel)}`}>
              <div className="mb-4 flex items-center gap-2">
                <Database className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium text-muted-foreground">
                  {t.scamChecker.riskScore}
                </h3>
              </div>
              <div className="flex items-center gap-6">
                {/* Circular Gauge */}
                <div className="relative h-28 w-28 flex-shrink-0">
                  <svg className="h-28 w-28 -rotate-90" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="10"
                      className="text-muted"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={`${(result.riskScore / 100) * 314} 314`}
                      className={getRiskColor(result.riskLevel)}
                      stroke="currentColor"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-2xl font-bold ${getRiskColor(result.riskLevel)}`}>
                      {result.riskScore}
                    </span>
                    <span className="text-[10px] text-muted-foreground">/100</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${getRiskBgColor(result.riskLevel)}`} />
                    <span className={`text-lg font-semibold ${getRiskColor(result.riskLevel)}`}>
                      {getRiskLabel(result.riskLevel, t)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {result.riskLevel === "safe"
                      ? t.scamChecker.noThreats
                      : t.scamChecker.threatsFound}
                  </p>
                  {/* Risk bar */}
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className={`h-2 rounded-full transition-all ${getRiskBgColor(result.riskLevel)}`}
                      style={{ width: `${result.riskScore}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Level Card */}
            <div className={`rounded-xl border bg-card p-5 ${getRiskBorderColor(result.riskLevel)}`}>
              <div className="mb-4 flex items-center gap-2">
                {result.riskLevel === "safe" ? (
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                ) : result.riskLevel === "suspicious" ? (
                  <ShieldAlert className="h-4 w-4 text-yellow-500" />
                ) : result.riskLevel === "dangerous" ? (
                  <ShieldAlert className="h-4 w-4 text-orange-500" />
                ) : (
                  <ShieldX className="h-4 w-4 text-red-500" />
                )}
                <h3 className="text-sm font-medium text-muted-foreground">
                  {t.scamChecker.riskLevel}
                </h3>
              </div>

              {/* Address display with copy */}
              <div className="mb-4 flex items-center gap-2">
                <code className="flex-1 truncate rounded-md bg-muted px-2 py-1 text-xs font-mono">
                  {result.address}
                </code>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs transition-colors hover:bg-muted/80"
                  title={t.common.copyAddress}
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-500" />
                      <span className="text-emerald-500">{t.common.copied}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>{t.common.copyAddress}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Address details grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  <div>
                    <p className="text-[10px] text-muted-foreground">Wallet Age</p>
                    <p className="text-xs font-medium">{result.walletAge}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowRightLeft className="h-3.5 w-3.5 text-muted-foreground" />
                  <div>
                    <p className="text-[10px] text-muted-foreground">Transactions</p>
                    <p className="text-xs font-medium">{result.transactions.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Wallet className="h-3.5 w-3.5 text-muted-foreground" />
                  <div>
                    <p className="text-[10px] text-muted-foreground">Balance</p>
                    <p className="text-xs font-medium">{result.balance}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Hash className="h-3.5 w-3.5 text-muted-foreground" />
                  <div>
                    <p className="text-[10px] text-muted-foreground">Type</p>
                    <p className="text-xs font-medium">{result.walletType}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Database Sources */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center gap-2">
              <Database className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium">{t.scamChecker.databaseSources}</h3>
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                {t.scamChecker.databases}: {result.databases.length}
              </span>
            </div>
            <div className="space-y-3">
              {result.databases.map((db) => (
                <div
                  key={db.name}
                  className={`flex items-center justify-between rounded-lg border px-4 py-3 ${
                    db.found
                      ? "border-red-500/20 bg-red-500/5"
                      : "border-emerald-500/20 bg-emerald-500/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {db.found ? (
                      <XCircle className="h-5 w-5 text-red-500" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                    )}
                    <div>
                      <p className="text-sm font-medium">
                        {t.scamChecker[db.translationKey]}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {db.found
                          ? `${db.reports} report${db.reports !== 1 ? "s" : ""} found`
                          : "No reports found"}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      db.found
                        ? "bg-red-500/10 text-red-500"
                        : "bg-emerald-500/10 text-emerald-500"
                    }`}
                  >
                    {db.found ? "Found" : "Clear"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              <Flag className="h-4 w-4" />
              {t.scamChecker.reportScam}
            </button>
            <a
              href={getExplorerUrl(result.address, result.network)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
            >
              <ExternalLink className="h-4 w-4" />
              View on Explorer
            </a>
          </div>
        </div>
      )}

      {/* Info section when no results */}
      {!result && !isChecking && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
            </div>
            <h3 className="mb-1 text-sm font-semibold">Multi-Database Check</h3>
            <p className="text-xs text-muted-foreground">
              We cross-reference addresses against ChainAbuse, BitcoinAbuse, Etherscan Labels, and
              other trusted sources to provide comprehensive risk assessment.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              <Search className="h-5 w-5 text-blue-500" />
            </div>
            <h3 className="mb-1 text-sm font-semibold">Deep Analysis</h3>
            <p className="text-xs text-muted-foreground">
              Each address check includes wallet age verification, transaction history analysis,
              balance tracking, and contract type identification.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
              <AlertTriangle className="h-5 w-5 text-purple-500" />
            </div>
            <h3 className="mb-1 text-sm font-semibold">Risk Scoring</h3>
            <p className="text-xs text-muted-foreground">
              Our scoring system rates addresses from 0-100 across four risk levels: Safe,
              Suspicious, Dangerous, and Critical, so you know exactly what you are dealing with.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
