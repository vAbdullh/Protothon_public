"use client";

import { useState } from "react";
import { Button } from "@/components/shadcn/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/shadcn/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import LanguageSwitcher from "../language-switcher";
import { Menu, ChevronDown } from "lucide-react"; // Hamburger icon

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const t = {
    shared: useTranslations("shared"),
    header: useTranslations("header"),
  };

  const scrollToSection = (id: string) => {
    if (pathname !== "/") {
      // Navigate to home page with hash
      router.push(`/#${id}`);
    } else {
      // If already on home page, just scroll
      const element = document.getElementById(id);
      element?.scrollIntoView({ behavior: "smooth" });
    }
    setIsSheetOpen(false);
  };

  const navLinks = [
    { href: "/", label: t.header("home") },
    { href: "#rules", label: t.header("rules") },
    { href: "#footer", label: t.header("contact") },
  ];

  const trackLinks = [
    { href: "/tracks/health", label: t.header("tracksList.health") },
    { href: "/tracks/safety", label: t.header("tracksList.safety") },
    { href: "/tracks/innovation", label: t.header("tracksList.innovation") },
    { href: "/tracks/vehicle", label: t.header("tracksList.vehicle") },
  ];

  const locale = useLocale();

  return (
    <header className="w-full px-6 py-4 flex justify-between items-center border-b border-gray-200">
      {/* Logo */}
        <Image
          src="/protothon-logo-purple.png"
          alt="protothon logo purple"
          width={150}
          height={0}
          style={{ height: "auto" }}
          className="w-24 lg:w-[150px]"
          priority
        />

        <LanguageSwitcher/>
    </header>
  );
}
