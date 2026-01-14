import { useState } from "react";
import { Search, Shield, ShieldAlert, ShieldCheck, ShieldX, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/language-context";
import type { ScamReport } from "@shared/schema";

interface ThreatSearchProps {
  compact?: boolean;
}

export function ThreatSearch({ compact = false }: ThreatSearchProps) {
  const [address, setAddress] = useState("");
  const [searchAddress, setSearchAddress] = useState("");
  const { t, language, isRTL } = useLanguage();

  const { data: results, isLoading, isFetched } = useQuery<ScamReport[]>({
    queryKey: ["/api/threats", searchAddress],
    enabled: searchAddress.length > 0,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim()) {
      setSearchAddress(address.trim().toLowerCase());
    }
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

    if (threatLevel === "clean") {
      return (
        <Card 
          className="border-green-500/30 bg-green-500/5"
          role="status"
          aria-label={language === "en" ? "Safe address - no scam reports found" : "عنوان آمن - لم يتم العثور على تقارير احتيال"}
        >
          <CardContent className="flex items-center gap-4 py-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-500/20" aria-hidden="true">
              <ShieldCheck className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <h3 className="font-semibold text-green-600 dark:text-green-400" data-testid="text-result-safe">
                {t.addressSafe}
              </h3>
              <p className="text-sm text-muted-foreground">{t.addressSafeDesc}</p>
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
          aria-label={language === "en" ? "Dangerous address - verified scam reports found" : "عنوان خطير - تم العثور على تقارير احتيال موثقة"}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-500/20" aria-hidden="true">
                <ShieldX className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <CardTitle className="text-red-600 dark:text-red-400" data-testid="text-result-dangerous">
                  {t.addressDangerous}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {verifiedReports.length} {t.confirmedReports}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">{t.addressDangerousDesc}</p>
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
                    {t.amountLost}: {report.amountLost}
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
        aria-label={language === "en" ? "Caution - address under review with pending reports" : "تنبيه - العنوان قيد المراجعة مع تقارير معلقة"}
      >
        <CardContent className="flex items-center gap-4 py-6">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-yellow-500/20" aria-hidden="true">
            <ShieldAlert className="h-6 w-6 text-yellow-500" />
          </div>
          <div>
            <h3 className="font-semibold text-yellow-600 dark:text-yellow-400" data-testid="text-result-review">
              {t.addressMediumRisk}
            </h3>
            <p className="text-sm text-muted-foreground">
              {results?.length} {t.pendingReports}
            </p>
            <p className="text-sm text-muted-foreground mt-1">{t.addressMediumRiskDesc}</p>
          </div>
        </CardContent>
      </Card>
    );
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
    </div>
  );
}
