import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Flag, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

const reportFormSchema = z.object({
  scammerAddress: z.string().min(10, "Address must be at least 10 characters").regex(/^0x[a-fA-F0-9]{40}$|^[a-zA-Z0-9]{30,}$/, "Invalid wallet address format"),
  scamType: z.string().min(1, "Please select a scam type"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  evidenceUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  amountLost: z.string().optional(),
  severity: z.string().default("medium"),
});

type ReportFormValues = z.infer<typeof reportFormSchema>;

interface ReportFormProps {
  onSuccess?: () => void;
}

export function ReportForm({ onSuccess }: ReportFormProps) {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      scammerAddress: "",
      scamType: "",
      description: "",
      evidenceUrl: "",
      amountLost: "",
      severity: "medium",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: ReportFormValues) => {
      const response = await apiRequest("POST", "/api/reports", {
        ...data,
        reporterId: "demo-user",
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Report Submitted",
        description: "Your intelligence report has been submitted for verification.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/reports"] });
      setSubmitted(true);
      form.reset();
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit report. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ReportFormValues) => {
    mutation.mutate(data);
  };

  if (submitted) {
    return (
      <Card className="border-green-500/30 bg-green-500/5">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
            <Flag className="h-8 w-8 text-green-500" />
          </div>
          <h3 className="text-xl font-semibold text-green-600 dark:text-green-400">Intelligence Submitted</h3>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Your report is pending admin verification. You will earn reputation points once verified.
          </p>
          <Button
            variant="outline"
            className="mt-6"
            onClick={() => setSubmitted(false)}
            data-testid="button-submit-another"
          >
            Submit Another Report
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flag className="h-5 w-5" />
          Submit Intelligence Report
        </CardTitle>
        <CardDescription>
          Report a suspicious address or scam. Verified reports earn reputation points.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="scammerAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Scammer Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="0x..."
                      className="font-mono"
                      {...field}
                      data-testid="input-scammer-address"
                    />
                  </FormControl>
                  <FormDescription>Wallet or contract address</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="scamType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Scam Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-scam-type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="phishing">Phishing</SelectItem>
                        <SelectItem value="rugpull">Rug Pull</SelectItem>
                        <SelectItem value="honeypot">Honeypot</SelectItem>
                        <SelectItem value="fake_ico">Fake ICO</SelectItem>
                        <SelectItem value="pump_dump">Pump & Dump</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="severity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Severity</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-severity">
                          <SelectValue placeholder="Select severity" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the scam, how it works, and any other relevant details..."
                      className="min-h-[120px] resize-none"
                      {...field}
                      data-testid="textarea-description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="evidenceUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Evidence URL (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://..."
                        {...field}
                        data-testid="input-evidence-url"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amountLost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount Lost (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., 5 ETH, $10,000"
                        {...field}
                        data-testid="input-amount-lost"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={mutation.isPending}
              data-testid="button-submit-report"
            >
              {mutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              Submit Report
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
