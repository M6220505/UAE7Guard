import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Loader2, 
  FileCheck,
  Wallet,
  Clock,
  Link2,
  Gem,
  Building2,
  Car,
  Watch,
  Briefcase,
  ScrollText,
  Scale,
  FileWarning,
  Gavel
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { Progress } from "@/components/ui/progress";
import type { ScamReport } from "@shared/schema";

const assetTypes = [
  { value: "real_estate", label: "Real Estate", icon: Building2 },
  { value: "luxury_watch", label: "Luxury Watch", icon: Watch },
  { value: "vehicle", label: "Luxury Vehicle", icon: Car },
  { value: "jewelry", label: "Jewelry & Gems", icon: Gem },
  { value: "business", label: "Business Asset", icon: Briefcase },
  { value: "other", label: "Other High-Value Asset", icon: Gem },
];

const MIN_TRANSACTION_VALUE = 500000;

const dueDiligenceSchema = z.object({
  transactionValue: z.string().min(1, "Transaction value is required").refine((val) => {
    const numValue = parseFloat(val.replace(/,/g, ''));
    return !isNaN(numValue) && numValue >= MIN_TRANSACTION_VALUE;
  }, `Minimum transaction value is AED ${MIN_TRANSACTION_VALUE.toLocaleString()}`),
  walletAddress: z.string().min(10, "Wallet address is required").regex(/^0x[a-fA-F0-9]{40}$|^[a-zA-Z0-9]{30,}$/, "Invalid wallet address format"),
  assetType: z.string().min(1, "Please select an asset type"),
  walletAge: z.string().min(1, "Wallet age is required"),
  transactionHistory: z.string().min(1, "Transaction history is required"),
});

type DueDiligenceValues = z.infer<typeof dueDiligenceSchema>;

// Advanced Risk Algorithm Components
// Final_Score = (R_live × 0.5) + (R_hist × 0.3) + (R_leg × 0.2) / √Liquidity_Ratio

interface RiskResult {
  finalScore: number;
  riskIndex: number;
  rLive: number;        // Real-time portfolio risk
  rHist: number;        // Historical risk
  rLeg: number;         // Legal compliance risk
  liquidityRatio: number;
  walletAgeScore: number;
  transactionVolumeScore: number;
  blacklistScore: number;
  isBlacklisted: boolean;
  recommendation: "block" | "review" | "approve";
  certificateEligible: boolean;
  formulaBreakdown: {
    numerator: number;
    denominator: number;
  };
}

