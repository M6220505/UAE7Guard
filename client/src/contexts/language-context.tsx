import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type Language = "en" | "ar";

interface Translations {
  // Navigation
  home: string;
  aboutUs: string;
  checkTool: string;
  learningCenter: string;
  faq: string;
  contactUs: string;
  privacy: string;
  terms: string;
  
  // Home page
  startCheck: string;
  heroTitle: string;
  heroSubtitle: string;
  checkWalletAddress: string;
  checkWalletPlaceholder: string;
  checkButton: string;
  
  // Trust indicators
  aesEncrypted: string;
  pdplCompliant: string;
  realTimeProtection: string;
  
  // Results
  addressSafe: string;
  addressSafeDesc: string;
  addressDangerous: string;
  addressDangerousDesc: string;
  addressMediumRisk: string;
  addressMediumRiskDesc: string;
  amountLost: string;
  confirmedReports: string;
  pendingReports: string;
  
  // Features
  featuresTitle: string;
  featuresSubtitle: string;
  
  // CTA
  ctaTitle: string;
  ctaSubtitle: string;
  tryNow: string;
  learnMore: string;
  
  // Footer
  footerCompliance: string;
  educationalDisclaimer: string;
}

const translations: Record<Language, Translations> = {
  en: {
    // Navigation
    home: "Home",
    aboutUs: "About Us",
    checkTool: "Check Tool",
    learningCenter: "Learning Center",
    faq: "FAQ",
    contactUs: "Contact Us",
    privacy: "Privacy",
    terms: "Terms",
    
    // Home page
    startCheck: "Start Check",
    heroTitle: "Protect Yourself from Crypto Scams",
    heroSubtitle: "Verify wallet addresses against known scam reports. Check before you send.",
    checkWalletAddress: "Check Wallet Address",
    checkWalletPlaceholder: "Enter wallet address to check...",
    checkButton: "Check",
    
    // Trust indicators
    aesEncrypted: "AES-256 Encrypted",
    pdplCompliant: "UAE Data Protection Compliant",
    realTimeProtection: "Real-Time Protection",
    
    // Results
    addressSafe: "Address is Safe",
    addressSafeDesc: "No scam reports found for this address in our database.",
    addressDangerous: "Warning: Dangerous Address",
    addressDangerousDesc: "This address has been reported and verified as involved in scam activity.",
    addressMediumRisk: "Caution: Under Review",
    addressMediumRiskDesc: "This address has pending reports that are being verified.",
    amountLost: "Reported losses",
    confirmedReports: "confirmed report(s)",
    pendingReports: "pending report(s)",
    
    // Features
    featuresTitle: "How We Protect You",
    featuresSubtitle: "Simple tools to help you stay safe in the crypto world.",
    
    // CTA
    ctaTitle: "Check an Address Now",
    ctaSubtitle: "Quick and confidential. Your search is not stored.",
    tryNow: "Try Now",
    learnMore: "Learn More",
    
    // Footer
    footerCompliance: "Compliant with UAE Federal Decree-Law No. 45 of 2021",
    educationalDisclaimer: "For educational purposes only. Not financial or legal advice.",
  },
  ar: {
    // Navigation
    home: "الرئيسية",
    aboutUs: "من نحن",
    checkTool: "أداة الفحص",
    learningCenter: "مركز التعلم",
    faq: "الأسئلة الشائعة",
    contactUs: "اتصل بنا",
    privacy: "الخصوصية",
    terms: "الشروط",
    
    // Home page
    startCheck: "ابدأ الفحص",
    heroTitle: "احمِ نفسك من عمليات الاحتيال في العملات الرقمية",
    heroSubtitle: "أداة للتحقق من عناوين المحافظ مقابل تقارير الاحتيال المعروفة. تحقق قبل الإرسال.",
    checkWalletAddress: "فحص عنوان محفظة",
    checkWalletPlaceholder: "أدخل عنوان المحفظة للتحقق...",
    checkButton: "فحص",
    
    // Trust indicators
    aesEncrypted: "تشفير AES-256",
    pdplCompliant: "متوافق مع قانون حماية البيانات الإماراتي",
    realTimeProtection: "حماية في الوقت الفعلي",
    
    // Results
    addressSafe: "العنوان آمن",
    addressSafeDesc: "لم يتم العثور على تقارير احتيال لهذا العنوان في قاعدة بياناتنا.",
    addressDangerous: "تحذير: عنوان خطير",
    addressDangerousDesc: "تم الإبلاغ عن هذا العنوان والتحقق من تورطه في نشاط احتيالي.",
    addressMediumRisk: "تنبيه: قيد المراجعة",
    addressMediumRiskDesc: "هذا العنوان لديه تقارير معلقة قيد التحقق.",
    amountLost: "الخسائر المبلغ عنها",
    confirmedReports: "تقرير(تقارير) مؤكدة",
    pendingReports: "تقرير(تقارير) معلقة",
    
    // Features
    featuresTitle: "كيف نحميك",
    featuresSubtitle: "أدوات بسيطة لمساعدتك على البقاء آمنًا في عالم العملات الرقمية.",
    
    // CTA
    ctaTitle: "افحص عنوانًا الآن",
    ctaSubtitle: "سريع وسري. لا يتم تخزين بحثك.",
    tryNow: "جرب الآن",
    learnMore: "اعرف المزيد",
    
    // Footer
    footerCompliance: "متوافق مع المرسوم الاتحادي الإماراتي رقم 45 لسنة 2021",
    educationalDisclaimer: "للأغراض التعليمية فقط. ليست نصيحة مالية أو قانونية.",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("language");
      if (saved === "ar" || saved === "en") return saved;
    }
    return "en";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language],
    isRTL: language === "ar",
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
