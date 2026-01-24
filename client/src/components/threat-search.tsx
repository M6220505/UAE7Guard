import { useState } from "react";
import { Search, Shield, ShieldAlert, ShieldCheck, ShieldX, Loader2, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/language-context";
import type { ScamReport } from "@shared/schema.ts";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ThreatSearchProps {
  compact?: boolean;
}

export function ThreatSearch({ compact = false }: ThreatSearchProps) {
  const [address, setAddress] = useState("");
  const [searchAddress, setSearchAddress] = useState("");
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false);
  const [acknowledgedDisclaimer, setAcknowledgedDisclaimer] = useState(false);
  const { t, language, isRTL } = useLanguage();

  const { data: results, isLoading, isFetched } = useQuery<ScamReport[]>({
    queryKey: ["/api/threats", searchAddress],
    enabled: searchAddress.length > 0,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim()) {
      setSearchAddress(address.trim().toLowerCase());
      setAcknowledgedDisclaimer(false); // Reset disclaimer for new search
    }
  };

  const handleAcknowledgeDisclaimer = () => {
    setAcknowledgedDisclaimer(true);
    setShowDisclaimerModal(false);
  };

  const getThreatLevel = () => {
    if (!results || results.length === 0) return "clean";
    const verified = results.filter(r => r.status === "verified");
    if (verified.length > 0) return "verified";
    return "suspicious";
  };

  const threatLevel = getThreatLevel();

  const scamTypeLabels: Record<string, { en: string; ar: string }> = {
    phishing: { en: "Phishing", ar: "تصيد احتيالي" },
    rugpull: { en: "Rug Pull", ar: "سحب البساط" },
    honeypot: { en: "Honeypot", ar: "مصيدة العسل" },
    fake_ico: { en: "Fake ICO", ar: "ICO مزيف" },
    pump_dump: { en: "Pump & Dump", ar: "ضخ وتفريغ" },
    pig_butchering: { en: "Pig Butchering", ar: "ذبح الخنزير" },
    address_poisoning: { en: "Address Poisoning", ar: "تسميم العنوان" },
    other: { en: "Other", ar: "أخرى" },
  };

  const renderResult = () => {
    if (!isFetched || !searchAddress) return null;

    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      );
    }

    // Show disclaimer modal for risky results before displaying them
    if ((threatLevel === "verified" || threatLevel === "suspicious") && !acknowledgedDisclaimer) {
      setShowDisclaimerModal(true);
      return null;
    }

    if (threatLevel === "clean") {
      return (
        <Card
          className="border-green-500/30 bg-green-500/5"
          role="status"
          aria-label={language === "en" ? "No risk indicators found" : "لم يتم العثور على مؤشرات خطر"}
        >
          <CardContent className="flex items-center gap-4 py-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-500/20" aria-hidden="true">
              <ShieldCheck className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <h3 className="font-semibold text-green-600 dark:text-green-400" data-testid="text-result-safe">
                {language === "en" ? "No Risk Indicators Found" : "لم يتم العثور على مؤشرات خطر"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {language === "en"
                  ? "No community reports found for this address. This does NOT guarantee safety. Always verify independently."
                  : "لم يتم العثور على تقارير مجتمعية لهذا العنوان. هذا لا يضمن السلامة. تحقق دائماً بشكل مستقل."}
              </p>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (threatLevel === "verified") {
      const verifiedReports = results?.filter(r => r.status === "verified") || [];
      return (
        <Card
          className="border-red-500/30 bg-red-500/5"
          role="alert"
          aria-label={language === "en" ? "High-risk indicators - verified community reports found" : "مؤشرات عالية الخطورة - تم العثور على تقارير مجتمعية موثقة"}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-500/20" aria-hidden="true">
                <ShieldX className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <CardTitle className="text-red-600 dark:text-red-400" data-testid="text-result-dangerous">
                  {language === "en" ? "High-Risk Indicators Found" : "تم العثور على مؤشرات عالية الخطورة"}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {verifiedReports.length} {language === "en" ? "verified community report(s)" : "تقرير مجتمعي موثق"}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {language === "en"
                ? "This address has verified community reports. Exercise extreme caution and verify independently before any transaction."
                : "هذا العنوان لديه تقارير مجتمعية موثقة. توخ الحذر الشديد وتحقق بشكل مستقل قبل أي معاملة."}
            </p>
            {verifiedReports.map((report) => (
              <div key={report.id} className="rounded-md bg-background/50 p-3">
                <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                  <Badge variant="destructive" className="text-xs">
                    {scamTypeLabels[report.scamType]?.[language] || report.scamType}
                  </Badge>
                  <Badge variant="outline" className="text-xs">{report.severity}</Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{report.description}</p>
                {report.amountLost && (
                  <p className="mt-1 text-xs text-red-500">
                    {language === "en" ? "Reported Loss" : "الخسارة المبلغ عنها"}: {report.amountLost}
                  </p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      );
    }

    return (
      <Card
        className="border-yellow-500/30 bg-yellow-500/5"
        role="status"
        aria-label={language === "en" ? "Potential risk - address under review with pending reports" : "خطر محتمل - العنوان قيد المراجعة مع تقارير معلقة"}
      >
        <CardContent className="flex items-center gap-4 py-6">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-yellow-500/20" aria-hidden="true">
            <ShieldAlert className="h-6 w-6 text-yellow-500" />
          </div>
          <div>
            <h3 className="font-semibold text-yellow-600 dark:text-yellow-400" data-testid="text-result-review">
              {language === "en" ? "Potential Risk Indicators" : "مؤشرات خطر محتملة"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {results?.length} {language === "en" ? "pending community report(s)" : "تقرير مجتمعي معلق"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {language === "en"
                ? "This address has unverified reports under review. Proceed with caution and conduct your own research."
                : "هذا العنوان لديه تقارير غير موثقة قيد المراجعة. تابع بحذر وقم بإجراء بحثك الخاص."}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  };

  const disclaimerModalContent = {
    en: {
      title: "Important: Please Read Before Viewing Results",
      description: "Before viewing these results, you must understand the following:",
      points: [
        "This is NOT financial, legal, or professional advice",
        "Results are based on community reports and may contain errors or false information",
        "A clean result does NOT guarantee an address is safe",
        "Risk indicators do NOT prove an address is malicious",
        "You should always verify independently and consult official UAE authorities",
        "UAE7Guard is not responsible for your financial decisions",
        "This tool is for educational and informational purposes ONLY"
      ],
      action: "I Understand - Show Results"
    },
    ar: {
      title: "مهم: يرجى القراءة قبل عرض النتائج",
      description: "قبل عرض هذه النتائج، يجب أن تفهم ما يلي:",
      points: [
        "هذه ليست نصيحة مالية أو قانونية أو مهنية",
        "النتائج مبنية على تقارير مجتمعية وقد تحتوي على أخطاء أو معلومات خاطئة",
        "النتيجة النظيفة لا تضمن أن العنوان آمن",
        "مؤشرات الخطر لا تثبت أن العنوان خبيث",
        "يجب عليك دائماً التحقق بشكل مستقل واستشارة السلطات الإماراتية الرسمية",
        "UAE7Guard غير مسؤول عن قراراتك المالية",
        "هذه الأداة لأغراض تعليمية وإعلامية فقط"
      ],
      action: "أفهم - عرض النتائج"
    }
  };

  const disclaimerText = {
    en: "Disclaimer: Information provided by UAE7Guard is based on community reports and experimental analytical tools. The platform does not provide financial advice and is not responsible for the accuracy of individual reports. Please always consult official UAE authorities before making any major financial decisions.",
    ar: "إخلاء مسؤولية: المعلومات المقدمة عبر UAE7Guard هي نتاج بلاغات مجتمعية وأدوات تحليلية تجريبية. المنصة لا تقدم استشارات مالية ولا تتحمل مسؤولية دقة البلاغات الفردية. يرجى دائماً مراجعة الجهات الرسمية في الإمارات قبل اتخاذ أي قرار مالي ضخم."
  };

  return (
    <div className={compact ? "space-y-4" : "space-y-6"}>
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground ${isRTL ? "right-3" : "left-3"}`} />
          <Input
            id="wallet-address-input"
            type="text"
            placeholder={t.checkWalletPlaceholder}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className={`font-mono text-sm ${isRTL ? "pr-10" : "pl-10"}`}
            data-testid="input-threat-address"
          />
        </div>
        <Button type="submit" disabled={isLoading || !address.trim()} data-testid="button-search-threat">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
          <span className={`hidden sm:inline ${isRTL ? "mr-2" : "ml-2"}`}>{t.checkButton}</span>
        </Button>
      </form>
      {renderResult()}
      
      {/* Legal Disclaimer - إخلاء المسؤولية */}
      {isFetched && searchAddress && (
        <div
          className="mt-4 p-3 rounded-md bg-muted/50 border border-border/50"
          dir={isRTL ? "rtl" : "ltr"}
          data-testid="disclaimer-notice"
        >
          <p className="text-xs text-muted-foreground leading-relaxed">
            {disclaimerText[language]}
          </p>
        </div>
      )}

      {/* Disclaimer Modal for Risk Results */}
      <AlertDialog open={showDisclaimerModal} onOpenChange={setShowDisclaimerModal}>
        <AlertDialogContent className="max-w-2xl" dir={isRTL ? "rtl" : "ltr"}>
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-500/20">
                <AlertTriangle className="h-6 w-6 text-amber-500" />
              </div>
              <AlertDialogTitle className="text-xl">
                {disclaimerModalContent[language].title}
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-base pt-4">
              {disclaimerModalContent[language].description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <ul className="space-y-3">
              {disclaimerModalContent[language].points.map((point, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 mt-0.5">
                    <span className="text-xs font-bold text-primary">{index + 1}</span>
                  </div>
                  <span className="text-foreground">{point}</span>
                </li>
              ))}
            </ul>
          </div>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleAcknowledgeDisclaimer} className="w-full sm:w-auto">
              {disclaimerModalContent[language].action}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
