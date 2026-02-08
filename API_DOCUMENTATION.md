# 📡 UAE7Guard API Documentation

**Version:** 1.0.0  
**Last Updated:** February 8, 2026  
**Base URL:** `https://uae7guard.railway.app` (Production)  
**Base URL:** `http://localhost:5000` (Development)

---

## 🔐 Authentication

All authenticated endpoints require Firebase JWT token:

```bash
Authorization: Bearer <firebase_jwt_token>
```

---

## 📊 Statistics & Analytics

### Get Real Statistics
```http
GET /api/stats/real
```

**Response:**
```json
{
  "success": true,
  "blockchain": {
    "totalWalletsChecked": 125000,
    "scamsDetected": 8500,
    "totalValueProtected": "$42M",
    "activeUsers": 1250
  },
  "global": {
    "cryptoMarketCap": "$2.1T",
    "dailyTransactions": "~1.5M",
    "totalAddresses": "~280M",
    "scamRate": "0.003%"
  },
  "threats": {
    "activeScams": 2550,
    "newScamsToday": 15,
    "totalReported": 8500,
    "recoveredFunds": "$2.3M"
  },
  "performance": {
    "checksPerSecond": 150,
    "averageResponseTime": "1.2s",
    "uptime": "99.8%",
    "accuracy": "94.5%"
  }
}
```

---

### Get Network Statistics
```http
GET /api/stats/networks
```

**Response:**
```json
{
  "success": true,
  "networks": [
    {
      "network": "Ethereum",
      "totalAddresses": 240000000,
      "scamAddresses": 125000,
      "totalVolume": "$1.8T",
      "scamVolume": "$14.5B",
      "riskLevel": "Medium"
    }
  ]
}
```

---

### Get Time-Series Data
```http
GET /api/stats/time-series?days=30
```

