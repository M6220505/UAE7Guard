/**
 * UAE7Guard Pricing Plans & Features
 * Real pricing structure for the platform
 */

export interface PricingFeature {
  name: string;
  included: boolean;
  limit?: string;
  description?: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  displayName: string;
  price: {
    monthly: number;    // USD
    yearly: number;     // USD
    aed_monthly: number; // AED
    aed_yearly: number;  // AED
  };
  popular?: boolean;
  features: PricingFeature[];
  limits: {
    walletChecks: number;      // Per month
    aiAnalysis: number;        // Per month
    liveMonitoring: number;    // Concurrent wallets
    apiCalls: number;          // Per day
    reportStorage: number;     // Days
  };
  support: string;
  escrowFee: number; // Percentage
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    displayName: 'Community',
    price: {
      monthly: 0,
      yearly: 0,
      aed_monthly: 0,
      aed_yearly: 0,
    },
    features: [
      { name: 'Basic wallet verification', included: true },
      { name: 'Scam database access', included: true, limit: '10/day' },
      { name: 'Community reports', included: true },
      { name: 'Basic risk scoring', included: true },
      { name: 'Email alerts', included: true, limit: '5/month' },
      { name: 'AI-powered analysis', included: false },
      { name: 'Live monitoring', included: false },
      { name: 'Escrow service', included: false },
      { name: 'API access', included: false },
      { name: 'Priority support', included: false },
    ],
    limits: {
      walletChecks: 100,
      aiAnalysis: 0,
      liveMonitoring: 0,
      apiCalls: 0,
      reportStorage: 7,
    },
    support: 'Community forum',
    escrowFee: 0,
  },
  {
    id: 'basic',
    name: 'Basic',
    displayName: 'Personal Protection',
    price: {
      monthly: 9.99,
      yearly: 99,
      aed_monthly: 37,
      aed_yearly: 365,
    },
    features: [
      { name: 'Unlimited wallet checks', included: true },
      { name: 'Scam database access', included: true, limit: 'Unlimited' },
      { name: 'AI-powered risk analysis', included: true, limit: '50/month' },
      { name: 'Live monitoring', included: true, limit: '3 wallets' },
      { name: 'Email + SMS alerts', included: true },
      { name: 'Transaction analysis', included: true },
      { name: 'Escrow service', included: true, description: '0.5% fee' },
      { name: '30-day report history', included: true },
      { name: 'API access', included: false },
      { name: 'Priority support', included: false },
    ],
    limits: {
      walletChecks: -1, // Unlimited
      aiAnalysis: 50,
      liveMonitoring: 3,
      apiCalls: 0,
      reportStorage: 30,
    },
    support: 'Email support (48h)',
    escrowFee: 0.5,
  },
  {
    id: 'pro',
    name: 'Pro',
    displayName: 'Professional Trader',
    price: {
      monthly: 29.99,
      yearly: 299,
      aed_monthly: 110,
      aed_yearly: 1100,
    },
    popular: true,
    features: [
      { name: 'Everything in Basic', included: true },
      { name: 'Unlimited AI analysis', included: true },
      { name: 'Live monitoring', included: true, limit: '20 wallets' },
      { name: 'Advanced pattern detection', included: true },
      { name: 'Sovereign verification reports', included: true },
      { name: 'API access', included: true, limit: '1000/day' },
      { name: 'Escrow service', included: true, description: '0.25% fee' },
      { name: 'Multi-chain analysis', included: true },
      { name: '90-day report history', included: true },
      { name: 'Priority support', included: true },
    ],
    limits: {
      walletChecks: -1,
      aiAnalysis: -1,
      liveMonitoring: 20,
      apiCalls: 1000,
      reportStorage: 90,
    },
    support: 'Priority email + chat (24h)',
    escrowFee: 0.25,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    displayName: 'Business & Institutions',
    price: {
      monthly: 199,
      yearly: 1990,
      aed_monthly: 730,
      aed_yearly: 7300,
    },
    features: [
      { name: 'Everything in Pro', included: true },
      { name: 'Unlimited everything', included: true },
      { name: 'Dedicated account manager', included: true },
      { name: 'Custom integrations', included: true },
      { name: 'White-label option', included: true },
      { name: 'SLA guarantee (99.9%)', included: true },
      { name: 'Escrow service', included: true, description: '0.15% fee' },
      { name: 'Unlimited API calls', included: true },
      { name: 'Unlimited report storage', included: true },
      { name: '24/7 priority support', included: true },
    ],
    limits: {
      walletChecks: -1,
      aiAnalysis: -1,
      liveMonitoring: -1,
      apiCalls: -1,
      reportStorage: -1,
    },
    support: '24/7 phone + email + dedicated Slack',
    escrowFee: 0.15,
  },
];

/**
 * Get plan by ID
 */
export function getPlanById(planId: string): PricingPlan | undefined {
  return PRICING_PLANS.find(p => p.id === planId);
}

/**
 * Check if user can perform action based on plan
 */
export function canPerformAction(
  userPlan: string,
  action: 'walletCheck' | 'aiAnalysis' | 'liveMonitoring' | 'apiCall',
  currentUsage: number
): { allowed: boolean; limit: number; remaining: number } {
  const plan = getPlanById(userPlan) || PRICING_PLANS[0];
  
  let limit = 0;
  switch (action) {
    case 'walletCheck':
      limit = plan.limits.walletChecks;
      break;
    case 'aiAnalysis':
      limit = plan.limits.aiAnalysis;
      break;
    case 'liveMonitoring':
      limit = plan.limits.liveMonitoring;
      break;
    case 'apiCall':
      limit = plan.limits.apiCalls;
      break;
  }
  
  const allowed = limit === -1 || currentUsage < limit;
  const remaining = limit === -1 ? -1 : Math.max(0, limit - currentUsage);
  
  return { allowed, limit, remaining };
}

/**
 * Calculate escrow fee based on user plan
 */
export function calculateEscrowFee(
  amount: number,
  userPlan: string
): { fee: number; feePercentage: number; netAmount: number } {
  const plan = getPlanById(userPlan) || PRICING_PLANS[0];
  const feePercentage = plan.escrowFee;
  const fee = (amount * feePercentage) / 100;
  const netAmount = amount - fee;
  
  return { fee, feePercentage, netAmount };
}

/**
 * Get plan comparison matrix
 */
export function getPlanComparison(): any[] {
  return PRICING_PLANS.map(plan => ({
    id: plan.id,
    name: plan.displayName,
    price: {
      monthly: `$${plan.price.monthly}`,
      yearly: `$${plan.price.yearly}`,
      aed_monthly: `AED ${plan.price.aed_monthly}`,
      aed_yearly: `AED ${plan.price.aed_yearly}`,
    },
    popular: plan.popular || false,
    features: plan.features,
    support: plan.support,
  }));
}

/**
 * Calculate revenue sharing
 */
export interface RevenueBreakdown {
  total: number;
  platform: number;        // 70%
  development: number;     // 15%
  operations: number;      // 10%
  reserves: number;        // 5%
}

export function calculateRevenueSharing(totalRevenue: number): RevenueBreakdown {
  return {
    total: totalRevenue,
    platform: totalRevenue * 0.70,      // Platform operations
    development: totalRevenue * 0.15,   // Development & features
    operations: totalRevenue * 0.10,    // Infrastructure costs
    reserves: totalRevenue * 0.05,      // Emergency reserves
  };
}
