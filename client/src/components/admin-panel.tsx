import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Check, X, Clock, ExternalLink, Loader2, ShieldCheck, ShieldX } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { ScamReport } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

const scamTypeLabels: Record<string, string> = {
  phishing: "Phishing",
  rugpull: "Rug Pull",
  honeypot: "Honeypot",
  fake_ico: "Fake ICO",
  pump_dump: "Pump & Dump",
  other: "Other",
};

const severityConfig = {
  critical: { color: "bg-red-500/20 text-red-600 dark:text-red-400" },
  high: { color: "bg-orange-500/20 text-orange-600 dark:text-orange-400" },
  medium: { color: "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400" },
  low: { color: "bg-blue-500/20 text-blue-600 dark:text-blue-400" },
};

export function AdminPanel() {
  const { toast } = useToast();
  const [selectedReport, setSelectedReport] = useState<ScamReport | null>(null);
  const [adminNotes, setAdminNotes] = useState("");

  const { data: pendingReports, isLoading } = useQuery<ScamReport[]>({
    queryKey: ["/api/admin/pending-reports"],
  });

  const verifyMutation = useMutation({
    mutationFn: async ({ reportId, action }: { reportId: string; action: "verify" | "reject" }) => {
      await apiRequest("POST", `/api/admin/reports/${reportId}/${action}`, {
        notes: adminNotes,
      });
    },
    onSuccess: (_, variables) => {
      toast({
        title: variables.action === "verify" ? "Report Verified" : "Report Rejected",
        description: `The report has been ${variables.action === "verify" ? "verified and added to blacklist" : "rejected"}.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pending-reports"] });
      queryClient.invalidateQueries({ queryKey: ["/api/reports"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      setSelectedReport(null);
      setAdminNotes("");
    },
    onError: (error: Error) => {
      toast({
        title: "Action Failed",
        description: error.message || "Failed to process report.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pending Verification</CardTitle>
          <CardDescription>Reports awaiting admin review</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg border p-4">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!pendingReports || pendingReports.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Pending Verification
          </CardTitle>
          <CardDescription>Reports awaiting admin review</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20">
              <ShieldCheck className="h-6 w-6 text-green-500" />
            </div>
            <p className="text-sm font-medium">All Clear</p>
            <p className="mt-1 text-xs text-muted-foreground">No pending reports to review</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Pending Verification
          </CardTitle>
          <CardDescription>{pendingReports.length} reports awaiting review</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {pendingReports.map((report) => {
            const sevConfig = severityConfig[report.severity as keyof typeof severityConfig] || severityConfig.medium;
            
            return (
              <div
                key={report.id}
                className={`cursor-pointer rounded-lg border p-4 transition-all hover-elevate ${
                  selectedReport?.id === report.id ? "border-primary bg-accent/50" : ""
                }`}
                onClick={() => setSelectedReport(report)}
                data-testid={`report-item-${report.id}`}
              >
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div className="font-mono text-sm truncate max-w-xs">
                    {report.scammerAddress}
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline">
                      {scamTypeLabels[report.scamType] || report.scamType}
                    </Badge>
                    <Badge className={sevConfig.color}>
                      {report.severity}
                    </Badge>
                  </div>
                </div>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                  {report.description}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Submitted {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}
                </p>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Review Panel</CardTitle>
          <CardDescription>
            {selectedReport ? "Review and verify report" : "Select a report to review"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedReport ? (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Scammer Address
                </label>
                <p className="mt-1 font-mono text-sm break-all">{selectedReport.scammerAddress}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Type
                  </label>
                  <p className="mt-1 text-sm">{scamTypeLabels[selectedReport.scamType] || selectedReport.scamType}</p>
                </div>
                <div>
                  <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Severity
                  </label>
                  <p className="mt-1 text-sm capitalize">{selectedReport.severity}</p>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Description
                </label>
                <p className="mt-1 text-sm text-muted-foreground">{selectedReport.description}</p>
              </div>

              {selectedReport.evidenceUrl && (
                <div>
                  <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Evidence
                  </label>
                  <a
                    href={selectedReport.evidenceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    View Evidence <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}

              {selectedReport.amountLost && (
                <div>
                  <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Amount Lost
                  </label>
                  <p className="mt-1 text-sm text-red-500">{selectedReport.amountLost}</p>
                </div>
              )}

              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Admin Notes
                </label>
                <Textarea
                  placeholder="Add verification notes..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="mt-1.5 resize-none"
                  data-testid="textarea-admin-notes"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={() => verifyMutation.mutate({ reportId: selectedReport.id, action: "verify" })}
                  disabled={verifyMutation.isPending}
                  data-testid="button-verify-report"
                >
                  {verifyMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="mr-2 h-4 w-4" />
                  )}
                  Verify
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => verifyMutation.mutate({ reportId: selectedReport.id, action: "reject" })}
                  disabled={verifyMutation.isPending}
                  data-testid="button-reject-report"
                >
                  {verifyMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <X className="mr-2 h-4 w-4" />
                  )}
                  Reject
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ShieldX className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-sm text-muted-foreground">
                Select a report from the list to review
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
