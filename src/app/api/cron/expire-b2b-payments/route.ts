import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getResendClient, FROM_EMAIL } from "@/lib/resend";
import { formatPriceCents } from "@/lib/utils";

function isAuthorized(req: Request): boolean {
  const auth = req.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return auth === `Bearer ${secret}`;
}

export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // Trouver les commandes B2B en attente de virement depuis plus de 7 jours
  const { data: expired, error } = await supabase
    .from("orders")
    .select(`
      id,
      total_cents,
      company_name,
      created_at,
      customers (email, first_name, last_name)
    `)
    .eq("status", "pending_payment")
    .eq("is_b2b", true)
    .lt("created_at", sevenDaysAgo.toISOString());

  if (error) {
    console.error("[cron/expire-b2b-payments] query error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!expired || expired.length === 0) {
    console.info("[cron/expire-b2b-payments] nothing to expire");
    return NextResponse.json({ expired: 0 });
  }

  const resend = getResendClient();
  let emailErrors = 0;

  for (const order of expired) {
    // Passer en expired_payment
    await supabase
      .from("orders")
      .update({ status: "expired_payment", updated_at: new Date().toISOString() })
      .eq("id", order.id);

    // Envoyer email de rappel
    const customer = order.customers as { email: string; first_name: string | null } | null;
    if (customer?.email) {
      const { error: emailError } = await resend.emails.send({
        from: FROM_EMAIL,
        to: customer.email,
        subject: `Votre commande MIMOS a expiré — réf. ${order.id.slice(0, 8).toUpperCase()}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 580px; margin: 0 auto; color: #1a1a1a;">
            <h2 style="color: #e84d3d; margin-bottom: 4px;">MIMOS</h2>
            <p>Bonjour ${order.company_name ?? customer.first_name ?? ""},</p>
            <p>Nous n'avons pas reçu votre virement pour la commande
              <strong>${order.id.slice(0, 8).toUpperCase()}</strong>
              (montant : <strong>${formatPriceCents(order.total_cents)}</strong>)
              dans le délai de 7 jours ouvrables.
            </p>
            <p>La commande a donc été <strong>annulée automatiquement</strong>.</p>
            <p>Si vous souhaitez passer une nouvelle commande, rendez-vous sur notre site :</p>
            <a href="${process.env.NEXT_PUBLIC_BASE_URL ?? "https://lamimos.be"}/offrir/entreprise"
               style="display:inline-block; background:#e84d3d; color:white; padding:12px 24px; border-radius:99px; text-decoration:none; font-weight:bold; margin:8px 0;">
              Passer une nouvelle commande
            </a>
            <p>Pour toute question, répondez simplement à cet email.</p>
            <p style="color: #888; font-size: 13px;">— L'équipe MIMOS</p>
          </div>
        `,
      });
      if (emailError) {
        console.error("[cron/expire-b2b-payments] email error for", order.id, emailError);
        emailErrors++;
      }
    }
  }

  console.info(`[cron/expire-b2b-payments] expired ${expired.length} orders, ${emailErrors} email errors`);
  return NextResponse.json({ expired: expired.length, emailErrors });
}
