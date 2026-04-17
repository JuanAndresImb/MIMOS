import { createAdminClient } from "@/lib/supabase/admin";
import type { Json } from "@/lib/supabase/database.types";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CreateOrderParams {
  idempotencyKey: string;
  email: string;
  firstName: string;
  lastName: string;
  productId: string;
  occasionSlug: string;
  recipientMessage: string;
  senderName: string;
  deliveryAddress: Json;
  promoCodeId: string | null;
  discountCents: number;
  unitPriceCents: number;
  totalCents: number;
}

export type CreateOrderServiceResult =
  | { orderId: string; error: null }
  | { orderId: null; error: "PRODUCT_NOT_FOUND" | "OUT_OF_STOCK" | "UNKNOWN" };

// ─── Service ──────────────────────────────────────────────────────────────────

/**
 * Crée une commande de façon atomique via la fonction Postgres create_order_atomic.
 *
 * La fonction SQL encapsule en une seule transaction :
 *   - upsert customer
 *   - vérification stock avec lock FOR UPDATE (protège contre la sur-vente simultanée)
 *   - insert order
 *   - insert order_items
 *   - décrément stock
 *
 * Si p_idempotency_key existe déjà, retourne l'order_id existant sans rien créer.
 */
export async function createOrderAtomic(
  params: CreateOrderParams
): Promise<CreateOrderServiceResult> {
  const supabase = createAdminClient();

  const { data, error } = await supabase.rpc("create_order_atomic", {
    p_idempotency_key:   params.idempotencyKey,
    p_email:             params.email,
    p_first_name:        params.firstName,
    p_last_name:         params.lastName,
    p_product_id:        params.productId,
    p_occasion_slug:     params.occasionSlug,
    p_recipient_message: params.recipientMessage,
    p_sender_name:       params.senderName,
    p_delivery_address:  params.deliveryAddress,
    p_promo_code_id:     params.promoCodeId,
    p_discount_cents:    params.discountCents,
    p_unit_price_cents:  params.unitPriceCents,
    p_total_cents:       params.totalCents,
  });

  if (error) {
    if (error.message.includes("PRODUCT_NOT_FOUND")) {
      return { orderId: null, error: "PRODUCT_NOT_FOUND" };
    }
    if (error.message.includes("OUT_OF_STOCK")) {
      return { orderId: null, error: "OUT_OF_STOCK" };
    }
    console.error("[order.service] createOrderAtomic error:", error);
    return { orderId: null, error: "UNKNOWN" };
  }

  return { orderId: data as string, error: null };
}
