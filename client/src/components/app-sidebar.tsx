import { useLocation, Link } from "wouter";
import { 
  LayoutDashboard, 
  FileText, 
  Trophy, 
  Shield,
  ShieldCheck,
  Scale,
  Lock,
  Code,
  BarChart3
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
    title: "Verification",
    url: "/verification",
    icon: Shield,
    description: "Due Diligence, AI Predict, Hybrid Verify, Double-Lock",
  },
  {
    title: "Protection",
    url: "/protection",
    icon: Lock,
    description: "Live Monitoring, Escrow, Slippage",
  },
  {
    title: "Reports & Analytics",
    url: "/reports-analytics",
    icon: BarChart3,
    description: "Reports, Analytics, Export",
  },
  {
    title: "Leaderboard",
    url: "/leaderboard",
    icon: Trophy,
  },
  {
    title: "API Docs",
    url: "/api-docs",
    icon: Code,
  },
];

const adminNavItems = [
  {
    title: "Admin Panel",
    url: "/admin",
    icon: ShieldCheck,
  },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          <img 
            src="/logo.png" 
            alt="UAE7Guard" 
            className="h-12 w-12 object-contain rounded-lg"
            style={{ mixBlendMode: 'lighten' }}
          />
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
                    data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
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
                    data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
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
