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
  FileText,
  BadgeCheck,
  Copy,
  AlertCircle,
  Lock,
  Globe
} from "lucide-react";
import type { HybridVerificationResult, AssetType } from "@shared/schema";
import { assetTypeLabels } from "@shared/schema";

const formSchema = z.object({
  walletAddress: z.string().min(42, "Invalid wallet address").max(42, "Invalid wallet address"),
  destinationWallet: z.string().min(42, "Invalid wallet address").max(42, "Invalid wallet address").optional().or(z.literal("")),
  assetType: z.enum(["digital_asset", "real_estate_escrow", "investment_fund", "trade_settlement"]),
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
      destinationWallet: "",
      assetType: "digital_asset",
      network: "ethereum",
      transactionAmountAED: 10000,
    },
  });

  const verifyMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const payload = {
        ...data,
        destinationWallet: data.destinationWallet || undefined,
      };
      const response = await apiRequest("POST", "/api/hybrid-verification", payload);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        setVerification(data.verification);
        toast({
          title: "Certificate Generated",
          description: "SovereignVault Transaction Integrity Report ready",
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied", description: "Copied to clipboard" });
  };

  const formatWalletShort = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getRiskBadgeVariant = (level: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (level) {
      case "safe": return "default";
      case "suspicious": return "secondary";
      case "dangerous": return "destructive";
      default: return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3" data-testid="heading-hybrid-verification">
            <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
              <FileText className="h-8 w-8 text-cyan-400" />
            </div>
            SovereignVault | التقرير السيادي
          </h1>
          <p className="text-zinc-400" data-testid="text-page-description">
            Transaction Integrity Report for High-Value Transactions (AED 10,000+)
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-zinc-900/80 border-cyan-500/20 backdrop-blur-sm">
            <CardHeader className="border-b border-cyan-500/10">
              <CardTitle className="text-cyan-100 flex items-center gap-2">
                <Wallet className="h-5 w-5 text-cyan-500" />
                Transaction Details | تفاصيل المعاملة
              </CardTitle>
              <CardDescription className="text-cyan-200/50">
                Enter transaction information for sovereign verification
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="assetType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-cyan-200">Asset Type | نوع الأصل</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-zinc-800/50 border-zinc-700" data-testid="select-asset-type">
                              <SelectValue placeholder="Select asset type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="digital_asset" data-testid="option-digital-asset">
                              High-Value Digital Asset
                            </SelectItem>
                            <SelectItem value="real_estate_escrow" data-testid="option-real-estate">
                              Real Estate Escrow
                            </SelectItem>
                            <SelectItem value="investment_fund" data-testid="option-investment">
                              Investment Fund Transfer
                            </SelectItem>
                            <SelectItem value="trade_settlement" data-testid="option-trade">
                              Trade Settlement
                            </SelectItem>
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
                        <FormLabel className="text-cyan-200">Nominal Value (AED) | القيمة الاسمية</FormLabel>
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

                  <FormField
                    control={form.control}
                    name="walletAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-cyan-200">Source Wallet | محفظة المصدر</FormLabel>
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
                    name="destinationWallet"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-cyan-200">Destination Wallet (Optional) | محفظة الوجهة</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="0x..."
                            className="bg-zinc-800/50 border-zinc-700 font-mono text-sm"
                            data-testid="input-destination-wallet"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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

                  <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30" data-testid="card-confidential-notice">
                    <p className="text-sm text-amber-300 flex items-center gap-2" data-testid="text-confidential">
                      <Lock className="h-4 w-4" />
                      Strictly Confidential | Internal Audit Grade
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-cyan-600 to-blue-600"
                    disabled={verifyMutation.isPending || !status?.configured}
                    data-testid="button-generate-report"
                  >
                    {verifyMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Certificate...
                      </>
                    ) : (
                      <>
                        <FileText className="mr-2 h-4 w-4" />
                        Generate Integrity Report
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {verification ? (
            <Card className="bg-zinc-900/95 border-cyan-500/30 backdrop-blur-sm" data-testid="card-certificate">
              <CardContent className="p-0">
                <ScrollArea className="h-[700px]">
                  <div className="p-6 space-y-6">
                    <div className="text-center border-b border-zinc-700 pb-6">
                      <div className="flex justify-center mb-3">
                        <div className="p-3 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
                          <Shield className="h-10 w-10 text-cyan-400" />
                        </div>
                      </div>
                      <h2 className="text-2xl font-bold text-white mb-1" data-testid="heading-certificate-title">
                        SovereignVault: Transaction Integrity Report
                      </h2>
                      <p className="text-amber-400 text-sm font-medium" data-testid="text-confidential-label">
                        Strictly Confidential | Internal Audit Grade
                      </p>
                      <div className="mt-4 space-y-1">
                        <p className="text-zinc-400 font-mono text-sm" data-testid="text-certificate-id">
                          [CERTIFICATE ID: {verification.certificateId}]
                        </p>
                        <p className="text-zinc-500 text-xs" data-testid="text-generation-date">
                          [GENERATION DATE: {new Date(verification.verificationTimestamp).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "2-digit" })}]
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-cyan-300 flex items-center gap-2" data-testid="heading-section-1">
                        <span className="text-cyan-500">1.</span> TRANSACTION OVERVIEW
                      </h3>
                      <div className="grid gap-3 pl-5">
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-400">Asset Type:</span>
                          <span className="text-zinc-200" data-testid="text-asset-type">
                            {assetTypeLabels[verification.assetType]?.en || verification.assetType}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-400">Nominal Value:</span>
                          <span className="text-xl font-bold text-cyan-300" data-testid="text-nominal-value">
                            AED {verification.transactionAmountAED.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-400">Source Wallet:</span>
                          <button
                            onClick={() => copyToClipboard(verification.walletAddress)}
                            className="flex items-center gap-2 text-zinc-200 font-mono text-sm hover-elevate active-elevate-2 px-2 py-1 rounded"
                            data-testid="button-copy-source"
                          >
                            {formatWalletShort(verification.walletAddress)}
                            <Copy className="h-3 w-3 text-zinc-500" />
                          </button>
                        </div>
                        {verification.destinationWallet && (
                          <div className="flex justify-between items-center">
                            <span className="text-zinc-400">Destination Wallet:</span>
                            <button
                              onClick={() => copyToClipboard(verification.destinationWallet!)}
                              className="flex items-center gap-2 text-zinc-200 font-mono text-sm hover-elevate active-elevate-2 px-2 py-1 rounded"
                              data-testid="button-copy-destination"
                            >
                              {formatWalletShort(verification.destinationWallet)}
                              <Copy className="h-3 w-3 text-zinc-500" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <Separator className="bg-zinc-700" />

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-cyan-300 flex items-center gap-2" data-testid="heading-section-2">
                        <span className="text-cyan-500">2.</span> ON-CHAIN FORENSIC DATA
                        <Badge variant="outline" className="ml-2 text-xs">Powered by Alchemy</Badge>
                      </h3>
                      <div className="grid gap-3 pl-5">
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-400">Wallet Seniority:</span>
                          <div className="flex items-center gap-2">
                            {verification.onChainFacts.walletAgeDays > 730 ? (
                              <CheckCircle className="h-4 w-4 text-emerald-500" />
                            ) : verification.onChainFacts.walletAgeDays > 180 ? (
                              <AlertCircle className="h-4 w-4 text-amber-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                            <span className="text-zinc-200" data-testid="text-wallet-seniority">
                              {verification.onChainFacts.walletAgeDays > 730 
                                ? `Verified (Age: > 24 Months)` 
                                : `Age: ${verification.onChainFacts.walletAgeDays} days`}
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-400">Balance:</span>
                          <span className="text-zinc-200 font-mono" data-testid="text-balance">
                            {verification.onChainFacts.balanceInEth} ETH
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-400">Liquidity Consistency:</span>
                          <span className="text-zinc-200" data-testid="text-liquidity">
                            {verification.onChainFacts.transactionCount > 50 ? "Stable" : "Limited History"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-400">Sanction List Check:</span>
                          <div className="flex items-center gap-2">
                            {verification.sanctionCheckPassed ? (
                              <>
                                <CheckCircle className="h-4 w-4 text-emerald-500" />
                                <span className="text-emerald-400" data-testid="text-sanction-status">
                                  PASS (Zero hits on OFAC/UN/UAE Lists)
                                </span>
                              </>
                            ) : (
                              <>
                                <XCircle className="h-4 w-4 text-red-500" />
                                <span className="text-red-400" data-testid="text-sanction-status">
                                  FAIL - Review Required
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-400">Interaction Risk:</span>
                          <div className="flex items-center gap-2">
                            {!verification.mixerInteractionDetected ? (
                              <>
                                <CheckCircle className="h-4 w-4 text-emerald-500" />
                                <span className="text-emerald-400" data-testid="text-mixer-status">
                                  Low (No Tumbler/Mixer interaction)
                                </span>
                              </>
                            ) : (
                              <>
                                <AlertTriangle className="h-4 w-4 text-red-500" />
                                <span className="text-red-400" data-testid="text-mixer-status">
                                  HIGH - Mixer Interaction Detected
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-400">Contract Status:</span>
                          <span className="text-zinc-200" data-testid="text-contract-status">
                            {verification.onChainFacts.isContract ? "Smart Contract" : "EOA (User Wallet)"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-zinc-700" />

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-cyan-300 flex items-center gap-2" data-testid="heading-section-3">
                        <span className="text-cyan-500">3.</span> AI BEHAVIORAL ANALYSIS
                        <Badge variant="outline" className="ml-2 text-xs">GPT-4o</Badge>
                      </h3>
                      <div className="pl-5 space-y-4">
                        <div className="flex items-center gap-3">
                          <span className="text-zinc-400">Risk Assessment:</span>
                          <Badge variant={getRiskBadgeVariant(verification.aiInsight.riskLevel)} data-testid="badge-risk-level">
                            {verification.aiInsight.riskLevel.toUpperCase()} ({verification.aiInsight.riskScore}/100)
                          </Badge>
                        </div>
                        
                        {verification.aiInsight.fraudPatterns.length > 0 && (
                          <div>
                            <span className="text-zinc-400 text-sm">Detected Patterns:</span>
                            <div className="flex flex-wrap gap-2 mt-2" data-testid="list-fraud-patterns">
                              {verification.aiInsight.fraudPatterns.map((pattern, i) => (
                                <Badge key={i} variant="destructive" className="text-xs" data-testid={`badge-pattern-${i}`}>
                                  {pattern}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700">
                          <p className="text-zinc-300 text-sm leading-relaxed" data-testid="text-ai-analysis">
                            {verification.aiInsight.analysis}
                          </p>
                          <p className="text-zinc-400 text-sm mt-2 leading-relaxed" dir="rtl" data-testid="text-ai-analysis-ar">
                            {verification.aiInsight.analysisAr}
                          </p>
                        </div>

                        <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                          <p className="text-sm font-medium text-cyan-200 mb-1">Recommendation:</p>
                          <p className="text-zinc-300 text-sm" data-testid="text-recommendation">
                            {verification.aiInsight.recommendation}
                          </p>
                          <p className="text-zinc-400 text-sm mt-1" dir="rtl" data-testid="text-recommendation-ar">
                            {verification.aiInsight.recommendationAr}
                          </p>
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-zinc-700" />

                    <div className="text-center pt-4 border-t border-zinc-700">
                      <div className="flex justify-center gap-6 text-xs text-zinc-500">
                        <div className="flex items-center gap-1">
                          <Database className="h-3 w-3" />
                          <span data-testid="text-source-blockchain">{verification.sources.blockchain}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Brain className="h-3 w-3" />
                          <span data-testid="text-source-ai">{verification.sources.ai}</span>
                        </div>
                      </div>
                      <p className="text-zinc-600 text-xs mt-3" data-testid="text-verification-id">
                        Internal Reference: {verification.verificationId}
                      </p>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-zinc-900/80 border-zinc-700/50 backdrop-blur-sm flex items-center justify-center" data-testid="card-empty-state">
              <CardContent className="text-center py-20">
                <div className="p-4 rounded-full bg-zinc-800/50 w-fit mx-auto mb-4">
                  <FileText className="h-12 w-12 text-zinc-600" />
                </div>
                <h3 className="text-xl font-semibold text-zinc-400 mb-2" data-testid="heading-empty-state">
                  No Report Generated
                </h3>
                <p className="text-zinc-500 max-w-sm mx-auto" data-testid="text-empty-state">
                  Enter transaction details to generate a SovereignVault Transaction Integrity Report
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
