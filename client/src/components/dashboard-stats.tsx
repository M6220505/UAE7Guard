import { useQuery } from "@tanstack/react-query";
import { Shield, AlertTriangle, Flag, TrendingUp, Users, FileCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface StatsData {
  totalReports: number;
  verifiedThreats: number;
  pendingReports: number;
  activeUsers: number;
  threatsNeutralized: number;
  reputationScore: number;
}

export function DashboardStats() {
  const { data: stats, isLoading } = useQuery<StatsData>({
    queryKey: ["/api/stats"],
  });

  const statCards = [
    {
      title: "Threats Neutralized",
      value: stats?.threatsNeutralized ?? 0,
      icon: Shield,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      title: "Verified Reports",
      value: stats?.verifiedThreats ?? 0,
      icon: FileCheck,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Pending Review",
      value: stats?.pendingReports ?? 0,
      icon: AlertTriangle,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
    },
    {
      title: "Total Reports",
      value: stats?.totalReports ?? 0,
      icon: Flag,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => (
        <Card key={stat.title} data-testid={`stat-card-${stat.title.toLowerCase().replace(/\s+/g, "-")}`}>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${stat.bg}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tabular-nums">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function UserReputationCard() {
  const { data: reputation, isLoading } = useQuery<{
    trustScore: number;
    rank: string;
    verifiedReports: number;
  }>({
    queryKey: ["/api/user/reputation"],
  });

  const rankColors = {
    Sentinel: "text-yellow-500",
    Investigator: "text-blue-500",
    Analyst: "text-purple-500",
    Novice: "text-gray-500",
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Your Reputation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    );
  }

  const rankColor = rankColors[reputation?.rank as keyof typeof rankColors] || rankColors.Novice;

  return (
    <Card data-testid="card-user-reputation">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Your Reputation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold tabular-nums">{reputation?.trustScore ?? 0}</span>
          <span className="text-sm text-muted-foreground">points</span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <Users className={`h-4 w-4 ${rankColor}`} />
          <span className={`font-semibold ${rankColor}`}>{reputation?.rank ?? "Novice"}</span>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          {reputation?.verifiedReports ?? 0} verified reports submitted
        </p>
      </CardContent>
    </Card>
  );
}
