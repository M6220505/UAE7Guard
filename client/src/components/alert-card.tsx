import { useMutation } from "@tanstack/react-query";
import { AlertTriangle, Bell, CheckCircle, X, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Alert } from "@shared/schema.ts";
import { formatDistanceToNow } from "date-fns";

interface AlertCardProps {
  alert: Alert;
}

const severityConfig = {
  high: {
    icon: AlertTriangle,
    color: "text-red-500",
    bg: "border-red-500/30 bg-red-500/5",
    badge: "bg-red-500/20 text-red-600 dark:text-red-400",
  },
  medium: {
    icon: Bell,
    color: "text-yellow-500",
    bg: "border-yellow-500/30 bg-yellow-500/5",
    badge: "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400",
  },
  low: {
    icon: Info,
    color: "text-blue-500",
    bg: "border-blue-500/30 bg-blue-500/5",
    badge: "bg-blue-500/20 text-blue-600 dark:text-blue-400",
  },
};

export function AlertCard({ alert }: AlertCardProps) {
  const config = severityConfig[alert.severity as keyof typeof severityConfig] || severityConfig.medium;
  const Icon = config.icon;

  const dismissMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("PATCH", `/api/alerts/${alert.id}`, { read: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/alerts"] });
    },
  });

  if (alert.read) return null;

  return (
    <Card className={config.bg} data-testid={`alert-card-${alert.id}`}>
      <CardContent className="flex items-start gap-4 py-4">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${config.color.replace("text-", "bg-")}/20`}>
          <Icon className={`h-5 w-5 ${config.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-semibold">{alert.title}</h4>
            <Badge className={config.badge}>
              {alert.severity}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{alert.message}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true })}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => dismissMutation.mutate()}
          disabled={dismissMutation.isPending}
          data-testid={`button-dismiss-alert-${alert.id}`}
        >
          {dismissMutation.isPending ? (
            <CheckCircle className="h-4 w-4 animate-pulse" />
          ) : (
            <X className="h-4 w-4" />
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
