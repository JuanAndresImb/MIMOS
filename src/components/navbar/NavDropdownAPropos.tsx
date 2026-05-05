"use client";

import { useState } from "react";
import Link from "next/link";

const ITEMS = [
  {
    href: "/a-propos",
    label: "Notre histoire",
    description: "Pourquoi MIMOS existe",
  },
  {
    href: "/comment-ca-marche",
    label: "Comment ça marche",
    description: "En 3 étapes, 3 minutes",
  },
  {
    href: "/comment-ca-marche#faq-heading",
    label: "FAQ",
    description: "Les questions fréquentes",
  },
];

export default function NavDropdownAPropos() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className="flex items-center gap-1 text-sm font-semibold h-full px-3 py-2 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)]"
        style={{ fontFamily: "var(--font-body)", color: "var(--nav-text, var(--text-primary))" }}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
      >
        À propos
        <svg
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 rounded-2xl shadow-xl border z-50 overflow-hidden"
          style={{
            width: "260px",
            backgroundColor: "var(--chantilly)",
            borderColor: "rgba(35,21,16,0.08)",
          }}
          role="menu"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <div className="p-2">
            <ul role="none" style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              {ITEMS.map((item) => (
                <li key={item.href} role="none">
                  <Link
                    href={item.href}
                    role="menuitem"
                    className="flex flex-col gap-0.5 px-3 py-3 rounded-xl transition-colors hover:bg-[var(--bleu)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)]"
                    onClick={() => setOpen(false)}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "var(--dark)",
                      }}
                    >
                      {item.label}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "12px",
                        fontWeight: 300,
                        color: "var(--dark)",
                        opacity: 0.55,
                      }}
                    >
                      {item.description}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
