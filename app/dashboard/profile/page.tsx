"use client"

import React, { useState } from "react"
import { useI18n } from "@/lib/i18n"
import { useAuth } from "@/components/auth-provider"
import {
  User,
  Shield,
  Star,
  Trophy,
  FileText,
  Bell,
  Settings,
  Crown,
  Award,
  Wallet,
  BarChart3,
  Clock,
  CheckCircle,
  TrendingUp,
} from "lucide-react"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Tab = "overview" | "risk" | "subscription"
type RiskLevel = "safe" | "suspicious" | "dangerous"
type PlanTier = "free" | "basic" | "pro" | "enterprise"
type Rank = "Novice" | "Analyst" | "Investigator" | "Sentinel"

interface RecentCheck {
  id: string
  address: string
  network: string
  risk: RiskLevel
  date: string
}

interface PlanFeature {
  label: string
  free: string
  basic: string
  pro: string
  enterprise: string
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const MOCK_TRUST_SCORE = 78
const MOCK_RANK: Rank = "Analyst"
const MOCK_PLAN: PlanTier = "free"
const MOCK_MEMBER_SINCE = "2025-03-14"

const MOCK_QUICK_STATS = {
  reportsSubmitted: 24,
  walletsChecked: 187,
  threatsFound: 12,
  alertsReceived: 38,
}

const MOCK_RISK_SCORE = 23

const MOCK_RECENT_CHECKS: RecentCheck[] = [
  { id: "1", address: "0x742d...4B2e", network: "Ethereum", risk: "safe", date: "2026-02-10" },
  { id: "2", address: "0x1a2B...9cDf", network: "Polygon", risk: "suspicious", date: "2026-02-09" },
  { id: "3", address: "bc1qxy...m4g2", network: "Bitcoin", risk: "safe", date: "2026-02-08" },
  { id: "4", address: "0xdEaD...bEEf", network: "Arbitrum", risk: "dangerous", date: "2026-02-07" },
  { id: "5", address: "0x8888...1111", network: "Ethereum", risk: "safe", date: "2026-02-06" },
]

const MOCK_RISK_DISTRIBUTION = {
  safe: 142,
  suspicious: 33,
  dangerous: 12,
}

const MOCK_MONTHLY_ACTIVITY = {
  checksThisMonth: 47,
  checksLastMonth: 39,
  avgRiskScore: 18,
  highRiskEncounters: 3,
}

const MOCK_USAGE = {
  checksUsed: 7,
  checksLimit: 10,
  aiUsed: 0,
  aiLimit: 0,
  monitoredWallets: 0,
  monitoredLimit: 0,
}

const PLAN_FEATURES: PlanFeature[] = [
  { label: "Daily Checks", free: "10", basic: "Unlimited", pro: "Unlimited", enterprise: "Unlimited" },
  { label: "AI Analysis", free: "---", basic: "50 / month", pro: "Unlimited", enterprise: "Unlimited" },
  { label: "Database Access", free: "Basic", basic: "Full", pro: "Full + Priority", enterprise: "Full + Priority" },
  { label: "Monitored Wallets", free: "---", basic: "3", pro: "20", enterprise: "Unlimited" },
  { label: "API Access", free: "---", basic: "---", pro: "Yes", enterprise: "Yes" },
  { label: "Monthly Checks", free: "100", basic: "Unlimited", pro: "Unlimited", enterprise: "Unlimited" },
  { label: "Dedicated Manager", free: "---", basic: "---", pro: "---", enterprise: "Yes" },
  { label: "Custom Integrations", free: "---", basic: "---", pro: "---", enterprise: "Yes" },
]

const PLAN_PRICES: Record<PlanTier, string> = {
  free: "$0",
  basic: "$9.99",
  pro: "$29.99",
  enterprise: "$199",
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getInitials(email: string | undefined): string {
  if (!email) return "U"
  const parts = email.split("@")[0].split(/[._-]/)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return email.slice(0, 2).toUpperCase()
}

function getRankColor(rank: Rank): string {
  switch (rank) {
    case "Novice":
      return "bg-slate-500/10 text-slate-500 border-slate-500/30"
    case "Analyst":
      return "bg-blue-500/10 text-blue-500 border-blue-500/30"
    case "Investigator":
      return "bg-purple-500/10 text-purple-500 border-purple-500/30"
    case "Sentinel":
      return "bg-amber-500/10 text-amber-500 border-amber-500/30"
  }
}

function getRankIcon(rank: Rank): React.ElementType {
  switch (rank) {
    case "Novice":
      return Star
    case "Analyst":
      return Award
    case "Investigator":
      return Shield
    case "Sentinel":
      return Crown
  }
}

function getRiskColor(risk: RiskLevel): string {
  switch (risk) {
    case "safe":
      return "text-emerald-500 bg-emerald-500/10"
    case "suspicious":
      return "text-yellow-500 bg-yellow-500/10"
    case "dangerous":
      return "text-red-500 bg-red-500/10"
  }
}

function getRiskBarColor(risk: RiskLevel): string {
  switch (risk) {
    case "safe":
      return "bg-emerald-500"
    case "suspicious":
      return "bg-yellow-500"
    case "dangerous":
      return "bg-red-500"
  }
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function OverviewTab({
  email,
  trustScore,
  rank,
  stats,
  t,
}: {
  email: string | undefined
  trustScore: number
  rank: Rank
  stats: typeof MOCK_QUICK_STATS
  t: ReturnType<typeof useI18n>["t"]
}) {
  const RankIcon = getRankIcon(rank)
  const initials = getInitials(email)

  return (
    <div className="space-y-6">
      {/* Profile header card */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          {/* Avatar */}
          <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 text-3xl font-bold ring-4 ring-emerald-500/20">
            {initials}
          </div>

          {/* Info */}
          <div className="flex-1 space-y-3 text-center sm:text-left">
            <div>
              <h2 className="text-xl font-bold">{email ?? "User"}</h2>
              <p className="text-sm text-muted-foreground">
                Member since {new Date(MOCK_MEMBER_SINCE).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <span className="inline-flex items-center gap-1 rounded-full border bg-emerald-500/10 text-emerald-500 border-emerald-500/30 px-3 py-1 text-xs font-medium">
                <Shield className="h-3 w-3" />
                Verified User
              </span>
              <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${getRankColor(rank)}`}>
                <RankIcon className="h-3 w-3" />
                {t.profile.rank}: {rank}
              </span>
            </div>
          </div>

          {/* Trust Score */}
          <div className="flex flex-col items-center gap-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{t.profile.trustScore}</p>
            <div className="relative flex h-28 w-28 items-center justify-center">
              <svg className="h-28 w-28 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/30" />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={`${(trustScore / 100) * 263.9} 263.9`}
                  strokeLinecap="round"
                  className="text-emerald-500 transition-all duration-1000"
                />
              </svg>
              <span className="absolute text-2xl font-bold text-emerald-500">{trustScore}</span>
            </div>
            <p className="text-xs text-muted-foreground">/ 100</p>
          </div>
        </div>
      </div>

      {/* Rank badge card */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center gap-3 mb-4">
          <Trophy className="h-5 w-5 text-amber-500" />
          <h3 className="text-lg font-semibold">{t.profile.reputation}</h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(["Novice", "Analyst", "Investigator", "Sentinel"] as Rank[]).map((r) => {
            const Icon = getRankIcon(r)
            const isActive = r === rank
            return (
              <div
                key={r}
                className={`relative rounded-lg border p-4 text-center transition-all ${
                  isActive
                    ? `${getRankColor(r)} border-2 shadow-sm`
                    : "border-border bg-muted/20 opacity-50"
                }`}
              >
                {isActive && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white">
                    CURRENT
                  </span>
                )}
                <Icon className="mx-auto h-8 w-8 mb-2" />
                <p className="font-semibold text-sm">{r}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{t.profile.reportsSubmitted}</p>
              <p className="text-2xl font-bold">{stats.reportsSubmitted}</p>
            </div>
            <div className="rounded-lg p-2.5 bg-blue-500/10 text-blue-500">
              <FileText className="h-5 w-5" />
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Wallets Checked</p>
              <p className="text-2xl font-bold">{stats.walletsChecked}</p>
            </div>
            <div className="rounded-lg p-2.5 bg-emerald-500/10 text-emerald-500">
              <Wallet className="h-5 w-5" />
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Threats Found</p>
              <p className="text-2xl font-bold">{stats.threatsFound}</p>
            </div>
            <div className="rounded-lg p-2.5 bg-red-500/10 text-red-500">
              <Shield className="h-5 w-5" />
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{t.profile.alertsReceived}</p>
              <p className="text-2xl font-bold">{stats.alertsReceived}</p>
            </div>
            <div className="rounded-lg p-2.5 bg-yellow-500/10 text-yellow-500">
              <Bell className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function RiskDashboardTab({ t }: { t: ReturnType<typeof useI18n>["t"] }) {
  const total = MOCK_RISK_DISTRIBUTION.safe + MOCK_RISK_DISTRIBUTION.suspicious + MOCK_RISK_DISTRIBUTION.dangerous
  const safePercent = Math.round((MOCK_RISK_DISTRIBUTION.safe / total) * 100)
  const suspiciousPercent = Math.round((MOCK_RISK_DISTRIBUTION.suspicious / total) * 100)
  const dangerousPercent = Math.round((MOCK_RISK_DISTRIBUTION.dangerous / total) * 100)

  return (
    <div className="space-y-6">
      {/* Personal risk score */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="h-5 w-5 text-emerald-500" />
          <h3 className="text-lg font-semibold">Personal Risk Score</h3>
        </div>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-8">
          <div className="flex flex-col items-center gap-1">
            <div className="relative flex h-32 w-32 items-center justify-center">
              <svg className="h-32 w-32 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/30" />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={`${(MOCK_RISK_SCORE / 100) * 263.9} 263.9`}
                  strokeLinecap="round"
                  className="text-emerald-500 transition-all duration-1000"
                />
              </svg>
              <span className="absolute text-3xl font-bold text-emerald-500">{MOCK_RISK_SCORE}</span>
            </div>
            <p className="text-sm text-muted-foreground">{t.common.low} Risk</p>
          </div>
          <div className="flex-1 space-y-3">
            <p className="text-sm text-muted-foreground">
              Your personal risk score is calculated from your interaction history, the addresses you check, and the overall safety of your monitored wallets. A lower score indicates safer activity.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              <span className="text-emerald-500 font-medium">-5 points</span>
              <span className="text-muted-foreground">from last month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent checks history */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold">Recent Checks</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="pb-3 pr-4 font-medium">Address</th>
                <th className="pb-3 pr-4 font-medium">Network</th>
                <th className="pb-3 pr-4 font-medium">Risk Level</th>
                <th className="pb-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {MOCK_RECENT_CHECKS.map((check) => (
                <tr key={check.id}>
                  <td className="py-3 pr-4 font-mono text-xs">{check.address}</td>
                  <td className="py-3 pr-4">{check.network}</td>
                  <td className="py-3 pr-4">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${getRiskColor(check.risk)}`}>
                      {check.risk === "safe" && <CheckCircle className="h-3 w-3" />}
                      {check.risk === "suspicious" && <Shield className="h-3 w-3" />}
                      {check.risk === "dangerous" && <Shield className="h-3 w-3" />}
                      {check.risk === "safe" ? t.common.safe : check.risk === "suspicious" ? t.common.suspicious : t.common.dangerous}
                    </span>
                  </td>
                  <td className="py-3 text-muted-foreground">{check.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Risk distribution */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="h-5 w-5 text-purple-500" />
          <h3 className="text-lg font-semibold">Risk Distribution</h3>
        </div>
        <div className="space-y-4">
          {/* Stacked bar */}
          <div className="h-6 w-full overflow-hidden rounded-full bg-muted/30 flex">
            <div className="bg-emerald-500 transition-all duration-700" style={{ width: `${safePercent}%` }} />
            <div className="bg-yellow-500 transition-all duration-700" style={{ width: `${suspiciousPercent}%` }} />
            <div className="bg-red-500 transition-all duration-700" style={{ width: `${dangerousPercent}%` }} />
          </div>

          {/* Legend + bars */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-emerald-500" />
                <span className="text-sm">{t.common.safe}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-32 overflow-hidden rounded-full bg-muted/30">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: `${safePercent}%` }} />
                </div>
                <span className="text-sm font-medium w-14 text-right">{MOCK_RISK_DISTRIBUTION.safe} ({safePercent}%)</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <span className="text-sm">{t.common.suspicious}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-32 overflow-hidden rounded-full bg-muted/30">
                  <div className="h-full rounded-full bg-yellow-500" style={{ width: `${suspiciousPercent}%` }} />
                </div>
                <span className="text-sm font-medium w-14 text-right">{MOCK_RISK_DISTRIBUTION.suspicious} ({suspiciousPercent}%)</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <span className="text-sm">{t.common.dangerous}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-32 overflow-hidden rounded-full bg-muted/30">
                  <div className="h-full rounded-full bg-red-500" style={{ width: `${dangerousPercent}%` }} />
                </div>
                <span className="text-sm font-medium w-14 text-right">{MOCK_RISK_DISTRIBUTION.dangerous} ({dangerousPercent}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly activity summary */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="h-5 w-5 text-emerald-500" />
          <h3 className="text-lg font-semibold">Monthly Activity Summary</h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-border p-4 text-center">
            <p className="text-sm text-muted-foreground">Checks This Month</p>
            <p className="text-2xl font-bold mt-1">{MOCK_MONTHLY_ACTIVITY.checksThisMonth}</p>
            <p className="text-xs text-emerald-500 mt-1 flex items-center justify-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +{MOCK_MONTHLY_ACTIVITY.checksThisMonth - MOCK_MONTHLY_ACTIVITY.checksLastMonth} vs last month
            </p>
          </div>
          <div className="rounded-lg border border-border p-4 text-center">
            <p className="text-sm text-muted-foreground">Checks Last Month</p>
            <p className="text-2xl font-bold mt-1">{MOCK_MONTHLY_ACTIVITY.checksLastMonth}</p>
          </div>
          <div className="rounded-lg border border-border p-4 text-center">
            <p className="text-sm text-muted-foreground">Avg. Risk Score</p>
            <p className="text-2xl font-bold mt-1 text-emerald-500">{MOCK_MONTHLY_ACTIVITY.avgRiskScore}</p>
            <p className="text-xs text-muted-foreground mt-1">{t.common.low}</p>
          </div>
          <div className="rounded-lg border border-border p-4 text-center">
            <p className="text-sm text-muted-foreground">High Risk Encounters</p>
            <p className="text-2xl font-bold mt-1 text-red-500">{MOCK_MONTHLY_ACTIVITY.highRiskEncounters}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function SubscriptionTab({ currentPlan, t }: { currentPlan: PlanTier; t: ReturnType<typeof useI18n>["t"] }) {
  const tiers: { key: PlanTier; label: string; price: string; period: string }[] = [
    { key: "free", label: t.profile.free, price: PLAN_PRICES.free, period: "forever" },
    { key: "basic", label: t.profile.basic, price: PLAN_PRICES.basic, period: "/ mo" },
    { key: "pro", label: t.profile.pro, price: PLAN_PRICES.pro, period: "/ mo" },
    { key: "enterprise", label: t.profile.enterprise, price: PLAN_PRICES.enterprise, period: "/ mo" },
  ]

  const tierIcon: Record<PlanTier, React.ElementType> = {
    free: Star,
    basic: Shield,
    pro: Award,
    enterprise: Crown,
  }

  return (
    <div className="space-y-6">
      {/* Current plan */}
      <div className="rounded-xl border border-emerald-500/50 bg-card p-5">
        <div className="flex items-center gap-3 mb-2">
          <Crown className="h-5 w-5 text-emerald-500" />
          <h3 className="text-lg font-semibold">Current {t.profile.plan}</h3>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-2xl font-bold text-emerald-500">
              {currentPlan === "free" ? t.profile.free : currentPlan === "basic" ? t.profile.basic : currentPlan === "pro" ? t.profile.pro : t.profile.enterprise}
            </p>
            <p className="text-sm text-muted-foreground">
              {PLAN_PRICES[currentPlan]}{currentPlan !== "free" ? " / month" : " - No credit card required"}
            </p>
          </div>
          {currentPlan !== "enterprise" && (
            <button className="rounded-lg bg-emerald-500 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-600">
              Upgrade Plan
            </button>
          )}
        </div>
      </div>

      {/* Plan comparison grid */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-lg font-semibold mb-4">Plan Comparison</h3>

        {/* Tier headers */}
        <div className="overflow-x-auto">
          <div className="min-w-[640px]">
            {/* Header row */}
            <div className="grid grid-cols-5 gap-2 mb-4">
              <div className="p-3" />
              {tiers.map((tier) => {
                const Icon = tierIcon[tier.key]
                const isCurrentPlan = tier.key === currentPlan
                return (
                  <div
                    key={tier.key}
                    className={`rounded-lg p-3 text-center transition-all ${
                      isCurrentPlan
                        ? "border-2 border-emerald-500 bg-emerald-500/5"
                        : "border border-border"
                    }`}
                  >
                    {isCurrentPlan && (
                      <span className="inline-block rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white mb-1">
                        CURRENT
                      </span>
                    )}
                    <Icon className={`mx-auto h-6 w-6 mb-1 ${isCurrentPlan ? "text-emerald-500" : "text-muted-foreground"}`} />
                    <p className="font-semibold text-sm">{tier.label}</p>
                    <p className="text-lg font-bold">{tier.price}</p>
                    <p className="text-xs text-muted-foreground">{tier.period}</p>
                  </div>
                )
              })}
            </div>

            {/* Feature rows */}
            {PLAN_FEATURES.map((feature, idx) => (
              <div
                key={feature.label}
                className={`grid grid-cols-5 gap-2 ${idx % 2 === 0 ? "bg-muted/10" : ""}`}
              >
                <div className="p-3 text-sm font-medium">{feature.label}</div>
                {(["free", "basic", "pro", "enterprise"] as PlanTier[]).map((tier) => {
                  const value = feature[tier]
                  const isCurrentPlan = tier === currentPlan
                  return (
                    <div
                      key={tier}
                      className={`p-3 text-center text-sm ${isCurrentPlan ? "font-medium" : "text-muted-foreground"}`}
                    >
                      {value === "---" ? (
                        <span className="text-muted-foreground/40">---</span>
                      ) : value === "Yes" ? (
                        <CheckCircle className="mx-auto h-4 w-4 text-emerald-500" />
                      ) : (
                        value
                      )}
                    </div>
                  )
                })}
              </div>
            ))}

            {/* Upgrade buttons row */}
            <div className="grid grid-cols-5 gap-2 mt-4">
              <div className="p-3" />
              {tiers.map((tier) => {
                const isCurrentPlan = tier.key === currentPlan
                const tierOrder: PlanTier[] = ["free", "basic", "pro", "enterprise"]
                const currentIdx = tierOrder.indexOf(currentPlan)
                const tierIdx = tierOrder.indexOf(tier.key)
                const isUpgrade = tierIdx > currentIdx

                return (
                  <div key={tier.key} className="p-3 text-center">
                    {isCurrentPlan ? (
                      <span className="inline-block rounded-lg border border-emerald-500 px-4 py-2 text-sm font-medium text-emerald-500">
                        Current Plan
                      </span>
                    ) : isUpgrade ? (
                      <button className="w-full rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-600">
                        Upgrade
                      </button>
                    ) : (
                      <span className="inline-block text-xs text-muted-foreground py-2">---</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Usage stats for current billing period */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold">Usage This Billing Period</h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {/* Checks used */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Address Checks</span>
              <span className="font-medium">
                {MOCK_USAGE.checksUsed} / {MOCK_USAGE.checksLimit === 0 ? "---" : MOCK_USAGE.checksLimit}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted/30">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                style={{
                  width: MOCK_USAGE.checksLimit > 0 ? `${(MOCK_USAGE.checksUsed / MOCK_USAGE.checksLimit) * 100}%` : "0%",
                }}
              />
            </div>
          </div>

          {/* AI analyses */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">AI Analyses</span>
              <span className="font-medium">
                {MOCK_USAGE.aiUsed} / {MOCK_USAGE.aiLimit === 0 ? "---" : MOCK_USAGE.aiLimit}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted/30">
              <div
                className="h-full rounded-full bg-purple-500 transition-all duration-700"
                style={{
                  width: MOCK_USAGE.aiLimit > 0 ? `${(MOCK_USAGE.aiUsed / MOCK_USAGE.aiLimit) * 100}%` : "0%",
                }}
              />
            </div>
          </div>

          {/* Monitored wallets */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Monitored Wallets</span>
              <span className="font-medium">
                {MOCK_USAGE.monitoredWallets} / {MOCK_USAGE.monitoredLimit === 0 ? "---" : MOCK_USAGE.monitoredLimit}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted/30">
              <div
                className="h-full rounded-full bg-blue-500 transition-all duration-700"
                style={{
                  width: MOCK_USAGE.monitoredLimit > 0 ? `${(MOCK_USAGE.monitoredWallets / MOCK_USAGE.monitoredLimit) * 100}%` : "0%",
                }}
              />
            </div>
          </div>
        </div>
        {currentPlan === "free" && (
          <p className="mt-4 text-sm text-muted-foreground">
            Upgrade to <span className="text-emerald-500 font-medium">{t.profile.basic}</span> or higher to unlock AI analysis, wallet monitoring, and unlimited checks.
          </p>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function ProfilePage() {
  const { t } = useI18n()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<Tab>("overview")

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: "overview", label: "Overview", icon: User },
    { key: "risk", label: t.profile.riskDashboard, icon: BarChart3 },
    { key: "subscription", label: t.profile.subscription, icon: Crown },
  ]

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold">{t.profile.title}</h1>
        <p className="text-muted-foreground">{t.profile.subtitle}</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="-mb-px flex gap-6 overflow-x-auto" aria-label="Profile tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.key
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`inline-flex items-center gap-2 whitespace-nowrap pb-3 text-sm transition-colors ${
                  isActive
                    ? "border-b-2 border-emerald-500 text-emerald-500 font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab content */}
      {activeTab === "overview" && (
        <OverviewTab
          email={user?.email}
          trustScore={MOCK_TRUST_SCORE}
          rank={MOCK_RANK}
          stats={MOCK_QUICK_STATS}
          t={t}
        />
      )}

      {activeTab === "risk" && <RiskDashboardTab t={t} />}

      {activeTab === "subscription" && <SubscriptionTab currentPlan={MOCK_PLAN} t={t} />}
    </div>
  )
}
