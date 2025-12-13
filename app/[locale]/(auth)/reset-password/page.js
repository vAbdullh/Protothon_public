"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

export default function UpdatePasswordPage() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { addToast } = useToast();
    const t = useTranslations("auth");

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            addToast({
                title: t("errors.error"),
                description: "Passwords do not match", // Add translation if strictly needed, or use t('errors.passwordMismatch')
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        try {
            const { error } = await supabase.auth.updateUser({
                password: password,
            });

            if (error) throw error;

            addToast({
                title: t("updatePasswordTitle"),
                description: t("passwordUpdated"),
                variant: "success",
            });

            // Redirect to profile or login after short delay
            setTimeout(() => {
                router.push("/login");
            }, 2000);

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
                <CardTitle className="text-2xl font-bold text-center">{t("updatePasswordTitle")}</CardTitle>
                <CardDescription className="text-center">{t("updatePasswordDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleUpdate} className="space-y-4">
                    <div className="space-y-2">
                        <Input
                            type="password"
                            placeholder={t("newPassword")}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Input
                            type="password"
                            placeholder={t("confirmPassword")}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? t("loading") : t("updatePasswordButton")}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
