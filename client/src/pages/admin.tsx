import { AdminPanel } from "@/components/admin-panel";
import { DashboardStats } from "@/components/dashboard-stats";

export default function Admin() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Verification</h1>
        <p className="text-muted-foreground">
          Review and verify submitted intelligence reports
        </p>
      </div>

      <DashboardStats />

      <AdminPanel />
    </div>
  );
}
