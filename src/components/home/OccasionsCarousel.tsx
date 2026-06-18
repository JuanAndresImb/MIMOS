"use client";

/**
 * OccasionsCarousel — Carrousel horizontal des occasions
 *
 * Taste-skill :
 * - Scroll reveal sur le header (IntersectionObserver inline)
 * - Cards : profondeur par box-shadow + inset-shadow sur hover
 * - Arrow dans bulle sur hover (nested CTA micro-pattern)
 * - Suppression des étiquettes génériques — chaque card utilise occasion.accroche
 */

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { OCCASIONS_LIST } from "@/data/occasions";

export default function OccasionsCarousel() {
  const trackRef   = useRef<HTMLDivElement>(null);
  const headerRef  = useRef<HTMLDivElement>(null);

  const [canScrollLeft,  setCanScrollLeft]  = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [headerVisible,  setHeaderVisible]  = useState(false);

  /* ── Scroll state ── */
  const updateArrows = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  };

  /* ── Header reveal ── */
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    if (el.getBoundingClientRect().top < window.innerHeight) {
      setHeaderVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setHeaderVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* ── Track scroll listener ── */
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    return () => el.removeEventListener("scroll", updateArrows);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scroll = (dir: "left" | "right") => {
    trackRef.current?.scrollBy({ left: dir === "right" ? 340 : -340, behavior: "smooth" });
  };

  return (
    <section
      className="w-full"
      style={{ backgroundColor: "var(--bg-primary)", paddingTop: "88px", paddingBottom: "96px" }}
      aria-labelledby="occasions-carousel-heading"
    >
      {/* ── En-tête avec reveal ── */}
      <div
        ref={headerRef}
        className="mx-auto px-6 mb-12 flex items-end justify-between"
        style={{
          maxWidth: "72rem",
          opacity: headerVisible ? 1 : 0,
          transform: headerVisible ? "translateY(0)" : "translateY(28px)",
          transition: "opacity 0.65s cubic-bezier(0.22,1,0.36,1), transform 0.65s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <div>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "12px",
              fontWeight: 500,
              fontStyle: "italic",
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              color: "var(--text-secondary)",
              marginBottom: "12px",
            }}
          >
            Vous avez quelqu&apos;un en tête. C&apos;est déjà assez.
          </p>
          <h2
            id="occasions-carousel-heading"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              color: "var(--text-primary)",
              fontSize: "clamp(2rem, 4vw, 3.2rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              textWrap: "balance",
              margin: 0,
            }}
          >
            C&apos;est pour quel moment ?
          </h2>
        </div>

        {/* Flèches desktop */}
        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
          {(["left", "right"] as const).map((dir) => {
            const active = dir === "left" ? canScrollLeft : canScrollRight;
            return (
              <button
                key={dir}
                onClick={() => scroll(dir)}
                disabled={!active}
                className="flex items-center justify-center rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)]"
                style={{
                  width: "44px",
                  height: "44px",
                  border: "1.5px solid var(--dark)",
                  backgroundColor: active ? "var(--dark)" : "transparent",
                  color: active ? "white" : "var(--dark)",
                  opacity: active ? 1 : 0.2,
                  cursor: active ? "pointer" : "default",
                  transition: "background-color 0.2s, opacity 0.2s",
                }}
                aria-label={dir === "left" ? "Carte précédente" : "Carte suivante"}
              >
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d={dir === "left" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
                </svg>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Track ── */}
      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto pb-4 no-scrollbar"
        style={{
          scrollSnapType: "x mandatory",
          paddingLeft:  "max(24px, calc((100vw - 72rem) / 2))",
          paddingRight: "max(24px, calc((100vw - 72rem) / 2))",
        }}
        role="list"
      >
        {OCCASIONS_LIST.map((occasion, i) => (
          <Link
            key={occasion.slug}
            href={`/offrir/${occasion.slug}`}
            role="listitem"
            className="group flex-none flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)] focus-visible:ring-offset-2"
            style={{
              width: "clamp(240px, 28vw, 300px)",
              scrollSnapAlign: "start",
              /* Outer shell (double-bezel) */
              padding: "8px",
              borderRadius: "28px",
              backgroundColor: occasion.sleeveTokens.bg,
              border: `1px solid ${occasion.sleeveTokens.accent}20`,
              boxShadow: "0 2px 16px rgba(30,27,46,0.06)",
              transition: "box-shadow 0.25s ease, transform 0.25s ease",
              textDecoration: "none",
              /* Stagger reveal per card */
              animationDelay: `${i * 80}ms`,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 40px rgba(30,27,46,0.12)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 16px rgba(30,27,46,0.06)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            }}
            aria-label={`Choisir ce moment — ${occasion.nom}`}
          >
            {/* Inner core */}
            <div
              style={{
                borderRadius: "calc(28px - 8px)",
                backgroundColor: occasion.sleeveTokens.bg,
                padding: "24px 20px 22px",
                minHeight: "240px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "16px",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {/* Eyebrow slug */}
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "10px",
                    fontWeight: 600,
                    fontStyle: "italic",
                    textTransform: "uppercase",
                    letterSpacing: "0.14em",
                    color: occasion.sleeveTokens.accent,
                    margin: 0,
                  }}
                >
                  {occasion.nom}
                </p>

                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "19px",
                    fontWeight: 700,
                    color: occasion.sleeveTokens.dark,
                    lineHeight: 1.2,
                    letterSpacing: "-0.01em",
                    margin: 0,
                  }}
                >
                  {occasion.titre.length > 50
                    ? occasion.titre.slice(0, 48) + "…"
                    : occasion.titre}
                </h3>

                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "13px",
                    fontWeight: 300,
                    lineHeight: 1.65,
                    color: occasion.sleeveTokens.dark,
                    opacity: 0.65,
                    margin: 0,
                  }}
                >
                  {occasion.accroche}
                </p>
              </div>

              {/* Bottom CTA micro-pattern */}
              <span
                className="inline-flex items-center gap-2"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: occasion.sleeveTokens.accent,
                }}
                aria-hidden="true"
              >
                Voir les formats
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "22px",
                    height: "22px",
                    borderRadius: "999px",
                    border: `1.5px solid ${occasion.sleeveTokens.accent}50`,
                    fontSize: "11px",
                    transition: "background-color 0.2s, color 0.2s",
                  }}
                >
                  →
                </span>
              </span>
            </div>
          </Link>
        ))}
      </div>

      <p
        className="text-center text-xs mt-4 md:hidden"
        style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)", opacity: 0.5 }}
        aria-hidden="true"
      >
        Glisse pour voir plus →
      </p>
    </section>
  );
}
