"use client";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";

const PRODUCTS = [
  {
    id: "clin-doeil",
    name: "Le Clin d'Œil",
    tagline: "La petite attention parfaite",
    price: "€24,99",
    bg: "#CFC7FA",           /* Lilás */
    href: "/offrir/surprise",
  },
  {
    id: "attention",
    name: "L'Attention",
    tagline: "Le plus offert",
    price: "€29,99",
    bg: "#FFD8DD",           /* Strawberry Blonde */
    href: "/offrir/anniversaire",
  },
  {
    id: "grand-geste",
    name: "Le Grand Geste",
    tagline: "Pour les moments qui le méritent",
    price: "€39,99",
    bg: "#A5E7CB",           /* Menta */
    href: "/offrir/entreprise",
  },
];

export default function ProductCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const check = () =>
      setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
    check();
    el.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check, { passive: true });
    return () => {
      el.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  return (
    <section
      className="w-full"
      style={{
        backgroundColor: "var(--bg-primary)",
        paddingTop: "64px",
        paddingBottom: "72px",
      }}
      aria-labelledby="products-heading"
    >
      <div
        className="mx-auto px-6 flex flex-col md:flex-row gap-10 md:gap-16"
        style={{ maxWidth: "72rem" }}
      >
        {/* Texte gauche */}
        <div className="md:w-52 flex-shrink-0 flex flex-col justify-between gap-8">
          <div className="flex flex-col gap-4">
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "12px",
                fontWeight: 500,
                textTransform: "uppercase",
                fontStyle: "italic",
                letterSpacing: "0.12em",
                color: "var(--dark)",
                opacity: 0.45,
              }}
            >
              Nos douceurs
            </p>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "15px",
                fontWeight: 300,
                lineHeight: 1.7,
                color: "var(--text-secondary)",
              }}
            >
              Trois façons de matérialiser ce que tu ressens. Faites à la main,
              emballées avec soin.
            </p>
          </div>
          <Link
            href="/nos-douceurs"
            className="hover:opacity-60 transition-opacity"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "13px",
              fontWeight: 400,
              fontStyle: "italic",
              textTransform: "uppercase",
              color: "var(--dark)",
              textDecoration: "underline",
              textUnderlineOffset: "3px",
            }}
          >
            Voir toute la gamme &rsaquo;
          </Link>
        </div>

        {/* Cards */}
        <div className="flex-1 min-w-0">
          <div
            ref={trackRef}
            className="no-scrollbar flex gap-4 overflow-x-auto pb-2"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {PRODUCTS.map((product) => (
              <Link
                key={product.id}
                href={product.href}
                className="group flex-none flex flex-col rounded-3xl overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)] focus-visible:ring-offset-2 hover:-translate-y-1 transition-transform duration-200"
                style={{
                  width: "clamp(220px, 26vw, 290px)",
                  scrollSnapAlign: "start",
                  backgroundColor: product.bg,
                  minHeight: "280px",
                  padding: "36px 28px 28px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
                aria-label={`${product.name} — ${product.tagline}`}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "22px",
                      fontWeight: 700,
                      color: "var(--dark)",
                      lineHeight: 1.15,
                    }}
                  >
                    {product.name}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "14px",
                      fontWeight: 300,
                      color: "var(--dark)",
                      opacity: 0.65,
                    }}
                  >
                    {product.tagline}
                  </p>
                </div>

                <div
                  className="flex items-center justify-between"
                  style={{ marginTop: "40px" }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "15px",
                      fontWeight: 500,
                      color: "var(--dark)",
                    }}
                  >
                    {product.price}
                  </span>
                  <span
                    className="flex items-center justify-center rounded-full transition-all group-hover:bg-[var(--dark)] group-hover:text-white"
                    style={{
                      width: "36px",
                      height: "36px",
                      border: "1.5px solid var(--dark)",
                      color: "var(--dark)",
                    }}
                    aria-hidden="true"
                  >
                    <svg
                      width="14"
                      height="14"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {canScrollRight && (
            <p
              className="text-center text-xs mt-3 md:hidden"
              style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}
              aria-hidden="true"
            >
              Glisse pour voir plus
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
