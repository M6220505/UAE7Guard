"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useI18n } from "@/lib/i18n"
import { useAuth } from "@/components/auth-provider"
import {
  LayoutDashboard,
  Search,
  Eye,
  Brain,
  Shield,
  Bell,
  User,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

interface NavItem {
  href: string
  labelKey: keyof typeof import("@/lib/i18n").translations.en.nav
  icon: React.ElementType
}

const navItems: NavItem[] = [
  { href: "/dashboard", labelKey: "dashboard", icon: LayoutDashboard },
  { href: "/dashboard/scam-checker", labelKey: "scamChecker", icon: Search },
  { href: "/dashboard/monitoring", labelKey: "monitoring", icon: Eye },
  { href: "/dashboard/ai-analysis", labelKey: "aiAnalysis", icon: Brain },
  { href: "/dashboard/escrow", labelKey: "escrow", icon: Shield },
  { href: "/dashboard/alerts", labelKey: "alerts", icon: Bell },
  { href: "/dashboard/reports", labelKey: "reports", icon: FileText },
  { href: "/dashboard/profile", labelKey: "profile", icon: User },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { t, locale } = useI18n()
  const { signOut } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard"
    return pathname?.startsWith(href)
  }

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-border/50 px-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-sm flex-shrink-0">
          U7
        </div>
        {!collapsed && (
          <span className="text-lg font-bold tracking-tight">UAE7Guard</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-emerald-600/10 text-emerald-500"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{t.nav[item.labelKey]}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border/50 p-3 space-y-1">
        <button
          onClick={() => signOut()}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span>{t.nav.signOut}</span>}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed left-4 top-4 z-50 rounded-lg bg-card p-2 shadow-lg border border-border lg:hidden"
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed inset-y-0 z-40 w-64 transform border-e border-border bg-card transition-transform duration-200 lg:hidden ${
          locale === "ar" ? "right-0" : "left-0"
        } ${
          mobileOpen
            ? "translate-x-0"
            : locale === "ar"
            ? "translate-x-full"
            : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 border-e border-border bg-card transition-all duration-200 ${
          locale === "ar" ? "right-0" : "left-0"
        } ${collapsed ? "w-[68px]" : "w-64"}`}
      >
        {sidebarContent}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -end-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:text-foreground"
        >
          {collapsed ? (
            locale === "ar" ? <ChevronLeft className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />
          ) : (
            locale === "ar" ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />
          )}
        </button>
      </aside>
    </>
  )
}
