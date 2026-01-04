import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  BarChart3,
  Droplets,
  Calculator,
  Info,
  ArrowRight,
  RefreshCw,
  XCircle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const slippageSchema = z.object({
  tokenSymbol: z.string().min(1, "Select a token"),
  amount: z.string().min(1, "Amount is required"),
  exchangeType: z.string().min(1, "Select exchange type"),
});

type SlippageValues = z.infer<typeof slippageSchema>;

interface SlippageResult {
  estimatedSlippage: number;
  priceImpact: number;
  liquidityDepth: string;
  recommendation: "proceed" | "caution" | "avoid";
  expectedLoss: number;
  bestTimeToTrade: string;
  alternativeStrategy: string;
}

const tokens = [
  { value: "ETH", label: "Ethereum (ETH)", price: "12,500 AED" },
  { value: "BTC", label: "Bitcoin (BTC)", price: "165,000 AED" },
  { value: "USDT", label: "Tether (USDT)", price: "3.67 AED" },
  { value: "BNB", label: "BNB", price: "2,200 AED" },
  { value: "SOL", label: "Solana (SOL)", price: "680 AED" },
  { value: "MATIC", label: "Polygon (MATIC)", price: "2.80 AED" },
];

const exchanges = [
  { value: "dex", label: "DEX (Uniswap, PancakeSwap)" },
  { value: "cex", label: "CEX (Binance, Kraken)" },
  { value: "otc", label: "OTC Desk" },
];

function calculateSlippage(token: string, amount: number, exchange: string): SlippageResult {
  const baseSlippage = exchange === "dex" ? 0.5 : exchange === "cex" ? 0.1 : 0.05;
  
  let liquidityFactor = 1;
  if (token === "ETH" || token === "BTC") liquidityFactor = 0.3;
  else if (token === "USDT" || token === "BNB") liquidityFactor = 0.5;
  else liquidityFactor = 1.2;

  const amountFactor = Math.log10(amount / 100000) * 0.5;
  
  const estimatedSlippage = Math.min(
    (baseSlippage + amountFactor) * liquidityFactor,
    15
  );
  
  const priceImpact = estimatedSlippage * 0.8;
  const expectedLoss = amount * (estimatedSlippage / 100);

  let recommendation: "proceed" | "caution" | "avoid";
  if (estimatedSlippage < 1) recommendation = "proceed";
  else if (estimatedSlippage < 3) recommendation = "caution";
  else recommendation = "avoid";

  let liquidityDepth: string;
  if (liquidityFactor < 0.5) liquidityDepth = "Deep";
  else if (liquidityFactor < 1) liquidityDepth = "Moderate";
  else liquidityDepth = "Shallow";

  let bestTimeToTrade: string;
  let alternativeStrategy: string;

  if (recommendation === "avoid") {
    bestTimeToTrade = "Consider trading during Asian market hours (low volatility)";
    alternativeStrategy = "Split into 5-10 smaller transactions over 24-48 hours";
  } else if (recommendation === "caution") {
    bestTimeToTrade = "Trade during high liquidity periods (EU/US market overlap)";
    alternativeStrategy = "Consider using limit orders or TWAP strategy";
  } else {
    bestTimeToTrade = "Current market conditions are favorable";
    alternativeStrategy = "Proceed with market order";
  }

  return {
    estimatedSlippage: Math.round(estimatedSlippage * 100) / 100,
    priceImpact: Math.round(priceImpact * 100) / 100,
    liquidityDepth,
    recommendation,
    expectedLoss: Math.round(expectedLoss),
    bestTimeToTrade,
    alternativeStrategy,
  };
}

