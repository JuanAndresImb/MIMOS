import { NextResponse } from "next/server";
import { getMollieClient } from "@/lib/mollie";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendOrderConfirmationEmail, sendB2bInvoiceEmail } from "@/actions/emails";
import type { SupabaseClient } from "@supabase/supabase-js";

type OrderRow = {
  status: string;
  sender_name: string | null;
  recipient_message: string | null;
  occasion_slug: string | null;
  delivery_address: unknown;
  is_b2b: boolean;
} | null;

async function createRecipientPage(
  supabase: SupabaseClient,
  orderId: string,
  order: OrderRow
): Promise<void> {
  if (!order?.sender_name || !order?.recipient_message || !order?.occasion_slug) {
    console.warn("[webhook/mollie] recipient page skipped — missing order fields", orderId);
    return;
  }

  const token = crypto.randomUUID(); // UUID v4 CSPRNG natif
  const expiresAt = new Date();
  expiresAt.setFullYear(expiresAt.getFullYear() + 1);

  const addr = order.delivery_address as { prenom?: string } | null;
  const recipientFirstName = addr?.prenom ?? null;

  const { error } = await supabase.from("recipient_pages").upsert(
    {
      order_id: orderId,
      token,
      sender_name: order.sender_name,
      message: order.recipient_message,
      occasion_slug: order.occasion_slug,
      recipient_first_name: recipientFirstName,
      expires_at: expiresAt.toISOString(),
    },
    { onConflict: "order_id", ignoreDuplicates: true }
  );

  if (error) {
    throw new Error(`recipient_pages upsert failed: ${error.message}`);
  }

  console.info("[webhook/mollie] recipient page created for order", orderId);
}

/**
 * Webhook Mollie — POST /api/webhooks/mollie
 *
 * Mollie envoie l'ID du paiement dans le corps de la requête (form-encoded).
 * On récupère le statut réel via l'API Mollie, puis on met à jour la commande.
 *
 * Mollie attend un HTTP 200 — tout autre code déclenche un retry.
 * Référence : https://docs.mollie.com/docs/webhooks
 */
export async function POST(request: Request) {
  let paymentId: string | null = null;

  try {
    // Le corps est form-encoded : id=tr_xxxx
    const text = await request.text();
    const params = new URLSearchParams(text);
    paymentId = params.get("id");
  } catch {
    return NextResponse.json({ error: "Corps invalide" }, { status: 200 });
  }

  if (!paymentId) {
    return NextResponse.json({ error: "ID manquant" }, { status: 200 });
  }

  try {
    const mollie = getMollieClient();
    const payment = await mollie.payments.get(paymentId);

    // orderId stocké dans les métadonnées lors de la création
    const metadata = payment.metadata as { orderId?: string } | null;
    const orderId = metadata?.orderId;

    if (!orderId) {
      console.error("[webhook/mollie] orderId absent des métadonnées", paymentId);
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    // Mapping statut Mollie → statut commande
    const statusMap: Record<string, string> = {
      paid: "paid",
      failed: "cancelled",
      canceled: "cancelled",
      expired: "cancelled",
      pending: "pending",
      open: "pending",
    };

    const newStatus = statusMap[payment.status] ?? "pending";

    const supabase = createAdminClient();
    const { data: existingOrder } = await supabase
      .from("orders")
      .select("status, sender_name, recipient_message, occasion_slug, delivery_address, is_b2b")
      .eq("id", orderId)
      .maybeSingle();

    await supabase
      .from("orders")
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId);

    // Actions au premier passage à "paid"
    if (newStatus === "paid" && existingOrder?.status !== "paid") {
      await sendOrderConfirmationEmail(orderId).catch((err) =>
        console.error("[webhook/mollie] email error:", err)
      );

      // Page destinataire (idempotent)
      await createRecipientPage(supabase, orderId, existingOrder).catch((err) =>
        console.error("[webhook/mollie] recipient page error:", err)
      );

      // Facture PDF pour les commandes B2B (fire & forget)
      if (existingOrder?.is_b2b) {
        sendB2bInvoiceEmail(orderId).catch((err) =>
          console.error("[webhook/mollie] B2B invoice error:", err)
        );
      }
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    // On renvoie quand même 200 pour éviter les retries Mollie en cas d'erreur passagère
    console.error("[webhook/mollie] Erreur:", err);
    return NextResponse.json({ ok: true }, { status: 200 });
  }
}
