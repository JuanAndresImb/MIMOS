"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { OCCASIONS_LIST } from "@/data/occasions";
import LocaleSwitcher from "@/components/LocaleSwitcher";

const OCCASION_LABELS: Record<string, string> = {
  anniversaire: "Son anniversaire",
  "noel-fetes": "Noël & les fêtes",
  surprise: "Juste parce que",
  collegue: "Un merci sincère",
  entreprise: "Toute l'équipe",
};

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const t = useTranslations("nav");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <button
        ref={buttonRef}
        className="md:hidden flex items-center justify-center w-11 h-11 rounded-lg transition-colors hover:bg-[var(--primary-50)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)]"
        aria-label={open ? t("fermer") : t("menu")}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {open && typeof document !== "undefined" && createPortal(
        <div
          id="mobile-menu"
          ref={menuRef}
          className="fixed inset-0 z-50 flex flex-col"
          style={{ backgroundColor: "var(--chantilly)" }}
          role="dialog"
          aria-modal="true"
          aria-label={t("menu")}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-6 h-20"
            style={{ borderBottom: "1px solid rgba(30,27,46,0.07)" }}
          >
            <Link
              href="/"
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)] rounded"
              style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, color: "var(--primary-500)" }}
              onClick={close}
            >
              MIMOS
            </Link>
            <button
              className="flex items-center justify-center w-11 h-11 rounded-lg transition-colors hover:bg-[var(--primary-50)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)]"
              aria-label={t("fermer")}
              onClick={() => { close(); buttonRef.current?.focus(); }}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-10" aria-label="Navigation mobile">

            {/* Brownies */}
            <div>
              <Link
                href="/nos-douceurs"
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)] rounded"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2rem, 6vw, 3rem)",
                  fontWeight: 700,
                  color: "var(--dark)",
                  lineHeight: 1.1,
                  textDecoration: "none",
                }}
                onClick={close}
              >
                Brownies
              </Link>
            </div>

            {/* Moments */}
            <div>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "12px",
                  fontWeight: 500,
                  fontStyle: "italic",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "var(--text-secondary)",
                  marginBottom: "16px",
                }}
              >
                Moments
              </p>
              <ul className="flex flex-col gap-1">
                {OCCASIONS_LIST.map((occasion) => (
                  <li key={occasion.slug}>
                    <Link
                      href={`/offrir/${occasion.slug}`}
                      className="flex items-center gap-3 py-2.5 px-3 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)]"
                      style={{ backgroundColor: "transparent" }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                          occasion.sleeveTokens.bg;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                          "transparent";
                      }}
                      onClick={close}
                    >
                      <span
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          backgroundColor: occasion.sleeveTokens.bg,
                          border: `1.5px solid ${occasion.sleeveTokens.accent}`,
                          flexShrink: 0,
                        }}
                        aria-hidden="true"
                      />
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "17px",
                          fontWeight: 500,
                          color: "var(--dark)",
                        }}
                      >
                        {OCCASION_LABELS[occasion.slug] ?? occasion.nom}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Entreprises */}
            <div>
              <Link
                href="/offrir/entreprise"
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)] rounded"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2rem, 6vw, 3rem)",
                  fontWeight: 700,
                  color: "var(--dark)",
                  lineHeight: 1.1,
                  textDecoration: "none",
                }}
                onClick={close}
              >
                Entreprises
              </Link>
            </div>

            {/* À propos */}
            <div>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "12px",
                  fontWeight: 500,
                  fontStyle: "italic",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "var(--text-secondary)",
                  marginBottom: "16px",
                }}
              >
                À propos
              </p>
              <ul style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                {[
                  { href: "/a-propos", label: "Notre histoire", desc: "Pourquoi MIMOS existe" },
                  { href: "/comment-ca-marche", label: "Comment ça marche", desc: "En 3 étapes, 3 minutes" },
                  { href: "/comment-ca-marche#faq-heading", label: "FAQ", desc: "Les questions fréquentes" },
                ].map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="flex flex-col gap-0.5 py-2.5 px-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)]"
                      onClick={close}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "17px",
                          fontWeight: 500,
                          color: "var(--dark)",
                        }}
                      >
                        {item.label}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "13px",
                          fontWeight: 300,
                          color: "var(--dark)",
                          opacity: 0.5,
                        }}
                      >
                        {item.desc}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* Footer */}
          <div
            className="px-6 py-4 flex items-center justify-between"
            style={{ borderTop: "1px solid rgba(30,27,46,0.07)" }}
          >
            <LocaleSwitcher />
            <Link
              href="/commander"
              className="inline-flex items-center px-6 py-3 rounded-full font-semibold text-sm transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)] focus-visible:ring-offset-2"
              style={{
                backgroundColor: "var(--primary-500)",
                color: "white",
                fontFamily: "var(--font-body)",
              }}
              onClick={close}
            >
              {t("commander")}
            </Link>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
