import { redirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { logoutCustomer } from "@/actions/auth";
import { formatPriceCents } from "@/lib/utils";
import { getOccasion } from "@/data/occasions";

export const metadata: Metadata = {
  title: "Mon compte — La Brownie Box Belge",
  robots: { index: false, follow: false },
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending:     { label: "En attente",     color: "var(--warning)" },
  paid:        { label: "Payée",          color: "var(--success)" },
  preparing:   { label: "En préparation", color: "var(--primary-500)" },
  shipped:     { label: "Expédiée",       color: "var(--primary-500)" },
  delivered:   { label: "Livrée",         color: "var(--success)" },
  cancelled:   { label: "Annulée",        color: "var(--error)" },
};

export default async function ComptePage() {
  // 1. Récupérer l'utilisateur connecté
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/compte/connexion");

  // 2. Trouver le customer lié à ce compte Auth
  const admin = createAdminClient();
  const { data: customer } = await admin
    .from("customers")
    .select("id, first_name, last_name, email")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!customer) redirect("/compte/connexion");

  // 3. Récupérer les commandes (hors annulées pending sans paiement)
  const { data: orders } = await admin
    .from("orders")
    .select("id, created_at, status, total_cents, occasion_slug, delivery_address, tracking_number")
    .eq("customer_id", customer.id)
    .not("status", "eq", "pending")
    .order("created_at", { ascending: false });

  const displayOrders = orders ?? [];

  return (
    <div
      className="min-h-screen py-12"
      style={{ backgroundColor: "var(--bg-secondary)" }}
    >
      <div className="mx-auto px-6" style={{ maxWidth: "42rem" }}>

        {/* En-tête */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1
              className="text-3xl font-black mb-1"
              style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
            >
              Mon compte
            </h1>
            <p
              className="text-sm"
              style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}
            >
              {customer.first_name && customer.last_name
                ? `${customer.first_name} ${customer.last_name} · `
                : ""}
              {customer.email}
            </p>
          </div>
          <form action={logoutCustomer}>
            <button
              type="submit"
              className="text-xs font-semibold px-4 py-2 rounded-full transition-colors hover:bg-[var(--primary-100)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)]"
              style={{
                fontFamily: "var(--font-body)",
                color: "var(--text-secondary)",
                border: "1px solid var(--primary-100)",
              }}
            >
              Déconnexion
            </button>
          </form>
        </div>

        {/* Commandes */}
        <h2
          className="text-xs uppercase tracking-widest mb-4"
          style={{ fontFamily: "var(--font-label)", color: "var(--primary-500)" }}
        >
          Mes commandes
        </h2>

        {displayOrders.length === 0 ? (
          <div
            className="rounded-2xl p-8 text-center"
            style={{ backgroundColor: "white", border: "1px solid var(--primary-100)" }}
          >
            <p
              className="text-sm mb-4"
              style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}
            >
              Vous n&apos;avez pas encore de commande.
            </p>
            <Link
              href="/commander"
              className="inline-flex items-center px-5 py-2.5 rounded-full text-white text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ backgroundColor: "var(--primary-500)", fontFamily: "var(--font-body)" }}
            >
              Commander une box
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {displayOrders.map((order) => {
              const occasion = order.occasion_slug ? getOccasion(order.occasion_slug) : undefined;
              const address = order.delivery_address as { prenom?: string; ville?: string } | null;
              const status = STATUS_LABELS[order.status] ?? { label: order.status, color: "var(--text-secondary)" };
              const date = new Intl.DateTimeFormat("fr-BE", {
                day: "numeric", month: "long", year: "numeric",
              }).format(new Date(order.created_at));

              return (
                <div
                  key={order.id}
                  className="rounded-2xl p-5"
                  style={{ backgroundColor: "white", border: "1px solid var(--primary-100)" }}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <p
                        className="text-xs uppercase tracking-widest mb-0.5"
                        style={{ fontFamily: "var(--font-label)", color: occasion?.sleeveTokens.accent ?? "var(--primary-500)" }}
                      >
                        {occasion?.nom ?? order.occasion_slug ?? "—"}
                      </p>
                      <p
                        className="text-sm font-semibold"
                        style={{ fontFamily: "var(--font-body)", color: "var(--text-primary)" }}
                      >
                        {address?.prenom
                          ? `Pour ${address.prenom}${address.ville ? ` · ${address.ville}` : ""}`
                          : `Réf. ${order.id.slice(0, 8).toUpperCase()}`}
                      </p>
                      <p
                        className="text-xs mt-0.5"
                        style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}
                      >
                        {date} · {formatPriceCents(order.total_cents)}
                      </p>
                    </div>
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
                      style={{
                        backgroundColor: `${status.color}18`,
                        color: status.color,
                        fontFamily: "var(--font-label)",
                      }}
                    >
                      {status.label}
                    </span>
                  </div>

                  {/* Lien de suivi bpost si expédiée */}
                  {order.tracking_number && (
                    <a
                      href={`https://track.bpost.cloud/btr/web/#/search?itemCode=${order.tracking_number}&lang=fr`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold transition-opacity hover:opacity-80"
                      style={{ color: "var(--primary-500)", fontFamily: "var(--font-body)" }}
                    >
                      Suivre mon colis bpost →
                    </a>
                  )}

                  {/* Lien vers page de confirmation */}
                  <div className={order.tracking_number ? "mt-2" : ""}>
                    <Link
                      href={`/confirmation?order=${order.id}`}
                      className="text-xs transition-opacity hover:opacity-70"
                      style={{ color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}
                    >
                      Voir le récapitulatif →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
