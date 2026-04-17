import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getOccasion } from "@/data/occasions";

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
          La Brownie Box Belge
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
        <a
          href="/"
          className="px-6 py-3 rounded-full text-white text-sm font-semibold"
          style={{ backgroundColor: "var(--primary-500)", fontFamily: "var(--font-body)" }}
        >
          Retour à l&apos;accueil
        </a>
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

    // Insert idempotent — si conflit de code, on ignore
    await adminSupabase.from("promo_codes").insert({
      code,
      type: "recipient",
      value_cents: 1000, // 10%
      expires_at: expiresAt.toISOString(),
      is_active: true,
    }).then();

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
    <main className="min-h-screen" style={{ backgroundColor: tokens.bg }}>
      {/* Header sleeve */}
      <header className="px-6 pt-12 pb-10 text-center" style={{ backgroundColor: tokens.bg }}>
        <p
          className="text-xs uppercase tracking-widest mb-8"
          style={{ fontFamily: "var(--font-label)", color: tokens.accent, opacity: 0.8 }}
        >
          La Brownie Box Belge
        </p>
        <h1
          className="text-3xl font-black leading-tight mb-1"
          style={{ fontFamily: "var(--font-display)", color: tokens.dark }}
        >
          Pour {recipientName} 🍫
        </h1>
        <p
          className="text-sm"
          style={{ fontFamily: "var(--font-body)", color: tokens.dark, opacity: 0.6 }}
        >
          {page.sender_name} vous a réservé un message
        </p>
      </header>

      <section className="px-4 pb-16 max-w-[32rem] mx-auto">
        {/* Carte message */}
        <div className="rounded-3xl p-8 shadow-sm mb-6" style={{ backgroundColor: "white" }}>
          <span
            className="block text-4xl font-black leading-none mb-4 select-none"
            style={{ fontFamily: "var(--font-display)", color: tokens.accent, opacity: 0.3 }}
            aria-hidden
          >
            "
          </span>
          <p
            className="text-xl font-black leading-relaxed"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            {page.message}
          </p>
          <div
            className="mt-6 pt-5 flex items-center gap-2"
            style={{ borderTop: `2px solid ${tokens.bg}` }}
          >
            <span
              className="w-8 h-0.5 inline-block rounded-full"
              style={{ backgroundColor: tokens.accent }}
              aria-hidden
            />
            <span
              className="text-sm font-semibold"
              style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}
            >
              {page.sender_name}
            </span>
          </div>
        </div>

        {/* Carte code promo */}
        {promoCode && (
          <div
            className="rounded-2xl p-5 mb-6"
            style={{ backgroundColor: "white", border: `2px dashed ${tokens.accent}` }}
          >
            <p
              className="text-xs uppercase tracking-widest mb-2"
              style={{ fontFamily: "var(--font-label)", color: tokens.accent }}
            >
              Votre cadeau
            </p>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p
                  className="text-2xl font-black"
                  style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
                >
                  {promoCode.code}
                </p>
                <p
                  className="text-sm mt-0.5"
                  style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}
                >
                  {`10% de réduction sur votre première commande${promoExpiry ? ` — valable jusqu'au ${promoExpiry}` : ""}`}
                </p>
              </div>
              <span
                className="text-3xl font-black shrink-0"
                style={{ fontFamily: "var(--font-display)", color: tokens.accent }}
              >
                −10%
              </span>
            </div>
          </div>
        )}

        {/* CTA */}
        <Link
          href={ctaUrl}
          className="block w-full text-center px-8 py-4 rounded-full text-white text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ backgroundColor: tokens.accent, fontFamily: "var(--font-body)" }}
        >
          Offrir à mon tour 🎁
        </Link>

        {promoCode && (
          <p
            className="text-center text-xs mt-3"
            style={{ fontFamily: "var(--font-body)", color: tokens.dark, opacity: 0.5 }}
          >
            Le code sera pré-appliqué automatiquement
          </p>
        )}
      </section>
    </main>
  );
}
