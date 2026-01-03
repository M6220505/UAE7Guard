import { ThreatSearch } from "@/components/threat-search";
import { DashboardStats, UserReputationCard } from "@/components/dashboard-stats";
import { AlertsList } from "@/components/alerts-list";
import { RecentReports } from "@/components/recent-reports";
import { Leaderboard } from "@/components/leaderboard";
import { EmergencySOP } from "@/components/emergency-sop";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time threat intelligence and security monitoring
          </p>
        </div>
        <EmergencySOP />
      </div>

      <DashboardStats />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Threat Lookup
              </CardTitle>
              <CardDescription>
                Search any wallet or contract address for known threats
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ThreatSearch />
            </CardContent>
          </Card>

          <AlertsList />
        </div>

        <div className="space-y-6">
          <UserReputationCard />
          <RecentReports />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Leaderboard />
      </div>
    </div>
  );
}
