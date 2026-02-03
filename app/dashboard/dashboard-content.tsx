"use client"

import { Header } from "@/components/ui/header"
import { BottomNav } from "@/components/ui/bottom-nav"
import type { User } from "@/lib/auth"

interface DashboardContentProps {
  user: User
}

export function DashboardContent({ user }: DashboardContentProps) {
  const stats = [
    { label: "Risk Detection", value: "355%", sublabel: "Increase YoY", highlight: true },
    { label: "Success Rate", value: "$9.5%", sublabel: "False Positives" },
    { label: "Expert Match", value: "$7.0%", sublabel: "AI Accuracy" },
    { label: "Blocked Value", value: "$2.3%", sublabel: "Protected" },
  ]

  const chartData = [40, 65, 45, 80, 55, 90, 50, 75, 60, 85, 70, 95]
  const months = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"]

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 px-4 py-6 pb-24">
        <div className="mx-auto max-w-lg space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold">
              Community-Powered
              <br />
              <span className="text-muted-foreground">Protection.</span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Enterprise-grade verification combining blockchain intelligence (Alchemy) with AI behavioral analysis (GPT-4o)
            </p>
          </div>

          {/* Tabs */}
          <div className="flex rounded-lg bg-secondary p-1">
            {["Overview", "API", "Reports", "Alerts"].map((tab, i) => (
              <button
                key={tab}
                className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                  i === 0 ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                }`}
              >
                {i === 0 && (
                  <svg className="mx-auto h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="9"></rect>
                    <rect x="14" y="3" width="7" height="5"></rect>
                    <rect x="14" y="12" width="7" height="9"></rect>
                    <rect x="3" y="16" width="7" height="5"></rect>
                  </svg>
                )}
                {i === 1 && (
                  <svg className="mx-auto h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                )}
                {i === 2 && (
                  <svg className="mx-auto h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                )}
                {i === 3 && (
                  <svg className="mx-auto h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                )}
              </button>
            ))}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className={`rounded-xl p-4 ${
                  stat.highlight
                    ? "bg-blue-600 text-white"
                    : "border border-border bg-card"
                }`}
              >
                <p className={`text-xs ${stat.highlight ? "text-blue-100" : "text-muted-foreground"}`}>
                  {stat.label}
                </p>
                <p className="mt-1 text-2xl font-bold">{stat.value}</p>
                <p className={`text-xs ${stat.highlight ? "text-blue-100" : "text-muted-foreground"}`}>
                  {stat.sublabel}
                </p>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Community Analysis</h3>
                <p className="text-xs text-muted-foreground">Scam Sightings</p>
              </div>
              <span className="rounded bg-emerald-500/10 px-2 py-1 text-xs text-emerald-500">
                +15.03%
              </span>
            </div>
            <div className="flex h-32 items-end gap-1">
              {chartData.map((value, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t bg-blue-500"
                    style={{ height: `${value}%` }}
                  />
                  <span className="text-[10px] text-muted-foreground">{months[i]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
