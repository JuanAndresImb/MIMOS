import Link from "next/link";
import NavDropdown from "./NavDropdown";
import MobileMenu from "./MobileMenu";
import { createClient } from "@/lib/supabase/server";

export default async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header
      className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-sm border-b border-[var(--primary-100)]"
      style={{ height: "80px" }}
    >
      <div
        className="max-w-6xl mx-auto px-6 h-full"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
        }}
      >
        {/* Colonne gauche — logo */}
        <div className="flex items-center">
          <Link
            href="/"
            className="font-black text-[var(--primary-500)] text-xl leading-none whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)] rounded-sm"
            style={{ fontFamily: "var(--font-display)" }}
          >
            La Brownie Box Belge
          </Link>
        </div>

        {/* Colonne centre — nav desktop */}
        <nav
          className="hidden md:flex items-center gap-1"
          aria-label="Navigation principale"
        >
          <NavDropdown />

          <Link
            href="/comment-ca-marche"
            className="text-sm font-semibold px-3 py-2 rounded-md transition-colors hover:text-[var(--primary-500)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Comment ça marche
          </Link>

          <Link
            href="/offrir/entreprise"
            className="text-sm font-semibold px-3 py-2 rounded-md transition-colors hover:text-[var(--primary-500)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Entreprises
          </Link>
        </nav>

        {/* Colonne droite — CTA + compte + hamburger */}
        <div className="flex items-center justify-end gap-3">
          {/* Lien Mon compte si connecté */}
          {user && (
            <Link
              href="/compte"
              className="hidden md:inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold transition-colors hover:bg-[var(--primary-100)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)]"
              style={{
                color: "var(--text-primary)",
                border: "1px solid var(--primary-100)",
                fontFamily: "var(--font-body)",
              }}
            >
              Mon compte
            </Link>
          )}

          {/* CTA desktop */}
          <Link
            href="/commander"
            className="hidden md:inline-flex items-center px-5 py-2 rounded-full text-white text-sm font-semibold transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)] focus-visible:ring-offset-2"
            style={{
              backgroundColor: "var(--primary-500)",
              fontFamily: "var(--font-body)",
            }}
          >
            Commander
          </Link>

          {/* Hamburger mobile */}
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
