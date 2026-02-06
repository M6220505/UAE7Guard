import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Shield, Eye, EyeOff, LogIn, WifiOff, Apple } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { isOnline, addNetworkListeners } from "@/lib/network-utils";
import { signInWithApple, isFirebaseAvailable } from "@/lib/firebase";
import { buildApiUrl } from "@/lib/api-config";

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
  const [isLoading, setIsLoading] = useState(false);
  const [isAppleLoading, setIsAppleLoading] = useState(false);
  const { t } = useLanguage();
  const firebaseAvailable = isFirebaseAvailable();

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

  const onSubmit = async (data: LoginForm) => {
    if (!isOnline()) {
      toast({
        title: "No internet connection",
        description: "Please check your network settings and try again.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Use session-based authentication for email/password login
      // This supports the Apple Review demo account and works without Firebase
      const response = await fetch(buildApiUrl("/api/auth/login"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Invalid email or password");
      }

      // Invalidate auth queries to trigger re-fetch of user data
      queryClient.invalidateQueries({ queryKey: ["/api/auth/session-user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      setLocation("/dashboard");
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    if (!isOnline()) {
      toast({
        title: "No internet connection",
        description: "Please check your network settings and try again.",
        variant: "destructive",
      });
      return;
    }

    setIsAppleLoading(true);
    try {
      await signInWithApple();
      // On iOS, this will redirect, so the following code won't execute
      // On web, user will be signed in via popup
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Welcome!",
        description: "You have successfully signed in with Apple.",
      });
      setLocation("/dashboard");
    } catch (error: any) {
      // Don't show error for redirect in progress
      if (error.message !== 'REDIRECT_IN_PROGRESS') {
        toast({
          title: "Apple Sign In failed",
          description: error.message || "Failed to sign in with Apple",
          variant: "destructive",
        });
      }
    } finally {
      setIsAppleLoading(false);
    }
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
          {/* Sign in with Apple - Only shown when Firebase is available */}
          {firebaseAvailable && (
            <>
              <Button
                variant="outline"
                className="w-full bg-white hover:bg-gray-100 text-black border-gray-300 mb-4"
                onClick={handleAppleSignIn}
                disabled={isAppleLoading || !networkStatus}
                data-testid="button-apple-signin"
              >
                {isAppleLoading ? (
                  <>
                    <div className="h-5 w-5 mr-2 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <Apple className="h-5 w-5 mr-2 fill-current" />
                    Sign in with Apple
                  </>
                )}
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-zinc-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-zinc-900 px-2 text-zinc-400">Or continue with email</span>
                </div>
              </div>
            </>
          )}

          {/* Email/Password Sign In */}
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
                disabled={isLoading || !networkStatus}
                data-testid="button-login"
              >
                {isLoading ? (
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
            <Link
              href="/forgot-password"
              className="text-sm text-emerald-400 hover:text-emerald-300 hover:underline"
              data-testid="link-forgot-password"
            >
              {t.forgotPassword}
            </Link>
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
