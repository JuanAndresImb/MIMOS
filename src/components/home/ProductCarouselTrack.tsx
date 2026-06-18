"use client";

/**
 * ProductCarouselTrack — Partie client du carrousel produits
 * Gère le scroll horizontal. Reçoit les produits du Server Component parent.
 *
 * Taste-skill :
 * - Double-bezel cards : outer shell + inner core
 * - Palette cyclique sleeve (festif → affectueux → pro)
 * - CTA pattern imbriqué (→ dans bulle)
 * - Prix réels depuis la DB
 */

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import type { Database } from "@/lib/supabase/database.types";
import { formatPriceCents } from "@/lib/utils";

type Product = Database["public"]["Tables"]["products"]["Row"];

// Palette cyclique pour les cards (utilise les sleeve tokens CSS)
const SLEEVE_CYCLE = [
  {
    bg: "var(--sleeve-festif-bg)",
    accent: "var(--sleeve-festif-accent)",
    dark: "var(--sleeve-festif-dark)",
    label: "Anniversaire",
    href: "/offrir/anniversaire",
  },
  {
    bg: "var(--sleeve-aff-bg)",
    accent: "var(--sleeve-aff-accent)",
    dark: "var(--sleeve-aff-dark)",
    label: "À offrir",
    href: "/offrir/surprise",
  },
  {
    bg: "var(--sleeve-pro-bg)",
    accent: "var(--sleeve-pro-accent)",
    dark: "var(--sleeve-pro-dark)",
    label: "En équipe",
    href: "/offrir/entreprise",
  },
] as const;

interface Props {
  products: Product[];
}

export default function ProductCarouselTrack({ products }: Props) {
  const trackRef     = useRef<HTMLDivElement>(null);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const check = () => setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
    check();
    el.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check, { passive: true });
    return () => {
      el.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  if (products.length === 0) return null;

  return (
    <>
      <div
        ref={trackRef}
        className="no-scrollbar flex gap-4 overflow-x-auto pb-2"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {products.map((product, i) => {
          const sleeve = SLEEVE_CYCLE[i % SLEEVE_CYCLE.length];
          return (
            <Link
              key={product.id}
              href={`/produits/${product.id}?occasion=anniversaire`}
              className="group flex-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)] focus-visible:ring-offset-2"
              style={{
                width: "clamp(220px, 26vw, 290px)",
                scrollSnapAlign: "start",
                /* Outer shell */
                padding: "8px",
                borderRadius: "28px",
                backgroundColor: sleeve.bg,
                border: `1px solid ${sleeve.accent}22`,
                textDecoration: "none",
                display: "flex",
                flexDirection: "column",
                transition: "box-shadow 0.25s ease, transform 0.25s ease",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.boxShadow = "0 10px 44px rgba(30,27,46,0.12)";
                el.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.boxShadow = "none";
                el.style.transform = "translateY(0)";
              }}
              aria-label={`${product.name} — ${formatPriceCents(product.price_cents)}`}
            >
              {/* Inner core */}
              <div
                style={{
                  borderRadius: "calc(28px - 8px)",
                  backgroundColor: sleeve.bg,
                  padding: "32px 26px 26px",
                  minHeight: "260px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: "12px",
                }}
              >
                {/* Top */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "10px",
                      fontWeight: 600,
                      fontStyle: "italic",
                      textTransform: "uppercase",
                      letterSpacing: "0.14em",
                      color: sleeve.accent,
                      margin: 0,
                      opacity: 0.8,
                    }}
                  >
                    {sleeve.label}
                  </p>

                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "20px",
                      fontWeight: 700,
                      color: sleeve.dark,
                      lineHeight: 1.15,
                      letterSpacing: "-0.01em",
                      margin: 0,
                    }}
                  >
                    {product.name}
                  </h3>

                  {product.description && (
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "13px",
                        fontWeight: 300,
                        color: sleeve.dark,
                        opacity: 0.62,
                        lineHeight: 1.6,
                        margin: 0,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {product.description}
                    </p>
                  )}
                </div>

                {/* Bottom — prix + CTA arrow */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: "8px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "18px",
                      fontWeight: 700,
                      color: sleeve.accent,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {formatPriceCents(product.price_cents)}
                  </span>

                  <span
                    className="flex items-center justify-center rounded-full transition-all group-hover:scale-110"
                    style={{
                      width: "36px",
                      height: "36px",
                      border: `1.5px solid ${sleeve.accent}50`,
                      color: sleeve.accent,
                      fontSize: "14px",
                    }}
                    aria-hidden="true"
                  >
                    →
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {canScrollRight && (
        <p
          className="text-center text-xs mt-3 md:hidden"
          style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)", opacity: 0.5 }}
          aria-hidden="true"
        >
          Glisse pour voir plus →
        </p>
      )}
    </>
  );
}
