import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Brain, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Loader2,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Minus,
  FileWarning,
  Bot
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const predictSchema = z.object({
  walletAddress: z.string().min(10, "Enter a valid wallet address"),
  transactionValue: z.string().optional(),
});

type PredictValues = z.infer<typeof predictSchema>;

interface RiskFactor {
  name: string;
  impact: "positive" | "negative" | "neutral";
  description: string;
}

interface PredictionResult {
  walletAddress: string;
  riskScore: number;
  riskLevel: "safe" | "suspicious" | "dangerous";
  factors: RiskFactor[];
  analysis: string;
  analysisAr: string;
  recommendation: string;
  recommendationAr: string;
  existingReports: number;
  hasVerifiedThreats: boolean;
  analyzedAt: string;
}

export default function AiPredict() {
  const { toast } = useToast();
  const [result, setResult] = useState<PredictionResult | null>(null);

  const form = useForm<PredictValues>({
    resolver: zodResolver(predictSchema),
    defaultValues: {
      walletAddress: "",
      transactionValue: "",
    },
  });

  const predictMutation = useMutation({
    mutationFn: async (data: PredictValues) => {
      const response = await apiRequest("POST", "/api/ai/predict", data);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        setResult(data.prediction);
        toast({
          title: "Analysis Complete",
          description: "AI has analyzed the wallet address",
        });
      }
    },
    onError: () => {
      toast({
        title: "Analysis Failed",
        description: "Could not analyze the wallet. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PredictValues) => {
    setResult(null);
    predictMutation.mutate(data);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "safe": return "text-green-500";
      case "suspicious": return "text-yellow-500";
      case "dangerous": return "text-red-500";
      default: return "text-muted-foreground";
    }
  };

  const getRiskBgColor = (level: string) => {
    switch (level) {
      case "safe": return "bg-green-500/10 border-green-500/30";
      case "suspicious": return "bg-yellow-500/10 border-yellow-500/30";
      case "dangerous": return "bg-red-500/10 border-red-500/30";
      default: return "bg-muted";
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "safe": return <CheckCircle className="h-8 w-8 text-green-500" />;
      case "suspicious": return <AlertTriangle className="h-8 w-8 text-yellow-500" />;
      case "dangerous": return <XCircle className="h-8 w-8 text-red-500" />;
      default: return <Shield className="h-8 w-8" />;
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case "positive": return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "negative": return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Brain className="h-8 w-8 text-primary" />
            AI Scam Prediction
          </h1>
          <p className="text-muted-foreground mt-1">
            Advanced AI-powered fraud detection and risk analysis
          </p>
        </div>
        <Badge variant="secondary" className="gap-1">
          <Sparkles className="h-3 w-3" />
          Powered by GPT-4
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              Analyze Wallet
            </CardTitle>
            <CardDescription>
              Enter a wallet address to get AI-powered risk prediction
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="walletAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Wallet Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="0x... or bc1... or similar"
                          className="font-mono"
                          data-testid="input-wallet-address"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="transactionValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transaction Value (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., 50,000 AED or 2.5 ETH"
                          data-testid="input-transaction-value"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={predictMutation.isPending}
                  data-testid="button-analyze"
                >
                  {predictMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing with AI...
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 h-4 w-4" />
                      Analyze Risk
                    </>
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-6 p-4 rounded-lg bg-muted/50 border">
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                What AI Analyzes
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Historical threat reports in UAE7Guard database</li>
                <li>Common scam patterns (rugpulls, honeypots, phishing)</li>
                <li>VARA/ADGM compliance indicators</li>
                <li>Transaction value risk assessment</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {result && (
          <Card className={`border-2 ${getRiskBgColor(result.riskLevel)}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {getRiskIcon(result.riskLevel)}
                  <span className={getRiskColor(result.riskLevel)}>
                    {result.riskLevel === "safe" && "Low Risk"}
                    {result.riskLevel === "suspicious" && "Suspicious"}
                    {result.riskLevel === "dangerous" && "High Risk"}
                  </span>
                </CardTitle>
                <Badge variant="outline" className="font-mono text-xs">
                  Score: {result.riskScore}/100
                </Badge>
              </div>
              <CardDescription className="font-mono text-xs truncate">
                {result.walletAddress}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Risk Score</span>
                  <span className={`font-bold ${getRiskColor(result.riskLevel)}`}>
                    {result.riskScore}%
                  </span>
                </div>
                <Progress 
                  value={result.riskScore} 
                  className="h-3"
                />
              </div>

              {result.hasVerifiedThreats && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-2">
                  <FileWarning className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-500">Verified Threat Found</p>
                    <p className="text-xs text-red-400">
                      This address has {result.existingReports} report(s) in our database
                    </p>
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-sm font-semibold mb-3">Risk Factors</h4>
                <div className="space-y-2">
                  {result.factors.map((factor, idx) => (
                    <div 
                      key={idx}
                      className="flex items-start gap-3 p-2 rounded-lg bg-background/50"
                    >
                      {getImpactIcon(factor.impact)}
                      <div className="flex-1">
                        <p className="text-sm font-medium">{factor.name}</p>
                        <p className="text-xs text-muted-foreground">{factor.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2">AI Analysis</h4>
                <p className="text-sm text-muted-foreground">{result.analysis}</p>
                {result.analysisAr && (
                  <p className="text-sm text-muted-foreground mt-2 text-right" dir="rtl">
                    {result.analysisAr}
                  </p>
                )}
              </div>

              <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
                <h4 className="text-sm font-semibold mb-1 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  Recommendation
                </h4>
                <p className="text-sm">{result.recommendation}</p>
                {result.recommendationAr && (
                  <p className="text-sm mt-1 text-right" dir="rtl">
                    {result.recommendationAr}
                  </p>
                )}
              </div>

              <p className="text-xs text-muted-foreground text-center">
                Analyzed at {new Date(result.analyzedAt).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        )}

        {!result && !predictMutation.isPending && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center min-h-[400px] text-center">
              <Brain className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground">
                No Analysis Yet
              </h3>
              <p className="text-sm text-muted-foreground/70 max-w-xs mt-2">
                Enter a wallet address to get AI-powered scam prediction and risk analysis
              </p>
            </CardContent>
          </Card>
        )}

        {predictMutation.isPending && (
          <Card className="border-primary/30">
            <CardContent className="flex flex-col items-center justify-center min-h-[400px] text-center">
              <div className="relative">
                <Brain className="h-16 w-16 text-primary animate-pulse" />
                <Sparkles className="h-6 w-6 text-yellow-500 absolute -top-1 -right-1 animate-bounce" />
              </div>
              <h3 className="text-lg font-semibold mt-4">
                AI is Analyzing...
              </h3>
              <p className="text-sm text-muted-foreground max-w-xs mt-2">
                Our AI is checking threat databases, analyzing patterns, and assessing risk factors
              </p>
              <Loader2 className="h-6 w-6 animate-spin mt-4 text-primary" />
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">How AI Prediction Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <span className="text-primary font-bold">1</span>
              </div>
              <h4 className="font-semibold mb-1">Database Check</h4>
              <p className="text-sm text-muted-foreground">
                Cross-references with UAE7Guard's verified threat database
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <span className="text-primary font-bold">2</span>
              </div>
              <h4 className="font-semibold mb-1">Pattern Analysis</h4>
              <p className="text-sm text-muted-foreground">
                AI analyzes for known scam patterns and suspicious indicators
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <span className="text-primary font-bold">3</span>
              </div>
              <h4 className="font-semibold mb-1">Risk Assessment</h4>
              <p className="text-sm text-muted-foreground">
                Generates comprehensive risk score with actionable recommendations
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
