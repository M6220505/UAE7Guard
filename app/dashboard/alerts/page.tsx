"use client"

import React, { useState } from "react"
import { useI18n } from "@/lib/i18n"
import {
  Bell,
  BellOff,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  Info,
  Shield,
  Trash2,
  Clock,
  Filter,
  Check,
  Plus,
  X,
} from "lucide-react"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Severity = "info" | "warning" | "critical"
type SeverityFilter = "all" | Severity
type RiskLevel = "low" | "medium" | "high" | "critical"

interface Alert {
  id: string
  severity: Severity
  title: string
  message: string
  timestamp: string
  read: boolean
}

interface WatchedAddress {
  id: string
  address: string
  network: string
  label: string
  riskLevel: RiskLevel
  lastChecked: string
}

// ---------------------------------------------------------------------------
// Demo data
// ---------------------------------------------------------------------------

const initialAlerts: Alert[] = [
  {
    id: "a1",
    severity: "critical",
    title: "Known Scam Address Detected",
    message:
      "Wallet 0x9fE4...3aB1 on Ethereum has been flagged in 4 scam databases. Immediate action recommended.",
    timestamp: "2 min ago",
    read: false,
  },
  {
    id: "a2",
    severity: "critical",
    title: "Large Unauthorized Transfer",
    message:
      "A transfer of 12.5 ETH was initiated from your monitored wallet 0x3cD8...91eF to an unverified address.",
    timestamp: "18 min ago",
    read: false,
  },
  {
    id: "a3",
    severity: "warning",
    title: "Suspicious Transaction Pattern",
    message:
      "Monitored wallet 0xA1b2...C3d4 showed rapid sequential transfers matching a known wash-trading pattern.",
    timestamp: "45 min ago",
    read: false,
  },
  {
    id: "a4",
    severity: "warning",
    title: "New Interaction with Flagged Contract",
    message:
      "Address 0x7eF0...82aD interacted with smart contract 0xDEAD...BEEF which has 3 community reports.",
    timestamp: "1 hour ago",
    read: false,
  },
  {
    id: "a5",
    severity: "info",
    title: "Monitoring Activated",
    message:
      "Real-time monitoring has been enabled for wallet 0x5bC9...4f1A on Polygon network.",
    timestamp: "2 hours ago",
    read: true,
  },
  {
    id: "a6",
    severity: "warning",
    title: "Risk Score Increase",
    message:
      "The risk score for watched address 0x88Fa...21cE has increased from 35 to 62 due to recent associations.",
    timestamp: "3 hours ago",
    read: true,
  },
  {
    id: "a7",
    severity: "info",
    title: "Weekly Security Report Available",
    message:
      "Your weekly blockchain security summary is ready. 23 wallets checked, 2 threats identified.",
    timestamp: "5 hours ago",
    read: true,
  },
  {
    id: "a8",
    severity: "info",
    title: "Database Update Complete",
    message:
      "Scam database has been updated with 1,247 new entries across Ethereum, Polygon, and Arbitrum networks.",
    timestamp: "8 hours ago",
    read: true,
  },
  {
    id: "a9",
    severity: "critical",
    title: "Phishing Contract Deployed",
    message:
      "A new phishing contract mimicking a popular DEX was deployed on Arbitrum. Addresses interacting with it are at risk.",
    timestamp: "12 hours ago",
    read: true,
  },
]

