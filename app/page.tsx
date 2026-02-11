"use client"

import Link from "next/link"
import { useI18n } from "@/lib/i18n"
import { useAuth } from "@/components/auth-provider"
import { useTheme } from "next-themes"
import {
  Shield,
  Search,
  Eye,
  Brain,
  Lock,
  Globe,
  ArrowRight,
  CheckCircle,
  Users,
  TrendingUp,
  Moon,
  Sun,
  Zap,
  BarChart3,
} from "lucide-react"

const features = [
  {
    icon: Search,
    color: "bg-emerald-500/10 text-emerald-500",
    titleEn: "Scam Detection",
    titleAr: "\u0643\u0634\u0641 \u0627\u0644\u0627\u062d\u062a\u064a\u0627\u0644",
    descEn: "Check addresses against ChainAbuse, BitcoinAbuse, and Etherscan databases in real-time",
    descAr: "\u062a\u062d\u0642\u0642 \u0645\u0646 \u0627\u0644\u0639\u0646\u0627\u0648\u064a\u0646 \u0645\u0642\u0627\u0628\u0644 \u0642\u0648\u0627\u0639\u062f \u0628\u064a\u0627\u0646\u0627\u062a \u0627\u0644\u0627\u062d\u062a\u064a\u0627\u0644 \u0641\u064a \u0627\u0644\u0648\u0642\u062a \u0627\u0644\u0641\u0639\u0644\u064a",
  },
  {
    icon: Eye,
    color: "bg-blue-500/10 text-blue-500",
    titleEn: "Wallet Monitoring",
    titleAr: "\u0645\u0631\u0627\u0642\u0628\u0629 \u0627\u0644\u0645\u062d\u0627\u0641\u0638",
    descEn: "Real-time transaction tracking with instant alerts for suspicious activity",
    descAr: "\u062a\u062a\u0628\u0639 \u0627\u0644\u0645\u0639\u0627\u0645\u0644\u0627\u062a \u0641\u064a \u0627\u0644\u0648\u0642\u062a \u0627\u0644\u0641\u0639\u0644\u064a \u0645\u0639 \u062a\u0646\u0628\u064a\u0647\u0627\u062a \u0641\u0648\u0631\u064a\u0629",
  },
  {
    icon: Brain,
    color: "bg-purple-500/10 text-purple-500",
    titleEn: "AI Risk Analysis",
    titleAr: "\u062a\u062d\u0644\u064a\u0644 \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a",
    descEn: "GPT-4 powered fraud detection with pattern recognition across $14B+ in documented scams",
    descAr: "\u0643\u0634\u0641 \u0627\u0644\u0627\u062d\u062a\u064a\u0627\u0644 \u0628\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a \u0645\u0639 \u0627\u0644\u062a\u0639\u0631\u0641 \u0639\u0644\u0649 \u0627\u0644\u0623\u0646\u0645\u0627\u0637",
  },
  {
    icon: Lock,
    color: "bg-orange-500/10 text-orange-500",
    titleEn: "Secure Escrow",
    titleAr: "\u0627\u0644\u0636\u0645\u0627\u0646 \u0627\u0644\u0622\u0645\u0646",
    descEn: "Safe P2P trading with multi-signature support and automatic dispute resolution",
    descAr: "\u062a\u062f\u0627\u0648\u0644 \u0622\u0645\u0646 \u0645\u0639 \u062f\u0639\u0645 \u0627\u0644\u062a\u0648\u0642\u064a\u0639 \u0627\u0644\u0645\u062a\u0639\u062f\u062f \u0648\u062d\u0644 \u0627\u0644\u0646\u0632\u0627\u0639\u0627\u062a",
  },
  {
    icon: BarChart3,
    color: "bg-cyan-500/10 text-cyan-500",
    titleEn: "Risk Dashboard",
    titleAr: "\u0644\u0648\u062d\u0629 \u0627\u0644\u0645\u062e\u0627\u0637\u0631",
    descEn: "Comprehensive risk scoring and analytics across all supported blockchain networks",
    descAr: "\u062a\u0642\u064a\u064a\u0645 \u0634\u0627\u0645\u0644 \u0644\u0644\u0645\u062e\u0627\u0637\u0631 \u0639\u0628\u0631 \u062c\u0645\u064a\u0639 \u0634\u0628\u0643\u0627\u062a \u0627\u0644\u0628\u0644\u0648\u0643\u062a\u0634\u064a\u0646",
  },
  {
    icon: Zap,
    color: "bg-yellow-500/10 text-yellow-500",
    titleEn: "Real-time Alerts",
    titleAr: "\u062a\u0646\u0628\u064a\u0647\u0627\u062a \u0641\u0648\u0631\u064a\u0629",
    descEn: "Instant notifications for threats, suspicious transactions, and security events",
    descAr: "\u0625\u0634\u0639\u0627\u0631\u0627\u062a \u0641\u0648\u0631\u064a\u0629 \u0644\u0644\u062a\u0647\u062f\u064a\u062f\u0627\u062a \u0648\u0627\u0644\u0645\u0639\u0627\u0645\u0644\u0627\u062a \u0627\u0644\u0645\u0634\u0628\u0648\u0647\u0629",
  },
]