**Query Parameters:**
- `days` (optional): Number of days (default: 30)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "date": "2026-01-09",
      "scamsDetected": 25,
      "walletsChecked": 3750,
      "threats": 30
    }
  ]
}
```

---

### Get Recent Activity
```http
GET /api/activity/recent?limit=10
```

**Query Parameters:**
- `limit` (optional): Number of events (default: 10)

**Response:**
```json
{
  "success": true,
  "activity": [
    {
      "timestamp": "2026-02-08T19:15:30.000Z",
      "type": "threat_detected",
      "description": "Phishing address detected on Ethereum",
      "network": "Ethereum",
      "severity": "HIGH"
    }
  ]
}
```

---

### Get Scam Categories
```http
GET /api/stats/categories
```

**Response:**
```json
{
  "success": true,
  "categories": [
    {
      "category": "Phishing",
      "count": 3200,
      "percentage": 32,
      "trend": "up"
    }
  ]
}
```

---

## 🗄️ Scam Databases

### Check All Databases
```http
POST /api/scam-databases/check
```

**Request Body:**
```json
{
  "address": "0x1234567890123456789012345678901234567890",
  "type": "ethereum"
}
```

**Response:**
```json
{
  "success": true,
  "address": "0x1234...",
  "isScam": true,
  "databases": {
    "chainabuse": {
      "found": true,
      "reports": 15,
      "category": "phishing",
      "confidence": "high"
    },
    "bitcoinabuse": {
      "found": false
    },
    "etherscan": {
      "found": true,
      "label": "Fake_Phishing123"
    }
  },
  "riskLevel": "HIGH",
  "recommendation": "DO NOT INTERACT"
}
```

---

### Get Scam Statistics
```http
GET /api/scam-statistics
```

**Response:**
```json
{
  "success": true,
  "totalReports": 125000,
  "verifiedScams": 8500,
  "activeDatabases": 3,
  "intelligence": {
    "totalLosses": "$14.0B+",
    "activePatterns": 10,
    "recentTrends": [
      "Pig butchering scams increasing",
      "AI-generated fake projects"
    ]
  }
}
```

---

## 📚 Case Studies

### Get Case Studies
```http
GET /api/case-studies
```

**Response:**
```json
{
  "success": true,
  "caseStudies": [
    {
      "id": "onecoin",
      "name": "OneCoin",
      "type": "Ponzi Scheme",
      "year": 2019,
      "lossAmount": 4000000000,
      "victims": 3500000,
      "description": "One of the largest cryptocurrency scams...",
      "redFlags": [
        "Founder Ruja Ignatova disappeared in 2017",
        "No public blockchain"
      ],
      "lessonsLearned": [
        "Verify blockchain exists publicly",
        "Be wary of MLM cryptocurrency projects"
      ]
    }
  ],
  "totalCases": 6,
  "commonRedFlags": [
    { "flag": "anonymous team", "frequency": 5 },
    { "flag": "unrealistic returns", "frequency": 4 }
  ],
  "totalLosses": {
    "total": 16000000000,
    "totalVictims": 8592000,
    "averageLossPerVictim": 1862
  }
}
```

---

## 🤖 AI Analysis

### Enhanced AI Analysis
```http
POST /api/ai/enhanced-analysis
```

**Request Body:**
```json
{
  "address": "0x1234...",
  "transactionCount": 150,
  "balance": "5.2 ETH",
  "age": "2 years",
  "contractCode": "unverified",
  "socialMedia": [],
  "websiteContent": "High returns guaranteed!"
}
```

**Response:**
```json
{
  "success": true,
  "riskScore": 85,
  "riskLevel": "CRITICAL",
  "matchedPatterns": ["Ponzi Scheme", "Fake ICO"],
  "warnings": [
    "Matches known Ponzi scheme patterns",
    "Promises unrealistic returns",
    "No verified team members"
  ],
  "recommendations": [
    "Do not invest",
    "Report to authorities",
    "Warn others in community"
  ],
  "reasoning": "This address exhibits multiple red flags...",
  "confidence": 85
}
```

---

## 💰 Pricing & Plans

### Get Pricing Plans
```http
GET /api/pricing/plans
```

**Response:**
```json
{
  "success": true,
  "plans": [
    {
      "id": "free",
      "name": "Community",
      "price": {
        "monthly": "$0",
        "yearly": "$0",
        "aed_monthly": "AED 0",
        "aed_yearly": "AED 0"
      },
      "popular": false,
      "features": [
        { "name": "Basic wallet verification", "included": true },
        { "name": "AI-powered analysis", "included": false }
      ],
      "support": "Community forum"
    },
    {
      "id": "pro",
      "name": "Professional Trader",
      "price": {
        "monthly": "$29.99",
        "yearly": "$299"
      },
      "popular": true
    }
  ]
}
```

---

### Calculate Escrow Fee
```http
POST /api/pricing/calculate-escrow-fee
```

**Request Body:**
```json
{
  "amount": 1000,
  "plan": "pro"
}
```

**Response:**
```json
{
  "success": true,
  "fee": 2.5,
  "feePercentage": 0.25,
  "netAmount": 997.5
}
```

---

## 📈 Usage Tracking

### Get Usage Stats (Authenticated)
```http
GET /api/usage/stats
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "walletChecks": 45,
    "aiAnalysis": 12,
    "liveMonitoring": 3,
    "apiCalls": 0,
    "escrowTransactions": 2,
    "totalActions": 62
  }
}
```

---

### Check Rate Limit (Authenticated)
```http
POST /api/usage/check-limit
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "action": "aiAnalysis",
  "limit": 50
}
```

**Response:**
```json
{
  "success": true,
  "allowed": true,
  "current": 12,
  "limit": 50,
  "resetAt": "2026-03-01T00:00:00.000Z"
}
```

---

## 👑 Admin Endpoints

### Platform Statistics (Admin Only)
```http
GET /api/admin/platform-stats
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "totalUsers": 1250,
  "activeUsers": 850,
  "totalChecks": 125000,
  "revenue": {
    "today": 2450,
    "thisMonth": 45600,
    "thisYear": 485000
  },
  "subscriptions": {
    "free": 850,
    "basic": 250,
    "pro": 120,
    "enterprise": 30
  },
  "mrr": 9247.3,
  "revenueBreakdown": {
    "total": 45600,
    "platform": 31920,
    "development": 6840,
    "operations": 4560,
    "reserves": 2280
  }
}
```

---

## 🔗 Smart Contracts

### Get Contract Info
```http
GET /api/contracts/escrow-info
```

**Response:**
```json
{
  "success": true,
  "contracts": {
    "ethereum": {
      "address": "Not deployed",
      "network": "Ethereum Mainnet",
      "explorerUrl": "https://etherscan.io/address/"
    },
    "testnet": {
      "address": "0x1234567890123456789012345678901234567890",
      "network": "Polygon Mumbai Testnet",
      "explorerUrl": "https://mumbai.polygonscan.com/address/"
    }
  },
  "info": {
    "version": "1.0.0",
    "feeRate": "0.25%",
    "features": [
      "Multi-party escrow",
      "Dispute resolution",
      "Auto-refund on expiry",
      "ETH and ERC20 support"
    ]
  }
}
```

---

## 🚨 Error Responses

All errors follow this format:

```json
{
  "error": "Error message description",
  "code": "ERROR_CODE",
  "details": {}
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request (invalid input)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Rate Limit Exceeded
- `500` - Internal Server Error

---

## 🔥 Rate Limits

**Free Plan:**
- 100 wallet checks/month
- 10 scam database checks/day

**Basic Plan:**
- Unlimited wallet checks
- 50 AI analyses/month

**Pro Plan:**
- Unlimited everything
- 1000 API calls/day

**Enterprise Plan:**
- No limits

---

## 📞 Support

- **Email:** support@uae7guard.com
- **Docs:** https://docs.uae7guard.com
- **Status:** https://status.uae7guard.com

---

## 🔄 Changelog

### v1.0.0 (2026-02-08)
- ✅ Real scam databases (ChainAbuse, BitcoinAbuse, Etherscan)
- ✅ AI-powered analysis with historical scam patterns
- ✅ Case studies database ($14B+ documented losses)
- ✅ Real-time statistics and analytics
- ✅ Usage tracking and rate limiting
- ✅ Smart contract integration (Escrow)
- ✅ 4-tier pricing system
- ✅ Revenue sharing system
