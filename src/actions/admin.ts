"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth";
import { sendShippingNotificationEmail } from "@/actions/emails";

// ─── Commandes ────────────────────────────────────────────────────────────────

const VALID_STATUSES = ["pending", "paid", "preparing", "shipped", "delivered", "cancelled"] as const;
type OrderStatus = typeof VALID_STATUSES[number];

export async function updateOrderStatus(
  _prevState: string | null,
  formData: FormData
): Promise<string | null> {
  await requireAdmin();

  const orderId    = formData.get("orderId") as string;
  const newStatus  = formData.get("status") as string;
  const trackingNumber = (formData.get("trackingNumber") as string | null)?.trim() || null;

  if (!orderId || !VALID_STATUSES.includes(newStatus as OrderStatus)) {
    return "Données invalides";
  }

  // Le numéro de suivi est obligatoire pour passer en "shipped"
  if (newStatus === "shipped" && !trackingNumber) {
    return "Le numéro de suivi bpost est requis pour marquer la commande comme expédiée";
  }

  const supabase = createAdminClient();

  // Récupérer le statut actuel avant mise à jour (pour détecter la transition → shipped)
  const { data: existing } = await supabase
    .from("orders")
    .select("status")
    .eq("id", orderId)
    .maybeSingle();

  const { error } = await supabase
    .from("orders")
    .update({
      status:          newStatus,
      updated_at:      new Date().toISOString(),
      ...(newStatus === "shipped" && trackingNumber
        ? { tracking_number: trackingNumber }
        : {}),
    })
    .eq("id", orderId);

  if (error) return "Erreur lors de la mise à jour";

  // Envoyer l'email de notification expédition au premier passage en "shipped"
  if (newStatus === "shipped" && existing?.status !== "shipped" && trackingNumber) {
    sendShippingNotificationEmail(orderId, trackingNumber).catch((err) =>
      console.error("[updateOrderStatus] shipping email error:", err)
    );
  }

  revalidatePath(`/admin/commandes/${orderId}`);
  revalidatePath("/admin/commandes");
  return null;
}

// ─── Produits ─────────────────────────────────────────────────────────────────

