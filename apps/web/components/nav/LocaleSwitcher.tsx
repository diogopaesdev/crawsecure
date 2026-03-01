"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const LOCALE_LABELS: Record<string, string> = {
  en: "EN 🇺🇸",
  pt: "PT 🇵🇹",
  es: "ES 🇪🇸",
  fr: "FR 🇫🇷",
  de: "DE 🇩🇪",
  zh: "中文 🇨🇳",
  ja: "日本語 🇯🇵",
};

export function LocaleSwitcher() {
  const locale   = useLocale();
  const router   = useRouter();
  const pathname = usePathname();

  return (
    <select
      value={locale}
      onChange={(e) => router.replace(pathname, { locale: e.target.value })}
      aria-label="Select language"
      className="text-xs bg-transparent border border-border/50 rounded-md px-2 py-1 text-muted-foreground hover:border-primary/40 cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/40"
    >
      {routing.locales.map((l) => (
        <option key={l} value={l}>
          {LOCALE_LABELS[l] ?? l.toUpperCase()}
        </option>
      ))}
    </select>
  );
}
