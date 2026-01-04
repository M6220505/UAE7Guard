import { useLocation, Link } from "wouter";
import { 
  LayoutDashboard, 
  FileText, 
  Trophy, 
  Shield,
  ShieldCheck,
  Scale,
  Lock,
  Gem,
  Radio,
  TrendingDown,
  Download,
  Brain,
  Fingerprint
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";

const mainNavItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Reports",
    url: "/reports",
    icon: FileText,
  },
  {
    title: "Due Diligence",
    url: "/due-diligence",
    icon: Gem,
  },
  {
    title: "AI Prediction",
    url: "/ai-predict",
    icon: Brain,
  },
  {
    title: "Double-Lock",
    url: "/double-lock",
    icon: Fingerprint,
  },
  {
    title: "Hybrid Verify",
    url: "/hybrid-verification",
    icon: Shield,
  },
  {
    title: "Live Monitoring",
    url: "/live-monitoring",
    icon: Radio,
  },
  {
    title: "Escrow",
    url: "/escrow",
    icon: Lock,
  },
  {
    title: "Price Slippage",
    url: "/slippage",
    icon: TrendingDown,
  },
  {
    title: "Leaderboard",
    url: "/leaderboard",
    icon: Trophy,
  },
  {
    title: "Export",
    url: "/export",
    icon: Download,
  },
];

const adminNavItems = [
  {
    title: "Verification",
    url: "/admin",
    icon: ShieldCheck,
  },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Shield className="h-7 w-7 text-primary" />
          <div>
            <span className="text-lg font-bold tracking-tight">UAE7Guard</span>
            <p className="text-xs text-muted-foreground">Sovereign Intelligence</p>
          </div>
        </Link>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location === item.url}
                    data-testid={`nav-${item.title.toLowerCase()}`}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Administration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location === item.url}
                    data-testid={`nav-${item.title.toLowerCase()}`}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs">
            <Link href="/privacy" className="flex items-center gap-1 text-muted-foreground hover:text-foreground" data-testid="link-privacy">
              <Lock className="h-3 w-3" />
              Privacy
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link href="/terms" className="flex items-center gap-1 text-muted-foreground hover:text-foreground" data-testid="link-terms">
              <Scale className="h-3 w-3" />
              Terms
            </Link>
          </div>
          <div className="text-xs text-muted-foreground">
            <p>PDPL Compliant</p>
            <p className="mt-0.5">UAE Federal Decree-Law No. 45</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