const initialWatchlist: WatchedAddress[] = [
  {
    id: "w1",
    address: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD4B2e",
    network: "Ethereum",
    label: "Main Trading Wallet",
    riskLevel: "low",
    lastChecked: "5 min ago",
  },
  {
    id: "w2",
    address: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0aB1",
    network: "Polygon",
    label: "DeFi Interactions",
    riskLevel: "medium",
    lastChecked: "12 min ago",
  },
  {
    id: "w3",
    address: "0x3cD8a2B9F0e1d4C7856E9fA0bD2c3E4F5a6B7c8D91eF",
    network: "Arbitrum",
    label: "Suspicious Counterparty",
    riskLevel: "high",
    lastChecked: "1 hour ago",
  },
  {
    id: "w4",
    address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    network: "Bitcoin",
    label: "Cold Storage",
    riskLevel: "low",
    lastChecked: "30 min ago",
  },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function severityIcon(severity: Severity, className: string) {
  switch (severity) {
    case "critical":
      return <AlertTriangle className={className} />
    case "warning":
      return <AlertTriangle className={className} />
    case "info":
      return <Info className={className} />
  }
}

function severityColor(severity: Severity) {
  switch (severity) {
    case "critical":
      return "bg-red-500/10 text-red-500"
    case "warning":
      return "bg-yellow-500/10 text-yellow-500"
    case "info":
      return "bg-blue-500/10 text-blue-500"
  }
}

function riskColor(level: RiskLevel) {
  switch (level) {
    case "low":
      return "bg-emerald-500/10 text-emerald-500"
    case "medium":
      return "bg-yellow-500/10 text-yellow-500"
    case "high":
      return "bg-orange-500/10 text-orange-500"
    case "critical":
      return "bg-red-500/10 text-red-500"
  }
}

function riskLabel(level: RiskLevel, t: ReturnType<typeof useI18n>["t"]) {
  switch (level) {
    case "low":
      return t.common.low
    case "medium":
      return t.common.medium
    case "high":
      return t.common.high
    case "critical":
      return t.common.critical
  }
}

function networkBadgeColor(network: string) {
  switch (network) {
    case "Ethereum":
      return "bg-blue-500/10 text-blue-500"
    case "Polygon":
      return "bg-purple-500/10 text-purple-500"
    case "Arbitrum":
      return "bg-cyan-500/10 text-cyan-500"
    case "Bitcoin":
      return "bg-orange-500/10 text-orange-500"
    default:
      return "bg-muted text-muted-foreground"
  }
}

function truncateAddress(addr: string) {
  if (addr.length <= 16) return addr
  return `${addr.slice(0, 10)}...${addr.slice(-6)}`
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function AlertsPage() {
  const { t } = useI18n()

  // --- tabs ---
  const [activeTab, setActiveTab] = useState<"alerts" | "watchlist">("alerts")

  // --- alerts state ---
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts)
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("all")

  // --- watchlist state ---
  const [watchlist, setWatchlist] = useState<WatchedAddress[]>(initialWatchlist)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newAddress, setNewAddress] = useState("")
  const [newNetwork, setNewNetwork] = useState("Ethereum")
  const [newLabel, setNewLabel] = useState("")

  // --- derived ---
  const unreadCount = alerts.filter((a) => !a.read).length

  const filteredAlerts =
    severityFilter === "all"
      ? alerts
      : alerts.filter((a) => a.severity === severityFilter)

  // --- handlers ---
  function markAsRead(id: string) {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, read: true } : a))
    )
  }

  function markAllAsRead() {
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })))
  }

  function addToWatchlist() {
    if (!newAddress.trim()) return
    const entry: WatchedAddress = {
      id: `w${Date.now()}`,
      address: newAddress.trim(),
      network: newNetwork,
      label: newLabel.trim() || "Untitled",
      riskLevel: "low",
      lastChecked: "Just now",
    }
    setWatchlist((prev) => [entry, ...prev])
    setNewAddress("")
    setNewNetwork("Ethereum")
    setNewLabel("")
    setShowAddForm(false)
  }

  function removeFromWatchlist(id: string) {
    setWatchlist((prev) => prev.filter((w) => w.id !== id))
  }

  // --- severity filter options ---
  const filterOptions: { key: SeverityFilter; label: string }[] = [
    { key: "all", label: t.alerts.allAlerts },
    { key: "info", label: t.alerts.info },
    { key: "warning", label: t.alerts.warning },
    { key: "critical", label: t.alerts.critical },
  ]

  // =========================================================================
  return (
    <div className="space-y-6 animate-slide-up">
      {/* ---- Header ---- */}
      <div>
        <h1 className="text-2xl font-bold">{t.alerts.title}</h1>
        <p className="text-muted-foreground">{t.alerts.subtitle}</p>
      </div>

      {/* ---- Tab bar ---- */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveTab("alerts")}
          className={`relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "alerts"
              ? "bg-emerald-600 text-white"
              : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          <Bell className="h-4 w-4" />
          {t.nav.alerts}
          {unreadCount > 0 && (
            <span className="ml-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("watchlist")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "watchlist"
              ? "bg-emerald-600 text-white"
              : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          <Eye className="h-4 w-4" />
          {t.alerts.watchlist}
        </button>
      </div>

      {/* ================================================================== */}
      {/* ALERTS TAB                                                         */}
      {/* ================================================================== */}
      {activeTab === "alerts" && (
        <div className="space-y-4">
          {/* Toolbar: filters + mark all read */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Severity filters */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              {filterOptions.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setSeverityFilter(opt.key)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    severityFilter === opt.key
                      ? "bg-emerald-600 text-white"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Mark all read */}
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <CheckCircle className="h-3.5 w-3.5" />
                {t.alerts.markAllRead}
              </button>
            )}
          </div>

          {/* Alert list */}
          {filteredAlerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card py-16">
              <BellOff className="h-10 w-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {t.alerts.noAlerts}
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card">
              <div className="divide-y divide-border">
                {filteredAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`flex items-start gap-3 px-4 py-3 transition-colors ${
                      !alert.read
                        ? "bg-muted/40"
                        : ""
                    }`}
                  >
                    {/* Severity icon */}
                    <div
                      className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${severityColor(
                        alert.severity
                      )}`}
                    >
                      {severityIcon(alert.severity, "h-4 w-4")}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        {/* Unread dot */}
                        {!alert.read && (
                          <span className="flex-shrink-0 h-2 w-2 rounded-full bg-emerald-500" />
                        )}
                        <p className="text-sm font-medium truncate">
                          {alert.title}
                        </p>
                        {/* Severity badge */}
                        <span
                          className={`flex-shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${severityColor(
                            alert.severity
                          )}`}
                        >
                          {alert.severity === "info"
                            ? t.alerts.info
                            : alert.severity === "warning"
                            ? t.alerts.warning
                            : t.alerts.critical}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {alert.message}
                      </p>
                      <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {alert.timestamp}
                      </p>
                    </div>

                    {/* Mark as read */}
                    {!alert.read ? (
                      <button
                        onClick={() => markAsRead(alert.id)}
                        className="flex-shrink-0 flex items-center gap-1 rounded-lg bg-muted px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <Check className="h-3 w-3" />
                        {t.alerts.markRead}
                      </button>
                    ) : (
                      <CheckCircle className="mt-1 h-4 w-4 flex-shrink-0 text-muted-foreground/40" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================================================================== */}
      {/* WATCHLIST TAB                                                      */}
      {/* ================================================================== */}
      {activeTab === "watchlist" && (
        <div className="space-y-4">
          {/* Toolbar */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {watchlist.length}{" "}
              {watchlist.length === 1 ? "address" : "addresses"} watched
            </p>
            <button
              onClick={() => setShowAddForm((prev) => !prev)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                showAddForm
                  ? "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                  : "bg-emerald-600 text-white hover:bg-emerald-700"
              }`}
            >
              {showAddForm ? (
                <>
                  <X className="h-3.5 w-3.5" />
                  {t.common.cancel}
                </>
              ) : (
                <>
                  <Plus className="h-3.5 w-3.5" />
                  {t.alerts.addToWatchlist}
                </>
              )}
            </button>
          </div>

          {/* Inline add form */}
          {showAddForm && (
            <div className="rounded-xl border border-border bg-card p-4 space-y-3">
              <p className="text-sm font-medium flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-500" />
                {t.alerts.addToWatchlist}
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                <input
                  type="text"
                  placeholder="Blockchain address"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/40 sm:col-span-2"
                />
                <select
                  value={newNetwork}
                  onChange={(e) => setNewNetwork(e.target.value)}
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                >
                  <option value="Ethereum">Ethereum</option>
                  <option value="Polygon">Polygon</option>
                  <option value="Arbitrum">Arbitrum</option>
                  <option value="Bitcoin">Bitcoin</option>
                  <option value="Optimism">Optimism</option>
                  <option value="zkSync">zkSync</option>
                </select>
              </div>
              <input
                type="text"
                placeholder="Label (optional)"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
              <div className="flex justify-end">
                <button
                  onClick={addToWatchlist}
                  disabled={!newAddress.trim()}
                  className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Plus className="h-4 w-4" />
                  {t.alerts.addToWatchlist}
                </button>
              </div>
            </div>
          )}

          {/* Watchlist entries */}
          {watchlist.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card py-16">
              <EyeOff className="h-10 w-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {t.common.noData}
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
              >
                <Plus className="h-4 w-4" />
                {t.alerts.addToWatchlist}
              </button>
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card">
              <div className="divide-y divide-border">
                {watchlist.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 px-4 py-3"
                  >
                    {/* Shield icon */}
                    <div
                      className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${riskColor(
                        item.riskLevel
                      )}`}
                    >
                      <Eye className="h-4 w-4" />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-mono truncate">
                          {truncateAddress(item.address)}
                        </p>
                        {/* Network badge */}
                        <span
                          className={`flex-shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold ${networkBadgeColor(
                            item.network
                          )}`}
                        >
                          {item.network}
                        </span>
                        {/* Risk badge */}
                        <span
                          className={`flex-shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${riskColor(
                            item.riskLevel
                          )}`}
                        >
                          {riskLabel(item.riskLevel, t)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {item.label}
                      </p>
                      <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {item.lastChecked}
                      </p>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => removeFromWatchlist(item.id)}
                      className="flex-shrink-0 flex items-center gap-1 rounded-lg bg-red-500/10 px-2.5 py-1.5 text-[11px] font-medium text-red-500 transition-colors hover:bg-red-500/20"
                      title={t.alerts.removeFromWatchlist}
                    >
                      <Trash2 className="h-3 w-3" />
                      <span className="hidden sm:inline">
                        {t.alerts.removeFromWatchlist}
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
