import Link from "next/link";
import Image from "next/image";
import { OCCASIONS_LIST } from "@/data/occasions";

const SLEEVE_IMAGES: Record<string, string> = {
  festif: "/images/sleeves/festif.svg",
  affectueux: "/images/sleeves/affectueux.svg",
  pro: "/images/sleeves/pro.svg",
};

const OCCASION_ICONS: Record<string, string> = {
  anniversaire: "🎂",
  "noel-fetes": "🎄",
  surprise: "💛",
  collegue: "💼",
  entreprise: "🏢",
};

export default function OccasionsGrid() {
  return (
    <section
      className="w-full py-16 md:py-24"
      style={{ backgroundColor: "var(--bg-primary)" }}
      aria-labelledby="occasions-heading"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Header section */}
        <div className="text-center mb-12">
          <span
            className="inline-block text-xs uppercase tracking-widest px-3 py-1 rounded-full mb-4"
            style={{
              fontFamily: "var(--font-label)",
              backgroundColor: "var(--primary-50)",
              color: "var(--primary-700)",
            }}
          >
            Choisissez l&apos;occasion
          </span>
          <h2
            id="occasions-heading"
            className="text-3xl md:text-4xl"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              color: "var(--text-primary)",
            }}
          >
            Une box pour chaque moment
          </h2>
          <p
            className="mt-3 text-base max-w-[32rem] mx-auto"
            style={{
              fontFamily: "var(--font-body)",
              color: "var(--text-secondary)",
            }}
          >
            Sélectionnez l&apos;occasion — le sleeve change, le message est le vôtre.
          </p>
        </div>

        {/* Grid occasions */}
        <ul
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          role="list"
        >
          {OCCASIONS_LIST.map((occasion) => (
            <li key={occasion.slug}>
              <Link
                href={`/offrir/${occasion.slug}`}
                className="group flex flex-col rounded-2xl overflow-hidden transition-transform hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)] focus-visible:ring-offset-2"
                style={{
                  backgroundColor: occasion.sleeveTokens.bg,
                  border: `2px solid transparent`,
                }}
                aria-label={`Offrir pour ${occasion.nom}`}
              >
                {/* Image sleeve */}
                <div
                  className="relative w-full"
                  style={{ aspectRatio: "3/2" }}
                >
                  <Image
                    src={SLEEVE_IMAGES[occasion.sleeve]}
                    alt={`Sleeve ${occasion.sleeve} — ${occasion.nom}`}
                    fill
                    className="object-contain p-8"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>

                {/* Contenu card */}
                <div className="flex flex-col gap-3 p-5">
                  {/* Badge sleeve (UX-DR12 : légèrement incliné) */}
                  <span
                    className="inline-block text-xs uppercase tracking-widest px-3 py-1 rounded-full w-fit"
                    style={{
                      fontFamily: "var(--font-label)",
                      backgroundColor: occasion.sleeveTokens.accent,
                      color: "#ffffff",
                      transform: "rotate(-1.5deg)",
                    }}
                  >
                    Sleeve {occasion.sleeve}
                  </span>

                  {/* Nom */}
                  <h3
                    className="text-xl"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 900,
                      color: occasion.sleeveTokens.dark,
                    }}
                  >
                    <span aria-hidden="true">{OCCASION_ICONS[occasion.slug]} </span>
                    {occasion.nom}
                  </h3>

                  {/* Accroche */}
                  <p
                    className="text-sm leading-relaxed"
                    style={{
                      fontFamily: "var(--font-body)",
                      color: occasion.sleeveTokens.dark,
                      opacity: 0.75,
                    }}
                  >
                    {occasion.accroche}
                  </p>

                  {/* CTA inline */}
                  <span
                    className="inline-flex items-center gap-1 text-sm font-semibold mt-1 group-hover:gap-2 transition-all"
                    style={{
                      fontFamily: "var(--font-body)",
                      color: occasion.sleeveTokens.accent,
                    }}
                    aria-hidden="true"
                  >
                    Offrir cette box
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
