import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const admin = createAdminClient();

  const { data: customer } = await admin
    .from("customers")
    .select("id, email, first_name, last_name, marketing_consent, created_at")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!customer) return NextResponse.json({ error: "Compte introuvable" }, { status: 404 });

  const { data: orders } = await admin
    .from("orders")
    .select(`
      id,
      created_at,
      status,
      total_cents,
      occasion_slug,
      sender_name,
      recipient_message,
      delivery_address,
      tracking_number,
      order_items (
        quantity,
        unit_price_cents,
        products (name)
      )
    `)
    .eq("customer_id", customer.id)
    .order("created_at", { ascending: false });

  const lines: string[] = [];

  // ── Section compte ──
  lines.push("=== MON COMPTE ===");
  lines.push("Champ,Valeur");
  lines.push(`Email,"${customer.email}"`);
  lines.push(`Prénom,"${customer.first_name ?? ""}"`);
  lines.push(`Nom,"${customer.last_name ?? ""}"`);
  lines.push(`Consentement marketing,${customer.marketing_consent ? "oui" : "non"}`);
  lines.push(`Membre depuis,${new Date(customer.created_at).toLocaleDateString("fr-BE")}`);
  lines.push("");

  // ── Section commandes ──
  lines.push("=== MES COMMANDES ===");
  lines.push("Référence,Date,Statut,Occasion,Produit,Qté,Total (€),Adresse de livraison,Numéro de suivi");

  for (const order of orders ?? []) {
    const addr = order.delivery_address as {
      prenom?: string; nom?: string; adresse?: string;
      codePostal?: string; ville?: string; pays?: string;
    } | null;
    const addrStr = addr
      ? [addr.prenom, addr.nom, addr.adresse, addr.codePostal, addr.ville, addr.pays]
          .filter(Boolean).join(" ").replace(/"/g, "'")
      : "";

    const items = Array.isArray(order.order_items) ? order.order_items : [];
    const productName = (items[0]?.products as { name: string } | null)?.name ?? "";
    const qty = items[0]?.quantity ?? 1;
    const totalEuros = (order.total_cents / 100).toFixed(2).replace(".", ",");

    lines.push(
      [
        order.id.slice(0, 8).toUpperCase(),
        new Date(order.created_at).toLocaleDateString("fr-BE"),
        order.status,
        order.occasion_slug ?? "",
        `"${productName}"`,
        qty,
        totalEuros,
        `"${addrStr}"`,
        order.tracking_number ?? "",
      ].join(",")
    );
  }

  const csv = lines.join("\n");
  const filename = `mes-donnees-browniebox-${new Date().toISOString().slice(0, 10)}.csv`;

  return new Response("\uFEFF" + csv, {  // BOM UTF-8 pour Excel
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-cache",
    },
  });
}
