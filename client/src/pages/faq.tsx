import { HelpCircle, Search, Shield, AlertTriangle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useLanguage } from "@/contexts/language-context";

export default function FAQ() {
  const { language, isRTL } = useLanguage();

  const content = {
    en: {
      title: "Frequently Asked Questions",
      subtitle: "Answers to common questions about using our wallet address check tool",
      categories: [
        {
          title: "Using the Check Tool",
          icon: Search,
          questions: [
            {
              q: "How do I check if a wallet address is safe?",
              a: "Simply paste the wallet address into the search box on our home page and click 'Check'. We'll instantly search our database of reported scam addresses and show you the results.",
            },
            {
              q: "What do the different result colors mean?",
              a: "Green means the address is clean - we have no reports of scam activity. Yellow means the address has pending reports that are being verified. Red means the address has been verified as involved in scam activity.",
            },
            {
              q: "Is my search stored or tracked?",
              a: "No. We do not store the addresses you search for or link them to any personal information. Your searches are completely private.",
            },
            {
              q: "What types of wallet addresses can I check?",
              a: "You can check addresses from major blockchains including Ethereum (0x...), Bitcoin (1..., 3..., bc1...), and Tron (T...). We're continuously expanding our coverage.",
            },
          ],
        },
        {
          title: "Understanding Results",
          icon: Shield,
          questions: [
            {
              q: "What should I do if an address shows as dangerous?",
              a: "Do not send any funds to that address. If you were about to do business with someone who provided this address, consider this a major warning sign. You may want to stop all communication with them.",
            },
            {
              q: "What if an address shows as clean but I still have doubts?",
              a: "A clean result means we have no reports about that address, but it doesn't guarantee it's safe. Always do your own research, especially for large transactions. Trust your instincts - if something feels wrong, proceed with caution.",
            },
            {
              q: "What does 'Under Review' mean?",
              a: "This means someone has reported this address but our team hasn't verified the report yet. We recommend being extra cautious with addresses in this status.",
            },
            {
              q: "How accurate is your database?",
              a: "All reports in our database are verified by our team before being confirmed. However, scammers create new addresses constantly, so a clean result doesn't guarantee an address is safe. Always exercise caution.",
            },
          ],
        },
        {
          title: "Reporting Scams",
          icon: AlertTriangle,
          questions: [
            {
              q: "How can I report a suspicious address?",
              a: "You can report a suspicious address through our Contact page. Please include as much detail as possible: the wallet address, type of scam, any evidence, and the amount lost if applicable.",
            },
            {
              q: "What happens after I report an address?",
              a: "Our team reviews all reports. If verified, the address is added to our database and will appear in future searches. This helps protect others from the same scam.",
            },
            {
              q: "Do I need to create an account to report?",
              a: "No, you can report addresses without creating an account. However, we may not be able to follow up with you if we need more information.",
            },
          ],
        },
        {
          title: "About This Service",
          icon: CheckCircle,
          questions: [
            {
              q: "How do I use this service?",
              a: "Simply paste a wallet address into the check tool and get instant results. We believe everyone should have access to tools that help protect them from scams.",
            },
            {
              q: "Who runs this service?",
              a: "We are a team dedicated to protecting users in the UAE and beyond from cryptocurrency fraud. Learn more on our About page.",
            },
            {
              q: "Is my data safe?",
              a: "Yes. We use AES-256 encryption and comply with UAE data protection laws. We don't collect personal information when you use the check tool.",
            },
            {
              q: "Can I use this information as legal evidence?",
              a: "Our service is for informational and educational purposes only. Results should not be used as the sole basis for legal action. Consult with legal professionals for any legal matters.",
            },
          ],
        },
      ],
    },
    ar: {
      title: "الأسئلة الشائعة",
      subtitle: "إجابات على الأسئلة الشائعة حول استخدام أداة فحص عناوين المحافظ",
      categories: [
        {
          title: "استخدام أداة الفحص",
          icon: Search,
          questions: [
            {
              q: "كيف أتحقق مما إذا كان عنوان المحفظة آمنًا؟",
              a: "ببساطة الصق عنوان المحفظة في مربع البحث على صفحتنا الرئيسية وانقر على 'فحص'. سنبحث على الفور في قاعدة بياناتنا للعناوين المبلغ عنها كاحتيالية ونعرض لك النتائج.",
            },
            {
              q: "ماذا تعني ألوان النتائج المختلفة؟",
              a: "الأخضر يعني أن العنوان نظيف - ليس لدينا تقارير عن نشاط احتيالي. الأصفر يعني أن العنوان لديه تقارير معلقة قيد التحقق. الأحمر يعني أنه تم التحقق من تورط العنوان في نشاط احتيالي.",
            },
            {
              q: "هل يتم تخزين بحثي أو تتبعه؟",
              a: "لا. نحن لا نقوم بتخزين العناوين التي تبحث عنها أو ربطها بأي معلومات شخصية. عمليات البحث الخاصة بك خاصة تمامًا.",
            },
            {
              q: "ما أنواع عناوين المحافظ التي يمكنني فحصها؟",
              a: "يمكنك فحص العناوين من البلوكتشين الرئيسية بما في ذلك إيثريوم (0x...) وبيتكوين (1...، 3...، bc1...) وترون (T...). نحن نوسع تغطيتنا باستمرار.",
            },
          ],
        },
        {
          title: "فهم النتائج",
          icon: Shield,
          questions: [
            {
              q: "ماذا أفعل إذا ظهر العنوان كخطير؟",
              a: "لا ترسل أي أموال إلى هذا العنوان. إذا كنت على وشك القيام بأعمال مع شخص قدم هذا العنوان، اعتبر هذا علامة تحذير كبيرة. قد ترغب في إيقاف جميع الاتصالات معهم.",
            },
            {
              q: "ماذا لو ظهر العنوان كنظيف لكن لا زلت أشك؟",
              a: "النتيجة النظيفة تعني أنه ليس لدينا تقارير عن هذا العنوان، لكنها لا تضمن أنه آمن. قم دائمًا بإجراء بحثك الخاص، خاصة للمعاملات الكبيرة. ثق بحدسك - إذا شعرت بشيء خاطئ، تابع بحذر.",
            },
            {
              q: "ماذا تعني 'قيد المراجعة'؟",
              a: "هذا يعني أن شخصًا ما أبلغ عن هذا العنوان لكن فريقنا لم يتحقق من التقرير بعد. نوصي بأن تكون حذرًا جدًا مع العناوين في هذه الحالة.",
            },
            {
              q: "ما مدى دقة قاعدة بياناتكم؟",
              a: "يتم التحقق من جميع التقارير في قاعدة بياناتنا من قبل فريقنا قبل تأكيدها. ومع ذلك، يقوم المحتالون بإنشاء عناوين جديدة باستمرار، لذا فإن النتيجة النظيفة لا تضمن أن العنوان آمن. توخى الحذر دائمًا.",
            },
          ],
        },
        {
          title: "الإبلاغ عن الاحتيال",
          icon: AlertTriangle,
          questions: [
            {
              q: "كيف يمكنني الإبلاغ عن عنوان مشبوه؟",
              a: "يمكنك الإبلاغ عن عنوان مشبوه من خلال صفحة اتصل بنا. يرجى تضمين أكبر قدر ممكن من التفاصيل: عنوان المحفظة، نوع الاحتيال، أي دليل، والمبلغ المفقود إن أمكن.",
            },
            {
              q: "ماذا يحدث بعد الإبلاغ عن عنوان؟",
              a: "يراجع فريقنا جميع التقارير. إذا تم التحقق، يتم إضافة العنوان إلى قاعدة بياناتنا وسيظهر في عمليات البحث المستقبلية. هذا يساعد في حماية الآخرين من نفس الاحتيال.",
            },
            {
              q: "هل أحتاج إلى إنشاء حساب للإبلاغ؟",
              a: "لا، يمكنك الإبلاغ عن العناوين دون إنشاء حساب. ومع ذلك، قد لا نتمكن من المتابعة معك إذا احتجنا إلى مزيد من المعلومات.",
            },
          ],
        },
        {
          title: "حول هذه الخدمة",
          icon: CheckCircle,
          questions: [
            {
              q: "كيف يمكنني استخدام هذه الخدمة؟",
              a: "فقط الصق عنوان المحفظة في أداة الفحص واحصل على نتائج فورية. نحن نؤمن بأن الجميع يجب أن يكون لديهم إمكانية الوصول إلى أدوات تساعد في حمايتهم من الاحتيال.",
            },
            {
              q: "من يدير هذه الخدمة؟",
              a: "نحن فريق مكرس لحماية المستخدمين في الإمارات وخارجها من الاحتيال في العملات الرقمية. تعرف على المزيد في صفحة من نحن.",
            },
            {
              q: "هل بياناتي آمنة؟",
              a: "نعم. نستخدم تشفير AES-256 ونلتزم بقوانين حماية البيانات في الإمارات. نحن لا نجمع معلومات شخصية عند استخدام أداة الفحص.",
            },
            {
              q: "هل يمكنني استخدام هذه المعلومات كدليل قانوني؟",
              a: "خدمتنا للأغراض المعلوماتية والتعليمية فقط. لا ينبغي استخدام النتائج كأساس وحيد للإجراءات القانونية. استشر المتخصصين القانونيين في أي مسائل قانونية.",
            },
          ],
        },
      ],
    },
  };

  const t = content[language];

  return (
    <div className={`container mx-auto max-w-4xl py-8 px-4 ${isRTL ? "text-right" : "text-left"}`}>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
            <HelpCircle className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-faq-title">{t.title}</h1>
            <p className="text-sm text-muted-foreground">{t.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {t.categories.map((category, categoryIndex) => (
          <Card key={categoryIndex}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <category.icon className="h-5 w-5 text-primary" />
                {category.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {category.questions.map((item, index) => (
                  <AccordionItem key={index} value={`item-${categoryIndex}-${index}`}>
                    <AccordionTrigger className={`${isRTL ? "text-right" : "text-left"}`}>
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
