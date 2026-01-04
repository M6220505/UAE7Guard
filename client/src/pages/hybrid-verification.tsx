import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Database, 
  Brain, 
  Wallet, 
  Clock, 
  ArrowRightLeft,
  Server,
  BadgeCheck,
  Copy
} from "lucide-react";
import type { HybridVerificationResult } from "@shared/schema";

const formSchema = z.object({
  walletAddress: z.string().min(42, "Invalid wallet address").max(42, "Invalid wallet address"),
  network: z.string().default("ethereum"),
  transactionAmountAED: z.coerce.number().min(10000, "Minimum amount is 10,000 AED"),
});

type FormData = z.infer<typeof formSchema>;

export default function HybridVerification() {
  const { toast } = useToast();
  const [verification, setVerification] = useState<HybridVerificationResult | null>(null);

  const { data: status } = useQuery<{ configured: boolean; minAmountAED: number }>({
    queryKey: ["/api/hybrid-verification/status"],
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      walletAddress: "",
      network: "ethereum",
      transactionAmountAED: 10000,
    },
  });

  const verifyMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiRequest("POST", "/api/hybrid-verification", data);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        setVerification(data.verification);
        toast({
          title: "Verification Complete",
          description: "Hybrid verification generated successfully",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Verification Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    verifyMutation.mutate(data);
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "safe": return <CheckCircle className="h-6 w-6 text-emerald-500" />;
      case "suspicious": return <AlertTriangle className="h-6 w-6 text-amber-500" />;
      case "dangerous": return <XCircle className="h-6 w-6 text-red-500" />;
      default: return <Shield className="h-6 w-6 text-zinc-500" />;
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "safe": return "text-emerald-500";
      case "suspicious": return "text-amber-500";
      case "dangerous": return "text-red-500";
      default: return "text-zinc-500";
    }
  };

  const getRiskBadgeVariant = (level: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (level) {
      case "safe": return "default";
      case "suspicious": return "secondary";
      case "dangerous": return "destructive";
      default: return "outline";
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied", description: "Copied to clipboard" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3" data-testid="heading-hybrid-verification">
            <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
              <Shield className="h-8 w-8 text-cyan-400" />
            </div>
            Hybrid Verification | التحقق الهجين
          </h1>
          <p className="text-zinc-400" data-testid="text-page-description">
            Dual-source verification for transactions AED 10,000+ | تحقق ثنائي المصدر للمعاملات فوق 10,000 درهم
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-zinc-900/80 border-cyan-500/20 backdrop-blur-sm">
            <CardHeader className="border-b border-cyan-500/10">
              <CardTitle className="text-cyan-100 flex items-center gap-2">
                <Wallet className="h-5 w-5 text-cyan-500" />
                Verification Request | طلب التحقق
              </CardTitle>
              <CardDescription className="text-cyan-200/50">
                Enter wallet details for hybrid blockchain + AI verification
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="walletAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-cyan-200">Wallet Address | عنوان المحفظة</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="0x..."
                            className="bg-zinc-800/50 border-zinc-700 font-mono"
                            data-testid="input-wallet-address"
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
                          <FormLabel className="text-cyan-200">Network | الشبكة</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-zinc-800/50 border-zinc-700" data-testid="select-network">
                                <SelectValue placeholder="Select network" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="ethereum" data-testid="option-ethereum">Ethereum</SelectItem>
                              <SelectItem value="polygon" data-testid="option-polygon">Polygon</SelectItem>
                              <SelectItem value="arbitrum" data-testid="option-arbitrum">Arbitrum</SelectItem>
                              <SelectItem value="optimism" data-testid="option-optimism">Optimism</SelectItem>
                              <SelectItem value="base" data-testid="option-base">Base</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="transactionAmountAED"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-cyan-200">Amount (AED) | المبلغ</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              min={10000}
                              className="bg-zinc-800/50 border-zinc-700"
                              data-testid="input-amount"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="p-4 rounded-lg bg-cyan-500/5 border border-cyan-500/20" data-testid="card-threshold-info">
                    <p className="text-sm text-cyan-300 flex items-center gap-2" data-testid="text-threshold-info">
                      <BadgeCheck className="h-4 w-4" />
                      Minimum threshold: AED 10,000 | الحد الأدنى: 10,000 درهم
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                    disabled={verifyMutation.isPending || !status?.configured}
                    data-testid="button-verify"
                  >
                    {verifyMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Performing Hybrid Verification...
                      </>
                    ) : (
                      <>
                        <Shield className="mr-2 h-4 w-4" />
                        Start Hybrid Verification | بدء التحقق الهجين
                      </>
                    )}
                  </Button>

                  {!status?.configured && (
                    <p className="text-sm text-amber-400 text-center">
                      Blockchain service not configured. ALCHEMY_API_KEY required.
                    </p>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>

          {verification ? (
            <Card className="bg-zinc-900/80 border-emerald-500/20 backdrop-blur-sm">
              <CardHeader className="border-b border-emerald-500/10">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <CardTitle className="text-emerald-100 flex items-center gap-2" data-testid="text-verification-id">
                      <BadgeCheck className="h-5 w-5 text-emerald-500" />
                      {verification.verificationId}
                    </CardTitle>
                    <CardDescription className="text-emerald-200/50" data-testid="text-verification-timestamp">
                      {new Date(verification.verificationTimestamp).toLocaleString("en-AE")}
                    </CardDescription>
                  </div>
                  <Button 
                    size="icon" 
                    variant="outline" 
                    onClick={() => copyToClipboard(verification.verificationId)}
                    data-testid="button-copy-id"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-800/50" data-testid="card-risk-summary">
                      <div className="flex items-center gap-3">
                        {getRiskIcon(verification.aiInsight.riskLevel)}
                        <div>
                          <p className="text-sm text-zinc-400">AI Risk Assessment</p>
                          <p className={`text-2xl font-bold ${getRiskColor(verification.aiInsight.riskLevel)}`} data-testid="text-risk-score">
                            {verification.aiInsight.riskScore}/100
                          </p>
                        </div>
                      </div>
                      <Badge 
                        variant={getRiskBadgeVariant(verification.aiInsight.riskLevel)} 
                        className="text-lg px-4 py-1"
                        data-testid="badge-risk-level"
                      >
                        {verification.aiInsight.riskLevel.toUpperCase()}
                      </Badge>
                    </div>

                    <Separator className="bg-zinc-700" />

                    <div>
                      <h4 className="text-sm font-medium text-zinc-400 mb-3 flex items-center gap-2">
                        <Database className="h-4 w-4 text-cyan-400" />
                        On-Chain Facts | بيانات السلسلة
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg bg-zinc-800/30 text-center">
                          <p className="text-xs text-zinc-500">Balance</p>
                          <p className="text-lg font-bold text-zinc-100" data-testid="text-balance">
                            {verification.onChainFacts.balanceInEth} ETH
                          </p>
                        </div>
                        <div className="p-3 rounded-lg bg-zinc-800/30 text-center">
                          <p className="text-xs text-zinc-500">Transactions</p>
                          <p className="text-lg font-bold text-zinc-100" data-testid="text-tx-count">
                            {verification.onChainFacts.transactionCount}
                          </p>
                        </div>
                        <div className="p-3 rounded-lg bg-zinc-800/30 text-center">
                          <p className="text-xs text-zinc-500">Wallet Age</p>
                          <p className="text-lg font-bold text-zinc-100" data-testid="text-wallet-age">
                            {verification.onChainFacts.walletAgeDays} days
                          </p>
                        </div>
                        <div className="p-3 rounded-lg bg-zinc-800/30 text-center">
                          <p className="text-xs text-zinc-500">Is Contract</p>
                          <p className="text-lg font-bold text-zinc-100" data-testid="text-is-contract">
                            {verification.onChainFacts.isContract ? "Yes" : "No"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {verification.onChainFacts.recentTransactions.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-zinc-400 mb-3 flex items-center gap-2">
                          <ArrowRightLeft className="h-4 w-4 text-cyan-400" />
                          Recent Transactions (Last 20)
                        </h4>
                        <div className="space-y-2 max-h-[200px] overflow-y-auto" data-testid="list-transactions">
                          {verification.onChainFacts.recentTransactions.slice(0, 10).map((tx, i) => (
                            <div 
                              key={i} 
                              className="p-2 rounded bg-zinc-800/30 font-mono text-xs"
                              data-testid={`tx-item-${i}`}
                            >
                              <div className="flex justify-between items-center">
                                <span className="text-zinc-400 truncate max-w-[150px]">{tx.hash.slice(0, 16)}...</span>
                                <Badge variant="outline" className="text-xs">{tx.asset}</Badge>
                              </div>
                              <div className="text-zinc-500 mt-1">
                                {tx.value} {tx.asset}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <Separator className="bg-zinc-700" />

                    <div>
                      <h4 className="text-sm font-medium text-zinc-400 mb-3 flex items-center gap-2">
                        <Brain className="h-4 w-4 text-purple-400" />
                        AI Insight | تحليل الذكاء
                      </h4>
                      <div className="space-y-3">
                        <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20" data-testid="card-ai-analysis">
                          <p className="text-sm text-zinc-300 mb-2" data-testid="text-ai-analysis">
                            {verification.aiInsight.analysis}
                          </p>
                          <p className="text-sm text-zinc-400 text-right" dir="rtl" data-testid="text-ai-analysis-ar">
                            {verification.aiInsight.analysisAr}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                            <p className="text-xs text-amber-400 mb-1">Liquidity Risk | مخاطر السيولة</p>
                            <p className="text-sm text-zinc-300" data-testid="text-liquidity-risk">
                              {verification.aiInsight.liquidityRisk}
                            </p>
                          </div>
                          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                            <p className="text-xs text-blue-400 mb-1">Large Amount Analysis | تحليل المبالغ الكبيرة</p>
                            <p className="text-sm text-zinc-300" data-testid="text-large-amount">
                              {verification.aiInsight.largeAmountAnalysis}
                            </p>
                          </div>
                        </div>

                        {verification.aiInsight.fraudPatterns.length > 0 && (
                          <div className="flex flex-wrap gap-2" data-testid="list-fraud-patterns">
                            {verification.aiInsight.fraudPatterns.map((pattern, i) => (
                              <Badge key={i} variant="destructive" className="text-xs" data-testid={`badge-pattern-${i}`}>
                                {pattern}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20" data-testid="card-recommendation">
                          <p className="text-xs text-emerald-400 mb-1">Recommendation | التوصية</p>
                          <p className="text-sm text-zinc-300" data-testid="text-recommendation">
                            {verification.aiInsight.recommendation}
                          </p>
                          <p className="text-sm text-zinc-400 text-right mt-2" dir="rtl" data-testid="text-recommendation-ar">
                            {verification.aiInsight.recommendationAr}
                          </p>
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-zinc-700" />

                    <div>
                      <h4 className="text-sm font-medium text-zinc-400 mb-3 flex items-center gap-2">
                        <Server className="h-4 w-4" />
                        Verification Sources | مصادر التحقق
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg bg-zinc-800/30">
                          <p className="text-xs text-zinc-500">Blockchain</p>
                          <p className="text-sm text-zinc-200 font-mono" data-testid="text-source-blockchain">
                            {verification.sources.blockchain}
                          </p>
                        </div>
                        <div className="p-3 rounded-lg bg-zinc-800/30">
                          <p className="text-xs text-zinc-500">AI Model</p>
                          <p className="text-sm text-zinc-200 font-mono" data-testid="text-source-ai">
                            {verification.sources.ai}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-cyan-500/5 border border-cyan-500/20" data-testid="card-amount-info">
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-400">Transaction Amount</span>
                        <span className="text-xl font-bold text-cyan-300" data-testid="text-amount">
                          AED {verification.transactionAmountAED.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-zinc-400">Threshold Met</span>
                        <Badge variant={verification.thresholdMet ? "default" : "destructive"} data-testid="badge-threshold">
                          {verification.thresholdMet ? "Yes" : "No"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-zinc-900/80 border-zinc-700/50 backdrop-blur-sm flex items-center justify-center" data-testid="card-empty-state">
              <CardContent className="text-center py-20">
                <div className="p-4 rounded-full bg-zinc-800/50 w-fit mx-auto mb-4">
                  <Shield className="h-12 w-12 text-zinc-600" />
                </div>
                <h3 className="text-xl font-semibold text-zinc-400 mb-2" data-testid="heading-empty-state">No Verification Yet</h3>
                <p className="text-zinc-500 max-w-sm mx-auto" data-testid="text-empty-state">
                  Enter wallet details and click "Start Hybrid Verification" to generate a dual-source analysis
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
