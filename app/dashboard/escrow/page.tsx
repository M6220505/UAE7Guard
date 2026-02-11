"use client"

import React, { useState } from "react"
import { useI18n } from "@/lib/i18n"
import {
  Shield,
  Plus,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Lock,
  Unlock,
  FileText,
  Users,
  DollarSign,
  ArrowRight,
  ChevronDown,
} from "lucide-react"

type EscrowStatus = "pending" | "funded" | "released" | "disputed" | "cancelled"
type EscrowCategory = "realEstate" | "vehicle" | "luxuryWatch" | "crypto" | "other"

interface EscrowTransaction {
  id: string
  category: EscrowCategory
  amount: number
  currency: string
  buyer: string
  seller: string
  status: EscrowStatus
  description: string
  createdAt: string
  multiSig: boolean
}

const demoEscrows: EscrowTransaction[] = [
  {
    id: "ESC-001",
    category: "realEstate",
    amount: 2500000,
    currency: "AED",
    buyer: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD3e",
    seller: "0x8Ba1f109551bD432803012645Ac136ddd64DBA72",
    status: "pending",
    description: "Dubai Marina apartment purchase - 2BR unit",
    createdAt: "2026-02-08",
    multiSig: true,
  },
  {
    id: "ESC-002",
    category: "luxuryWatch",
    amount: 15.5,
    currency: "ETH",
    buyer: "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B",
    seller: "0x1aE0EA34a72D944a8C7603FfB3eC30a6669E454C",
    status: "funded",
    description: "Patek Philippe Nautilus 5711/1A - Box & Papers",
    createdAt: "2026-02-06",
    multiSig: false,
  },
  {
    id: "ESC-003",
    category: "crypto",
    amount: 50000,
    currency: "USDT",
    buyer: "0xdD870fA1b7C4700F2BD7f44238821C26f7392148",
    seller: "0x583031D1113aD414F02576BD6afaBfb302140225",
    status: "disputed",
    description: "OTC BTC trade - 2.5 BTC at agreed rate",
    createdAt: "2026-02-03",
    multiSig: true,
  },
]

const categoryIcons: Record<EscrowCategory, React.ElementType> = {
  realEstate: FileText,
  vehicle: Shield,
  luxuryWatch: Clock,
  crypto: DollarSign,
  other: FileText,
}

function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

function getStatusColor(status: EscrowStatus): string {
  switch (status) {
    case "pending":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
    case "funded":
      return "bg-blue-500/10 text-blue-500 border-blue-500/20"
    case "released":
      return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
    case "disputed":
      return "bg-red-500/10 text-red-500 border-red-500/20"
    case "cancelled":
      return "bg-gray-500/10 text-gray-500 border-gray-500/20"
  }
}

function getStatusIcon(status: EscrowStatus): React.ElementType {
  switch (status) {
    case "pending":
      return Clock
    case "funded":
      return Lock
    case "released":
      return Unlock
    case "disputed":
      return AlertTriangle
    case "cancelled":
      return XCircle
  }
}

function formatAmount(amount: number, currency: string): string {
  if (currency === "AED") {
    return `${amount.toLocaleString()} AED`
  }
  if (currency === "ETH") {
    return `${amount} ETH`
  }
  if (currency === "BTC") {
    return `${amount} BTC`
  }
  if (currency === "USDT") {
    return `${amount.toLocaleString()} USDT`
  }
  return `${amount.toLocaleString()} ${currency}`
}

