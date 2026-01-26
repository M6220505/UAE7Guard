import { useQuery } from "@tanstack/react-query";
import { FileText, CheckCircle, Clock, XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { ScamReport } from "@shared/schema.ts";
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

export function RecentReports() {
  const { data: reports, isLoading } = useQuery<ScamReport[]>({
    queryKey: ["/api/reports"],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Recent Intelligence
          </CardTitle>
          <CardDescription>Latest threat reports</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-2 w-2 rounded-full" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-3 w-48" />
                <Skeleton className="h-2 w-24" />
              </div>
              <Skeleton className="h-5 w-16" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!reports || reports.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Recent Intelligence
          </CardTitle>
          <CardDescription>Latest threat reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No reports yet</p>
            <p className="mt-1 text-xs text-muted-foreground">Be the first to submit intelligence</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Recent Intelligence
        </CardTitle>
        <CardDescription>Latest threat reports</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {reports.slice(0, 8).map((report) => {
          const config = statusConfig[report.status as keyof typeof statusConfig] || statusConfig.pending;
          const StatusIcon = config.icon;
          
          return (
            <div
              key={report.id}
              className="flex items-center gap-3 rounded-md p-2 hover-elevate"
              data-testid={`recent-report-${report.id}`}
            >
              <StatusIcon className={`h-4 w-4 shrink-0 ${config.color.split(" ")[1]}`} />
              <div className="flex-1 min-w-0">
                <p className="font-mono text-xs truncate">{report.scammerAddress}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}
                </p>
              </div>
              <Badge className={config.color}>
                {config.label}
              </Badge>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
