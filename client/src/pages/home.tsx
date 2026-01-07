import { Link } from "wouter";
import { Shield, Lock, Eye, CheckCircle, FileCheck, ChevronRight, Zap, BookOpen, HelpCircle, Mail, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThreatSearch } from "@/components/threat-search";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/contexts/language-context";

export default function Home() {
  const { t, language, isRTL } = useLanguage();

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
    { href: "/faq", label: t.faq },
    { href: "/contact", label: t.contactUs },
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
    <div className={`min-h-screen bg-background ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold tracking-tight">UAE7Guard</span>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <Link 
                key={item.href}
                href={item.href} 
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
            <Button 
              data-testid="button-start-check"
              onClick={scrollToCheckTool}
            >
              {t.startCheck}
              <ChevronRight className={`h-4 w-4 ${isRTL ? "mr-1 rotate-180" : "ml-1"}`} />
            </Button>
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
    </div>
  );
}
