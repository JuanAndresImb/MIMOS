import { notFound } from "next/navigation";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { getMollieClient } from "@/lib/mollie";
import { formatPriceCents } from "@/lib/utils";

interface Props {
  searchParams: Promise<{ order?: string }>;
}

export default async function ConfirmationB2bPage({ searchParams }: Props) {
  const { order: orderId } = await searchParams;
  if (!orderId) notFound();

  const supabase = createAdminClient();

  const { data: order } = await supabase
    .from("orders")
    .select("id, status, total_cents, mollie_payment_id, company_name, created_at")
    .eq("id", orderId)
    .eq("is_b2b", true)
    .maybeSingle();

  if (!order) notFound();

  // Récupérer les détails du virement depuis Mollie
  type BankDetails = {
    bankName?: string;
    bankAccount?: string;
    bankBic?: string;
    transferReference?: string;
  };

  let bankDetails: BankDetails = {};

  if (order.mollie_payment_id) {
    try {
      const mollie = getMollieClient();
      const payment = await mollie.payments.get(order.mollie_payment_id);
      bankDetails = (payment.details as BankDetails) ?? {};
    } catch (err) {
      console.error("[confirmation-b2b] Mollie fetch error:", err);
    }
  }

  const isPaid = order.status === "paid";

  return (
    <main
      className="min-h-screen py-16 px-6"
      style={{ backgroundColor: "var(--bg-secondary)" }}
    >
      <div className="mx-auto" style={{ maxWidth: "36rem" }}>

        {/* En-tête */}
        <div className="text-center mb-10">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mx-auto mb-4"
            style={{ backgroundColor: isPaid ? "var(--success)20" : "var(--primary-50)" }}
          >
            {isPaid ? "✅" : "🏦"}
          </div>
          <h1
            className="text-3xl font-black mb-2"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            {isPaid ? "Paiement reçu !" : "Commande confirmée"}
          </h1>
          <p
            className="text-sm"
            style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}
          >
            {isPaid
              ? "Votre virement a été reçu. La facture vous a été envoyée par email."
              : "Votre commande est enregistrée. Veuillez effectuer le virement ci-dessous pour la finaliser."}
          </p>
        </div>

        {/* Récapitulatif */}
        <div
          className="rounded-2xl p-5 mb-6"
          style={{ backgroundColor: "white", border: "1px solid var(--primary-100)" }}
        >
          <p
            className="text-xs uppercase tracking-widest mb-3"
            style={{ fontFamily: "var(--font-label)", color: "var(--text-secondary)" }}
          >
            Récapitulatif
          </p>
          <div className="flex justify-between py-2 border-b" style={{ borderColor: "var(--primary-100)" }}>
            <span className="text-sm" style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}>Référence commande</span>
            <span className="text-sm font-mono font-semibold" style={{ color: "var(--text-primary)" }}>{orderId.slice(0, 8).toUpperCase()}</span>
          </div>
          {order.company_name && (
            <div className="flex justify-between py-2 border-b" style={{ borderColor: "var(--primary-100)" }}>
              <span className="text-sm" style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}>Entreprise</span>
              <span className="text-sm font-semibold" style={{ fontFamily: "var(--font-body)", color: "var(--text-primary)" }}>{order.company_name}</span>
            </div>
          )}
          <div className="flex justify-between py-2">
            <span className="text-sm font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>Montant total TVAC</span>
            <span className="text-base font-black" style={{ fontFamily: "var(--font-display)", color: "var(--primary-500)" }}>
              {formatPriceCents(order.total_cents)}
            </span>
          </div>
        </div>

        {/* Instructions de virement — uniquement si pas encore payé */}
        {!isPaid && (
          <div
            className="rounded-2xl p-5 mb-6"
            style={{ backgroundColor: "white", border: "2px solid var(--primary-200)" }}
          >
            <p
              className="text-xs uppercase tracking-widest mb-4"
              style={{ fontFamily: "var(--font-label)", color: "var(--primary-500)" }}
            >
              Instructions de virement
            </p>

            {bankDetails.bankAccount ? (
              <div className="flex flex-col gap-3">
                {[
                  { label: "Banque", value: bankDetails.bankName },
                  { label: "IBAN", value: bankDetails.bankAccount, mono: true },
                  { label: "BIC", value: bankDetails.bankBic, mono: true },
                  { label: "Communication", value: bankDetails.transferReference, mono: true, highlight: true },
                  { label: "Montant exact", value: formatPriceCents(order.total_cents), highlight: true },
                ].filter((r) => r.value).map((row) => (
                  <div key={row.label} className="flex justify-between items-start gap-4">
                    <span
                      className="text-xs font-semibold uppercase tracking-wider shrink-0"
                      style={{ fontFamily: "var(--font-label)", color: "var(--text-secondary)" }}
                    >
                      {row.label}
                    </span>
                    <span
                      className={`text-sm text-right ${row.mono ? "font-mono" : "font-semibold"}`}
                      style={{
                        fontFamily: row.mono ? undefined : "var(--font-body)",
                        color: row.highlight ? "var(--primary-700)" : "var(--text-primary)",
                        fontWeight: row.highlight ? 700 : undefined,
                      }}
                    >
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm" style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}>
                Les coordonnées bancaires vous seront envoyées par email dans les prochaines minutes.
              </p>
            )}

            <div
              className="mt-4 pt-4 rounded-xl px-4 py-3"
              style={{ backgroundColor: "var(--warning)10", border: "1px solid var(--warning)30" }}
            >
              <p className="text-xs" style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}>
                ⚠️ Utilisez <strong>exactement</strong> la communication indiquée. Le virement doit être reçu
                dans les <strong>7 jours ouvrables</strong>. Passé ce délai, la commande sera annulée.
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="block w-full text-center px-8 py-4 rounded-full text-white text-sm font-semibold transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--primary-500)", fontFamily: "var(--font-body)" }}
          >
            Retour à l&apos;accueil
          </Link>
          <Link
            href="/compte/connexion"
            className="block w-full text-center px-8 py-3 rounded-full text-sm font-semibold transition-colors hover:bg-[var(--primary-100)]"
            style={{ color: "var(--primary-700)", border: "1px solid var(--primary-100)", fontFamily: "var(--font-body)" }}
          >
            Suivre ma commande
          </Link>
        </div>
      </div>
    </main>
  );
}
