/**
 * Real Cryptocurrency Scam Case Studies
 * Based on actual documented fraud cases
 */

export interface CaseStudy {
  id: string;
  name: string;
  type: string;
  year: number;
  lossAmount: number; // USD
  victims: number;
  description: string;
  howItWorked: string[];
  redFlags: string[];
  outcome: string;
  source: string;
  lessonsLearned: string[];
}

export const REAL_CASE_STUDIES: CaseStudy[] = [
  {
    id: 'onecoin',
    name: 'OneCoin',
    type: 'Ponzi Scheme',
    year: 2019,
    lossAmount: 4_000_000_000,
    victims: 3_500_000,
    description: 'One of the largest cryptocurrency scams in history, OneCoin claimed to be a revolutionary cryptocurrency but was actually a Ponzi scheme with no real blockchain.',
    howItWorked: [
      'Promised educational packages about cryptocurrency',
      'Sold "tokens" that could supposedly be mined',
      'MLM structure with recruitment bonuses',
      'No actual blockchain - centralized database',
      'Restricted trading on internal exchange only',
    ],
    redFlags: [
      'Founder Ruja Ignatova disappeared in 2017',
      'No public blockchain',
      'MLM/pyramid structure',
      'Guaranteed returns',
      'Heavy recruitment focus',
    ],
    outcome: 'Founder arrested (2017), $4B+ stolen, criminal investigations worldwide',
    source: 'FBI, DOJ, BBC investigations',
    lessonsLearned: [
      'Verify blockchain exists publicly',
      'Be wary of MLM cryptocurrency projects',
      'No legitimate crypto guarantees returns',
      'Anonymous leadership is a major red flag',
    ],
  },
  {
    id: 'bitconnect',
    name: 'BitConnect',
    type: 'High-Yield Investment Program (Ponzi)',
    year: 2018,
    lossAmount: 2_500_000_000,
    victims: 1_000_000,
    description: 'BitConnect promised daily returns through a "trading bot" but was actually paying old investors with new investor money.',
    howItWorked: [
      'Lending platform promising 1% daily returns',
      'Claimed to use trading bot for profits',
      'Required users to convert BTC to BCC token',
      'Referral bonuses for recruitment',
      'Locked funds for 120-299 days',
    ],
    redFlags: [
      'Unrealistic returns (365%+ annually)',
      'Referral structure',
      'Opaque trading strategy',
      'Pressure to recruit',
      'Lock-up periods',
    ],
    outcome: 'Platform shutdown (Jan 2018), token crashed 96%, lawsuits ongoing',
    source: 'SEC, FTC, court documents',
    lessonsLearned: [
      '1% daily returns are unsustainable',
      'Trading bots dont guarantee profits',
      'Lockup periods prevent exit',
      'Recruitment focus = Ponzi scheme',
    ],
  },
  {
    id: 'squid_token',
    name: 'Squid Game Token (SQUID)',
    type: 'Rug Pull',
    year: 2021,
    lossAmount: 3_400_000,
    victims: 40_000,
    description: 'Token inspired by Netflix show Squid Game that prevented holders from selling - classic honeypot scam.',
    howItWorked: [
      'Marketed as play-to-earn game',
      'Price rose from $0.01 to $2,861',
      'Token contract prevented selling',
      'Required MARBLES token to sell',
      'Developers dumped and vanished',
    ],
    redFlags: [
      'Cannot sell token (honeypot)',
      'Unverified contract code',
      'Anonymous team',
      'Copied from popular media',
      'No working product',
    ],
    outcome: 'Rug pulled in Nov 2021, price crashed to $0, developers disappeared',
    source: 'CoinMarketCap, blockchain analysis',
    lessonsLearned: [
      'Always check if you can sell before buying',
      'Verify contract code',
      'Test with small amount first',
      'Trending topics attract scammers',
    ],
  },
  {
    id: 'plustoken',
    name: 'PlusToken',
    type: 'Ponzi Scheme',
    year: 2019,
    lossAmount: 2_900_000_000,
    victims: 3_000_000,
    description: 'Asia-focused Ponzi scheme promising 10-30% monthly returns through "AI trading".',
    howItWorked: [
      'Wallet app with AI trading bot claims',
      'Monthly returns of 10-30%',
      'Referral bonuses',
      'Required minimum $500 deposit',
      'Marketed heavily in China/Korea',
    ],
    redFlags: [
      'Unrealistic monthly returns',
      'Vague AI trading claims',
      'Heavy recruitment focus',
      'Anonymous team',
      'Withdrawal delays',
    ],
    outcome: '6 arrests in 2020, $2.9B stolen, Chinese authorities recovered some funds',
    source: 'Chinese authorities, blockchain forensics',
    lessonsLearned: [
      '10-30% monthly = impossible long-term',
      'AI trading claims often fraudulent',
      'Geographical targeting = warning sign',
      'Withdrawal issues = exit scam starting',
    ],
  },
  {
    id: 'anubisdao',
    name: 'AnubisDAO',
    type: 'Rug Pull',
    year: 2021,
    lossAmount: 60_000_000,
    victims: 952,
    description: 'DeFi project that collected funds and immediately drained liquidity within 20 hours.',
    howItWorked: [
      'Launched as dog-themed DeFi fork',
      'Raised 13,556 ETH ($60M)',
      'Liquidity drained within 20 hours',
      'Team vanished with funds',
      'No prior audit or vesting',
    ],
    redFlags: [
      'Anonymous team',
      'No liquidity lock',
      'No token vesting',
      'Fork of existing project',
      'Rapid fundraise',
    ],
    outcome: 'Funds stolen Oct 2021, no recovery, team disappeared',
    source: 'Etherscan, DeFi analysis',
    lessonsLearned: [
      'Check for liquidity locks',
      'Verify team identity',
      'Audits are essential',
      'Be wary of forks/clones',
    ],
  },
  {
    id: 'africrypt',
    name: 'Africrypt',
    type: 'Exchange Exit Scam',
    year: 2021,
    lossAmount: 3_600_000_000,
    victims: 69_000,
    description: 'South African crypto investment platform where founders disappeared with billions in Bitcoin.',
    howItWorked: [
      'Investment platform with high returns',
      'Claimed hack to cover exit',
      'Deleted evidence and fled',
      'Moved BTC through mixers',
      'Brothers Raees and Ameer Cajee vanished',
    ],
    redFlags: [
      'Centralized custody',
      'Promised high returns',
      'No insurance or regulation',
      'Young, inexperienced founders',
      'Sudden "hack" claim',
    ],
    outcome: 'Founders fled Apr 2021, $3.6B missing, international manhunt ongoing',
    source: 'Law enforcement, media reports',
    lessonsLearned: [
      'Not your keys, not your coins',
      'Custody matters critically',
      'Regulated platforms safer',
      'Hack claims often cover theft',
    ],
  },
];

