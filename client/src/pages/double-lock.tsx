import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { 
  Shield, Lock, Cpu, Database, FileText, 
  CheckCircle2, AlertTriangle, XCircle, Loader2,
  Download, Copy, ExternalLink, Fingerprint,
  Server, Brain, Clock, Hash
} from "lucide-react";

const formSchema = z.object({
  walletAddress: z.string().min(10, "Wallet address is required"),
  transactionValueAED: z.string().min(1, "Transaction value is required"),
  network: z.string().default("ethereum"),
  walletAgeDays: z.string().min(1, "Wallet age is required"),
  includeAI: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

interface SovereignReport {
  reportId: string;
  generatedAt: string;
  expiresAt: string;
  verification: {
    alchemyNode: string;
    alchemyNetwork: string;
    aiModel: string;
    encryptionStandard: string;
    hashAlgorithm: string;
  };
  subject: {
    walletAddress: string;
    transactionValueAED: number;
    network: string;
  };
  blockchainIntelligence: {
    balance: string;
    transactionCount: number;
    isSmartContract: boolean;
    dataSource: string;
  };
  riskAssessment: {
    riskScore: number;
    riskLevel: string;
    formula: string;
    components: {
      historyScore: number;
      associationScore: number;
      walletAgeFactor: number;
    };
  };
  aiIntelligence?: {
    analysis: string;
    recommendation: string;
    riskFactors: string[];
    modelUsed: string;
  };
  threatDatabase: {
    verifiedThreats: number;
    database: string;
    lastUpdated: string;
  };
  legalDisclaimer: {
    en: string;
    ar: string;
  };
  auditTrail: {
    transactionHash: string;
    dataHash: string;
    encryptedAt: string;
    storageLocation: string;
  };
}

interface ReportResponse {
  success: boolean;
  report: SovereignReport;
  textReport: string;
}

function getRiskColor(level: string) {
  switch (level.toLowerCase()) {
    case "safe": return "text-emerald-400";
    case "suspicious": return "text-amber-400";
    case "danger":
    case "dangerous": return "text-red-400";
    default: return "text-zinc-400";
  }
}

function getRiskBadgeVariant(level: string): "default" | "secondary" | "destructive" | "outline" {
  switch (level.toLowerCase()) {
    case "safe": return "default";
    case "suspicious": return "secondary";
    case "danger":
    case "dangerous": return "destructive";
    default: return "outline";
  }
}

function getRiskIcon(level: string) {
  switch (level.toLowerCase()) {
    case "safe": return <CheckCircle2 className="h-5 w-5 text-emerald-400" />;
    case "suspicious": return <AlertTriangle className="h-5 w-5 text-amber-400" />;
    default: return <XCircle className="h-5 w-5 text-red-400" />;
  }
}

export default function DoubleLock() {
  const [report, setReport] = useState<SovereignReport | null>(null);
  const [textReport, setTextReport] = useState<string>("");
  const { toast } = useToast();

  const { data: auditStatus } = useQuery<{ configured: boolean; minValueAED: number; message: string }>({
    queryKey: ["/api/audit/status"],
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });

  const { data: blockchainStatus } = useQuery<{ configured: boolean }>({
    queryKey: ["/api/blockchain/status"],
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      walletAddress: "",
      transactionValueAED: "500000",
      network: "ethereum",
      walletAgeDays: "365",
      includeAI: true,
    },
  });

  const generateReport = useMutation({
    mutationFn: async (data: FormValues) => {
      const response = await fetch("/api/sovereign/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: data.walletAddress,
          transactionValueAED: parseFloat(data.transactionValueAED.replace(/,/g, "")),
          network: data.network,
          walletAgeDays: parseInt(data.walletAgeDays),
          includeAI: data.includeAI,
        }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate report");
      }
      return response.json() as Promise<ReportResponse>;
    },
    onSuccess: (data) => {
      setReport(data.report);
      setTextReport(data.textReport);
      toast({
        title: "Report Generated",
        description: `Report ID: ${data.report.reportId}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard" });
  };

  const downloadReport = () => {
    if (!textReport) return;
    const blob = new Blob([textReport], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `UAE7Guard_Report_${report?.reportId || "unknown"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatAED = (value: string) => {
    const num = parseFloat(value.replace(/,/g, ""));
    if (isNaN(num)) return value;
    return num.toLocaleString("en-AE");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 -m-6 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-2 py-8">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 mb-4">
            <Lock className="h-5 w-5 text-blue-400" />
            <span className="text-blue-400 text-sm font-medium">Double-Lock Verification System</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200 bg-clip-text text-transparent">
            Sovereign Verification Report
          </h1>
          <p className="text-blue-200/60 max-w-2xl mx-auto">
            Enterprise-grade verification combining blockchain intelligence (Alchemy) with AI behavioral analysis (GPT-4o)
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card className="bg-zinc-900/60 border-zinc-700/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/20">
                  <Database className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Phase 1: Raw Data</p>
                  <p className="font-medium text-zinc-100">Alchemy Supernode</p>
                </div>
                {blockchainStatus?.configured ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 ml-auto" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-amber-400 ml-auto" />
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/60 border-zinc-700/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <Brain className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Phase 2: AI Analysis</p>
                  <p className="font-medium text-zinc-100">GPT-4o Model</p>
                </div>
                <CheckCircle2 className="h-5 w-5 text-emerald-400 ml-auto" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/60 border-zinc-700/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <Lock className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Encryption Vault</p>
                  <p className="font-medium text-zinc-100">AES-256-GCM</p>
                </div>
                {auditStatus?.configured ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 ml-auto" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-amber-400 ml-auto" />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <Card className="bg-zinc-900/80 border-blue-500/20 backdrop-blur-sm">
            <CardHeader className="border-b border-blue-500/10">
              <CardTitle className="text-blue-100 flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-500" />
                Verification Request
              </CardTitle>
              <CardDescription className="text-blue-200/50">
                Enter wallet details for sovereign verification
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit((data) => generateReport.mutate(data))} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="walletAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-blue-200">Wallet Address</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="0x..."
                            className="bg-zinc-800/50 border-zinc-700 font-mono text-sm"
                            data-testid="input-wallet-address"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="transactionValueAED"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-blue-200">Transaction Value (AED)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="500,000"
                            className="bg-zinc-800/50 border-zinc-700"
                            onChange={(e) => field.onChange(formatAED(e.target.value))}
                            data-testid="input-transaction-value"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="network"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-blue-200">Network</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-zinc-800/50 border-zinc-700" data-testid="select-network">
                                <SelectValue placeholder="Select network" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="ethereum">Ethereum</SelectItem>
                              <SelectItem value="polygon">Polygon</SelectItem>
                              <SelectItem value="arbitrum">Arbitrum</SelectItem>
                              <SelectItem value="optimism">Optimism</SelectItem>
                              <SelectItem value="base">Base</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="walletAgeDays"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-blue-200">Wallet Age (Days)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              className="bg-zinc-800/50 border-zinc-700"
                              data-testid="input-wallet-age"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="includeAI"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border border-zinc-700 p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-blue-200">Include AI Analysis</FormLabel>
                          <p className="text-sm text-zinc-400">
                            Behavioral pattern detection via GPT-4o
                          </p>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="switch-include-ai"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={generateReport.isPending || !auditStatus?.configured}
                    data-testid="button-generate-report"
                  >
                    {generateReport.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Sovereign Report...
                      </>
                    ) : (
                      <>
                        <FileText className="mr-2 h-4 w-4" />
                        Generate Sovereign Report
                      </>
                    )}
                  </Button>

                  {!auditStatus?.configured && (
                    <p className="text-sm text-amber-400 text-center">
                      Encryption vault not configured. ENCRYPTION_KEY required.
                    </p>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>

          {report ? (
            <Card className="bg-zinc-900/80 border-emerald-500/20 backdrop-blur-sm">
              <CardHeader className="border-b border-emerald-500/10">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-emerald-100 flex items-center gap-2">
                      <Fingerprint className="h-5 w-5 text-emerald-500" />
                      Report: {report.reportId}
                    </CardTitle>
                    <CardDescription className="text-emerald-200/50">
                      Generated: {new Date(report.generatedAt).toLocaleString("en-AE")}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="outline" onClick={() => copyToClipboard(textReport)} data-testid="button-copy-report">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="outline" onClick={downloadReport} data-testid="button-download-report">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-800/50" data-testid="card-risk-assessment">
                      <div className="flex items-center gap-3">
                        {getRiskIcon(report.riskAssessment.riskLevel)}
                        <div>
                          <p className="text-sm text-zinc-400">Risk Assessment</p>
                          <p className={`text-2xl font-bold ${getRiskColor(report.riskAssessment.riskLevel)}`} data-testid="text-risk-score">
                            {report.riskAssessment.riskScore}/100
                          </p>
                        </div>
                      </div>
                      <Badge variant={getRiskBadgeVariant(report.riskAssessment.riskLevel)} className="text-lg px-4 py-1" data-testid="badge-risk-level">
                        {report.riskAssessment.riskLevel.toUpperCase()}
                      </Badge>
                    </div>

                    <Separator className="bg-zinc-700" />

                    <div>
                      <h4 className="text-sm font-medium text-zinc-400 mb-3 flex items-center gap-2">
                        <Server className="h-4 w-4" />
                        Verification Sources
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg bg-zinc-800/30">
                          <p className="text-xs text-zinc-500">Blockchain Node</p>
                          <p className="text-sm text-zinc-200 font-mono" data-testid="text-alchemy-node">{report.verification.alchemyNode}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-zinc-800/30">
                          <p className="text-xs text-zinc-500">AI Model</p>
                          <p className="text-sm text-zinc-200 font-mono" data-testid="text-ai-model">{report.verification.aiModel}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-zinc-800/30">
                          <p className="text-xs text-zinc-500">Encryption</p>
                          <p className="text-sm text-zinc-200 font-mono" data-testid="text-encryption">{report.verification.encryptionStandard}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-zinc-800/30">
                          <p className="text-xs text-zinc-500">Hash Algorithm</p>
                          <p className="text-sm text-zinc-200 font-mono" data-testid="text-hash-algorithm">{report.verification.hashAlgorithm}</p>
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-zinc-700" />

                    <div>
                      <h4 className="text-sm font-medium text-zinc-400 mb-3 flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        Blockchain Intelligence
                      </h4>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 rounded-lg bg-zinc-800/30 text-center">
                          <p className="text-xs text-zinc-500">Balance</p>
                          <p className="text-lg font-bold text-zinc-100" data-testid="text-balance">{report.blockchainIntelligence.balance}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-zinc-800/30 text-center">
                          <p className="text-xs text-zinc-500">Transactions</p>
                          <p className="text-lg font-bold text-zinc-100" data-testid="text-transaction-count">{report.blockchainIntelligence.transactionCount}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-zinc-800/30 text-center">
                          <p className="text-xs text-zinc-500">Smart Contract</p>
                          <p className="text-lg font-bold text-zinc-100" data-testid="text-is-contract">{report.blockchainIntelligence.isSmartContract ? "Yes" : "No"}</p>
                        </div>
                      </div>
                    </div>

                    {report.aiIntelligence && (
                      <>
                        <Separator className="bg-zinc-700" />
                        <div>
                          <h4 className="text-sm font-medium text-zinc-400 mb-3 flex items-center gap-2">
                            <Brain className="h-4 w-4" />
                            AI Behavioral Analysis
                          </h4>
                          <div className="space-y-3">
                            <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20" data-testid="card-ai-analysis">
                              <p className="text-sm text-zinc-300" data-testid="text-ai-analysis">{report.aiIntelligence.analysis}</p>
                            </div>
                            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20" data-testid="card-ai-recommendation">
                              <p className="text-xs text-blue-400 mb-1">Recommendation</p>
                              <p className="text-sm text-zinc-300" data-testid="text-ai-recommendation">{report.aiIntelligence.recommendation}</p>
                            </div>
                            {report.aiIntelligence.riskFactors.length > 0 && (
                              <div className="flex flex-wrap gap-2" data-testid="list-risk-factors">
                                {report.aiIntelligence.riskFactors.map((factor, i) => (
                                  <Badge key={i} variant="outline" className="text-xs" data-testid={`badge-risk-factor-${i}`}>
                                    {factor}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}

                    <Separator className="bg-zinc-700" />

                    <div>
                      <h4 className="text-sm font-medium text-zinc-400 mb-3 flex items-center gap-2">
                        <Hash className="h-4 w-4" />
                        Audit Trail
                      </h4>
                      <div className="space-y-2 font-mono text-xs" data-testid="section-audit-trail">
                        <div className="flex justify-between p-2 rounded bg-zinc-800/30">
                          <span className="text-zinc-500">Transaction Hash</span>
                          <span className="text-zinc-300" data-testid="text-transaction-hash">{report.auditTrail.transactionHash}</span>
                        </div>
                        <div className="flex justify-between p-2 rounded bg-zinc-800/30">
                          <span className="text-zinc-500">Data Hash</span>
                          <span className="text-zinc-300" data-testid="text-data-hash">{report.auditTrail.dataHash.slice(0, 32)}...</span>
                        </div>
                        <div className="flex justify-between p-2 rounded bg-zinc-800/30">
                          <span className="text-zinc-500">Encrypted At</span>
                          <span className="text-zinc-300" data-testid="text-encrypted-at">{new Date(report.auditTrail.encryptedAt).toISOString()}</span>
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-zinc-700" />

                    <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                      <p className="text-xs text-amber-400 mb-2">Legal Disclaimer</p>
                      <p className="text-xs text-zinc-400 mb-2">{report.legalDisclaimer.en}</p>
                      <p className="text-xs text-zinc-400 text-right" dir="rtl">{report.legalDisclaimer.ar}</p>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-zinc-900/80 border-zinc-700/50 backdrop-blur-sm flex items-center justify-center">
              <CardContent className="text-center py-20">
                <div className="p-4 rounded-full bg-zinc-800/50 w-fit mx-auto mb-4">
                  <FileText className="h-12 w-12 text-zinc-600" />
                </div>
                <h3 className="text-xl font-semibold text-zinc-400 mb-2">No Report Generated</h3>
                <p className="text-zinc-500 max-w-sm mx-auto">
                  Enter wallet details and click "Generate Sovereign Report" to create a verified documentation
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
