'use client'
import { useTranslations } from "next-intl";
import UIControls from "@/components/ui-controls";
import { H1 } from "@/components/shadcn/typography-h1";
import { LoginForm } from "@/components/login-form";

export default function page() {
  const t = useTranslations('shared');

  return (
    <main className="flex flex-col gap-[32px] items-center justify-center h-screen px-5">
      <div className="flex flex-col gap-1 justify-center items-center" >
        {/* icon */}
        <img src="/protothon-logo-purple.png" alt="Protothon Logo" className="w-32 h-auto mx-auto" />
        <H1>{t('protothon')}</H1>
      </div>
      <LoginForm />
      <UIControls />
    </main>
  );
}
