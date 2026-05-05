import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["fr", "nl", "en"],
  defaultLocale: "fr",
  // Pas de préfixe URL — locale stockée en cookie NEXT_LOCALE
  localePrefix: "never",
});