export default function SlippagePage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<SlippageResult | null>(null);
  const [analyzedData, setAnalyzedData] = useState<{ token: string; amount: string } | null>(null);

  const form = useForm<SlippageValues>({
    resolver: zodResolver(slippageSchema),
    defaultValues: {
      tokenSymbol: "",
      amount: "",
      exchangeType: "",
    },
  });

  const onSubmit = async (data: SlippageValues) => {
    setAnalyzing(true);
    setResult(null);

    await new Promise(resolve => setTimeout(resolve, 1500));

    const amount = parseFloat(data.amount.replace(/,/g, ''));
    const slippageResult = calculateSlippage(data.tokenSymbol, amount, data.exchangeType);

    setResult(slippageResult);
    setAnalyzedData({ token: data.tokenSymbol, amount: data.amount });
    setAnalyzing(false);
  };

  const formatAED = (value: string) => {
    const num = parseFloat(value.replace(/,/g, ''));
    if (isNaN(num)) return value;
    return num.toLocaleString('en-AE');
  };

  const recommendationConfig = {
    proceed: {
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/30",
      icon: CheckCircle,
      title: "Safe to Proceed",
    },
    caution: {
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/30",
      icon: AlertTriangle,
      title: "Proceed with Caution",
    },
    avoid: {
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/30",
      icon: XCircle,
      title: "High Risk - Consider Alternatives",
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 -m-6 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-2 py-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 mb-2">
            <TrendingDown className="h-4 w-4 text-purple-400" />
            <span className="text-purple-400 text-sm font-medium">Price Slippage Alert</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-200 via-purple-400 to-purple-200 bg-clip-text text-transparent">
            Liquidity & Slippage Analysis
          </h1>
          <p className="text-purple-200/60 max-w-2xl mx-auto">
            Calculate the price impact and potential loss before executing large transactions
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="bg-zinc-900/80 border-purple-500/20">
            <CardHeader className="border-b border-purple-500/10">
              <CardTitle className="text-purple-100 flex items-center gap-2">
                <Calculator className="h-5 w-5 text-purple-500" />
                Transaction Parameters
              </CardTitle>
              <CardDescription className="text-purple-200/50">
                Enter your planned transaction details
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="tokenSymbol"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-purple-200">Token</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-zinc-800 border-purple-500/30 text-purple-100" data-testid="select-token">
                              <SelectValue placeholder="Select token" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-zinc-800 border-purple-500/30">
                            {tokens.map((token) => (
                              <SelectItem key={token.value} value={token.value} className="text-purple-100">
                                <div className="flex items-center justify-between w-full">
                                  <span>{token.label}</span>
                                  <span className="text-purple-400 ml-4">{token.price}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-purple-200">Transaction Amount (AED)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500 font-medium">
                              AED
                            </span>
                            <Input
                              placeholder="1,000,000"
                              className="pl-14 bg-zinc-800 border-purple-500/30 text-purple-100 placeholder:text-purple-200/30"
                              {...field}
                              onChange={(e) => field.onChange(formatAED(e.target.value))}
                              data-testid="input-amount"
                            />
                          </div>
                        </FormControl>
                        <FormDescription className="text-purple-200/40">
                          Enter the total value you plan to trade
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="exchangeType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-purple-200">Exchange Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-zinc-800 border-purple-500/30 text-purple-100" data-testid="select-exchange">
                              <SelectValue placeholder="Select exchange type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-zinc-800 border-purple-500/30">
                            {exchanges.map((exchange) => (
                              <SelectItem key={exchange.value} value={exchange.value} className="text-purple-100">
                                {exchange.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription className="text-purple-200/40">
                          DEX has higher slippage, OTC has lowest
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-500 text-white"
                    disabled={analyzing}
                    data-testid="button-analyze"
                  >
                    {analyzing ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Calculate Slippage
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {result ? (
            <div className="space-y-4">
              <Card className={`${recommendationConfig[result.recommendation].bgColor} ${recommendationConfig[result.recommendation].borderColor} border`}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    {(() => {
                      const Icon = recommendationConfig[result.recommendation].icon;
                      return <Icon className={`h-12 w-12 ${recommendationConfig[result.recommendation].color}`} />;
                    })()}
                    <div>
                      <h3 className={`text-xl font-bold ${recommendationConfig[result.recommendation].color}`}>
                        {recommendationConfig[result.recommendation].title}
                      </h3>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900/80 border-purple-500/20">
                <CardHeader className="border-b border-purple-500/10">
                  <CardTitle className="text-purple-100 flex items-center gap-2">
                    <TrendingDown className="h-5 w-5 text-purple-500" />
                    Slippage Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-zinc-800/50 rounded-lg p-4 border border-purple-500/10">
                      <p className="text-purple-200/60 text-sm mb-1">Estimated Slippage</p>
                      <p className={`text-2xl font-bold ${
                        result.estimatedSlippage < 1 ? 'text-green-400' :
                        result.estimatedSlippage < 3 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {result.estimatedSlippage}%
                      </p>
                    </div>
                    <div className="bg-zinc-800/50 rounded-lg p-4 border border-purple-500/10">
                      <p className="text-purple-200/60 text-sm mb-1">Price Impact</p>
                      <p className="text-2xl font-bold text-purple-400">
                        {result.priceImpact}%
                      </p>
                    </div>
                  </div>

                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-red-400" />
                      <span className="text-red-400 font-semibold">Estimated Loss</span>
                    </div>
                    <p className="text-red-100 text-2xl font-bold">
                      AED {result.expectedLoss.toLocaleString()}
                    </p>
                    <p className="text-red-200/60 text-sm mt-1">
                      If you proceed with this transaction now
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Droplets className="h-4 w-4 text-purple-500" />
                        <span className="text-purple-200">Liquidity Depth</span>
                      </div>
                      <Badge variant="outline" className={`
                        ${result.liquidityDepth === 'Deep' ? 'text-green-400 border-green-500/30' :
                          result.liquidityDepth === 'Moderate' ? 'text-yellow-400 border-yellow-500/30' :
                          'text-red-400 border-red-500/30'}
                      `}>
                        {result.liquidityDepth}
                      </Badge>
                    </div>
                    <Progress 
                      value={result.liquidityDepth === 'Deep' ? 90 : result.liquidityDepth === 'Moderate' ? 50 : 20} 
                      className="h-2 bg-zinc-800" 
                    />
                  </div>

                  <div className="space-y-3 pt-4 border-t border-purple-500/10">
                    <div className="bg-zinc-800/50 rounded-lg p-4">
                      <p className="text-purple-200/60 text-sm mb-1">Best Time to Trade</p>
                      <p className="text-purple-100">{result.bestTimeToTrade}</p>
                    </div>
                    <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
                      <p className="text-purple-400 text-sm mb-1">Recommended Strategy</p>
                      <p className="text-purple-100 font-medium">{result.alternativeStrategy}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="bg-zinc-900/80 border-purple-500/20">
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <BarChart3 className="h-16 w-16 text-purple-500/30 mx-auto mb-4" />
                  <h3 className="text-purple-200/60 text-lg mb-2">Enter Transaction Details</h3>
                  <p className="text-purple-200/40 text-sm max-w-sm mx-auto">
                    Fill in the form to calculate the expected slippage and price impact of your transaction
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Card className="bg-zinc-900/50 border-purple-500/10">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <Info className="h-5 w-5 text-purple-400 shrink-0" />
              <p className="text-purple-200/60 text-sm">
                <strong className="text-purple-200">Why Slippage Matters:</strong> Large transactions can move the market price against you. 
                For transactions over AED 1M, even 1% slippage means AED 10,000 loss. 
                This calculator helps you minimize losses by choosing optimal timing and strategy.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
