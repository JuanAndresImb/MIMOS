"use client";

/**
 * BrandStory — Manifeste de la marque
 *
 * Taste-skill :
 * - Haptic depth sur la blockquote : bg légèrement plus foncé + border + inset shadow
 * - Reveal scroll-triggered sur les deux colonnes avec stagger
 * - Stats reécrits : product-agnostic, "100% Fait à la main en Belgique" retiré
 * - Typographie serrée sur les chiffres (Fraunces, tracking négatif)
 */

import Link from "next/link";
import { useRef, useEffect, useState } from "react";

const STATS = [
  { chiffre: "3 min",  label: "De l'envie au geste" },
  { chiffre: "48h",    label: "Et c'est chez eux" },
  { chiffre: "1",      label: "Message unique — le vôtre" },
] as const;

export default function BrandStory() {
  const leftRef  = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const [leftVis,  setLeftVis]  = useState(false);
  const [rightVis, setRightVis] = useState(false);

  useEffect(() => {
    const observe = (el: HTMLDivElement | null, setVis: (v: boolean) => void) => {
      if (!el) return;
      if (el.getBoundingClientRect().top < window.innerHeight) { setVis(true); return; }
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) { setVis(true); obs.disconnect(); } },
        { threshold: 0.12 }
      );
      obs.observe(el);
      return () => obs.disconnect();
    };
    observe(leftRef.current, setLeftVis);
    const cleanup = observe(rightRef.current, setRightVis);
    return cleanup;
  }, []);

  const revealStyle = (visible: boolean, delay = 0): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(32px)",
    transition: `opacity 0.65s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.65s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
  });

  return (
    <section
      style={{ backgroundColor: "var(--lime)" }}
      aria-labelledby="brand-story-heading"
    >
      <div
        className="mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center"
        style={{ maxWidth: "72rem", paddingTop: "88px", paddingBottom: "96px" }}
      >
        {/* ── Gauche — headline + lien ── */}
        <div
          ref={leftRef}
          style={{ display: "flex", flexDirection: "column", gap: "32px", ...revealStyle(leftVis) }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "12px",
                fontWeight: 500,
                fontStyle: "italic",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: "var(--dark)",
                opacity: 0.4,
              }}
            >
              Pourquoi MIMOS existe
            </p>

            <h2
              id="brand-story-heading"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 3.5vw, 2.8rem)",
                fontWeight: 800,
                color: "var(--dark)",
                lineHeight: 1.08,
                letterSpacing: "-0.02em",
                textWrap: "balance",
                margin: 0,
              }}
            >
              Tu penses à eux.<br />
              Souvent.
            </h2>

            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "16px",
                fontWeight: 300,
                lineHeight: 1.8,
                color: "var(--dark)",
                opacity: 0.68,
                maxWidth: "36ch",
              }}
            >
              Entre deux réunions. En voyant quelque chose qui leur ressemble.
              MIMOS est né de cette frustration — et de la conviction qu&apos;une
              pensée mérite mieux qu&apos;un SMS.
            </p>
          </div>

          <Link
            href="/a-propos"
            className="hover:opacity-60 transition-opacity"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontFamily: "var(--font-body)",
              fontSize: "14px",
              fontWeight: 500,
              color: "var(--dark)",
              textDecoration: "underline",
              textUnderlineOffset: "4px",
              alignSelf: "flex-start",
            }}
          >
            Notre histoire
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* ── Droite — blockquote + stats ── */}
        <div
          ref={rightRef}
          style={{ display: "flex", flexDirection: "column", gap: "48px", ...revealStyle(rightVis, 120) }}
        >
          {/* Blockquote — haptic depth */}
          <blockquote
            style={{
              margin: 0,
              padding: "28px 32px",
              borderRadius: "16px",
              backgroundColor: "rgba(30,27,46,0.05)",
              borderLeft: "3px solid var(--dark)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6), 0 4px 24px rgba(30,27,46,0.06)",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.5rem, 2.6vw, 2.1rem)",
                fontWeight: 700,
                color: "var(--dark)",
                lineHeight: 1.22,
                letterSpacing: "-0.015em",
                margin: 0,
              }}
            >
              &ldquo;Une pensée mérite
              mieux qu&apos;un SMS.&rdquo;
            </p>
          </blockquote>

          {/* Stats */}
          <ul
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "18px",
              listStyle: "none",
              padding: 0,
              margin: 0,
            }}
          >
            {STATS.map(({ chiffre, label }) => (
              <li
                key={label}
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "16px",
                  paddingBottom: "16px",
                  borderBottom: "1px solid rgba(30,27,46,0.10)",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "24px",
                    fontWeight: 800,
                    color: "var(--dark)",
                    letterSpacing: "-0.02em",
                    minWidth: "68px",
                    flexShrink: 0,
                  }}
                >
                  {chiffre}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "14px",
                    fontWeight: 300,
                    color: "var(--dark)",
                    opacity: 0.58,
                    lineHeight: 1.5,
                  }}
                >
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
