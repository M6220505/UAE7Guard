/**
 * Real Cryptocurrency Scam Patterns
 * Based on actual fraud cases and blockchain analysis
 */

export interface ScamPattern {
  id: string;
  name: string;
  description: string;
  indicators: string[];
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  realExamples: string[];
}

export const REAL_SCAM_PATTERNS: ScamPattern[] = [
  {
    id: 'ponzi_scheme',
    name: 'Ponzi Scheme',
    description: 'Promises unrealistic returns, pays early investors with new investor funds',
    indicators: [
      'Guaranteed high returns (>20% monthly)',
      'Referral/pyramid structure',
      'No clear business model',
      'Pressure to recruit others',
      'Difficulty withdrawing funds',
    ],
    severity: 'CRITICAL',
    realExamples: [
      'BitConnect ($2.5B loss, 2018)',
      'PlusToken ($2.9B loss, 2019)',
      'OneCoin ($4B+ loss, 2014-2019)',
    ],
  },
  {
    id: 'fake_ico',
    name: 'Fake ICO/Token Sale',
    description: 'Fraudulent token sales with no real product or team',
    indicators: [
      'Anonymous team members',
      'Copied whitepaper',
      'No GitHub repository',
      'Unrealistic roadmap',
      'Heavy marketing, no substance',
    ],
    severity: 'CRITICAL',
    realExamples: [
      'Pincoin & iFan ($660M loss, 2018)',
      'Centra Tech ($25M loss, 2017)',
      'PlexCoin ($15M loss, 2017)',
    ],
  },
  {
    id: 'rug_pull',
    name: 'Rug Pull',
    description: 'Developers abandon project and steal investor funds',
    indicators: [
      'Liquidity not locked',
      'High token concentration',
      'Anonymous developers',
      'Social media deleted',
      'Sudden price crash',
    ],
    severity: 'CRITICAL',
    realExamples: [
      'AnubisDAO ($60M loss, 2021)',
      'Squid Game Token ($3.4M loss, 2021)',
      'Thodex ($2B loss, 2021)',
    ],
  },
  {
    id: 'phishing',
    name: 'Phishing Attack',
    description: 'Fake websites/emails stealing private keys or seed phrases',
    indicators: [
      'Suspicious URL (typosquatting)',
      'Urgent security warnings',
      'Requests for seed phrase/private key',
      'Too-good-to-be-true offers',
      'Impersonates legitimate service',
    ],
    severity: 'HIGH',
    realExamples: [
      'Fake MetaMask sites (ongoing)',
      'Twitter crypto giveaway scams',
      'Fake Uniswap interfaces',
    ],
  },
  {
    id: 'pump_dump',
    name: 'Pump and Dump',
    description: 'Coordinated price manipulation followed by mass selling',
    indicators: [
      'Sudden volume spike',
      'Social media hype',
      'Coordinated buy signals',
      'Sharp price increase then crash',
      'Low liquidity token',
    ],
    severity: 'HIGH',
    realExamples: [
      'BitConnect (2018)',
      'Various Telegram pump groups',
      'Meme coins on DEXes',
    ],
  },
  {
    id: 'fake_exchange',
    name: 'Fake Exchange',
    description: 'Fraudulent trading platform stealing deposits',
    indicators: [
      'Unrealistic trading bonuses',
      'No KYC requirements',
      'Cannot withdraw funds',
      'Fake trading volume',
      'Unknown ownership',
    ],
    severity: 'CRITICAL',
    realExamples: [
      'QuadrigaCX ($190M loss, 2019)',
      'Mt. Gox ($450M loss, 2014)',
      'Africrypt ($3.6B loss, 2021)',
    ],
  },
  {
    id: 'honeypot',
    name: 'Honeypot Token',
    description: 'Token contract prevents selling - only buying allowed',
    indicators: [
      'Cannot sell token',
      'Price only goes up',
      'Modified transfer function',
      'Hidden contract code',
      'No liquidity removal possible',
    ],
    severity: 'HIGH',
    realExamples: [
      'SQUID token (2021)',
      'Various BSC honeypots',
      'Fake SafeMoon clones',
    ],
  },
  {
    id: 'impersonation',
    name: 'Impersonation Scam',
    description: 'Pretends to be celebrity, influencer, or official account',
    indicators: [
      'Fake verified badges',
      'Giveaway requiring upfront payment',
      'Send crypto to receive more back',
      'Urgency tactics',
      'Similar username to real account',
    ],
    severity: 'MEDIUM',
    realExamples: [
      'Fake Elon Musk giveaways',
      'YouTube live stream scams',
      'Twitter impersonation',
    ],
  },
  {
    id: 'mev_bot',
    name: 'Malicious MEV Bot',
    description: 'Front-running bot or scam claiming to be MEV bot',
    indicators: [
      'Guaranteed MEV profits',
      'Requires deposit to activate',
      'Unverified contract',
      'No actual MEV activity',
      'Cannot withdraw funds',
    ],
    severity: 'MEDIUM',
    realExamples: [
      'Fake Flashbots clones',
      'Telegram MEV bot scams',
      'YouTube MEV tutorials with scam links',
    ],
  },
  {
    id: 'romance_scam',
    name: 'Romance/Pig Butchering',
    description: 'Builds relationship then convinces victim to invest in fake platform',
    indicators: [
      'Romantic interest from stranger',
      'Gradually introduces crypto',
      'Shows fake trading profits',
      'Platform looks legitimate',
      'Cannot withdraw large amounts',
    ],
    severity: 'HIGH',
    realExamples: [
      'Pig butchering scams ($3B+ annually)',
      'Dating app crypto scams',
      'WhatsApp investment fraud',
    ],
  },
];

