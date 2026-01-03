import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, FileText, FileSpreadsheet, Shield, Eye, AlertTriangle, Calendar } from "lucide-react";
import type { ScamReport, Watchlist } from "@shared/schema";

type ExportFormat = "csv" | "json" | "pdf";

export default function Export() {
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [selectedWatchlist, setSelectedWatchlist] = useState<string[]>([]);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("csv");
  const [dateRange, setDateRange] = useState("all");

  const { data: reports = [], isLoading: reportsLoading } = useQuery<ScamReport[]>({
    queryKey: ["/api/reports"],
  });

  const { data: watchlistItems = [], isLoading: watchlistLoading } = useQuery<Watchlist[]>({
    queryKey: ["/api/watchlist"],
  });

  const filteredReports = reports.filter(report => {
    if (dateRange === "all") return true;
    const reportDate = new Date(report.createdAt);
    const now = new Date();
    if (dateRange === "7days") {
      return reportDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }
    if (dateRange === "30days") {
      return reportDate >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
    if (dateRange === "90days") {
      return reportDate >= new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    }
    return true;
  });

  const toggleReportSelection = (id: string) => {
    setSelectedReports(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const toggleWatchlistSelection = (id: string) => {
    setSelectedWatchlist(prev =>
      prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id]
    );
  };

  const selectAllReports = () => {
    if (selectedReports.length === filteredReports.length) {
      setSelectedReports([]);
    } else {
      setSelectedReports(filteredReports.map(r => r.id));
    }
  };

  const selectAllWatchlist = () => {
    if (selectedWatchlist.length === watchlistItems.length) {
      setSelectedWatchlist([]);
    } else {
      setSelectedWatchlist(watchlistItems.map(w => w.id));
    }
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(","),
      ...data.map(row => 
        headers.map(h => {
          const val = row[h];
          if (typeof val === "string" && (val.includes(",") || val.includes('"') || val.includes("\n"))) {
            return `"${val.replace(/"/g, '""')}"`;
          }
          return val ?? "";
        }).join(",")
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    downloadBlob(blob, `${filename}.csv`);
  };

  const exportToJSON = (data: any[], filename: string) => {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    downloadBlob(blob, `${filename}.json`);
  };

  const exportToPDF = (data: any[], filename: string, title: string) => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: 'Inter', sans-serif; padding: 40px; color: #1a1a1a; }
          h1 { color: #0f172a; border-bottom: 2px solid #f59e0b; padding-bottom: 10px; }
          .meta { color: #666; margin-bottom: 30px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background-color: #0f172a; color: white; }
          tr:nth-child(even) { background-color: #f9fafb; }
          .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 12px; }
          .badge-verified { background: #22c55e; color: white; }
          .badge-pending { background: #f59e0b; color: white; }
          .badge-critical { background: #ef4444; color: white; }
          .badge-high { background: #f97316; color: white; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <h1>CryptoGuard - ${title}</h1>
        <div class="meta">
          <p>Generated: ${new Date().toLocaleString()}</p>
          <p>Total Records: ${data.length}</p>
        </div>
        <table>
          <thead>
            <tr>
              ${Object.keys(data[0] || {}).map(k => `<th>${k}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${data.map(row => `
              <tr>
                ${Object.values(row).map(v => `<td>${v ?? "-"}</td>`).join("")}
              </tr>
            `).join("")}
          </tbody>
        </table>
        <div class="footer">
          <p>This report was generated by CryptoGuard - Sovereign Crypto Intelligence Platform</p>
          <p>For verification purposes only. Do not share sensitive information.</p>
        </div>
      </body>
      </html>
    `;
    
    const blob = new Blob([htmlContent], { type: "text/html" });
    downloadBlob(blob, `${filename}.html`);
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportReports = () => {
    const dataToExport = filteredReports
      .filter(r => selectedReports.includes(r.id))
      .map(r => ({
        Address: r.scammerAddress,
        Type: r.scamType,
        Status: r.status,
        Severity: r.severity,
        Description: r.description,
        "Amount Lost": r.amountLost || "N/A",
        "Reported Date": new Date(r.createdAt).toLocaleDateString(),
        "Verified Date": r.verifiedAt ? new Date(r.verifiedAt).toLocaleDateString() : "Pending"
      }));

    if (dataToExport.length === 0) return;

    const filename = `cryptoguard_scam_reports_${new Date().toISOString().split("T")[0]}`;
    
    if (exportFormat === "csv") {
      exportToCSV(dataToExport, filename);
    } else if (exportFormat === "json") {
      exportToJSON(dataToExport, filename);
    } else {
      exportToPDF(dataToExport, filename, "Scam Activity Report");
    }
  };

  const handleExportWatchlist = () => {
    const dataToExport = watchlistItems
      .filter(w => selectedWatchlist.includes(w.id))
      .map(w => ({
        Address: w.address,
        Label: w.label || "No label",
        "Added Date": new Date(w.createdAt).toLocaleDateString()
      }));

    if (dataToExport.length === 0) return;

    const filename = `cryptoguard_watchlist_${new Date().toISOString().split("T")[0]}`;
    
    if (exportFormat === "csv") {
      exportToCSV(dataToExport, filename);
    } else if (exportFormat === "json") {
      exportToJSON(dataToExport, filename);
    } else {
      exportToPDF(dataToExport, filename, "Watchlist Export");
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "destructive";
      case "high": return "destructive";
      case "medium": return "secondary";
      default: return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground" data-testid="text-export-title">Export Reports</h1>
          <p className="text-muted-foreground">Download scam activity reports and watchlist data</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={exportFormat} onValueChange={(v: ExportFormat) => setExportFormat(v)}>
            <SelectTrigger className="w-32" data-testid="select-format">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="csv">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  CSV
                </div>
              </SelectItem>
              <SelectItem value="json">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  JSON
                </div>
              </SelectItem>
              <SelectItem value="pdf">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  HTML/PDF
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="reports" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reports" className="gap-2" data-testid="tab-reports">
            <AlertTriangle className="h-4 w-4" />
            Scam Reports
          </TabsTrigger>
          <TabsTrigger value="watchlist" className="gap-2" data-testid="tab-watchlist">
            <Eye className="h-4 w-4" />
            Watchlist
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-amber-500" />
                  Scam Activity Reports
                </CardTitle>
                <CardDescription>
                  Select reports to export ({selectedReports.length} selected)
                </CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-36" data-testid="select-date-range">
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="7days">Last 7 Days</SelectItem>
                    <SelectItem value="30days">Last 30 Days</SelectItem>
                    <SelectItem value="90days">Last 90 Days</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={selectAllReports} data-testid="button-select-all-reports">
                  {selectedReports.length === filteredReports.length ? "Deselect All" : "Select All"}
                </Button>
                <Button 
                  onClick={handleExportReports} 
                  disabled={selectedReports.length === 0}
                  className="gap-2"
                  data-testid="button-export-reports"
                >
                  <Download className="h-4 w-4" />
                  Export ({selectedReports.length})
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {reportsLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading reports...</div>
              ) : filteredReports.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No reports found</div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredReports.map(report => (
                    <div 
                      key={report.id} 
                      className="flex items-center gap-3 p-3 rounded-md border hover-elevate cursor-pointer"
                      onClick={() => toggleReportSelection(report.id)}
                      data-testid={`report-row-${report.id}`}
                    >
                      <Checkbox 
                        checked={selectedReports.includes(report.id)}
                        onCheckedChange={() => toggleReportSelection(report.id)}
                        data-testid={`checkbox-report-${report.id}`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <code className="text-sm font-mono truncate max-w-xs">
                            {report.scammerAddress.slice(0, 10)}...{report.scammerAddress.slice(-8)}
                          </code>
                          <Badge variant={report.status === "verified" ? "default" : "secondary"} className="text-xs">
                            {report.status}
                          </Badge>
                          <Badge variant={getSeverityColor(report.severity)} className="text-xs">
                            {report.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate mt-1">
                          {report.scamType} - {report.description?.slice(0, 60)}...
                        </p>
                      </div>
                      <div className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="watchlist" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-amber-500" />
                  Watchlist Data
                </CardTitle>
                <CardDescription>
                  Export your monitored addresses ({selectedWatchlist.length} selected)
                </CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={selectAllWatchlist} data-testid="button-select-all-watchlist">
                  {selectedWatchlist.length === watchlistItems.length ? "Deselect All" : "Select All"}
                </Button>
                <Button 
                  onClick={handleExportWatchlist} 
                  disabled={selectedWatchlist.length === 0}
                  className="gap-2"
                  data-testid="button-export-watchlist"
                >
                  <Download className="h-4 w-4" />
                  Export ({selectedWatchlist.length})
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {watchlistLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading watchlist...</div>
              ) : watchlistItems.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No addresses in your watchlist. Add addresses from the Dashboard to monitor them.
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {watchlistItems.map(item => (
                    <div 
                      key={item.id} 
                      className="flex items-center gap-3 p-3 rounded-md border hover-elevate cursor-pointer"
                      onClick={() => toggleWatchlistSelection(item.id)}
                      data-testid={`watchlist-row-${item.id}`}
                    >
                      <Checkbox 
                        checked={selectedWatchlist.includes(item.id)}
                        onCheckedChange={() => toggleWatchlistSelection(item.id)}
                        data-testid={`checkbox-watchlist-${item.id}`}
                      />
                      <div className="flex-1 min-w-0">
                        <code className="text-sm font-mono truncate block max-w-md">
                          {item.address}
                        </code>
                        <p className="text-sm text-muted-foreground mt-1">
                          {item.label || "No label"}
                        </p>
                      </div>
                      <div className="text-xs text-muted-foreground whitespace-nowrap">
                        Added {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-amber-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-foreground">Export Security Notice</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Exported data may contain sensitive threat intelligence. Handle with care and follow your organization's data protection policies. 
                All exports are logged for audit purposes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
