"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { OCCASIONS, INTENTIONS, type Occasion } from "@/data/occasions";

const OCCASION_LABELS: Record<string, string> = {
  anniversaire: "Son anniversaire",
  "noel-fetes": "Noël & les fêtes",
  surprise: "Juste parce que",
  collegue: "Un merci sincère",
  entreprise: "Toute l'équipe",
};

export default function NavDropdown() {
  const [open, setOpen] = useState(false);
  const [activeOccasion, setActiveOccasion] = useState<Occasion>(OCCASIONS.anniversaire);
  const t = useTranslations("nav");

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className="flex items-center gap-1 text-sm font-semibold h-full px-3 py-2 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)]"
        style={{ fontFamily: "var(--font-body)", color: "var(--nav-text, var(--text-primary))" }}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
      >
        Moments
        <svg
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 rounded-2xl shadow-xl border z-50 overflow-hidden"
          style={{
            width: "320px",
            backgroundColor: "var(--chantilly)",
            borderColor: "rgba(35,21,16,0.08)",
          }}
          role="menu"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          {/* Bande colorée active */}
          <div
            style={{
              height: "4px",
              backgroundColor: activeOccasion.sleeveTokens.bg,
              transition: "background-color 0.2s",
            }}
            aria-hidden="true"
          />

          <div className="p-3 space-y-3">
            {INTENTIONS.map((intention) => (
              <div key={intention.slug}>
                <p
                  className="px-2 mb-1"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "11px",
                    fontWeight: 500,
                    fontStyle: "italic",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "var(--text-secondary)",
                  }}
                >
                  {t(intention.labelKey as Parameters<typeof t>[0])}
                </p>
                <ul role="none">
                  {intention.occasions.map((slug) => {
                    const occasion = OCCASIONS[slug];
                    return (
                      <li key={slug} role="none">
                        <Link
                          href={`/offrir/${slug}`}
                          role="menuitem"
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)]"
                          style={{ backgroundColor: "transparent" }}
                          onMouseEnter={(e) => {
                            setActiveOccasion(occasion);
                            (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                              occasion.sleeveTokens.bg;
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                              "transparent";
                          }}
                          onFocus={() => {
                            setActiveOccasion(occasion);
                            setOpen(true);
                          }}
                          onClick={() => setOpen(false)}
                        >
                          <span
                            style={{
                              width: "8px",
                              height: "8px",
                              borderRadius: "50%",
                              backgroundColor: occasion.sleeveTokens.bg,
                              border: `1.5px solid ${occasion.sleeveTokens.accent}`,
                              flexShrink: 0,
                            }}
                            aria-hidden="true"
                          />
                          <span
                            className="text-sm font-medium"
                            style={{ fontFamily: "var(--font-body)", color: "var(--text-primary)" }}
                          >
                            {OCCASION_LABELS[slug] ?? occasion.nom}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
