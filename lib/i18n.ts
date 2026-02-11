"use client"

import { createContext, useContext } from "react"

export type Locale = "en" | "ar"

export interface Translations {
  // Navigation
  nav: {
    dashboard: string
    scamChecker: string
    monitoring: string
    aiAnalysis: string
    escrow: string
    alerts: string
    profile: string
    reports: string
    settings: string
    signOut: string
  }
  // Common
  common: {
    loading: string
    error: string
    success: string
    save: string
    cancel: string
    submit: string
    search: string
    back: string
    next: string
    viewAll: string
    noData: string
    copyAddress: string
    copied: string
    safe: string
    suspicious: string
    dangerous: string
    critical: string
    low: string
    medium: string
    high: string
  }
  // Dashboard
  dashboard: {
    title: string
    subtitle: string
    walletsChecked: string
    scamsDetected: string
    valueProtected: string
    activeUsers: string
    recentActivity: string
    riskOverview: string
    quickActions: string
    checkAddress: string
    startMonitoring: string
    viewReports: string
    networkStats: string
  }
  // Scam Checker
  scamChecker: {
    title: string
    subtitle: string
    enterAddress: string
    selectNetwork: string
    checkNow: string
    checking: string
    results: string
    riskScore: string
    riskLevel: string
    databases: string
    noThreats: string
    threatsFound: string
    reportScam: string
    databaseSources: string
    lastChecked: string
    chainAbuse: string
    bitcoinAbuse: string
    etherscan: string
  }
  // Monitoring
  monitoring: {
    title: string
    subtitle: string
    addWallet: string
    walletAddress: string
    network: string
    status: string
    lastActivity: string
    riskLevel: string
    active: string
    paused: string
    noWallets: string
    startMonitoring: string
    stopMonitoring: string
    alertSettings: string
    transactionAlerts: string
    balanceChanges: string
    suspiciousActivity: string
  }
  // AI Analysis
  aiAnalysis: {
    title: string
    subtitle: string
    analyzeAddress: string
    analyzing: string
    riskPrediction: string
    patternDetection: string
    recommendations: string
    scamPatterns: string
    confidence: string
    matchedPatterns: string
    warnings: string
    aiPowered: string
    historicalData: string
    realTimeData: string
  }
  // Escrow
  escrow: {
    title: string
    subtitle: string
    createEscrow: string
    activeEscrows: string
    completedEscrows: string
    amount: string
    currency: string
    buyer: string
    seller: string
    status: string
    pending: string
    funded: string
    released: string
    disputed: string
    cancelled: string
    category: string
    realEstate: string
    vehicle: string
    luxuryWatch: string
    crypto: string
    other: string
    disputeResolution: string
    multiSig: string
    escrowFee: string
  }
  // Profile
  profile: {
    title: string
    subtitle: string
    walletChecker: string
    transactionHistory: string
    riskDashboard: string
    subscription: string
    plan: string
    free: string
    basic: string
    pro: string
    enterprise: string
    reputation: string
    trustScore: string
    rank: string
    reportsSubmitted: string
    alertsReceived: string
  }
  // Alerts
  alerts: {
    title: string
    subtitle: string
    allAlerts: string
    unread: string
    markRead: string
    markAllRead: string
    severity: string
    info: string
    warning: string
    critical: string
    noAlerts: string
    watchlist: string
    addToWatchlist: string
    removeFromWatchlist: string
  }
  // Landing
  landing: {
    hero: string
    heroSubtitle: string
    getStarted: string
    learnMore: string
    features: string
    protectWallet: string
    realTimeAlerts: string
    aiPowered: string
    secureTrading: string
    trustedBy: string
    uaeRegulated: string
  }
}

