import { useState } from "react";
import { Shield, AlertTriangle, CheckCircle, Copy, ExternalLink, Sparkles, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/language-context";

interface DemoWallet {
  address: string;
  shortAddress: string;
  status: "safe" | "suspicious" | "dangerous";
  type: string;
  typeAr: string;
  description: string;
  descriptionAr: string;
  scenario: string;
  scenarioAr: string;
}

const demoWallets: DemoWallet[] = [
  {
    address: "0x742d35Cc6634C0532925a3b844Bc9e7595f8fEb1",
    shortAddress: "0x742d...fEb1",
    status: "safe",
    type: "Verified Exchange",
    typeAr: "منصة تداول موثقة",
    description: "Legitimate centralized exchange wallet with verified history",
    descriptionAr: "محفظة منصة تداول مركزية شرعية مع تاريخ موثق",
    scenario: "This wallet belongs to a major cryptocurrency exchange. It has processed millions of legitimate transactions over 5+ years with no reported issues.",
    scenarioAr: "هذه المحفظة تابعة لمنصة تداول عملات رقمية كبرى. أجرت ملايين المعاملات الشرعية على مدى أكثر من 5 سنوات دون أي مشاكل مبلغ عنها.",
  },
  {
    address: "0x8B3392483BA26D65E331dB86D4F430E9B3814E5a",
    shortAddress: "0x8B33...4E5a",
    status: "suspicious",
    type: "Pump & Dump Token",
    typeAr: "عملة ضخ وتفريغ",
    description: "Token showing classic pump and dump patterns",
    descriptionAr: "عملة تظهر أنماط الضخ والتفريغ الكلاسيكية",
    scenario: "Created 3 days ago with sudden 500% price spike. 85% of tokens held by 3 wallets. Social media hype without real utility. Proceed with extreme caution.",
    scenarioAr: "تم إنشاؤها قبل 3 أيام مع ارتفاع مفاجئ في السعر بنسبة 500%. 85% من العملات محتفظ بها في 3 محافظ. ضجة على وسائل التواصل بدون فائدة حقيقية. تعامل بحذر شديد.",
  },
  {
    address: "0xdEaD000000000000000000000000000000000001",
    shortAddress: "0xdEaD...0001",
    status: "dangerous",
    type: "Confirmed Scam",
    typeAr: "احتيال مؤكد",
    description: "Confirmed rug pull - $2.4M stolen from investors",
    descriptionAr: "سحب بساط مؤكد - سرقة 2.4 مليون دولار من المستثمرين",
    scenario: "This wallet executed a rug pull in January 2025. The deployer removed all liquidity after a fake partnership announcement. 847 victims reported losses.",
    scenarioAr: "نفذت هذه المحفظة عملية سحب بساط في يناير 2025. أزال الناشر كل السيولة بعد إعلان شراكة مزيف. أبلغ 847 ضحية عن خسائر.",
  },
  {
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    shortAddress: "0xA0b8...eB48",
    status: "safe",
    type: "USDC Contract",
    typeAr: "عقد USDC",
    description: "Official USDC stablecoin contract by Circle",
    descriptionAr: "عقد العملة المستقرة USDC الرسمي من Circle",
    scenario: "This is the official USDC smart contract deployed by Circle. It's one of the most trusted stablecoins in the crypto ecosystem with full regulatory compliance.",
    scenarioAr: "هذا هو عقد USDC الرسمي المنشور من Circle. إنها واحدة من أكثر العملات المستقرة موثوقية في نظام العملات المشفرة مع امتثال تنظيمي كامل.",
  },
  {
    address: "0x1234567890AbCdEf1234567890AbCdEf12345678",
    shortAddress: "0x1234...5678",
    status: "dangerous",
    type: "Phishing Attack",
    typeAr: "هجوم تصيد",
    description: "Fake airdrop phishing wallet - steals approval signatures",
    descriptionAr: "محفظة تصيد لإنزال جوي مزيف - تسرق توقيعات الموافقة",
    scenario: "Victims receive fake airdrop claims via social media. When they 'claim' tokens, they unknowingly sign unlimited approval, allowing the scammer to drain their wallets.",
    scenarioAr: "يتلقى الضحايا ادعاءات إنزال جوي مزيفة عبر وسائل التواصل. عندما يقومون بـ'المطالبة' بالعملات، يوقعون دون علم موافقة غير محدودة، مما يسمح للمحتال بإفراغ محافظهم.",
  },
  {
    address: "0xFake00Honeypot00Trap00Contract00Address01",
    shortAddress: "0xFake...ss01",
    status: "suspicious",
    type: "Honeypot Token",
    typeAr: "عملة فخ",
    description: "Buy-only token - sell function disabled in contract",
    descriptionAr: "عملة شراء فقط - وظيفة البيع معطلة في العقد",
    scenario: "Smart contract analysis reveals the sell function is disabled. Investors can buy but cannot sell. Price appears to rise but profits can never be realized.",
    scenarioAr: "تحليل العقد الذكي يكشف أن وظيفة البيع معطلة. يمكن للمستثمرين الشراء لكن لا يمكنهم البيع. يبدو أن السعر يرتفع لكن الأرباح لا يمكن تحقيقها أبداً.",
  },
];

const statusConfig = {
  safe: {
    icon: CheckCircle,
    color: "bg-green-500",
    textColor: "text-green-500",
    bgLight: "bg-green-500/10",
    borderColor: "border-green-500/30",
    label: "Lower Risk",
    labelAr: "مخاطر أقل",
  },
  suspicious: {
    icon: AlertTriangle,
    color: "bg-yellow-500",
    textColor: "text-yellow-500",
    bgLight: "bg-yellow-500/10",
    borderColor: "border-yellow-500/30",
    label: "Moderate Risk",
    labelAr: "مخاطر متوسطة",
  },
  dangerous: {
    icon: AlertTriangle,
    color: "bg-red-500",
    textColor: "text-red-500",
    bgLight: "bg-red-500/10",
    borderColor: "border-red-500/30",
    label: "Elevated Risk",
    labelAr: "مخاطر مرتفعة",
  },
};

export function DemoWallets() {
  const { language, isRTL } = useLanguage();
  const { toast } = useToast();
  const [expandedWallet, setExpandedWallet] = useState<string | null>(null);

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast({
      title: language === "ar" ? "تم النسخ" : "Copied",
      description: language === "ar" ? "تم نسخ العنوان إلى الحافظة" : "Address copied to clipboard",
    });
  };

  const toggleExpand = (address: string) => {
    setExpandedWallet(expandedWallet === address ? null : address);
  };

  return (
    <section className="py-16 border-b">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <Badge variant="secondary">
              {language === "ar" ? "وضع العرض التوضيحي" : "Demo Mode"}
            </Badge>
          </div>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            {language === "ar" ? "أمثلة على المحافظ المعروفة" : "Educational Wallet Examples"}
          </h2>
          <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
            {language === "ar"
              ? "استكشف سيناريوهات احتيال واقعية وتعلم كيفية التعرف على العلامات التحذيرية"
              : "Explore educational scenarios and learn how to recognize concerning indicators"}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {demoWallets.map((wallet) => {
            const config = statusConfig[wallet.status];
            const IconComponent = config.icon;
            const isExpanded = expandedWallet === wallet.address;

            return (
              <Card
                key={wallet.address}
                className={`transition-all duration-300 cursor-pointer hover-elevate ${config.borderColor} border-2 ${isExpanded ? "ring-2 ring-primary" : ""}`}
                onClick={() => toggleExpand(wallet.address)}
                data-testid={`card-demo-wallet-${wallet.shortAddress.slice(-4)}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full ${config.color}`}>
                        <IconComponent className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <Badge className={`${config.bgLight} ${config.textColor} border-0`}>
                          {language === "ar" ? config.labelAr : config.label}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyAddress(wallet.address);
                      }}
                      data-testid={`button-copy-address-${wallet.shortAddress.slice(-4)}`}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardTitle className="text-sm mt-2">
                    {language === "ar" ? wallet.typeAr : wallet.type}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="font-mono text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded mb-3">
                    {wallet.shortAddress}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {language === "ar" ? wallet.descriptionAr : wallet.description}
                  </p>

                  {isExpanded && (
                    <div className={`mt-4 p-3 rounded-lg ${config.bgLight} border ${config.borderColor}`}>
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <ExternalLink className="h-4 w-4" />
                        {language === "ar" ? "السيناريو التعليمي" : "Educational Scenario"}
                      </h4>
                      <p className="text-sm">
                        {language === "ar" ? wallet.scenarioAr : wallet.scenario}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            <Lightbulb className="h-4 w-4 text-primary" />
            {language === "ar"
              ? "انقر على أي بطاقة لرؤية السيناريو الكامل"
              : "Click any card to see the full educational scenario"}
          </p>
        </div>
      </div>
    </section>
  );
}
