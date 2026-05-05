import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

const VAT_RATE = 0.21;

export async function GET(req: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (!from || !to) {
    return NextResponse.json({ error: "Paramètres from/to requis" }, { status: 400 });
  }

  const supabase = createAdminClient();

  let query = supabase
    .from("orders")
    .select(`
      id,
      created_at,
      status,
      total_cents,
      discount_cents,
      is_b2b,
      invoice_number,
      company_name,
      vat_number,
      customers (email, first_name, last_name)
    `)
    .in("status", ["paid", "preparing", "shipped", "delivered"])
    .gte("created_at", new Date(from).toISOString())
    .lte("created_at", new Date(to + "T23:59:59").toISOString())
    .order("created_at", { ascending: true });

  const { data: orders, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const lines: string[] = [];
  lines.push(
    "Numéro facture,Date,Type,Client,Email,Entreprise,N° TVA,Montant HTVA (€),TVA 21% (€),Total TVAC (€),Remise (€),Statut,Réf. commande"
  );

  for (const order of orders ?? []) {
    const customer = order.customers as { email: string; first_name: string | null; last_name: string | null } | null;
    const clientName = [customer?.first_name, customer?.last_name].filter(Boolean).join(" ") || "";

    const totalTvac = order.total_cents / 100;
    const discountEuros = order.discount_cents / 100;
    // Calcul HTVA depuis le TVAC : HTVA = TVAC / (1 + VAT_RATE)
    const totalHtva = totalTvac / (1 + VAT_RATE);
    const tvaAmount = totalTvac - totalHtva;

    const fmt = (n: number) => n.toFixed(2).replace(".", ",");

    lines.push(
      [
        order.invoice_number ?? "",
        new Date(order.created_at).toLocaleDateString("fr-BE"),
        order.is_b2b ? "B2B" : "B2C",
        `"${clientName}"`,
        customer?.email ?? "",
        `"${order.company_name ?? ""}"`,
        order.vat_number ?? "",
        fmt(totalHtva),
        fmt(tvaAmount),
        fmt(totalTvac),
        discountEuros > 0 ? fmt(discountEuros) : "",
        order.status,
        order.id.slice(0, 8).toUpperCase(),
      ].join(",")
    );
  }

  const csv = lines.join("\n");
  const filename = `factures-${from}-au-${to}.csv`;

  return new Response("\uFEFF" + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-cache",
    },
  });
}
