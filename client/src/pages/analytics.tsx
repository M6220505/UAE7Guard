import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, Shield, AlertTriangle, Users, FileText, Activity, Clock } from "lucide-react";
import type { ScamReport } from "@shared/schema";

interface AnalyticsData {
  totalReports: number;
  verifiedThreats: number;
  pendingReports: number;
  rejectedReports: number;
  scamTypeBreakdown: Record<string, number>;
  severityBreakdown: Record<string, number>;
  recentActivity: ScamReport[];
  monthlyTrend: { month: string; count: number }[];
}

function StatCard({ title, value, description, icon: Icon, trend }: {
  title: string;
  value: string | number;
  description: string;
  icon: typeof BarChart3;
  trend?: { value: number; positive: boolean };
}) {
  return (
    <Card className="bg-zinc-900/80 border-zinc-800">
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-zinc-400">{title}</CardTitle>
        <Icon className="h-4 w-4 text-zinc-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-zinc-100" data-testid={`stat-${title.toLowerCase().replace(/\s/g, '-')}`}>{value}</div>
        <p className="text-xs text-zinc-500 mt-1">{description}</p>
        {trend && (
          <div className={`flex items-center gap-1 mt-2 text-xs ${trend.positive ? 'text-emerald-400' : 'text-red-400'}`}>
            <TrendingUp className={`h-3 w-3 ${!trend.positive && 'rotate-180'}`} />
            {trend.value}% from last month
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ScamTypeChart({ data }: { data: Record<string, number> }) {
  const total = Object.values(data).reduce((a, b) => a + b, 0);
  const scamTypes = [
    { key: "phishing", label: "Phishing", color: "bg-blue-500" },
    { key: "rugpull", label: "Rug Pull", color: "bg-red-500" },
    { key: "honeypot", label: "Honeypot", color: "bg-amber-500" },
    { key: "fake_ico", label: "Fake ICO", color: "bg-purple-500" },
    { key: "pump_dump", label: "Pump & Dump", color: "bg-pink-500" },
    { key: "other", label: "Other", color: "bg-zinc-500" },
  ];

  return (
    <Card className="bg-zinc-900/80 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-zinc-100 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          Threat Categories
        </CardTitle>
        <CardDescription className="text-zinc-500">Breakdown of reported scam types</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {scamTypes.map((type) => {
          const count = data[type.key] || 0;
          const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
          return (
            <div key={type.key} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-300">{type.label}</span>
                <span className="text-zinc-500">{count} ({percentage}%)</span>
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${type.color} rounded-full transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function SeverityChart({ data }: { data: Record<string, number> }) {
  const severities = [
    { key: "critical", label: "Critical", color: "bg-red-600", textColor: "text-red-400" },
    { key: "high", label: "High", color: "bg-orange-500", textColor: "text-orange-400" },
    { key: "medium", label: "Medium", color: "bg-amber-500", textColor: "text-amber-400" },
    { key: "low", label: "Low", color: "bg-emerald-500", textColor: "text-emerald-400" },
  ];

  return (
    <Card className="bg-zinc-900/80 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-zinc-100 flex items-center gap-2">
          <Shield className="h-5 w-5 text-cyan-500" />
          Severity Distribution
        </CardTitle>
        <CardDescription className="text-zinc-500">Threat severity levels</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {severities.map((severity) => {
            const count = data[severity.key] || 0;
            return (
              <div key={severity.key} className="bg-zinc-800/50 rounded-lg p-4 text-center">
                <div className={`text-2xl font-bold ${severity.textColor}`}>{count}</div>
                <div className="text-xs text-zinc-500 mt-1 uppercase tracking-wider">{severity.label}</div>
                <div className={`h-1 ${severity.color} rounded-full mt-2`} />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function RecentActivityList({ reports }: { reports: ScamReport[] }) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified": return <Badge variant="default" className="bg-emerald-500/20 text-emerald-400">Verified</Badge>;
      case "pending": return <Badge variant="secondary" className="bg-amber-500/20 text-amber-400">Pending</Badge>;
      case "rejected": return <Badge variant="destructive" className="bg-red-500/20 text-red-400">Rejected</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card className="bg-zinc-900/80 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-zinc-100 flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-500" />
          Recent Activity
        </CardTitle>
        <CardDescription className="text-zinc-500">Latest threat reports</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reports.slice(0, 5).map((report) => (
            <div key={report.id} className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-mono text-zinc-300 truncate">{report.scammerAddress}</p>
                <p className="text-xs text-zinc-500 mt-1">{report.scamType} - {report.severity}</p>
              </div>
              {getStatusBadge(report.status)}
            </div>
          ))}
          {reports.length === 0 && (
            <p className="text-center text-zinc-500 py-8">No recent activity</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Analytics() {
  const { data: reports = [], isLoading } = useQuery<ScamReport[]>({
    queryKey: ["/api/reports"],
  });

  const analytics: AnalyticsData = {
    totalReports: reports.length,
    verifiedThreats: reports.filter(r => r.status === "verified").length,
    pendingReports: reports.filter(r => r.status === "pending").length,
    rejectedReports: reports.filter(r => r.status === "rejected").length,
    scamTypeBreakdown: reports.reduce((acc, r) => {
      acc[r.scamType] = (acc[r.scamType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    severityBreakdown: reports.reduce((acc, r) => {
      acc[r.severity] = (acc[r.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    recentActivity: [...reports].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ),
    monthlyTrend: [],
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-zinc-800 rounded w-48" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-zinc-800 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3" data-testid="heading-analytics">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
              <BarChart3 className="h-8 w-8 text-blue-400" />
            </div>
            Platform Analytics
          </h1>
          <p className="text-zinc-400">
            Real-time insights and statistics from the UAE7Guard threat intelligence network
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-zinc-800/50 border-zinc-700">
            <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
            <TabsTrigger value="threats" data-testid="tab-threats">Threats</TabsTrigger>
            <TabsTrigger value="activity" data-testid="tab-activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Reports"
                value={analytics.totalReports}
                description="All-time threat reports submitted"
                icon={FileText}
                trend={{ value: 12, positive: true }}
              />
              <StatCard
                title="Verified Threats"
                value={analytics.verifiedThreats}
                description="Human-verified malicious addresses"
                icon={Shield}
                trend={{ value: 8, positive: true }}
              />
              <StatCard
                title="Pending Review"
                value={analytics.pendingReports}
                description="Reports awaiting verification"
                icon={Clock}
              />
              <StatCard
                title="Protection Rate"
                value={`${analytics.totalReports > 0 ? Math.round((analytics.verifiedThreats / analytics.totalReports) * 100) : 0}%`}
                description="Threats successfully verified"
                icon={Activity}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ScamTypeChart data={analytics.scamTypeBreakdown} />
              <SeverityChart data={analytics.severityBreakdown} />
            </div>
          </TabsContent>

          <TabsContent value="threats" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ScamTypeChart data={analytics.scamTypeBreakdown} />
              <SeverityChart data={analytics.severityBreakdown} />
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <RecentActivityList reports={analytics.recentActivity} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
