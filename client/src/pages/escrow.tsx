import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Lock, 
  Shield, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  FileSignature,
  Cpu,
  Banknote,
  Upload,
  Hash,
  Wallet,
  ExternalLink,
  Copy,
  Loader2,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Fingerprint,
  ShieldAlert,
  AlertOctagon,
  Phone,
  Ban,
  Eye,
  EyeOff
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import type { HybridVerificationResult } from "@shared/schema.ts";

interface EscrowStep {
  id: number;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed" | "failed";
  icon: typeof CheckCircle;
}

type TransactionStatus = "ACTIVE" | "UNDER REGULATORY INVESTIGATION" | "COMPLETED" | "CANCELLED";

const ESCROW_WALLET_ADDRESS = "0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf";
const TRANSACTION_HASH = "0x8f7d...3a2b...9c4e";

export default function EscrowPage() {
  const { toast } = useToast();
  const [contractFile, setContractFile] = useState<File | null>(null);
  const [contractHash, setContractHash] = useState<string | null>(null);
  const [securityResult, setSecurityResult] = useState<HybridVerificationResult | null>(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [transactionAmount] = useState(10000);
  
  const [isEscrowLocked, setIsEscrowLocked] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>("ACTIVE");
  const [lockdownTimestamp, setLockdownTimestamp] = useState<Date | null>(null);
  const [lastRiskReport, setLastRiskReport] = useState<HybridVerificationResult | null>(null);
  
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [adminCode, setAdminCode] = useState("");
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  
  const [releaseCountdown, setReleaseCountdown] = useState<number | null>(null);
  
  const [steps, setSteps] = useState<EscrowStep[]>([
    {
      id: 1,
      title: "Buyer Deposit",
      description: "Funds deposited to escrow wallet",
      status: "completed",
      icon: Banknote,
    },
    {
      id: 2,
      title: "Digital Contract Signing",
      description: "Upload & hash verification",
      status: "pending",
      icon: FileSignature,
    },
    {
      id: 3,
      title: "Security Clearance",
      description: "Alchemy + AI verification",
      status: "pending",
      icon: Shield,
    },
    {
      id: 4,
      title: "Funds Release to Seller",
      description: "Multi-sig release",
      status: "pending",
      icon: Wallet,
    },
  ]);

  const updateStepStatus = (stepId: number, status: EscrowStep["status"]) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, status } : step
    ));
  };

  const triggerEmergencyLockdown = (autoTriggered: boolean = false) => {
    setIsEscrowLocked(true);
    setTransactionStatus("UNDER REGULATORY INVESTIGATION");
    setLockdownTimestamp(new Date());
    setLastRiskReport(securityResult);
    setReleaseCountdown(null);
    
    toast({
      title: autoTriggered ? "AUTO-LOCKDOWN ACTIVATED" : "EMERGENCY LOCKDOWN ACTIVATED",
      description: autoTriggered 
        ? "Critical threat detected (Risk Score > 90). Transaction frozen." 
        : "Transaction frozen. Status: Under Regulatory Investigation.",
      variant: "destructive",
    });
  };

  const unlockTransaction = () => {
    setIsEscrowLocked(false);
    setTransactionStatus("ACTIVE");
    setLockdownTimestamp(null);
    
    toast({
      title: "Transaction Unlocked",
      description: "Escrow transaction has been restored to active status.",
    });
  };

  const [isAuthenticating, setIsAuthenticating] = useState(false);
  
  const handleAdminAuth = async () => {
    setIsAuthenticating(true);
    try {
      const response = await apiRequest("POST", "/api/admin/escrow/authenticate", { code: adminCode });
      const data = await response.json();
      
      if (data.success) {
        setIsAdminAuthenticated(true);
        setAdminCode("");
        toast({
          title: "Admin Access Granted",
          description: "Welcome to the Command Center.",
        });
      }
    } catch (error) {
      toast({
        title: "Access Denied",
        description: "Invalid admin code.",
        variant: "destructive",
      });
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isEscrowLocked) return;
    
    const file = e.target.files?.[0];
    if (!file) return;

    setContractFile(file);
    updateStepStatus(2, "in_progress");

    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    
    setTimeout(() => {
      setContractHash(hashHex);
      updateStepStatus(2, "completed");
      toast({
        title: "Contract Verified",
        description: "Digital signature hash generated successfully",
      });
    }, 1500);
  };

  const securityMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/hybrid-verification", {
        walletAddress: walletAddress || "0x742d35Cc6634C0532925a3b844Bc9e7595f8dB77",
        transactionAmountAED: transactionAmount,
        assetType: "digital_asset",
        network: "ethereum",
      });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success && data.verification) {
        setSecurityResult(data.verification);
        setLastRiskReport(data.verification);
        const rawScore = data.verification.aiInsight?.riskScore;
        const riskScore = typeof rawScore === "number" && Number.isFinite(rawScore) ? rawScore : 100;
        
        if (riskScore > 90) {
          triggerEmergencyLockdown(true);
          updateStepStatus(3, "failed");
          return;
        }
        
        if (riskScore < 20) {
          updateStepStatus(3, "completed");
          toast({
            title: "Security Clearance Passed",
            description: `Risk Score: ${riskScore}/100 - Below threshold`,
          });
        } else {
          updateStepStatus(3, "failed");
          toast({
            title: "Security Clearance Failed",
            description: `Risk Score: ${riskScore}/100 - Above threshold (20)`,
            variant: "destructive",
          });
        }
      } else {
        updateStepStatus(3, "failed");
        toast({
          title: "Security Check Failed",
          description: "Invalid response from security engine",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      updateStepStatus(3, "failed");
      toast({
        title: "Security Check Failed",
        description: "Unable to complete security verification",
        variant: "destructive",
      });
    },
  });

  const runSecurityClearance = () => {
    if (isEscrowLocked) return;
    
    if (steps[1].status !== "completed") {
      toast({
        title: "Contract Required",
        description: "Please upload and verify contract first",
        variant: "destructive",
      });
      return;
    }
    updateStepStatus(3, "in_progress");
    securityMutation.mutate();
  };

  const initiateRelease = () => {
    if (isEscrowLocked) return;
    
    setReleaseCountdown(10);
  };

  useEffect(() => {
    if (releaseCountdown === null || releaseCountdown < 0) return;
    
    if (isEscrowLocked) {
      setReleaseCountdown(null);
      return;
    }
    
    if (releaseCountdown === 0) {
      const currentRiskScore = getRiskScore();
      if (currentRiskScore > 90 || isEscrowLocked) {
        triggerEmergencyLockdown(true);
        setReleaseCountdown(null);
        return;
      }
      
      updateStepStatus(4, "completed");
      setTransactionStatus("COMPLETED");
      toast({
        title: "Funds Released",
        description: "Transaction completed successfully via Multi-Sig Bridge",
      });
      setReleaseCountdown(null);
      return;
    }
    
    const timer = setTimeout(() => {
      setReleaseCountdown(releaseCountdown - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [releaseCountdown, isEscrowLocked]);
  
  const cancelRelease = () => {
    if (isEscrowLocked) return;
    setReleaseCountdown(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied", description: "Address copied to clipboard" });
  };

  const getRiskScore = (): number => {
    const rawScore = securityResult?.aiInsight?.riskScore;
    return typeof rawScore === "number" && Number.isFinite(rawScore) ? rawScore : 100;
  };

  const canReleaseFunds = !isEscrowLocked && 
    securityResult && 
    getRiskScore() < 20 && 
    steps[2].status === "completed" &&
    transactionStatus === "ACTIVE";

  const getStepColor = (status: EscrowStep["status"]) => {
    if (isEscrowLocked) return "bg-red-900 border-red-700";
    switch (status) {
      case "completed": return "bg-emerald-500 border-emerald-400";
      case "in_progress": return "bg-amber-500 border-amber-400 animate-pulse";
      case "failed": return "bg-red-500 border-red-400";
      default: return "bg-zinc-700 border-zinc-600";
    }
  };

  const getStepTextColor = (status: EscrowStep["status"]) => {
    if (isEscrowLocked) return "text-red-400";
    switch (status) {
      case "completed": return "text-emerald-400";
      case "in_progress": return "text-amber-400";
      case "failed": return "text-red-400";
      default: return "text-zinc-500";
    }
  };

  const getStatusBadge = () => {
    switch (transactionStatus) {
      case "UNDER REGULATORY INVESTIGATION":
        return <Badge variant="destructive" className="px-4 py-2 animate-pulse">UNDER REGULATORY INVESTIGATION</Badge>;
      case "COMPLETED":
        return <Badge className="bg-emerald-500 px-4 py-2">COMPLETED</Badge>;
      case "CANCELLED":
        return <Badge variant="secondary" className="px-4 py-2">CANCELLED</Badge>;
      default:
        return <Badge variant="outline" className="border-amber-500/50 text-amber-400 px-4 py-2">ACTIVE</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-emerald-950/20 to-zinc-950 -m-6 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {isEscrowLocked && (
          <Card className="bg-gradient-to-r from-red-950/90 to-red-900/80 border-2 border-red-500 animate-pulse" data-testid="card-lockdown-notice">
            <CardContent className="py-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-red-500/30">
                  <ShieldAlert className="h-8 w-8 text-red-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-red-100">Transaction Paused</h3>
                  <p className="text-red-200/80 text-sm">
                    This transaction has been temporarily paused for advanced security verification. Please contact support.
                  </p>
                </div>
                <Button variant="outline" className="border-red-400 text-red-400" data-testid="button-contact-support">
                  <Phone className="mr-2 h-4 w-4" />
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-amber-500/20 border border-emerald-500/30">
            <Lock className="h-5 w-5 text-amber-400" />
            <span className="text-amber-400 font-semibold">Smart Multi-Sig Bridge</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-300 via-amber-400 to-emerald-300 bg-clip-text text-transparent" data-testid="heading-escrow">
            Sovereign Escrow Protocol
          </h1>
          <p className="text-emerald-200/60 max-w-2xl mx-auto">
            Institutional-grade escrow for high-value transactions with multi-signature security and AI-powered risk assessment
          </p>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-zinc-600 hover:text-zinc-400"
            onClick={() => setShowAdminPanel(!showAdminPanel)}
            data-testid="button-toggle-admin"
          >
            {showAdminPanel ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>

        {showAdminPanel && (
          <Card className="bg-gradient-to-br from-red-950/50 to-zinc-900/95 border-2 border-red-500/50" data-testid="card-admin-panel">
            <CardHeader className="border-b border-red-500/30">
              <CardTitle className="text-xl text-red-100 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/20">
                  <AlertOctagon className="h-6 w-6 text-red-400" />
                </div>
                Admin Command Center
              </CardTitle>
              <CardDescription className="text-red-200/50">
                Super-Admin Emergency Controls
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {!isAdminAuthenticated ? (
                <div className="flex items-center gap-4">
                  <Input
                    type="password"
                    placeholder="Enter admin code..."
                    value={adminCode}
                    onChange={(e) => setAdminCode(e.target.value)}
                    className="bg-zinc-800/50 border-red-500/30 max-w-xs"
                    data-testid="input-admin-code"
                  />
                  <Button 
                    onClick={handleAdminAuth} 
                    variant="destructive" 
                    disabled={isAuthenticating}
                    data-testid="button-admin-auth"
                  >
                    {isAuthenticating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Authenticating...
                      </>
                    ) : (
                      "Authenticate"
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-red-300">Emergency Controls</h4>
                      <Button
                        size="lg"
                        variant="destructive"
                        className="w-full h-16 text-lg font-bold bg-gradient-to-r from-red-600 to-red-700 border-2 border-red-400"
                        onClick={() => triggerEmergencyLockdown(false)}
                        disabled={isEscrowLocked}
                        data-testid="button-emergency-lockdown"
                      >
                        <Ban className="mr-3 h-6 w-6" />
                        EMERGENCY LOCKDOWN
                      </Button>
                      
                      {isEscrowLocked && (
                        <Button
                          size="lg"
                          className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600"
                          onClick={unlockTransaction}
                          data-testid="button-unlock-transaction"
                        >
                          <CheckCircle className="mr-2 h-5 w-5" />
                          Unlock Transaction
                        </Button>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-red-300">Current Status</h4>
                      <div className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-400 text-sm">Lockdown Status:</span>
                          <Badge variant={isEscrowLocked ? "destructive" : "outline"} className={isEscrowLocked ? "" : "text-emerald-400 border-emerald-500"}>
                            {isEscrowLocked ? "LOCKED" : "NORMAL"}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-400 text-sm">Transaction Status:</span>
                          <span className="text-sm text-white">{transactionStatus}</span>
                        </div>
                        {lockdownTimestamp && (
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-400 text-sm">Locked At:</span>
                            <span className="text-xs text-red-300">{lockdownTimestamp.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {lastRiskReport && (
                    <div className="p-4 rounded-lg bg-zinc-800/30 border border-zinc-700">
                      <h4 className="text-sm font-semibold text-amber-400 mb-3">Last Captured AI Risk Report</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-zinc-500">Risk Score:</span>
                          <span className="ml-2 text-white font-bold">{lastRiskReport.aiInsight?.riskScore || "N/A"}/100</span>
                        </div>
                        <div>
                          <span className="text-zinc-500">Analysis:</span>
                          <span className="ml-2 text-zinc-300 text-xs">{lastRiskReport.aiInsight?.analysis?.slice(0, 100)}...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card className={`bg-gradient-to-br from-zinc-900/95 via-emerald-950/30 to-zinc-900/95 border-2 ${isEscrowLocked ? "border-red-500/50" : "border-emerald-500/30"} backdrop-blur-sm shadow-2xl shadow-emerald-500/10`} data-testid="card-progress-tracker">
          <CardHeader className={`border-b ${isEscrowLocked ? "border-red-500/20" : "border-emerald-500/20"} pb-6`}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <CardTitle className="text-2xl text-emerald-100 flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isEscrowLocked ? "bg-red-500/20" : "bg-gradient-to-br from-emerald-500/20 to-amber-500/20"}`}>
                    <Fingerprint className={`h-6 w-6 ${isEscrowLocked ? "text-red-400" : "text-amber-400"}`} />
                  </div>
                  Transaction Progress
                </CardTitle>
                <CardDescription className="text-emerald-200/50 mt-2">
                  AED {transactionAmount.toLocaleString()} Escrow Transaction
                </CardDescription>
              </div>
              {getStatusBadge()}
            </div>
          </CardHeader>
          <CardContent className="pt-8">
            <div className="relative">
              <div className={`absolute top-8 left-8 right-8 h-1 ${isEscrowLocked ? "bg-red-900" : "bg-zinc-800"} rounded-full`}>
                <div 
                  className={`h-full ${isEscrowLocked ? "bg-red-500" : "bg-gradient-to-r from-emerald-500 to-amber-500"} rounded-full transition-all duration-500`}
                  style={{ width: `${(steps.filter(s => s.status === "completed").length / steps.length) * 100}%` }}
                />
              </div>
              
              <div className="flex justify-between relative z-10">
                {steps.map((step, index) => {
                  const StepIcon = step.icon;
                  return (
                    <div key={step.id} className="flex flex-col items-center gap-3 w-1/4" data-testid={`step-${step.id}`}>
                      <div className={`h-16 w-16 rounded-full flex items-center justify-center border-4 ${getStepColor(step.status)} transition-all duration-300`}>
                        {isEscrowLocked ? (
                          <Ban className="h-8 w-8 text-red-300" />
                        ) : step.status === "completed" ? (
                          <CheckCircle2 className="h-8 w-8 text-white" />
                        ) : step.status === "in_progress" ? (
                          <Loader2 className="h-8 w-8 text-white animate-spin" />
                        ) : step.status === "failed" ? (
                          <XCircle className="h-8 w-8 text-white" />
                        ) : (
                          <StepIcon className="h-8 w-8 text-zinc-400" />
                        )}
                      </div>
                      <div className="text-center">
                        <p className={`font-semibold ${getStepTextColor(step.status)}`} data-testid={`step-title-${step.id}`}>
                          {step.title}
                        </p>
                        <p className="text-xs text-zinc-500 mt-1">{step.description}</p>
                      </div>
                      {index < steps.length - 1 && (
                        <ArrowRight className="absolute top-6 text-zinc-600 hidden lg:block" style={{ left: `${(index + 1) * 25 - 2}%` }} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className={`bg-gradient-to-br from-zinc-900/95 to-emerald-950/20 border ${isEscrowLocked ? "border-red-500/30 opacity-60" : "border-emerald-500/20"}`} data-testid="card-contract-signing">
            <CardHeader className="border-b border-emerald-500/10">
              <CardTitle className="text-lg text-emerald-100 flex items-center gap-2">
                <FileSignature className="h-5 w-5 text-amber-400" />
                Step 2: Digital Contract Signing
              </CardTitle>
              <CardDescription className="text-emerald-200/50">
                Upload contract for SHA-256 hash verification
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className={`border-2 border-dashed ${isEscrowLocked ? "border-red-500/30" : "border-emerald-500/30 hover:border-amber-500/50"} rounded-lg p-6 text-center transition-colors`}>
                <Upload className={`h-10 w-10 ${isEscrowLocked ? "text-red-400" : "text-emerald-400"} mx-auto mb-3`} />
                <label className={isEscrowLocked ? "cursor-not-allowed" : "cursor-pointer"}>
                  <span className="text-emerald-200">Drop contract file or </span>
                  <span className="text-amber-400 underline">browse</span>
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx"
                    disabled={isEscrowLocked}
                    data-testid="input-contract-file"
                  />
                </label>
              </div>
              
              {contractFile && (
                <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                  <p className="text-sm text-emerald-300 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    {contractFile.name}
                  </p>
                </div>
              )}

              {contractHash && (
                <div className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700 space-y-2">
                  <p className="text-xs text-amber-400 flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    SHA-256 Hash
                  </p>
                  <p className="font-mono text-xs text-emerald-300 break-all" data-testid="text-contract-hash">
                    {contractHash}
                  </p>
                  <Badge variant="outline" className="border-emerald-500/50 text-emerald-400">
                    Verified
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className={`bg-gradient-to-br from-zinc-900/95 to-emerald-950/20 border ${isEscrowLocked ? "border-red-500/30 opacity-60" : "border-emerald-500/20"}`} data-testid="card-security-clearance">
            <CardHeader className="border-b border-emerald-500/10">
              <CardTitle className="text-lg text-emerald-100 flex items-center gap-2">
                <Shield className="h-5 w-5 text-amber-400" />
                Step 3: Security Clearance
              </CardTitle>
              <CardDescription className="text-emerald-200/50">
                Hybrid Security Engine verification (Alchemy + AI)
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-3">
                <label className="text-sm text-emerald-200">Counterparty Wallet Address</label>
                <Input
                  placeholder="0x..."
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="bg-zinc-800/50 border-zinc-700 font-mono text-sm"
                  disabled={isEscrowLocked}
                  data-testid="input-wallet-address"
                />
              </div>

              <Button
                onClick={runSecurityClearance}
                disabled={securityMutation.isPending || steps[1].status !== "completed" || isEscrowLocked}
                className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600"
                data-testid="button-security-check"
              >
                {securityMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Running Security Analysis...
                  </>
                ) : (
                  <>
                    <Cpu className="mr-2 h-4 w-4" />
                    Run Security Clearance
                  </>
                )}
              </Button>

              {securityResult && (
                <div className={`p-4 rounded-lg border ${
                  getRiskScore() > 90 
                    ? "bg-red-900/50 border-red-500"
                    : getRiskScore() < 20 
                      ? "bg-emerald-500/10 border-emerald-500/30" 
                      : "bg-red-500/10 border-red-500/30"
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-zinc-400">Risk Score</span>
                    <span className={`text-2xl font-bold ${
                      getRiskScore() > 90 
                        ? "text-red-300 animate-pulse"
                        : getRiskScore() < 20 
                          ? "text-emerald-400" 
                          : "text-red-400"
                    }`} data-testid="text-risk-score">
                      {securityResult.aiInsight?.riskScore || 0}/100
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500">
                    {getRiskScore() > 90
                      ? "CRITICAL THREAT - Auto-lockdown triggered"
                      : getRiskScore() < 20 
                        ? "Clearance approved - funds release authorized" 
                        : "Risk threshold exceeded (>20) - release blocked"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className={`bg-gradient-to-br from-zinc-900/95 via-amber-950/10 to-zinc-900/95 border-2 ${isEscrowLocked ? "border-red-500/50" : "border-amber-500/30"}`} data-testid="card-smart-contract">
          <CardHeader className={`border-b ${isEscrowLocked ? "border-red-500/20" : "border-amber-500/20"}`}>
            <CardTitle className="text-xl text-amber-100 flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isEscrowLocked ? "bg-red-500/20" : "bg-gradient-to-br from-amber-500/20 to-emerald-500/20"}`}>
                <Lock className={`h-6 w-6 ${isEscrowLocked ? "text-red-400" : "text-amber-400"}`} />
              </div>
              Smart Contract Simulation
            </CardTitle>
            <CardDescription className="text-amber-200/50">
              On-chain escrow wallet status and confirmation
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-5 rounded-lg bg-zinc-800/50 border border-zinc-700">
                  <p className="text-xs text-amber-400 mb-2 flex items-center gap-2">
                    <Wallet className="h-4 w-4" />
                    Escrow Wallet Address
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-sm text-emerald-300 flex-1" data-testid="text-escrow-wallet">
                      {ESCROW_WALLET_ADDRESS}
                    </p>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={() => copyToClipboard(ESCROW_WALLET_ADDRESS)}
                      data-testid="button-copy-escrow"
                    >
                      <Copy className="h-4 w-4 text-zinc-400" />
                    </Button>
                    <Button size="icon" variant="ghost" data-testid="button-view-etherscan">
                      <ExternalLink className="h-4 w-4 text-zinc-400" />
                    </Button>
                  </div>
                </div>

                <div className="p-5 rounded-lg bg-zinc-800/50 border border-zinc-700">
                  <p className="text-xs text-amber-400 mb-2">Locked Amount</p>
                  <p className="text-2xl font-bold text-white" data-testid="text-locked-amount">
                    AED {transactionAmount.toLocaleString()}
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">Equivalent to ~{(transactionAmount / 13500).toFixed(4)} ETH</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className={`p-5 rounded-lg ${isEscrowLocked ? "bg-red-500/10 border-red-500/30" : "bg-emerald-500/10 border-emerald-500/30"} border`}>
                  <p className={`text-xs ${isEscrowLocked ? "text-red-400" : "text-emerald-400"} mb-2 flex items-center gap-2`}>
                    {isEscrowLocked ? <Ban className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                    {isEscrowLocked ? "Transaction Frozen" : "On-Chain Confirmation"}
                  </p>
                  <p className="font-mono text-sm text-zinc-300" data-testid="text-tx-hash">
                    {TRANSACTION_HASH}
                  </p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <Badge variant="outline" className={`${isEscrowLocked ? "border-red-500/50 text-red-400" : "border-emerald-500/50 text-emerald-400"}`}>
                      12 Confirmations
                    </Badge>
                    <Badge variant="outline" className="border-zinc-600 text-zinc-400">
                      Block #19,847,621
                    </Badge>
                  </div>
                </div>

                <div className="p-5 rounded-lg bg-zinc-800/50 border border-zinc-700">
                  <p className="text-xs text-amber-400 mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Time Lock Status
                  </p>
                  <p className="text-sm text-zinc-300">24-hour dispute window active</p>
                  <p className="text-xs text-zinc-500 mt-1">Expires: {new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleString()}</p>
                </div>
              </div>
            </div>

            <Separator className={`my-6 ${isEscrowLocked ? "bg-red-500/20" : "bg-amber-500/20"}`} />

            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="space-y-1">
                <p className="text-sm text-zinc-400">Step 4: Release Funds to Seller</p>
                <p className="text-xs text-zinc-600">
                  {isEscrowLocked 
                    ? "Transaction locked - awaiting admin intervention"
                    : canReleaseFunds 
                      ? "All conditions met - ready for release" 
                      : "Requires Risk Score < 20/100 from Security Clearance"}
                </p>
              </div>
              
              {releaseCountdown !== null && releaseCountdown > 0 && !isEscrowLocked ? (
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-amber-400">{releaseCountdown}s</p>
                    <p className="text-xs text-zinc-500">Final security check</p>
                  </div>
                  <Button
                    size="lg"
                    variant="destructive"
                    onClick={cancelRelease}
                    disabled={isEscrowLocked}
                    data-testid="button-cancel-release"
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  size="lg"
                  disabled={!canReleaseFunds || steps[3].status === "completed" || isEscrowLocked}
                  onClick={initiateRelease}
                  className={`px-8 ${
                    canReleaseFunds && !isEscrowLocked
                      ? "bg-gradient-to-r from-amber-500 to-emerald-500 text-black font-bold" 
                      : "bg-zinc-700 text-zinc-400"
                  }`}
                  data-testid="button-release-funds"
                >
                  {steps[3].status === "completed" ? (
                    <>
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Funds Released
                    </>
                  ) : isEscrowLocked ? (
                    <>
                      <Ban className="mr-2 h-5 w-5" />
                      Locked
                    </>
                  ) : (
                    <>
                      <Banknote className="mr-2 h-5 w-5" />
                      Release Funds
                    </>
                  )}
                </Button>
              )}
            </div>

            {!canReleaseFunds && steps[2].status !== "completed" && !isEscrowLocked && (
              <div className="mt-4 p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                <p className="text-sm text-amber-300 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Security clearance must return Risk Score below 20/100 to enable fund release
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center text-xs text-zinc-600">
          <p>Powered by UAE7Guard Sovereign Protocol</p>
        </div>
      </div>
    </div>
  );
}
