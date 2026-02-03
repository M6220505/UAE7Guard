import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, X, Smartphone } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const { language, isRTL } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    setIsIOS(isIOSDevice);

    if (isStandalone) {
      return;
    }

    if (isIOSDevice) {
      const dismissed = localStorage.getItem("pwa-install-dismissed");
      if (!dismissed) {
        setTimeout(() => setShowPrompt(true), 3000);
      }
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      const dismissed = localStorage.getItem("pwa-install-dismissed");
      if (!dismissed) {
        setTimeout(() => setShowPrompt(true), 2000);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("pwa-install-dismissed", "true");
  };

  if (!showPrompt) return null;

  const translations = {
    en: {
      title: "Install UAE7Guard",
      description: "Add to your home screen for quick access",
      install: "Install App",
      iosTitle: "Install on iPhone/iPad",
      iosStep1: "Tap the Share button",
      iosStep2: "Scroll down and tap \"Add to Home Screen\"",
      iosStep3: "Tap \"Add\" to confirm",
      gotIt: "Got it!",
      showInstructions: "How to Install"
    },
    ar: {
      title: "تثبيت UAE7Guard",
      description: "أضفه إلى شاشتك الرئيسية للوصول السريع",
      install: "تثبيت التطبيق",
      iosTitle: "التثبيت على iPhone/iPad",
      iosStep1: "اضغط على زر المشاركة",
      iosStep2: "مرر للأسفل واضغط على \"إضافة إلى الشاشة الرئيسية\"",
      iosStep3: "اضغط على \"إضافة\" للتأكيد",
      gotIt: "فهمت!",
      showInstructions: "كيفية التثبيت"
    }
  };

  const t = translations[language as "en" | "ar"] || translations.en;

  if (isIOS && showIOSInstructions) {
    return (
      <div 
        className="fixed bottom-4 left-4 right-4 z-50 bg-card border rounded-lg p-4 shadow-lg"
        dir={isRTL ? "rtl" : "ltr"}
        data-testid="ios-install-instructions"
      >
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">{t.iosTitle}</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowIOSInstructions(false)}
            data-testid="button-close-ios-instructions"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <ol className="space-y-2 text-sm text-muted-foreground mb-4">
          <li className="flex gap-2">
            <span className="font-bold text-primary">1.</span>
            {t.iosStep1}
          </li>
          <li className="flex gap-2">
            <span className="font-bold text-primary">2.</span>
            {t.iosStep2}
          </li>
          <li className="flex gap-2">
            <span className="font-bold text-primary">3.</span>
            {t.iosStep3}
          </li>
        </ol>
        <Button 
          className="w-full" 
          onClick={handleDismiss}
          data-testid="button-ios-got-it"
        >
          {t.gotIt}
        </Button>
      </div>
    );
  }

  return (
    <div 
      className="fixed bottom-4 left-4 right-4 z-50 bg-card border rounded-lg p-4 shadow-lg"
      dir={isRTL ? "rtl" : "ltr"}
      data-testid="install-prompt"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <Download className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-semibold">{t.title}</h3>
            <p className="text-sm text-muted-foreground">{t.description}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDismiss}
          data-testid="button-dismiss-install"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex gap-2">
        {isIOS ? (
          <Button 
            className="flex-1" 
            onClick={() => setShowIOSInstructions(true)}
            data-testid="button-show-ios-install"
          >
            <Smartphone className={isRTL ? "ml-2 h-4 w-4" : "mr-2 h-4 w-4"} />
            {t.showInstructions}
          </Button>
        ) : (
          <Button 
            className="flex-1" 
            onClick={handleInstall}
            data-testid="button-install-app"
          >
            <Download className={isRTL ? "ml-2 h-4 w-4" : "mr-2 h-4 w-4"} />
            {t.install}
          </Button>
        )}
      </div>
    </div>
  );
}
