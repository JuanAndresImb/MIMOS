import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createHmac, timingSafeEqual } from "crypto";

// Vérifie la signature HMAC-SHA256 envoyée par bpost
function verifySignature(body: string, signature: string | null): boolean {
  const secret = process.env.BPOST_WEBHOOK_SECRET;
  if (!secret || !signature) return false;

  const expected = createHmac("sha256", secret).update(body).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

// Statuts bpost → statuts commande
const BPOST_DELIVERY_EVENTS = new Set([
  "DELIVERED",
  "DELIVERED_AT_DOOR",
  "DELIVERED_IN_MAILBOX",
  "DELIVERED_AT_PICK_UP_POINT",
]);

interface BpostEvent {
  barcode?: string;
  reference?: string;
  event?: string;
  timestamp?: string;
}

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-bpost-signature");

  if (!verifySignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: BpostEvent;
  try {
    payload = JSON.parse(rawBody) as BpostEvent;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const trackingNumber = payload.barcode ?? payload.reference;
  const event = payload.event?.toUpperCase();

  if (!trackingNumber || !event) {
    return NextResponse.json({ received: true });
  }

  console.info(`[webhooks/bpost] event=${event} tracking=${trackingNumber}`);

  if (!BPOST_DELIVERY_EVENTS.has(event)) {
    return NextResponse.json({ received: true });
  }

  // Marquer la commande comme livrée
  const supabase = createAdminClient();
  const { data: order } = await supabase
    .from("orders")
    .select("id, status")
    .eq("tracking_number", trackingNumber)
    .maybeSingle();

  if (!order) {
    console.warn(`[webhooks/bpost] commande introuvable pour tracking=${trackingNumber}`);
    return NextResponse.json({ received: true });
  }

  if (order.status !== "delivered") {
    await supabase
      .from("orders")
      .update({ status: "delivered", updated_at: new Date().toISOString() })
      .eq("id", order.id);

    console.info(`[webhooks/bpost] commande ${order.id} marquée livrée`);
  }

  return NextResponse.json({ received: true });
}
