"use server";

import { getResendClient, FROM_EMAIL } from "@/lib/resend";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatPriceCents } from "@/lib/utils";
import { getOccasion } from "@/data/occasions";
import OrderConfirmation from "@/emails/OrderConfirmation";
import ShippingNotification from "@/emails/ShippingNotification";

/**
 * Envoie l'email de confirmation de commande à l'expéditeur.
 * Appelé depuis le webhook Mollie quand status === "paid".
 */
export async function sendOrderConfirmationEmail(orderId: string): Promise<void> {
  const supabase = createAdminClient();

  // Récupérer commande + customer + items
  const { data: order } = await supabase
    .from("orders")
    .select(`
      id,
      total_cents,
      occasion_slug,
      sender_name,
      recipient_message,
      delivery_address,
      customer_id,
      customers (email),
      order_items (
        quantity,
        unit_price_cents,
        products (name)
      )
    `)
    .eq("id", orderId)
    .maybeSingle();

  if (!order) {
    console.error("[sendOrderConfirmationEmail] commande introuvable:", orderId);
    return;
  }

  const customerEmail = (order.customers as { email: string } | null)?.email;
  if (!customerEmail) {
    console.error("[sendOrderConfirmationEmail] email client introuvable pour commande:", orderId);
    return;
  }

  const address = order.delivery_address as {
    prenom?: string;
    nom?: string;
    adresse?: string;
    codePostal?: string;
    ville?: string;
  };

  const firstItem = Array.isArray(order.order_items) ? order.order_items[0] : null;
  const productName =
    (firstItem?.products as { name: string } | null)?.name ?? "Brownie Box";

  const occasion = order.occasion_slug ? getOccasion(order.occasion_slug) : undefined;

  const resend = getResendClient();

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: customerEmail,
    subject: `Commande confirmée — votre brownie box est en route ! 🍫`,
    react: OrderConfirmation({
      senderName: order.sender_name ?? "cher client",
      recipientPrenom: address.prenom ?? "",
      recipientNom: address.nom ?? "",
      recipientAdresse: address.adresse ?? "",
      recipientVille: address.ville ?? "",
      occasionNom: occasion?.nom ?? "Cadeau",
      productName,
      totalEuros: formatPriceCents(order.total_cents),
      orderId: order.id,
      message: order.recipient_message ?? "",
    }),
  });

  if (error) {
    console.error("[sendOrderConfirmationEmail] Resend error:", error);
  }
}

/**
 * Envoie l'email de notification d'expédition à l'acheteur.
 * Appelé depuis updateOrderStatus quand le statut passe à "shipped".
 */
export async function sendShippingNotificationEmail(
  orderId: string,
  trackingNumber: string
): Promise<void> {
  const supabase = createAdminClient();

  const { data: order } = await supabase
    .from("orders")
    .select(`
      id,
      occasion_slug,
      sender_name,
      delivery_address,
      customers (email),
      order_items (
        products (name)
      )
    `)
    .eq("id", orderId)
    .maybeSingle();

  if (!order) {
    console.error("[sendShippingNotificationEmail] commande introuvable:", orderId);
    return;
  }

  const customerEmail = (order.customers as { email: string } | null)?.email;
  if (!customerEmail) {
    console.error("[sendShippingNotificationEmail] email client introuvable:", orderId);
    return;
  }

  const address = order.delivery_address as {
    prenom?: string;
    ville?: string;
  };

  const firstItem = Array.isArray(order.order_items) ? order.order_items[0] : null;
  const productName =
    (firstItem?.products as { name: string } | null)?.name ?? "Brownie Box";

  const trackingUrl = `https://track.bpost.cloud/btr/web/#/search?itemCode=${encodeURIComponent(trackingNumber)}&lang=fr`;

  const resend = getResendClient();

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: customerEmail,
    subject: `Votre brownie box est en route vers ${address.prenom ?? "le destinataire"} !`,
    react: ShippingNotification({
      senderName:       order.sender_name ?? "cher client",
      recipientPrenom:  address.prenom ?? "",
      recipientVille:   address.ville ?? "",
      productName,
      orderId:          order.id,
      trackingNumber,
      trackingUrl,
    }),
  });

  if (error) {
    console.error("[sendShippingNotificationEmail] Resend error:", error);
  }
}
