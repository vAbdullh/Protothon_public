"use client";

import { useRouter, usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { Button } from "@/components/shadcn/button";

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const switchLanguage = () => {
    const newLocale = locale === "en" ? "ar" : "en";

    // Store user preference in a cookie
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`; // 1 year

    // Update the URL with the new locale
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <Button variant="outline" size="lg" onClick={switchLanguage}>
      {locale === "en" ? "العربية" : "English"}
    </Button>
  );
}
