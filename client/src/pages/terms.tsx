import { FileText, Shield, AlertTriangle, Scale, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/language-context";

export default function Terms() {
  const { language, isRTL } = useLanguage();

  const content = {
    en: {
      title: "Terms of Service",
      subtitle: "Effective Date: January 2026",
      intro: "By using UAE7Guard, you agree to these simple terms. We've made them easy to understand.",
      sections: [
        {
          icon: Shield,
          title: "What This Service Provides",
          items: [
            "Wallet address checking against our scam database",
            "Educational content about cryptocurrency scams",
            "A way to report suspicious addresses",
            "Information to help you make safer decisions",
          ],
        },
        {
          icon: AlertTriangle,
          title: "Important Disclaimers",
          items: [
            "This is NOT financial advice - always consult professionals for financial decisions",
            "This is NOT legal advice - consult a lawyer for legal matters",
            "Results are for information only - verify independently before making decisions",
            "We cannot guarantee our database contains every scam address",
            "A clean result does not guarantee an address is safe",
          ],
        },
        {
          icon: Users,
          title: "Your Responsibilities",
          items: [
            "Only submit truthful information when reporting addresses",
            "Don't submit false reports to harm legitimate people or projects",
            "Don't use this service for illegal purposes",
            "Don't try to abuse or manipulate the system",
          ],
        },
        {
          icon: Scale,
          title: "Legal Information",
          items: [
            "These terms are governed by UAE law",
            "We reserve the right to update these terms",
            "Continued use after changes means you accept the new terms",
            "If any part of these terms is invalid, the rest still applies",
          ],
        },
      ],
      educationalNote: "Educational Purpose",
      educationalDesc: "UAE7Guard is designed for educational and awareness purposes. We help users learn about cryptocurrency scams and check addresses, but we are not a substitute for professional financial or legal advice.",
      updated: "Last updated: January 2026",
    },
    ar: {
      title: "شروط الخدمة",
      subtitle: "تاريخ السريان: يناير 2026",
      intro: "باستخدام UAE7Guard، أنت توافق على هذه الشروط البسيطة. لقد جعلناها سهلة الفهم.",
      sections: [
        {
          icon: Shield,
          title: "ما تقدمه هذه الخدمة",
          items: [
            "فحص عناوين المحافظ مقابل قاعدة بيانات الاحتيال لدينا",
            "محتوى تعليمي حول عمليات الاحتيال في العملات الرقمية",
            "طريقة للإبلاغ عن العناوين المشبوهة",
            "معلومات لمساعدتك على اتخاذ قرارات أكثر أمانًا",
          ],
        },
        {
          icon: AlertTriangle,
          title: "إخلاء المسؤولية المهم",
          items: [
            "هذه ليست نصيحة مالية - استشر دائمًا المتخصصين للقرارات المالية",
            "هذه ليست نصيحة قانونية - استشر محاميًا للمسائل القانونية",
            "النتائج للمعلومات فقط - تحقق بشكل مستقل قبل اتخاذ القرارات",
            "لا يمكننا ضمان أن قاعدة بياناتنا تحتوي على كل عناوين الاحتيال",
            "النتيجة النظيفة لا تضمن أن العنوان آمن",
          ],
        },
        {
          icon: Users,
          title: "مسؤولياتك",
          items: [
            "قدم فقط معلومات صحيحة عند الإبلاغ عن العناوين",
            "لا تقدم تقارير كاذبة لإلحاق الضرر بأشخاص أو مشاريع شرعية",
            "لا تستخدم هذه الخدمة لأغراض غير قانونية",
            "لا تحاول إساءة استخدام النظام أو التلاعب به",
          ],
        },
        {
          icon: Scale,
          title: "المعلومات القانونية",
          items: [
            "تخضع هذه الشروط لقانون دولة الإمارات العربية المتحدة",
            "نحتفظ بالحق في تحديث هذه الشروط",
            "الاستمرار في الاستخدام بعد التغييرات يعني قبولك للشروط الجديدة",
            "إذا كان أي جزء من هذه الشروط غير صالح، فإن الباقي لا يزال ساريًا",
          ],
        },
      ],
      educationalNote: "الغرض التعليمي",
      educationalDesc: "تم تصميم UAE7Guard للأغراض التعليمية والتوعوية. نحن نساعد المستخدمين على التعرف على عمليات الاحتيال في العملات الرقمية وفحص العناوين، لكننا لسنا بديلاً عن النصيحة المالية أو القانونية المهنية.",
      updated: "آخر تحديث: يناير 2026",
    },
  };

  const t = content[language];

  return (
    <div className={`container mx-auto max-w-4xl py-8 px-4 ${isRTL ? "text-right" : "text-left"}`}>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-terms-title">{t.title}</h1>
            <p className="text-sm text-muted-foreground">{t.subtitle}</p>
          </div>
        </div>
        <p className="text-muted-foreground">{t.intro}</p>
      </div>

      <div className="space-y-6">
        {t.sections.map((section) => (
          <Card key={section.title}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <section.icon className="h-5 w-5 text-primary" />
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {section.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-primary mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}

        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="h-5 w-5" />
              {t.educationalNote}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>{t.educationalDesc}</p>
          </CardContent>
        </Card>

        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-4 text-sm text-muted-foreground">
            <p className="font-medium">{t.updated}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
