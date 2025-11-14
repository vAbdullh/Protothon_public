"use client";

import { Button } from "@/components/shadcn/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/shadcn/sheet";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import LanguageSwitcher from "../language-switcher";
import { Menu } from "lucide-react"; // Hamburger icon

export default function Header() {
  const pathname = usePathname();
  const t = {
    shared: useTranslations("shared"),
    header: useTranslations("header"),
  };

  const navLinks = [
    { href: "/", label: t.header("home") },
    { href: "/tracks", label: t.header("tracks") },
    { href: "/policies", label: t.header("policies") },
    { href: "/contact", label: t.header("contact") },
  ];

  const locale = useLocale();

  return (
    <header className="w-full px-6 py-4 flex justify-between items-center border-b border-gray-200">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <Image
          src="/protothon-logo-purple.png"
          alt="protothon logo purple"
          width={150}
          height={0}
          style={{ height: "auto" }}
          className="w-16 lg:w-[150px]"
          priority
        />
        <Image
          src="/manufacturing-community-logo.png"
          alt="Manufacturing Community logo"
          width={150}
          height={0}
          style={{ height: "auto" }}
          className="w-22 lg:w-[190px]"
          priority
        />
      </div>

      {/* Desktop Navigation & Actions (lg+) */}
      <nav className="hidden lg:flex space-x-6">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`font-medium transition-colors ${
                isActive
                  ? "text-purple-600"
                  : "text-gray-700 hover:text-purple-600"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="hidden lg:flex items-center space-x-4">
        <Link href="/apply">
          <Button size="lg">{t.shared("cta")}</Button>
        </Link>
        <LanguageSwitcher />
      </div>

      {/* Mobile Menu (<lg) */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="p-2">
              <Menu className="size-7" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side={locale == "ar" ? "right" : "left"}
            className="w-64 p-6"
          >
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`font-medium transition-colors ${
                      isActive
                        ? "text-purple-600"
                        : "text-gray-700 hover:text-purple-600"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-6 flex flex-col space-y-3">
              <Link href="/apply">
                <Button size="lg" className="w-full">
                  {t.shared("cta")}
                </Button>
              </Link>
              <LanguageSwitcher />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
