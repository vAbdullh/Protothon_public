"use client";

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
  };

  const navLinks = [
    { href: "/", label: t.header("home") },
    { href: "#rules", label: t.header("policies") },
    { href: "#footer", label: t.header("contact") },
  ];

  const trackLinks = [
    { href: "/tracks/health", label: t.header("tracksList.health") },
    { href: "/tracks/security", label: t.header("tracksList.security") },
    { href: "/tracks/innovation", label: t.header("tracksList.innovation") },
    { href: "/tracks/creative", label: t.header("tracksList.creative") },
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
      </div>

      {/* Desktop Navigation & Actions (lg+) */}
      <nav className="hidden lg:flex space-x-6">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          if (link.href.startsWith("#")) {
            return (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href.substring(1))}
                className={`font-medium transition-colors ${
                  isActive
                    ? "text-purple-600"
                    : "text-gray-700 hover:text-purple-600"
                }`}
              >
                {link.label}
              </button>
            );
          }
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

        {/* Tracks Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center font-medium transition-colors text-gray-700 hover:text-purple-600">
              {t.header("tracks")}
              <ChevronDown className="ml-1 h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            {trackLinks.map((track) => {
              const isActive = pathname === track.href;
              return (
                <DropdownMenuItem key={track.href} asChild>
                  <Link
                    href={track.href}
                    className={`w-full ${
                      isActive ? "text-purple-600" : "text-gray-700"
                    }`}
                  >
                    {track.label}
                  </Link>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
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
                if (link.href.startsWith("#")) {
                  return (
                    <button
                      key={link.href}
                      onClick={() => scrollToSection(link.href.substring(1))}
                      className={`font-medium transition-colors text-left ${
                        isActive
                          ? "text-purple-600"
                          : "text-gray-700 hover:text-purple-600"
                      }`}
                    >
                      {link.label}
                    </button>
                  );
                }
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

              {/* Tracks in Mobile Menu */}
              <div className="pt-2">
                <h3 className="font-semibold text-gray-900 mb-2">
                  {t.header("tracks")}
                </h3>
                <div className="flex flex-col space-y-2 pl-4">
                  {trackLinks.map((track) => {
                    const isActive = pathname === track.href;
                    return (
                      <Link
                        key={track.href}
                        href={track.href}
                        className={`font-medium transition-colors ${
                          isActive
                            ? "text-purple-600"
                            : "text-gray-700 hover:text-purple-600"
                        }`}
                      >
                        {track.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
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
