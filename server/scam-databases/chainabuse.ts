/**
 * ChainAbuse.com API Integration
 * Free public API for reporting and checking crypto scam addresses
 * https://www.chainabuse.com/api
 */

export interface ChainAbuseReport {
  address: string;
  category: string;
  subcategory: string;
  reporter: string;
  description: string;
  coin: string;
  reportedAt: string;
}

export interface ChainAbuseResponse {
  success: boolean;
  reports: ChainAbuseReport[];
  totalReports: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

/**
 * Check if an address has been reported on ChainAbuse
 */
export async function checkChainAbuse(address: string): Promise<ChainAbuseResponse> {
  try {
    // ChainAbuse.com public API
    const response = await fetch(`https://www.chainabuse.com/api/address/${address}`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      // If not found or error, return clean result
      return {
        success: true,
        reports: [],
        totalReports: 0,
        riskLevel: 'LOW',
      };
    }

    const data = await response.json();
    
    // Parse reports
    const reports: ChainAbuseReport[] = data.reports || [];
    const totalReports = reports.length;

    // Calculate risk level based on number and severity of reports
    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
    
    if (totalReports === 0) {
      riskLevel = 'LOW';
    } else if (totalReports <= 2) {
      riskLevel = 'MEDIUM';
    } else if (totalReports <= 5) {
      riskLevel = 'HIGH';
    } else {
      riskLevel = 'CRITICAL';
    }

    // Check for high-severity categories
    const highSeverityCategories = ['ransomware', 'blackmail', 'hacked', 'stolen'];
    const hasHighSeverity = reports.some(r => 
      highSeverityCategories.some(cat => 
        r.category?.toLowerCase().includes(cat) || 
        r.subcategory?.toLowerCase().includes(cat)
      )
    );

    if (hasHighSeverity && riskLevel !== 'CRITICAL') {
      riskLevel = totalReports > 1 ? 'CRITICAL' : 'HIGH';
    }

    return {
      success: true,
      reports,
      totalReports,
      riskLevel,
    };
  } catch (error) {
    console.error('[CHAINABUSE] Error checking address:', error);
    return {
      success: false,
      reports: [],
      totalReports: 0,
      riskLevel: 'LOW',
    };
  }
}

/**
 * Submit a scam report to ChainAbuse (optional - requires API key)
 */
export async function submitToChainAbuse(data: {
  address: string;
  category: string;
  description: string;
  reporter?: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    // This would require ChainAbuse API key for submissions
    // For now, we just log it locally
    console.log('[CHAINABUSE] Report logged:', data);
    
    return {
      success: true,
      message: 'Report logged. In production, this would be submitted to ChainAbuse.com',
    };
  } catch (error) {
    console.error('[CHAINABUSE] Error submitting report:', error);
    return {
      success: false,
      message: 'Failed to submit report',
    };
  }
}
