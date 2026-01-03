import { useQuery } from "@tanstack/react-query";
import { Leaderboard } from "@/components/leaderboard";
import { UserReputationCard } from "@/components/dashboard-stats";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Shield, Target, TrendingUp, Award, Star, Crown, Medal } from "lucide-react";
import type { UserReputation } from "@shared/schema";

type LeaderboardEntry = UserReputation & { user?: { username: string } };

const rankConfig = {
  novice: { color: "bg-slate-500/20 text-slate-600 dark:text-slate-400", icon: Shield },
  analyst: { color: "bg-blue-500/20 text-blue-600 dark:text-blue-400", icon: Target },
  investigator: { color: "bg-purple-500/20 text-purple-600 dark:text-purple-400", icon: Award },
  sentinel: { color: "bg-amber-500/20 text-amber-600 dark:text-amber-400", icon: Crown },
};

export default function LeaderboardPage() {
  const { data: investigators = [] } = useQuery<LeaderboardEntry[]>({
    queryKey: ["/api/leaderboard"],
  });

  const totalPoints = investigators.reduce((sum, inv) => sum + inv.trustScore, 0);
  const totalVerified = investigators.reduce((sum, inv) => sum + inv.verifiedReports, 0);
  const sentinelCount = investigators.filter(inv => inv.rank.toLowerCase() === "sentinel").length;
  const topInvestigator = investigators[0];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" data-testid="text-leaderboard-title">Sentinel Leaderboard</h1>
          <p className="text-muted-foreground">
            Top investigators protecting the sovereign network
          </p>
        </div>
        <Badge variant="secondary" className="w-fit gap-2">
          <Trophy className="h-4 w-4 text-amber-500" />
          {investigators.length} Active Investigators
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-amber-500/10">
                <Trophy className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold" data-testid="text-total-points">{totalPoints.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total Trust Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-green-500/10">
                <Shield className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold" data-testid="text-total-verified">{totalVerified}</p>
                <p className="text-xs text-muted-foreground">Verified Reports</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-purple-500/10">
                <Crown className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold" data-testid="text-sentinel-count">{sentinelCount}</p>
                <p className="text-xs text-muted-foreground">Sentinel Rank</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-blue-500/10">
                <TrendingUp className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold" data-testid="text-avg-score">
                  {investigators.length > 0 
                    ? Math.round(investigators.reduce((sum, inv) => sum + inv.trustScore, 0) / investigators.length) 
                    : 0}
                </p>
                <p className="text-xs text-muted-foreground">Avg Trust Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {topInvestigator && (
        <Card className="border-amber-500/30 bg-gradient-to-r from-amber-500/5 to-transparent">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Star className="h-5 w-5 text-amber-500" />
              Top Investigator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center h-14 w-14 rounded-full bg-amber-500/20">
                <Medal className="h-7 w-7 text-amber-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-lg" data-testid="text-top-investigator">
                    {topInvestigator.user?.username || "Anonymous"}
                  </span>
                  <Badge className={rankConfig[topInvestigator.rank.toLowerCase() as keyof typeof rankConfig]?.color || rankConfig.novice.color}>
                    {topInvestigator.rank}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                  <span>{topInvestigator.trustScore.toLocaleString()} trust score</span>
                  <span>{topInvestigator.verifiedReports} verified reports</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Leaderboard />
        </div>
        <div className="space-y-6">
          <UserReputationCard />
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Rank Progression</CardTitle>
              <CardDescription>How to advance through ranks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 p-2 rounded-md bg-muted/50">
                <Shield className="h-4 w-4 text-slate-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Novice</p>
                  <p className="text-xs text-muted-foreground">0 - 99 points</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-md bg-muted/50">
                <Target className="h-4 w-4 text-blue-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Analyst</p>
                  <p className="text-xs text-muted-foreground">100 - 499 points</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-md bg-muted/50">
                <Award className="h-4 w-4 text-purple-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Investigator</p>
                  <p className="text-xs text-muted-foreground">500 - 999 points</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-md bg-muted/50">
                <Crown className="h-4 w-4 text-amber-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Sentinel</p>
                  <p className="text-xs text-muted-foreground">1000+ points</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
