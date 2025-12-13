"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/shadcn/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/shadcn/card";
import { Input } from "@/components/shadcn/input";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/components/shadcn/toast";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { addToast } = useToast();
    const t = useTranslations("auth");

    const handleReset = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Fixed domain as requested
            const redirectTo = `https://protothon.info/reset-password`;

            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo,
            });

            if (error) throw error;

            addToast({
                title: t("forgotPasswordTitle"),
                description: t("resetEmailSent"),
                variant: "success",
            });

        } catch (error) {
            addToast({
                title: t("errors.error"),
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">{t("forgotPasswordTitle")}</CardTitle>
                <CardDescription className="text-center">{t("forgotPasswordDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleReset} className="space-y-4">
                    <div className="space-y-2">
                        <Input
                            type="email"
                            placeholder={t("email")}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? t("loading") : t("sendResetLink")}
                    </Button>

                    <div className="text-center">
                        <Link href="/login" className="text-sm text-muted-foreground hover:text-primary flex items-center justify-center gap-2">
                            {t("backToLogin")}
                        </Link>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
