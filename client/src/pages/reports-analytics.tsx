import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, BarChart3, Download } from "lucide-react";
import Reports from "./reports";
import Analytics from "./analytics";
import ExportPage from "./export";

export default function ReportsAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <FileText className="h-8 w-8 text-primary" />
          Reports & Analytics
        </h1>
        <p className="text-muted-foreground mt-1">
          View reports, analyze data, and export information
        </p>
      </div>

      <Tabs defaultValue="reports" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="reports" className="flex items-center gap-2" data-testid="tab-reports">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Reports</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2" data-testid="tab-analytics">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="export" className="flex items-center gap-2" data-testid="tab-export">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reports">
          <Reports />
        </TabsContent>
        <TabsContent value="analytics">
          <Analytics />
        </TabsContent>
        <TabsContent value="export">
          <ExportPage />
        </TabsContent>
      </Tabs>
    </div>
  );
}
