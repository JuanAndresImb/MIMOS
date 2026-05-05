import React from "react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import NavDropdown from "./NavDropdown";
import NavDropdownAPropos from "./NavDropdownAPropos";
import MobileMenu from "./MobileMenu";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import NavbarScrollBg from "./NavbarScrollBg";
import NavbarColorController from "./NavbarColorController";
import { createClient } from "@/lib/supabase/server";

export default async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const t = await getTranslations("nav");

  return (
    <header
      className="fixed z-40 w-full"
      style={{
        top: "38px",
        height: "80px",
        "--nav-text": "var(--text-primary)",
        "--nav-logo": "var(--primary-500)",
        "--nav-cta-bg": "var(--primary-500)",
        "--nav-cta-color": "white",
      } as React.CSSProperties}
    >
      <NavbarScrollBg />
      <NavbarColorController />
      <div
        className="max-w-6xl mx-auto px-6 h-full"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
        }}
      >
        {/* Logo */}
        <div className="flex items-center">
          <Link
            href="/"
            className="logo-text font-black text-xl leading-none whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)] rounded-sm transition-colors"
            style={{ fontFamily: "var(--font-display)", color: "var(--nav-logo)" }}
          >
            MIMOS
          </Link>
        </div>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Navigation principale">
          <Link
            href="/nos-douceurs"
            className="text-sm font-semibold px-3 py-2 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)]"
            style={{ fontFamily: "var(--font-body)", color: "var(--nav-text)" }}
          >
            Brownies
          </Link>
          <NavDropdown />
          <Link
            href="/offrir/entreprise"
            className="text-sm font-semibold px-3 py-2 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)]"
            style={{ fontFamily: "var(--font-body)", color: "var(--nav-text)" }}
          >
            Entreprises
          </Link>
          <NavDropdownAPropos />
        </nav>

        {/* CTA + compte + locale switcher + hamburger */}
        <div className="flex items-center justify-end gap-2">
          {user && (
            <Link
              href="/compte"
              className="hidden md:inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold transition-colors hover:bg-[var(--primary-100)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)]"
              style={{ color: "var(--text-primary)", border: "1px solid var(--primary-100)", fontFamily: "var(--font-body)" }}
            >
              {t("monCompte")}
            </Link>
          )}
          <div className="hidden md:block">
            <LocaleSwitcher />
          </div>
          <Link
            href="/commander"
            className="cta-btn hidden md:inline-flex items-center px-5 py-2 rounded-full text-sm font-semibold transition-all hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)] focus-visible:ring-offset-2"
            style={{ backgroundColor: "var(--nav-cta-bg)", color: "var(--nav-cta-color)", fontFamily: "var(--font-body)" }}
          >
            {t("commander")}
          </Link>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
