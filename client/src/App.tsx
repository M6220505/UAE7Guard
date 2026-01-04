import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
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
import { IOSInstallPrompt } from "@/components/ios-install-prompt";

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
            <ThemeToggle />
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
