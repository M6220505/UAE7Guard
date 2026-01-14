import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Shield, AlertTriangle, Search, FileText, Lock, Globe } from "lucide-react";

interface Endpoint {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  description: string;
  auth: boolean;
  request?: object;
  response?: object;
}

const endpoints: Record<string, Endpoint[]> = {
  networks: [
    {
      method: "GET",
      path: "/api/networks",
      description: "Get list of supported blockchain networks",
      auth: false,
      response: {
        success: true,
        networks: [
          { id: "ethereum", name: "Ethereum", symbol: "ETH", type: "evm" },
          { id: "bitcoin", name: "Bitcoin", symbol: "BTC", type: "utxo" },
          { id: "polygon", name: "Polygon", symbol: "MATIC", type: "evm" },
          { id: "bsc", name: "BNB Smart Chain", symbol: "BNB", type: "evm" }
        ]
      }
    },
    {
      method: "GET",
      path: "/api/wallet/:network/:address",
      description: "Get unified wallet data across any supported network (Bitcoin, Ethereum, BSC, Polygon, etc.)",
      auth: false,
      response: {
        success: true,
        wallet: {
          address: "0x... or bc1...",
          network: "ethereum | bitcoin | polygon | bsc",
          networkType: "evm | utxo",
          isValid: true,
          balance: "1000000000000000000",
          balanceFormatted: "1.0 ETH",
          symbol: "ETH",
          transactionCount: 150,
          walletAgeDays: 365,
          isContract: false
        },
        threats: {
          total: 0,
          verified: 0,
          pending: 0
        }
      }
    }
  ],
  threats: [
    {
      method: "GET",
      path: "/api/threats/:address",
      description: "Look up threat reports for a specific wallet address",
      auth: false,
      response: {
        example: [
          {
            id: "uuid",
            scammerAddress: "0x...",
            scamType: "phishing",
            description: "Phishing attack description",
            status: "verified",
            severity: "high"
          }
        ]
      }
    },
    {
      method: "GET",
      path: "/api/threats?address=0x...",
      description: "Search threats by address query parameter",
      auth: false,
    }
  ],
  reports: [
    {
      method: "GET",
      path: "/api/reports",
      description: "Get all scam reports",
      auth: false,
    },
    {
      method: "POST",
      path: "/api/reports",
      description: "Submit a new scam report",
      auth: true,
      request: {
        scammerAddress: "0x...",
        scamType: "phishing | rugpull | honeypot | fake_ico | pump_dump | other",
        description: "Detailed description of the scam",
        evidenceUrl: "https://...",
        amountLost: "1000 AED"
      }
    }
  ],
  risk: [
    {
      method: "POST",
      path: "/api/risk/calculate",
      description: "Calculate risk score for a wallet using the Million Dirham Formula",
      auth: false,
      request: {
        walletAddress: "0x...",
        walletAgeDays: 365,
        transactionCount: 100,
        blacklistAssociations: 0,
        isDirectlyBlacklisted: false,
        transactionValue: 500000
      },
      response: {
        success: true,
        riskScore: 25,
        riskLevel: "safe | suspicious | dangerous",
        recommendation: "approve | review | block"
      }
    }
  ],
  verification: [
    {
      method: "POST",
      path: "/api/hybrid-verification",
      description: "Perform hybrid AI + blockchain verification for high-value transactions (10,000+ AED)",
      auth: true,
      request: {
        walletAddress: "0x...",
        transactionAmountAED: 50000,
        network: "ethereum",
        assetType: "digital_asset | real_estate_escrow | investment_fund | trade_settlement"
      },
      response: {
        success: true,
        verification: {
          verificationId: "HYB-...",
          certificateId: "SV-2024-XXXX-UAE",
          riskLevel: "safe",
          riskScore: 15,
          onChainFacts: {},
          aiInsight: {}
        }
      }
    },
    {
      method: "GET",
      path: "/api/hybrid-verification/status",
      description: "Check if hybrid verification service is configured",
      auth: false,
    }
  ],
  audit: [
    {
      method: "GET",
      path: "/api/audit/status",
      description: "Check encrypted audit vault status",
      auth: false,
    },
    {
      method: "POST",
      path: "/api/audit/log",
      description: "Create an encrypted audit log entry",
      auth: true,
      request: {
        walletAddress: "0x...",
        transactionValueAED: 100000,
        riskScore: 25,
        riskLevel: "safe",
        analysisDetails: {
          historyScore: 10,
          associationScore: 5,
          walletAgeDays: 365,
          formula: "..."
        }
      }
    },
    {
      method: "GET",
      path: "/api/audit/logs",
      description: "Get all audit logs (encrypted metadata only)",
      auth: true,
    },
    {
      method: "POST",
      path: "/api/reports/pdf",
      description: "Generate PDF report from sovereign verification report data",
      auth: true,
      request: {
        report: {
          reportId: "SVR-...",
          generatedAt: "2024-01-01T00:00:00Z",
          expiresAt: "2024-02-01T00:00:00Z",
          subject: { walletAddress: "0x...", transactionValueAED: 500000 },
          riskAssessment: { riskScore: 25, riskLevel: "low" }
        }
      },
      response: {
        description: "Returns PDF binary file with Content-Type: application/pdf"
      }
    }
  ]
};

