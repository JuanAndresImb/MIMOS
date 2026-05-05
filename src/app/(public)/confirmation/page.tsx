import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatPriceCents } from "@/lib/utils";
import { getOccasion } from "@/data/occasions";
import { getMollieClient } from "@/lib/mollie";
import CreateAccountForm from "./CreateAccountForm";

export const metadata: Metadata = {
  title: "Confirmation de commande",
  robots: { index: false, follow: false },
};

interface Props {
  searchParams: Promise<{ order?: string }>;
}

// ─── Statut ───────────────────────────────────────────────────────────────────

type OrderStatus = "paid" | "pending" | "cancelled";

function resolveDisplayStatus(
  dbStatus: string,
  mollieStatus?: string
): OrderStatus {
  // Le webhook peut avoir déjà mis à jour le statut
  if (dbStatus === "paid") return "paid";
  if (dbStatus === "cancelled") return "cancelled";

  // Statut DB encore 'pending' — on fait confiance au statut Mollie si disponible
  if (mollieStatus === "paid") return "paid";
  if (mollieStatus === "failed" || mollieStatus === "canceled" || mollieStatus === "expired") {
    return "cancelled";
  }

  return "pending";
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ConfirmationPage({ searchParams }: Props) {
  const { order: orderId } = await searchParams;
  if (!orderId) notFound();

  const supabase = createAdminClient();
  const { data: order } = await supabase
    .from("orders")
    .select("id, total_cents, occasion_slug, sender_name, delivery_address, status, mollie_payment_id, customer_id")
    .eq("id", orderId)
    .maybeSingle();

  if (!order) notFound();

  // Fetch customer to determine if account creation offer should be shown
  let customerEmail: string | null = null;
  let customerHasAccount = true; // default: don't show the form
  if (order.customer_id) {
    const { data: customer } = await supabase
      .from("customers")
      .select("email, user_id")
      .eq("id", order.customer_id)
      .maybeSingle();
    if (customer) {
      customerEmail = customer.email;
      customerHasAccount = customer.user_id !== null;
    }
  }

  // Si encore pending, on consulte Mollie pour avoir le statut réel
  // (le webhook est asynchrone et peut ne pas être arrivé avant la redirection)
  let mollieStatus: string | undefined;
  if (order.status === "pending" && order.mollie_payment_id) {
    try {
      const mollie = getMollieClient();
      const payment = await mollie.payments.get(order.mollie_payment_id);
      mollieStatus = payment.status;

      // Mise à jour immédiate si Mollie confirme le paiement
      if (mollieStatus === "paid") {
        await supabase
          .from("orders")
          .update({ status: "paid", updated_at: new Date().toISOString() })
          .eq("id", order.id);
      }
    } catch {
      // Mollie indisponible — on affiche l'état DB
    }
  }

  const displayStatus = resolveDisplayStatus(order.status, mollieStatus);
  const occasion = order.occasion_slug ? getOccasion(order.occasion_slug) : undefined;
  const address = order.delivery_address as {
    prenom?: string;
    nom?: string;
    ville?: string;
    codePostal?: string;
  };

  // ─── Contenu par statut ──────────────────────────────────────────────────────

  if (displayStatus === "cancelled") {
    return (
      <div
        className="min-h-screen flex items-center justify-center py-12"
        style={{ backgroundColor: "var(--bg-secondary)" }}
      >
        <div className="max-w-[32rem] w-full mx-auto px-6">
          <div
            className="rounded-3xl p-8 text-center"
            style={{ backgroundColor: "white", boxShadow: "0 2px 16px 0 rgba(0,0,0,0.06)" }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mx-auto mb-6"
              style={{ backgroundColor: "var(--error)", color: "white" }}
              aria-hidden
            >
              ✕
            </div>
            <h1
              className="text-3xl font-black mb-2"
              style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
            >
              Paiement annulé
            </h1>
            <p
              className="text-base mb-8"
              style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}
            >
              Votre paiement n&apos;a pas abouti. Aucun montant n&apos;a été débité.
              Vous pouvez réessayer à tout moment.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {occasion && (
                <Link
                  href={`/commander?occasion=${occasion.slug}`}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full text-white font-semibold text-base transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)] focus-visible:ring-offset-2"
                  style={{ backgroundColor: "var(--primary-500)", fontFamily: "var(--font-body)" }}
                >
                  Réessayer
                </Link>
              )}
              <Link
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full font-semibold text-base transition-colors hover:bg-[var(--primary-100)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)] focus-visible:ring-offset-2"
                style={{
                  color: "var(--text-primary)",
                  border: "2px solid var(--primary-100)",
                  fontFamily: "var(--font-body)",
                }}
              >
                Retour à l&apos;accueil
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (displayStatus === "pending") {
    return (
      <div
        className="min-h-screen flex items-center justify-center py-12"
        style={{ backgroundColor: "var(--bg-secondary)" }}
      >
        <div className="max-w-[32rem] w-full mx-auto px-6">
          <div
            className="rounded-3xl p-8 text-center"
            style={{ backgroundColor: "white", boxShadow: "0 2px 16px 0 rgba(0,0,0,0.06)" }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mx-auto mb-6"
              style={{ backgroundColor: "var(--warning)", color: "white" }}
              aria-hidden
            >
              ⏳
            </div>
            <h1
              className="text-3xl font-black mb-2"
              style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
            >
              Paiement en attente
            </h1>
            <p
              className="text-base mb-4"
              style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}
            >
              Votre commande est enregistrée. Nous attendons la confirmation de votre banque.
            </p>
            <p
              className="text-sm mb-8"
              style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}
            >
              Vous recevrez un email dès que le paiement sera confirmé. Réf.{" "}
              <span style={{ fontFamily: "var(--font-label)" }}>
                {order.id.slice(0, 8).toUpperCase()}
              </span>
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full text-white font-semibold text-base transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)] focus-visible:ring-offset-2"
              style={{ backgroundColor: "var(--primary-500)", fontFamily: "var(--font-body)" }}
            >
              Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── Statut : payé ────────────────────────────────────────────────────────────

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12"
      style={{ backgroundColor: "var(--bg-secondary)" }}
    >
      <div className="max-w-[32rem] w-full mx-auto px-6">
        <div
          className="rounded-3xl p-8 text-center"
          style={{ backgroundColor: "white", boxShadow: "0 2px 16px 0 rgba(0,0,0,0.06)" }}
        >
          {/* Icône succès */}
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mx-auto mb-6"
            style={{ backgroundColor: "var(--success)", color: "white" }}
            aria-hidden
          >
            ✓
          </div>

          {/* Titre */}
          <h1
            className="text-3xl font-black mb-2"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            C&apos;est parti !
          </h1>
          <p
            className="text-base font-semibold mb-4"
            style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}
          >
            Ta douceur est en route.
          </p>

          <p
            className="text-base mb-6"
            style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}
          >
            Merci {order.sender_name}
            {address.prenom
              ? ` — ta box est en route vers ${address.prenom}${address.ville ? ` à ${address.ville}` : ""}.`
              : "."}
          </p>

          {/* Récap */}
          <div
            className="rounded-2xl p-4 mb-8 text-left"
            style={{
              backgroundColor: occasion?.sleeveTokens.bg ?? "var(--primary-50)",
              border: `1px solid ${occasion?.sleeveTokens.accent ?? "var(--primary-100)"}20`,
            }}
          >
            {occasion && (
              <p
                className="text-xs uppercase tracking-widest mb-1"
                style={{ fontFamily: "var(--font-label)", color: occasion.sleeveTokens.accent }}
              >
                {occasion.nom}
              </p>
            )}
            <p
              className="text-sm"
              style={{ fontFamily: "var(--font-body)", color: "var(--text-primary)" }}
            >
              Total payé :{" "}
              <strong>{formatPriceCents(order.total_cents)}</strong>
            </p>
            <p
              className="text-xs mt-1"
              style={{ fontFamily: "var(--font-label)", color: "var(--text-secondary)" }}
            >
              Réf. {order.id.slice(0, 8).toUpperCase()}
            </p>
          </div>

          <p
            className="text-sm mb-4"
            style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}
          >
            Tu recevras une confirmation par email. Ta box sera préparée
            avec soin et expédiée dans les prochains jours ouvrables.
          </p>

          {/* Création de compte post-achat — uniquement si pas encore de compte */}
          {!customerHasAccount && customerEmail && (
            <div className="mb-8">
              <CreateAccountForm email={customerEmail} />
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/offrir/anniversaire"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full text-white font-semibold text-base transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)] focus-visible:ring-offset-2"
              style={{ backgroundColor: "var(--primary-500)", fontFamily: "var(--font-body)" }}
            >
              Faire un autre geste
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full font-semibold text-base transition-colors hover:bg-[var(--primary-100)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)] focus-visible:ring-offset-2"
              style={{ color: "var(--text-primary)", border: "2px solid var(--primary-100)", fontFamily: "var(--font-body)" }}
            >
              Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
