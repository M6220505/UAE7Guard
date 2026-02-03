import { Link } from "wouter";
import { Lock, Crown, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/language-context";
import { useSubscription, SubscriptionTier, getTierDisplayName } from "@/hooks/use-subscription";

interface FeatureGateProps {
  requiredTier: "basic" | "pro";
  feature: string;
  children: React.ReactNode;
}

export function FeatureGate({ requiredTier, feature, children }: FeatureGateProps) {
  const { language } = useLanguage();
  const { tier, isActive } = useSubscription();

  const tierOrder: Record<SubscriptionTier, number> = {
    free: 0,
    basic: 1,
    pro: 2,
  };

  const hasAccess = tierOrder[tier] >= tierOrder[requiredTier] && isActive;

  if (hasAccess) {
    return <>{children}</>;
  }

  return (
    <LockedFeatureCard
      requiredTier={requiredTier}
      feature={feature}
      language={language}
    />
  );
}

interface LockedFeatureCardProps {
  requiredTier: "basic" | "pro";
  feature: string;
  language: "en" | "ar";
}

function LockedFeatureCard({ requiredTier, feature, language }: LockedFeatureCardProps) {
  const content = {
    en: {
      locked: "Premium Feature",
      requiresPrefix: "This feature requires",
      plan: "plan",
      upgrade: "Upgrade Now",
      viewPlans: "View Plans",
      unlockPrefix: "Upgrade to unlock",
      andMore: "and more premium features",
    },
    ar: {
      locked: "ميزة مميزة",
      requiresPrefix: "تتطلب هذه الميزة",
      plan: "خطة",
      upgrade: "الترقية الآن",
      viewPlans: "عرض الخطط",
      unlockPrefix: "قم بالترقية لفتح",
      andMore: "والمزيد من الميزات المميزة",
    },
  };

  const t = content[language];
  const tierName = getTierDisplayName(requiredTier, language);
  const isPro = requiredTier === "pro";

  return (
    <Card className="border-dashed border-muted-foreground/30 bg-muted/20" data-testid={`card-locked-${feature}`}>
      <CardHeader className="text-center pb-3">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-2">
          <Lock className="h-6 w-6 text-muted-foreground" />
        </div>
        <CardTitle className="flex items-center justify-center gap-2 text-lg">
          {t.locked}
          <Badge variant={isPro ? "default" : "secondary"} data-testid="badge-required-tier">
            {isPro ? <Crown className="h-3 w-3 mr-1" /> : <Zap className="h-3 w-3 mr-1" />}
            {tierName}
          </Badge>
        </CardTitle>
        <CardDescription>
          {t.requiresPrefix} {tierName} {t.plan}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-sm text-muted-foreground">
          {t.unlockPrefix} <span className="font-medium text-foreground">{feature}</span> {t.andMore}
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Link href="/pricing">
            <Button variant={isPro ? "default" : "secondary"} data-testid="button-upgrade-feature">
              {isPro ? <Crown className="h-4 w-4 mr-2" /> : <Zap className="h-4 w-4 mr-2" />}
              {t.upgrade}
            </Button>
          </Link>
          <Link href="/pricing">
            <Button variant="outline" data-testid="button-view-plans">
              {t.viewPlans}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

interface UpgradeBannerProps {
  message?: string;
  targetTier?: "basic" | "pro";
}

export function UpgradeBanner({ message, targetTier = "pro" }: UpgradeBannerProps) {
  const { language } = useLanguage();
  const { canUpgrade, tier } = useSubscription();

  if (!canUpgrade) {
    return null;
  }

  const content = {
    en: {
      defaultMessage: "Unlock premium features with an upgrade",
      upgrade: "Upgrade",
    },
    ar: {
      defaultMessage: "افتح الميزات المميزة مع الترقية",
      upgrade: "ترقية",
    },
  };

  const t = content[language];
  const tierName = getTierDisplayName(targetTier, language);

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-primary/30 bg-primary/5 p-3" data-testid="banner-upgrade">
      <div className="flex items-center gap-2">
        <Crown className="h-5 w-5 text-primary" />
        <span className="text-sm">{message || t.defaultMessage}</span>
      </div>
      <Link href="/pricing">
        <Button size="sm" data-testid="button-banner-upgrade">
          {t.upgrade}
        </Button>
      </Link>
    </div>
  );
}

export function SubscriptionBadge() {
  const { language } = useLanguage();
  const { tier, isActive, isLoading } = useSubscription();

  if (isLoading) {
    return null;
  }

  if (tier === "free" || !isActive) {
    return null;
  }

  const tierName = getTierDisplayName(tier, language);
  const isPro = tier === "pro";

  return (
    <Badge variant={isPro ? "default" : "secondary"} className="gap-1" data-testid="badge-subscription">
      {isPro ? <Crown className="h-3 w-3" /> : <Zap className="h-3 w-3" />}
      {tierName}
    </Badge>
  );
}
