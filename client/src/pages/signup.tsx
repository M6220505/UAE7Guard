import { useState } from "react";
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
import { Shield, Eye, EyeOff, UserPlus, Apple } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { signUpWithEmail, signInWithApple } from "@/lib/firebase";

const signupSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupForm = z.infer<typeof signupSchema>;

export default function Signup() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAppleLoading, setIsAppleLoading] = useState(false);
  const { t } = useLanguage();

  const form = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignupForm) => {
    setIsLoading(true);
    try {
      // Create Firebase account
      const firebaseUser = await signUpWithEmail(data.email, data.password);

      // Update profile with first and last name (this will be synced to our database via the auth hook)
      await firebaseUser.updateProfile({
        displayName: `${data.firstName} ${data.lastName}`,
      });

      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Account created!",
        description: "Welcome to UAE7Guard. You are now logged in.",
      });
      setLocation("/dashboard");
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message || "Could not create account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleSignUp = async () => {
    setIsAppleLoading(true);
    try {
      await signInWithApple();
      // On iOS, this will redirect, so the following code won't execute
      // On web, user will be signed in via popup
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Welcome!",
        description: "You have successfully signed up with Apple.",
      });
      setLocation("/dashboard");
    } catch (error: any) {
      // Don't show error for redirect in progress
      if (error.message !== 'REDIRECT_IN_PROGRESS') {
        toast({
          title: "Apple Sign Up failed",
          description: error.message || "Failed to sign up with Apple",
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
          <CardTitle className="text-2xl font-bold text-white">{t.createAccount}</CardTitle>
          <CardDescription className="text-zinc-400">
            {t.joinUAE7Guard}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Sign up with Apple - Primary Option */}
          <Button
            variant="outline"
            className="w-full bg-white hover:bg-gray-100 text-black border-gray-300 mb-4"
            onClick={handleAppleSignUp}
            disabled={isAppleLoading}
            data-testid="button-apple-signup"
          >
            {isAppleLoading ? (
              <>
                <div className="h-5 w-5 mr-2 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Signing up...
              </>
            ) : (
              <>
                <Apple className="h-5 w-5 mr-2 fill-current" />
                Sign up with Apple
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

          {/* Email/Password Sign Up */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-300">{t.firstName}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t.firstNamePlaceholder}
                          className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                          data-testid="input-firstname"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-300">{t.lastName}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t.lastNamePlaceholder}
                          className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                          data-testid="input-lastname"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-300">{t.confirmPassword}</FormLabel>
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder={t.confirmPasswordPlaceholder}
                        className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                        data-testid="input-confirm-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                disabled={isLoading}
                data-testid="button-signup"
              >
                {isLoading ? (
                  t.creatingAccount
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    {t.createAccountButton}
                  </>
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <p className="text-zinc-400 text-sm">
              {t.alreadyHaveAccount}{" "}
              <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-medium" data-testid="link-login">
                {t.signIn}
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
