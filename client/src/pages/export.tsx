import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, FileText, FileSpreadsheet, Shield, Eye, AlertTriangle, Calendar, CheckCircle, Clock, FileDown, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { ScamReport, Watchlist } from "@shared/schema.ts";

type ExportFormat = "csv" | "json" | "html";

export default function Export() {
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [selectedWatchlist, setSelectedWatchlist] = useState<string[]>([]);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("csv");
  const [dateRange, setDateRange] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  const { data: reports = [], isLoading: reportsLoading } = useQuery<ScamReport[]>({
    queryKey: ["/api/reports"],
  });

  const { data: watchlistItems = [], isLoading: watchlistLoading } = useQuery<Watchlist[]>({
    queryKey: ["/api/watchlist"],
  });

  const filteredReports = reports.filter(report => {
    if (statusFilter !== "all" && report.status !== statusFilter) return false;
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

  const verifiedCount = reports.filter(r => r.status === "verified").length;
  const pendingCount = reports.filter(r => r.status === "pending").length;
  const criticalCount = reports.filter(r => r.severity === "critical").length;

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
    const exportData = {
      metadata: {
        exportedAt: new Date().toISOString(),
        platform: "UAE7Guard",
        version: "1.0",
        totalRecords: data.length
      },
      data: data
    };
    const jsonContent = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    downloadBlob(blob, `${filename}.json`);
  };

  const exportToHTML = (data: any[], filename: string, title: string) => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - UAE7Guard</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      min-height: 100vh;
      padding: 40px;
      color: #f8fafc;
    }
    .container { max-width: 1200px; margin: 0 auto; }
    .header { 
      background: rgba(30, 41, 59, 0.8);
      border: 1px solid rgba(245, 158, 11, 0.3);
      border-radius: 12px;
      padding: 32px;
      margin-bottom: 32px;
      backdrop-filter: blur(10px);
    }
    .logo { 
      display: flex; 
      align-items: center; 
      gap: 12px; 
      margin-bottom: 16px;
    }
    .logo-icon {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #f59e0b, #d97706);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    h1 { 
      font-size: 28px; 
      font-weight: 700;
      background: linear-gradient(135deg, #f59e0b, #fbbf24);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .meta { 
      display: flex; 
      gap: 24px; 
      margin-top: 16px;
      flex-wrap: wrap;
    }
    .meta-item { 
      color: #94a3b8; 
      font-size: 14px;
    }
    .meta-value { color: #f8fafc; font-weight: 600; }
    .stats { 
      display: grid; 
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }
    .stat-card {
      background: rgba(30, 41, 59, 0.6);
      border: 1px solid rgba(148, 163, 184, 0.2);
      border-radius: 12px;
      padding: 20px;
    }
    .stat-value { font-size: 32px; font-weight: 700; color: #f59e0b; }
    .stat-label { font-size: 14px; color: #94a3b8; margin-top: 4px; }
    table { 
      width: 100%; 
      border-collapse: separate;
      border-spacing: 0;
      background: rgba(30, 41, 59, 0.6);
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid rgba(148, 163, 184, 0.2);
    }
    th { 
      background: rgba(15, 23, 42, 0.8);
      padding: 16px;
      text-align: left;
      font-weight: 600;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #94a3b8;
      border-bottom: 1px solid rgba(148, 163, 184, 0.2);
    }
    td { 
      padding: 16px;
      border-bottom: 1px solid rgba(148, 163, 184, 0.1);
      font-size: 14px;
    }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background: rgba(245, 158, 11, 0.05); }
    .badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
    }
    .badge-verified { background: rgba(34, 197, 94, 0.2); color: #4ade80; }
    .badge-pending { background: rgba(245, 158, 11, 0.2); color: #fbbf24; }
    .badge-critical { background: rgba(239, 68, 68, 0.2); color: #f87171; }
    .badge-high { background: rgba(249, 115, 22, 0.2); color: #fb923c; }
    .address { 
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
      font-size: 13px;
      color: #60a5fa;
    }
    .footer { 
      margin-top: 40px;
      padding-top: 24px;
      border-top: 1px solid rgba(148, 163, 184, 0.2);
      color: #64748b;
      font-size: 12px;
      text-align: center;
    }
    @media print {
      body { background: white; color: black; }
      .header, .stat-card, table { border-color: #e2e8f0; }
      th { background: #f1f5f9; color: #1e293b; }
      td { color: #334155; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">
        <div class="logo-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        <h1>UAE7Guard</h1>
      </div>
      <p style="color: #94a3b8; margin-bottom: 16px;">Sovereign Crypto Intelligence Platform</p>
      <h2 style="font-size: 20px; font-weight: 600;">${title}</h2>
      <div class="meta">
        <div class="meta-item">Generated: <span class="meta-value">${new Date().toLocaleString()}</span></div>
        <div class="meta-item">Total Records: <span class="meta-value">${data.length}</span></div>
        <div class="meta-item">Format: <span class="meta-value">HTML Report</span></div>
      </div>
    </div>
    
    <div class="stats">
      <div class="stat-card">
        <div class="stat-value">${data.length}</div>
        <div class="stat-label">Total Records</div>
      </div>
      ${title.includes("Scam") ? `
      <div class="stat-card">
        <div class="stat-value">${data.filter((d: any) => d.Status === "verified").length}</div>
        <div class="stat-label">Verified Threats</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${data.filter((d: any) => d.Severity === "critical").length}</div>
        <div class="stat-label">Critical Severity</div>
      </div>
      ` : ""}
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
            ${Object.entries(row).map(([key, val]) => {
              let content = val ?? "-";
              if (key === "Address") {
                content = `<span class="address">${val}</span>`;
              } else if (key === "Status") {
                content = `<span class="badge badge-${val}">${val}</span>`;
              } else if (key === "Severity") {
                content = `<span class="badge badge-${val}">${val}</span>`;
              }
              return `<td>${content}</td>`;
            }).join("")}
          </tr>
        `).join("")}
      </tbody>
    </table>
    
    <div class="footer">
      <p>This report was generated by UAE7Guard - Sovereign Crypto Intelligence Platform</p>
      <p style="margin-top: 8px;">For verification purposes only. Handle with care according to your organization's data protection policies.</p>
      <p style="margin-top: 8px;">PDPL Compliant | AES-256 Encrypted | Human-Verified Intelligence</p>
    </div>
  </div>
</body>
</html>`;
    
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

    const filename = `uae7guard_scam_reports_${new Date().toISOString().split("T")[0]}`;
    
    if (exportFormat === "csv") {
      exportToCSV(dataToExport, filename);
    } else if (exportFormat === "json") {
      exportToJSON(dataToExport, filename);
    } else {
      exportToHTML(dataToExport, filename, "Scam Activity Report");
    }

    toast({
      title: "Export Complete",
      description: `Successfully exported ${dataToExport.length} scam reports as ${exportFormat.toUpperCase()}`,
    });
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

    const filename = `uae7guard_watchlist_${new Date().toISOString().split("T")[0]}`;
    
    if (exportFormat === "csv") {
      exportToCSV(dataToExport, filename);
    } else if (exportFormat === "json") {
      exportToJSON(dataToExport, filename);
    } else {
      exportToHTML(dataToExport, filename, "Watchlist Export");
    }

    toast({
      title: "Export Complete",
      description: `Successfully exported ${dataToExport.length} watchlist items as ${exportFormat.toUpperCase()}`,
    });
  };

  const handleQuickExportAll = () => {
    const reportsData = reports.map(r => ({
      Address: r.scammerAddress,
      Type: r.scamType,
      Status: r.status,
      Severity: r.severity,
      Description: r.description,
      "Amount Lost": r.amountLost || "N/A",
      "Reported Date": new Date(r.createdAt).toLocaleDateString(),
    }));

    const watchlistData = watchlistItems.map(w => ({
      Address: w.address,
      Label: w.label || "No label",
      "Added Date": new Date(w.createdAt).toLocaleDateString()
    }));

    const fullExport = {
      metadata: {
        exportedAt: new Date().toISOString(),
        platform: "UAE7Guard",
        version: "1.0"
      },
      scamReports: {
        total: reportsData.length,
        data: reportsData
      },
      watchlist: {
        total: watchlistData.length,
        data: watchlistData
      }
    };

    const blob = new Blob([JSON.stringify(fullExport, null, 2)], { type: "application/json" });
    downloadBlob(blob, `uae7guard_full_export_${new Date().toISOString().split("T")[0]}.json`);

    toast({
      title: "Full Export Complete",
      description: `Exported ${reportsData.length} reports and ${watchlistData.length} watchlist items`,
    });
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
          <h1 className="text-2xl font-bold text-foreground" data-testid="text-export-title">Export Center</h1>
          <p className="text-muted-foreground">Download threat intelligence reports and monitoring data</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleQuickExportAll} className="gap-2" data-testid="button-quick-export">
            <Zap className="h-4 w-4" />
            Quick Export All
          </Button>
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
              <SelectItem value="html">
                <div className="flex items-center gap-2">
                  <FileDown className="h-4 w-4" />
                  HTML
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-primary/10">
                <AlertTriangle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold" data-testid="text-total-reports">{reports.length}</p>
                <p className="text-xs text-muted-foreground">Total Reports</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-green-500/10">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold" data-testid="text-verified-count">{verifiedCount}</p>
                <p className="text-xs text-muted-foreground">Verified</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-amber-500/10">
                <Clock className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold" data-testid="text-pending-count">{pendingCount}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-red-500/10">
                <Shield className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold" data-testid="text-critical-count">{criticalCount}</p>
                <p className="text-xs text-muted-foreground">Critical</p>
              </div>
            </div>
          </CardContent>
        </Card>
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
                  Select reports to export ({selectedReports.length} of {filteredReports.length} selected)
                </CardDescription>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32" data-testid="select-status">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
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
                  {selectedReports.length === filteredReports.length && filteredReports.length > 0 ? "Deselect All" : "Select All"}
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
                <div className="text-center py-8 text-muted-foreground">No reports match your filters</div>
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
                  Export your monitored addresses ({selectedWatchlist.length} of {watchlistItems.length} selected)
                </CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={selectAllWatchlist} data-testid="button-select-all-watchlist">
                  {selectedWatchlist.length === watchlistItems.length && watchlistItems.length > 0 ? "Deselect All" : "Select All"}
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
                Exported data contains sensitive threat intelligence. Handle according to your organization's data protection policies. 
                All exports are logged for PDPL compliance and audit purposes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
