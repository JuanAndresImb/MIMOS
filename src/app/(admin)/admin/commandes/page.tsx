import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatPriceCents } from "@/lib/utils";

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

interface Props {
  searchParams: Promise<{ status?: string }>;
}

export default async function CommandesPage({ searchParams }: Props) {
  await requireAdmin();

  const { status: filterStatus } = await searchParams;
  const supabase = createAdminClient();

  let query = supabase
    .from("orders")
    .select(`
      id,
      status,
      total_cents,
      occasion_slug,
      sender_name,
      created_at,
      customers (email)
    `)
    .order("created_at", { ascending: false });

  if (filterStatus && filterStatus !== "all") {
    query = query.eq("status", filterStatus);
  }

  const { data: orders } = await query;

  const filters = [
    { value: "all", label: "Toutes" },
    { value: "pending", label: "En attente" },
    { value: "paid", label: "Payées" },
    { value: "preparing", label: "Préparation" },
    { value: "shipped", label: "Expédiées" },
    { value: "delivered", label: "Livrées" },
    { value: "cancelled", label: "Annulées" },
  ];

  return (
    <div>
      <h1
        className="text-2xl font-black mb-6"
        style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
      >
        Commandes
      </h1>

      {/* Filtres */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map((f) => (
          <Link
            key={f.value}
            href={f.value === "all" ? "/admin/commandes" : `/admin/commandes?status=${f.value}`}
            className="px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
            style={{
              fontFamily: "var(--font-label)",
              backgroundColor:
                (filterStatus ?? "all") === f.value
                  ? "var(--primary-500)"
                  : "white",
              color:
                (filterStatus ?? "all") === f.value
                  ? "white"
                  : "var(--text-secondary)",
              border: "1px solid var(--primary-100)",
            }}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {/* Table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ backgroundColor: "white", border: "1px solid var(--primary-100)" }}
      >
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: "var(--bg-secondary)" }}>
              {["Réf.", "Date", "Client", "Occasion", "Expéditeur", "Total", "Statut", ""].map((h) => (
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
            {(orders ?? []).map((order, i) => (
              <tr
                key={order.id}
                style={{ borderTop: i > 0 ? "1px solid var(--primary-100)" : "none" }}
              >
                <td className="px-4 py-3">
                  <span className="text-xs font-mono" style={{ color: "var(--text-secondary)" }}>
                    {order.id.slice(0, 8).toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm" style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}>
                    {new Date(order.created_at).toLocaleDateString("fr-BE")}
                  </span>
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
                  <span className="text-sm" style={{ fontFamily: "var(--font-body)", color: "var(--text-primary)" }}>
                    {order.sender_name ?? "—"}
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
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/commandes/${order.id}`}
                    className="text-xs hover:underline"
                    style={{ color: "var(--primary-500)", fontFamily: "var(--font-body)" }}
                  >
                    Détail →
                  </Link>
                </td>
              </tr>
            ))}
            {!orders?.length && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-sm" style={{ color: "var(--text-secondary)" }}>
                  Aucune commande trouvée.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
