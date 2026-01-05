import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { LogIn, LogOut, User } from "lucide-react";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import Dashboard from "@/pages/dashboard";
import Reports from "@/pages/reports";
import LeaderboardPage from "@/pages/leaderboard-page";
import Admin from "@/pages/admin";
import Privacy from "@/pages/privacy";
import Terms from "@/pages/terms";
import DueDiligence from "@/pages/due-diligence";
import LiveMonitoring from "@/pages/live-monitoring";
import Escrow from "@/pages/escrow";
import Slippage from "@/pages/slippage";
import Export from "@/pages/export";
import AiPredict from "@/pages/ai-predict";
import DoubleLock from "@/pages/double-lock";
import HybridVerification from "@/pages/hybrid-verification";
import Analytics from "@/pages/analytics";
import ApiDocs from "@/pages/api-docs";
import { IOSInstallPrompt } from "@/components/ios-install-prompt";

function UserNav() {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  
  if (isLoading) {
    return <div className="h-9 w-9 animate-pulse rounded-full bg-muted" />;
  }
  
  if (!isAuthenticated) {
    return (
      <Button variant="outline" size="sm" asChild data-testid="button-login">
        <a href="/login">
          <LogIn className="h-4 w-4 mr-2" />
          Sign In
        </a>
      </Button>
    );
  }
  
  const initials = user?.firstName && user?.lastName 
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : user?.email?.[0]?.toUpperCase() || "U";
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full" data-testid="button-user-menu">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user?.profileImageUrl || undefined} alt={user?.firstName || "User"} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center gap-2 p-2">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium" data-testid="text-user-name">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-muted-foreground" data-testid="text-user-email">
              {user?.email}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => logout()} data-testid="button-logout">
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1">
          <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-md">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <UserNav />
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

function Router() {
  const [location] = useLocation();
  
  // Home page has its own layout
  if (location === "/") {
    return <Home />;
  }
  
  // Auth pages have their own layout
  if (location === "/login") {
    return <Login />;
  }
  if (location === "/signup") {
    return <Signup />;
  }

  // All other pages use dashboard layout
  return (
    <DashboardLayout>
      <Switch>
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/reports" component={Reports} />
        <Route path="/due-diligence" component={DueDiligence} />
        <Route path="/live-monitoring" component={LiveMonitoring} />
        <Route path="/escrow" component={Escrow} />
        <Route path="/slippage" component={Slippage} />
        <Route path="/export" component={Export} />
        <Route path="/ai-predict" component={AiPredict} />
        <Route path="/double-lock" component={DoubleLock} />
        <Route path="/hybrid-verification" component={HybridVerification} />
        <Route path="/analytics" component={Analytics} />
        <Route path="/api-docs" component={ApiDocs} />
        <Route path="/leaderboard" component={LeaderboardPage} />
        <Route path="/admin" component={Admin} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/terms" component={Terms} />
        <Route component={NotFound} />
      </Switch>
    </DashboardLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Router />
          <Toaster />
          <IOSInstallPrompt />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
