import { db } from "./db";
import { users, userReputation, scamReports, alerts, watchlist } from "@shared/schema";

const knownScamAddresses = [
  {
    address: "0x957cD4Ff9b3894FC78b5134A8DC72b032fFbC464",
    type: "phishing",
    network: "ethereum",
    description: "Address poisoning attack - impersonates legitimate addresses by creating similar-looking transactions",
    amountLost: 85000,
    currency: "USDT"
  },
  {
    address: "0x8589427373D6D84E98730D7795D8f6f8731FDA16",
    type: "rug_pull",
    network: "ethereum", 
    description: "Fake DeFi protocol - liquidity removed after attracting deposits",
    amountLost: 420,
    currency: "ETH"
  },
  {
    address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    type: "ransomware",
    network: "bitcoin",
    description: "WannaCry ransomware payment collection address",
    amountLost: 15,
    currency: "BTC"
  },
  {
    address: "0x28C6c06298d514Db089934071355E5743bf21d60",
    type: "exchange_hack",
    network: "ethereum",
    description: "Funds traced from major exchange breach - laundering through multiple hops",
    amountLost: 3400,
    currency: "ETH"
  },
  {
    address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    type: "impersonation",
    network: "bitcoin",
    description: "Scammers impersonating Satoshi Nakamoto for Bitcoin doubling scam",
    amountLost: 8.9,
    currency: "BTC"
  },
  {
    address: "0x3cD751E6b0078Be393132286c442345e5DC49699",
    type: "pig_butchering",
    network: "ethereum",
    description: "Romance scam operation - victims directed to fake investment platform",
    amountLost: 550000,
    currency: "USDC"
  },
  {
    address: "TKsmfPnCJTjHvbqFvMz5DmtVnxRhL7cp7J",
    type: "ponzi",
    network: "tron",
    description: "High-yield investment fraud promising 10% daily returns",
    amountLost: 120000,
    currency: "USDT"
  },
  {
    address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    type: "fake_airdrop",
    network: "ethereum",
    description: "Fake UNI token airdrop - malicious approval drains wallets",
    amountLost: 89,
    currency: "ETH"
  },
  {
    address: "bc1qm34lsc65zpw79lxes69zkqmk6ee3ewf0j77s3h",
    type: "sextortion",
    network: "bitcoin",
    description: "Sextortion email campaign demanding Bitcoin payment",
    amountLost: 4.5,
    currency: "BTC"
  },
  {
    address: "0x000000000000000000000000000000000000dEaD",
    type: "honeypot",
    network: "ethereum",
    description: "Honeypot token - buy transactions succeed but sells fail",
    amountLost: 32,
    currency: "ETH"
  },
  {
    address: "0xA0b86a33E6441C8e9b8a8B3B1c8f8C5F5f5f5f5F",
    type: "address_poisoning",
    network: "ethereum",
    description: "Zero-value transfer spam creating confusing transaction history",
    amountLost: 250000,
    currency: "USDT"
  },
  {
    address: "3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5",
    type: "investment_fraud",
    network: "bitcoin",
    description: "Fake crypto fund promising guaranteed returns from arbitrage",
    amountLost: 21,
    currency: "BTC"
  },
  {
    address: "0x742d35Cc6634C0532925a3b844Bc9e7595f1B5d8",
    type: "smart_contract_exploit",
    network: "ethereum",
    description: "Malicious contract with hidden withdrawal function",
    amountLost: 145,
    currency: "ETH"
  },
  {
    address: "TLa2f6VPqDgRE67v1736s7bJ8Ray5wYjU7",
    type: "fake_exchange",
    network: "tron",
    description: "Fake exchange platform - deposits cannot be withdrawn",
    amountLost: 67000,
    currency: "TRX"
  },
  {
    address: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
    type: "flash_loan_attack",
    network: "ethereum",
    description: "Flash loan manipulation exploiting price oracle",
    amountLost: 1200,
    currency: "ETH"
  }
];

