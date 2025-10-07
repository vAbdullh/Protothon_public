import React, { useEffect } from "react";
import { hatch } from "ldrs";
import { useTranslations } from "next-intl";

export default function Loader() {
  const t = useTranslations("shared");
  useEffect(() => {
    hatch.register();
  }, []);

  return (
    <div
      dir="ltr"
      className="flex gap-1 flex-col items-center justify-center w-full"
    >
      <l-hatch
        size="28"
        stroke="5"
        speed="2.5"
        color="var(--accent-foreground)"
      ></l-hatch>
      <p className="text-sm text-accent-foreground">{t("loading")}</p>
    </div>
  );
}
