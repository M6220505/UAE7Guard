import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Shield, Lock, Eye, CheckCircle, FileCheck, ChevronRight, Zap, BookOpen, HelpCircle, Mail, Users, Home as HomeIcon, FileText, LogIn, UserPlus, LayoutDashboard, Menu, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThreatSearch } from "@/components/threat-search";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/contexts/language-context";
import { AnimatedStats } from "@/components/animated-stats";
import { DemoWallets } from "@/components/demo-wallets";
import { InstallPrompt } from "@/components/install-prompt";
import { useAuth } from "@/hooks/use-auth";

export default function Home() {
  const { t, language, isRTL } = useLanguage();
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sidebarItems = [
    { href: "/", label: language === "en" ? "Home" : "الرئيسية", icon: HomeIcon },
    { href: "/about", label: t.aboutUs, icon: Shield },
    { href: "/learning-center", label: t.learningCenter, icon: BookOpen },
    { href: "/pricing", label: language === "en" ? "Pricing" : "الأسعار", icon: CreditCard },
    { href: "/faq", label: t.faq, icon: HelpCircle },
    { href: "/contact", label: t.contactUs, icon: Mail },
    { href: "/privacy", label: t.privacy, icon: FileText },
    { href: "/terms", label: t.terms, icon: FileText },
  ];

  const scrollToCheckTool = () => {
    const input = document.getElementById('wallet-address-input');
    const section = document.getElementById('check-tool');
    
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    // Focus input after scroll animation
    setTimeout(() => {
      if (input) {
        input.focus();
        // Add highlight effect
        input.classList.add('ring-2', 'ring-primary', 'ring-offset-2');
        setTimeout(() => {
          input.classList.remove('ring-2', 'ring-primary', 'ring-offset-2');
        }, 2000);
      }
    }, 500);
  };

  const navItems = [
    { href: "/about", label: t.aboutUs },
    { href: "/learning-center", label: t.learningCenter },
    { href: "/pricing", label: language === "en" ? "Pricing" : "الأسعار" },
    { href: "/faq", label: t.faq },
    { href: "/contact", label: t.contactUs },
    { href: "/dashboard", label: language === "en" ? "Platform" : "البلاتفورم" },
  ];

  const features = language === "en" ? [
    {
      icon: Eye,
      title: "Easy to Use",
      description: "Just paste any wallet address and get instant results. No signup required.",
    },
    {
      icon: Lock,
      title: "Privacy Protected",
      description: "Your searches are not stored or tracked. Complete privacy for your peace of mind.",
    },
    {
      icon: CheckCircle,
      title: "Verified Reports",
      description: "All scam reports are verified by our team before being added to the database.",
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Built on reports from real victims to help protect others from the same scams.",
    },
  ] : [
    {
      icon: Eye,
      title: "سهل الاستخدام",
      description: "فقط الصق أي عنوان محفظة واحصل على نتائج فورية. لا حاجة للتسجيل.",
    },
    {
      icon: Lock,
      title: "حماية الخصوصية",
      description: "لا يتم تخزين أو تتبع عمليات البحث الخاصة بك. خصوصية كاملة لراحة بالك.",
    },
    {
      icon: CheckCircle,
      title: "تقارير موثقة",
      description: "يتم التحقق من جميع تقارير الاحتيال من قبل فريقنا قبل إضافتها إلى قاعدة البيانات.",
    },
    {
      icon: Users,
      title: "مدفوع بالمجتمع",
      description: "مبني على تقارير من ضحايا حقيقيين للمساعدة في حماية الآخرين من نفس عمليات الاحتيال.",
    },
  ];

  const trustIndicators = [
    { label: t.aesEncrypted, icon: Lock },
    { label: t.pdplCompliant, icon: FileCheck },
    { label: t.realTimeProtection, icon: Zap },
  ];

  return (
    <div className={`min-h-screen bg-background flex ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
      <aside className={`fixed top-0 ${isRTL ? "right-0" : "left-0"} z-40 h-screen w-64 border-r bg-background hidden md:block`}>
        <div className="flex items-center gap-4 border-b px-4 h-20">
          <img 
            src="/logo.png" 
            alt="UAE7Guard" 
            className="h-16 w-16 object-contain rounded-xl"
            style={{ mixBlendMode: 'lighten' }}
          />
          <span className="text-lg font-bold tracking-tight">UAE7Guard</span>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          {sidebarItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={`w-full justify-start gap-3 ${isActive ? "bg-primary/10" : ""}`}
                  data-testid={`sidebar-${item.href.replace("/", "") || "home"}`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 border-t p-4">
          {isAuthenticated ? (
            <div className="space-y-2">
              <Link href="/dashboard">
                <Button className="w-full gap-2" data-testid="button-go-to-platform">
                  <LayoutDashboard className="h-4 w-4" />
                  {language === "en" ? "Go to Platform" : "الذهاب للمنصة"}
                </Button>
              </Link>
              <Button variant="outline" className="w-full" onClick={() => logout()} data-testid="button-logout">
                {language === "en" ? "Logout" : "تسجيل الخروج"}
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Link href="/login">
                <Button variant="outline" className="w-full gap-2" data-testid="sidebar-button-login">
                  <LogIn className="h-4 w-4" />
                  {language === "en" ? "Login" : "تسجيل الدخول"}
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="w-full gap-2" data-testid="sidebar-button-signup">
                  <UserPlus className="h-4 w-4" />
                  {language === "en" ? "Sign Up" : "إنشاء حساب"}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </aside>

      <div className={`flex-1 ${isRTL ? "mr-0 md:mr-64" : "ml-0 md:ml-64"}`}>
        <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
          <div className="flex h-16 items-center justify-between gap-4 px-4">
            <div className="flex items-center gap-2">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side={isRTL ? "right" : "left"} className="w-72">
                  <div className="flex items-center gap-4 mb-6">
                    <img 
                      src="/logo.png" 
                      alt="UAE7Guard" 
                      className="h-16 w-16 object-contain rounded-xl"
                      style={{ mixBlendMode: 'lighten' }}
                    />
                    <span className="text-lg font-bold tracking-tight">UAE7Guard</span>
                  </div>
                  <nav className="flex flex-col gap-1">
                    {sidebarItems.map((item) => {
                      const isActive = location === item.href;
                      return (
                        <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                          <Button
                            variant={isActive ? "secondary" : "ghost"}
                            className={`w-full justify-start gap-3 ${isActive ? "bg-primary/10" : ""}`}
                          >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                          </Button>
                        </Link>
                      );
                    })}
                  </nav>
                  <div className="absolute bottom-4 left-4 right-4 space-y-2">
                    {isAuthenticated ? (
                      <>
                        <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                          <Button className="w-full gap-2">
                            <LayoutDashboard className="h-4 w-4" />
                            {language === "en" ? "Go to Platform" : "الذهاب للمنصة"}
                          </Button>
                        </Link>
                        <Button variant="outline" className="w-full" onClick={() => { logout(); setMobileMenuOpen(false); }}>
                          {language === "en" ? "Logout" : "تسجيل الخروج"}
                        </Button>
                      </>
                    ) : (
                      <>
                        <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                          <Button variant="outline" className="w-full gap-2">
                            <LogIn className="h-4 w-4" />
                            {language === "en" ? "Login" : "تسجيل الدخول"}
                          </Button>
                        </Link>
                        <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                          <Button className="w-full gap-2">
                            <UserPlus className="h-4 w-4" />
                            {language === "en" ? "Sign Up" : "إنشاء حساب"}
                          </Button>
                        </Link>
                      </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
              <div className="flex items-center gap-3 md:hidden">
                <img 
                  src="/logo.png" 
                  alt="UAE7Guard" 
                  className="h-12 w-12 object-contain rounded-lg flex-shrink-0"
                  style={{ mixBlendMode: 'lighten' }}
                />
                <span className="text-lg font-bold tracking-tight">UAE7Guard</span>
              </div>
            </div>
            <div className="hidden md:block" />
            <div className="flex items-center gap-2">
              <LanguageToggle />
              <ThemeToggle />
              {isAuthenticated ? (
                <Link href="/dashboard">
                  <Button data-testid="button-enter-platform">
                    {language === "en" ? "Platform" : "المنصة"}
                    <ChevronRight className={`h-4 w-4 ${isRTL ? "mr-1 rotate-180" : "ml-1"}`} />
                  </Button>
                </Link>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link href="/login">
                    <Button variant="ghost" data-testid="button-login">
                      {language === "en" ? "Login" : "تسجيل الدخول"}
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button data-testid="button-signup">
                      {language === "en" ? "Sign Up" : "إنشاء حساب"}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>

      <main>
        <section id="check-tool" className="relative overflow-hidden border-b bg-gradient-to-b from-primary/5 via-background to-background py-20 md:py-32">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
          <div className="container relative mx-auto px-4 text-center">
            <Badge className="mb-6" variant="secondary">
              <Shield className="mr-1 h-3 w-3" />
              {language === "en" ? "Crypto Safety Tool" : "أداة سلامة العملات الرقمية"}
            </Badge>
            <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              {t.heroTitle}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
              {t.heroSubtitle}
            </p>

            <div className="mx-auto mt-10 max-w-xl">
              <Card className="border-2">
                <CardContent className="p-6">
                  <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    {t.checkWalletAddress}
                  </h3>
                  <ThreatSearch />
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
              {trustIndicators.map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <item.icon className="h-4 w-4 text-primary" />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <AnimatedStats />

        <DemoWallets />

        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                {t.featuresTitle}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                {t.featuresSubtitle}
              </p>
            </div>

            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <Card key={feature.title} className="group transition-all hover-elevate">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <Link href="/about">
                <Card className="group hover-elevate cursor-pointer h-full">
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{t.aboutUs}</h3>
                      <p className="text-sm text-muted-foreground">
                        {language === "en" ? "Our mission & values" : "مهمتنا وقيمنا"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/learning-center">
                <Card className="group hover-elevate cursor-pointer h-full">
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{t.learningCenter}</h3>
                      <p className="text-sm text-muted-foreground">
                        {language === "en" ? "Learn about scam types" : "تعرف على أنواع الاحتيال"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/faq">
                <Card className="group hover-elevate cursor-pointer h-full">
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <HelpCircle className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{t.faq}</h3>
                      <p className="text-sm text-muted-foreground">
                        {language === "en" ? "Common questions" : "أسئلة شائعة"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/contact">
                <Card className="group hover-elevate cursor-pointer h-full">
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{t.contactUs}</h3>
                      <p className="text-sm text-muted-foreground">
                        {language === "en" ? "Report suspicious activity" : "الإبلاغ عن نشاط مشبوه"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </section>

        <section className="border-t py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight">{t.ctaTitle}</h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              {t.ctaSubtitle}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button size="lg" data-testid="button-try-now" onClick={scrollToCheckTool}>
                  {t.tryNow}
                  <ChevronRight className={`h-4 w-4 ${isRTL ? "mr-1 rotate-180" : "ml-1"}`} />
                </Button>
              <Link href="/learning-center">
                <Button size="lg" variant="outline" data-testid="button-learn-more">
                  {t.learnMore}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Prominent Legal Disclaimer */}
      <section className="bg-amber-500/10 border-y border-amber-500/30 py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500/20">
              <Shield className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-700 dark:text-amber-300" data-testid="text-disclaimer-title">
                {language === "en" ? "Legal Disclaimer" : "إخلاء المسؤولية القانونية"}
              </h3>
              <p className="mt-1 text-sm text-amber-800/80 dark:text-amber-200/80" data-testid="text-disclaimer-content">
                {language === "en" 
                  ? "UAE7Guard is for educational and informational purposes only. This is NOT financial, legal, or investment advice. Always verify information independently and consult qualified professionals before making any financial decisions. We are not responsible for any losses resulting from the use of this information."
                  : "UAE7Guard للأغراض التعليمية والمعلوماتية فقط. هذه ليست نصيحة مالية أو قانونية أو استثمارية. تحقق دائماً من المعلومات بشكل مستقل واستشر المتخصصين المؤهلين قبل اتخاذ أي قرارات مالية. نحن غير مسؤولين عن أي خسائر ناتجة عن استخدام هذه المعلومات."}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link href="/privacy">
                  <Button variant="outline" size="sm" className="border-amber-500/50 text-amber-700 dark:text-amber-300">
                    {t.privacy}
                  </Button>
                </Link>
                <Link href="/terms">
                  <Button variant="outline" size="sm" className="border-amber-500/50 text-amber-700 dark:text-amber-300">
                    {t.terms}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t py-8">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 text-center sm:flex-row sm:text-left">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-semibold">UAE7Guard</span>
          </div>
          <div className="flex flex-col items-center gap-1 sm:items-end">
            <p className="text-sm text-muted-foreground">
              {t.footerCompliance}
            </p>
            <p className="text-xs text-muted-foreground">
              {t.educationalDisclaimer}
            </p>
          </div>
        </div>
        <div className="container mx-auto mt-4 flex flex-wrap justify-center gap-4 px-4 text-xs text-muted-foreground">
          <Link href="/privacy" className="hover:text-foreground">
            {t.privacy}
          </Link>
          <span>|</span>
          <Link href="/terms" className="hover:text-foreground">
            {t.terms}
          </Link>
        </div>
      </footer>
      
      <InstallPrompt />
      </div>
    </div>
  );
}
