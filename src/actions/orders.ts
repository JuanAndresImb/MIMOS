"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { getMollieClient, getBaseUrl } from "@/lib/mollie";
import { Locale, PaymentMethod } from "@mollie/api-client";
import { createOrderAtomic } from "@/lib/services/order.service";

// ─── Schémas de validation ────────────────────────────────────────────────────

const deliveryAddressSchema = z.object({
  prenom:            z.string().min(1).max(100),
  nom:               z.string().min(1).max(100),
  adresse:           z.string().min(1).max(255),
  complementAdresse: z.string().max(255).optional(),
  codePostal:        z.string().regex(/^\d{4}$/),
  ville:             z.string().min(1).max(100),
  pays:              z.literal("Belgique"),
});

const createOrderSchema = z.object({
  idempotencyKey:   z.string().uuid(),
  productId:        z.string().uuid(),
  occasionSlug:     z.string().min(1),
  recipientMessage: z.string().min(1).max(200),
  senderName:       z.string().min(1).max(100),
  email:            z.string().email(),
  deliveryAddress:  deliveryAddressSchema,
  promoCode:        z.string().max(50).optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

// ─── Résultat de validation code promo ───────────────────────────────────────

export type PromoResult =
  | { valid: true; discountCents: number; promoCodeId: string; type: string }
  | { valid: false; error: string };

export async function validatePromoCode(code: string): Promise<PromoResult> {
  if (!code.trim()) return { valid: false, error: "Code vide" };

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("promo_codes")
    .select("*")
    .eq("code", code.trim().toUpperCase())
    .eq("is_active", true)
    .maybeSingle();

  if (error || !data) return { valid: false, error: "Code invalide ou expiré" };

  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return { valid: false, error: "Code expiré" };
  }

  return {
    valid: true,
    discountCents: data.value_cents,
    promoCodeId: data.id,
    type: data.type,
  };
}

// ─── Création de commande ─────────────────────────────────────────────────────

export type CreateOrderResult =
  | { success: true; orderId: string }
  | { success: false; error: string };

export async function createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
  // 1. Validation Zod côté serveur (re-validation obligatoire même si faite côté client)
  const parsed = createOrderSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Données invalides" };
  }
  const data = parsed.data;

  const supabase = createAdminClient();

  // 2. Pré-check produit : récupérer le prix de référence
  //    (le vrai check stock + lock se fait dans la transaction SQL)
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("id, price_cents, is_active")
    .eq("id", data.productId)
    .eq("is_active", true)
    .maybeSingle();

  if (productError || !product) {
    return { success: false, error: "Produit introuvable" };
  }

  // 3. Valider code promo si fourni
  let discountCents = 0;
  let promoCodeId: string | null = null;

  if (data.promoCode) {
    const promo = await validatePromoCode(data.promoCode);
    if (promo.valid) {
      promoCodeId = promo.promoCodeId;
      discountCents = promo.type === "fixed"
        ? Math.min(promo.discountCents, product.price_cents)
        : Math.round((product.price_cents * promo.discountCents) / 10000);
    }
  }

  const totalCents = Math.max(0, product.price_cents - discountCents);

  // 4. Transaction atomique : customer + order + order_items + stock decrement
  const result = await createOrderAtomic({
    idempotencyKey:   data.idempotencyKey,
    email:            data.email,
    firstName:        data.deliveryAddress.prenom,
    lastName:         data.deliveryAddress.nom,
    productId:        product.id,
    occasionSlug:     data.occasionSlug,
    recipientMessage: data.recipientMessage,
    senderName:       data.senderName,
    deliveryAddress:  data.deliveryAddress,
    promoCodeId,
    discountCents,
    unitPriceCents:   product.price_cents,
    totalCents,
  });

  if (result.error) {
    if (result.error === "OUT_OF_STOCK")      return { success: false, error: "Produit en rupture de stock" };
    if (result.error === "PRODUCT_NOT_FOUND") return { success: false, error: "Produit introuvable" };
    return { success: false, error: "Erreur lors de la création de la commande" };
  }

  const orderId = result.orderId;

  // 5. Créer le paiement Mollie et rediriger vers le checkout
  const baseUrl = getBaseUrl();
  const mollie  = getMollieClient();
  const euros   = (totalCents / 100).toFixed(2);

  // Cast explicite : l'overload callback de Mollie brouille l'inférence TypeScript
  type MolliePayment = { id: string; getCheckoutUrl(): string | null };
  const payment = (await mollie.payments.create({
    amount:      { currency: "EUR", value: euros },
    description: `Brownie Box Belge — commande ${orderId.slice(0, 8).toUpperCase()}`,
    redirectUrl: `${baseUrl}/confirmation?order=${orderId}`,
    webhookUrl:  `${baseUrl}/api/webhooks/mollie`,
    locale:      Locale.fr_BE,
    method:      [PaymentMethod.bancontact, PaymentMethod.creditcard, PaymentMethod.ideal, PaymentMethod.banktransfer],
    metadata:    { orderId },
  })) as unknown as MolliePayment;

  await supabase
    .from("orders")
    .update({ mollie_payment_id: payment.id })
    .eq("id", orderId);

  const checkoutUrl = payment.getCheckoutUrl();
  if (!checkoutUrl) {
    redirect(`/confirmation?order=${orderId}`);
  }

  redirect(checkoutUrl);
}
