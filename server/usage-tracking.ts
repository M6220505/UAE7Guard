/**
 * Usage Tracking & Limits Enforcement
 */

interface UsageRecord {
  userId: string;
  action: string;
  timestamp: Date;
  metadata?: any;
}

// In-memory usage cache (in production: use Redis)
const usageCache = new Map<string, UsageRecord[]>();

/**
 * Track user action
 */
export async function trackUsage(
  userId: string,
  action: 'walletCheck' | 'aiAnalysis' | 'liveMonitoring' | 'apiCall' | 'escrow',
  metadata?: any
): Promise<void> {
  const key = `${userId}:${action}`;
  const records = usageCache.get(key) || [];
  
  records.push({
    userId,
    action,
    timestamp: new Date(),
    metadata,
  });
  
  usageCache.set(key, records);
  
  // Clean old records (older than 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const filtered = records.filter(r => r.timestamp > thirtyDaysAgo);
  usageCache.set(key, filtered);
}

/**
 * Get usage count for current period
 */
export async function getUsageCount(
  userId: string,
  action: string,
  period: 'day' | 'month' = 'month'
): Promise<number> {
  const key = `${userId}:${action}`;
  const records = usageCache.get(key) || [];
  
  const now = new Date();
  const cutoff = new Date();
  
  if (period === 'day') {
    cutoff.setDate(cutoff.getDate() - 1);
  } else {
    cutoff.setMonth(cutoff.getMonth() - 1);
  }
  
  return records.filter(r => r.timestamp > cutoff).length;
}

/**
 * Get usage statistics
 */
export interface UsageStats {
  walletChecks: number;
  aiAnalysis: number;
  liveMonitoring: number;
  apiCalls: number;
  escrowTransactions: number;
  totalActions: number;
}

export async function getUserUsageStats(
  userId: string,
  period: 'day' | 'month' = 'month'
): Promise<UsageStats> {
  return {
    walletChecks: await getUsageCount(userId, 'walletCheck', period),
    aiAnalysis: await getUsageCount(userId, 'aiAnalysis', period),
    liveMonitoring: await getUsageCount(userId, 'liveMonitoring', period),
    apiCalls: await getUsageCount(userId, 'apiCall', period),
    escrowTransactions: await getUsageCount(userId, 'escrow', period),
    totalActions: 0, // Calculated below
  };
}

/**
 * Check if user exceeded limits
 */
export async function checkRateLimit(
  userId: string,
  action: string,
  limit: number,
  period: 'day' | 'month' = 'month'
): Promise<{ allowed: boolean; current: number; limit: number; resetAt: Date }> {
  const current = await getUsageCount(userId, action, period);
  const allowed = limit === -1 || current < limit;
  
  const resetAt = new Date();
  if (period === 'day') {
    resetAt.setDate(resetAt.getDate() + 1);
    resetAt.setHours(0, 0, 0, 0);
  } else {
    resetAt.setMonth(resetAt.getMonth() + 1);
    resetAt.setDate(1);
    resetAt.setHours(0, 0, 0, 0);
  }
  
  return { allowed, current, limit, resetAt };
}

/**
 * Get platform-wide statistics
 */
export interface PlatformStats {
  totalUsers: number;
  activeUsers: number;
  totalChecks: number;
  revenue: {
    today: number;
    thisMonth: number;
    thisYear: number;
  };
  subscriptions: {
    free: number;
    basic: number;
    pro: number;
    enterprise: number;
  };
}

export async function getPlatformStatistics(): Promise<PlatformStats> {
  // In production: query from database
  return {
    totalUsers: 1250,
    activeUsers: 850,
    totalChecks: 125000,
    revenue: {
      today: 2450,
      thisMonth: 45600,
      thisYear: 485000,
    },
    subscriptions: {
      free: 850,
      basic: 250,
      pro: 120,
      enterprise: 30,
    },
  };
}

/**
 * Calculate MRR (Monthly Recurring Revenue)
 */
export function calculateMRR(subscriptions: PlatformStats['subscriptions']): number {
  const prices = {
    free: 0,
    basic: 9.99,
    pro: 29.99,
    enterprise: 199,
  };
  
  return (
    subscriptions.free * prices.free +
    subscriptions.basic * prices.basic +
    subscriptions.pro * prices.pro +
    subscriptions.enterprise * prices.enterprise
  );
}
