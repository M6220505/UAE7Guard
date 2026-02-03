import { ThreatSearch } from "@/components/threat-search";
import { DashboardStats, UserReputationCard } from "@/components/dashboard-stats";
import { AlertsList } from "@/components/alerts-list";
import { RecentReports } from "@/components/recent-reports";
import { Leaderboard } from "@/components/leaderboard";
import { EmergencySOP } from "@/components/emergency-sop";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  Shield, 
  Activity, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Brain,
  Zap,
  Lock,
  Eye,
  ChevronRight
} from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/20 via-primary/5 to-background border p-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Security Command Center</h1>
                <p className="text-muted-foreground text-sm">
                  Real-time threat intelligence and monitoring
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <Badge variant="secondary" className="gap-1">
                <CheckCircle className="h-3 w-3 text-green-500" />
                System Secure
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Lock className="h-3 w-3" />
                AES-256
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Activity className="h-3 w-3" />
                Live Monitoring
              </Badge>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/ai-predict">
              <Button variant="outline" className="gap-2">
                <Brain className="h-4 w-4" />
                AI Analysis
              </Button>
            </Link>
            <EmergencySOP />
          </div>
        </div>
      </div>

      <DashboardStats />

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Eye className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Threat Intelligence</CardTitle>
                    <CardDescription className="text-xs">
                      Real-time address verification
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="secondary" className="gap-1">
                  <Zap className="h-3 w-3" />
                  Instant
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ThreatSearch />
            </CardContent>
          </Card>

          <AlertsList />

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-amber-500" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Top Investigators</CardTitle>
                    <CardDescription className="text-xs">
                      Community leaders in threat detection
                    </CardDescription>
                  </div>
                </div>
                <Link href="/leaderboard">
                  <Button variant="ghost" size="sm" className="gap-1">
                    View All
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <Leaderboard compact />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <UserReputationCard />
          
          <Card className="border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <Brain className="h-4 w-4 text-amber-500" />
                </div>
                <div>
                  <CardTitle className="text-lg">AI Protection</CardTitle>
                  <CardDescription className="text-xs">
                    GPT-4 powered analysis
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Use AI to predict scam risk before transacting with any wallet.
              </p>
              <Link href="/ai-predict">
                <Button className="w-full gap-2" data-testid="button-ai-predict">
                  <Brain className="h-4 w-4" />
                  Analyze Wallet
                </Button>
              </Link>
            </CardContent>
          </Card>

          <RecentReports />

          <Card className="bg-muted/30">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  <span className="text-xs font-medium">UAE7Guard</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  PDPL Compliant | VARA Guidelines
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
