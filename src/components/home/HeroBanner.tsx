"use client";

import Link from "next/link";
import { useRef, useEffect, useState } from "react";

export default function HeroBanner() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Déjà visible au montage (ex: scroll rapide) → afficher immédiatement
    const rect = el.getBoundingClientRect();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (rect.top < window.innerHeight) { setVisible(true); return; }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
      },
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      style={{ backgroundColor: "var(--lime)" }}
      aria-label="À propos de MIMOS"
    >
      <div
        ref={ref}
        className="mx-auto flex flex-col items-center text-center"
        style={{
          maxWidth: "680px",
          padding: "48px 24px 56px",
          gap: "14px",
        }}
      >
        {/* Description — BuddyBuddy style: 15px / weight 300 / centered */}
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "15px",
            fontWeight: 300,
            lineHeight: 1.65,
            color: "var(--dark)",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(18px)",
            transition: "opacity 0.35s ease, transform 0.35s ease",
          }}
        >
          Des attentions sincères, conçues avec soin pour les personnes qui comptent.
          Un geste simple. Un souvenir qui dure.
        </p>

        {/* CTA — uppercase italic underlined, BuddyBuddy link style */}
        <Link
          href="/offrir/anniversaire"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "14px",
            fontWeight: 400,
            fontStyle: "italic",
            textTransform: "uppercase",
            letterSpacing: "0.02em",
            color: "var(--dark)",
            textDecoration: "underline",
            textUnderlineOffset: "3px",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.35s 0.1s ease, transform 0.35s 0.1s ease",
          }}
        >
          Choisir l&apos;occasion
        </Link>
      </div>
    </section>
  );
}
