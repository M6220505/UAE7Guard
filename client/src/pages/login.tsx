import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Shield, Eye, EyeOff, LogIn, WifiOff, Wifi } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useLanguage } from "@/contexts/language-context";
import { isOnline, addNetworkListeners } from "@/lib/network-utils";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState(false);
  const [networkStatus, setNetworkStatus] = useState(isOnline());
  const { t } = useLanguage();

  // Monitor network status
  useEffect(() => {
    const cleanup = addNetworkListeners(
      () => {
        setNetworkStatus(true);
        toast({
          title: "Connection restored",
          description: "You are back online",
        });
      },
      () => {
        setNetworkStatus(false);
        toast({
          title: "No internet connection",
          description: "Please check your network settings",
          variant: "destructive",
        });
      }
    );

    return cleanup;
  }, [toast]);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      // Check network status before making request
      if (!isOnline()) {
        throw new Error("No internet connection. Please check your network settings and try again.");
      }

      const response = await apiRequest("POST", "/api/auth/login", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      setLocation("/dashboard");
    },
    onError: (error: Error) => {
      const errorMessage = error.message || "Invalid email or password";

      // Provide specific guidance based on error type
      let description = errorMessage;
      if (errorMessage.includes("timeout")) {
        description = "The server is taking too long to respond. Please check your internet connection and try again.";
      } else if (errorMessage.includes("Cannot connect")) {
        description = "Cannot reach the server. Please check your internet connection and try again.";
      }

      toast({
        title: "Login failed",
        description,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoginForm) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-zinc-900/80 border-zinc-800">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30">
              <Shield className="h-10 w-10 text-emerald-400" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white">{t.welcomeBack}</CardTitle>
          <CardDescription className="text-zinc-400">
            {t.signInToAccount}
          </CardDescription>
          {!networkStatus && (
            <div className="mt-4 flex items-center justify-center gap-2 text-amber-500 text-sm bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
              <WifiOff className="h-4 w-4" />
              <span>No internet connection</span>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">{t.email}</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder={t.emailPlaceholder}
                        className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                        data-testid="input-email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">{t.password}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder={t.passwordPlaceholder}
                          className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 pr-10"
                          data-testid="input-password"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 text-zinc-400 hover:text-white"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loginMutation.isPending || !networkStatus}
                data-testid="button-login"
              >
                {loginMutation.isPending ? (
                  t.signingIn
                ) : !networkStatus ? (
                  <>
                    <WifiOff className="h-4 w-4 mr-2" />
                    Offline
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    {t.signIn}
                  </>
                )}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center">
            <a
              href="/contact"
              className="text-sm text-emerald-400 hover:text-emerald-300 hover:underline"
            >
              {t.forgotPassword}
            </a>
          </div>
          <div className="mt-6 text-center">
            <p className="text-zinc-400 text-sm">
              {t.dontHaveAccount}{" "}
              <Link href="/signup" className="text-emerald-400 hover:text-emerald-300 font-medium" data-testid="link-signup">
                {t.signUp}
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
