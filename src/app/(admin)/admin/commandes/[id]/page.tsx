import { notFound } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatPriceCents } from "@/lib/utils";
import OrderStatusForm from "./OrderStatusForm";

const STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  paid: "Payée",
  preparing: "En préparation",
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
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: Props) {
  await requireAdmin();

  const { id } = await params;
  const supabase = createAdminClient();

  const { data: order } = await supabase
    .from("orders")
    .select(`
      id,
      status,
      total_cents,
      discount_cents,
      occasion_slug,
      sender_name,
      recipient_message,
      delivery_address,
      mollie_payment_id,
      tracking_number,
      created_at,
      updated_at,
      customers (email, first_name, last_name),
      order_items (
        id,
        quantity,
        unit_price_cents,
        products (name, price_cents)
      )
    `)
    .eq("id", id)
    .maybeSingle();

  if (!order) notFound();

  const address = order.delivery_address as {
    prenom?: string;
    nom?: string;
    adresse?: string;
    complementAdresse?: string;
    codePostal?: string;
    ville?: string;
    pays?: string;
  };

  const customer = order.customers as {
    email: string;
    first_name: string | null;
    last_name: string | null;
  } | null;

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-sm" style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}>
        <Link href="/admin/commandes" className="hover:underline" style={{ color: "var(--primary-500)" }}>
          Commandes
        </Link>
        <span>→</span>
        <span className="font-mono">{id.slice(0, 8).toUpperCase()}</span>
      </div>

      <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1
            className="text-2xl font-black"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            Commande {id.slice(0, 8).toUpperCase()}
          </h1>
          <p className="text-sm mt-1" style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}>
            Créée le {new Date(order.created_at).toLocaleDateString("fr-BE", { dateStyle: "long" })}
          </p>
        </div>
        <span
          className="inline-block text-sm font-semibold px-3 py-1.5 rounded-full"
          style={{
            fontFamily: "var(--font-label)",
            backgroundColor: `${STATUS_COLORS[order.status]}20`,
            color: STATUS_COLORS[order.status],
          }}
        >
          {STATUS_LABELS[order.status] ?? order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne principale */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* Articles */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{ backgroundColor: "white", border: "1px solid var(--primary-100)" }}
          >
            <div className="px-5 py-4 border-b" style={{ borderColor: "var(--primary-100)" }}>
              <h2 className="text-sm font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
                Articles
              </h2>
            </div>
            <div className="p-5">
              {(order.order_items as Array<{ id: string; quantity: number; unit_price_cents: number; products: { name: string } | null }> ?? []).map((item) => (
                <div key={item.id} className="flex justify-between py-2">
                  <span className="text-sm" style={{ fontFamily: "var(--font-body)", color: "var(--text-primary)" }}>
                    {item.products?.name ?? "Produit"} × {item.quantity}
                  </span>
                  <span className="text-sm font-semibold" style={{ fontFamily: "var(--font-body)", color: "var(--text-primary)" }}>
                    {formatPriceCents(item.unit_price_cents * item.quantity)}
                  </span>
                </div>
              ))}
              {order.discount_cents > 0 && (
                <div className="flex justify-between py-2 border-t mt-2" style={{ borderColor: "var(--primary-100)" }}>
                  <span className="text-sm" style={{ color: "var(--success)" }}>Remise</span>
                  <span className="text-sm font-semibold" style={{ color: "var(--success)" }}>
                    −{formatPriceCents(order.discount_cents)}
                  </span>
                </div>
              )}
              <div className="flex justify-between py-2 border-t mt-1" style={{ borderColor: "var(--primary-100)" }}>
                <span className="text-sm font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
                  Total
                </span>
                <span className="text-base font-black" style={{ fontFamily: "var(--font-display)", color: "var(--primary-500)" }}>
                  {formatPriceCents(order.total_cents)}
                </span>
              </div>
            </div>
          </div>

          {/* Message */}
          <div
            className="rounded-2xl p-5"
            style={{ backgroundColor: "white", border: "1px solid var(--primary-100)" }}
          >
            <h2 className="text-sm font-bold mb-3" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
              Message sur le sleeve
            </h2>
            <p className="text-sm italic leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)", borderLeft: "3px solid var(--primary-500)", paddingLeft: "12px" }}>
              &quot;{order.recipient_message}&quot;
            </p>
            <p className="text-xs mt-2" style={{ fontFamily: "var(--font-label)", color: "var(--text-secondary)" }}>
              De la part de : <strong>{order.sender_name}</strong>
            </p>
          </div>
        </div>

        {/* Colonne latérale */}
        <div className="flex flex-col gap-6">

          {/* Mise à jour statut */}
          <div
            className="rounded-2xl p-5"
            style={{ backgroundColor: "white", border: "1px solid var(--primary-100)" }}
          >
            <h2 className="text-sm font-bold mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
              Mettre à jour le statut
            </h2>
            <OrderStatusForm
              orderId={order.id}
              currentStatus={order.status}
              currentTrackingNumber={order.tracking_number}
            />
          </div>

          {/* Client */}
          <div
            className="rounded-2xl p-5"
            style={{ backgroundColor: "white", border: "1px solid var(--primary-100)" }}
          >
            <h2 className="text-sm font-bold mb-3" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
              Client
            </h2>
            <p className="text-sm" style={{ fontFamily: "var(--font-body)", color: "var(--text-primary)" }}>
              {customer?.first_name} {customer?.last_name}
            </p>
            <p className="text-sm" style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}>
              {customer?.email}
            </p>
          </div>

          {/* Adresse */}
          <div
            className="rounded-2xl p-5"
            style={{ backgroundColor: "white", border: "1px solid var(--primary-100)" }}
          >
            <h2 className="text-sm font-bold mb-3" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
              Adresse de livraison
            </h2>
            <address className="not-italic text-sm leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}>
              {address.prenom} {address.nom}<br />
              {address.adresse}<br />
              {address.complementAdresse && <>{address.complementAdresse}<br /></>}
              {address.codePostal} {address.ville}<br />
              {address.pays}
            </address>
          </div>

          {/* Suivi bpost */}
          {order.tracking_number && (
            <div
              className="rounded-2xl p-5"
              style={{ backgroundColor: "white", border: "1px solid var(--primary-100)" }}
            >
              <h2 className="text-sm font-bold mb-2" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
                Suivi bpost
              </h2>
              <p className="text-xs font-mono break-all mb-2" style={{ color: "var(--text-secondary)" }}>
                {order.tracking_number}
              </p>
              <a
                href={`https://track.bpost.cloud/btr/web/#/search?itemCode=${encodeURIComponent(order.tracking_number)}&lang=fr`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs hover:underline"
                style={{ color: "var(--success)", fontFamily: "var(--font-body)" }}
              >
                Voir le suivi →
              </a>
            </div>
          )}

          {/* Mollie */}
          {order.mollie_payment_id && (
            <div
              className="rounded-2xl p-5"
              style={{ backgroundColor: "white", border: "1px solid var(--primary-100)" }}
            >
              <h2 className="text-sm font-bold mb-2" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
                Paiement Mollie
              </h2>
              <p className="text-xs font-mono break-all" style={{ color: "var(--text-secondary)" }}>
                {order.mollie_payment_id}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
