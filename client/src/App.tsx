import { Switch, Route, useLocation } from "wouter";
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
import { LogIn, LogOut, User } from "lucide-react";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import LearningCenter from "@/pages/learning-center";
import FAQ from "@/pages/faq";
import Privacy from "@/pages/privacy";
import Terms from "@/pages/terms";
import { IOSInstallPrompt } from "@/components/ios-install-prompt";

function UserNav() {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  
  if (isLoading) {
    return <div className="h-9 w-9 animate-pulse rounded-full bg-muted" />;
  }
  
  if (!isAuthenticated) {
    return null;
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

function SimpleLayout({ children }: { children: React.ReactNode }) {
  const { isRTL } = useLanguage();
  
  return (
    <div className={`min-h-screen bg-background ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-14 items-center justify-between gap-4 px-4">
          <a href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold">U7</span>
            </div>
            <span className="font-semibold">UAE7Guard</span>
          </a>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
            <UserNav />
          </div>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}

function Router() {
  const [location] = useLocation();
  
  if (location === "/") {
    return <Home />;
  }

  const simplePages = ["/about", "/contact", "/learning-center", "/faq", "/privacy", "/terms"];
  
  if (simplePages.includes(location)) {
    return (
      <SimpleLayout>
        <Switch>
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route path="/learning-center" component={LearningCenter} />
          <Route path="/faq" component={FAQ} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/terms" component={Terms} />
        </Switch>
      </SimpleLayout>
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
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <LanguageProvider>
          <TooltipProvider>
            <Router />
            <Toaster />
            <IOSInstallPrompt />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
