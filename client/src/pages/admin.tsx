import { useState } from "react";
import { AdminPanel } from "@/components/admin-panel";
import { DashboardStats } from "@/components/dashboard-stats";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Shield, Lock, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const authMutation = useMutation({
    mutationFn: async (adminPassword: string) => {
      const response = await apiRequest("POST", "/api/admin/authenticate", { password: adminPassword });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        setIsAuthenticated(true);
        toast({
          title: "Access Granted",
          description: "Welcome to the Admin Control Center",
        });
      } else {
        toast({
          title: "Access Denied",
          description: "Invalid admin password",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Authentication Failed",
        description: "Unable to verify credentials",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim()) {
      authMutation.mutate(password);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Admin Access Required</CardTitle>
            <CardDescription>
              Enter the admin password to access the verification panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  data-testid="input-admin-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={authMutation.isPending || !password.trim()}
                data-testid="button-admin-login"
              >
                {authMutation.isPending ? "Verifying..." : "Access Control Panel"}
              </Button>
            </form>
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Authorized personnel only. All access attempts are logged.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Verification Center</h1>
          <p className="text-muted-foreground">
            Review and verify submitted intelligence reports
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => setIsAuthenticated(false)}
          data-testid="button-admin-logout"
        >
          <Lock className="mr-2 h-4 w-4" />
          Lock Panel
        </Button>
      </div>

      <DashboardStats />

      <AdminPanel />
    </div>
  );
}
