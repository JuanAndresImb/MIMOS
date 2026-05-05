import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatPriceCents } from "@/lib/utils";
import ExportForm from "./ExportForm";

export default async function FacturesPage() {
  await requireAdmin();

  const supabase = createAdminClient();

  // 20 dernières commandes payées avec facture B2B ou récentes B2C
  const { data: orders } = await supabase
    .from("orders")
    .select(`
      id,
      created_at,
      status,
      total_cents,
      is_b2b,
      invoice_number,
      company_name,
      customers (email, first_name, last_name)
    `)
    .in("status", ["paid", "preparing", "shipped", "delivered"])
    .order("created_at", { ascending: false })
    .limit(20);

  // Mois courant par défaut pour l'export
  const now = new Date();
  const defaultFrom = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const defaultTo = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${lastDay}`;

  return (
    <div>
      <h1
        className="text-2xl font-black mb-2"
        style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
      >
        Factures & Export
      </h1>
      <p
        className="text-sm mb-8"
        style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}
      >
        Export comptable des commandes par période
      </p>

      {/* Export CSV */}
      <div
        className="rounded-2xl p-6 mb-8"
        style={{ backgroundColor: "white", border: "1px solid var(--primary-100)" }}
      >
        <h2
          className="text-sm font-bold mb-4"
          style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
        >
          Exporter en CSV
        </h2>
        <ExportForm defaultFrom={defaultFrom} defaultTo={defaultTo} />
        <p
          className="text-xs mt-3"
          style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}
        >
          Inclut toutes les commandes payées (B2C et B2B) sur la période — colonnes : numéro facture,
          date, type, client, HTVA, TVA 21%, TVAC, remise, statut.
          Compatible Excel (encodage UTF-8 avec BOM).
        </p>
      </div>

      {/* Liste récente */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ backgroundColor: "white", border: "1px solid var(--primary-100)" }}
      >
        <div className="px-5 py-4 border-b" style={{ borderColor: "var(--primary-100)" }}>
          <h2
            className="text-sm font-bold"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            20 dernières commandes payées
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "var(--bg-secondary)" }}>
                {["Réf.", "Date", "Client", "Type", "Total", "N° Facture", "PDF"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap"
                    style={{ fontFamily: "var(--font-label)", color: "var(--text-secondary)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(orders ?? []).map((order, i) => {
                const customer = order.customers as { email: string; first_name: string | null; last_name: string | null } | null;
                const name = [customer?.first_name, customer?.last_name].filter(Boolean).join(" ") || customer?.email || "—";
                return (
                  <tr
                    key={order.id}
                    style={{ borderTop: i > 0 ? "1px solid var(--primary-100)" : "none" }}
                  >
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--primary-700)" }}>
                      {order.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
                      {new Date(order.created_at).toLocaleDateString("fr-BE")}
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: "var(--text-primary)", fontFamily: "var(--font-body)" }}>
                      {name}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: order.is_b2b ? "var(--primary-50)" : "var(--bg-secondary)",
                          color: order.is_b2b ? "var(--primary-700)" : "var(--text-secondary)",
                          fontFamily: "var(--font-label)",
                        }}
                      >
                        {order.is_b2b ? "B2B" : "B2C"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs font-semibold whitespace-nowrap" style={{ fontFamily: "var(--font-body)", color: "var(--text-primary)" }}>
                      {formatPriceCents(order.total_cents)}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--text-secondary)" }}>
                      {order.invoice_number ?? <span style={{ opacity: 0.4 }}>—</span>}
                    </td>
                    <td className="px-4 py-3">
                      {order.invoice_number ? (
                        <a
                          href={`/api/admin/invoices/${order.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs hover:underline"
                          style={{ color: "var(--primary-500)", fontFamily: "var(--font-body)" }}
                        >
                          PDF →
                        </a>
                      ) : (
                        <span className="text-xs" style={{ color: "var(--text-secondary)", opacity: 0.4 }}>—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {!orders?.length && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-sm" style={{ color: "var(--text-secondary)" }}>
                    Aucune commande payée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
