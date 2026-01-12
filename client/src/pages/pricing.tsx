import { useState, useMemo } from "react";
import { Check, Shield, Zap, Crown, Sparkles, Globe, Lock, Headphones, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/language-context";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface StripePrice {
  id: string;
  unit_amount: number;
  currency: string;
  recurring: { interval: string; interval_count: number } | null;
  active: boolean;
}

interface StripeProduct {
  id: string;
  name: string;
  description: string;
  active: boolean;
  metadata: Record<string, string>;
  prices: StripePrice[];
}

export default function Pricing() {
  const { language, isRTL } = useLanguage();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isYearly, setIsYearly] = useState(false);

  const { data: subscription, isLoading: subLoading } = useQuery<{
    subscriptionTier: string;
    subscriptionStatus: string;
  }>({
    queryKey: ["/api/stripe/subscription"],
    enabled: isAuthenticated,
  });

  const { data: productsData, isLoading: productsLoading } = useQuery<{ products: StripeProduct[] }>({
    queryKey: ["/api/stripe/products"],
    staleTime: 1000 * 60 * 10,
  });

  const priceIds = useMemo(() => {
    const result = {
      basic_monthly: "",
      basic_yearly: "",
      pro_monthly: "",
      pro_yearly: "",
    };

    if (!productsData?.products) return result;

    for (const product of productsData.products) {
      const tier = product.metadata?.tier || product.name.toLowerCase();
      for (const price of product.prices) {
        if (!price.active) continue;
        const interval = price.recurring?.interval;
        if (tier.includes("basic")) {
          if (interval === "month") result.basic_monthly = price.id;
          if (interval === "year") result.basic_yearly = price.id;
        } else if (tier.includes("pro")) {
          if (interval === "month") result.pro_monthly = price.id;
          if (interval === "year") result.pro_yearly = price.id;
        }
      }
    }
    return result;
  }, [productsData]);

  const prices = useMemo(() => {
    const result = {
      basic_monthly: 4.99,
      basic_yearly: 49.90,
      pro_monthly: 14.99,
      pro_yearly: 149.90,
    };

    if (!productsData?.products) return result;

    for (const product of productsData.products) {
      const tier = product.metadata?.tier || product.name.toLowerCase();
      for (const price of product.prices) {
        if (!price.active) continue;
        const interval = price.recurring?.interval;
        const amount = price.unit_amount / 100;
        if (tier.includes("basic")) {
          if (interval === "month") result.basic_monthly = amount;
          if (interval === "year") result.basic_yearly = amount;
        } else if (tier.includes("pro")) {
          if (interval === "month") result.pro_monthly = amount;
          if (interval === "year") result.pro_yearly = amount;
        }
      }
    }
    return result;
  }, [productsData]);

  const checkoutMutation = useMutation({
    mutationFn: async (priceId: string) => {
      const response = await apiRequest("POST", "/api/stripe/checkout", { priceId });
      const data = await response.json();
      return data;
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error: Error) => {
      toast({
        title: language === "en" ? "Error" : "خطأ",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const portalMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/stripe/portal", {});
      const data = await response.json();
      return data;
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error: Error) => {
      toast({
        title: language === "en" ? "Error" : "خطأ",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const content = {
    en: {
      title: "Choose Your Plan",
      subtitle: "Start with our free tier or upgrade for premium protection features",
      monthly: "Monthly",
      yearly: "Yearly",
      save: "Save 17%",
      currentPlan: "Current Plan",
      subscribe: "Subscribe",
      manageSubscription: "Manage Subscription",
      loginToSubscribe: "Login to Subscribe",
      perMonth: "/month",
      perYear: "/year",
      billedYearly: "billed yearly",
      free: {
        name: "Free",
        price: "0",
        description: "Basic protection for casual users",
        features: [
          "3 wallet checks per day",
          "Basic threat database access",
          "Community reports viewing",
          "English & Arabic support",
        ],
        notIncluded: [
          "Watchlist addresses",
          "AI-powered predictions",
          "API access",
          "Priority support",
        ],
      },
      basic: {
        name: "Basic",
        price: isYearly ? prices.basic_yearly.toFixed(2) : prices.basic_monthly.toFixed(2),
        description: "Enhanced security for active traders",
        features: [
          "Unlimited wallet checks",
          "Full threat database access",
          "10 watchlist addresses",
          "Email alerts for threats",
          "Detailed risk reports",
          "Community reports viewing",
        ],
        notIncluded: [
          "AI-powered predictions",
          "API access",
          "Priority support",
        ],
      },
      pro: {
        name: "Pro",
        price: isYearly ? prices.pro_yearly.toFixed(2) : prices.pro_monthly.toFixed(2),
        description: "Complete protection for professionals",
        popular: "Most Popular",
        features: [
          "Everything in Basic",
          "Unlimited watchlist addresses",
          "AI-powered threat predictions",
          "Real-time blockchain monitoring",
          "Full API access",
          "Priority 24/7 support",
          "Custom threat alerts",
          "Monthly security reports",
        ],
        notIncluded: [],
      },
    },
    ar: {
      title: "اختر خطتك",
      subtitle: "ابدأ بالمستوى المجاني أو قم بالترقية للحصول على ميزات الحماية المتميزة",
      monthly: "شهري",
      yearly: "سنوي",
      save: "وفر 17%",
      currentPlan: "الخطة الحالية",
      subscribe: "اشترك",
      manageSubscription: "إدارة الاشتراك",
      loginToSubscribe: "سجل الدخول للاشتراك",
      perMonth: "/شهر",
      perYear: "/سنة",
      billedYearly: "يتم الدفع سنوياً",
      free: {
        name: "مجاني",
        price: "0",
        description: "حماية أساسية للمستخدمين العاديين",
        features: [
          "3 فحوصات محفظة يومياً",
          "وصول أساسي لقاعدة التهديدات",
          "عرض تقارير المجتمع",
          "دعم الإنجليزية والعربية",
        ],
        notIncluded: [
          "عناوين قائمة المراقبة",
          "تنبؤات الذكاء الاصطناعي",
          "وصول API",
          "دعم أولوية",
        ],
      },
      basic: {
        name: "أساسي",
        price: isYearly ? prices.basic_yearly.toFixed(2) : prices.basic_monthly.toFixed(2),
        description: "أمان محسن للمتداولين النشطين",
        features: [
          "فحوصات محفظة غير محدودة",
          "وصول كامل لقاعدة التهديدات",
          "10 عناوين قائمة مراقبة",
          "تنبيهات البريد الإلكتروني للتهديدات",
          "تقارير مخاطر مفصلة",
          "عرض تقارير المجتمع",
        ],
        notIncluded: [
          "تنبؤات الذكاء الاصطناعي",
          "وصول API",
          "دعم أولوية",
        ],
      },
      pro: {
        name: "برو",
        price: isYearly ? prices.pro_yearly.toFixed(2) : prices.pro_monthly.toFixed(2),
        description: "حماية كاملة للمحترفين",
        popular: "الأكثر شعبية",
        features: [
          "كل شيء في الأساسي",
          "عناوين قائمة مراقبة غير محدودة",
          "تنبؤات التهديدات بالذكاء الاصطناعي",
          "مراقبة البلوكشين في الوقت الفعلي",
          "وصول API كامل",
          "دعم أولوية 24/7",
          "تنبيهات تهديد مخصصة",
          "تقارير أمان شهرية",
        ],
        notIncluded: [],
      },
    },
  };

  const t = content[language];
  const currentTier = subscription?.subscriptionTier || "free";
  const isActive = subscription?.subscriptionStatus === "active";

  const handleSubscribe = (tier: "basic" | "pro") => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    const priceId = tier === "basic" 
      ? (isYearly ? priceIds.basic_yearly : priceIds.basic_monthly)
      : (isYearly ? priceIds.pro_yearly : priceIds.pro_monthly);
    
    if (!priceId) {
      toast({
        title: language === "en" ? "Error" : "خطأ",
        description: language === "en" ? "Products not loaded yet. Please try again." : "لم يتم تحميل المنتجات بعد. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
      return;
    }
    
    checkoutMutation.mutate(priceId);
  };

  const handleManageSubscription = () => {
    portalMutation.mutate();
  };

  const PlanCard = ({ 
    plan, 
    tier, 
    icon: Icon, 
    isPopular = false 
  }: { 
    plan: typeof t.free | typeof t.basic | typeof t.pro; 
    tier: "free" | "basic" | "pro";
    icon: React.ElementType;
    isPopular?: boolean;
  }) => {
    const isCurrent = currentTier === tier && (tier === "free" || isActive);
    const isPro = tier === "pro";
    
    return (
      <Card className={`relative flex flex-col ${isPro ? "border-primary shadow-lg shadow-primary/10" : ""}`}>
        {isPopular && "popular" in plan && (
          <Badge className="absolute -top-3 left-1/2 -translate-x-1/2" variant="default" data-testid={`badge-popular-${tier}`}>
            <Sparkles className="h-3 w-3 mr-1" />
            {plan.popular}
          </Badge>
        )}
        <CardHeader className="text-center pb-4">
          <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${isPro ? "bg-primary/20" : "bg-muted"}`}>
            <Icon className={`h-6 w-6 ${isPro ? "text-primary" : "text-muted-foreground"}`} />
          </div>
          <CardTitle className="text-xl" data-testid={`text-plan-name-${tier}`}>{plan.name}</CardTitle>
          <CardDescription>{plan.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="text-center mb-6">
            <span className="text-4xl font-bold" data-testid={`text-price-${tier}`}>${plan.price}</span>
            <span className="text-muted-foreground">
              {tier === "free" ? "" : (isYearly ? t.perYear : t.perMonth)}
            </span>
            {isYearly && tier !== "free" && (
              <p className="text-xs text-muted-foreground mt-1">{t.billedYearly}</p>
            )}
          </div>
          <ul className="space-y-2">
            {plan.features.map((feature, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
            {plan.notIncluded.map((feature, i) => (
              <li key={`not-${i}`} className="flex items-start gap-2 text-sm text-muted-foreground">
                <X className="h-4 w-4 text-muted-foreground/50 shrink-0 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          {isCurrent ? (
            <Button 
              variant="outline" 
              className="w-full" 
              disabled
              data-testid={`button-current-${tier}`}
            >
              {t.currentPlan}
            </Button>
          ) : tier === "free" ? (
            <Button 
              variant="outline" 
              className="w-full" 
              disabled
              data-testid={`button-free-tier`}
            >
              {t.currentPlan}
            </Button>
          ) : isAuthenticated && isActive && currentTier !== "free" ? (
            <Button 
              variant={isPro ? "default" : "outline"} 
              className="w-full"
              onClick={handleManageSubscription}
              disabled={portalMutation.isPending}
              data-testid={`button-manage-${tier}`}
            >
              {t.manageSubscription}
            </Button>
          ) : (
            <Button 
              variant={isPro ? "default" : "outline"} 
              className="w-full"
              onClick={() => handleSubscribe(tier as "basic" | "pro")}
              disabled={checkoutMutation.isPending}
              data-testid={`button-subscribe-${tier}`}
            >
              {authLoading ? "..." : (!isAuthenticated ? t.loginToSubscribe : t.subscribe)}
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className={`container mx-auto max-w-6xl py-12 px-4 ${isRTL ? "text-right" : "text-left"}`}>
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-3" data-testid="text-pricing-title">{t.title}</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">{t.subtitle}</p>
        
        <div className="flex items-center justify-center gap-3 mt-8">
          <Label htmlFor="billing-toggle" className={!isYearly ? "font-semibold" : "text-muted-foreground"}>
            {t.monthly}
          </Label>
          <Switch 
            id="billing-toggle" 
            checked={isYearly} 
            onCheckedChange={setIsYearly}
            data-testid="switch-billing-period"
          />
          <Label htmlFor="billing-toggle" className={isYearly ? "font-semibold" : "text-muted-foreground"}>
            {t.yearly}
          </Label>
          {isYearly && (
            <Badge variant="secondary" className="ml-2" data-testid="badge-save">
              {t.save}
            </Badge>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <PlanCard plan={t.free} tier="free" icon={Shield} />
        <PlanCard plan={t.basic} tier="basic" icon={Zap} />
        <PlanCard plan={t.pro} tier="pro" icon={Crown} isPopular />
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-xl font-semibold mb-6">
          {language === "en" ? "Why Upgrade?" : "لماذا الترقية؟"}
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 mb-3">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-medium mb-1">
              {language === "en" ? "Enhanced Protection" : "حماية معززة"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {language === "en" ? "Access advanced threat detection" : "الوصول للكشف المتقدم عن التهديدات"}
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 mb-3">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-medium mb-1">
              {language === "en" ? "AI Predictions" : "تنبؤات الذكاء الاصطناعي"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {language === "en" ? "Predict threats before they happen" : "توقع التهديدات قبل حدوثها"}
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 mb-3">
              <Globe className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-medium mb-1">
              {language === "en" ? "API Access" : "وصول API"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {language === "en" ? "Integrate with your systems" : "التكامل مع أنظمتك"}
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 mb-3">
              <Headphones className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-medium mb-1">
              {language === "en" ? "Priority Support" : "دعم أولوية"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {language === "en" ? "24/7 dedicated assistance" : "مساعدة مخصصة على مدار الساعة"}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center">
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Lock className="h-4 w-4" />
            <span>{language === "en" ? "Secure Payments" : "مدفوعات آمنة"}</span>
          </div>
          <span>•</span>
          <span>{language === "en" ? "Cancel Anytime" : "إلغاء في أي وقت"}</span>
          <span>•</span>
          <span>{language === "en" ? "7-Day Money Back" : "استرداد الأموال خلال 7 أيام"}</span>
        </div>
      </div>
    </div>
  );
}
