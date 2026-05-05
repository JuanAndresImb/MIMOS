"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import type { SleeveTokens } from "@/data/occasions";

// ─── Occasion copy ────────────────────────────────────────────────────────────

const OCCASION_COPY: Record<string, { eyebrow: string; intro: string; ghost: string }> = {
  anniversaire: {
    eyebrow: "Joyeux anniversaire",
    intro: "Quelqu'un tenait à te le dire autrement.",
    ghost: "Anniversaire",
  },
  "noel-fetes": {
    eyebrow: "Joyeuses fêtes",
    intro: "Un geste sincère, avant que tout s'emballe.",
    ghost: "Fêtes",
  },
  surprise: {
    eyebrow: "Juste parce que",
    intro: "Les meilleurs gestes n'ont pas de raison.",
    ghost: "Surprise",
  },
  collegue: {
    eyebrow: "Merci",
    intro: "Pas juste en paroles.",
    ghost: "Merci",
  },
  entreprise: {
    eyebrow: "Avec toute notre reconnaissance",
    intro: "La reconnaissance, ça se fait aussi en vrai.",
    ghost: "Équipe",
  },
};

// ─── Hook: monte state ─────────────────────────────────────────────────────────

function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);
  return mounted;
}

// ─── Hook: in-view ────────────────────────────────────────────────────────────

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// ─── Reveal scroll ────────────────────────────────────────────────────────────

