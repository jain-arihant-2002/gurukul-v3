"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

// 1. Zod schema for sign-in validation
const formSchema = z.object({
  identifier: z
    .string()
    .min(3, "Please enter a valid username or email."),
  password: z.string().min(1, "Password is required."),
  rememberMe: z.boolean().default(true).optional(),
});

// Helper to check if a string is an email
const isEmail = (text: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);

export default function SignIn() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  // 2. Set up react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      identifier: "",
      password: "",
      rememberMe: true,
    },
  });

  const { isSubmitting } = form.formState;

  if (session) {
    router.push("/");
    return null; // Render nothing while redirecting
  }

  // 3. Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { identifier, password, rememberMe } = values;

    const signInPromise = isEmail(identifier)
      ? authClient.signIn.email({ email: identifier, password, rememberMe })
      : authClient.signIn.username({ username: identifier, password, rememberMe });

    const { error } = await signInPromise;

    if (error) {
      toast.error(error.message || "Invalid credentials. Please try again.");
      return;
    }

    toast.success("Signed in successfully! Redirecting...");
    router.push("/");
  }

  const handleSocialSignIn = async (provider: "google" | "github") => {
    setSocialLoading(provider);
    toast.loading(`Redirecting to ${provider}...`);
    
    try {
      const { error } = await authClient.signIn.social({ provider, callbackURL: "/" });
      if (error) {
        toast.error(error.message || `Failed to sign in with ${provider}.`);
      }
    } catch (error) {
      toast.error(`Failed to sign in with ${provider}.`);
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center w-full">
      <Card className="z-50 min-w-screen h-screen md:h-full md:max-w-md md:min-w-md">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Sign In</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username or Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="m@example.com"
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
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="password"
                        autoComplete="current-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        id="remember"
                      />
                    </FormControl>
                    <FormLabel htmlFor="remember" className="font-normal cursor-pointer">
                      Remember me
                    </FormLabel>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting || socialLoading !== null}>
                {isSubmitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <p> Login </p>
                )}
              </Button>
            </form>
          </Form>

          {/* Social login section */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          
          <div className={cn("w-full gap-2 flex items-center", "justify-between flex-col")}>
            <Button
              variant="outline"
              className="w-full gap-2"
              disabled={isSubmitting || socialLoading !== null}
              onClick={() => handleSocialSignIn("github")}
            >
              {socialLoading === "github" ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"></path>
                </svg>
              )}
              {socialLoading === "github" ? "Signing in..." : "Sign in with Github"}
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex justify-center w-full border-t py-4">
            <p className="text-center text-xs text-neutral-500">
              Don't have an account?{" "}
              <Link href="/sign-up" className="underline">
                <span className="dark:text-white/70 cursor-pointer">
                  Sign-up
                </span>
              </Link>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}