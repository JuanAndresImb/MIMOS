import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getOccasion } from "@/data/occasions";
import DestinataireImmersif from "./DestinataireImmersif";

export const revalidate = 31536000; // Cache Edge 1 an

interface Props {
  params: Promise<{ token: string }>;
}

export default async function DestinataireTokenPage({ params }: Props) {
  const { token } = await params;

  const supabase = await createClient();
  const { data: page } = await supabase
    .from("recipient_pages")
    .select(`
      id,
      sender_name,
      recipient_first_name,
      message,
      occasion_slug,
      first_viewed_at,
      expires_at,
      anonymized_at,
      promo_code_id,
      promo_codes (
        code,
        value_cents,
        expires_at,
        type
      )
    `)
    .eq("token", token)
    .maybeSingle();

  if (!page) {
    notFound();
  }

  if (page.anonymized_at || new Date(page.expires_at) < new Date()) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center" style={{ backgroundColor: "var(--bg-secondary)" }}>
        <p
          className="text-xs uppercase tracking-widest mb-6"
          style={{ fontFamily: "var(--font-label)", color: "var(--primary-500)", opacity: 0.8 }}
        >
          MIMOS
        </p>
        <h1
          className="text-2xl font-black mb-3"
          style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
        >
          Ce message n&apos;est plus disponible
        </h1>
        <p
          className="text-sm mb-8"
          style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}
        >
          Cette page a expiré conformément à notre politique de confidentialité.
        </p>
        <Link
          href="/"
          className="px-6 py-3 rounded-full text-white text-sm font-semibold"
          style={{ backgroundColor: "var(--primary-500)", fontFamily: "var(--font-body)" }}
        >
          Retour à l&apos;accueil
        </Link>
      </main>
    );
  }

  const adminSupabase = createAdminClient();

  // Générer le code promo si c'est la première visite (synchrone — inclus dans le cache)
  let promoCode: { code: string; value_cents: number; expires_at: string | null } | null =
    Array.isArray(page.promo_codes) ? page.promo_codes[0] ?? null : (page.promo_codes as typeof page.promo_codes | null);

  if (!page.promo_code_id && !promoCode) {
    const code = `BIENV-${token.slice(0, 8).toUpperCase()}`;
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 3);

    await adminSupabase.from("promo_codes").upsert(
      {
        code,
        type: "recipient",
        value_cents: 1000, // 10% (type 'recipient' traité comme percent dans le tunnel)
        expires_at: expiresAt.toISOString(),
        is_active: true,
      },
      { onConflict: "code", ignoreDuplicates: true }
    );

    // Récupérer l'id (qu'il vienne d'être créé ou existait déjà)
    const { data: newPromo } = await adminSupabase
      .from("promo_codes")
      .select("id, code, value_cents, expires_at")
      .eq("code", code)
      .single();

    if (newPromo) {
      // Lier à la page destinataire
      await adminSupabase
        .from("recipient_pages")
        .update({ promo_code_id: newPromo.id, first_viewed_at: new Date().toISOString() })
        .eq("id", page.id);

      promoCode = { code: newPromo.code, value_cents: newPromo.value_cents, expires_at: newPromo.expires_at };
    }
  } else if (!page.first_viewed_at) {
    // Marquer first_viewed_at (fire-and-forget si promo déjà générée)
    void adminSupabase
      .from("recipient_pages")
      .update({ first_viewed_at: new Date().toISOString() })
      .eq("id", page.id);
  }

  const occasion = getOccasion(page.occasion_slug);
  const tokens = occasion?.sleeveTokens ?? {
    bg: "var(--bg-secondary)",
    accent: "var(--primary-500)",
    dark: "var(--text-primary)",
  };

  const recipientName = page.recipient_first_name ?? "vous";

  const ctaUrl = promoCode
    ? `/commander?occasion=${page.occasion_slug}&promo=${promoCode.code}`
    : `/offrir/${page.occasion_slug}`;

  const promoExpiry = promoCode?.expires_at
    ? new Date(promoCode.expires_at).toLocaleDateString("fr-BE", { day: "numeric", month: "long", year: "numeric" })
    : null;

  return (
    <DestinataireImmersif
      recipientName={recipientName}
      senderName={page.sender_name ?? "Quelqu'un"}
      message={page.message}
      occasionSlug={page.occasion_slug}
      tokens={tokens}
      promoCode={promoCode}
      promoExpiry={promoExpiry}
      ctaUrl={ctaUrl}
    />
  );
}
