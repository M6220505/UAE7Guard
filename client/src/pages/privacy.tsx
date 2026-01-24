import { Shield, Lock, Eye, FileText, Scale, Smartphone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/language-context";

export default function Privacy() {
  const { language, isRTL } = useLanguage();

  const content = {
    en: {
      title: "Privacy Policy",
      subtitle: "PDPL Compliant - UAE Federal Decree Law No. 45 of 2021",
      intro: "UAE7Guard minimizes data collection. Limited information may be processed to provide core functionality, improve reliability, and prevent abuse. We do not sell personal data. This policy explains what information we collect and how we use it.",
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
          title: "What We Do Collect",
          items: [
            "Account Data: If you create an account - email address, encrypted password, and profile information",
            "Report Submissions: When you submit a report - the scammer address, scam details, and evidence you provide",
            "Contact Information: If you contact us - your name, email, and message content",
            "Subscription Data: If you subscribe - payment information processed securely through Stripe (we do not store card details)",
            "Session Data: Temporary session tokens for authentication (automatically deleted when you log out)",
            "Usage Analytics: Anonymous, aggregated statistics to improve the service (no personal identification)",
          ],
        },
        {
          icon: Smartphone,
          title: "Mobile App Permissions (iOS)",
          items: [
            "Camera Access: Only used to scan QR codes for wallet addresses. Images are not stored or transmitted.",
            "Photo Library: Only used to import wallet address QR codes. We do not access, store, or transmit your photos.",
            "Face ID / Touch ID: Only used for secure authentication to your account. Biometric data never leaves your device.",
            "All permissions are optional and only requested when you use the specific feature.",
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
          title: "Your Rights & Data Control",
          items: [
            "Access: You can request to see what data we have about you at any time",
            "Deletion: You can request deletion of your account and associated data (reports may be anonymized for community safety)",
            "Correction: You can request corrections to any inaccurate personal information",
            "Objection: You can object to processing of your personal data for certain purposes",
            "Portability: You can request a copy of your data in a machine-readable format",
            "Retention: Account data is retained while your account is active. Deleted accounts are purged within 30 days",
            "Contact: Reach out to us at any time with privacy concerns or data requests",
          ],
        },
      ],
      note: "This service is provided for educational and informational purposes only. We aim to help users make informed decisions about cryptocurrency transactions.",
      updated: "Last updated: January 2026",
    },
    ar: {
      title: "سياسة الخصوصية",
      subtitle: "متوافق مع قانون حماية البيانات الشخصية - المرسوم الاتحادي رقم 45 لسنة 2021",
      intro: "يقلل UAE7Guard من جمع البيانات. قد تتم معالجة معلومات محدودة لتوفير الوظائف الأساسية وتحسين الموثوقية ومنع إساءة الاستخدام. نحن لا نبيع البيانات الشخصية. توضح هذه السياسة المعلومات التي نجمعها وكيفية استخدامها.",
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
          title: "ما نجمعه",
          items: [
            "بيانات الحساب: إذا أنشأت حساباً - عنوان البريد الإلكتروني، كلمة المرور المشفرة، ومعلومات الملف الشخصي",
            "تقديم التقارير: عند تقديم تقرير - عنوان المحتال، تفاصيل الاحتيال، والأدلة التي تقدمها",
            "معلومات الاتصال: إذا تواصلت معنا - اسمك وبريدك الإلكتروني ومحتوى الرسالة",
            "بيانات الاشتراك: إذا اشتركت - معلومات الدفع المعالجة بشكل آمن عبر Stripe (لا نخزن تفاصيل البطاقة)",
            "بيانات الجلسة: رموز جلسة مؤقتة للمصادقة (يتم حذفها تلقائياً عند تسجيل الخروج)",
            "تحليلات الاستخدام: إحصائيات مجمعة ومجهولة لتحسين الخدمة (بدون تحديد شخصي)",
          ],
        },
        {
          icon: Smartphone,
          title: "أذونات تطبيق الهاتف المحمول (iOS)",
          items: [
            "الوصول إلى الكاميرا: يُستخدم فقط لمسح رموز QR لعناوين المحافظ. لا يتم تخزين الصور أو إرسالها.",
            "مكتبة الصور: يُستخدم فقط لاستيراد رموز QR لعناوين المحافظ. نحن لا نصل إلى صورك أو نخزنها أو نرسلها.",
            "Face ID / Touch ID: يُستخدم فقط للمصادقة الآمنة على حسابك. البيانات البيومترية لا تغادر جهازك أبدًا.",
            "جميع الأذونات اختيارية ويتم طلبها فقط عند استخدام الميزة المحددة.",
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
          title: "حقوقك والتحكم في البيانات",
          items: [
            "الوصول: يمكنك طلب الاطلاع على البيانات التي لدينا عنك في أي وقت",
            "الحذف: يمكنك طلب حذف حسابك والبيانات المرتبطة به (قد يتم إخفاء هوية التقارير لسلامة المجتمع)",
            "التصحيح: يمكنك طلب تصحيح أي معلومات شخصية غير دقيقة",
            "الاعتراض: يمكنك الاعتراض على معالجة بياناتك الشخصية لأغراض معينة",
            "قابلية النقل: يمكنك طلب نسخة من بياناتك بتنسيق قابل للقراءة آلياً",
            "الاحتفاظ: يتم الاحتفاظ ببيانات الحساب طالما حسابك نشط. يتم حذف الحسابات المحذوفة خلال 30 يوماً",
            "الاتصال: تواصل معنا في أي وقت بشأن مخاوف الخصوصية أو طلبات البيانات",
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
