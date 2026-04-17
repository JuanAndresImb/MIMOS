"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { OCCASIONS_LIST } from "@/data/occasions";

const OCCASION_ICONS: Record<string, string> = {
  anniversaire: "🎂",
  "noel-fetes": "🎄",
  surprise: "💛",
  collegue: "💼",
  entreprise: "🏢",
};

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Fermeture avec Escape
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

  // Bloquer le scroll body quand ouvert
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Bouton hamburger */}
      <button
        ref={buttonRef}
        className="md:hidden flex items-center justify-center w-11 h-11 rounded-lg transition-colors hover:bg-[var(--primary-50)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)]"
        aria-label={open ? "Fermer le menu de navigation" : "Ouvrir le menu de navigation"}
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

      {/* Overlay full-screen — rendu via portal pour échapper au backdrop-filter du header */}
      {open && typeof document !== "undefined" && createPortal(
        <div
          id="mobile-menu"
          ref={menuRef}
          className="fixed inset-0 z-50 flex flex-col bg-white"
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navigation"
        >
          {/* Header overlay */}
          <div className="flex items-center justify-between px-6 h-20 border-b border-[var(--primary-100)]">
            <Link
              href="/"
              className="font-black text-[var(--primary-500)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)] rounded"
              style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem" }}
              onClick={() => setOpen(false)}
            >
              La Brownie Box Belge
            </Link>
            <button
              className="flex items-center justify-center w-11 h-11 rounded-lg transition-colors hover:bg-[var(--primary-50)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)]"
              aria-label="Fermer le menu de navigation"
              onClick={() => {
                setOpen(false);
                buttonRef.current?.focus();
              }}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Liens occasions */}
          <nav className="flex-1 overflow-y-auto px-6 py-8" aria-label="Navigation occasions">
            <p
              className="text-xs font-mono uppercase tracking-widest text-[var(--text-secondary)] mb-4"
              style={{ fontFamily: "var(--font-label)" }}
            >
              Offrir une box
            </p>
            <ul className="space-y-1">
              {OCCASIONS_LIST.map((occasion) => (
                <li key={occasion.slug}>
                  <Link
                    href={`/offrir/${occasion.slug}`}
                    className="flex items-center gap-4 py-3 rounded-xl px-3 transition-colors hover:bg-[var(--primary-50)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)]"
                    onClick={() => setOpen(false)}
                  >
                    <span className="text-2xl" aria-hidden="true">
                      {OCCASION_ICONS[occasion.slug]}
                    </span>
                    <span
                      className="font-black text-[var(--text-primary)]"
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "clamp(1.75rem, 5vw, 3rem)",
                        lineHeight: 1.1,
                      }}
                    >
                      {occasion.nom}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* CTA bas */}
          <div className="px-6 py-6 border-t border-[var(--primary-100)]">
            <Link
              href="/commander"
              className="block w-full text-center py-4 rounded-full text-white font-semibold text-base transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)] focus-visible:ring-offset-2"
              style={{
                backgroundColor: "var(--primary-500)",
                fontFamily: "var(--font-body)",
              }}
              onClick={() => setOpen(false)}
            >
              Commander une box
            </Link>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
