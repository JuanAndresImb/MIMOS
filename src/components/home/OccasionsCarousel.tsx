"use client";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { OCCASIONS_LIST } from "@/data/occasions";

const OCCASION_LABEL: Record<string, string> = {
  anniversaire: "Son anniversaire",
  "noel-fetes": "Noël & les fêtes",
  surprise: "Juste parce que",
  collegue: "Un merci sincère",
  entreprise: "Toute l'équipe",
};

export default function OccasionsCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateArrows = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    return () => el.removeEventListener("scroll", updateArrows);
  }, []);

  const scroll = (dir: "left" | "right") => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "right" ? 340 : -340, behavior: "smooth" });
  };

  return (
    <section
      className="w-full py-20 md:py-28"
      style={{ backgroundColor: "var(--bg-primary)" }}
      aria-labelledby="occasions-carousel-heading"
    >
      {/* En-tête */}
      <div
        className="mx-auto px-6 mb-12 flex items-end justify-between"
        style={{ maxWidth: "72rem" }}
      >
        <div>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "12px",
              fontWeight: 500,
              fontStyle: "italic",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "var(--text-secondary)",
              marginBottom: "12px",
            }}
          >
            Tu as quelqu&apos;un en tête. C&apos;est déjà assez.
          </p>
          <h2
            id="occasions-carousel-heading"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              color: "var(--text-primary)",
              fontSize: "clamp(2rem, 4vw, 3.2rem)",
              lineHeight: 1.1,
            }}
          >
            C&apos;est pour quel moment ?
          </h2>
        </div>

        {/* Flèches desktop */}
        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className="flex items-center justify-center rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)]"
            style={{
              width: "44px",
              height: "44px",
              border: "1.5px solid var(--dark)",
              backgroundColor: canScrollLeft ? "var(--dark)" : "transparent",
              color: canScrollLeft ? "white" : "var(--dark)",
              opacity: canScrollLeft ? 1 : 0.25,
              cursor: canScrollLeft ? "pointer" : "default",
            }}
            aria-label="Carte précédente"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="flex items-center justify-center rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)]"
            style={{
              width: "44px",
              height: "44px",
              border: "1.5px solid var(--dark)",
              backgroundColor: canScrollRight ? "var(--dark)" : "transparent",
              color: canScrollRight ? "white" : "var(--dark)",
              opacity: canScrollRight ? 1 : 0.25,
              cursor: canScrollRight ? "pointer" : "default",
            }}
            aria-label="Carte suivante"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Track */}
      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto pb-4 no-scrollbar"
        style={{
          scrollSnapType: "x mandatory",
          paddingLeft: "max(24px, calc((100vw - 72rem) / 2))",
          paddingRight: "max(24px, calc((100vw - 72rem) / 2))",
        }}
        role="list"
      >
        {OCCASIONS_LIST.map((occasion) => (
          <Link
            key={occasion.slug}
            href={`/offrir/${occasion.slug}`}
            role="listitem"
            className="group flex-none flex flex-col rounded-3xl overflow-hidden transition-transform hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)] focus-visible:ring-offset-2"
            style={{
              width: "clamp(240px, 28vw, 300px)",
              scrollSnapAlign: "start",
              backgroundColor: occasion.sleeveTokens.bg,
              minHeight: "260px",
              padding: "32px 28px 28px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
            aria-label={`Choisir ce moment — ${OCCASION_LABEL[occasion.slug] ?? occasion.nom}`}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "var(--dark)",
                  lineHeight: 1.2,
                }}
              >
                {OCCASION_LABEL[occasion.slug] ?? occasion.nom}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "14px",
                  fontWeight: 300,
                  lineHeight: 1.65,
                  color: "var(--dark)",
                  opacity: 0.65,
                }}
              >
                {occasion.accroche}
              </p>
            </div>

            <span
              className="inline-flex items-center gap-2 text-sm font-medium mt-6 group-hover:gap-3 transition-all"
              style={{ fontFamily: "var(--font-body)", color: "var(--dark)", opacity: 0.75 }}
              aria-hidden="true"
            >
              Choisir ce moment
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </Link>
        ))}
      </div>

      <p
        className="text-center text-xs mt-4 md:hidden"
        style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}
        aria-hidden="true"
      >
        Glisse pour voir plus
      </p>
    </section>
  );
}
