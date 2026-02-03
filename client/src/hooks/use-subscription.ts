import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./use-auth";

export type SubscriptionTier = "free" | "basic" | "pro";

interface Subscription {
  subscriptionTier: SubscriptionTier;
  subscriptionStatus: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

interface FeatureLimits {
  walletChecksPerDay: number;
  watchlistAddresses: number;
  hasAIPredictions: boolean;
  hasApiAccess: boolean;
  hasPrioritySupport: boolean;
  hasDetailedReports: boolean;
  hasEmailAlerts: boolean;
  hasRealTimeMonitoring: boolean;
  hasCustomAlerts: boolean;
}

const TIER_LIMITS: Record<SubscriptionTier, FeatureLimits> = {
  free: {
    walletChecksPerDay: 3,
    watchlistAddresses: 0,
    hasAIPredictions: false,
    hasApiAccess: false,
    hasPrioritySupport: false,
    hasDetailedReports: false,
    hasEmailAlerts: false,
    hasRealTimeMonitoring: false,
    hasCustomAlerts: false,
  },
  basic: {
    walletChecksPerDay: Infinity,
    watchlistAddresses: 10,
    hasAIPredictions: false,
    hasApiAccess: false,
    hasPrioritySupport: false,
    hasDetailedReports: true,
    hasEmailAlerts: true,
    hasRealTimeMonitoring: false,
    hasCustomAlerts: false,
  },
  pro: {
    walletChecksPerDay: Infinity,
    watchlistAddresses: Infinity,
    hasAIPredictions: true,
    hasApiAccess: true,
    hasPrioritySupport: true,
    hasDetailedReports: true,
    hasEmailAlerts: true,
    hasRealTimeMonitoring: true,
    hasCustomAlerts: true,
  },
};

export function useSubscription() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const { data, isLoading: subLoading, error } = useQuery<Subscription>({
    queryKey: ["/api/stripe/subscription"],
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const tier: SubscriptionTier = data?.subscriptionTier as SubscriptionTier || "free";
  const isActive = data?.subscriptionStatus === "active" || tier === "free";
  const limits = TIER_LIMITS[isActive ? tier : "free"];

  return {
    tier,
    isActive,
    limits,
    subscription: data,
    isLoading: authLoading || subLoading,
    error,
    isPro: tier === "pro" && isActive,
    isBasic: tier === "basic" && isActive,
    isFree: tier === "free" || !isActive,
    canUpgrade: tier !== "pro",
    hasFeature: (feature: keyof FeatureLimits) => {
      const value = limits[feature];
      if (typeof value === "boolean") return value;
      if (typeof value === "number") return value > 0;
      return false;
    },
    getLimit: (feature: keyof Pick<FeatureLimits, "walletChecksPerDay" | "watchlistAddresses">) => {
      return limits[feature];
    },
  };
}

export function getTierBadgeVariant(tier: SubscriptionTier): "default" | "secondary" | "destructive" | "outline" {
  switch (tier) {
    case "pro":
      return "default";
    case "basic":
      return "secondary";
    default:
      return "outline";
  }
}

export function getTierDisplayName(tier: SubscriptionTier, language: "en" | "ar"): string {
  const names = {
    en: {
      free: "Free",
      basic: "Basic",
      pro: "Pro",
    },
    ar: {
      free: "مجاني",
      basic: "أساسي",
      pro: "برو",
    },
  };
  return names[language][tier];
}
