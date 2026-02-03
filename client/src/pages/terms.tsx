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
          title: "Important Disclaimers & Limitations",
          items: [
            "NOT FINANCIAL ADVICE: This service does NOT provide financial, investment, or trading advice. Always consult licensed financial professionals",
            "NOT LEGAL ADVICE: This service does NOT provide legal advice or opinions. Consult a qualified lawyer for legal matters",
            "NO GUARANTEES: We provide information 'AS IS' without warranties of any kind, express or implied",
            "COMMUNITY DATA: Results are based on community reports which may be inaccurate, incomplete, or false",
            "CLEAN ≠ SAFE: A clean result does NOT guarantee an address is safe - it only means no reports exist in our database",
            "RISK ≠ SCAM: Risk indicators do NOT prove an address is malicious - they are warnings to investigate further",
            "LIMITED LIABILITY: We are NOT responsible for any losses, damages, or decisions you make based on this service",
            "NO WARRANTY: We do not warrant the accuracy, completeness, or reliability of any information provided",
          ],
        },
        {
          icon: Users,
          title: "Your Responsibilities & Consequences",
          items: [
            "TRUTHFUL REPORTING: You must only submit accurate and truthful information when reporting addresses",
            "NO FALSE REPORTS: Submitting false, malicious, or misleading reports is strictly prohibited",
            "ACCOUNT TERMINATION: We reserve the right to suspend or terminate accounts that submit false reports or abuse the system",
            "LEGAL ACTION: False reports intended to harm others may result in legal action and liability",
            "NO ILLEGAL USE: Do not use this service for any illegal, harmful, or fraudulent purposes",
            "NO MANIPULATION: Do not attempt to abuse, manipulate, or circumvent the system or its safeguards",
            "VERIFICATION: We may investigate reports and may contact you for additional evidence or clarification",
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
          title: "إخلاء المسؤولية والقيود المهمة",
          items: [
            "ليست نصيحة مالية: هذه الخدمة لا تقدم نصائح مالية أو استثمارية أو تجارية. استشر دائماً متخصصين ماليين مرخصين",
            "ليست نصيحة قانونية: هذه الخدمة لا تقدم نصائح أو آراء قانونية. استشر محامياً مؤهلاً للمسائل القانونية",
            "بدون ضمانات: نحن نقدم المعلومات 'كما هي' بدون ضمانات من أي نوع، صريحة أو ضمنية",
            "بيانات مجتمعية: النتائج مبنية على تقارير مجتمعية قد تكون غير دقيقة أو غير كاملة أو خاطئة",
            "نظيف ≠ آمن: النتيجة النظيفة لا تضمن أن العنوان آمن - تعني فقط عدم وجود تقارير في قاعدة بياناتنا",
            "خطر ≠ احتيال: مؤشرات الخطر لا تثبت أن العنوان خبيث - إنما هي تحذيرات للتحقيق أكثر",
            "مسؤولية محدودة: نحن غير مسؤولين عن أي خسائر أو أضرار أو قرارات تتخذها بناءً على هذه الخدمة",
            "بدون ضمان: نحن لا نضمن دقة أو اكتمال أو موثوقية أي معلومات مقدمة",
          ],
        },
        {
          icon: Users,
          title: "مسؤولياتك والعواقب",
          items: [
            "الإبلاغ الصادق: يجب عليك تقديم معلومات دقيقة وصادقة فقط عند الإبلاغ عن العناوين",
            "عدم التقارير الكاذبة: تقديم تقارير كاذبة أو خبيثة أو مضللة محظور بشكل صارم",
            "إنهاء الحساب: نحتفظ بالحق في تعليق أو إنهاء الحسابات التي تقدم تقارير كاذبة أو تسيء استخدام النظام",
            "إجراء قانوني: التقارير الكاذبة التي تهدف إلى إلحاق الضرر بالآخرين قد تؤدي إلى إجراء قانوني ومسؤولية",
            "عدم الاستخدام غير القانوني: لا تستخدم هذه الخدمة لأي أغراض غير قانونية أو ضارة أو احتيالية",
            "عدم التلاعب: لا تحاول إساءة استخدام أو التلاعب أو تجاوز النظام أو ضماناته",
            "التحقق: قد نحقق في التقارير وقد نتواصل معك للحصول على أدلة إضافية أو توضيح",
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