/**
 * Get case studies by type
 */
export function getCaseStudiesByType(type: string): CaseStudy[] {
  return REAL_CASE_STUDIES.filter(cs => 
    cs.type.toLowerCase().includes(type.toLowerCase())
  );
}

/**
 * Get case studies by year range
 */
export function getCaseStudiesByYear(startYear: number, endYear: number): CaseStudy[] {
  return REAL_CASE_STUDIES.filter(cs => 
    cs.year >= startYear && cs.year <= endYear
  );
}

/**
 * Get total losses from case studies
 */
export function getTotalDocumentedLosses(): {
  total: number;
  totalVictims: number;
  averageLossPerVictim: number;
} {
  const total = REAL_CASE_STUDIES.reduce((sum, cs) => sum + cs.lossAmount, 0);
  const totalVictims = REAL_CASE_STUDIES.reduce((sum, cs) => sum + cs.victims, 0);
  
  return {
    total,
    totalVictims,
    averageLossPerVictim: Math.round(total / totalVictims),
  };
}

/**
 * Get common red flags across all cases
 */
export function getCommonRedFlags(): { flag: string; frequency: number }[] {
  const flagMap = new Map<string, number>();
  
  REAL_CASE_STUDIES.forEach(cs => {
    cs.redFlags.forEach(flag => {
      const normalized = flag.toLowerCase();
      flagMap.set(normalized, (flagMap.get(normalized) || 0) + 1);
    });
  });
  
  return Array.from(flagMap.entries())
    .map(([flag, frequency]) => ({ flag, frequency }))
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 10);
}
