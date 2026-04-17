import Navbar from "@/components/navbar/Navbar";
import Link from "next/link";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-[var(--primary-100)] bg-[var(--bg-secondary)] py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap items-center justify-center gap-6 text-sm text-[var(--text-secondary)]">
          <Link
            href="/cgv"
            className="hover:text-[var(--text-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)] rounded"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Conditions générales de vente
          </Link>
          <Link
            href="/mentions-legales"
            className="hover:text-[var(--text-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)] rounded"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Mentions légales
          </Link>
          <Link
            href="/politique-de-confidentialite"
            className="hover:text-[var(--text-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)] rounded"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Politique de confidentialité
          </Link>
          <span
            className="text-xs"
            style={{ fontFamily: "var(--font-label)" }}
          >
            © {new Date().getFullYear()} La Brownie Box Belge
          </span>
        </div>
      </footer>
    </>
  );
}
