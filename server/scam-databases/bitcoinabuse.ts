/**
 * BitcoinAbuse.com API Integration
 * Public API for Bitcoin scam address reports
 * https://www.bitcoinabuse.com/api-docs
 */

export interface BitcoinAbuseReport {
  address: string;
  abuseType: string;
  description: string;
  count: number;
  reportedAt?: string;
}

export interface BitcoinAbuseResponse {
  success: boolean;
  address: string;
  reports: number;
  totalBitcoin?: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  categories: string[];
}

/**
 * Check Bitcoin address against BitcoinAbuse database
 */
export async function checkBitcoinAbuse(address: string): Promise<BitcoinAbuseResponse> {
  try {
    // BitcoinAbuse.com public check endpoint
    const response = await fetch(`https://www.bitcoinabuse.com/api/reports/check?address=${address}`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      return {
        success: true,
        address,
        reports: 0,
        riskLevel: 'LOW',
        categories: [],
      };
    }

    const data = await response.json();
    
    const reports = data.count || 0;
    const categories = data.distinct_abuse_types || [];
    
    // Calculate risk level
    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
    
    if (reports === 0) {
      riskLevel = 'LOW';
    } else if (reports <= 3) {
      riskLevel = 'MEDIUM';
    } else if (reports <= 10) {
      riskLevel = 'HIGH';
    } else {
      riskLevel = 'CRITICAL';
    }

    // High-risk categories
    const criticalCategories = ['ransomware', 'blackmail', 'sextortion'];
    const hasCriticalCategory = categories.some((cat: string) =>
      criticalCategories.some(critical => cat.toLowerCase().includes(critical))
    );

    if (hasCriticalCategory) {
      riskLevel = reports > 5 ? 'CRITICAL' : 'HIGH';
    }

    return {
      success: true,
      address,
      reports,
      totalBitcoin: data.total_bitcoin,
      riskLevel,
      categories,
    };
  } catch (error) {
    console.error('[BITCOINABUSE] Error checking address:', error);
    return {
      success: false,
      address,
      reports: 0,
      riskLevel: 'LOW',
      categories: [],
    };
  }
}

/**
 * Get recent Bitcoin scam reports (public feed)
 */
export async function getRecentBitcoinScams(limit: number = 10): Promise<BitcoinAbuseReport[]> {
  try {
    const response = await fetch(`https://www.bitcoinabuse.com/api/reports/recent?limit=${limit}`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('[BITCOINABUSE] Error fetching recent scams:', error);
    return [];
  }
}