export async function updateProductStock(
  _prevState: string | null,
  formData: FormData
): Promise<string | null> {
  await requireAdmin();

  const productId = formData.get("productId") as string;
  const stock = parseInt(formData.get("stock") as string, 10);

  if (!productId || isNaN(stock) || stock < 0) {
    return "Données invalides";
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("products")
    .update({ stock, updated_at: new Date().toISOString() })
    .eq("id", productId);

  if (error) return "Erreur lors de la mise à jour";

  revalidatePath("/admin/produits");
  return null;
}

export async function toggleProductActive(
  _prevState: string | null,
  formData: FormData
): Promise<string | null> {
  await requireAdmin();

  const productId = formData.get("productId") as string;
  const isActive = formData.get("isActive") === "true";

  if (!productId) return "Données invalides";

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("products")
    .update({ is_active: !isActive, updated_at: new Date().toISOString() })
    .eq("id", productId);

  if (error) return "Erreur lors de la mise à jour";

  revalidatePath("/admin/produits");
  return null;
}

// ─── Codes promo ──────────────────────────────────────────────────────────────

const promoCodeSchema = z.object({
  code: z.string().min(3).max(50).toUpperCase(),
  type: z.enum(["percent", "fixed"]),
  valueCents: z.number().int().min(1),
  expiresAt: z.string().optional(),
});

export async function createPromoCode(
  _prevState: string | null,
  formData: FormData
): Promise<string | null> {
  await requireAdmin();

  const raw = {
    code: (formData.get("code") as string)?.toUpperCase().trim(),
    type: formData.get("type") as string,
    valueCents: parseInt(formData.get("valueCents") as string, 10),
    expiresAt: (formData.get("expiresAt") as string) || undefined,
  };

  const parsed = promoCodeSchema.safeParse(raw);
  if (!parsed.success) return "Données invalides";

  const supabase = createAdminClient();
  const { error } = await supabase.from("promo_codes").insert({
    code: parsed.data.code,
    type: parsed.data.type,
    value_cents: parsed.data.valueCents,
    expires_at: parsed.data.expiresAt ? new Date(parsed.data.expiresAt).toISOString() : null,
    is_active: true,
  });

  if (error?.code === "23505") return "Ce code existe déjà";
  if (error) return "Erreur lors de la création";

  revalidatePath("/admin/codes-promo");
  return null;
}

export async function togglePromoCode(
  _prevState: string | null,
  formData: FormData
): Promise<string | null> {
  await requireAdmin();

  const id = formData.get("id") as string;
  const isActive = formData.get("isActive") === "true";

  if (!id) return "Données invalides";

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("promo_codes")
    .update({ is_active: !isActive })
    .eq("id", id);

  if (error) return "Erreur";

  revalidatePath("/admin/codes-promo");
  return null;
}

export async function createProduct(
  _prevState: string | null,
  formData: FormData
): Promise<string | null> {
  await requireAdmin();

  const name = (formData.get("name") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;
  const priceEuros = parseFloat(formData.get("priceEuros") as string);
  const occasionSlugs = formData.getAll("occasions") as string[];
  const allergensList = formData.getAll("allergens") as string[];
  const stock = parseInt(formData.get("stock") as string, 10);
  const alertThreshold = parseInt(formData.get("alertThreshold") as string, 10);
  const imageUrls = formData.getAll("imageUrls").filter((u) => typeof u === "string" && u.startsWith("http")) as string[];

  if (!name || name.length > 255) return "Nom invalide";
  if (isNaN(priceEuros) || priceEuros <= 0) return "Prix invalide";
  if (occasionSlugs.length === 0) return "Sélectionnez au moins une occasion";
  if (isNaN(stock) || stock < 0) return "Stock invalide";
  if (isNaN(alertThreshold) || alertThreshold < 0) return "Seuil d'alerte invalide";

  const supabase = createAdminClient();
  const { error } = await supabase.from("products").insert({
    name,
    description,
    price_cents: Math.round(priceEuros * 100),
    occasion_slugs: occasionSlugs,
    allergens: allergensList,
    stock,
    stock_alert_threshold: alertThreshold,
    images: imageUrls,
    is_active: true,
  });

  if (error) return "Erreur lors de la création";

  revalidatePath("/admin/produits");
  redirect("/admin/produits");
}

export async function updateProduct(
  _prevState: string | null,
  formData: FormData
): Promise<string | null> {
  await requireAdmin();

  const productId = formData.get("productId") as string;
  if (!productId) return "Données invalides";

  const name = (formData.get("name") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;
  const priceEuros = parseFloat(formData.get("priceEuros") as string);
  const occasionSlugs = formData.getAll("occasions") as string[];
  const allergensList = formData.getAll("allergens") as string[];
  const stock = parseInt(formData.get("stock") as string, 10);
  const alertThreshold = parseInt(formData.get("alertThreshold") as string, 10);
  const imageUrls = formData.getAll("imageUrls").filter((u) => typeof u === "string" && u.startsWith("http")) as string[];

  if (!name || name.length > 255) return "Nom invalide";
  if (isNaN(priceEuros) || priceEuros <= 0) return "Prix invalide";
  if (occasionSlugs.length === 0) return "Sélectionnez au moins une occasion";
  if (isNaN(stock) || stock < 0) return "Stock invalide";
  if (isNaN(alertThreshold) || alertThreshold < 0) return "Seuil d'alerte invalide";

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("products")
    .update({
      name,
      description,
      price_cents: Math.round(priceEuros * 100),
      occasion_slugs: occasionSlugs,
      allergens: allergensList,
      stock,
      stock_alert_threshold: alertThreshold,
      images: imageUrls,
      updated_at: new Date().toISOString(),
    })
    .eq("id", productId);

  if (error) return "Erreur lors de la mise à jour";

  revalidatePath("/admin/produits");
  redirect("/admin/produits");
}

export async function deleteProduct(
  _prevState: string | null,
  formData: FormData
): Promise<string | null> {
  await requireAdmin();

  const productId = formData.get("productId") as string;
  if (!productId) return "Données invalides";

  const supabase = createAdminClient();

  // Vérifie s'il y a des commandes liées — soft delete si oui, hard delete sinon
  const { count } = await supabase
    .from("order_items")
    .select("id", { count: "exact", head: true })
    .eq("product_id", productId);

  if (count && count > 0) {
    const { error } = await supabase
      .from("products")
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq("id", productId);
    if (error) return "Erreur lors de la désactivation";
  } else {
    const { error } = await supabase.from("products").delete().eq("id", productId);
    if (error) return "Erreur lors de la suppression";
  }

  revalidatePath("/admin/produits");
  redirect("/admin/produits");
}

// ─── Paramètres — webhook notifications ───────────────────────────────────────

const VALID_EVENTS = ["new_order", "low_stock", "invoice_error", "wire_payment_received"] as const;

export async function saveWebhookSettings(
  _prevState: string | null,
  formData: FormData
): Promise<string | null> {
  await requireAdmin();

  const webhookUrl = (formData.get("webhookUrl") as string)?.trim() || null;
  const events = VALID_EVENTS.filter((e) => formData.get(`event_${e}`) === "on");

  if (webhookUrl) {
    try {
      new URL(webhookUrl);
    } catch {
      return "URL webhook invalide";
    }
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("admin_settings")
    .update({ webhook_url: webhookUrl, webhook_events: events, updated_at: new Date().toISOString() })
    .neq("id", "00000000-0000-0000-0000-000000000000"); // update the single row

  if (error) return "Erreur lors de la sauvegarde";

  revalidatePath("/admin/parametres");
  return null;
}

export async function testWebhookConnection(
  _prevState: { ok: boolean; message: string } | null,
  formData: FormData
): Promise<{ ok: boolean; message: string }> {
  await requireAdmin();

  const url = (formData.get("webhookUrl") as string)?.trim();
  if (!url) return { ok: false, message: "Aucune URL configurée" };

  try {
    new URL(url);
  } catch {
    return { ok: false, message: "URL invalide" };
  }

  const payload = {
    type: "test",
    timestamp: new Date().toISOString(),
    data: { message: "Test de connexion depuis MIMOS" },
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok) {
      return { ok: true, message: `✅ Connexion réussie — ${res.status} ${res.statusText}` };
    }
    return { ok: false, message: `⚠️ Réponse inattendue — ${res.status} ${res.statusText}` };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erreur réseau";
    return { ok: false, message: `❌ Échec — ${msg}` };
  }
}

// ─── RGPD ─────────────────────────────────────────────────────────────────────

export async function anonymizeUserByEmail(
  _prevState: string | null,
  formData: FormData
): Promise<string | null> {
  await requireAdmin();

  const email = (formData.get("email") as string)?.trim().toLowerCase();
  if (!email || !email.includes("@")) return "Email invalide";

  const supabase = createAdminClient();

  // Trouver le customer
  const { data: customer } = await supabase
    .from("customers")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (!customer) return "Aucun client trouvé avec cet email";

  // Anonymiser les recipient_pages liées aux commandes de ce customer
  const { data: orders } = await supabase
    .from("orders")
    .select("id")
    .eq("customer_id", customer.id);

  if (orders && orders.length > 0) {
    const orderIds = orders.map((o) => o.id);
    await supabase
      .from("recipient_pages")
      .update({
        sender_name: "[supprimé]",
        message: "[supprimé]",
        recipient_first_name: null,
        anonymized_at: new Date().toISOString(),
      })
      .in("order_id", orderIds)
      .is("anonymized_at", null);
  }

  // Anonymiser les données personnelles du customer
  await supabase
    .from("customers")
    .update({
      first_name: null,
      last_name: null,
      email: `[supprimé-${customer.id.slice(0, 8)}]`,
      marketing_consent: false,
    })
    .eq("id", customer.id);

  // Anonymiser les adresses de livraison dans les commandes
  if (orders && orders.length > 0) {
    const orderIds = orders.map((o) => o.id);
    for (const orderId of orderIds) {
      await supabase
        .from("orders")
        .update({
          delivery_address: { anonymized: true },
          sender_name: null,
          recipient_message: null,
        })
        .eq("id", orderId);
    }
  }

  revalidatePath("/admin/rgpd");
  return null;
}

export async function getRgpdStats() {
  await requireAdmin();
  const supabase = createAdminClient();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [activeRes, anonymizedRecentRes, totalAnonymizedRes] = await Promise.all([
    supabase
      .from("recipient_pages")
      .select("id", { count: "exact", head: true })
      .is("anonymized_at", null)
      .gt("expires_at", new Date().toISOString()),
    supabase
      .from("recipient_pages")
      .select("id", { count: "exact", head: true })
      .not("anonymized_at", "is", null)
      .gte("anonymized_at", thirtyDaysAgo.toISOString()),
    supabase
      .from("recipient_pages")
      .select("id", { count: "exact", head: true })
      .not("anonymized_at", "is", null),
  ]);

  return {
    activePages: activeRes.count ?? 0,
    anonymizedRecent: anonymizedRecentRes.count ?? 0,
    totalAnonymized: totalAnonymizedRes.count ?? 0,
  };
}

export async function getWebhookSettings() {
  await requireAdmin();
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("admin_settings")
    .select("webhook_url, webhook_events")
    .limit(1)
    .maybeSingle();
  return data ?? { webhook_url: null, webhook_events: VALID_EVENTS as unknown as string[] };
}
