import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, MessageSquare, AlertTriangle, Send, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/language-context";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  suspiciousAddress: z.string().optional(),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function Contact() {
  const { toast } = useToast();
  const { language, isRTL } = useLanguage();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const content = {
    en: {
      title: "Contact Us",
      subtitle: "Have a question or want to report a suspicious address? We're here to help.",
      formTitle: "Send us a Message",
      formDescription: "Fill out the form below and we'll get back to you as soon as possible.",
      nameLabel: "Your Name",
      namePlaceholder: "Enter your name",
      emailLabel: "Email Address",
      emailPlaceholder: "your@email.com",
      subjectLabel: "Subject",
      subjectPlaceholder: "Select a subject",
      subjects: {
        general: "General Question",
        report: "Report Suspicious Address",
        feedback: "Feedback",
        help: "Help Using the Tool",
      },
      addressLabel: "Suspicious Address (Optional)",
      addressPlaceholder: "0x... or wallet address",
      messageLabel: "Message",
      messagePlaceholder: "Describe your question or provide details about the suspicious activity...",
      sendButton: "Send Message",
      successTitle: "Message Sent!",
      successMessage: "Thank you for contacting us. We'll review your message and respond if needed.",
      reportInfo: "Reporting a Suspicious Address?",
      reportInfoDesc: "When reporting a suspicious address, please include as much detail as possible: the wallet address, type of scam, any evidence or transaction hashes, and the approximate amount lost.",
    },
    ar: {
      title: "اتصل بنا",
      subtitle: "لديك سؤال أو تريد الإبلاغ عن عنوان مشبوه؟ نحن هنا للمساعدة.",
      formTitle: "أرسل لنا رسالة",
      formDescription: "املأ النموذج أدناه وسنرد عليك في أقرب وقت ممكن.",
      nameLabel: "اسمك",
      namePlaceholder: "أدخل اسمك",
      emailLabel: "عنوان البريد الإلكتروني",
      emailPlaceholder: "your@email.com",
      subjectLabel: "الموضوع",
      subjectPlaceholder: "اختر موضوعًا",
      subjects: {
        general: "سؤال عام",
        report: "الإبلاغ عن عنوان مشبوه",
        feedback: "ملاحظات",
        help: "مساعدة في استخدام الأداة",
      },
      addressLabel: "العنوان المشبوه (اختياري)",
      addressPlaceholder: "0x... أو عنوان المحفظة",
      messageLabel: "الرسالة",
      messagePlaceholder: "صف سؤالك أو قدم تفاصيل حول النشاط المشبوه...",
      sendButton: "إرسال الرسالة",
      successTitle: "تم إرسال الرسالة!",
      successMessage: "شكرًا لتواصلك معنا. سنراجع رسالتك ونرد إذا لزم الأمر.",
      reportInfo: "الإبلاغ عن عنوان مشبوه؟",
      reportInfoDesc: "عند الإبلاغ عن عنوان مشبوه، يرجى تضمين أكبر قدر ممكن من التفاصيل: عنوان المحفظة، نوع الاحتيال، أي دليل أو هاشات المعاملات، والمبلغ التقريبي المفقود.",
    },
  };

  const t = content[language];

  const form = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      suspiciousAddress: "",
    },
  });

  const onSubmit = (data: ContactForm) => {
    console.log("Contact form submitted:", data);
    setIsSubmitted(true);
    toast({
      title: t.successTitle,
      description: t.successMessage,
    });
  };

  if (isSubmitted) {
    return (
      <div className={`container mx-auto max-w-2xl py-16 px-4 text-center ${isRTL ? "text-right" : "text-left"}`}>
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold">{t.successTitle}</h1>
          <p className="text-muted-foreground">{t.successMessage}</p>
          <Button onClick={() => setIsSubmitted(false)} variant="outline" className="mt-4">
            {language === "en" ? "Send Another Message" : "إرسال رسالة أخرى"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`container mx-auto max-w-2xl py-8 px-4 ${isRTL ? "text-right" : "text-left"}`}>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-contact-title">{t.title}</h1>
            <p className="text-sm text-muted-foreground">{t.subtitle}</p>
          </div>
        </div>
      </div>

      <Card className="mb-6 border-amber-500/30 bg-amber-500/5">
        <CardContent className="flex items-start gap-3 p-4">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-500 mt-0.5" />
          <div>
            <p className="font-medium text-amber-600 dark:text-amber-400">{t.reportInfo}</p>
            <p className="text-sm text-muted-foreground mt-1">{t.reportInfoDesc}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            {t.formTitle}
          </CardTitle>
          <CardDescription>{t.formDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.nameLabel}</FormLabel>
                    <FormControl>
                      <Input placeholder={t.namePlaceholder} {...field} data-testid="input-contact-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.emailLabel}</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder={t.emailPlaceholder} {...field} data-testid="input-contact-email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.subjectLabel}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-contact-subject">
                          <SelectValue placeholder={t.subjectPlaceholder} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="general">{t.subjects.general}</SelectItem>
                        <SelectItem value="report">{t.subjects.report}</SelectItem>
                        <SelectItem value="feedback">{t.subjects.feedback}</SelectItem>
                        <SelectItem value="help">{t.subjects.help}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="suspiciousAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.addressLabel}</FormLabel>
                    <FormControl>
                      <Input placeholder={t.addressPlaceholder} className="font-mono" {...field} data-testid="input-contact-address" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.messageLabel}</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder={t.messagePlaceholder}
                        className="min-h-32 resize-none"
                        {...field}
                        data-testid="textarea-contact-message"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full gap-2" data-testid="button-contact-submit">
                <Send className="h-4 w-4" />
                {t.sendButton}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
