import LanguageSwitcher from "@/components/language-switcher";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Home } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {

    const t = useTranslations("shared");
  return (
    <div className="h-screen w-full grid lg:grid-cols-2 px-5 lg:px-0">
      {/* Left Side: Logo */}
      <div className="hidden bg-muted lg:flex items-center justify-center relative p-10 bg-gray-50 order-1">
        <Image
          src="/protothon-logo-purple.png"
          alt="Protothon Logo"
          width={400}
          height={400}
          className="object-contain"
          priority
        />
      </div>

      {/* Right Side: Form (Children) */}
      <div className="flex flex-col gap-2 items-center justify-center py-12 my-auto">
         <Image
          src="/protothon-logo-purple.png"
          alt="Protothon Logo"
          width={150}
          height={150}
          className="object-contain lg:hidden"
          priority
        />
            {children}
        <LanguageSwitcher/>
        <div className="flex items-center gap-2">
            <Link href="/" className="text-sm text-primary hover:underline flex gap-2 items-center my-3">
            <Home/>
                {t("backToHome")}
            </Link>
        </div>
      </div>
    </div>
  );
}
