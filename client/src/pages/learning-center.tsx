import { BookOpen, AlertTriangle, Shield, Lock, Eye, Users, Wallet, Link as LinkIcon, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/language-context";

interface ScamType {
  icon: typeof AlertTriangle;
  title: string;
  description: string;
  warning: string;
  prevention: string[];
  severity: "high" | "medium" | "critical";
}

export default function LearningCenter() {
  const { language, isRTL } = useLanguage();

  const content = {
    en: {
      title: "Learning Center",
      subtitle: "Learn about common cryptocurrency patterns and how to recognize concerning indicators",
      introTitle: "Educational Resources",
      introText: "Cryptocurrency-related concerns are becoming increasingly sophisticated. Understanding common patterns can help you make informed decisions. Here are the most common concerning patterns we track:",
      scamTypes: [
        {
          icon: CreditCard,
          title: "Phishing Scams",
          description: "Scammers create fake websites or send emails that look like legitimate cryptocurrency services to steal your login credentials or private keys.",
          warning: "Never enter your private key or seed phrase on any website. Legitimate services will never ask for this.",
          prevention: [
            "Always check the URL carefully before entering any information",
            "Never click links in unsolicited emails or messages",
            "Use bookmarks for frequently visited crypto sites",
            "Enable two-factor authentication on all accounts",
          ],
          severity: "critical" as const,
        },
        {
          icon: Wallet,
          title: "Rug Pulls",
          description: "Developers create a new cryptocurrency or NFT project, attract investors, then suddenly abandon the project and take all the funds.",
          warning: "Be extremely cautious with new projects promising high returns.",
          prevention: [
            "Research the team behind any project before investing",
            "Check if the smart contract code has been audited",
            "Be wary of anonymous developers",
            "Start with small amounts you can afford to lose",
          ],
          severity: "high" as const,
        },
        {
          icon: Users,
          title: "Pig Butchering Scams",
          description: "Long-term romance scams where fraudsters build a relationship with victims over time, then convince them to invest in fake cryptocurrency platforms.",
          warning: "Be suspicious of online relationships that quickly turn to investment advice.",
          prevention: [
            "Never invest based on advice from someone you've only met online",
            "Verify any investment platform independently",
            "Be wary of guaranteed returns or pressure to invest quickly",
            "Talk to trusted friends or family before making large investments",
          ],
          severity: "critical" as const,
        },
        {
          icon: LinkIcon,
          title: "Fake Airdrops",
          description: "Scammers promise tokens that require you to connect your wallet or send a small amount first, then drain your wallet.",
          warning: "Legitimate airdrops never require you to send money or connect your main wallet.",
          prevention: [
            "Never connect your main wallet to unknown websites",
            "Don't approve token spending permissions for unknown contracts",
            "Use a separate wallet for testing new projects",
            "If it sounds too good to be true, it probably is",
          ],
          severity: "high" as const,
        },
        {
          icon: Eye,
          title: "Address Poisoning",
          description: "Scammers send tiny transactions from addresses that look similar to ones you've used, hoping you'll accidentally copy the wrong address.",
          warning: "Always verify the full address, not just the first and last few characters.",
          prevention: [
            "Always double-check the complete wallet address before sending",
            "Use address book features in your wallet",
            "Don't copy addresses from transaction history",
            "Verify addresses through multiple sources",
          ],
          severity: "medium" as const,
        },
        {
          icon: Lock,
          title: "Honeypot Tokens",
          description: "Tokens designed so you can buy them but cannot sell. The smart contract prevents any sales except by the creator.",
          warning: "Always verify you can sell a token before investing significant amounts.",
          prevention: [
            "Check token contracts on blockchain explorers",
            "Look for liquidity locks and contract audits",
            "Test with small amounts first",
            "Research the token on multiple sources before buying",
          ],
          severity: "high" as const,
        },
      ] as ScamType[],
      protectionTitle: "General Security Best Practices",
      protectionTips: [
        "Never share your private keys or seed phrases with anyone",
        "Use hardware wallets for storing significant amounts",
        "Enable two-factor authentication on all accounts",
        "Verify website URLs before entering any information",
        "Be skeptical of unsolicited messages about investments",
        "Only use well-known, reputable exchanges and services",
      ],
      checkTool: "Use Our Informational Tool",
      checkToolDesc: "Before sending funds to any address, use our tool to check if it has been reported by community members.",
    },
    ar: {
      title: "مركز التعلم",
      subtitle: "تعرف على عمليات الاحتيال الشائعة في العملات الرقمية وكيفية حماية نفسك",
      introTitle: "ابقَ آمنًا في عالم العملات الرقمية",
      introText: "أصبحت عمليات الاحتيال في العملات الرقمية أكثر تطورًا. فهم الأنواع الشائعة من الاحتيال يمكن أن يساعدك في تجنب الوقوع ضحية. إليك أكثر عمليات الاحتيال شيوعًا التي نتتبعها:",
      scamTypes: [
        {
          icon: CreditCard,
          title: "عمليات التصيد الاحتيالي",
          description: "ينشئ المحتالون مواقع ويب مزيفة أو يرسلون رسائل بريد إلكتروني تبدو وكأنها خدمات عملات رقمية شرعية لسرقة بيانات تسجيل الدخول أو المفاتيح الخاصة.",
          warning: "لا تدخل مفتاحك الخاص أو عبارة البذور على أي موقع. الخدمات الشرعية لن تطلب هذا أبدًا.",
          prevention: [
            "تحقق دائمًا من عنوان URL بعناية قبل إدخال أي معلومات",
            "لا تنقر على الروابط في الرسائل غير المرغوب فيها",
            "استخدم الإشارات المرجعية للمواقع المشفرة التي تزورها بشكل متكرر",
            "فعّل المصادقة الثنائية على جميع الحسابات",
          ],
          severity: "critical" as const,
        },
        {
          icon: Wallet,
          title: "سحب البساط",
          description: "ينشئ المطورون عملة رقمية جديدة أو مشروع NFT، يجذبون المستثمرين، ثم يتخلون فجأة عن المشروع ويأخذون جميع الأموال.",
          warning: "كن حذرًا للغاية مع المشاريع الجديدة التي تعد بعوائد عالية.",
          prevention: [
            "ابحث عن الفريق وراء أي مشروع قبل الاستثمار",
            "تحقق مما إذا كان كود العقد الذكي قد تم تدقيقه",
            "كن حذرًا من المطورين المجهولين",
            "ابدأ بمبالغ صغيرة يمكنك تحمل خسارتها",
          ],
          severity: "high" as const,
        },
        {
          icon: Users,
          title: "عمليات احتيال ذبح الخنزير",
          description: "عمليات احتيال رومانسية طويلة الأمد حيث يبني المحتالون علاقة مع الضحايا بمرور الوقت، ثم يقنعونهم بالاستثمار في منصات عملات رقمية مزيفة.",
          warning: "كن مشككًا في العلاقات عبر الإنترنت التي تتحول بسرعة إلى نصائح استثمارية.",
          prevention: [
            "لا تستثمر أبدًا بناءً على نصيحة شخص قابلته عبر الإنترنت فقط",
            "تحقق من أي منصة استثمار بشكل مستقل",
            "كن حذرًا من العوائد المضمونة أو الضغط للاستثمار بسرعة",
            "تحدث مع الأصدقاء أو العائلة الموثوقين قبل إجراء استثمارات كبيرة",
          ],
          severity: "critical" as const,
        },
        {
          icon: LinkIcon,
          title: "الإنزالات الجوية المزيفة",
          description: "يعد المحتالون برموز تتطلب منك ربط محفظتك أو إرسال مبلغ صغير أولاً، ثم يستنزفون محفظتك.",
          warning: "الإنزالات الجوية الشرعية لا تتطلب منك أبدًا إرسال أموال أو ربط محفظتك الرئيسية.",
          prevention: [
            "لا تربط محفظتك الرئيسية أبدًا بمواقع غير معروفة",
            "لا توافق على أذونات إنفاق الرموز لعقود غير معروفة",
            "استخدم محفظة منفصلة لاختبار المشاريع الجديدة",
            "إذا بدا الأمر جيدًا جدًا ليكون حقيقيًا، فمن المحتمل أنه كذلك",
          ],
          severity: "high" as const,
        },
        {
          icon: Eye,
          title: "تسميم العنوان",
          description: "يرسل المحتالون معاملات صغيرة من عناوين تبدو مشابهة للعناوين التي استخدمتها، على أمل أن تنسخ العنوان الخاطئ عن طريق الخطأ.",
          warning: "تحقق دائمًا من العنوان الكامل، وليس فقط الأحرف الأولى والأخيرة.",
          prevention: [
            "تحقق دائمًا من عنوان المحفظة الكامل قبل الإرسال",
            "استخدم ميزات دفتر العناوين في محفظتك",
            "لا تنسخ العناوين من سجل المعاملات",
            "تحقق من العناوين من خلال مصادر متعددة",
          ],
          severity: "medium" as const,
        },
        {
          icon: Lock,
          title: "رموز مصيدة العسل",
          description: "رموز مصممة بحيث يمكنك شراؤها ولكن لا يمكنك بيعها. العقد الذكي يمنع أي مبيعات باستثناء من قبل المنشئ.",
          warning: "تحقق دائمًا من أنه يمكنك بيع رمز قبل استثمار مبالغ كبيرة.",
          prevention: [
            "تحقق من عقود الرموز على مستكشفات البلوكتشين",
            "ابحث عن قفل السيولة وعمليات تدقيق العقود",
            "اختبر بمبالغ صغيرة أولاً",
            "ابحث عن الرمز في مصادر متعددة قبل الشراء",
          ],
          severity: "high" as const,
        },
      ] as ScamType[],
      protectionTitle: "نصائح الحماية العامة",
      protectionTips: [
        "لا تشارك مفاتيحك الخاصة أو عبارات البذور مع أي شخص",
        "استخدم محافظ الأجهزة لتخزين المبالغ الكبيرة",
        "فعّل المصادقة الثنائية على جميع الحسابات",
        "تحقق من عناوين URL للمواقع قبل إدخال أي معلومات",
        "كن متشككًا في الرسائل غير المرغوب فيها حول الاستثمارات",
        "استخدم فقط البورصات والخدمات المعروفة والموثوقة",
      ],
      checkTool: "استخدم أداة الفحص الخاصة بنا",
      checkToolDesc: "قبل إرسال الأموال إلى أي عنوان، استخدم أداتنا للتحقق مما إذا كان قد تم الإبلاغ عنه لنشاط احتيالي.",
    },
  };

  const t = content[language];

  const severityColors = {
    critical: "bg-red-500/20 text-red-600 dark:text-red-400",
    high: "bg-orange-500/20 text-orange-600 dark:text-orange-400",
    medium: "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400",
  };

  const severityLabels = {
    en: { critical: "Critical Risk", high: "High Risk", medium: "Medium Risk" },
    ar: { critical: "خطر حرج", high: "خطر عالي", medium: "خطر متوسط" },
  };

  return (
    <div className={`container mx-auto max-w-4xl py-8 px-4 ${isRTL ? "text-right" : "text-left"}`}>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-learning-title">{t.title}</h1>
            <p className="text-sm text-muted-foreground">{t.subtitle}</p>
          </div>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            {t.introTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          <p>{t.introText}</p>
        </CardContent>
      </Card>

      <div className="space-y-6 mb-8">
        {t.scamTypes.map((scam: ScamType) => (
          <Card key={scam.title}>
            <CardHeader>
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <CardTitle className="flex items-center gap-2">
                  <scam.icon className="h-5 w-5 text-primary" />
                  {scam.title}
                </CardTitle>
                <Badge className={severityColors[scam.severity]}>
                  {severityLabels[language][scam.severity]}
                </Badge>
              </div>
              <CardDescription className="mt-2">{scam.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md bg-amber-500/10 border border-amber-500/20 p-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-amber-600 dark:text-amber-400">{scam.warning}</p>
                </div>
              </div>
              <div>
                <p className="font-medium mb-2">{language === "en" ? "Risk Mitigation Strategies:" : "استراتيجيات تخفيف المخاطر:"}</p>
                <ul className="space-y-1">
                  {scam.prevention.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary mt-1">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-primary/30 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            {t.protectionTitle}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {t.protectionTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-muted-foreground">
                <span className="text-primary mt-1">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
