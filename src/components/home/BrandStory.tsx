import Link from "next/link";

export default function BrandStory() {
  return (
    <section
      style={{ backgroundColor: "var(--lime)" }}
      aria-labelledby="brand-story-heading"
    >
      <div
        className="mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center"
        style={{ maxWidth: "72rem", paddingTop: "88px", paddingBottom: "96px" }}
      >
        {/* Gauche — headline + lien */}
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "12px",
                fontWeight: 500,
                fontStyle: "italic",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: "#57546A",
              }}
            >
              Pourquoi MIMOS existe
            </p>

            <h2
              id="brand-story-heading"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 3.5vw, 2.8rem)",
                fontWeight: 700,
                color: "var(--dark)",
                lineHeight: 1.1,
              }}
            >
              Tu penses à eux.<br />
              Souvent.
            </h2>

            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "16px",
                fontWeight: 300,
                lineHeight: 1.8,
                color: "var(--dark)",
                opacity: 0.7,
                maxWidth: "36ch",
              }}
            >
              Entre deux réunions. En voyant quelque chose qui leur ressemble.
              MIMOS est né de cette frustration — et de la conviction qu&apos;une
              pensée mérite mieux qu&apos;un SMS.
            </p>
          </div>

          <Link
            href="/a-propos"
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
            Notre histoire
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Droite — blockquote + stats */}
        <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
          <blockquote
            style={{
              borderLeft: "2px solid var(--dark)",
              paddingLeft: "32px",
              margin: 0,
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.6rem, 2.8vw, 2.2rem)",
                fontWeight: 700,
                color: "var(--dark)",
                lineHeight: 1.2,
              }}
            >
              &ldquo;Une pensée mérite
              mieux qu&apos;un SMS.&rdquo;
            </p>
          </blockquote>

          <ul
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              listStyle: "none",
              padding: 0,
              margin: 0,
            }}
          >
            {[
              { chiffre: "3 min", label: "De l'envie au geste" },
              { chiffre: "48h",   label: "Et c'est chez eux" },
              { chiffre: "100%",  label: "Fait à la main en Belgique" },
            ].map(({ chiffre, label }) => (
              <li
                key={label}
                style={{ display: "flex", alignItems: "baseline", gap: "16px" }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "22px",
                    fontWeight: 700,
                    color: "var(--dark)",
                    minWidth: "64px",
                  }}
                >
                  {chiffre}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "14px",
                    fontWeight: 300,
                    color: "var(--dark)",
                    opacity: 0.6,
                  }}
                >
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