export default function EscrowPage() {
  const { t } = useI18n()
  const [activeTab, setActiveTab] = useState<"active" | "create">("active")
  const [multiSigEnabled, setMultiSigEnabled] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedCurrency, setSelectedCurrency] = useState("AED")

  const stats = [
    {
      label: "Total Active",
      value: "3",
      icon: Shield,
      color: "bg-emerald-500/10 text-emerald-500",
    },
    {
      label: "Total Value Locked",
      value: "2,567,750 AED",
      icon: Lock,
      color: "bg-blue-500/10 text-blue-500",
    },
    {
      label: t.escrow.completedEscrows,
      value: "24",
      icon: CheckCircle,
      color: "bg-emerald-500/10 text-emerald-500",
    },
    {
      label: t.escrow.disputed,
      value: "1",
      icon: AlertTriangle,
      color: "bg-red-500/10 text-red-500",
    },
  ]

  const features = [
    {
      icon: Users,
      title: t.escrow.multiSig,
      description: "Require multiple parties to approve fund release for enhanced security.",
      color: "bg-purple-500/10 text-purple-500",
    },
    {
      icon: AlertTriangle,
      title: t.escrow.disputeResolution,
      description: "Built-in arbitration system for resolving transaction disputes.",
      color: "bg-orange-500/10 text-orange-500",
    },
    {
      icon: Clock,
      title: "Automatic Release",
      description: "Funds are automatically released when all conditions are met.",
      color: "bg-blue-500/10 text-blue-500",
    },
    {
      icon: DollarSign,
      title: "Low Fees",
      description: "Competitive 0.5% escrow fee with no hidden charges.",
      color: "bg-emerald-500/10 text-emerald-500",
    },
  ]

  const categoryOptions: { value: EscrowCategory; label: string }[] = [
    { value: "realEstate", label: t.escrow.realEstate },
    { value: "vehicle", label: t.escrow.vehicle },
    { value: "luxuryWatch", label: t.escrow.luxuryWatch },
    { value: "crypto", label: t.escrow.crypto },
    { value: "other", label: t.escrow.other },
  ]

  const currencyOptions = ["AED", "ETH", "BTC", "USDT"]

  const getCategoryLabel = (cat: EscrowCategory): string => {
    const map: Record<EscrowCategory, string> = {
      realEstate: t.escrow.realEstate,
      vehicle: t.escrow.vehicle,
      luxuryWatch: t.escrow.luxuryWatch,
      crypto: t.escrow.crypto,
      other: t.escrow.other,
    }
    return map[cat]
  }

  const getStatusLabel = (status: EscrowStatus): string => {
    const map: Record<EscrowStatus, string> = {
      pending: t.escrow.pending,
      funded: t.escrow.funded,
      released: t.escrow.released,
      disputed: t.escrow.disputed,
      cancelled: t.escrow.cancelled,
    }
    return map[status]
  }

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">{t.escrow.title}</h1>
        <p className="text-muted-foreground">{t.escrow.subtitle}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-card p-5 transition-all hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`rounded-lg p-2.5 ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Feature Highlights */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => {
          const Icon = feature.icon
          return (
            <div
              key={feature.title}
              className="rounded-xl border border-border bg-card p-5 transition-all hover:shadow-md"
            >
              <div className={`inline-flex rounded-lg p-2.5 ${feature.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-3 font-medium">{feature.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          )
        })}
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab("active")}
            className={`pb-3 text-sm transition-colors ${
              activeTab === "active"
                ? "border-b-2 border-emerald-500 text-emerald-500 font-medium"
                : "text-muted-foreground"
            }`}
          >
            {t.escrow.activeEscrows}
          </button>
          <button
            onClick={() => setActiveTab("create")}
            className={`flex items-center gap-2 pb-3 text-sm transition-colors ${
              activeTab === "create"
                ? "border-b-2 border-emerald-500 text-emerald-500 font-medium"
                : "text-muted-foreground"
            }`}
          >
            <Plus className="h-4 w-4" />
            {t.escrow.createEscrow}
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "active" && (
        <div className="space-y-4">
          {demoEscrows.map((escrow) => {
            const CategoryIcon = categoryIcons[escrow.category]
            const StatusIcon = getStatusIcon(escrow.status)
            return (
              <div
                key={escrow.id}
                className="rounded-xl border border-border bg-card p-5 transition-all hover:shadow-md"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  {/* Left: Info */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                      <CategoryIcon className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">{escrow.id}</h3>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                            escrow.status
                          )}`}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {getStatusLabel(escrow.status)}
                        </span>
                        {escrow.multiSig && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-purple-500/20 bg-purple-500/10 px-2.5 py-0.5 text-xs font-medium text-purple-500">
                            <Users className="h-3 w-3" />
                            {t.escrow.multiSig}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {escrow.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          {getCategoryLabel(escrow.category)}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <ArrowRight className="h-3 w-3" />
                          {t.escrow.buyer}: {truncateAddress(escrow.buyer)}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <ArrowRight className="h-3 w-3" />
                          {t.escrow.seller}: {truncateAddress(escrow.seller)}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {escrow.createdAt}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Amount & Actions */}
                  <div className="flex flex-col items-end gap-3">
                    <p className="text-lg font-bold">
                      {formatAmount(escrow.amount, escrow.currency)}
                    </p>
                    <div className="flex gap-2">
                      {escrow.status === "pending" && (
                        <button className="rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 transition-colors">
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            Fund
                          </span>
                        </button>
                      )}
                      {escrow.status === "funded" && (
                        <>
                          <button className="rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 transition-colors">
                            <span className="flex items-center gap-1">
                              <Unlock className="h-3 w-3" />
                              Release
                            </span>
                          </button>
                          <button className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-xs font-medium text-red-500 hover:bg-red-500/20 transition-colors">
                            <span className="flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              Dispute
                            </span>
                          </button>
                        </>
                      )}
                      {escrow.status === "disputed" && (
                        <button className="rounded-lg border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-medium text-orange-500 hover:bg-orange-500/20 transition-colors">
                          <span className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {t.escrow.disputeResolution}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {activeTab === "create" && (
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-6">
            <h2 className="text-lg font-semibold">{t.escrow.createEscrow}</h2>
            <p className="text-sm text-muted-foreground">
              Set up a secure escrow transaction between buyer and seller.
            </p>
          </div>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="space-y-5"
          >
            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">{t.escrow.category}</label>
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  {categoryOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            {/* Amount + Currency */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-sm font-medium">{t.escrow.amount}</label>
                <input
                  type="number"
                  placeholder="0.00"
                  min="0"
                  step="any"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">{t.escrow.currency}</label>
                <div className="relative">
                  <select
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    {currencyOptions.map((cur) => (
                      <option key={cur} value={cur}>
                        {cur}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
            </div>

            {/* Buyer Wallet */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">{t.escrow.buyer} Wallet Address</label>
              <input
                type="text"
                placeholder="0x..."
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Seller Wallet */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">{t.escrow.seller} Wallet Address</label>
              <input
                type="text"
                placeholder="0x..."
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Description</label>
              <textarea
                rows={3}
                placeholder="Describe the transaction details..."
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
              />
            </div>

            {/* Multi-Signature Toggle */}
            <div className="flex items-center justify-between rounded-lg border border-border bg-background p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-purple-500/10 p-2 text-purple-500">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">{t.escrow.multiSig}</p>
                  <p className="text-xs text-muted-foreground">
                    Require multiple approvals to release funds
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMultiSigEnabled(!multiSigEnabled)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${
                  multiSigEnabled ? "bg-emerald-600" : "bg-muted"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                    multiSigEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Escrow Fee Notice */}
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-emerald-500" />
                <span className="font-medium text-emerald-500">{t.escrow.escrowFee}:</span>
                <span className="text-muted-foreground">
                  0.5% of transaction value
                </span>
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab("active")}
                className="rounded-lg border border-border px-6 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
              >
                {t.common.cancel}
              </button>
              <button
                type="submit"
                className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  {t.escrow.createEscrow}
                </span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
