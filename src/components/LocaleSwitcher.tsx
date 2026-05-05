"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { routing } from "@/i18n/routing";

const LOCALE_FLAGS: Record<string, string> = { fr: "🇫🇷", nl: "🇧🇪", en: "🇬🇧" };

export default function LocaleSwitcher() {
  const t = useTranslations("langues");
  const locale = useLocale();
  const router = useRouter();

  function switchLocale(next: string) {
    if (next === locale) return;
    // Stocke la locale en cookie (1 an)
    document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=31536000; SameSite=Lax`;
    router.refresh();
  }

  return (
    <div className="relative group">
      <button
        className="flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-md transition-colors hover:text-[var(--primary-500)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)]"
        style={{ fontFamily: "var(--font-body)" }}
        aria-label={t("changer")}
      >
        <span>{LOCALE_FLAGS[locale]}</span>
        <span className="uppercase text-xs">{locale}</span>
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div className="absolute right-0 top-full mt-1 w-36 rounded-xl shadow-lg border border-[var(--haze)] bg-[var(--chantilly)] z-50 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150">
        {(routing.locales as readonly string[]).map((l) => (
          <button
            key={l}
            onClick={() => switchLocale(l)}
            className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left transition-colors hover:bg-[var(--cantaloupe)] ${l === locale ? "font-semibold" : ""}`}
            style={{ fontFamily: "var(--font-body)", color: l === locale ? "var(--primary-700)" : "var(--text-primary)" }}
          >
            <span>{LOCALE_FLAGS[l]}</span>
            <span>{t(l as "fr" | "nl" | "en")}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
