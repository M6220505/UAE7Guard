import { Link, useLocation } from "wouter";
import { Home, Shield, Search, BookOpen, User } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  icon: React.ElementType;
  labelEn: string;
  labelAr: string;
}

const navItems: NavItem[] = [
  { href: "/", icon: Home, labelEn: "Home", labelAr: "الرئيسية" },
  { href: "/dashboard", icon: Shield, labelEn: "Dashboard", labelAr: "لوحة التحكم" },
  { href: "/verification", icon: Search, labelEn: "Verify", labelAr: "تحقق" },
  { href: "/learning-center", icon: BookOpen, labelEn: "Learn", labelAr: "تعلم" },
  { href: "/pricing", icon: User, labelEn: "Account", labelAr: "الحساب" },
];

export function MobileBottomNav() {
  const [location] = useLocation();
  const { language } = useLanguage();
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t md:hidden safe-area-pb">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = location === item.href || 
            (item.href !== "/" && location.startsWith(item.href));
          const Icon = item.icon;
          
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-[64px]",
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                )}
                data-testid={`nav-${item.labelEn.toLowerCase()}`}
              >
                <Icon className={cn("h-5 w-5", isActive && "text-primary")} />
                <span className="text-xs font-medium">
                  {language === "ar" ? item.labelAr : item.labelEn}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
