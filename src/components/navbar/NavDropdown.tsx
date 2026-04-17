"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { OCCASIONS_LIST, type Occasion } from "@/data/occasions";

// Occasions B2C uniquement (pas "entreprise" — celui-là a son propre lien direct)
const B2C_OCCASIONS = OCCASIONS_LIST.filter((o) => o.slug !== "entreprise");

// Mapping sleeve → image placeholder
const SLEEVE_IMAGES: Record<string, string> = {
  festif: "/images/sleeves/festif.svg",
  affectueux: "/images/sleeves/affectueux.svg",
  pro: "/images/sleeves/pro.svg",
};

const SLEEVE_LABELS: Record<string, string> = {
  festif: "Sleeve Festif",
  affectueux: "Sleeve Affectueux",
  pro: "Sleeve Pro",
};

// Icônes occasion
const OCCASION_ICONS: Record<string, string> = {
  anniversaire: "🎂",
  "noel-fetes": "🎄",
  surprise: "💛",
  collegue: "💼",
  entreprise: "🏢",
};

export default function NavDropdown() {
  const [open, setOpen] = useState(false);
  const [activeOccasion, setActiveOccasion] = useState<Occasion>(B2C_OCCASIONS[0]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Trigger */}
      <button
        className="flex items-center gap-1 text-sm font-semibold h-full px-3 py-2 rounded-md transition-colors hover:text-[var(--primary-500)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)]"
        style={{ fontFamily: "var(--font-body)" }}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
      >
        Offrir une box
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

      {/* Dropdown panel */}
      {open && (
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[480px] rounded-2xl shadow-xl border border-[var(--primary-100)] bg-white z-50 overflow-hidden"
          role="menu"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <div className="grid grid-cols-[1fr_160px]">
            {/* Colonne gauche — occasions */}
            <div className="p-4">
              <p className="text-xs font-mono uppercase tracking-widest text-[var(--text-secondary)] mb-3 px-2">
                Pour une personne
              </p>
              <ul role="none">
                {B2C_OCCASIONS.map((occasion) => (
                  <li key={occasion.slug} role="none">
                    <Link
                      href={`/offrir/${occasion.slug}`}
                      role="menuitem"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors hover:bg-[var(--primary-50)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)]"
                      onMouseEnter={() => setActiveOccasion(occasion)}
                      onFocus={() => {
                        setActiveOccasion(occasion);
                        setOpen(true);
                      }}
                      onClick={() => setOpen(false)}
                    >
                      <span className="text-lg" aria-hidden="true">
                        {OCCASION_ICONS[occasion.slug]}
                      </span>
                      <span
                        className="text-sm font-medium text-[var(--text-primary)]"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {occasion.nom}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-3 pt-3 border-t border-[var(--primary-100)]">
                <p className="text-xs font-mono uppercase tracking-widest text-[var(--text-secondary)] mb-2 px-2">
                  Pour une équipe
                </p>
                <Link
                  href="/offrir/entreprise"
                  role="menuitem"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors hover:bg-[var(--primary-50)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)]"
                  onMouseEnter={() =>
                    setActiveOccasion(
                      OCCASIONS_LIST.find((o) => o.slug === "entreprise")!
                    )
                  }
                  onClick={() => setOpen(false)}
                >
                  <span className="text-lg" aria-hidden="true">🏢</span>
                  <span
                    className="text-sm font-medium text-[var(--text-primary)]"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    Équipe & Entreprise
                  </span>
                </Link>
              </div>
            </div>

            {/* Colonne droite — sleeve preview */}
            <div
              className="flex flex-col items-center justify-center p-4 gap-3"
              style={{ backgroundColor: activeOccasion.sleeveTokens.bg }}
            >
              <div className="relative w-28 h-36">
                <Image
                  src={SLEEVE_IMAGES[activeOccasion.sleeve]}
                  alt={`Aperçu ${SLEEVE_LABELS[activeOccasion.sleeve]}`}
                  fill
                  className="object-contain transition-opacity duration-300"
                  sizes="112px"
                />
              </div>
              <p
                className="text-center text-xs leading-tight"
                style={{
                  fontFamily: "var(--font-label)",
                  color: activeOccasion.sleeveTokens.dark,
                }}
              >
                {SLEEVE_LABELS[activeOccasion.sleeve]}
                <br />
                <span className="opacity-70">Personnalisé à son prénom</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
