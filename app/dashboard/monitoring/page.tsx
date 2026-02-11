"use client"

import React, { useState } from "react"
import { useI18n } from "@/lib/i18n"
import {
  Eye,
  Plus,
  Trash2,
  Pause,
  Play,
  Bell,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
  RefreshCw,
} from "lucide-react"

interface MonitoredWallet {
  id: string
  address: string
  label: string
  network: string
  networkColor: string
  status: "active" | "paused"
  riskLevel: "low" | "medium" | "high"
  lastActivity: string
  alertCount: number
  balance: string
  transactions24h: number
}

interface TransactionAlert {
  id: string
  walletLabel: string
  type: "incoming" | "outgoing" | "suspicious"
  amount: string
  from: string
  to: string
  time: string
}

const initialWallets: MonitoredWallet[] = [
  {
    id: "1",
    address: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD3e",
    label: "Main Treasury",
    network: "Ethereum",
    networkColor: "bg-blue-500",
    status: "active",
    riskLevel: "low",
    lastActivity: "2 min ago",
    alertCount: 0,
    balance: "12.45 ETH",
    transactions24h: 8,
  },
  {
    id: "2",
    address: "0x9A8f92a830A5cB89a3816e3D267CB7791c16b81D",
    label: "DeFi Operations",
    network: "Polygon",
    networkColor: "bg-purple-500",
    status: "active",
    riskLevel: "medium",
    lastActivity: "18 min ago",
    alertCount: 3,
    balance: "5,230 MATIC",
    transactions24h: 24,
  },
  {
    id: "3",
    address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    label: "Suspect Wallet",
    network: "Arbitrum",
    networkColor: "bg-cyan-500",
    status: "paused",
    riskLevel: "high",
    lastActivity: "3 hours ago",
    alertCount: 12,
    balance: "0.87 ETH",
    transactions24h: 47,
  },
]

const demoAlerts: TransactionAlert[] = [
  {
    id: "a1",
    walletLabel: "Main Treasury",
    type: "incoming",
    amount: "+2.5 ETH",
    from: "0x3fC91A...7BcAd5",
    to: "0x742d35...f2bD3e",
    time: "2 min ago",
  },
  {
    id: "a2",
    walletLabel: "DeFi Operations",
    type: "outgoing",
    amount: "-1,200 MATIC",
    from: "0x9A8f92...16b81D",
    to: "0xDef1C0...B4e426",
    time: "18 min ago",
  },
  {
    id: "a3",
    walletLabel: "Suspect Wallet",
    type: "suspicious",
    amount: "0.87 ETH",
    from: "0x1f9840...01F984",
    to: "0xBad000...666DeF",
    time: "3 hours ago",
  },
  {
    id: "a4",
    walletLabel: "DeFi Operations",
    type: "incoming",
    amount: "+800 MATIC",
    from: "0xAave00...PoolV3",
    to: "0x9A8f92...16b81D",
    time: "5 hours ago",
  },
]

