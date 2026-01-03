import { useQuery } from "@tanstack/react-query";
import { FileText, CheckCircle, Clock, XCircle, Filter } from "lucide-react";
import { ReportForm } from "@/components/report-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ScamReport } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

const statusConfig = {
  verified: {
    icon: CheckCircle,
    color: "bg-green-500/20 text-green-600 dark:text-green-400",
    label: "Verified",
  },
  pending: {
    icon: Clock,
    color: "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400",
    label: "Pending",
  },
  rejected: {
    icon: XCircle,
    color: "bg-red-500/20 text-red-600 dark:text-red-400",
    label: "Rejected",
  },
};

const scamTypeLabels: Record<string, string> = {
  phishing: "Phishing",
  rugpull: "Rug Pull",
  honeypot: "Honeypot",
  fake_ico: "Fake ICO",
  pump_dump: "Pump & Dump",
  other: "Other",
};

function ReportsList({ filter }: { filter: "all" | "verified" | "pending" }) {
  const { data: reports, isLoading } = useQuery<ScamReport[]>({
    queryKey: ["/api/reports"],
  });

  const filteredReports = reports?.filter((r) => {
    if (filter === "all") return true;
    return r.status === filter;
  }) || [];

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-4" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-full" />
              </div>
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (filteredReports.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <FileText className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">No reports found</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {filteredReports.map((report) => {
        const config = statusConfig[report.status as keyof typeof statusConfig] || statusConfig.pending;
        const StatusIcon = config.icon;

        return (
          <Card key={report.id} className="hover-elevate" data-testid={`report-card-${report.id}`}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <StatusIcon className={`mt-0.5 h-5 w-5 shrink-0 ${config.color.split(" ")[1]}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-sm truncate max-w-xs">
                      {report.scammerAddress}
                    </span>
                    <Badge variant="outline">
                      {scamTypeLabels[report.scamType] || report.scamType}
                    </Badge>
                    <Badge className={config.color}>
                      {config.label}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    {report.description}
                  </p>
                  <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Severity: <span className="capitalize">{report.severity}</span></span>
                    {report.amountLost && <span>Lost: {report.amountLost}</span>}
                    <span>{formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default function Reports() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Intelligence Reports</h1>
        <p className="text-muted-foreground">
          Submit and view threat intelligence reports
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <ReportForm />
        </div>

        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                All Reports
              </CardTitle>
              <CardDescription>Browse submitted intelligence reports</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList className="mb-4">
                  <TabsTrigger value="all" data-testid="tab-all-reports">All</TabsTrigger>
                  <TabsTrigger value="verified" data-testid="tab-verified-reports">Verified</TabsTrigger>
                  <TabsTrigger value="pending" data-testid="tab-pending-reports">Pending</TabsTrigger>
                </TabsList>
                <TabsContent value="all">
                  <ReportsList filter="all" />
                </TabsContent>
                <TabsContent value="verified">
                  <ReportsList filter="verified" />
                </TabsContent>
                <TabsContent value="pending">
                  <ReportsList filter="pending" />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
