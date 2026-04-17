import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // Valider la locale — fallback sur la locale par défaut si invalide
  if (!locale || !routing.locales.includes(locale as "fr")) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}`)).default,
  };
});