function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export default function MonitoringPage() {
  const { t } = useI18n()
  const [wallets, setWallets] = useState<MonitoredWallet[]>(initialWallets)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newWallet, setNewWallet] = useState({
    label: "",
    address: "",
    network: "Ethereum",
  })

  const activeCount = wallets.filter((w) => w.status === "active").length
  const totalAlerts = wallets.reduce((sum, w) => sum + w.alertCount, 0)
  const totalTxns = wallets.reduce((sum, w) => sum + w.transactions24h, 0)
  const riskWallets = wallets.filter(
    (w) => w.riskLevel === "medium" || w.riskLevel === "high"
  ).length

  function handleToggleStatus(id: string) {
    setWallets((prev) =>
      prev.map((w) =>
        w.id === id
          ? { ...w, status: w.status === "active" ? "paused" : "active" }
          : w
      )
    )
  }

  function handleDelete(id: string) {
    setWallets((prev) => prev.filter((w) => w.id !== id))
  }

  function handleAddWallet() {
    if (!newWallet.label.trim() || !newWallet.address.trim()) return

    const networkColors: Record<string, string> = {
      Ethereum: "bg-blue-500",
      Polygon: "bg-purple-500",
      Arbitrum: "bg-cyan-500",
      Bitcoin: "bg-orange-500",
      Optimism: "bg-red-500",
    }

    const wallet: MonitoredWallet = {
      id: Date.now().toString(),
      address: newWallet.address,
      label: newWallet.label,
      network: newWallet.network,
      networkColor: networkColors[newWallet.network] || "bg-gray-500",
      status: "active",
      riskLevel: "low",
      lastActivity: "Just now",
      alertCount: 0,
      balance: "0.00",
      transactions24h: 0,
    }

    setWallets((prev) => [...prev, wallet])
    setNewWallet({ label: "", address: "", network: "Ethereum" })
    setShowAddForm(false)
  }

  function getRiskBadgeClasses(level: "low" | "medium" | "high"): string {
    const base = "rounded-full px-2 py-0.5 text-xs font-medium"
    switch (level) {
      case "low":
        return `${base} bg-emerald-500/10 text-emerald-500`
      case "medium":
        return `${base} bg-yellow-500/10 text-yellow-500`
      case "high":
        return `${base} bg-red-500/10 text-red-500`
    }
  }

  function getAlertTypeClasses(type: "incoming" | "outgoing" | "suspicious") {
    switch (type) {
      case "incoming":
        return {
          bg: "bg-emerald-500/10 text-emerald-500",
          label: "Incoming",
          icon: <CheckCircle className="h-4 w-4" />,
        }
      case "outgoing":
        return {
          bg: "bg-blue-500/10 text-blue-500",
          label: "Outgoing",
          icon: <Activity className="h-4 w-4" />,
        }
      case "suspicious":
        return {
          bg: "bg-red-500/10 text-red-500",
          label: "Suspicious",
          icon: <AlertTriangle className="h-4 w-4" />,
        }
    }
  }

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t.monitoring.title}</h1>
          <p className="text-muted-foreground">{t.monitoring.subtitle}</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          {t.monitoring.addWallet}
        </button>
      </div>

      {/* Add Wallet Form */}
      {showAddForm && (
        <div className="rounded-xl border border-border bg-card p-4 transition-all hover:shadow-md">
          <h3 className="mb-4 text-sm font-semibold">{t.monitoring.addWallet}</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">
                Label
              </label>
              <input
                type="text"
                placeholder="e.g. My Wallet"
                value={newWallet.label}
                onChange={(e) =>
                  setNewWallet((prev) => ({ ...prev, label: e.target.value }))
                }
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">
                {t.monitoring.walletAddress}
              </label>
              <input
                type="text"
                placeholder="0x..."
                value={newWallet.address}
                onChange={(e) =>
                  setNewWallet((prev) => ({ ...prev, address: e.target.value }))
                }
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-mono outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">
                {t.monitoring.network}
              </label>
              <select
                value={newWallet.network}
                onChange={(e) =>
                  setNewWallet((prev) => ({ ...prev, network: e.target.value }))
                }
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              >
                <option value="Ethereum">Ethereum</option>
                <option value="Polygon">Polygon</option>
                <option value="Arbitrum">Arbitrum</option>
                <option value="Bitcoin">Bitcoin</option>
                <option value="Optimism">Optimism</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex gap-2 justify-end">
            <button
              onClick={() => setShowAddForm(false)}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
            >
              {t.common.cancel}
            </button>
            <button
              onClick={handleAddWallet}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
            >
              {t.monitoring.startMonitoring}
            </button>
          </div>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4 transition-all hover:shadow-md">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Active Monitors</p>
              <p className="text-2xl font-bold">{activeCount}</p>
            </div>
            <div className="rounded-lg bg-emerald-500/10 p-2.5 text-emerald-500">
              <Eye className="h-5 w-5" />
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 transition-all hover:shadow-md">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Active Alerts</p>
              <p className="text-2xl font-bold">{totalAlerts}</p>
            </div>
            <div className="rounded-lg bg-red-500/10 p-2.5 text-red-500">
              <Bell className="h-5 w-5" />
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 transition-all hover:shadow-md">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Transactions (24h)</p>
              <p className="text-2xl font-bold">{totalTxns}</p>
            </div>
            <div className="rounded-lg bg-blue-500/10 p-2.5 text-blue-500">
              <Activity className="h-5 w-5" />
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 transition-all hover:shadow-md">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Risk Wallets</p>
              <p className="text-2xl font-bold">{riskWallets}</p>
            </div>
            <div className="rounded-lg bg-yellow-500/10 p-2.5 text-yellow-500">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Monitored Wallets */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Monitored Wallets</h2>
          <button className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </button>
        </div>

        {wallets.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card p-12 text-center">
            <Eye className="h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {t.monitoring.noWallets}
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              {t.monitoring.addWallet}
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {wallets.map((wallet) => (
              <div
                key={wallet.id}
                className="rounded-xl border border-border bg-card p-4 transition-all hover:shadow-md"
              >
                {/* Top section */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${
                        wallet.status === "active"
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Eye className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium truncate">{wallet.label}</p>
                        <span
                          className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium text-white ${wallet.networkColor}`}
                        >
                          {wallet.network}
                        </span>
                      </div>
                      <p className="font-mono text-xs text-muted-foreground">
                        {truncateAddress(wallet.address)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className={getRiskBadgeClasses(wallet.riskLevel)}>
                      {wallet.riskLevel === "low"
                        ? t.common.low.toUpperCase()
                        : wallet.riskLevel === "medium"
                        ? t.common.medium.toUpperCase()
                        : t.common.high.toUpperCase()}
                    </span>
                    {wallet.alertCount > 0 && (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-500">
                        <Bell className="h-3 w-3" />
                        {wallet.alertCount}
                      </span>
                    )}
                  </div>
                </div>

                {/* Divider */}
                <div className="my-3 border-t border-border" />

                {/* Bottom stats */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                      {t.monitoring.lastActivity}
                    </p>
                    <p className="mt-0.5 flex items-center justify-center gap-1 text-xs font-medium">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      {wallet.lastActivity}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                      Balance
                    </p>
                    <p className="mt-0.5 text-xs font-medium">{wallet.balance}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                      Txns (24h)
                    </p>
                    <p className="mt-0.5 text-xs font-medium">
                      {wallet.transactions24h}
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div className="my-3 border-t border-border" />

                {/* Actions */}
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => handleToggleStatus(wallet.id)}
                    title={
                      wallet.status === "active"
                        ? t.monitoring.stopMonitoring
                        : t.monitoring.startMonitoring
                    }
                    className={`rounded-lg p-2 text-sm transition-colors ${
                      wallet.status === "active"
                        ? "text-emerald-500 hover:bg-emerald-500/10"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {wallet.status === "active" ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    title={t.monitoring.alertSettings}
                    className="rounded-lg p-2 text-sm text-muted-foreground hover:bg-muted transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(wallet.id)}
                    className="rounded-lg p-2 text-sm text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Transaction Alerts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{t.monitoring.transactionAlerts}</h2>
          <span className="rounded-full bg-red-500/10 px-2.5 py-0.5 text-xs font-medium text-red-500">
            {demoAlerts.length} alerts
          </span>
        </div>

        <div className="rounded-xl border border-border bg-card">
          <div className="divide-y divide-border">
            {demoAlerts.map((alert) => {
              const typeInfo = getAlertTypeClasses(alert.type)
              return (
                <div
                  key={alert.id}
                  className="flex items-center gap-3 px-4 py-3"
                >
                  <div
                    className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${typeInfo.bg}`}
                  >
                    {typeInfo.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">
                        {alert.walletLabel}
                      </p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${typeInfo.bg}`}
                      >
                        {typeInfo.label}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium">{alert.amount}</span>
                      {" "}
                      <span className="font-mono">{alert.from}</span>
                      {" -> "}
                      <span className="font-mono">{alert.to}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                    <Clock className="h-3 w-3" />
                    {alert.time}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
