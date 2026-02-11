"use client"

import React, { useState } from "react"
import { useI18n } from "@/lib/i18n"
import {
  FileText,
  Plus,
  Filter,
  Search,
  AlertTriangle,
  CheckCircle,
  Clock,
  ExternalLink,
  ChevronDown,
  X,
  Eye,
} from "lucide-react"

type ReportStatus = "Pending" | "Verified" | "Rejected"
type ScamType = "Phishing" | "Rug Pull" | "Honeypot" | "Fake ICO" | "Pump & Dump" | "Other"
type Severity = "Low" | "Medium" | "High" | "Critical"
type Network = "Ethereum" | "Bitcoin" | "Polygon" | "Arbitrum" | "Optimism" | "BSC"

interface DemoReport {
  id: string
  scamType: ScamType
  address: string
  network: Network
  status: ReportStatus
  severity: Severity
  date: string
  description: string
}

const demoReports: DemoReport[] = [
  {
    id: "RPT-2026-001",
    scamType: "Phishing",
    address: "0x742d35Cc6634C0532925a3b844Bc9e7595f2dB2e",
    network: "Ethereum",
    status: "Verified",
    severity: "High",
    date: "2026-02-08",
    description: "Fake MetaMask approval site draining wallets",
  },
  {
    id: "RPT-2026-002",
    scamType: "Rug Pull",
    address: "0x1a2B3c4D5e6F7890AbCdEf1234567890aBcDeF12",
    network: "BSC",
    status: "Pending",
    severity: "Critical",
    date: "2026-02-07",
    description: "Token liquidity removed after launch, developers disappeared",
  },
  {
    id: "RPT-2026-003",
    scamType: "Honeypot",
    address: "0xDeAdBeEf00000000000000000000000000000001",
    network: "Polygon",
    status: "Verified",
    severity: "High",
    date: "2026-02-05",
    description: "Token contract prevents selling after purchase",
  },
  {
    id: "RPT-2026-004",
    scamType: "Fake ICO",
    address: "0xaBcDeF1234567890AbCdEf1234567890aBcDeF34",
    network: "Ethereum",
    status: "Rejected",
    severity: "Medium",
    date: "2026-02-03",
    description: "Reported as fake ICO but verified as legitimate project",
  },
  {
    id: "RPT-2026-005",
    scamType: "Pump & Dump",
    address: "0x9876543210FeDcBa9876543210FeDcBa98765432",
    network: "Arbitrum",
    status: "Pending",
    severity: "Medium",
    date: "2026-02-02",
    description: "Coordinated pump group promoting low-cap token",
  },
  {
    id: "RPT-2026-006",
    scamType: "Phishing",
    address: "0xFe3C4a1B2d5E6f7890aBcDeF1234567890AbCdEf",
    network: "Optimism",
    status: "Verified",
    severity: "Critical",
    date: "2026-01-30",
    description: "Airdrop claim site stealing private keys",
  },
  {
    id: "RPT-2026-007",
    scamType: "Other",
    address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    network: "Bitcoin",
    status: "Pending",
    severity: "Low",
    date: "2026-01-28",
    description: "Suspicious address linked to social engineering scam",
  },
]

const scamTypes: ScamType[] = ["Phishing", "Rug Pull", "Honeypot", "Fake ICO", "Pump & Dump", "Other"]
const networks: Network[] = ["Ethereum", "Bitcoin", "Polygon", "Arbitrum", "Optimism", "BSC"]
const severities: Severity[] = ["Low", "Medium", "High", "Critical"]

function truncateAddress(address: string): string {
  if (address.length <= 16) return address
  return `${address.slice(0, 8)}...${address.slice(-6)}`
}

function getStatusIcon(status: ReportStatus) {
  switch (status) {
    case "Pending":
      return <Clock className="h-3.5 w-3.5" />
    case "Verified":
      return <CheckCircle className="h-3.5 w-3.5" />
    case "Rejected":
      return <X className="h-3.5 w-3.5" />
  }
}

function getStatusClasses(status: ReportStatus): string {
  switch (status) {
    case "Pending":
      return "bg-yellow-500/10 text-yellow-500"
    case "Verified":
      return "bg-emerald-500/10 text-emerald-500"
    case "Rejected":
      return "bg-red-500/10 text-red-500"
  }
}

