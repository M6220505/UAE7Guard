import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Radio, Lock, TrendingDown } from "lucide-react";
import LiveMonitoringPage from "./live-monitoring";
import EscrowPage from "./escrow";
import SlippagePage from "./slippage";

export default function Protection() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          Trading Protection
        </h1>
        <p className="text-muted-foreground mt-1">
          Real-time monitoring, escrow services, and trading protection tools
        </p>
      </div>

      <Tabs defaultValue="live-monitoring" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="live-monitoring" className="flex items-center gap-2" data-testid="tab-live-monitoring">
            <Radio className="h-4 w-4" />
            <span className="hidden sm:inline">Live Monitoring</span>
          </TabsTrigger>
          <TabsTrigger value="escrow" className="flex items-center gap-2" data-testid="tab-escrow">
            <Lock className="h-4 w-4" />
            <span className="hidden sm:inline">Escrow</span>
          </TabsTrigger>
          <TabsTrigger value="slippage" className="flex items-center gap-2" data-testid="tab-slippage">
            <TrendingDown className="h-4 w-4" />
            <span className="hidden sm:inline">Slippage</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="live-monitoring">
          <LiveMonitoringPage />
        </TabsContent>
        <TabsContent value="escrow">
          <EscrowPage />
        </TabsContent>
        <TabsContent value="slippage">
          <SlippagePage />
        </TabsContent>
      </Tabs>
    </div>
  );
}
