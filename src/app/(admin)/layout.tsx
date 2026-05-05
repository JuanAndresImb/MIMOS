import Link from "next/link";
import { logout } from "@/actions/auth";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/commandes", label: "Commandes", icon: "📦" },
  { href: "/admin/produits", label: "Produits", icon: "🍫" },
  { href: "/admin/codes-promo", label: "Codes promo", icon: "🎟️" },
  { href: "/admin/factures", label: "Factures", icon: "🧾" },
  { href: "/admin/rgpd", label: "RGPD", icon: "🔒" },
  { href: "/admin/parametres", label: "Paramètres", icon: "⚙️" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "var(--bg-secondary)" }}>
      {/* Sidebar */}
      <aside
        className="w-56 shrink-0 flex flex-col"
        style={{ backgroundColor: "var(--dark)", minHeight: "100vh" }}
      >
        {/* Logo */}
        <div className="px-5 py-6 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <Link
            href="/admin"
            className="text-base font-black leading-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
            style={{ fontFamily: "var(--font-display)", color: "var(--primary-500)" }}
          >
            Brownie Box
            <span className="block text-xs font-normal mt-0.5" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-label)" }}>
              Admin
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4" aria-label="Navigation admin">
          <ul className="flex flex-col gap-1" role="list">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,0.75)" }}
                >
                  <span aria-hidden>{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Déconnexion */}
        <div className="px-3 py-4 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <form action={logout}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white text-left"
              style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,0.5)" }}
            >
              <span aria-hidden>🚪</span>
              Déconnexion
            </button>
          </form>

          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white mt-1"
            style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,0.35)" }}
          >
            <span aria-hidden>↗</span>
            Voir le site
          </Link>
        </div>
      </aside>

      {/* Contenu */}
      <main className="flex-1 p-8 min-w-0">{children}</main>
    </div>
  );
}
