import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Lock, 
  Plus, 
  Shield, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Building2,
  Watch,
  Car,
  Coins,
  Package,
  ArrowRight,
  FileCheck,
  XCircle,
  Unlock
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { EscrowTransaction } from "@shared/schema";

const escrowSchema = z.object({
  assetType: z.string().min(1, "Select asset type"),
  assetDescription: z.string().min(10, "Provide a detailed description"),
  amount: z.string().min(1, "Amount is required"),
  buyerWallet: z.string().min(26, "Invalid wallet address"),
  sellerWallet: z.string().optional(),
  releaseConditions: z.string().optional(),
});

type EscrowValues = z.infer<typeof escrowSchema>;

const assetTypes = [
  { value: "real_estate", label: "Real Estate", icon: Building2 },
  { value: "luxury_watch", label: "Luxury Watch", icon: Watch },
  { value: "vehicle", label: "Vehicle", icon: Car },
  { value: "crypto", label: "Cryptocurrency", icon: Coins },
  { value: "other", label: "Other Asset", icon: Package },
];

const statusConfig: Record<string, { color: string; bgColor: string; icon: typeof CheckCircle }> = {
  pending: { color: "text-yellow-400", bgColor: "bg-yellow-500/10", icon: Clock },
  funded: { color: "text-blue-400", bgColor: "bg-blue-500/10", icon: Coins },
  verified: { color: "text-emerald-400", bgColor: "bg-emerald-500/10", icon: Shield },
  released: { color: "text-green-400", bgColor: "bg-green-500/10", icon: Unlock },
  disputed: { color: "text-red-400", bgColor: "bg-red-500/10", icon: AlertTriangle },
  cancelled: { color: "text-zinc-400", bgColor: "bg-zinc-500/10", icon: XCircle },
};

