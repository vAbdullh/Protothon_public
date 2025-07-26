'use client'

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ThemeToggleButton } from "@/components/theme-toggle-button";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/language-switcher";

export default function Home() {
  const t = useTranslations('home');
    const [status, setStatus] = useState("");

  useEffect(() => {
    const getHealth = async () => {
      try {
        const res = await fetch("/api/health");
        const data = await res.json();
        console.log("Health Check Response:", data);
        setStatus(data.status); // or whatever your API returns
      } catch (error) {
        setStatus("Failed to fetch health");
      }
    };

    getHealth();
  }, []);

  return (
    <div className="font-sans grid place-items-center h-screen">
      <main className="flex flex-col gap-[32px] items-center">
        <Image
          src="./next.svg"
          alt="Protothon Logo"
          width={150}
          height={150}
          className="mb-8 dark:invert"
        />
        <h1 className="text-4xl font-bold">{t('title')}</h1>
        <p className="text-lg text-gray-500">
          Under development... 🛠️
        </p>
        <p className="text-lg">
          API Health:&nbsp;
            {status ? (
              <span className="text-green-600">{status}</span>
            ) : (
              <span className="text-red-600">Error</span>
            )}
        </p> 
         <Link href="/auth" className="text-blue-600 hover:text-blue-800 underline">
          Go to Login
        </Link>
        <ThemeToggleButton />
        <LanguageSwitcher/>
      </main>
    </div>
  );
}
