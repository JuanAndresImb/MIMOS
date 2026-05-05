import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatPriceCents } from "@/lib/utils";

export const revalidate = 60;

export default async function AdminDashboardPage() {
  await requireAdmin();

  const supabase = createAdminClient();

  const twentyFourHoursAgo = new Date();
  twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

  const [ordersRes, revenueRes, toPrepareTodayRes, toPrepareLateRes, customersRes, promosRes] =
    await Promise.all([
      supabase.from("orders").select("id", { count: "exact", head: true }),
      supabase.from("orders").select("total_cents").eq("status", "paid"),
      supabase
        .from("orders")
        .select("id", { count: "exact", head: true })
        .eq("status", "paid"),
      supabase
        .from("orders")
        .select("id", { count: "exact", head: true })
        .eq("status", "paid")
        .lt("created_at", twentyFourHoursAgo.toISOString()),
      supabase.from("customers").select("id", { count: "exact", head: true }),
      supabase
        .from("promo_codes")
        .select("id", { count: "exact", head: true })
        .eq("is_active", true),
    ]);

  const totalOrders   = ordersRes.count ?? 0;
  const totalRevenue  = (revenueRes.data ?? []).reduce((sum, o) => sum + o.total_cents, 0);
  const toPrepare     = toPrepareTodayRes.count ?? 0;
  const prepareLate   = toPrepareLateRes.count ?? 0;
  const totalCustomers = customersRes.count ?? 0;
  const activePromos  = promosRes.count ?? 0;

  // 5 dernières commandes
  const { data: recentOrders } = await supabase
    .from("orders")
    .select(`
      id,
      status,
      total_cents,
      occasion_slug,
      created_at,
      customers (email)
    `)
    .order("created_at", { ascending: false })
    .limit(5);

  const STATUS_LABELS: Record<string, string> = {
    pending:         "En attente",
    pending_payment: "Attente virement",
    paid:            "Payée",
    preparing:       "Préparation",
    shipped:         "Expédiée",
    delivered:       "Livrée",
    cancelled:       "Annulée",
    expired_payment: "Virement expiré",
  };

  const STATUS_COLORS: Record<string, string> = {
    pending:         "var(--warning)",
    pending_payment: "var(--warning)",
    paid:            "var(--success)",
    preparing:       "var(--primary-500)",
    shipped:         "var(--primary-700)",
    delivered:       "var(--success)",
    cancelled:       "var(--error)",
    expired_payment: "var(--error)",
  };

  return (
    <div>
      <h1
        className="text-2xl font-black mb-8"
        style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
      >
        Dashboard
      </h1>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-10">

        {/* Commandes totales */}
        <Link
          href="/admin/commandes"
          className="rounded-2xl p-5 block hover:opacity-90 transition-opacity"
          style={{ backgroundColor: "white", border: "1px solid var(--primary-100)" }}
        >
          <p className="text-xs uppercase tracking-widest mb-2" style={{ fontFamily: "var(--font-label)", color: "var(--text-secondary)" }}>
            Commandes totales
          </p>
          <p className="text-2xl font-black" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
            {totalOrders}
          </p>
        </Link>

        {/* Chiffre d'affaires */}
        <Link
          href="/admin/commandes?status=paid"
          className="rounded-2xl p-5 block hover:opacity-90 transition-opacity"
          style={{ backgroundColor: "white", border: "1px solid var(--primary-100)" }}
        >
          <p className="text-xs uppercase tracking-widest mb-2" style={{ fontFamily: "var(--font-label)", color: "var(--text-secondary)" }}>
            Chiffre d&apos;affaires
          </p>
          <p className="text-2xl font-black" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
            {formatPriceCents(totalRevenue)}
          </p>
        </Link>

        {/* À préparer — badge rouge si >24h */}
        <Link
          href="/admin/commandes?status=paid"
          className="rounded-2xl p-5 block hover:opacity-90 transition-opacity relative"
          style={{
            backgroundColor: "white",
            border: prepareLate > 0 ? "2px solid var(--error)" : "1px solid var(--primary-100)",
          }}
        >
          {prepareLate > 0 && (
            <span
              className="absolute -top-2 -right-2 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "var(--error)", fontFamily: "var(--font-label)" }}
            >
              !
            </span>
          )}
          <p className="text-xs uppercase tracking-widest mb-2" style={{ fontFamily: "var(--font-label)", color: prepareLate > 0 ? "var(--error)" : "var(--text-secondary)" }}>
            À préparer
          </p>
          <p className="text-2xl font-black" style={{ fontFamily: "var(--font-display)", color: prepareLate > 0 ? "var(--error)" : "var(--text-primary)" }}>
            {toPrepare}
          </p>
          {prepareLate > 0 && (
            <p className="text-xs mt-1" style={{ fontFamily: "var(--font-body)", color: "var(--error)" }}>
              {prepareLate} en attente +24h
            </p>
          )}
        </Link>

        {/* Attente virement */}
        <Link
          href="/admin/commandes?status=pending_payment"
          className="rounded-2xl p-5 block hover:opacity-90 transition-opacity"
          style={{ backgroundColor: "white", border: "1px solid var(--primary-100)" }}
        >
          <p className="text-xs uppercase tracking-widest mb-2" style={{ fontFamily: "var(--font-label)", color: "var(--text-secondary)" }}>
            Virement B2B
          </p>
          <p className="text-2xl font-black" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
            —
          </p>
          <p className="text-xs mt-1" style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}>
            Voir en attente →
          </p>
        </Link>

        {/* Codes promo actifs */}
        <Link
          href="/admin/codes-promo"
          className="rounded-2xl p-5 block hover:opacity-90 transition-opacity"
          style={{ backgroundColor: "white", border: "1px solid var(--primary-100)" }}
        >
          <p className="text-xs uppercase tracking-widest mb-2" style={{ fontFamily: "var(--font-label)", color: "var(--text-secondary)" }}>
            Codes promo actifs
          </p>
          <p className="text-2xl font-black" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
            {activePromos}
          </p>
        </Link>

        {/* Clients */}
        <div
          className="rounded-2xl p-5"
          style={{ backgroundColor: "white", border: "1px solid var(--primary-100)" }}
        >
          <p className="text-xs uppercase tracking-widest mb-2" style={{ fontFamily: "var(--font-label)", color: "var(--text-secondary)" }}>
            Clients
          </p>
          <p className="text-2xl font-black" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
            {totalCustomers}
          </p>
        </div>

      </div>

      {/* Commandes récentes */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ backgroundColor: "white", border: "1px solid var(--primary-100)" }}
      >
        <div className="px-6 py-4 border-b" style={{ borderColor: "var(--primary-100)" }}>
          <div className="flex items-center justify-between">
            <h2
              className="text-base font-bold"
              style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
            >
              Dernières commandes
            </h2>
            <Link
              href="/admin/commandes"
              className="text-sm hover:underline"
              style={{ fontFamily: "var(--font-body)", color: "var(--primary-500)" }}
            >
              Tout voir →
            </Link>
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: "var(--bg-secondary)" }}>
              {["Réf.", "Client", "Occasion", "Total", "Statut"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                  style={{ fontFamily: "var(--font-label)", color: "var(--text-secondary)" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(recentOrders ?? []).map((order, i) => (
              <tr
                key={order.id}
                style={{ borderTop: i > 0 ? "1px solid var(--primary-100)" : "none" }}
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/commandes/${order.id}`}
                    className="text-sm font-mono hover:underline"
                    style={{ color: "var(--primary-700)" }}
                  >
                    {order.id.slice(0, 8).toUpperCase()}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm" style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}>
                    {(order.customers as { email: string } | null)?.email ?? "—"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm" style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}>
                    {order.occasion_slug ?? "—"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm font-semibold" style={{ fontFamily: "var(--font-body)", color: "var(--text-primary)" }}>
                    {formatPriceCents(order.total_cents)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{
                      fontFamily: "var(--font-label)",
                      backgroundColor: `${STATUS_COLORS[order.status]}20`,
                      color: STATUS_COLORS[order.status],
                    }}
                  >
                    {STATUS_LABELS[order.status] ?? order.status}
                  </span>
                </td>
              </tr>
            ))}
            {!recentOrders?.length && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm" style={{ color: "var(--text-secondary)" }}>
                  Aucune commande pour l&apos;instant.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
