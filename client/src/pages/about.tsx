import { Shield, Target, Users, CheckCircle, Lock, FileCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/language-context";

export default function About() {
  const { language, isRTL } = useLanguage();

  const content = {
    en: {
      title: "About UAE7Guard",
      subtitle: "Protecting the UAE community from cryptocurrency scams",
      missionTitle: "Our Mission",
      missionText: "UAE7Guard is a public service designed to help everyday users verify cryptocurrency wallet addresses before making transactions. Our goal is to reduce financial losses from scams by providing easy access to threat intelligence.",
      howItWorks: "How It Works",
      howItWorksText: "We maintain a database of wallet addresses that have been reported as involved in fraudulent activity. When you check an address, we search our verified reports and tell you if there are any known issues.",
      values: [
        {
          icon: Target,
          title: "Simple & Accessible",
          description: "No technical knowledge required. Just paste an address and get clear results.",
        },
        {
          icon: Lock,
          title: "Privacy First",
          description: "We don't store your search queries or link them to your identity.",
        },
        {
          icon: Users,
          title: "Community Driven",
          description: "Our database is built from verified community reports.",
        },
        {
          icon: CheckCircle,
          title: "Verified Data",
          description: "All reports are reviewed before being added to ensure accuracy.",
        },
      ],
      securityTitle: "Security Standards",
      securityText: "We use AES-256 encryption and comply with UAE Federal Decree-Law No. 45 of 2021 on Personal Data Protection.",
      disclaimerTitle: "Important Notice",
      disclaimerText: "This service is provided for educational and informational purposes only. Results should not be considered as financial or legal advice. Always do your own research before making any financial decisions.",
    },
    ar: {
      title: "عن UAE7Guard",
      subtitle: "حماية مجتمع الإمارات من عمليات الاحتيال في العملات الرقمية",
      missionTitle: "مهمتنا",
      missionText: "UAE7Guard هي خدمة عامة مصممة لمساعدة المستخدمين العاديين على التحقق من عناوين محافظ العملات الرقمية قبل إجراء المعاملات. هدفنا هو تقليل الخسائر المالية من عمليات الاحتيال من خلال توفير سهولة الوصول إلى معلومات التهديدات.",
      howItWorks: "كيف يعمل",
      howItWorksText: "نحتفظ بقاعدة بيانات لعناوين المحافظ التي تم الإبلاغ عنها كمتورطة في نشاط احتيالي. عند فحص عنوان، نبحث في تقاريرنا الموثقة ونخبرك إذا كانت هناك أي مشاكل معروفة.",
      values: [
        {
          icon: Target,
          title: "بسيط وسهل الوصول",
          description: "لا حاجة لمعرفة تقنية. فقط الصق العنوان واحصل على نتائج واضحة.",
        },
        {
          icon: Lock,
          title: "الخصوصية أولاً",
          description: "لا نقوم بتخزين استعلامات البحث الخاصة بك أو ربطها بهويتك.",
        },
        {
          icon: Users,
          title: "مدفوع بالمجتمع",
          description: "قاعدة بياناتنا مبنية من تقارير المجتمع الموثقة.",
        },
        {
          icon: CheckCircle,
          title: "بيانات موثقة",
          description: "تتم مراجعة جميع التقارير قبل إضافتها لضمان الدقة.",
        },
      ],
      securityTitle: "معايير الأمان",
      securityText: "نستخدم تشفير AES-256 ونلتزم بالمرسوم الاتحادي الإماراتي رقم 45 لسنة 2021 بشأن حماية البيانات الشخصية.",
      disclaimerTitle: "إشعار مهم",
      disclaimerText: "هذه الخدمة مقدمة للأغراض التعليمية والمعلوماتية فقط. لا ينبغي اعتبار النتائج نصيحة مالية أو قانونية. قم دائمًا بإجراء بحثك الخاص قبل اتخاذ أي قرارات مالية.",
    },
  };

  const t = content[language];

  return (
    <div className={`container mx-auto max-w-4xl py-8 px-4 ${isRTL ? "text-right" : "text-left"}`}>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-about-title">{t.title}</h1>
            <p className="text-sm text-muted-foreground">{t.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              {t.missionTitle}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>{t.missionText}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              {t.howItWorks}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>{t.howItWorksText}</p>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2">
          {t.values.map((value) => (
            <Card key={value.title}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <value.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              {t.securityTitle}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>{t.securityText}</p>
          </CardContent>
        </Card>

        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-amber-500" />
              {t.disclaimerTitle}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>{t.disclaimerText}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
