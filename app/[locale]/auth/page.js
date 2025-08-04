'use client'
import Link from "next/link";
import { useTranslations } from "next-intl";
import UIControls from "@/components/ui-controls";
import { H1 } from "@/components/shadcn/typography-h1";
import { LoginForm } from "@/components/login-form";
import { UserRoundPen } from "lucide-react";

export default function Home() {
  const t = useTranslations('shared');

  return (
    <main className="flex flex-col gap-[32px] items-center justify-center h-screen px-5">
      <div className="flex gap-1 justify-center items-center" >
        <UserRoundPen className="size-12"/>
        <H1>{t('protothon')}</H1>
      </div>
      <LoginForm />
      <UIControls />
    </main>
  );
}