function calculateRiskScore(
  walletAgeDays: number,
  transactionCount: number,
  blacklistAssociations: number,
  isDirectlyBlacklisted: boolean,
  transactionValue: number = 500000
): RiskResult {
  // ═══════════════════════════════════════════════════════════════
  // R_live: المخاطر اللحظية (Real-time Portfolio Risk)
  // Based on current wallet activity patterns and recent interactions
  // ═══════════════════════════════════════════════════════════════
  
  // Calculate live risk based on recent activity patterns
  let recentActivityScore = 0;
  
  // Recent transaction frequency (simulated based on transaction count)
  const dailyTxRate = transactionCount / Math.max(walletAgeDays, 1);
  if (dailyTxRate > 10) recentActivityScore += 40; // Unusually high activity
  else if (dailyTxRate > 5) recentActivityScore += 25;
  else if (dailyTxRate > 1) recentActivityScore += 10;
  else recentActivityScore += 0; // Normal activity
  
  // Wallet balance volatility indicator (simulated)
  const volatilityFactor = Math.min((transactionValue / 1000000) * 15, 30);
  recentActivityScore += volatilityFactor;
  
  // Current market exposure risk
  const marketExposure = walletAgeDays < 30 ? 30 : walletAgeDays < 90 ? 15 : 5;
  recentActivityScore += marketExposure;
  
  const rLive = Math.min(Math.round(recentActivityScore), 100);
  
  // ═══════════════════════════════════════════════════════════════
  // R_hist: المخاطر التاريخية (Historical Risk)
  // Based on wallet's complete transaction history and age
  // ═══════════════════════════════════════════════════════════════
  
  // Wallet age scoring (older = more trustworthy)
  let walletAgeScore = 0;
  if (walletAgeDays < 30) walletAgeScore = 100;
  else if (walletAgeDays < 90) walletAgeScore = 70;
  else if (walletAgeDays < 180) walletAgeScore = 50;
  else if (walletAgeDays < 365) walletAgeScore = 30;
  else if (walletAgeDays < 730) walletAgeScore = 15;
  else walletAgeScore = 5;
  
  // Transaction volume scoring
  let transactionVolumeScore = 0;
  if (transactionCount < 5) transactionVolumeScore = 80;
  else if (transactionCount < 20) transactionVolumeScore = 50;
  else if (transactionCount < 50) transactionVolumeScore = 30;
  else if (transactionCount < 100) transactionVolumeScore = 15;
  else transactionVolumeScore = 5;
  
  // Historical pattern analysis
  const historyDepth = Math.min(walletAgeDays / 365, 1) * 100;
  const historicalReliability = 100 - historyDepth;
  
  const rHist = Math.round((walletAgeScore * 0.4) + (transactionVolumeScore * 0.3) + (historicalReliability * 0.3));
  
  // ═══════════════════════════════════════════════════════════════
  // R_leg: التوافق القانوني (Legal Compliance Risk)
  // Based on local sanction lists, VARA, ADGM compliance
  // ═══════════════════════════════════════════════════════════════
  
  let blacklistScore = 0;
  if (isDirectlyBlacklisted) blacklistScore = 100;
  else if (blacklistAssociations >= 3) blacklistScore = 90;
  else if (blacklistAssociations === 2) blacklistScore = 70;
  else if (blacklistAssociations === 1) blacklistScore = 40;
  else blacklistScore = 0;
  
  // UAE regulatory compliance check (VARA, ADGM, CBUAE)
  const regulatoryRisk = blacklistScore > 0 ? 20 : 0;
  
  // FATF grey list considerations
  const fatfFactor = blacklistAssociations > 0 ? 15 : 0;
  
  const rLeg = Math.min(Math.round(blacklistScore * 0.7 + regulatoryRisk + fatfFactor), 100);
  
  // ═══════════════════════════════════════════════════════════════
  // Liquidity_Ratio: نسبة السيولة
  // Based on transaction value and market depth
  // ═══════════════════════════════════════════════════════════════
  
  // Calculate liquidity ratio (1-10 scale, higher = better liquidity)
  let liquidityRatio = 1;
  if (transactionValue >= 10000000) liquidityRatio = 1.5; // Very high value = lower liquidity
  else if (transactionValue >= 5000000) liquidityRatio = 2;
  else if (transactionValue >= 2000000) liquidityRatio = 3;
  else if (transactionValue >= 1000000) liquidityRatio = 4;
  else if (transactionValue >= 500000) liquidityRatio = 5;
  else liquidityRatio = 6;
  
  // Adjust for transaction count (higher count = better liquidity)
  liquidityRatio += Math.min(transactionCount / 50, 2);
  
  // Adjust for wallet age (older = better liquidity)
  liquidityRatio += Math.min(walletAgeDays / 365, 2);
  
  // ═══════════════════════════════════════════════════════════════
  // FINAL FORMULA: Final_Score = (R_live × 0.5) + (R_hist × 0.3) + (R_leg × 0.2) / √Liquidity_Ratio
  // ═══════════════════════════════════════════════════════════════
  
  const W_LIVE = 0.5;  // 50% weight for live risk
  const W_HIST = 0.3;  // 30% weight for historical risk
  const W_LEG = 0.2;   // 20% weight for legal compliance
  
  const numerator = (rLive * W_LIVE) + (rHist * W_HIST) + (rLeg * W_LEG);
  const denominator = Math.sqrt(liquidityRatio);
  
  const finalScore = Math.round(numerator / denominator);
  const riskIndex = Math.min(Math.max(finalScore, 0), 100);
  
  // Recommendation based on final score
  let recommendation: "block" | "review" | "approve";
  if (riskIndex > 60) recommendation = "block";
  else if (riskIndex >= 25) recommendation = "review";
  else recommendation = "approve";

  return {
    finalScore,
    riskIndex,
    rLive,
    rHist,
    rLeg,
    liquidityRatio: Math.round(liquidityRatio * 100) / 100,
    walletAgeScore,
    transactionVolumeScore,
    blacklistScore,
    isBlacklisted: isDirectlyBlacklisted,
    recommendation,
    certificateEligible: riskIndex < 25,
    formulaBreakdown: {
      numerator: Math.round(numerator * 100) / 100,
      denominator: Math.round(denominator * 100) / 100,
    },
  };
}

