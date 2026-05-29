import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

// Vercel Cron envoie Authorization: Bearer CRON_SECRET
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

  // Récupérer les pages expirées et non encore anonymisées
  const { data: expired, error } = await supabase
    .from("recipient_pages")
    .select("id, order_id")
    .lt("expires_at", new Date().toISOString())
    .is("anonymized_at", null);

  if (error) {
    console.error("[cron/anonymize-expired] query error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!expired || expired.length === 0) {
    console.info("[cron/anonymize-expired] nothing to anonymize");
    return NextResponse.json({ anonymized: 0 });
  }

  const ids = expired.map((p) => p.id);

  const { error: updateError } = await supabase
    .from("recipient_pages")
    .update({
      sender_name: "[supprimé]",
      message: "[supprimé]",
      recipient_first_name: null,
      anonymized_at: new Date().toISOString(),
    })
    .in("id", ids);

  if (updateError) {
    console.error("[cron/anonymize-expired] update error:", updateError);
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  // Invalider le cache Vercel pour chaque token anonymisé
  for (const { token } of expired) {
    revalidatePath(`/destinataire/${token}`);
  }

  console.info(`[cron/anonymize-expired] anonymized ${ids.length} pages`);
  return NextResponse.json({ anonymized: ids.length });
}
