"use client";

/**
 * RecipientTeaser — L'expérience côté destinataire
 *
 * Taste-skill :
 * - Suppression de l'îlot sombre isolé (--dark sur fond clair) → bg --bleu (cohérent avec le hero)
 * - Layout asymétrique : headline gauche, liste droite — plus de centré générique
 * - Reveal animation sur les deux colonnes
 * - Copy product-agnostic : "brownies faits à la main" → "quelque chose préparé pour eux"
 * - CTA nested arrow pattern
 */

import Link from "next/link";
import { useRef, useEffect, useState } from "react";

const MOMENTS = [
  {
    icon: "◎",
    headline: "Un colis inattendu",
    desc: "Pas de signal, pas de prévenance. Ça arrive — et c'est tout.",
  },
  {
    icon: "✦",
    headline: "Leur nom, vos mots",
    desc: "Leur prénom sur l'emballage. Votre message, écrit par vous. Pas une carte standard.",
  },
  {
    icon: "→",
    headline: "Une page rien que pour eux",
    desc: "Quelque chose de numérique qui complète le physique. Quelque chose qu'on garde.",
  },
] as const;

export default function RecipientTeaser() {
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
    const c1 = observe(leftRef.current,  setLeftVis);
    const c2 = observe(rightRef.current, setRightVis);
    return () => { c1?.(); c2?.(); };
  }, []);

  const revealStyle = (visible: boolean, delay = 0): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(32px)",
    transition: `opacity 0.65s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.65s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
  });

  return (
    <section
      style={{ backgroundColor: "var(--bleu)" }}
      aria-labelledby="recipient-teaser-heading"
    >
      <div
        className="mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-start"
        style={{ maxWidth: "72rem", paddingTop: "88px", paddingBottom: "96px" }}
      >
        {/* ── Gauche — headline + CTA ── */}
        <div
          ref={leftRef}
          style={{ display: "flex", flexDirection: "column", gap: "36px", ...revealStyle(leftVis) }}
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
                opacity: 0.45,
              }}
            >
              L&apos;expérience côté destinataire
            </p>

            <h2
              id="recipient-teaser-heading"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)",
                fontWeight: 800,
                color: "var(--dark)",
                lineHeight: 1.05,
                letterSpacing: "-0.025em",
                textWrap: "balance",
                margin: 0,
              }}
            >
              Et eux, ils vivent quoi ?
            </h2>

            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "16px",
                fontWeight: 300,
                lineHeight: 1.78,
                color: "var(--dark)",
                opacity: 0.62,
                maxWidth: "36ch",
              }}
            >
              Un colis qui arrive à l&apos;improviste. Un emballage soigné.
              Quelque chose préparé pour eux — et dans leur tête, la certitude
              que quelqu&apos;un a pensé à eux.
            </p>
          </div>

          <Link
            href="/comment-ca-marche"
            className="hover:opacity-85 transition-opacity"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "12px",
              padding: "14px 14px 14px 28px",
              borderRadius: "999px",
              backgroundColor: "var(--dark)",
              color: "var(--chantilly)",
              fontFamily: "var(--font-body)",
              fontSize: "14px",
              fontWeight: 500,
              textDecoration: "none",
              alignSelf: "flex-start",
            }}
          >
            Voir comment ça marche
            <span
              aria-hidden="true"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "32px",
                height: "32px",
                borderRadius: "999px",
                backgroundColor: "rgba(255,255,255,0.15)",
                fontSize: "15px",
                flexShrink: 0,
              }}
            >
              →
            </span>
          </Link>
        </div>

        {/* ── Droite — liste des moments ── */}
        <div
          ref={rightRef}
          style={{ display: "flex", flexDirection: "column", gap: "0", ...revealStyle(rightVis, 140) }}
        >
          {MOMENTS.map(({ icon, headline, desc }, i) => (
            <div
              key={headline}
              style={{
                display: "flex",
                gap: "20px",
                padding: "28px 0",
                borderBottom: i < MOMENTS.length - 1
                  ? "1px solid rgba(30,27,46,0.10)"
                  : "none",
              }}
            >
              {/* Icon */}
              <span
                aria-hidden="true"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "14px",
                  color: "var(--dark)",
                  opacity: 0.4,
                  flexShrink: 0,
                  width: "20px",
                  paddingTop: "3px",
                  textAlign: "center",
                }}
              >
                {icon}
              </span>

              {/* Text */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <h3
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "15px",
                    fontWeight: 600,
                    color: "var(--dark)",
                    margin: 0,
                    lineHeight: 1.3,
                  }}
                >
                  {headline}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "14px",
                    fontWeight: 300,
                    lineHeight: 1.7,
                    color: "var(--dark)",
                    opacity: 0.6,
                    margin: 0,
                  }}
                >
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
