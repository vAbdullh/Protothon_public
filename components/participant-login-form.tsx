"use client";

import { useState } from "react";
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
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { addToast } = useToast();

  const t = useTranslations("auth");
  
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

  const validatePassword = () => {
    if (!password) {
      setErrors((prev) => ({ ...prev, password: t("errors.required") }));
      return false;
    }
    setErrors((prev) => ({ ...prev, password: "" }));
    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!validateEmail() || !validatePassword()) {
        setIsLoading(false);
        return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Check role
        const role = data.user.user_metadata?.role;
        if (role !== "participant") {
            await supabase.auth.signOut();
            addToast({
              title: t("errors.loginFailed"),
              description: t("errors.accessRestricted"),
              variant: "destructive",
            });
            return;
        }
        router.push("/profile");
      }
    } catch (error: any) {
      addToast({
        title: t("errors.loginFailed"),
        description: error.message || t("errors.loginFailed"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">{t("loginTitle")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
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
          <div className="space-y-2">
            <Input
              type="password"
              placeholder={t("password")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={validatePassword}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
            <div className="flex justify-end">
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                    {t("forgotPassword")}
                </Link>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? t("loading") : t("loginButton")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
