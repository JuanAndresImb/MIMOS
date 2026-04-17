import { createClient } from "npm:@supabase/supabase-js@2";

const ANON_VALUES = {
  sender_name: "[supprimé]",
  message: "[supprimé]",
  recipient_first_name: "[supprimé]",
};

Deno.serve(async (_req) => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const baseUrl = Deno.env.get("NEXT_PUBLIC_BASE_URL");
  const cronSecret = Deno.env.get("CRON_SECRET");

  if (!supabaseUrl || !serviceRoleKey || !baseUrl || !cronSecret) {
    console.error(JSON.stringify({ error: "Missing required env vars", timestamp: new Date().toISOString() }));
    return new Response(JSON.stringify({ error: "Configuration error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  try {
    // Trouver toutes les pages expirées non encore anonymisées (idempotent)
    const { data: pages, error: fetchError } = await supabase
      .from("recipient_pages")
      .select("id, token")
      .lt("expires_at", new Date().toISOString())
      .is("anonymized_at", null);

    if (fetchError) throw fetchError;

    if (!pages || pages.length === 0) {
      const result = { timestamp: new Date().toISOString(), anonymized_count: 0, tokens: [] };
      console.log(JSON.stringify(result));
      return new Response(JSON.stringify(result), { headers: { "Content-Type": "application/json" } });
    }

    // Anonymisation en batch
    const ids = pages.map((p: { id: string }) => p.id);
    const { error: updateError } = await supabase
      .from("recipient_pages")
      .update({ ...ANON_VALUES, anonymized_at: new Date().toISOString() })
      .in("id", ids);

    if (updateError) throw updateError;

    // Invalider le cache Edge Vercel pour chaque token
    const revalidateUrl = `${baseUrl}/api/internal/revalidate`;
    for (const page of pages as { id: string; token: string }[]) {
      await fetch(revalidateUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-cron-secret": cronSecret,
        },
        body: JSON.stringify({ path: `/destinataire/${page.token}` }),
      }).catch((err: unknown) =>
        console.error(JSON.stringify({ error: `revalidate failed for ${page.token}: ${String(err)}` }))
      );
    }

    const tokens = (pages as { id: string; token: string }[]).map((p) => p.token);
    const result = {
      timestamp: new Date().toISOString(),
      anonymized_count: pages.length,
      tokens,
    };
    console.log(JSON.stringify(result));
    return new Response(JSON.stringify(result), { headers: { "Content-Type": "application/json" } });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(JSON.stringify({ error: message, timestamp: new Date().toISOString() }));
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
