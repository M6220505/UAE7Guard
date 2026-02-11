"use client"

import React from "react"
import { useI18n } from "@/lib/i18n"
import { useAuth } from "@/components/auth-provider"
import { useTheme } from "next-themes"
import { Moon, Sun, Globe, Bell } from "lucide-react"

export function DashboardHeader() {
  const { locale, setLocale, t } = useI18n()
  const { user } = useAuth()
  const { theme, setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/80 backdrop-blur-sm px-4 lg:px-6">
      {/* Spacer for mobile menu button */}
      <div className="w-10 lg:hidden" />

      {/* Title area - responsive */}
      <div className="hidden lg:block">
        <h2 className="text-sm font-medium text-muted-foreground">UAE7Guard</h2>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-2">
        {/* Language toggle */}
        <button
          onClick={() => setLocale(locale === "en" ? "ar" : "en")}
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        >
          <Globe className="h-4 w-4" />
          <span className="font-medium">{locale === "en" ? "AR" : "EN"}</span>
        </button>

        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Notifications */}
        <button className="relative rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-0.5 -end-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] text-white">
            3
          </span>
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-2 rounded-lg px-2 py-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600/20 text-emerald-600 text-sm font-medium">
            {user?.email?.[0]?.toUpperCase() || "U"}
          </div>
          <span className="hidden text-sm font-medium md:block">
            {user?.email?.split("@")[0] || "User"}
          </span>
        </div>
      </div>
    </header>
  )
}
