"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useI18n } from "@/lib/i18n"
import { useAuth } from "@/components/auth-provider"
import {
  Shield,
  Search,
  Eye,
  Brain,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Activity,
  ArrowUpRight,
  Wallet,
  Users,
  BarChart3,
  Clock,
} from "lucide-react"

interface StatCardProps {
  title: string
  value: string
  change: string
  changeType: "up" | "down" | "neutral"
  icon: React.ElementType
  color: string
}

function StatCard({ title, value, change, changeType, icon: Icon, color }: StatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 transition-all hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold animate-count-up">{value}</p>
          <p
            className={`flex items-center gap-1 text-xs font-medium ${
              changeType === "up"
                ? "text-emerald-500"
                : changeType === "down"
                ? "text-red-500"
                : "text-muted-foreground"
            }`}
          >
            {changeType === "up" && <TrendingUp className="h-3 w-3" />}
            {change}
          </p>
        </div>
        <div className={`rounded-lg p-2.5 ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  )
}

interface QuickActionProps {
  href: string
  title: string
  description: string
  icon: React.ElementType
  color: string
}

function QuickAction({ href, title, description, icon: Icon, color }: QuickActionProps) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-emerald-500/30 hover:shadow-md"
    >
      <div className={`rounded-lg p-2.5 ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground truncate">{description}</p>
      </div>
      <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
    </Link>
  )
}

interface ActivityItem {
  id: string
  type: "check" | "alert" | "report" | "monitoring"
  message: string
  time: string
  severity: "safe" | "warning" | "danger"
}

const recentActivities: ActivityItem[] = [
  {
    id: "1",
    type: "check",
    message: "Wallet 0x742d...4B2e verified as safe on Ethereum",
    time: "2 min ago",
    severity: "safe",
  },
  {
    id: "2",
    type: "alert",
    message: "Suspicious activity detected on monitored wallet",
    time: "15 min ago",
    severity: "warning",
  },
  {
    id: "3",
    type: "report",
    message: "New scam report submitted for Polygon address",
    time: "1 hour ago",
    severity: "danger",
  },
  {
    id: "4",
    type: "monitoring",
    message: "Large transaction detected: 5.2 ETH transferred",
    time: "2 hours ago",
    severity: "warning",
  },
  {
    id: "5",
    type: "check",
    message: "Bitcoin address verified against 3 databases",
    time: "3 hours ago",
    severity: "safe",
  },
]

const networkData = [
  { name: "Ethereum", scans: 45200, threats: 3420, color: "bg-blue-500" },
  { name: "Bitcoin", scans: 28100, threats: 1890, color: "bg-orange-500" },
  { name: "Polygon", scans: 18500, threats: 980, color: "bg-purple-500" },
  { name: "Arbitrum", scans: 12300, threats: 540, color: "bg-cyan-500" },
  { name: "Optimism", scans: 8900, threats: 320, color: "bg-red-500" },
  { name: "zkSync", scans: 5400, threats: 180, color: "bg-indigo-500" },
]

export function DashboardContent() {
  const { t } = useI18n()
  const { user } = useAuth()
  const [stats, setStats] = useState({
    walletsChecked: "125,847",
    scamsDetected: "8,521",
    valueProtected: "$42.3M",
    activeUsers: "1,256",
  })

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold">{t.dashboard.title}</h1>
        <p className="text-muted-foreground">
          {t.dashboard.subtitle}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t.dashboard.walletsChecked}
          value={stats.walletsChecked}
          change="+12.5% this month"
          changeType="up"
          icon={Wallet}
          color="bg-emerald-500/10 text-emerald-500"
        />
        <StatCard
          title={t.dashboard.scamsDetected}
          value={stats.scamsDetected}
          change="+8.2% this month"
          changeType="up"
          icon={AlertTriangle}
          color="bg-red-500/10 text-red-500"
        />
        <StatCard
          title={t.dashboard.valueProtected}
          value={stats.valueProtected}
          change="+24.1% this month"
          changeType="up"
          icon={Shield}
          color="bg-blue-500/10 text-blue-500"
        />
        <StatCard
          title={t.dashboard.activeUsers}
          value={stats.activeUsers}
          change="+5.8% this month"
          changeType="up"
          icon={Users}
          color="bg-purple-500/10 text-purple-500"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quick Actions */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-lg font-semibold">{t.dashboard.quickActions}</h2>
          <div className="space-y-3">
            <QuickAction
              href="/dashboard/scam-checker"
              title={t.dashboard.checkAddress}
              description="Verify any blockchain address"
              icon={Search}
              color="bg-emerald-500/10 text-emerald-500"
            />
            <QuickAction
              href="/dashboard/monitoring"
              title={t.dashboard.startMonitoring}
              description="Track wallets in real-time"
              icon={Eye}
              color="bg-blue-500/10 text-blue-500"
            />
            <QuickAction
              href="/dashboard/ai-analysis"
              title="AI Risk Analysis"
              description="Deep learning fraud detection"
              icon={Brain}
              color="bg-purple-500/10 text-purple-500"
            />
            <QuickAction
              href="/dashboard/escrow"
              title="Secure Escrow"
              description="Safe P2P trading"
              icon={Shield}
              color="bg-orange-500/10 text-orange-500"
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{t.dashboard.recentActivity}</h2>
            <Link
              href="/dashboard/alerts"
              className="text-sm text-emerald-500 hover:underline"
            >
              {t.common.viewAll}
            </Link>
          </div>
          <div className="rounded-xl border border-border bg-card">
            <div className="divide-y divide-border">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-3 px-4 py-3"
                >
                  <div
                    className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                      activity.severity === "safe"
                        ? "bg-emerald-500/10 text-emerald-500"
                        : activity.severity === "warning"
                        ? "bg-yellow-500/10 text-yellow-500"
                        : "bg-red-500/10 text-red-500"
                    }`}
                  >
                    {activity.severity === "safe" ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : activity.severity === "warning" ? (
                      <AlertTriangle className="h-4 w-4" />
                    ) : (
                      <Activity className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{activity.message}</p>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Network Statistics */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">{t.dashboard.networkStats}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {networkData.map((network) => (
            <div
              key={network.name}
              className="rounded-xl border border-border bg-card p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full ${network.color}`} />
                  <span className="font-medium">{network.name}</span>
                </div>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Scans</p>
                  <p className="text-lg font-semibold">
                    {network.scans.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Threats</p>
                  <p className="text-lg font-semibold text-red-500">
                    {network.threats.toLocaleString()}
                  </p>
                </div>
              </div>
              {/* Progress bar */}
              <div className="h-1.5 w-full rounded-full bg-muted">
                <div
                  className={`h-1.5 rounded-full ${network.color}`}
                  style={{
                    width: `${(network.threats / network.scans) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
