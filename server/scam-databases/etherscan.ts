/**
 * Etherscan Scam Database Integration
 * Checks against Etherscan's known scam/phishing addresses
 */

export interface EtherscanScamCheck {
  success: boolean;
  address: string;
  isScam: boolean;
  labels: string[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  source: string;
}

// Known scam labels from Etherscan
const SCAM_LABELS = [
  'Phishing',
  'Scam',
  'Fake_Phishing',
  'Fake',
  'Ponzi',
  'MEV Bot',
  'Fake Token',
  'Honeypot',
];

/**
 * Check address against Etherscan's labeling system
 */
export async function checkEtherscanLabels(
  address: string,
  apiKey?: string
): Promise<EtherscanScamCheck> {
  try {
    const key = apiKey || process.env.ETHERSCAN_API_KEY || 'YourApiKeyToken';
    
    // Etherscan API - Get address tags/labels
    const response = await fetch(
      `https://api.etherscan.io/api?module=account&action=addresstags&address=${address}&apikey=${key}`
    );

    if (!response.ok) {
      return {
        success: true,
        address,
        isScam: false,
        labels: [],
        riskLevel: 'LOW',
        source: 'etherscan',
      };
    }

    const data = await response.json();
    
    if (data.status === '0' || !data.result) {
      return {
        success: true,
        address,
        isScam: false,
        labels: [],
        riskLevel: 'LOW',
        source: 'etherscan',
      };
    }

    // Parse labels
    const labels: string[] = [];
    let isScam = false;
    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';

    if (Array.isArray(data.result)) {
      data.result.forEach((tag: any) => {
        if (tag.name) {
          labels.push(tag.name);
          
          // Check if it's a known scam label
          const isScamLabel = SCAM_LABELS.some(scamLabel =>
            tag.name.toLowerCase().includes(scamLabel.toLowerCase())
          );
          
          if (isScamLabel) {
            isScam = true;
            // Determine severity
            if (tag.name.toLowerCase().includes('phishing') || 
                tag.name.toLowerCase().includes('ponzi')) {
              riskLevel = 'CRITICAL';
            } else if (tag.name.toLowerCase().includes('scam')) {
              riskLevel = 'HIGH';
            } else {
              riskLevel = 'MEDIUM';
            }
          }
        }
      });
    }

    return {
      success: true,
      address,
      isScam,
      labels,
      riskLevel,
      source: 'etherscan',
    };
  } catch (error) {
    console.error('[ETHERSCAN] Error checking labels:', error);
    return {
      success: false,
      address,
      isScam: false,
      labels: [],
      riskLevel: 'LOW',
      source: 'etherscan',
    };
  }
}

/**
 * Check if address is a known MEV bot or suspicious contract
 */
export async function checkContractSafety(
  address: string,
  apiKey?: string
): Promise<{ isSafe: boolean; warnings: string[] }> {
  try {
    const key = apiKey || process.env.ETHERSCAN_API_KEY || 'YourApiKeyToken';
    
    // Get contract source code
    const response = await fetch(
      `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${address}&apikey=${key}`
    );

    if (!response.ok) {
      return { isSafe: true, warnings: [] };
    }

    const data = await response.json();
    const warnings: string[] = [];
    
    if (data.status === '1' && data.result && data.result[0]) {
      const contract = data.result[0];
      
      // Check for verified contract
      if (!contract.SourceCode || contract.SourceCode === '') {
        warnings.push('Unverified contract - higher risk');
      }
      
      // Check contract name for suspicious patterns
      const suspiciousNames = ['fake', 'phish', 'scam', 'honeypot'];
      const contractName = (contract.ContractName || '').toLowerCase();
      
      if (suspiciousNames.some(sus => contractName.includes(sus))) {
        warnings.push('Suspicious contract name detected');
      }
    }

    return {
      isSafe: warnings.length === 0,
      warnings,
    };
  } catch (error) {
    console.error('[ETHERSCAN] Error checking contract:', error);
    return { isSafe: true, warnings: [] };
  }
}