function MethodBadge({ method }: { method: string }) {
  const colors: Record<string, string> = {
    GET: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    POST: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    PUT: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    DELETE: "bg-red-500/20 text-red-400 border-red-500/30"
  };
  return (
    <Badge variant="outline" className={`font-mono ${colors[method] || ""}`}>
      {method}
    </Badge>
  );
}

function EndpointCard({ endpoint }: { endpoint: Endpoint }) {
  return (
    <Card className="bg-zinc-900/80 border-zinc-800">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3 flex-wrap">
          <MethodBadge method={endpoint.method} />
          <code className="text-sm font-mono text-cyan-400">{endpoint.path}</code>
          {endpoint.auth && (
            <Badge variant="secondary" className="bg-amber-500/20 text-amber-400">
              <Lock className="h-3 w-3 mr-1" />
              Auth Required
            </Badge>
          )}
        </div>
        <CardDescription className="text-zinc-400 mt-2">
          {endpoint.description}
        </CardDescription>
      </CardHeader>
      {(endpoint.request || endpoint.response) && (
        <CardContent className="space-y-4">
          {endpoint.request && (
            <div>
              <p className="text-xs text-zinc-500 mb-2 uppercase tracking-wider">Request Body</p>
              <pre className="bg-zinc-950 p-3 rounded-lg text-xs text-zinc-300 overflow-x-auto">
                {JSON.stringify(endpoint.request, null, 2)}
              </pre>
            </div>
          )}
          {endpoint.response && (
            <div>
              <p className="text-xs text-zinc-500 mb-2 uppercase tracking-wider">Response</p>
              <pre className="bg-zinc-950 p-3 rounded-lg text-xs text-zinc-300 overflow-x-auto">
                {JSON.stringify(endpoint.response, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

export default function ApiDocs() {
  const categories = [
    { key: "networks", label: "Multi-Chain", icon: Globe },
    { key: "threats", label: "Threat Lookup", icon: Search },
    { key: "reports", label: "Reports", icon: FileText },
    { key: "risk", label: "Risk Analysis", icon: AlertTriangle },
    { key: "verification", label: "Verification", icon: Shield },
    { key: "audit", label: "Audit Logs", icon: Lock },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3" data-testid="heading-api-docs">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20">
              <Code className="h-8 w-8 text-purple-400" />
            </div>
            API Documentation
          </h1>
          <p className="text-zinc-400">
            Integrate UAE7Guard threat intelligence into your applications
          </p>
        </div>

        <Card className="bg-zinc-900/80 border-zinc-800 mb-8">
          <CardHeader>
            <CardTitle className="text-zinc-100">Base URL</CardTitle>
          </CardHeader>
          <CardContent>
            <code className="text-cyan-400 bg-zinc-950 px-3 py-2 rounded-lg block">
              https://uae7guard.com/api
            </code>
            <p className="text-zinc-500 text-sm mt-3">
              All API endpoints are relative to this base URL. Authentication is required for some endpoints.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/80 border-zinc-800 mb-8">
          <CardHeader>
            <CardTitle className="text-zinc-100">Authentication</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-zinc-400">
              Endpoints marked with "Auth Required" need a valid session. Users can authenticate via the login flow:
            </p>
            <div className="bg-zinc-950 p-4 rounded-lg">
              <code className="text-emerald-400 text-sm">GET /api/login</code>
              <p className="text-zinc-500 text-xs mt-2">Redirects to Replit OAuth for authentication</p>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="threats" className="space-y-6">
          <TabsList className="bg-zinc-800/50 border-zinc-700 flex-wrap h-auto gap-1 p-1">
            {categories.map((cat) => (
              <TabsTrigger key={cat.key} value={cat.key} className="gap-2" data-testid={`tab-${cat.key}`}>
                <cat.icon className="h-4 w-4" />
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((cat) => (
            <TabsContent key={cat.key} value={cat.key} className="space-y-4">
              {endpoints[cat.key]?.map((endpoint, i) => (
                <EndpointCard key={i} endpoint={endpoint} />
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
