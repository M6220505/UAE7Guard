import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { AlertTriangle, Shield, Lock, FileText, CheckCircle2, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface EmergencySOPProps {
  address?: string;
  trigger?: React.ReactNode;
}

const emergencySteps = [
  {
    id: "revoke",
    title: "Revoke Token Approvals",
    description: "Immediately revoke all token approvals for the compromised address using a tool like Revoke.cash",
    icon: Lock,
    action: "REVOKE_PERMISSIONS",
  },
  {
    id: "secure",
    title: "Secure Remaining Assets",
    description: "Transfer all remaining assets to a new, secure wallet that has never interacted with the threat",
    icon: Shield,
    action: "EMERGENCY_SECURE_ASSETS",
  },
  {
    id: "document",
    title: "Document the Incident",
    description: "Save all transaction hashes, screenshots, and communication records for potential legal action",
    icon: FileText,
    action: "DOCUMENT_INCIDENT",
  },
];

export function EmergencySOP({ address, trigger }: EmergencySOPProps) {
  const [open, setOpen] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [targetAddress, setTargetAddress] = useState(address || "");
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

  const logMutation = useMutation({
    mutationFn: async ({ actionType, details }: { actionType: string; details: string }) => {
      await apiRequest("POST", "/api/security-logs", {
        userId: "demo-user",
        actionType,
        targetAddress,
        details,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/security-logs"] });
    },
  });

  const handleStepComplete = (stepId: string, actionType: string) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(stepId)) {
      newCompleted.delete(stepId);
    } else {
      newCompleted.add(stepId);
      logMutation.mutate({
        actionType,
        details: `Step completed: ${stepId}`,
      });
    }
    setCompletedSteps(newCompleted);
  };

  const handleSubmitAll = () => {
    if (completedSteps.size === emergencySteps.length) {
      logMutation.mutate({
        actionType: "EMERGENCY_PROTOCOL_COMPLETE",
        details: `All emergency steps completed. Notes: ${notes}`,
      });
      toast({
        title: "Emergency Protocol Completed",
        description: "All actions have been documented in your audit log.",
      });
      setOpen(false);
      setCompletedSteps(new Set());
      setNotes("");
    }
  };

  const allComplete = completedSteps.size === emergencySteps.length;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="destructive" data-testid="button-emergency-sop">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Emergency Protocol
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-500">
            <AlertTriangle className="h-5 w-5" />
            Emergency Security Protocol
          </DialogTitle>
          <DialogDescription>
            Follow these critical steps to secure your assets immediately. All actions are logged for audit purposes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div>
            <label className="text-sm font-medium">Target Address</label>
            <Input
              placeholder="0x..."
              value={targetAddress}
              onChange={(e) => setTargetAddress(e.target.value)}
              className="mt-1.5 font-mono"
              data-testid="input-emergency-address"
            />
          </div>

          <div className="space-y-4">
            {emergencySteps.map((step, index) => {
              const StepIcon = step.icon;
              const isComplete = completedSteps.has(step.id);
              
              return (
                <div
                  key={step.id}
                  className={`rounded-lg border p-4 transition-all ${
                    isComplete
                      ? "border-green-500/50 bg-green-500/5"
                      : "border-border"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <Checkbox
                      id={step.id}
                      checked={isComplete}
                      onCheckedChange={() => handleStepComplete(step.id, step.action)}
                      disabled={logMutation.isPending}
                      data-testid={`checkbox-step-${step.id}`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div className={`flex h-6 w-6 items-center justify-center rounded-full ${
                          isComplete ? "bg-green-500/20" : "bg-muted"
                        }`}>
                          {isComplete ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                          ) : (
                            <span className="text-xs font-bold text-muted-foreground">{index + 1}</span>
                          )}
                        </div>
                        <label
                          htmlFor={step.id}
                          className={`font-medium cursor-pointer ${
                            isComplete ? "line-through text-muted-foreground" : ""
                          }`}
                        >
                          {step.title}
                        </label>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground pl-8">
                        {step.description}
                      </p>
                    </div>
                    <StepIcon className={`h-5 w-5 ${isComplete ? "text-green-500" : "text-muted-foreground"}`} />
                  </div>
                </div>
              );
            })}
          </div>

          <div>
            <label className="text-sm font-medium">Additional Notes</label>
            <Textarea
              placeholder="Document any additional observations or actions taken..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1.5 resize-none"
              data-testid="textarea-emergency-notes"
            />
          </div>

          <Button
            className="w-full"
            disabled={!allComplete || logMutation.isPending}
            onClick={handleSubmitAll}
            data-testid="button-complete-protocol"
          >
            {logMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle2 className="mr-2 h-4 w-4" />
            )}
            Complete & Document Protocol
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
