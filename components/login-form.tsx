"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "./shadcn/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./shadcn/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./shadcn/tabs";
import { Input } from "./shadcn/input";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("password");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const tDashboard = useTranslations("DashboardLogin");
  const tShared = useTranslations("shared");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        router.push("/dashboard");
      }
    };
    checkAuth();
  }, [router]);

  const validateEmail = () => {
    if (!email) {
      setErrors((prev) => ({ ...prev, email: "errEmailRequired" }));
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setErrors((prev) => ({ ...prev, email: "errInvalidEmail" }));
      return false;
    }
    setErrors((prev) => ({ ...prev, email: "" }));
    return true;
  };

  const validatePassword = () => {
    if (!password && activeTab === "password") {
      setErrors((prev) => ({ ...prev, password: "errPasswordRequired" }));
      return false;
    }
    setErrors((prev) => ({ ...prev, password: "" }));
    return true;
  };

  const handleAuth = async (type: "password" | "otp", e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const isEmailValid = validateEmail();
      const isPasswordValid = validatePassword();

      if (!isEmailValid || (type === "password" && !isPasswordValid)) {
        return;
      }

      const authAction =
        type === "password"
          ? supabase.auth.signInWithPassword({ email, password })
          : supabase.auth.signInWithOtp({ email });

      const { error } = await authAction;
      if (error) throw error;

      if (type === "password") {
        router.push("/dashboard");
      } else {
        setMessage("Magic link sent to your email!");
        setEmailSent(true);
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    const authType = activeTab === "password" ? "password" : "otp";
    handleAuth(authType, e);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{tDashboard("title")}</CardTitle>
        <CardDescription>{tDashboard("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="password">
              {tDashboard("loginPassword")}
            </TabsTrigger>
            <TabsTrigger value="email">{tDashboard("loginEmail")}</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit}>
            <TabsContent value="password" className="space-y-4">
              {message && (
                <p
                  className={`text-sm ${
                    message.includes("Magic link")
                      ? "text-green-600"
                      : "text-orange-600"
                  }`}
                >
                  {message}
                </p>
              )}
              <div className="space-y-2">
                <Input
                  id="email"
                  placeholder={tDashboard("email")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={validateEmail}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">
                    {tDashboard(errors.email)}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Input
                  id="password"
                  type="password"
                  placeholder={tDashboard("password")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={validatePassword}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {tDashboard(errors.password)}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? tShared("loading") : tDashboard("loginPassword")}
              </Button>
            </TabsContent>

            <TabsContent value="email" className="space-y-4">
              {emailSent ? (
                <div className="text-center space-y-4">
                  <p className="text-green-600 text-lg">{message}</p>
                  <p className="text-sm text-gray-600">
                    {tDashboard("checkYourEmail")}
                  </p>
                </div>
              ) : (
                <>
                  {message && (
                    <p
                      className={`text-sm ${
                        message.includes("Magic link")
                          ? "text-green-600"
                          : "text-orange-600"
                      }`}
                    >
                      {message}
                    </p>
                  )}
                  <div className="space-y-2">
                    <Input
                      id="email-only"
                      placeholder={tDashboard("email")}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={validateEmail}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">
                        {tDashboard(errors.email)}
                      </p>
                    )}
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? tShared("loading") : tDashboard("loginEmail")}
                  </Button>
                </>
              )}
            </TabsContent>
          </form>
        </Tabs>
      </CardContent>
    </Card>
  );
}
