import { useQuery } from "@tanstack/react-query";
import { Trophy, Star, Shield, Award, Medal } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import type { UserReputation, User } from "@shared/schema.ts";

interface LeaderboardEntry extends UserReputation {
  user?: Pick<User, "username">;
}

const rankConfig = {
  Sentinel: { icon: Trophy, color: "text-yellow-500", bg: "bg-yellow-500/20", badge: "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400" },
  Investigator: { icon: Shield, color: "text-blue-500", bg: "bg-blue-500/20", badge: "bg-blue-500/20 text-blue-600 dark:text-blue-400" },
  Analyst: { icon: Award, color: "text-purple-500", bg: "bg-purple-500/20", badge: "bg-purple-500/20 text-purple-600 dark:text-purple-400" },
  Novice: { icon: Medal, color: "text-gray-500", bg: "bg-gray-500/20", badge: "bg-gray-500/20 text-gray-600 dark:text-gray-400" },
};

interface LeaderboardProps {
  compact?: boolean;
}

export function Leaderboard({ compact = false }: LeaderboardProps) {
  const { data: leaderboard, isLoading } = useQuery<LeaderboardEntry[]>({
    queryKey: ["/api/leaderboard"],
  });
  
  const displayCount = compact ? 5 : 10;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Top Sentinels
          </CardTitle>
          <CardDescription>Top investigators protecting the network</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-2 w-full" />
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!leaderboard || leaderboard.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Top Sentinels
          </CardTitle>
          <CardDescription>Top investigators protecting the network</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Star className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No investigators yet</p>
            <p className="mt-1 text-xs text-muted-foreground">Submit verified reports to climb the ranks</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const maxScore = Math.max(...leaderboard.map(e => e.trustScore), 100);

  if (compact) {
    return (
      <div className="space-y-3">
        {leaderboard.slice(0, displayCount).map((entry, index) => {
          const config = rankConfig[entry.rank as keyof typeof rankConfig] || rankConfig.Novice;
          const RankIcon = config.icon;
          
          return (
            <div
              key={entry.id}
              className="flex items-center gap-3 rounded-md p-2 hover-elevate"
              data-testid={`leaderboard-entry-${index}`}
            >
              <div className="flex h-6 w-6 items-center justify-center text-sm font-bold text-muted-foreground">
                {index + 1}
              </div>
              <Avatar className="h-8 w-8">
                <AvatarFallback className={config.bg}>
                  <RankIcon className={`h-3 w-3 ${config.color}`} />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <span className="font-medium text-sm truncate block">
                  {entry.user?.username || "Anonymous"}
                </span>
              </div>
              <Badge className={`${config.badge} text-xs`}>
                {entry.trustScore}
              </Badge>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Top Sentinels
        </CardTitle>
        <CardDescription>Top investigators protecting the network</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {leaderboard.slice(0, displayCount).map((entry, index) => {
          const config = rankConfig[entry.rank as keyof typeof rankConfig] || rankConfig.Novice;
          const RankIcon = config.icon;
          
          return (
            <div
              key={entry.id}
              className="flex items-center gap-4 rounded-md p-2 transition-colors hover-elevate"
              data-testid={`leaderboard-entry-${index}`}
            >
              <div className="flex h-8 w-8 items-center justify-center text-sm font-bold text-muted-foreground">
                {index + 1}
              </div>
              <Avatar>
                <AvatarFallback className={config.bg}>
                  <RankIcon className={`h-4 w-4 ${config.color}`} />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium truncate">
                    {entry.user?.username || "Anonymous"}
                  </span>
                  <Badge className={config.badge}>
                    {entry.rank}
                  </Badge>
                </div>
                <Progress value={(entry.trustScore / maxScore) * 100} className="mt-1 h-1.5" />
              </div>
              <div className="text-right">
                <div className="text-lg font-bold tabular-nums">{entry.trustScore}</div>
                <div className="text-xs text-muted-foreground">{entry.verifiedReports} verified</div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
