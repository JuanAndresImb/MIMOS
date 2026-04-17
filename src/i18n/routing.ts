import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // Seule locale activée en V1 — NL et EN ajoutés en Phase 2
  locales: ["fr"],
  defaultLocale: "fr",
  // Pas de préfixe de locale dans les URLs (/fr/...) — FR est la seule locale
  localePrefix: "never",
});
