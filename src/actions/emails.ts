"use server";

import { getResendClient, FROM_EMAIL } from "@/lib/resend";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatPriceCents } from "@/lib/utils";
import { getOccasion } from "@/data/occasions";
import OrderConfirmation from "@/emails/OrderConfirmation";
import ShippingNotification from "@/emails/ShippingNotification";
import Welcome from "@/emails/Welcome";
import { generateInvoicePdf, type InvoiceData } from "@/lib/pdf/generateInvoice";

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

/**
 * Envoie l'email de bienvenue après création d'un compte client (post-achat).
 * Fire-and-forget : une erreur d'envoi n'empêche jamais la création du compte.
 */
export async function sendWelcomeEmail(email: string, firstName: string): Promise<void> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const resend = getResendClient();

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Bienvenue dans la famille MIMOS 🤍",
    react: Welcome({
      firstName: firstName || "vous",
      accountUrl: `${baseUrl}/compte`,
    }),
  });

  if (error) {
    console.error("[sendWelcomeEmail] Resend error:", error);
  }
}

/**
 * Génère la facture PDF pour une commande B2B et l'envoie par email via Resend.
 * Persiste invoice_number + invoice_sent_at sur la commande.
 * Idempotent : si invoice_number est déjà défini, ne régénère pas.
 */
export async function sendB2bInvoiceEmail(orderId: string): Promise<void> {
  const supabase = createAdminClient();

  const { data: order } = await supabase
    .from("orders")
    .select(`
      id,
      total_cents,
      discount_cents,
      company_name,
      vat_number,
      delivery_address,
      created_at,
      invoice_number,
      invoice_sent_at,
      customers (email)
    `)
    .eq("id", orderId)
    .maybeSingle();

  if (!order) {
    console.error("[sendB2bInvoiceEmail] commande introuvable:", orderId);
    return;
  }

  // Idempotence : facture déjà envoyée
  if (order.invoice_sent_at) {
    console.info("[sendB2bInvoiceEmail] facture déjà envoyée pour:", orderId);
    return;
  }

  // Récupérer les items séparément (join pas disponible dans le select ci-dessus)
  const { data: items } = await supabase
    .from("order_items")
    .select("quantity, unit_price_cents, products (name)")
    .eq("order_id", orderId);

  // Générer le numéro de facture via la séquence Postgres
  const { data: seqVal } = await supabase.rpc("next_invoice_number");
  const year = new Date().getFullYear();
  const invoiceNumber = `FAC-${year}-${String(seqVal).padStart(4, "0")}`;

  const customer = order.customers as { email: string } | null;
  const addr = order.delivery_address as {
    prenom?: string; nom?: string; adresse?: string; codePostal?: string; ville?: string;
  } | null;

  const invoiceData: InvoiceData = {
    invoiceNumber,
    issuedAt:        new Date(),
    orderId:         order.id,
    orderCreatedAt:  new Date(order.created_at),
    companyName:     order.company_name,
    vatNumber:       order.vat_number,
    customerEmail:   customer?.email ?? null,
    deliveryAddress: addr,
    items: (items ?? []).map((i) => ({
      name:           (i.products as { name: string } | null)?.name ?? "MIMOS",
      quantity:       i.quantity,
      unitPriceCents: i.unit_price_cents,
    })),
    totalCents:   order.total_cents,
    discountCents: order.discount_cents,
  };

  const pdfBytes = await generateInvoicePdf(invoiceData);

  // Persister le numéro de facture avant l'envoi (évite les doublons si email échoue)
  await supabase
    .from("orders")
    .update({ invoice_number: invoiceNumber, invoice_sent_at: new Date().toISOString() })
    .eq("id", orderId);

  if (!customer?.email) {
    console.warn("[sendB2bInvoiceEmail] email client absent pour:", orderId);
    return;
  }

  const resend = getResendClient();
  const base64Pdf = Buffer.from(pdfBytes).toString("base64");

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to:   customer.email,
    subject: `Votre facture ${invoiceNumber} — MIMOS`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 580px; margin: 0 auto; color: #1a1a1a;">
        <h2 style="color: #e84d3d; margin-bottom: 4px;">MIMOS</h2>
        <p>Bonjour ${order.company_name ?? ""},</p>
        <p>Veuillez trouver en pièce jointe votre facture <strong>${invoiceNumber}</strong>
           pour votre commande MIMOS.</p>
        <p style="font-size: 16px; font-weight: bold;">
          Montant total TVAC : ${formatPriceCents(order.total_cents)}
        </p>
        <p>Merci pour votre confiance.</p>
        <p style="color: #888; font-size: 13px;">— L'équipe MIMOS</p>
      </div>
    `,
    attachments: [
      {
        filename: `facture-${invoiceNumber}.pdf`,
        content:  base64Pdf,
      },
    ],
  });

  if (error) {
    console.error("[sendB2bInvoiceEmail] Resend error:", error);
  }
}
