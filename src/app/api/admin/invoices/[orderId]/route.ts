import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateInvoicePdf, type InvoiceData } from "@/lib/pdf/generateInvoice";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { orderId } = await params;
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
    return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
  }

  const invoiceNumber = order.invoice_number ?? `FAC-${new Date().getFullYear()}-XXXX`;
  const customer = order.customers as { email: string } | null;
  const addr = order.delivery_address as {
    prenom?: string; nom?: string; adresse?: string; codePostal?: string; ville?: string;
  } | null;
  const items = (
    order.order_items as Array<{ quantity: number; unit_price_cents: number; products: { name: string } | null }>
  ).map((i) => ({
    name:           (i.products as { name: string } | null)?.name ?? "MIMOS",
    quantity:       i.quantity,
    unitPriceCents: i.unit_price_cents,
  }));

  const invoiceData: InvoiceData = {
    invoiceNumber,
    issuedAt:         order.invoice_number ? new Date() : new Date(),
    orderId:          order.id,
    orderCreatedAt:   new Date(order.created_at),
    companyName:      order.company_name,
    vatNumber:        order.vat_number,
    customerEmail:    customer?.email ?? null,
    deliveryAddress:  addr,
    items,
    totalCents:       order.total_cents,
    discountCents:    order.discount_cents,
  };

  const pdfBytes = await generateInvoicePdf(invoiceData);

  return new Response(pdfBytes.buffer as ArrayBuffer, {
    headers: {
      "Content-Type":        "application/pdf",
      "Content-Disposition": `attachment; filename="facture-${invoiceNumber}.pdf"`,
      "Cache-Control":       "private, no-cache",
    },
  });
}
