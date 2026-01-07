import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Brain, FileText, Fingerprint } from "lucide-react";
import DueDiligence from "./due-diligence";
import AiPredict from "./ai-predict";
import HybridVerification from "./hybrid-verification";
import DoubleLock from "./double-lock";

export default function Verification() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          Verification Tools
        </h1>
        <p className="text-muted-foreground mt-1">
          Comprehensive verification and risk assessment tools
        </p>
      </div>

      <Tabs defaultValue="due-diligence" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="due-diligence" className="flex items-center gap-2" data-testid="tab-due-diligence">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Due Diligence</span>
          </TabsTrigger>
          <TabsTrigger value="ai-predict" className="flex items-center gap-2" data-testid="tab-ai-predict">
            <Brain className="h-4 w-4" />
            <span className="hidden sm:inline">AI Predict</span>
          </TabsTrigger>
          <TabsTrigger value="hybrid-verify" className="flex items-center gap-2" data-testid="tab-hybrid-verify">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Hybrid Verify</span>
          </TabsTrigger>
          <TabsTrigger value="double-lock" className="flex items-center gap-2" data-testid="tab-double-lock">
            <Fingerprint className="h-4 w-4" />
            <span className="hidden sm:inline">Double-Lock</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="due-diligence">
          <DueDiligence />
        </TabsContent>
        <TabsContent value="ai-predict">
          <AiPredict />
        </TabsContent>
        <TabsContent value="hybrid-verify">
          <HybridVerification />
        </TabsContent>
        <TabsContent value="double-lock">
          <DoubleLock />
        </TabsContent>
      </Tabs>
    </div>
  );
}
