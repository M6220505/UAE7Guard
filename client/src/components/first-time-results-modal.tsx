import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const RESULTS_ACKNOWLEDGMENT_KEY = "uae7guard_results_acknowledged";

interface FirstTimeResultsModalProps {
  open: boolean;
  onAccept: () => void;
  onCancel: () => void;
}

export function FirstTimeResultsModal({ open, onAccept, onCancel }: FirstTimeResultsModalProps) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="bg-zinc-900 border-amber-500/30">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-amber-100 text-xl">
            Important Notice
          </AlertDialogTitle>
          <AlertDialogDescription className="text-amber-200/70 text-base leading-relaxed pt-2">
            UAE7Guard provides informational risk indicators only. Results are not definitive
            and should not be used as the sole basis for financial or legal decisions.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-2">
          <AlertDialogCancel
            onClick={onCancel}
            className="bg-zinc-800 border-amber-500/20 text-amber-200 hover:bg-zinc-700"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onAccept}
            className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white"
          >
            I Understand
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function useFirstTimeResultsModal() {
  const [hasAcknowledged, setHasAcknowledged] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user has already acknowledged
    const acknowledged = localStorage.getItem(RESULTS_ACKNOWLEDGMENT_KEY);
    setHasAcknowledged(acknowledged === "true");
    setIsLoading(false);
  }, []);

  const markAsAcknowledged = () => {
    localStorage.setItem(RESULTS_ACKNOWLEDGMENT_KEY, "true");
    setHasAcknowledged(true);
  };

  const resetAcknowledgment = () => {
    localStorage.removeItem(RESULTS_ACKNOWLEDGMENT_KEY);
    setHasAcknowledged(false);
  };

  return {
    hasAcknowledged,
    isLoading,
    markAsAcknowledged,
    resetAcknowledgment,
  };
}
