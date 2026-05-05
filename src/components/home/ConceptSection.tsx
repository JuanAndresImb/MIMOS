import Link from "next/link";

export default function ConceptSection() {
  return (
    <section
      style={{ backgroundColor: "var(--cantaloupe)" }}
      aria-labelledby="concept-heading"
    >
      <div
        className="mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center"
        style={{ maxWidth: "72rem", paddingTop: "80px", paddingBottom: "80px" }}
      >
        {/* Titre */}
        <div>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "12px",
              fontWeight: 500,
              fontStyle: "italic",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "var(--dark)",
              opacity: 0.45,
              marginBottom: "20px",
            }}
          >
            En pratique
          </p>

          <h2
            id="concept-heading"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.2rem, 4vw, 3.4rem)",
              fontWeight: 700,
              color: "var(--dark)",
              lineHeight: 1.08,
            }}
          >
            Tu as pensé à eux.<br />
            On s&apos;occupe<br />
            du reste.
          </h2>
        </div>

        {/* Corps + CTA */}
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "17px",
              fontWeight: 300,
              lineHeight: 1.75,
              color: "var(--dark)",
              opacity: 0.72,
            }}
          >
            Tu choisis le moment. Tu écris quelques mots.
            On prépare la box à la main, on l&apos;emballe avec soin,
            on la livre directement chez eux.
            Toi, tu continues ta journée.
            Eux, ils reçoivent quelque chose de vrai.
          </p>

          <Link
            href="/nos-douceurs"
            className="hover:opacity-60 transition-opacity"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontFamily: "var(--font-body)",
              fontSize: "14px",
              fontWeight: 500,
              color: "var(--dark)",
              textDecoration: "underline",
              textUnderlineOffset: "4px",
              alignSelf: "flex-start",
            }}
          >
            Voir les formats
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
