import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatPriceCents } from "@/lib/utils";

export default async function AdminDashboardPage() {
  await requireAdmin();

  const supabase = createAdminClient();

  // Stats en parallèle
  const [ordersRes, revenueRes, pendingRes, customersRes] = await Promise.all([
    supabase.from("orders").select("id", { count: "exact", head: true }),
    supabase
      .from("orders")
      .select("total_cents")
      .eq("status", "paid"),
    supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase.from("customers").select("id", { count: "exact", head: true }),
  ]);

  const totalOrders = ordersRes.count ?? 0;
  const totalRevenue = (revenueRes.data ?? []).reduce(
    (sum, o) => sum + o.total_cents,
    0
  );
  const pendingOrders = pendingRes.count ?? 0;
  const totalCustomers = customersRes.count ?? 0;

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

  const STATS = [
    { label: "Commandes totales", value: totalOrders.toString(), href: "/admin/commandes" },
    { label: "Chiffre d'affaires", value: formatPriceCents(totalRevenue), href: "/admin/commandes" },
    { label: "En attente", value: pendingOrders.toString(), href: "/admin/commandes" },
    { label: "Clients", value: totalCustomers.toString(), href: null },
  ];

  const STATUS_LABELS: Record<string, string> = {
    pending: "En attente",
    paid: "Payée",
    preparing: "Préparation",
    shipped: "Expédiée",
    delivered: "Livrée",
    cancelled: "Annulée",
  };

  const STATUS_COLORS: Record<string, string> = {
    pending: "var(--warning)",
    paid: "var(--success)",
    preparing: "var(--primary-500)",
    shipped: "var(--primary-700)",
    delivered: "var(--success)",
    cancelled: "var(--error)",
  };

  return (
    <div>
      <h1
        className="text-2xl font-black mb-8"
        style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
      >
        Dashboard
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl p-5"
            style={{ backgroundColor: "white", border: "1px solid var(--primary-100)" }}
          >
            <p
              className="text-xs uppercase tracking-widest mb-2"
              style={{ fontFamily: "var(--font-label)", color: "var(--text-secondary)" }}
            >
              {stat.label}
            </p>
            <p
              className="text-2xl font-black"
              style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
            >
              {stat.value}
            </p>
            {stat.href && (
              <Link
                href={stat.href}
                className="text-xs mt-2 inline-block hover:underline"
                style={{ fontFamily: "var(--font-body)", color: "var(--primary-500)" }}
              >
                Voir →
              </Link>
            )}
          </div>
        ))}
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