const investigators = [
  { username: "CryptoHunter_AE", email: "hunter@uae7guard.com", rank: "Sentinel", points: 15420, verified: 89 },
  { username: "BlockchainWatch", email: "watch@uae7guard.com", rank: "Investigator", points: 8750, verified: 45 },
  { username: "DeFiDetective", email: "detective@uae7guard.com", rank: "Investigator", points: 7200, verified: 38 },
  { username: "ChainAnalyst", email: "analyst@uae7guard.com", rank: "Analyst", points: 4500, verified: 22 },
  { username: "ScamBuster_Dubai", email: "buster@uae7guard.com", rank: "Analyst", points: 3800, verified: 18 },
  { username: "DubaiGuardian", email: "guardian@uae7guard.com", rank: "Novice", points: 1200, verified: 8 },
  { username: "UAECryptoWatch", email: "uaewatch@uae7guard.com", rank: "Novice", points: 650, verified: 4 },
];

export async function seedDatabase() {
  console.log("Seeding database with threat intelligence data...");

  // Create investigators
  const createdUsers = [];
  for (const inv of investigators) {
    const [user] = await db.insert(users).values({
      username: inv.username,
      password: "hashed_password_placeholder",
      email: inv.email
    }).onConflictDoNothing().returning();
    
    if (user) {
      createdUsers.push({ ...user, ...inv });
      
      // Add reputation
      await db.insert(userReputation).values({
        userId: user.id,
        rank: inv.rank as any,
        trustScore: inv.points,
        verifiedReports: inv.verified
      }).onConflictDoNothing();
    }
  }

  // Create scam reports
  for (let i = 0; i < knownScamAddresses.length; i++) {
    const scam = knownScamAddresses[i];
    const reporter = createdUsers[i % createdUsers.length];
    
    if (!reporter) continue;

    const daysAgo = Math.floor(Math.random() * 90);
    const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

    await db.insert(scamReports).values({
      reporterId: reporter.id,
      scammerAddress: scam.address.toLowerCase(),
      scamType: scam.type,
      description: `[${scam.network.toUpperCase()}] ${scam.description}. Amount lost: ${scam.amountLost.toLocaleString()} ${scam.currency}`,
      amountLost: scam.amountLost.toString(),
      status: "verified",
      severity: scam.amountLost > 1000000 ? "critical" : scam.amountLost > 100000 ? "high" : "medium",
      verifiedBy: reporter.id,
      verifiedAt: createdAt
    }).onConflictDoNothing();
  }

  // Create demo user with watchlist and alerts
  const [demoUser] = await db.insert(users).values({
    username: "demo-user",
    password: "demo-password",
    email: "demo@uae7guard.com"
  }).onConflictDoNothing().returning();

  if (demoUser) {
    await db.insert(userReputation).values({
      userId: demoUser.id,
      rank: "Analyst",
      trustScore: 2450,
      verifiedReports: 8
    }).onConflictDoNothing();

    // Add watchlist items
    const watchlistAddresses = [
      { address: "0x957cD4Ff9b3894FC78b5134A8DC72b032fFbC464", network: "ethereum", label: "Suspected phishing" },
      { address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh", network: "bitcoin", label: "Ransomware address" },
      { address: "0x3cD751E6b0078Be393132286c442345e5DC49699", network: "ethereum", label: "Romance scam wallet" },
    ];

    for (const w of watchlistAddresses) {
      await db.insert(watchlist).values({
        userId: demoUser.id,
        address: w.address.toLowerCase(),
        label: w.label
      }).onConflictDoNothing();
    }

    // Add alerts
    const alertMessages = [
      { title: "Threat Detected", message: "High-risk address detected in your watchlist: 0x957c...C464 linked to $2.6M phishing attack", severity: "high" as const },
      { title: "Report Verified", message: "Your report on address bc1qxy2k...0wlh has been verified. +150 reputation points earned.", severity: "medium" as const },
      { title: "New Activity", message: "New transaction detected on watched address 0x3cD7...9699", severity: "low" as const },
      { title: "System Update", message: "Weekly threat intelligence report is ready for download", severity: "low" as const },
    ];

    for (const alert of alertMessages) {
      await db.insert(alerts).values({
        userId: demoUser.id,
        title: alert.title,
        message: alert.message,
        severity: alert.severity
      }).onConflictDoNothing();
    }
  }

  console.log("Database seeded successfully with:");
  console.log(`- ${investigators.length} investigators`);
  console.log(`- ${knownScamAddresses.length} verified threat reports`);
  console.log("- Demo user with watchlist and alerts");
}
