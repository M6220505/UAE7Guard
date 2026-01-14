import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Radio, 
  Plus, 
  Trash2, 
  Bell, 
  Activity, 
  Wallet,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  Eye,
  EyeOff,
  RefreshCw
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { LiveMonitoring, MonitoringAlert } from "@shared/schema";

const addWalletSchema = z.object({
  walletAddress: z.string().min(26, "Invalid wallet address").max(62),
  label: z.string().optional(),
  network: z.string().min(1, "Select a network"),
});

type AddWalletValues = z.infer<typeof addWalletSchema>;

const networks = [
  { value: "ethereum", label: "Ethereum", color: "bg-blue-500" },
  { value: "bitcoin", label: "Bitcoin", color: "bg-orange-500" },
  { value: "bsc", label: "BNB Chain", color: "bg-yellow-500" },
  { value: "polygon", label: "Polygon", color: "bg-purple-500" },
  { value: "arbitrum", label: "Arbitrum", color: "bg-cyan-500" },
  { value: "base", label: "Base", color: "bg-indigo-500" },
];


export default function LiveMonitoringPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);

  const { data: monitoredWallets, isLoading, refetch } = useQuery<LiveMonitoring[]>({
    queryKey: ["/api/live-monitoring"],
    refetchInterval: 30000,
  });

  const { data: alerts } = useQuery<MonitoringAlert[]>({
    queryKey: ["/api/alerts"],
    refetchInterval: 30000,
  });

  const form = useForm<AddWalletValues>({
    resolver: zodResolver(addWalletSchema),
    defaultValues: {
      walletAddress: "",
      label: "",
      network: "ethereum",
    },
  });

  const addWalletMutation = useMutation({
    mutationFn: async (data: AddWalletValues) => {
      return apiRequest("POST", "/api/live-monitoring", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/live-monitoring"] });
      setDialogOpen(false);
      form.reset();
    },
  });

  const onSubmit = (data: AddWalletValues) => {
    addWalletMutation.mutate(data);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 -m-6 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-2">
              <Radio className="h-4 w-4 text-emerald-400 animate-pulse" />
              <span className="text-emerald-400 text-sm font-medium">Live Blockchain API</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-200 via-emerald-400 to-emerald-200 bg-clip-text text-transparent">
              Live Wallet Monitoring
            </h1>
            <p className="text-emerald-200/60">
              Real-time alerts when funds move from monitored wallets during transactions
            </p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-500 text-white" data-testid="button-add-wallet">
                <Plus className="h-4 w-4 mr-2" />
                Add Wallet
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-900 border-emerald-500/20">
              <DialogHeader>
                <DialogTitle className="text-emerald-100">Add Wallet to Monitor</DialogTitle>
                <DialogDescription className="text-emerald-200/60">
                  Get instant alerts when any funds move from this wallet
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="walletAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-emerald-200">Wallet Address</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="0x..."
                            className="bg-zinc-800 border-emerald-500/30 text-emerald-100 font-mono"
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
                    name="label"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-emerald-200">Label (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Buyer's Wallet"
                            className="bg-zinc-800 border-emerald-500/30 text-emerald-100"
                            {...field}
                            data-testid="input-wallet-label"
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
                        <FormLabel className="text-emerald-200">Network</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-zinc-800 border-emerald-500/30 text-emerald-100" data-testid="select-network">
                              <SelectValue placeholder="Select network" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-zinc-800 border-emerald-500/30">
                            {networks.map((network) => (
                              <SelectItem key={network.value} value={network.value} className="text-emerald-100">
                                <div className="flex items-center gap-2">
                                  <div className={`h-2 w-2 rounded-full ${network.color}`} />
                                  {network.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-500"
                    disabled={addWalletMutation.isPending}
                    data-testid="button-submit-wallet"
                  >
                    {addWalletMutation.isPending ? "Adding..." : "Start Monitoring"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <Card className="bg-zinc-900/80 border-emerald-500/20">
              <CardHeader className="border-b border-emerald-500/10">
                <CardTitle className="text-emerald-100 flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-emerald-500" />
                  Monitored Wallets
                </CardTitle>
                <CardDescription className="text-emerald-200/50">
                  Click a wallet to view its transaction alerts
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                {isLoading ? (
                  <div className="text-center py-8 text-emerald-200/60">Loading wallets...</div>
                ) : !monitoredWallets?.length ? (
                  <div className="text-center py-12">
                    <Eye className="h-12 w-12 text-emerald-500/30 mx-auto mb-4" />
                    <p className="text-emerald-200/60">No wallets monitored yet</p>
                    <p className="text-emerald-200/40 text-sm mt-1">Add a wallet to start receiving real-time alerts</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {monitoredWallets.map((wallet) => (
                      <div
                        key={wallet.id}
                        onClick={() => setSelectedWallet(wallet.id)}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          selectedWallet === wallet.id
                            ? "bg-emerald-500/10 border-emerald-500/50"
                            : "bg-zinc-800/50 border-emerald-500/10 hover:border-emerald-500/30"
                        }`}
                        data-testid={`wallet-item-${wallet.id}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`h-3 w-3 rounded-full ${wallet.isActive ? "bg-emerald-500 animate-pulse" : "bg-zinc-600"}`} />
                            <div>
                              <p className="text-emerald-100 font-medium">{wallet.label || "Unnamed Wallet"}</p>
                              <p className="text-emerald-200/60 text-sm font-mono">{wallet.walletAddress.slice(0, 10)}...{wallet.walletAddress.slice(-8)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-emerald-400 border-emerald-500/30">
                              {networks.find(n => n.value === wallet.network)?.label || wallet.network}
                            </Badge>
                            <Button size="icon" variant="ghost" className="text-emerald-400" data-testid={`button-toggle-${wallet.id}`}>
                              {wallet.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="bg-zinc-900/80 border-emerald-500/20">
              <CardHeader className="border-b border-emerald-500/10">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-emerald-100 flex items-center gap-2">
                    <Bell className="h-5 w-5 text-emerald-500" />
                    Live Alerts
                  </CardTitle>
                  <Button size="icon" variant="ghost" className="text-emerald-400" data-testid="button-refresh-alerts">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {(!alerts || alerts.length === 0) ? (
                      (!monitoredWallets || monitoredWallets.length === 0) ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <div className="h-16 w-16 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
                            <Bell className="h-8 w-8 text-zinc-600" />
                          </div>
                          <p className="text-zinc-400 text-sm">No alerts yet</p>
                          <p className="text-zinc-500 text-xs mt-1">Add wallets to start monitoring</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                            <CheckCircle className="h-8 w-8 text-emerald-500" />
                          </div>
                          <p className="text-emerald-400 text-sm">Monitoring active</p>
                          <p className="text-zinc-500 text-xs mt-1">No suspicious activity detected</p>
                          <p className="text-zinc-600 text-xs mt-2">Auto-refresh: 30 seconds</p>
                        </div>
                      )
                    ) : (
                      alerts.map((alert) => (
                        <div
                          key={alert.id}
                          className={`p-3 rounded-lg border ${
                            alert.isRead
                              ? "bg-zinc-800/30 border-zinc-700"
                              : "bg-red-500/10 border-red-500/30"
                          }`}
                          data-testid={`alert-item-${alert.id}`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                              alert.alertType === "outgoing" ? "bg-red-500/20" : 
                              alert.alertType === "incoming" ? "bg-green-500/20" : "bg-yellow-500/20"
                            }`}>
                              {alert.alertType === "outgoing" ? (
                                <ArrowUpRight className="h-4 w-4 text-red-400" />
                              ) : alert.alertType === "incoming" ? (
                                <ArrowDownLeft className="h-4 w-4 text-green-400" />
                              ) : (
                                <AlertTriangle className="h-4 w-4 text-yellow-400" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className={`text-sm font-medium ${
                                  alert.alertType === "outgoing" ? "text-red-400" :
                                  alert.alertType === "incoming" ? "text-green-400" : "text-yellow-400"
                                }`}>
                                  {alert.alertType === "outgoing" ? "Outgoing Transfer" :
                                   alert.alertType === "incoming" ? "Incoming Transfer" : "Large Transfer"}
                                </span>
                                {!alert.isRead && (
                                  <span className="h-2 w-2 rounded-full bg-red-500" />
                                )}
                              </div>
                              <p className="text-emerald-100 font-semibold">{alert.amount}</p>
                              <p className="text-emerald-200/60 text-xs font-mono truncate">
                                {alert.toAddress ? `To: ${alert.toAddress.slice(0, 16)}...` : 
                                 alert.fromAddress ? `From: ${alert.fromAddress.slice(0, 16)}...` : ""}
                              </p>
                              <div className="flex items-center gap-1 mt-1 text-emerald-200/40 text-xs">
                                <Clock className="h-3 w-3" />
                                {formatTime(alert.createdAt)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card className="bg-emerald-500/10 border-emerald-500/30">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <Activity className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-emerald-100 font-semibold">Webhook Status</p>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-emerald-400" />
                      <span className="text-emerald-400 text-sm">Connected & Active</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