/**
 * Get scam pattern by indicators
 */
export function detectScamPattern(indicators: {
  hasAnonymousTeam?: boolean;
  promisesHighReturns?: boolean;
  hasReferralStructure?: boolean;
  cannotWithdraw?: boolean;
  suddenPriceSpike?: boolean;
  requestsSeedPhrase?: boolean;
  unverifiedContract?: boolean;
  noLiquidity?: boolean;
  impersonatesEntity?: boolean;
  [key: string]: boolean | undefined;
}): ScamPattern[] {
  const matches: ScamPattern[] = [];

  for (const pattern of REAL_SCAM_PATTERNS) {
    let matchScore = 0;
    
    // Check if any indicators match
    if (indicators.hasAnonymousTeam && 
        (pattern.id === 'fake_ico' || pattern.id === 'rug_pull')) {
      matchScore += 2;
    }
    
    if (indicators.promisesHighReturns && pattern.id === 'ponzi_scheme') {
      matchScore += 3;
    }
    
    if (indicators.hasReferralStructure && pattern.id === 'ponzi_scheme') {
      matchScore += 2;
    }
    
    if (indicators.cannotWithdraw && 
        (pattern.id === 'honeypot' || pattern.id === 'fake_exchange')) {
      matchScore += 3;
    }
    
    if (indicators.requestsSeedPhrase && pattern.id === 'phishing') {
      matchScore += 3;
    }
    
    if (indicators.unverifiedContract && 
        (pattern.id === 'honeypot' || pattern.id === 'rug_pull')) {
      matchScore += 2;
    }

    if (matchScore >= 2) {
      matches.push(pattern);
    }
  }

  return matches.sort((a, b) => {
    const severityOrder = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
    return severityOrder[b.severity] - severityOrder[a.severity];
  });
}

/**
 * Get all patterns by severity
 */
export function getPatternsBySeverity(severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'): ScamPattern[] {
  return REAL_SCAM_PATTERNS.filter(p => p.severity === severity);
}

/**
 * Get total amount lost to scams (estimated from real data)
 */
export function getTotalScamLosses(): {
  totalUSD: number;
  byYear: { year: number; amount: number }[];
  majorScams: { name: string; amount: number; year: number }[];
} {
  return {
    totalUSD: 14_000_000_000, // $14B+ in major scams
    byYear: [
      { year: 2024, amount: 2_100_000_000 },
      { year: 2023, amount: 3_800_000_000 },
      { year: 2022, amount: 3_700_000_000 },
      { year: 2021, amount: 7_800_000_000 },
      { year: 2020, amount: 1_900_000_000 },
    ],
    majorScams: [
      { name: 'OneCoin', amount: 4_000_000_000, year: 2019 },
      { name: 'Africrypt', amount: 3_600_000_000, year: 2021 },
      { name: 'PlusToken', amount: 2_900_000_000, year: 2019 },
      { name: 'BitConnect', amount: 2_500_000_000, year: 2018 },
      { name: 'Thodex', amount: 2_000_000_000, year: 2021 },
    ],
  };
}
