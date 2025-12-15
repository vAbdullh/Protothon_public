"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "./shadcn/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "./shadcn/card";
import { Input } from "./shadcn/input";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/components/shadcn/toast";
import Link from "next/link";

export function ParticipantLoginForm() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({ email: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const router = useRouter();
  const { addToast } = useToast();

  const t = useTranslations("auth");

  // Check for session on mount and listen for auth changes
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          if (session.user.user_metadata?.role === "participant") {
            router.push("/dashboard");
          } else {
            await supabase.auth.signOut();
            addToast({
              title: t("errors.loginFailed"),
              description: t("errors.accessRestricted"),
              variant: "destructive",
            });
            setIsCheckingSession(false);
          }
        } else {
          setIsCheckingSession(false);
        }
      } catch (error) {
        setIsCheckingSession(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        if (session.user.user_metadata?.role === "participant") {
          router.push("/dashboard");
        } else {
           await supabase.auth.signOut();
           addToast({
              title: t("errors.loginFailed"),
              description: t("errors.accessRestricted"),
              variant: "destructive",
           });
           setIsCheckingSession(false);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, addToast, t]);
  
  const validateEmail = () => {
    if (!email) {
      setErrors((prev) => ({ ...prev, email: t("errors.required") }));
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setErrors((prev) => ({ ...prev, email: t("errors.invalidEmail") }));
      return false;
    }
    setErrors((prev) => ({ ...prev, email: "" }));
    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({ email: "" });

    if (!validateEmail()) {
        setIsLoading(false);
        return;
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `https://protothon.info/login`,
          shouldCreateUser: false,
        },
      });

      if (error) throw error;

      addToast({
        title: t("magicLinkSentTitle"),
        description: t("magicLinkSentDescription"),
      });
      
    } catch (error: any) {
      let errorMessage = error.message || t("errors.loginFailed");

      if (error.code === 'over_email_send_rate_limit') {
        errorMessage = t("errors.overEmailSendRateLimit");
      } else if (error.code === 'email_address_invalid') {
        errorMessage = t("errors.emailAddressInvalid");
      } else if (error.message?.includes("Signups not allowed")) {
         errorMessage = t("errors.userNotFound");
      }

      setErrors((prev) => ({ ...prev, email: errorMessage }));
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingSession) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-40">
            <p className="text-muted-foreground">{t("loading")}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">{t("loginTitle")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-10">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder={t("email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={validateEmail}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? t("loading") : t("sendMagicLink")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
