import { Switch, Route, useLocation, Redirect, Link } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageProvider, useLanguage } from "@/contexts/language-context";
import { LanguageToggle } from "@/components/language-toggle";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { LogOut, Trash2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import LandingPage from "@/pages/landing";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import LearningCenter from "@/pages/learning-center";
import FAQ from "@/pages/faq";
import Privacy from "@/pages/privacy";
import Terms from "@/pages/terms";
import Dashboard from "@/pages/dashboard";
import Admin from "@/pages/admin";
import Leaderboard from "@/pages/leaderboard-page";
import ApiDocs from "@/pages/api-docs";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import ForgotPassword from "@/pages/forgot-password";
import ResetPassword from "@/pages/reset-password";
import Verification from "@/pages/verification";
import Protection from "@/pages/protection";
import ReportsAnalytics from "@/pages/reports-analytics";
import Pricing from "@/pages/pricing";
import { IOSInstallPrompt } from "@/components/ios-install-prompt";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { ErrorBoundary } from "@/components/error-boundary";
import { AppLoader } from "@/components/app-loader";
import { OfflineIndicator } from "@/components/offline-indicator";

const legacyRedirects: Record<string, string> = {
  "/due-diligence": "/verification?tab=due-diligence",
  "/ai-predict": "/verification?tab=ai-predict",
  "/hybrid-verification": "/verification?tab=hybrid-verify",
  "/double-lock": "/verification?tab=double-lock",
  "/live-monitoring": "/protection?tab=live-monitoring",
  "/escrow": "/protection?tab=escrow",
  "/slippage": "/protection?tab=slippage",
  "/reports": "/reports-analytics?tab=reports",
  "/analytics": "/reports-analytics?tab=analytics",
  "/export": "/reports-analytics?tab=export",
};

function UserNav() {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  if (isLoading) {
    return <div className="h-9 w-9 animate-pulse rounded-full bg-muted" />;
  }

  if (!isAuthenticated) {
    return null;
  }

  const initials = user?.firstName && user?.lastName
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : user?.email?.[0]?.toUpperCase() || "U";

  const handleDeleteAccount = async () => {
    try {
      const response = await apiRequest("POST", "/api/auth/delete-account", {});
      const data = await response.json();

      if (data.success) {
        toast({
          title: "Account Deleted",
          description: "Your account has been permanently deleted.",
        });
        queryClient.invalidateQueries();
        setLocation("/");
      } else {
        throw new Error(data.error || "Failed to delete account");
      }
    } catch (error: any) {
      toast({
        title: "Deletion Failed",
        description: error.message || "Could not delete account",
        variant: "destructive",
      });
    }
  };

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
        <DropdownMenuSeparator />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive" data-testid="button-delete-account">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Account
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete Account
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SimpleLayout({ children }: { children: React.ReactNode }) {
  const { isRTL } = useLanguage();
  
  return (
    <div className={`min-h-screen bg-background ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md safe-area-pt">
        <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl overflow-hidden bg-[#1a1f2e] flex items-center justify-center flex-shrink-0">
              <img
                src="/logo.png"
                alt="UAE7Guard"
                className="h-full w-full object-cover"
              />
            </div>
            <span className="font-bold text-lg">UAE7Guard</span>
          </Link>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
            <UserNav />
          </div>
        </div>
      </header>
      <main className="flex-1 pb-24">
        {children}
      </main>
      <MobileBottomNav />
    </div>
  );
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const { language } = useLanguage();
  
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center p-4">
        <div className="text-center max-w-md space-y-4">
          <h2 className="text-2xl font-bold">
            {language === "en" ? "Login Required" : "تسجيل الدخول مطلوب"}
          </h2>
          <p className="text-muted-foreground">
            {language === "en" 
              ? "You need to login to access this feature. Please login or create an account to continue."
              : "يجب عليك تسجيل الدخول للوصول إلى هذه الميزة. يرجى تسجيل الدخول أو إنشاء حساب للمتابعة."}
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Link href="/login">
              <Button data-testid="button-login-required">
                {language === "en" ? "Login" : "تسجيل الدخول"}
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="outline" data-testid="button-signup-required">
                {language === "en" ? "Create Account" : "إنشاء حساب"}
              </Button>
            </Link>
          </div>
          <Link href="/" className="block text-sm text-muted-foreground hover:text-foreground">
            {language === "en" ? "← Back to Home" : "→ العودة للرئيسية"}
          </Link>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
}

function SidebarLayout({ children }: { children: React.ReactNode }) {
  const { isRTL } = useLanguage();
  
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };
  
  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className={`flex h-screen w-full ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1">
          <header className="flex h-14 items-center justify-between gap-4 border-b px-4">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <div className="flex items-center gap-2">
              <LanguageToggle />
              <ThemeToggle />
              <UserNav />
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

function Router() {
  const [location] = useLocation();

  if (location === "/") {
    return <Home />;
  }

  if (legacyRedirects[location]) {
    return <Redirect to={legacyRedirects[location]} />;
  }

  const simplePages = ["/about", "/contact", "/learning-center", "/faq", "/privacy", "/terms", "/login", "/signup", "/forgot-password", "/reset-password", "/pricing"];
  
  if (simplePages.includes(location)) {
    return (
      <SimpleLayout>
        <Switch>
          <Route path="/" component={LandingPage} />
          <Route path="/home" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route path="/learning-center" component={LearningCenter} />
          <Route path="/faq" component={FAQ} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/terms" component={Terms} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route path="/forgot-password" component={ForgotPassword} />
          <Route path="/reset-password" component={ResetPassword} />
          <Route path="/pricing" component={Pricing} />
        </Switch>
      </SimpleLayout>
    );
  }

  const sidebarPages = [
    "/dashboard", "/admin", "/leaderboard", "/api-docs",
    "/verification", "/protection", "/reports-analytics"
  ];
  
  if (sidebarPages.some(page => location.startsWith(page))) {
    return (
      <RequireAuth>
        <SidebarLayout>
          <Switch>
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/admin" component={Admin} />
            <Route path="/leaderboard" component={Leaderboard} />
            <Route path="/api-docs" component={ApiDocs} />
            <Route path="/verification" component={Verification} />
            <Route path="/protection" component={Protection} />
            <Route path="/reports-analytics" component={ReportsAnalytics} />
          </Switch>
        </SidebarLayout>
      </RequireAuth>
    );
  }

  return (
    <SimpleLayout>
      <NotFound />
    </SimpleLayout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AppLoader minLoadTime={800}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider defaultTheme="dark">
            <LanguageProvider>
              <TooltipProvider>
                <Router />
                <Toaster />
                <IOSInstallPrompt />
                <OfflineIndicator />
              </TooltipProvider>
            </LanguageProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </AppLoader>
    </ErrorBoundary>
  );
}

export default App;