export const translations: Record<Locale, Translations> = {
  en: {
    nav: {
      dashboard: "Dashboard",
      scamChecker: "Scam Checker",
      monitoring: "Monitoring",
      aiAnalysis: "AI Analysis",
      escrow: "Secure Escrow",
      alerts: "Alerts",
      profile: "Profile",
      reports: "Reports",
      settings: "Settings",
      signOut: "Sign Out",
    },
    common: {
      loading: "Loading...",
      error: "An error occurred",
      success: "Success",
      save: "Save",
      cancel: "Cancel",
      submit: "Submit",
      search: "Search",
      back: "Back",
      next: "Next",
      viewAll: "View All",
      noData: "No data available",
      copyAddress: "Copy Address",
      copied: "Copied!",
      safe: "Safe",
      suspicious: "Suspicious",
      dangerous: "Dangerous",
      critical: "Critical",
      low: "Low",
      medium: "Medium",
      high: "High",
    },
    dashboard: {
      title: "Dashboard",
      subtitle: "UAE7Guard Security Overview",
      walletsChecked: "Wallets Checked",
      scamsDetected: "Scams Detected",
      valueProtected: "Value Protected",
      activeUsers: "Active Users",
      recentActivity: "Recent Activity",
      riskOverview: "Risk Overview",
      quickActions: "Quick Actions",
      checkAddress: "Check Address",
      startMonitoring: "Start Monitoring",
      viewReports: "View Reports",
      networkStats: "Network Statistics",
    },
    scamChecker: {
      title: "Scam Address Detection",
      subtitle: "Check blockchain addresses against known scam databases",
      enterAddress: "Enter blockchain address",
      selectNetwork: "Select Network",
      checkNow: "Check Now",
      checking: "Checking...",
      results: "Results",
      riskScore: "Risk Score",
      riskLevel: "Risk Level",
      databases: "Databases Checked",
      noThreats: "No threats detected",
      threatsFound: "Threats found!",
      reportScam: "Report Scam",
      databaseSources: "Database Sources",
      lastChecked: "Last Checked",
      chainAbuse: "ChainAbuse",
      bitcoinAbuse: "BitcoinAbuse",
      etherscan: "Etherscan Labels",
    },
    monitoring: {
      title: "Real-time Wallet Monitoring",
      subtitle: "Track wallet transactions and get instant alerts",
      addWallet: "Add Wallet",
      walletAddress: "Wallet Address",
      network: "Network",
      status: "Status",
      lastActivity: "Last Activity",
      riskLevel: "Risk Level",
      active: "Active",
      paused: "Paused",
      noWallets: "No wallets being monitored",
      startMonitoring: "Start Monitoring",
      stopMonitoring: "Stop Monitoring",
      alertSettings: "Alert Settings",
      transactionAlerts: "Transaction Alerts",
      balanceChanges: "Balance Changes",
      suspiciousActivity: "Suspicious Activity",
    },
    aiAnalysis: {
      title: "AI-Powered Risk Analysis",
      subtitle: "Machine learning fraud detection and pattern recognition",
      analyzeAddress: "Analyze Address",
      analyzing: "Analyzing with AI...",
      riskPrediction: "Risk Prediction",
      patternDetection: "Pattern Detection",
      recommendations: "Recommendations",
      scamPatterns: "Scam Patterns",
      confidence: "Confidence",
      matchedPatterns: "Matched Patterns",
      warnings: "Warnings",
      aiPowered: "AI-Powered",
      historicalData: "Historical Data",
      realTimeData: "Real-time Data",
    },
    escrow: {
      title: "Secure Escrow System",
      subtitle: "Safe P2P trading with multi-signature support",
      createEscrow: "Create Escrow",
      activeEscrows: "Active Escrows",
      completedEscrows: "Completed Escrows",
      amount: "Amount",
      currency: "Currency",
      buyer: "Buyer",
      seller: "Seller",
      status: "Status",
      pending: "Pending",
      funded: "Funded",
      released: "Released",
      disputed: "Disputed",
      cancelled: "Cancelled",
      category: "Category",
      realEstate: "Real Estate",
      vehicle: "Vehicle",
      luxuryWatch: "Luxury Watch",
      crypto: "Cryptocurrency",
      other: "Other",
      disputeResolution: "Dispute Resolution",
      multiSig: "Multi-Signature",
      escrowFee: "Escrow Fee",
    },
    profile: {
      title: "User Profile",
      subtitle: "Manage your account and security settings",
      walletChecker: "Wallet Checker",
      transactionHistory: "Transaction History",
      riskDashboard: "Risk Dashboard",
      subscription: "Subscription",
      plan: "Plan",
      free: "Free",
      basic: "Basic",
      pro: "Pro",
      enterprise: "Enterprise",
      reputation: "Reputation",
      trustScore: "Trust Score",
      rank: "Rank",
      reportsSubmitted: "Reports Submitted",
      alertsReceived: "Alerts Received",
    },
    alerts: {
      title: "Alerts & Notifications",
      subtitle: "Stay informed about threats and suspicious activity",
      allAlerts: "All Alerts",
      unread: "Unread",
      markRead: "Mark as Read",
      markAllRead: "Mark All as Read",
      severity: "Severity",
      info: "Info",
      warning: "Warning",
      critical: "Critical",
      noAlerts: "No alerts",
      watchlist: "Watchlist",
      addToWatchlist: "Add to Watchlist",
      removeFromWatchlist: "Remove from Watchlist",
    },
    landing: {
      hero: "Protect Your Crypto Assets in the UAE",
      heroSubtitle: "Advanced blockchain security platform that detects scams, monitors wallets, and secures your trades with AI-powered analysis",
      getStarted: "Get Started",
      learnMore: "Learn More",
      features: "Features",
      protectWallet: "Protect Your Wallet",
      realTimeAlerts: "Real-time Alerts",
      aiPowered: "AI-Powered Analysis",
      secureTrading: "Secure Trading",
      trustedBy: "Trusted by thousands of users in the UAE",
      uaeRegulated: "UAE Compliant",
    },
  },
  ar: {
    nav: {
      dashboard: "\u0644\u0648\u062d\u0629 \u0627\u0644\u062a\u062d\u0643\u0645",
      scamChecker: "\u0643\u0627\u0634\u0641 \u0627\u0644\u0627\u062d\u062a\u064a\u0627\u0644",
      monitoring: "\u0627\u0644\u0645\u0631\u0627\u0642\u0628\u0629",
      aiAnalysis: "\u062a\u062d\u0644\u064a\u0644 \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a",
      escrow: "\u0627\u0644\u0636\u0645\u0627\u0646 \u0627\u0644\u0622\u0645\u0646",
      alerts: "\u0627\u0644\u062a\u0646\u0628\u064a\u0647\u0627\u062a",
      profile: "\u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u0634\u062e\u0635\u064a",
      reports: "\u0627\u0644\u062a\u0642\u0627\u0631\u064a\u0631",
      settings: "\u0627\u0644\u0625\u0639\u062f\u0627\u062f\u0627\u062a",
      signOut: "\u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062e\u0631\u0648\u062c",
    },
    common: {
      loading: "\u062c\u0627\u0631\u064a \u0627\u0644\u062a\u062d\u0645\u064a\u0644...",
      error: "\u062d\u062f\u062b \u062e\u0637\u0623",
      success: "\u062a\u0645 \u0628\u0646\u062c\u0627\u062d",
      save: "\u062d\u0641\u0638",
      cancel: "\u0625\u0644\u063a\u0627\u0621",
      submit: "\u0625\u0631\u0633\u0627\u0644",
      search: "\u0628\u062d\u062b",
      back: "\u0631\u062c\u0648\u0639",
      next: "\u0627\u0644\u062a\u0627\u0644\u064a",
      viewAll: "\u0639\u0631\u0636 \u0627\u0644\u0643\u0644",
      noData: "\u0644\u0627 \u062a\u0648\u062c\u062f \u0628\u064a\u0627\u0646\u0627\u062a",
      copyAddress: "\u0646\u0633\u062e \u0627\u0644\u0639\u0646\u0648\u0627\u0646",
      copied: "\u062a\u0645 \u0627\u0644\u0646\u0633\u062e!",
      safe: "\u0622\u0645\u0646",
      suspicious: "\u0645\u0634\u0628\u0648\u0647",
      dangerous: "\u062e\u0637\u064a\u0631",
      critical: "\u062d\u0631\u062c",
      low: "\u0645\u0646\u062e\u0641\u0636",
      medium: "\u0645\u062a\u0648\u0633\u0637",
      high: "\u0645\u0631\u062a\u0641\u0639",
    },
    dashboard: {
      title: "\u0644\u0648\u062d\u0629 \u0627\u0644\u062a\u062d\u0643\u0645",
      subtitle: "\u0646\u0638\u0631\u0629 \u0639\u0627\u0645\u0629 \u0639\u0644\u0649 \u0623\u0645\u0627\u0646 UAE7Guard",
      walletsChecked: "\u0627\u0644\u0645\u062d\u0627\u0641\u0638 \u0627\u0644\u0645\u0641\u062d\u0648\u0635\u0629",
      scamsDetected: "\u0627\u0644\u0627\u062d\u062a\u064a\u0627\u0644\u0627\u062a \u0627\u0644\u0645\u0643\u062a\u0634\u0641\u0629",
      valueProtected: "\u0627\u0644\u0642\u064a\u0645\u0629 \u0627\u0644\u0645\u062d\u0645\u064a\u0629",
      activeUsers: "\u0627\u0644\u0645\u0633\u062a\u062e\u062f\u0645\u0648\u0646 \u0627\u0644\u0646\u0634\u0637\u0648\u0646",
      recentActivity: "\u0627\u0644\u0646\u0634\u0627\u0637 \u0627\u0644\u0623\u062e\u064a\u0631",
      riskOverview: "\u0646\u0638\u0631\u0629 \u0639\u0627\u0645\u0629 \u0639\u0644\u0649 \u0627\u0644\u0645\u062e\u0627\u0637\u0631",
      quickActions: "\u0625\u062c\u0631\u0627\u0621\u0627\u062a \u0633\u0631\u064a\u0639\u0629",
      checkAddress: "\u0641\u062d\u0635 \u0639\u0646\u0648\u0627\u0646",
      startMonitoring: "\u0628\u062f\u0621 \u0627\u0644\u0645\u0631\u0627\u0642\u0628\u0629",
      viewReports: "\u0639\u0631\u0636 \u0627\u0644\u062a\u0642\u0627\u0631\u064a\u0631",
      networkStats: "\u0625\u062d\u0635\u0627\u0626\u064a\u0627\u062a \u0627\u0644\u0634\u0628\u0643\u0629",
    },
    scamChecker: {
      title: "\u0643\u0634\u0641 \u0639\u0646\u0627\u0648\u064a\u0646 \u0627\u0644\u0627\u062d\u062a\u064a\u0627\u0644",
      subtitle: "\u062a\u062d\u0642\u0642 \u0645\u0646 \u0639\u0646\u0627\u0648\u064a\u0646 \u0627\u0644\u0628\u0644\u0648\u0643\u062a\u0634\u064a\u0646 \u0645\u0642\u0627\u0628\u0644 \u0642\u0648\u0627\u0639\u062f \u0628\u064a\u0627\u0646\u0627\u062a \u0627\u0644\u0627\u062d\u062a\u064a\u0627\u0644 \u0627\u0644\u0645\u0639\u0631\u0648\u0641\u0629",
      enterAddress: "\u0623\u062f\u062e\u0644 \u0639\u0646\u0648\u0627\u0646 \u0627\u0644\u0628\u0644\u0648\u0643\u062a\u0634\u064a\u0646",
      selectNetwork: "\u0627\u062e\u062a\u0631 \u0627\u0644\u0634\u0628\u0643\u0629",
      checkNow: "\u0641\u062d\u0635 \u0627\u0644\u0622\u0646",
      checking: "\u062c\u0627\u0631\u064a \u0627\u0644\u0641\u062d\u0635...",
      results: "\u0627\u0644\u0646\u062a\u0627\u0626\u062c",
      riskScore: "\u062f\u0631\u062c\u0629 \u0627\u0644\u0645\u062e\u0627\u0637\u0631",
      riskLevel: "\u0645\u0633\u062a\u0648\u0649 \u0627\u0644\u0645\u062e\u0627\u0637\u0631",
      databases: "\u0642\u0648\u0627\u0639\u062f \u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a \u0627\u0644\u0645\u0641\u062d\u0648\u0635\u0629",
      noThreats: "\u0644\u0645 \u064a\u062a\u0645 \u0627\u0643\u062a\u0634\u0627\u0641 \u062a\u0647\u062f\u064a\u062f\u0627\u062a",
      threatsFound: "\u062a\u0645 \u0627\u0643\u062a\u0634\u0627\u0641 \u062a\u0647\u062f\u064a\u062f\u0627\u062a!",
      reportScam: "\u0627\u0644\u0625\u0628\u0644\u0627\u063a \u0639\u0646 \u0627\u062d\u062a\u064a\u0627\u0644",
      databaseSources: "\u0645\u0635\u0627\u062f\u0631 \u0642\u0648\u0627\u0639\u062f \u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a",
      lastChecked: "\u0622\u062e\u0631 \u0641\u062d\u0635",
      chainAbuse: "ChainAbuse",
      bitcoinAbuse: "BitcoinAbuse",
      etherscan: "\u062a\u0635\u0646\u064a\u0641\u0627\u062a Etherscan",
    },
    monitoring: {
      title: "\u0645\u0631\u0627\u0642\u0628\u0629 \u0627\u0644\u0645\u062d\u0627\u0641\u0638 \u0641\u064a \u0627\u0644\u0648\u0642\u062a \u0627\u0644\u0641\u0639\u0644\u064a",
      subtitle: "\u062a\u062a\u0628\u0639 \u0645\u0639\u0627\u0645\u0644\u0627\u062a \u0627\u0644\u0645\u062d\u0627\u0641\u0638 \u0648\u0627\u062d\u0635\u0644 \u0639\u0644\u0649 \u062a\u0646\u0628\u064a\u0647\u0627\u062a \u0641\u0648\u0631\u064a\u0629",
      addWallet: "\u0625\u0636\u0627\u0641\u0629 \u0645\u062d\u0641\u0638\u0629",
      walletAddress: "\u0639\u0646\u0648\u0627\u0646 \u0627\u0644\u0645\u062d\u0641\u0638\u0629",
      network: "\u0627\u0644\u0634\u0628\u0643\u0629",
      status: "\u0627\u0644\u062d\u0627\u0644\u0629",
      lastActivity: "\u0622\u062e\u0631 \u0646\u0634\u0627\u0637",
      riskLevel: "\u0645\u0633\u062a\u0648\u0649 \u0627\u0644\u0645\u062e\u0627\u0637\u0631",
      active: "\u0646\u0634\u0637",
      paused: "\u0645\u0648\u0642\u0641",
      noWallets: "\u0644\u0627 \u062a\u0648\u062c\u062f \u0645\u062d\u0627\u0641\u0638 \u0642\u064a\u062f \u0627\u0644\u0645\u0631\u0627\u0642\u0628\u0629",
      startMonitoring: "\u0628\u062f\u0621 \u0627\u0644\u0645\u0631\u0627\u0642\u0628\u0629",
      stopMonitoring: "\u0625\u064a\u0642\u0627\u0641 \u0627\u0644\u0645\u0631\u0627\u0642\u0628\u0629",
      alertSettings: "\u0625\u0639\u062f\u0627\u062f\u0627\u062a \u0627\u0644\u062a\u0646\u0628\u064a\u0647\u0627\u062a",
      transactionAlerts: "\u062a\u0646\u0628\u064a\u0647\u0627\u062a \u0627\u0644\u0645\u0639\u0627\u0645\u0644\u0627\u062a",
      balanceChanges: "\u062a\u063a\u064a\u064a\u0631\u0627\u062a \u0627\u0644\u0631\u0635\u064a\u062f",
      suspiciousActivity: "\u0646\u0634\u0627\u0637 \u0645\u0634\u0628\u0648\u0647",
    },
    aiAnalysis: {
      title: "\u062a\u062d\u0644\u064a\u0644 \u0627\u0644\u0645\u062e\u0627\u0637\u0631 \u0628\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a",
      subtitle: "\u0643\u0634\u0641 \u0627\u0644\u0627\u062d\u062a\u064a\u0627\u0644 \u0628\u0627\u0644\u062a\u0639\u0644\u0645 \u0627\u0644\u0622\u0644\u064a \u0648\u0627\u0644\u062a\u0639\u0631\u0641 \u0639\u0644\u0649 \u0627\u0644\u0623\u0646\u0645\u0627\u0637",
      analyzeAddress: "\u062a\u062d\u0644\u064a\u0644 \u0627\u0644\u0639\u0646\u0648\u0627\u0646",
      analyzing: "\u062c\u0627\u0631\u064a \u0627\u0644\u062a\u062d\u0644\u064a\u0644 \u0628\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a...",
      riskPrediction: "\u062a\u0646\u0628\u0624 \u0627\u0644\u0645\u062e\u0627\u0637\u0631",
      patternDetection: "\u0643\u0634\u0641 \u0627\u0644\u0623\u0646\u0645\u0627\u0637",
      recommendations: "\u0627\u0644\u062a\u0648\u0635\u064a\u0627\u062a",
      scamPatterns: "\u0623\u0646\u0645\u0627\u0637 \u0627\u0644\u0627\u062d\u062a\u064a\u0627\u0644",
      confidence: "\u062f\u0631\u062c\u0629 \u0627\u0644\u062b\u0642\u0629",
      matchedPatterns: "\u0627\u0644\u0623\u0646\u0645\u0627\u0637 \u0627\u0644\u0645\u0637\u0627\u0628\u0642\u0629",
      warnings: "\u0627\u0644\u062a\u062d\u0630\u064a\u0631\u0627\u062a",
      aiPowered: "\u0645\u062f\u0639\u0648\u0645 \u0628\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a",
      historicalData: "\u0628\u064a\u0627\u0646\u0627\u062a \u062a\u0627\u0631\u064a\u062e\u064a\u0629",
      realTimeData: "\u0628\u064a\u0627\u0646\u0627\u062a \u0641\u0648\u0631\u064a\u0629",
    },
    escrow: {
      title: "\u0646\u0638\u0627\u0645 \u0627\u0644\u0636\u0645\u0627\u0646 \u0627\u0644\u0622\u0645\u0646",
      subtitle: "\u062a\u062f\u0627\u0648\u0644 \u0622\u0645\u0646 \u0628\u064a\u0646 \u0627\u0644\u0623\u0641\u0631\u0627\u062f \u0645\u0639 \u062f\u0639\u0645 \u0627\u0644\u062a\u0648\u0642\u064a\u0639 \u0627\u0644\u0645\u062a\u0639\u062f\u062f",
      createEscrow: "\u0625\u0646\u0634\u0627\u0621 \u0636\u0645\u0627\u0646",
      activeEscrows: "\u0627\u0644\u0636\u0645\u0627\u0646\u0627\u062a \u0627\u0644\u0646\u0634\u0637\u0629",
      completedEscrows: "\u0627\u0644\u0636\u0645\u0627\u0646\u0627\u062a \u0627\u0644\u0645\u0643\u062a\u0645\u0644\u0629",
      amount: "\u0627\u0644\u0645\u0628\u0644\u063a",
      currency: "\u0627\u0644\u0639\u0645\u0644\u0629",
      buyer: "\u0627\u0644\u0645\u0634\u062a\u0631\u064a",
      seller: "\u0627\u0644\u0628\u0627\u0626\u0639",
      status: "\u0627\u0644\u062d\u0627\u0644\u0629",
      pending: "\u0642\u064a\u062f \u0627\u0644\u0627\u0646\u062a\u0638\u0627\u0631",
      funded: "\u0645\u0645\u0648\u0644",
      released: "\u0645\u062d\u0631\u0631",
      disputed: "\u0645\u062a\u0646\u0627\u0632\u0639 \u0639\u0644\u064a\u0647",
      cancelled: "\u0645\u0644\u063a\u0649",
      category: "\u0627\u0644\u0641\u0626\u0629",
      realEstate: "\u0639\u0642\u0627\u0631\u0627\u062a",
      vehicle: "\u0645\u0631\u0643\u0628\u0627\u062a",
      luxuryWatch: "\u0633\u0627\u0639\u0627\u062a \u0641\u0627\u062e\u0631\u0629",
      crypto: "\u0639\u0645\u0644\u0627\u062a \u0631\u0642\u0645\u064a\u0629",
      other: "\u0623\u062e\u0631\u0649",
      disputeResolution: "\u062d\u0644 \u0627\u0644\u0646\u0632\u0627\u0639\u0627\u062a",
      multiSig: "\u062a\u0648\u0642\u064a\u0639 \u0645\u062a\u0639\u062f\u062f",
      escrowFee: "\u0631\u0633\u0648\u0645 \u0627\u0644\u0636\u0645\u0627\u0646",
    },
    profile: {
      title: "\u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u0634\u062e\u0635\u064a",
      subtitle: "\u0625\u062f\u0627\u0631\u0629 \u062d\u0633\u0627\u0628\u0643 \u0648\u0625\u0639\u062f\u0627\u062f\u0627\u062a \u0627\u0644\u0623\u0645\u0627\u0646",
      walletChecker: "\u0641\u0627\u062d\u0635 \u0627\u0644\u0645\u062d\u0641\u0638\u0629",
      transactionHistory: "\u0633\u062c\u0644 \u0627\u0644\u0645\u0639\u0627\u0645\u0644\u0627\u062a",
      riskDashboard: "\u0644\u0648\u062d\u0629 \u0627\u0644\u0645\u062e\u0627\u0637\u0631",
      subscription: "\u0627\u0644\u0627\u0634\u062a\u0631\u0627\u0643",
      plan: "\u0627\u0644\u062e\u0637\u0629",
      free: "\u0645\u062c\u0627\u0646\u064a",
      basic: "\u0623\u0633\u0627\u0633\u064a",
      pro: "\u0627\u062d\u062a\u0631\u0627\u0641\u064a",
      enterprise: "\u0645\u0624\u0633\u0633\u0627\u062a",
      reputation: "\u0627\u0644\u0633\u0645\u0639\u0629",
      trustScore: "\u062f\u0631\u062c\u0629 \u0627\u0644\u062b\u0642\u0629",
      rank: "\u0627\u0644\u0631\u062a\u0628\u0629",
      reportsSubmitted: "\u0627\u0644\u062a\u0642\u0627\u0631\u064a\u0631 \u0627\u0644\u0645\u0642\u062f\u0645\u0629",
      alertsReceived: "\u0627\u0644\u062a\u0646\u0628\u064a\u0647\u0627\u062a \u0627\u0644\u0645\u0633\u062a\u0644\u0645\u0629",
    },
    alerts: {
      title: "\u0627\u0644\u062a\u0646\u0628\u064a\u0647\u0627\u062a \u0648\u0627\u0644\u0625\u0634\u0639\u0627\u0631\u0627\u062a",
      subtitle: "\u0627\u0628\u0642 \u0639\u0644\u0649 \u0627\u0637\u0644\u0627\u0639 \u0628\u0627\u0644\u062a\u0647\u062f\u064a\u062f\u0627\u062a \u0648\u0627\u0644\u0646\u0634\u0627\u0637 \u0627\u0644\u0645\u0634\u0628\u0648\u0647",
      allAlerts: "\u0643\u0644 \u0627\u0644\u062a\u0646\u0628\u064a\u0647\u0627\u062a",
      unread: "\u063a\u064a\u0631 \u0645\u0642\u0631\u0648\u0621",
      markRead: "\u062a\u062d\u062f\u064a\u062f \u0643\u0645\u0642\u0631\u0648\u0621",
      markAllRead: "\u062a\u062d\u062f\u064a\u062f \u0627\u0644\u0643\u0644 \u0643\u0645\u0642\u0631\u0648\u0621",
      severity: "\u0627\u0644\u062e\u0637\u0648\u0631\u0629",
      info: "\u0645\u0639\u0644\u0648\u0645\u0627\u062a",
      warning: "\u062a\u062d\u0630\u064a\u0631",
      critical: "\u062d\u0631\u062c",
      noAlerts: "\u0644\u0627 \u062a\u0648\u062c\u062f \u062a\u0646\u0628\u064a\u0647\u0627\u062a",
      watchlist: "\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0645\u0631\u0627\u0642\u0628\u0629",
      addToWatchlist: "\u0625\u0636\u0627\u0641\u0629 \u0644\u0644\u0645\u0631\u0627\u0642\u0628\u0629",
      removeFromWatchlist: "\u0625\u0632\u0627\u0644\u0629 \u0645\u0646 \u0627\u0644\u0645\u0631\u0627\u0642\u0628\u0629",
    },
    landing: {
      hero: "\u0627\u062d\u0645\u0650 \u0623\u0635\u0648\u0644\u0643 \u0627\u0644\u0631\u0642\u0645\u064a\u0629 \u0641\u064a \u0627\u0644\u0625\u0645\u0627\u0631\u0627\u062a",
      heroSubtitle: "\u0645\u0646\u0635\u0629 \u0623\u0645\u0627\u0646 \u0628\u0644\u0648\u0643\u062a\u0634\u064a\u0646 \u0645\u062a\u0642\u062f\u0645\u0629 \u062a\u0643\u0634\u0641 \u0627\u0644\u0627\u062d\u062a\u064a\u0627\u0644 \u0648\u062a\u0631\u0627\u0642\u0628 \u0627\u0644\u0645\u062d\u0627\u0641\u0638 \u0648\u062a\u0624\u0645\u0646 \u062a\u062f\u0627\u0648\u0644\u0627\u062a\u0643 \u0628\u062a\u062d\u0644\u064a\u0644 \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a",
      getStarted: "\u0627\u0628\u062f\u0623 \u0627\u0644\u0622\u0646",
      learnMore: "\u0627\u0639\u0631\u0641 \u0627\u0644\u0645\u0632\u064a\u062f",
      features: "\u0627\u0644\u0645\u0645\u064a\u0632\u0627\u062a",
      protectWallet: "\u0627\u062d\u0645\u0650 \u0645\u062d\u0641\u0638\u062a\u0643",
      realTimeAlerts: "\u062a\u0646\u0628\u064a\u0647\u0627\u062a \u0641\u0648\u0631\u064a\u0629",
      aiPowered: "\u062a\u062d\u0644\u064a\u0644 \u0628\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a",
      secureTrading: "\u062a\u062f\u0627\u0648\u0644 \u0622\u0645\u0646",
      trustedBy: "\u0645\u0648\u062b\u0648\u0642 \u0628\u0647 \u0645\u0646 \u0622\u0644\u0627\u0641 \u0627\u0644\u0645\u0633\u062a\u062e\u062f\u0645\u064a\u0646 \u0641\u064a \u0627\u0644\u0625\u0645\u0627\u0631\u0627\u062a",
      uaeRegulated: "\u0645\u062a\u0648\u0627\u0641\u0642 \u0645\u0639 \u0627\u0644\u0625\u0645\u0627\u0631\u0627\u062a",
    },
  },
}

export function getTranslations(locale: Locale): Translations {
  return translations[locale]
}

export interface I18nContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: Translations
  dir: "ltr" | "rtl"
}

export const I18nContext = createContext<I18nContextValue | undefined>(undefined)

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}