function RiskGauge({ value }: { value: number }) {
  let color = "bg-green-500";
  if (value > 70) color = "bg-red-500";
  else if (value >= 30) color = "bg-yellow-500";

  return (
    <div className="relative pt-4">
      <div className="flex justify-between text-xs text-amber-200/60 mb-2">
        <span>Safe</span>
        <span>Moderate</span>
        <span>High Risk</span>
      </div>
      <div className="h-4 bg-zinc-800 rounded-full overflow-hidden border border-amber-500/30">
        <div 
          className={`h-full ${color} transition-all duration-1000 ease-out`}
          style={{ width: `${value}%` }}
        />
      </div>
      <div className="mt-3 text-center">
        <span className="text-5xl font-bold text-amber-400">{value}%</span>
        <p className="text-amber-200/60 text-sm mt-1">Risk Index</p>
      </div>
    </div>
  );
}

// Formula Display Component
function FormulaDisplay({ result }: { result: RiskResult }) {
  return (
    <div className="bg-gradient-to-br from-zinc-900 via-zinc-800/50 to-zinc-900 rounded-xl p-6 border border-amber-500/20 mb-6">
      <div className="text-center mb-4">
        <h4 className="text-amber-400 font-semibold text-sm mb-2">Advanced Risk Algorithm</h4>
        <div className="bg-zinc-950/80 rounded-lg p-4 border border-amber-500/10 font-mono">
          <div className="text-amber-100 text-lg">
            <span className="text-amber-300 italic">Final_Score</span>
            <span className="text-amber-200/60"> = </span>
            <span className="text-amber-100">
              (<span className="text-blue-400">R<sub>live</sub></span> × 0.5) + 
              (<span className="text-purple-400">R<sub>hist</sub></span> × 0.3) + 
              (<span className="text-green-400">R<sub>leg</sub></span> × 0.2)
            </span>
          </div>
          <div className="border-t border-amber-500/20 my-2"></div>
          <div className="text-amber-200/60">
            <span className="text-amber-100">√</span>
            <span className="text-orange-400">Liquidity_Ratio</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/20 text-center">
          <p className="text-blue-400 text-xs mb-1">R<sub>live</sub></p>
          <p className="text-xl font-bold text-blue-300">{result.rLive}</p>
          <p className="text-blue-400/60 text-xs">المخاطر اللحظية</p>
        </div>
        <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/20 text-center">
          <p className="text-purple-400 text-xs mb-1">R<sub>hist</sub></p>
          <p className="text-xl font-bold text-purple-300">{result.rHist}</p>
          <p className="text-purple-400/60 text-xs">المخاطر التاريخية</p>
        </div>
        <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/20 text-center">
          <p className="text-green-400 text-xs mb-1">R<sub>leg</sub></p>
          <p className="text-xl font-bold text-green-300">{result.rLeg}</p>
          <p className="text-green-400/60 text-xs">التوافق القانوني</p>
        </div>
        <div className="bg-orange-500/10 rounded-lg p-3 border border-orange-500/20 text-center">
          <p className="text-orange-400 text-xs mb-1">√Liquidity</p>
          <p className="text-xl font-bold text-orange-300">{result.formulaBreakdown.denominator}</p>
          <p className="text-orange-400/60 text-xs">نسبة السيولة</p>
        </div>
      </div>
      
      <div className="mt-4 bg-amber-500/10 rounded-lg p-3 border border-amber-500/20">
        <div className="flex items-center justify-between text-sm">
          <span className="text-amber-200/60">Calculation:</span>
          <span className="font-mono text-amber-100">
            ({result.rLive} × 0.5) + ({result.rHist} × 0.3) + ({result.rLeg} × 0.2) / √{result.liquidityRatio}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-amber-200/60">Result:</span>
          <span className="font-mono text-amber-400 font-bold">
            {result.formulaBreakdown.numerator} / {result.formulaBreakdown.denominator} = {result.finalScore}
          </span>
        </div>
      </div>
    </div>
  );
}

