import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "pt", "pt-BR", "es", "fr", "de", "zh", "ja"],
  defaultLocale: "en",
  localePrefix: "as-needed", // English has no prefix: /analyze, /dashboard
});