function Reveal({ children, delay = 0, y = 60 }: { children: ReactNode; delay?: number; y?: number }) {
  const { ref, inView } = useInView(0.1);
  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : `translateY(${y}px)`,
        transition: `opacity 1s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 1s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}

// ─── Fade in au montage ────────────────────────────────────────────────────────

function HeroFade({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const mounted = useMounted();
  return (
    <div
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(22px)",
        transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}

// ─── Scroll chevron ───────────────────────────────────────────────────────────

function ScrollArrow({ color }: { color: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), 1800); return () => clearTimeout(t); }, []);
  return (
    <div
      aria-hidden
      style={{
        position: "absolute", bottom: "32px", left: "50%",
        opacity: show ? 0.45 : 0,
        transition: "opacity 1.2s ease",
        animation: show ? "gift-bounce 2.2s ease-in-out infinite" : "none",
        transform: "translateX(-50%)",
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round">
        <path d="M12 5v14M5 12l7 7 7-7" />
      </svg>
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

export interface DestinataireImmersifProps {
  recipientName: string;
  senderName: string;
  message: string;
  occasionSlug: string;
  tokens: SleeveTokens;
  promoCode: { code: string; value_cents: number; expires_at: string | null } | null;
  promoExpiry: string | null;
  ctaUrl: string;
}

// ─── Composant principal ──────────────────────────────────────────────────────

export default function DestinataireImmersif({
  recipientName,
  senderName,
  message,
  occasionSlug,
  tokens,
  promoCode,
  promoExpiry,
  ctaUrl,
}: DestinataireImmersifProps) {
  const copy = OCCASION_COPY[occasionSlug] ?? {
    eyebrow: "Un geste pour toi",
    intro: "Quelqu'un a pensé à toi.",
    ghost: "MIMOS",
  };

  // Parallax sur le ghost text du hero
  const ghostRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleScroll = () => {
      if (!ghostRef.current) return;
      const y = window.scrollY;
      ghostRef.current.style.transform = `translateY(${y * 0.35}px)`;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <style>{`
        @keyframes gift-bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50%       { transform: translateX(-50%) translateY(10px); }
        }
        @keyframes gift-stamp {
          0%   { transform: scale(1.2) rotate(-2deg); opacity: 0; }
          60%  { transform: scale(0.97) rotate(0.3deg); opacity: 1; }
          100% { transform: scale(1) rotate(0); opacity: 1; }
        }
        @keyframes gift-pulse-ring {
          0%   { transform: scale(1); opacity: 0.15; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        * { box-sizing: border-box; }
      `}</style>

      {/* ── Bouton X fixe ── */}
      <Link
        href="/"
        aria-label="Retour à MIMOS"
        style={{
          position: "fixed",
          top: "24px",
          right: "24px",
          zIndex: 100,
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          backgroundColor: "rgba(255,255,255,0.18)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          border: `1px solid rgba(255,255,255,0.3)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: tokens.dark,
          textDecoration: "none",
          transition: "background-color 0.2s ease, transform 0.2s ease",
        }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.35)")}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.18)")}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </Link>

      <main style={{ backgroundColor: tokens.bg }}>

        {/* ════════════════════════════════════════════════════════
            SECTION 1 — HERO IMMERSIF
        ════════════════════════════════════════════════════════ */}
        <section
          style={{
            minHeight: "100svh",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "80px 32px",
            textAlign: "center",
          }}
        >
          {/* Ghost text parallax background */}
          <div
            ref={ghostRef}
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
              overflow: "hidden",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(8rem, 25vw, 22rem)",
                fontWeight: 900,
                color: "transparent",
                WebkitTextStroke: `1.5px ${tokens.accent}`,
                opacity: 0.1,
                lineHeight: 1,
                whiteSpace: "nowrap",
                userSelect: "none",
                letterSpacing: "-0.03em",
              }}
            >
              {copy.ghost}
            </span>
          </div>

          {/* Cercles décoratifs */}
          <div aria-hidden style={{ position: "absolute", top: "-180px", right: "-180px", width: "600px", height: "600px", borderRadius: "50%", border: `1px solid ${tokens.accent}`, opacity: 0.1, pointerEvents: "none" }} />
          <div aria-hidden style={{ position: "absolute", bottom: "-120px", left: "-120px", width: "400px", height: "400px", borderRadius: "50%", backgroundColor: tokens.accent, opacity: 0.06, pointerEvents: "none" }} />
          {/* Petit dot pulsant */}
          <div aria-hidden style={{ position: "absolute", top: "28%", right: "9%", width: "8px", height: "8px", borderRadius: "50%", backgroundColor: tokens.accent, opacity: 0.35, pointerEvents: "none" }} />

          {/* Contenu hero */}
          <div style={{ position: "relative", zIndex: 1 }}>
            <HeroFade delay={80}>
              <p style={{ fontFamily: "var(--font-label)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.32em", textTransform: "uppercase", color: tokens.accent, marginBottom: "36px" }}>
                MIMOS
              </p>
            </HeroFade>

            <HeroFade delay={360}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(15px, 2vw, 18px)", fontWeight: 300, fontStyle: "italic", color: tokens.dark, opacity: 0.65, marginBottom: "16px" }}>
                {copy.eyebrow}
              </p>
            </HeroFade>

            <HeroFade delay={620}>
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(3.5rem, 13vw, 9rem)",
                  fontWeight: 900,
                  color: tokens.dark,
                  lineHeight: 0.95,
                  letterSpacing: "-0.025em",
                  marginBottom: "32px",
                }}
              >
                Pour {recipientName}
              </h1>
            </HeroFade>

            <HeroFade delay={900}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "14px" }}>
                <span aria-hidden style={{ width: "32px", height: "1.5px", backgroundColor: tokens.accent, borderRadius: "999px", display: "block" }} />
                <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", fontWeight: 400, color: tokens.dark, opacity: 0.65 }}>
                  {senderName} a pensé à toi
                </p>
              </div>
            </HeroFade>
          </div>

          <ScrollArrow color={tokens.dark} />
        </section>

        {/* ════════════════════════════════════════════════════════
            SECTION 2 — MESSAGE (fond blanc, contraste fort)
        ════════════════════════════════════════════════════════ */}
        <section
          style={{
            minHeight: "100svh",
            backgroundColor: "#FFFDFE",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "80px 32px",
          }}
        >
          {/* Ghost name en arrière-plan */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              bottom: "-20px",
              right: "-40px",
              fontFamily: "var(--font-display)",
              fontSize: "clamp(6rem, 20vw, 18rem)",
              fontWeight: 900,
              color: "transparent",
              WebkitTextStroke: `1px ${tokens.accent}`,
              opacity: 0.06,
              lineHeight: 1,
              whiteSpace: "nowrap",
              userSelect: "none",
              letterSpacing: "-0.03em",
              pointerEvents: "none",
            }}
          >
            {recipientName}
          </div>

          <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "640px" }}>

            {/* Eyebrow */}
            <Reveal delay={0}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.2em", color: tokens.accent, marginBottom: "40px", textAlign: "center" }}>
                {copy.intro}
              </p>
            </Reveal>

            {/* Carte message */}
            <Reveal delay={120} y={80}>
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "32px",
                  padding: "48px 44px 40px",
                  boxShadow: `0 20px 80px ${tokens.accent}18, 0 4px 20px rgba(0,0,0,0.04)`,
                  borderLeft: `5px solid ${tokens.accent}`,
                  marginBottom: "28px",
                  position: "relative",
                }}
              >
                {/* Grand guillemet */}
                <span
                  aria-hidden
                  style={{
                    display: "block",
                    fontFamily: "var(--font-display)",
                    fontSize: "96px",
                    fontWeight: 900,
                    lineHeight: 0.6,
                    color: tokens.accent,
                    opacity: 0.15,
                    marginBottom: "20px",
                    userSelect: "none",
                  }}
                >
                  &ldquo;
                </span>

                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(1.2rem, 2.8vw, 1.55rem)",
                    fontWeight: 700,
                    lineHeight: 1.6,
                    color: "var(--dark)",
                  }}
                >
                  {message}
                </p>

                {/* Signature */}
                <div style={{ marginTop: "36px", paddingTop: "24px", borderTop: `1.5px solid ${tokens.bg}`, display: "flex", alignItems: "center", gap: "14px" }}>
                  <span aria-hidden style={{ width: "28px", height: "2px", backgroundColor: tokens.accent, borderRadius: "999px", flexShrink: 0 }} />
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: 500, color: "var(--dark)", opacity: 0.5 }}>
                    {senderName}
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            SECTION 3 — PROMO + CTA (retour couleur occasion)
        ════════════════════════════════════════════════════════ */}
        <section
          style={{
            minHeight: "70svh",
            backgroundColor: tokens.bg,
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "80px 32px 100px",
          }}
        >
          {/* Ghost sender name en fond */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontFamily: "var(--font-display)",
              fontSize: "clamp(5rem, 18vw, 16rem)",
              fontWeight: 900,
              color: "transparent",
              WebkitTextStroke: `1px ${tokens.accent}`,
              opacity: 0.07,
              lineHeight: 1,
              whiteSpace: "nowrap",
              userSelect: "none",
              letterSpacing: "-0.03em",
              pointerEvents: "none",
            }}
          >
            {senderName}
          </div>

          <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "520px" }}>

            {/* Carte promo */}
            {promoCode && (
              <Reveal delay={0}>
                <div
                  style={{
                    backgroundColor: "white",
                    borderRadius: "24px",
                    padding: "32px",
                    border: `2px dashed ${tokens.accent}`,
                    marginBottom: "24px",
                    animation: "gift-stamp 0.7s cubic-bezier(0.16,1,0.3,1) 0.3s both",
                  }}
                >
                  <p style={{ fontFamily: "var(--font-label)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: tokens.accent, marginBottom: "14px" }}>
                    Ton cadeau
                  </p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
                    <div>
                      <p style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 900, color: "var(--dark)", letterSpacing: "0.05em" }}>
                        {promoCode.code}
                      </p>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--dark)", opacity: 0.5, marginTop: "4px" }}>
                        {promoExpiry
                          ? `10% de réduction — valable jusqu'au ${promoExpiry}`
                          : "10% de réduction sur ta première commande"}
                      </p>
                    </div>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: "32px", fontWeight: 900, color: tokens.accent, flexShrink: 0 }}>
                      −10%
                    </span>
                  </div>
                </div>
              </Reveal>
            )}

            {/* CTA */}
            <Reveal delay={promoCode ? 160 : 0}>
              <Link
                href={ctaUrl}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "center",
                  padding: "20px 32px",
                  borderRadius: "999px",
                  backgroundColor: tokens.dark,
                  color: "white",
                  fontFamily: "var(--font-body)",
                  fontSize: "15px",
                  fontWeight: 600,
                  textDecoration: "none",
                  letterSpacing: "0.01em",
                  transition: "opacity 0.2s ease",
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.82")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
              >
                Offrir à mon tour
              </Link>
              {promoCode && (
                <p style={{ textAlign: "center", fontFamily: "var(--font-body)", fontSize: "12px", color: tokens.dark, opacity: 0.4, marginTop: "12px" }}>
                  Le code sera appliqué automatiquement
                </p>
              )}
            </Reveal>

            {/* Lien retour discret */}
            <Reveal delay={300}>
              <div style={{ textAlign: "center", marginTop: "48px" }}>
                <Link
                  href="/"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "12px",
                    fontWeight: 400,
                    color: tokens.dark,
                    opacity: 0.35,
                    textDecoration: "none",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  Retour à MIMOS
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
    </>
  );
}