function getSeverityClasses(severity: Severity): string {
  switch (severity) {
    case "Low":
      return "bg-blue-500/10 text-blue-500"
    case "Medium":
      return "bg-yellow-500/10 text-yellow-500"
    case "High":
      return "bg-orange-500/10 text-orange-500"
    case "Critical":
      return "bg-red-500/10 text-red-500"
  }
}

function getNetworkClasses(network: Network): string {
  switch (network) {
    case "Ethereum":
      return "bg-blue-500/10 text-blue-400"
    case "Bitcoin":
      return "bg-orange-500/10 text-orange-400"
    case "Polygon":
      return "bg-purple-500/10 text-purple-400"
    case "Arbitrum":
      return "bg-cyan-500/10 text-cyan-400"
    case "Optimism":
      return "bg-red-500/10 text-red-400"
    case "BSC":
      return "bg-yellow-500/10 text-yellow-400"
  }
}

function getScamTypeIcon(scamType: ScamType) {
  switch (scamType) {
    case "Phishing":
      return <AlertTriangle className="h-4 w-4 text-orange-400" />
    case "Rug Pull":
      return <AlertTriangle className="h-4 w-4 text-red-400" />
    case "Honeypot":
      return <AlertTriangle className="h-4 w-4 text-yellow-400" />
    case "Fake ICO":
      return <AlertTriangle className="h-4 w-4 text-purple-400" />
    case "Pump & Dump":
      return <AlertTriangle className="h-4 w-4 text-cyan-400" />
    case "Other":
      return <FileText className="h-4 w-4 text-muted-foreground" />
  }
}