const mockEscrows: EscrowTransaction[] = [
  {
    id: "1",
    buyerId: "demo-user",
    sellerId: "seller-1",
    assetType: "real_estate",
    assetDescription: "Villa in Palm Jumeirah, 5 bedrooms with private beach access",
    amount: "15,000,000",
    currency: "AED",
    buyerWallet: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD12",
    sellerWallet: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
    status: "verified",
    buyerVerified: true,
    sellerVerified: true,
    assetTransferred: false,
    releaseConditions: "Title deed transfer confirmed by Dubai Land Department",
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
  {
    id: "2",
    buyerId: "demo-user",
    sellerId: null,
    assetType: "luxury_watch",
    assetDescription: "Patek Philippe Nautilus 5711/1A-010",
    amount: "850,000",
    currency: "AED",
    buyerWallet: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD12",
    sellerWallet: null,
    status: "pending",
    buyerVerified: true,
    sellerVerified: false,
    assetTransferred: false,
    releaseConditions: null,
    expiresAt: null,
    createdAt: new Date(Date.now() - 60 * 60 * 1000),
    updatedAt: new Date(),
  },
];

function EscrowProgress({ escrow }: { escrow: EscrowTransaction }) {
  const steps = [
    { label: "Created", completed: true },
    { label: "Funded", completed: escrow.status !== "pending" },
    { label: "Verified", completed: escrow.buyerVerified && escrow.sellerVerified },
    { label: "Asset Transferred", completed: escrow.assetTransferred },
    { label: "Released", completed: escrow.status === "released" },
  ];

  const completedSteps = steps.filter(s => s.completed).length;
  const progress = (completedSteps / steps.length) * 100;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-amber-200/60">Progress</span>
        <span className="text-amber-400 font-medium">{completedSteps}/{steps.length} Steps</span>
      </div>
      <Progress value={progress} className="h-2 bg-zinc-800" />
      <div className="flex justify-between">
        {steps.map((step, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className={`h-6 w-6 rounded-full flex items-center justify-center ${
              step.completed ? "bg-amber-500" : "bg-zinc-700"
            }`}>
              {step.completed ? (
                <CheckCircle className="h-4 w-4 text-zinc-900" />
              ) : (
                <span className="text-xs text-zinc-400">{i + 1}</span>
              )}
            </div>
            <span className={`text-xs ${step.completed ? "text-amber-400" : "text-zinc-500"}`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function EscrowPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("active");

  const { data: escrows, isLoading } = useQuery<EscrowTransaction[]>({
    queryKey: ["/api/escrow"],
  });

  const displayEscrows = escrows?.length ? escrows : mockEscrows;

  const form = useForm<EscrowValues>({
    resolver: zodResolver(escrowSchema),
    defaultValues: {
      assetType: "",
      assetDescription: "",
      amount: "",
      buyerWallet: "",
      sellerWallet: "",
      releaseConditions: "",
    },
  });

  const createEscrowMutation = useMutation({
    mutationFn: async (data: EscrowValues) => {
      return apiRequest("POST", "/api/escrow", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/escrow"] });
      setDialogOpen(false);
      form.reset();
    },
  });

  const onSubmit = (data: EscrowValues) => {
    createEscrowMutation.mutate(data);
  };

  const formatAED = (value: string) => {
    return `AED ${value}`;
  };

  const getAssetIcon = (type: string) => {
    const asset = assetTypes.find(a => a.value === type);
    return asset?.icon || Package;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 -m-6 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 mb-2">
              <Lock className="h-4 w-4 text-amber-400" />
              <span className="text-amber-400 text-sm font-medium">Smart Escrow Bridge</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
              Secure Transaction Escrow
            </h1>
            <p className="text-amber-200/60">
              Protected fund release for high-value asset transfers
            </p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-amber-600 hover:bg-amber-500 text-zinc-900" data-testid="button-new-escrow">
                <Plus className="h-4 w-4 mr-2" />
                New Escrow
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-900 border-amber-500/20 max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-amber-100">Create Secure Escrow</DialogTitle>
                <DialogDescription className="text-amber-200/60">
                  Funds will only be released when all conditions are verified
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="assetType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-amber-200">Asset Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-zinc-800 border-amber-500/30 text-amber-100" data-testid="select-asset-type">
                              <SelectValue placeholder="Select asset type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-zinc-800 border-amber-500/30">
                            {assetTypes.map((asset) => (
                              <SelectItem key={asset.value} value={asset.value} className="text-amber-100">
                                <div className="flex items-center gap-2">
                                  <asset.icon className="h-4 w-4 text-amber-500" />
                                  {asset.label}
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
                    name="assetDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-amber-200">Asset Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Detailed description of the asset..."
                            className="bg-zinc-800 border-amber-500/30 text-amber-100 min-h-[80px]"
                            {...field}
                            data-testid="input-asset-description"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-amber-200">Amount (AED)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="500,000"
                              className="bg-zinc-800 border-amber-500/30 text-amber-100"
                              {...field}
                              data-testid="input-amount"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="buyerWallet"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-amber-200">Your Wallet</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="0x..."
                              className="bg-zinc-800 border-amber-500/30 text-amber-100 font-mono"
                              {...field}
                              data-testid="input-buyer-wallet"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="sellerWallet"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-amber-200">Seller Wallet (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="0x..."
                            className="bg-zinc-800 border-amber-500/30 text-amber-100 font-mono"
                            {...field}
                            data-testid="input-seller-wallet"
                          />
                        </FormControl>
                        <FormDescription className="text-amber-200/40">
                          Can be added later when seller joins
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="releaseConditions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-amber-200">Release Conditions</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Conditions that must be met before funds are released..."
                            className="bg-zinc-800 border-amber-500/30 text-amber-100"
                            {...field}
                            data-testid="input-conditions"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full bg-amber-600 hover:bg-amber-500 text-zinc-900"
                    disabled={createEscrowMutation.isPending}
                    data-testid="button-create-escrow"
                  >
                    {createEscrowMutation.isPending ? "Creating..." : "Create Escrow"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-zinc-900/80 border-amber-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <Lock className="h-6 w-6 text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-amber-100">{displayEscrows.length}</p>
                  <p className="text-amber-200/60 text-sm">Active Escrows</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900/80 border-amber-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-amber-100">
                    {displayEscrows.filter(e => e.status === "released").length}
                  </p>
                  <p className="text-amber-200/60 text-sm">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900/80 border-amber-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Coins className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-amber-100">
                    AED {displayEscrows.reduce((sum, e) => sum + parseFloat(e.amount.replace(/,/g, '')), 0).toLocaleString()}
                  </p>
                  <p className="text-amber-200/60 text-sm">Total Value Locked</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-zinc-900/80 border-amber-500/20">
          <CardHeader className="border-b border-amber-500/10">
            <CardTitle className="text-amber-100">Your Escrow Transactions</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {displayEscrows.map((escrow) => {
                const AssetIcon = getAssetIcon(escrow.assetType);
                const status = statusConfig[escrow.status] || statusConfig.pending;
                const StatusIcon = status.icon;

                return (
                  <div
                    key={escrow.id}
                    className="p-6 rounded-lg bg-zinc-800/50 border border-amber-500/10"
                    data-testid={`escrow-item-${escrow.id}`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-amber-500/20 flex items-center justify-center">
                          <AssetIcon className="h-6 w-6 text-amber-400" />
                        </div>
                        <div>
                          <h3 className="text-amber-100 font-semibold">{escrow.assetDescription}</h3>
                          <p className="text-amber-200/60 text-sm">
                            {assetTypes.find(a => a.value === escrow.assetType)?.label}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={`${status.bgColor} ${status.color} border-0`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {escrow.status.charAt(0).toUpperCase() + escrow.status.slice(1)}
                        </Badge>
                        <p className="text-amber-400 font-bold text-lg mt-1">
                          {formatAED(escrow.amount)}
                        </p>
                      </div>
                    </div>

                    <EscrowProgress escrow={escrow} />

                    <div className="mt-4 pt-4 border-t border-amber-500/10">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-amber-200/40 mb-1">Buyer Wallet</p>
                          <p className="text-amber-100 font-mono text-xs">
                            {escrow.buyerWallet.slice(0, 12)}...{escrow.buyerWallet.slice(-8)}
                          </p>
                        </div>
                        <div>
                          <p className="text-amber-200/40 mb-1">Seller Wallet</p>
                          <p className="text-amber-100 font-mono text-xs">
                            {escrow.sellerWallet 
                              ? `${escrow.sellerWallet.slice(0, 12)}...${escrow.sellerWallet.slice(-8)}`
                              : "Awaiting seller..."}
                          </p>
                        </div>
                      </div>
                      {escrow.releaseConditions && (
                        <div className="mt-3 p-3 rounded bg-amber-500/5 border border-amber-500/10">
                          <p className="text-amber-200/40 text-xs mb-1">Release Conditions</p>
                          <p className="text-amber-200/80 text-sm">{escrow.releaseConditions}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
