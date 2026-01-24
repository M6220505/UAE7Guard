import { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";

interface PreSubmitReportModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function PreSubmitReportModal({ open, onConfirm, onCancel }: PreSubmitReportModalProps) {
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleConfirm = () => {
    if (isConfirmed) {
      setIsConfirmed(false); // Reset for next time
      onConfirm();
    }
  };

  const handleCancel = () => {
    setIsConfirmed(false); // Reset checkbox
    onCancel();
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="bg-zinc-900 border-amber-500/30">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-amber-100 text-xl">
            Before You Submit
          </AlertDialogTitle>
          <AlertDialogDescription className="text-amber-200/70 text-base leading-relaxed pt-2">
            Reports should be submitted only when you have a genuine concern. False or misleading
            reports may be removed.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-4">
          <label className="flex items-start gap-3 cursor-pointer group">
            <Checkbox
              checked={isConfirmed}
              onCheckedChange={(checked) => setIsConfirmed(checked === true)}
              className="mt-0.5 border-amber-500/40 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
            />
            <span className="text-amber-200/80 text-sm leading-relaxed group-hover:text-amber-200">
              I confirm this report is submitted in good faith.
            </span>
          </label>
        </div>

        <div className="bg-zinc-950/50 border border-amber-500/20 rounded-lg p-3">
          <p className="text-amber-200/50 text-xs leading-relaxed">
            Reports are reviewed and do not constitute verified accusations.
          </p>
        </div>

        <AlertDialogFooter className="gap-2 sm:gap-2">
          <AlertDialogCancel
            onClick={handleCancel}
            className="bg-zinc-800 border-amber-500/20 text-amber-200 hover:bg-zinc-700"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={!isConfirmed}
            className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:from-amber-600 disabled:hover:to-amber-500"
          >
            Submit
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
