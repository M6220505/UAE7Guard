import { Leaderboard } from "@/components/leaderboard";
import { UserReputationCard } from "@/components/dashboard-stats";

export default function LeaderboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sentinel Leaderboard</h1>
        <p className="text-muted-foreground">
          Top investigators protecting the sovereign network
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Leaderboard />
        </div>
        <div>
          <UserReputationCard />
        </div>
      </div>
    </div>
  );
}
