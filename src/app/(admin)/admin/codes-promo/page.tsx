import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatPriceCents } from "@/lib/utils";
import PromoCodeForm from "./PromoCodeForm";
import TogglePromoForm from "./TogglePromoForm";

export default async function CodesPromoPage() {
  await requireAdmin();

  const supabase = createAdminClient();
  const { data: codes } = await supabase
    .from("promo_codes")
    .select("*")
    .order("created_at", { ascending: false });

  function formatValue(type: string, valueCents: number) {
    if (type === "percent") return `${(valueCents / 100).toFixed(0)} %`;
    return `−${formatPriceCents(valueCents)}`;
  }

  return (
    <div>
      <h1
        className="text-2xl font-black mb-8"
        style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
      >
        Codes promo
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulaire création */}
        <div
          className="rounded-2xl p-6"
          style={{ backgroundColor: "white", border: "1px solid var(--primary-100)" }}
        >
          <h2
            className="text-sm font-bold mb-5"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            Créer un code
          </h2>
          <PromoCodeForm />
        </div>

        {/* Liste */}
        <div className="lg:col-span-2">
          <div
            className="rounded-2xl overflow-hidden"
            style={{ backgroundColor: "white", border: "1px solid var(--primary-100)" }}
          >
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: "var(--bg-secondary)" }}>
                  {["Code", "Type", "Valeur", "Expiration", "Statut", ""].map((h) => (
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
                {(codes ?? []).map((code, i) => {
                  const isExpired =
                    code.expires_at && new Date(code.expires_at) < new Date();
                  return (
                    <tr
                      key={code.id}
                      style={{ borderTop: i > 0 ? "1px solid var(--primary-100)" : "none" }}
                    >
                      <td className="px-4 py-3">
                        <span className="text-sm font-mono font-bold" style={{ color: "var(--text-primary)" }}>
                          {code.code}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm" style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}>
                          {code.type === "percent" ? "Pourcentage" : "Fixe"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-semibold" style={{ fontFamily: "var(--font-body)", color: "var(--success)" }}>
                          {formatValue(code.type, code.value_cents)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="text-sm"
                          style={{
                            fontFamily: "var(--font-body)",
                            color: isExpired ? "var(--error)" : "var(--text-secondary)",
                          }}
                        >
                          {code.expires_at
                            ? new Date(code.expires_at).toLocaleDateString("fr-BE")
                            : "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{
                            fontFamily: "var(--font-label)",
                            backgroundColor: code.is_active && !isExpired ? "#e8faf620" : "#fef2f2",
                            color: code.is_active && !isExpired ? "var(--success)" : "var(--error)",
                          }}
                        >
                          {isExpired ? "Expiré" : code.is_active ? "Actif" : "Inactif"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <TogglePromoForm id={code.id} isActive={code.is_active} />
                      </td>
                    </tr>
                  );
                })}
                {!codes?.length && (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-sm" style={{ color: "var(--text-secondary)" }}>
                      Aucun code promo.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