const networks = [
  { name: "Ethereum", color: "bg-blue-500" },
  { name: "Bitcoin", color: "bg-orange-500" },
  { name: "Polygon", color: "bg-purple-500" },
  { name: "Arbitrum", color: "bg-cyan-500" },
  { name: "Optimism", color: "bg-red-500" },
  { name: "zkSync", color: "bg-indigo-500" },
]

const stats = [
  { value: "125K+", labelEn: "Wallets Checked", labelAr: "\u0645\u062d\u0641\u0638\u0629 \u062a\u0645 \u0641\u062d\u0635\u0647\u0627" },
  { value: "8.5K+", labelEn: "Scams Detected", labelAr: "\u0627\u062d\u062a\u064a\u0627\u0644 \u0645\u0643\u062a\u0634\u0641" },
  { value: "$42M+", labelEn: "Value Protected", labelAr: "\u0642\u064a\u0645\u0629 \u0645\u062d\u0645\u064a\u0629" },
  { value: "1.2K+", labelEn: "Active Users", labelAr: "\u0645\u0633\u062a\u062e\u062f\u0645 \u0646\u0634\u0637" },
]

export default function HomePage() {
  const { t, locale, setLocale } = useI18n()
  const { isAuthenticated } = useAuth()
  const { theme, setTheme } = useTheme()

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-sm">
              U7
            </div>
            <span className="text-lg font-bold tracking-tight">UAE7Guard</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLocale(locale === "en" ? "ar" : "en")}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <Globe className="h-4 w-4" />
              {locale === "en" ? "AR" : "EN"}
            </button>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <Link
              href={isAuthenticated ? "/dashboard" : "/login"}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >
              {isAuthenticated ? t.nav.dashboard : t.landing.getStarted}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent" />
        <div className="absolute top-20 start-1/4 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute top-40 end-1/4 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:py-40">
          <div className="mx-auto max-w-3xl text-center">
            {/* UAE badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-500">
              <Shield className="h-4 w-4" />
              {t.landing.uaeRegulated}
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {t.landing.hero}
            </h1>
            <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
              {t.landing.heroSubtitle}
            </p>

            {/* CTA buttons */}
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href={isAuthenticated ? "/dashboard" : "/login"}
                className="flex items-center gap-2 rounded-lg bg-emerald-600 px-8 py-3 text-base font-medium text-white hover:bg-emerald-700 transition-colors"
              >
                {t.landing.getStarted}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#features"
                className="flex items-center gap-2 rounded-lg border border-border px-8 py-3 text-base font-medium hover:bg-accent transition-colors"
              >
                {t.landing.learnMore}
              </Link>
            </div>

            {/* Supported Networks */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
              {networks.map((n) => (
                <span
                  key={n.name}
                  className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
                >
                  <div className={`h-2 w-2 rounded-full ${n.color}`} />
                  {n.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border bg-card/50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.value} className="text-center">
                <p className="text-3xl font-bold text-emerald-500">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {locale === "ar" ? stat.labelAr : stat.labelEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold">{t.landing.features}</h2>
          <p className="mt-4 text-muted-foreground">
            {locale === "ar"
              ? "\u062d\u0645\u0627\u064a\u0629 \u0634\u0627\u0645\u0644\u0629 \u0644\u0623\u0635\u0648\u0644\u0643 \u0627\u0644\u0631\u0642\u0645\u064a\u0629 \u0641\u064a \u0627\u0644\u0625\u0645\u0627\u0631\u0627\u062a"
              : "Comprehensive protection for your digital assets in the UAE"}
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.titleEn}
                className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-emerald-500/30 hover:shadow-lg"
              >
                <div className={`inline-flex rounded-lg p-2.5 ${feature.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">
                  {locale === "ar" ? feature.titleAr : feature.titleEn}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {locale === "ar" ? feature.descAr : feature.descEn}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
          <div className="rounded-2xl bg-gradient-to-br from-emerald-600/20 to-blue-600/20 border border-emerald-500/20 p-12 text-center">
            <Shield className="mx-auto h-12 w-12 text-emerald-500" />
            <h2 className="mt-6 text-3xl font-bold">
              {locale === "ar"
                ? "\u0627\u0628\u062f\u0623 \u062d\u0645\u0627\u064a\u0629 \u0623\u0635\u0648\u0644\u0643 \u0627\u0644\u064a\u0648\u0645"
                : "Start Protecting Your Assets Today"}
            </h2>
            <p className="mt-4 text-muted-foreground">
              {t.landing.trustedBy}
            </p>
            <div className="mt-8">
              <Link
                href={isAuthenticated ? "/dashboard" : "/login"}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-8 py-3 text-base font-medium text-white hover:bg-emerald-700 transition-colors"
              >
                {t.landing.getStarted}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-600 text-white font-bold text-xs">
                U7
              </div>
              <span className="text-sm font-medium">UAE7Guard</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {locale === "ar"
                ? "\u00a9 2024 UAE7Guard. \u062c\u0645\u064a\u0639 \u0627\u0644\u062d\u0642\u0648\u0642 \u0645\u062d\u0641\u0648\u0638\u0629."
                : "\u00a9 2024 UAE7Guard. All rights reserved."}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
