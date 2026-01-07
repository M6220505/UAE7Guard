import { Shield, Lock, Eye, FileText, Scale } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/language-context";

export default function Privacy() {
  const { language, isRTL } = useLanguage();

  const content = {
    en: {
      title: "Privacy Policy",
      subtitle: "PDPL Compliant - UAE Federal Decree Law No. 45 of 2021",
      intro: "UAE7Guard is committed to protecting your privacy. This policy explains what information we collect and how we use it.",
      sections: [
        {
          icon: Eye,
          title: "What We Don't Collect",
          items: [
            "We do NOT store the wallet addresses you search for",
            "We do NOT track your search history",
            "We do NOT link searches to your identity",
            "We do NOT sell or share your personal information",
          ],
        },
        {
          icon: FileText,
          title: "What We May Collect",
          items: [
            "If you submit a report: the information you provide (address, scam type, description)",
            "If you contact us: your name, email, and message content",
            "Anonymous usage statistics to improve the service",
          ],
        },
        {
          icon: Lock,
          title: "How We Protect Your Data",
          items: [
            "All data is encrypted using AES-256 encryption",
            "Secure HTTPS connections for all communications",
            "Regular security audits and updates",
            "Limited staff access to any stored data",
          ],
        },
        {
          icon: Scale,
          title: "Your Rights",
          items: [
            "You can request deletion of any data you've submitted",
            "You can ask what information we have about you",
            "You can object to processing of your personal data",
            "Contact us at any time with privacy concerns",
          ],
        },
      ],
      note: "This service is provided for educational and informational purposes only. We aim to help users make informed decisions about cryptocurrency transactions.",
      updated: "Last updated: January 2026",
    },
    ar: {
      title: "سياسة الخصوصية",
      subtitle: "متوافق مع قانون حماية البيانات الشخصية - المرسوم الاتحادي رقم 45 لسنة 2021",
      intro: "تلتزم UAE7Guard بحماية خصوصيتك. توضح هذه السياسة المعلومات التي نجمعها وكيفية استخدامها.",
      sections: [
        {
          icon: Eye,
          title: "ما لا نجمعه",
          items: [
            "لا نقوم بتخزين عناوين المحافظ التي تبحث عنها",
            "لا نتتبع سجل البحث الخاص بك",
            "لا نربط عمليات البحث بهويتك",
            "لا نبيع أو نشارك معلوماتك الشخصية",
          ],
        },
        {
          icon: FileText,
          title: "ما قد نجمعه",
          items: [
            "إذا قدمت تقريرًا: المعلومات التي تقدمها (العنوان، نوع الاحتيال، الوصف)",
            "إذا تواصلت معنا: اسمك وبريدك الإلكتروني ومحتوى الرسالة",
            "إحصائيات استخدام مجهولة لتحسين الخدمة",
          ],
        },
        {
          icon: Lock,
          title: "كيف نحمي بياناتك",
          items: [
            "يتم تشفير جميع البيانات باستخدام تشفير AES-256",
            "اتصالات HTTPS آمنة لجميع الاتصالات",
            "تدقيق أمني منتظم وتحديثات",
            "وصول محدود للموظفين إلى أي بيانات مخزنة",
          ],
        },
        {
          icon: Scale,
          title: "حقوقك",
          items: [
            "يمكنك طلب حذف أي بيانات قدمتها",
            "يمكنك السؤال عن المعلومات التي لدينا عنك",
            "يمكنك الاعتراض على معالجة بياناتك الشخصية",
            "تواصل معنا في أي وقت بشأن مخاوف الخصوصية",
          ],
        },
      ],
      note: "يتم تقديم هذه الخدمة للأغراض التعليمية والمعلوماتية فقط. نهدف إلى مساعدة المستخدمين على اتخاذ قرارات مستنيرة بشأن معاملات العملات الرقمية.",
      updated: "آخر تحديث: يناير 2026",
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
            <h1 className="text-2xl font-bold" data-testid="text-privacy-title">{t.title}</h1>
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

        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-4 text-sm text-muted-foreground">
            <p>{t.note}</p>
            <p className="mt-2 font-medium">{t.updated}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
