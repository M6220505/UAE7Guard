import { useState, useEffect } from "react";
import { X, Share, PlusSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function IOSInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const isIOS = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());
    const isStandalone = (window.navigator as any).standalone === true ||
      window.matchMedia("(display-mode: standalone)").matches;
    const wasDismissed = localStorage.getItem("ios-install-dismissed");

    if (isIOS && !isStandalone && !wasDismissed) {
      setTimeout(() => setShowPrompt(true), 3000);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    setShowPrompt(false);
    localStorage.setItem("ios-install-dismissed", "true");
  };

  if (!showPrompt || dismissed) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom-4">
      <Card className="border-amber-500/30 bg-card/95 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center border border-amber-500/30">
              <span className="text-amber-500 font-bold text-lg">CG</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h3 className="font-semibold text-foreground">Install CryptoGuard</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 -mr-2"
                  onClick={handleDismiss}
                  data-testid="button-dismiss-ios-prompt"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Add to your home screen for the best experience
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-md p-2">
                <span>Tap</span>
                <Share className="h-4 w-4 text-primary" />
                <span>then</span>
                <PlusSquare className="h-4 w-4 text-primary" />
                <span className="font-medium">Add to Home Screen</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