export default function ReportsPage() {
  const { t } = useI18n()

  // Form state
  const [formScamType, setFormScamType] = useState<ScamType | "">("")
  const [formAddress, setFormAddress] = useState("")
  const [formNetwork, setFormNetwork] = useState<Network | "">("")
  const [formSeverity, setFormSeverity] = useState<Severity | "">("")
  const [formDescription, setFormDescription] = useState("")
  const [formEvidenceUrl, setFormEvidenceUrl] = useState("")
  const [showForm, setShowForm] = useState(false)

  // Filter state
  const [statusFilter, setStatusFilter] = useState<"All" | ReportStatus>("All")
  const [searchQuery, setSearchQuery] = useState("")

  // Stats
  const totalReports = demoReports.length
  const verifiedCount = demoReports.filter((r) => r.status === "Verified").length
  const pendingCount = demoReports.filter((r) => r.status === "Pending").length
  const rejectedCount = demoReports.filter((r) => r.status === "Rejected").length

  // Filtered reports
  const filteredReports = demoReports.filter((report) => {
    const matchesStatus = statusFilter === "All" || report.status === statusFilter
    const matchesSearch =
      searchQuery === "" ||
      report.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.scamType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Reset form
    setFormScamType("")
    setFormAddress("")
    setFormNetwork("")
    setFormSeverity("")
    setFormDescription("")
    setFormEvidenceUrl("")
    setShowForm(false)
  }

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t.nav.reports}</h1>
          <p className="text-muted-foreground">
            Submit and track scam reports to protect the community
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Submit Report
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Reports</p>
              <p className="text-2xl font-bold">{totalReports}</p>
            </div>
            <div className="rounded-lg bg-emerald-500/10 p-2.5 text-emerald-500">
              <FileText className="h-5 w-5" />
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Verified</p>
              <p className="text-2xl font-bold text-emerald-500">{verifiedCount}</p>
            </div>
            <div className="rounded-lg bg-emerald-500/10 p-2.5 text-emerald-500">
              <CheckCircle className="h-5 w-5" />
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold text-yellow-500">{pendingCount}</p>
            </div>
            <div className="rounded-lg bg-yellow-500/10 p-2.5 text-yellow-500">
              <Clock className="h-5 w-5" />
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Rejected</p>
              <p className="text-2xl font-bold text-red-500">{rejectedCount}</p>
            </div>
            <div className="rounded-lg bg-red-500/10 p-2.5 text-red-500">
              <X className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Submit Report Form */}
      {showForm && (
        <div className="rounded-xl border border-border bg-card p-5 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Plus className="h-5 w-5 text-emerald-500" />
              Submit Report
            </h2>
            <button
              onClick={() => setShowForm(false)}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Scam Type */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-muted-foreground">
                  Scam Type
                </label>
                <div className="relative">
                  <select
                    value={formScamType}
                    onChange={(e) => setFormScamType(e.target.value as ScamType)}
                    required
                    className="w-full appearance-none rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="" disabled>
                      Select scam type
                    </option>
                    {scamTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>

              {/* Network */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-muted-foreground">
                  Network
                </label>
                <div className="relative">
                  <select
                    value={formNetwork}
                    onChange={(e) => setFormNetwork(e.target.value as Network)}
                    required
                    className="w-full appearance-none rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="" disabled>
                      Select network
                    </option>
                    {networks.map((network) => (
                      <option key={network} value={network}>
                        {network}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>

              {/* Scam Address */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-muted-foreground">
                  Scam Address
                </label>
                <input
                  type="text"
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  required
                  placeholder="0x... or bc1..."
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-mono focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* Severity */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-muted-foreground">
                  Severity Level
                </label>
                <div className="relative">
                  <select
                    value={formSeverity}
                    onChange={(e) => setFormSeverity(e.target.value as Severity)}
                    required
                    className="w-full appearance-none rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="" disabled>
                      Select severity
                    </option>
                    {severities.map((sev) => (
                      <option key={sev} value={sev}>
                        {sev}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">
                Description
              </label>
              <textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                required
                rows={4}
                placeholder="Describe the scam in detail..."
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none resize-none"
              />
            </div>

            {/* Evidence URL */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">
                Evidence URL{" "}
                <span className="text-xs text-muted-foreground font-normal">(optional)</span>
              </label>
              <input
                type="url"
                value={formEvidenceUrl}
                onChange={(e) => setFormEvidenceUrl(e.target.value)}
                placeholder="https://..."
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
              >
                {t.common.submit}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg border border-border px-6 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
              >
                {t.common.cancel}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* My Reports Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">My Reports</h2>

        {/* Filters */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
            {(["All", "Pending", "Verified", "Rejected"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  statusFilter === status
                    ? "bg-emerald-600 text-white"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  {status === "All" && <Filter className="h-3.5 w-3.5" />}
                  {status === "Pending" && <Clock className="h-3.5 w-3.5" />}
                  {status === "Verified" && <CheckCircle className="h-3.5 w-3.5" />}
                  {status === "Rejected" && <X className="h-3.5 w-3.5" />}
                  {status}
                </span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`${t.common.search} reports...`}
              className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm focus:border-emerald-500 focus:outline-none sm:w-72"
            />
          </div>
        </div>

        {/* Reports List */}
        <div className="space-y-3">
          {filteredReports.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-10 text-center">
              <FileText className="mx-auto h-10 w-10 text-muted-foreground/50" />
              <p className="mt-3 text-sm text-muted-foreground">{t.common.noData}</p>
            </div>
          ) : (
            filteredReports.map((report) => (
              <div
                key={report.id}
                className="rounded-xl border border-border bg-card p-5 transition-all hover:shadow-md hover:border-emerald-500/20"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  {/* Left side */}
                  <div className="flex-1 space-y-3">
                    {/* Top row: ID + badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-muted-foreground">
                        {report.id}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusClasses(
                          report.status
                        )}`}
                      >
                        {getStatusIcon(report.status)}
                        {report.status}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getSeverityClasses(
                          report.severity
                        )}`}
                      >
                        {report.severity}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getNetworkClasses(
                          report.network
                        )}`}
                      >
                        {report.network}
                      </span>
                    </div>

                    {/* Scam type + address */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        {getScamTypeIcon(report.scamType)}
                        <span className="text-sm font-medium">{report.scamType}</span>
                      </div>
                      <span className="text-muted-foreground">|</span>
                      <code className="rounded bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">
                        {truncateAddress(report.address)}
                      </code>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground">{report.description}</p>

                    {/* Date */}
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      Submitted {report.date}
                    </div>
                  </div>

                  {/* Right side: action */}
                  <div className="flex-shrink-0">
                    <button className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                      <Eye className="h-4 w-4" />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