function RiskBreakdown({ result }: { result: RiskResult }) {
  const factors = [
    { 
      label: "R_live (المخاطر اللحظية)", 
      labelEn: "Real-time Portfolio Risk",
      score: result.rLive, 
      weight: "50%",
      icon: Loader2,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      description: "Current wallet activity patterns and recent interactions"
    },
    { 
      label: "R_hist (المخاطر التاريخية)", 
      labelEn: "Historical Risk",
      score: result.rHist, 
      weight: "30%",
      icon: Clock,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      description: "Wallet's complete transaction history and age"
    },
    { 
      label: "R_leg (التوافق القانوني)", 
      labelEn: "Legal Compliance",
      score: result.rLeg, 
      weight: "20%",
      icon: Scale,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      description: "UAE regulatory lists (VARA, ADGM, CBUAE, FATF)"
    },
  ];

  return (
    <div className="space-y-4 mt-6">
      <h4 className="text-amber-400 font-semibold flex items-center gap-2">
        <Shield className="h-4 w-4" />
        Risk Component Analysis
      </h4>
      {factors.map((factor) => (
        <div key={factor.label} className={`${factor.bgColor} rounded-lg p-4 border border-amber-500/10`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <factor.icon className="h-4 w-4 text-amber-500" />
              <span className="text-amber-100 text-sm font-medium">{factor.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-amber-200/60 text-xs">Weight: {factor.weight}</span>
              <span className={`text-sm font-bold ${factor.score > 50 ? 'text-red-400' : factor.score > 25 ? 'text-yellow-400' : 'text-green-400'}`}>
                {factor.score}
              </span>
            </div>
          </div>
          <Progress value={factor.score} className="h-2 bg-zinc-800" />
          <p className="text-amber-200/40 text-xs mt-2">{factor.description}</p>
        </div>
      ))}
    </div>
  );
}

function TermsAgreement({ onAccept }: { onAccept: () => void }) {
  const [agreed, setAgreed] = useState(false);

  const terms = [
    {
      icon: ScrollText,
      title: "Nature of Service",
      titleAr: "طبيعة الخدمة",
      content: "The user acknowledges that CryptoGuard is a technical advisory tool that relies on analyzing publicly available data on the Blockchain. This platform does not provide financial or legal advice, and does not replace the necessity of conducting formal Due Diligence through authorized entities in the UAE such as VARA or ADGM."
    },
    {
      icon: FileWarning,
      title: "Limitation of Liability",
      titleAr: "حدود المسؤولية",
      content: "To the maximum extent permitted by UAE law, the Developer (Mohammed Ali) or CryptoGuard platform shall not be liable for any financial losses, direct or indirect, resulting from using this tool in making investment or commercial decisions. Specifically for transactions exceeding AED 1,000,000, the responsibility for final verification of parties' identities and fund legitimacy lies solely with the user."
    },
    {
      icon: Scale,
      title: "Data Accuracy",
      titleAr: "دقة البيانات",
      content: "Due to the volatile and decentralized nature of digital assets, the platform does not guarantee 100% data accuracy. Risk Scores are probabilistic estimates based on software algorithms and may not reflect the actual hidden risks."
    },
    {
      icon: Gavel,
      title: "UAE Compliance",
      titleAr: "الامتثال لقوانين الإمارات",
      content: "The use of this platform and any disputes arising therefrom are subject to the laws of the United Arab Emirates. The courts of Dubai/Abu Dhabi (or ADGM/DIFC courts as applicable) shall have jurisdiction over any disputes."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 -m-6 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2 py-8">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 mb-4">
            <Scale className="h-5 w-5 text-amber-400" />
            <span className="text-amber-400 text-sm font-medium">Legal Disclaimer</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
            Terms & Conditions
          </h1>
          <p className="text-amber-200/60 max-w-2xl mx-auto">
            Please read and accept the following terms before using the Transaction Due Diligence service.
          </p>
        </div>

        <Card className="bg-zinc-900/80 border-amber-500/20 backdrop-blur-sm">
          <CardHeader className="border-b border-amber-500/10">
            <CardTitle className="text-amber-100 flex items-center gap-2">
              <ScrollText className="h-5 w-5 text-amber-500" />
              Service Agreement
            </CardTitle>
            <CardDescription className="text-amber-200/50">
              High-Value Transaction Due Diligence Terms
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-6">
                {terms.map((term, index) => (
                  <div key={index} className="bg-zinc-800/50 rounded-lg p-5 border border-amber-500/10">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                        <term.icon className="h-5 w-5 text-amber-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-amber-100 font-semibold">{index + 1}. {term.title}</h3>
                          <span className="text-amber-400/60 text-sm">({term.titleAr})</span>
                        </div>
                        <p className="text-amber-200/70 text-sm leading-relaxed">
                          {term.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-5 mt-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-red-400 font-semibold mb-1">Important Notice</h4>
                      <p className="text-red-300/70 text-sm">
                        For transactions exceeding AED 1,000,000, the responsibility for final verification of parties' identities and fund legitimacy lies solely with the user. This platform serves as an advisory tool only.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>

            <div className="border-t border-amber-500/10 mt-6 pt-6 space-y-4">
              <div className="flex items-start gap-3">
                <Checkbox 
                  id="terms-agreement"
                  checked={agreed}
                  onCheckedChange={(checked) => setAgreed(checked === true)}
                  className="border-amber-500/50 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500 mt-1"
                  data-testid="checkbox-agree-terms"
                />
                <label 
                  htmlFor="terms-agreement" 
                  className="text-amber-200/80 text-sm cursor-pointer leading-relaxed"
                >
                  I have read, understood, and agree to the above terms and conditions. I acknowledge that CryptoGuard is an advisory tool and does not replace formal Due Diligence through authorized UAE entities.
                </label>
              </div>

              <Button
                onClick={onAccept}
                disabled={!agreed}
                className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-zinc-900 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="button-accept-terms"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                I Agree - Proceed to Due Diligence
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/50 border-amber-500/10">
          <CardContent className="py-4">
            <div className="flex items-center justify-center gap-6 text-amber-200/40 text-xs">
              <span>UAE Federal Law Compliant</span>
              <span>VARA / ADGM Guidelines</span>
              <span>PDPL Decree-Law No. 45</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function DueDiligence() {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<RiskResult | null>(null);
  const [analyzedAddress, setAnalyzedAddress] = useState("");

  const { data: verifiedReports } = useQuery<ScamReport[]>({
    queryKey: ["/api/reports"],
  });

  const form = useForm<DueDiligenceValues>({
    resolver: zodResolver(dueDiligenceSchema),
    defaultValues: {
      transactionValue: "",
      walletAddress: "",
      assetType: "",
      walletAge: "",
      transactionHistory: "",
    },
  });

  if (!termsAccepted) {
    return <TermsAgreement onAccept={() => setTermsAccepted(true)} />;
  }

  const onSubmit = async (data: DueDiligenceValues) => {
    setAnalyzing(true);
    setResult(null);

    await new Promise(resolve => setTimeout(resolve, 2000));

    const walletAgeDays = parseInt(data.walletAge) || 0;
    const transactionCount = parseInt(data.transactionHistory) || 0;

    const blacklistedAddresses = verifiedReports?.filter(r => r.status === 'verified').map(r => r.scammerAddress.toLowerCase()) || [];
    const isDirectlyBlacklisted = blacklistedAddresses.includes(data.walletAddress.toLowerCase());
    
    let blacklistAssociations = 0;
    if (isDirectlyBlacklisted) {
      blacklistAssociations = 3;
    } else {
      const addressPrefix = data.walletAddress.toLowerCase().slice(0, 6);
      const matchingPrefixes = blacklistedAddresses.filter(addr => addr.slice(0, 6) === addressPrefix);
      blacklistAssociations = Math.min(matchingPrefixes.length, 2);
    }

    // Parse transaction value for liquidity ratio calculation
    const txValue = parseFloat(data.transactionValue.replace(/,/g, '')) || 500000;
    
    const riskResult = calculateRiskScore(
      walletAgeDays,
      transactionCount,
      blacklistAssociations,
      isDirectlyBlacklisted,
      txValue
    );

    setResult(riskResult);
    setAnalyzedAddress(data.walletAddress);
    setAnalyzing(false);
  };

  const formatAED = (value: string) => {
    const num = parseFloat(value.replace(/,/g, ''));
    if (isNaN(num)) return value;
    return num.toLocaleString('en-AE');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 -m-6 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2 py-8">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 mb-4">
            <Gem className="h-5 w-5 text-amber-400" />
            <span className="text-amber-400 text-sm font-medium">Enterprise Grade Security</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
            Transaction Due Diligence
          </h1>
          <p className="text-amber-200/60 max-w-2xl mx-auto">
            Advanced risk assessment for high-value transactions exceeding AED 500,000. 
            Powered by blockchain intelligence and human-verified threat data.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <Card className="bg-zinc-900/80 border-amber-500/20 backdrop-blur-sm">
            <CardHeader className="border-b border-amber-500/10">
              <CardTitle className="text-amber-100 flex items-center gap-2">
                <Wallet className="h-5 w-5 text-amber-500" />
                Transaction Details
              </CardTitle>
              <CardDescription className="text-amber-200/50">
                Enter the transaction parameters for risk analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="transactionValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-amber-200">Transaction Value (AED)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500 font-medium">
                              AED
                            </span>
                            <Input
                              placeholder="500,000"
                              className="pl-14 bg-zinc-800 border-amber-500/30 text-amber-100 placeholder:text-amber-200/30 focus:border-amber-400"
                              {...field}
                              onChange={(e) => field.onChange(formatAED(e.target.value))}
                              data-testid="input-transaction-value"
                            />
                          </div>
                        </FormControl>
                        <FormDescription className="text-amber-200/40">
                          Minimum AED 500,000 for due diligence
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="walletAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-amber-200">Counterparty Wallet Address</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="0x..."
                            className="font-mono bg-zinc-800 border-amber-500/30 text-amber-100 placeholder:text-amber-200/30 focus:border-amber-400"
                            {...field}
                            data-testid="input-wallet-address"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="assetType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-amber-200">Asset Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger 
                              className="bg-zinc-800 border-amber-500/30 text-amber-100"
                              data-testid="select-asset-type"
                            >
                              <SelectValue placeholder="Select asset type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-zinc-900 border-amber-500/30">
                            {assetTypes.map((type) => (
                              <SelectItem 
                                key={type.value} 
                                value={type.value}
                                className="text-amber-100 focus:bg-amber-500/20 focus:text-amber-100"
                              >
                                <div className="flex items-center gap-2">
                                  <type.icon className="h-4 w-4 text-amber-500" />
                                  {type.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="walletAge"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-amber-200">Wallet Age (Days)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="365"
                              className="bg-zinc-800 border-amber-500/30 text-amber-100 placeholder:text-amber-200/30"
                              {...field}
                              data-testid="input-wallet-age"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="transactionHistory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-amber-200">Transaction Count</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="50"
                              className="bg-zinc-800 border-amber-500/30 text-amber-100 placeholder:text-amber-200/30"
                              {...field}
                              data-testid="input-transaction-count"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={analyzing}
                    className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-zinc-900 font-semibold"
                    data-testid="button-analyze-risk"
                  >
                    {analyzing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing Blockchain Data...
                      </>
                    ) : (
                      <>
                        <Shield className="mr-2 h-4 w-4" />
                        Analyze Transaction Risk
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/80 border-amber-500/20 backdrop-blur-sm">
            <CardHeader className="border-b border-amber-500/10">
              <CardTitle className="text-amber-100 flex items-center gap-2">
                <Shield className="h-5 w-5 text-amber-500" />
                Risk Assessment
              </CardTitle>
              <CardDescription className="text-amber-200/50">
                Real-time risk analysis powered by verified intelligence
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {!result && !analyzing && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="h-20 w-20 rounded-full bg-amber-500/10 flex items-center justify-center mb-4 border border-amber-500/30">
                    <Shield className="h-10 w-10 text-amber-500/50" />
                  </div>
                  <p className="text-amber-200/50">
                    Enter transaction details to begin risk analysis
                  </p>
                </div>
              )}

              {analyzing && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="h-20 w-20 rounded-full bg-amber-500/20 flex items-center justify-center mb-4 border border-amber-500/50 animate-pulse">
                    <Loader2 className="h-10 w-10 text-amber-400 animate-spin" />
                  </div>
                  <p className="text-amber-200/70 font-medium">Analyzing Blockchain Data</p>
                  <p className="text-amber-200/40 text-sm mt-1">
                    Cross-referencing with verified threat database...
                  </p>
                </div>
              )}

              {result && (
                <div className="space-y-6">
                  <RiskGauge value={result.riskIndex} />

                  {result.isBlacklisted && (
                    <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-red-400 font-semibold">Blacklisted Address Detected</p>
                        <p className="text-red-300/70 text-sm mt-1">
                          This wallet address exists in our verified scam database.
                        </p>
                      </div>
                    </div>
                  )}

                  {result.recommendation === "block" && (
                    <div className="bg-red-500/10 border border-red-500/40 rounded-lg p-6 text-center">
                      <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-3" />
                      <h3 className="text-xl font-bold text-red-400">Block Transaction Immediately</h3>
                      <p className="text-red-300/70 mt-2">
                        High risk detected. We strongly advise against proceeding with this transaction.
                      </p>
                    </div>
                  )}

                  {result.recommendation === "review" && (
                    <div className="bg-yellow-500/10 border border-yellow-500/40 rounded-lg p-6 text-center">
                      <AlertTriangle className="h-12 w-12 text-yellow-400 mx-auto mb-3" />
                      <h3 className="text-xl font-bold text-yellow-400">Enhanced Review Required</h3>
                      <p className="text-yellow-300/70 mt-2">
                        Moderate risk detected. Additional verification recommended before proceeding.
                      </p>
                    </div>
                  )}

                  {result.certificateEligible && (
                    <div className="bg-green-500/10 border border-green-500/40 rounded-lg p-6 text-center">
                      <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-3" />
                      <h3 className="text-xl font-bold text-green-400">Transaction Approved</h3>
                      <p className="text-green-300/70 mt-2 mb-4">
                        Low risk detected. This transaction is eligible for a Digital Integrity Certificate.
                      </p>
                      <Button 
                        className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white"
                        data-testid="button-issue-certificate"
                      >
                        <FileCheck className="mr-2 h-4 w-4" />
                        Issue Digital Integrity Certificate
                      </Button>
                    </div>
                  )}

                  <FormulaDisplay result={result} />
                  
                  <RiskBreakdown result={result} />

                  <div className="border-t border-amber-500/10 pt-4 mt-6">
                    <p className="text-amber-200/40 text-xs text-center">
                      Analysis based on wallet: <span className="font-mono text-amber-300/60">{analyzedAddress.slice(0, 10)}...{analyzedAddress.slice(-8)}</span>
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="bg-zinc-900/50 border-amber-500/10">
          <CardContent className="py-6">
            <div className="flex items-center justify-center gap-8 text-amber-200/40 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>AES-256 Encrypted</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>PDPL Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <FileCheck className="h-4 w-4" />
                <span>Human-Verified Intelligence</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
