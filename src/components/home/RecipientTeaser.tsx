import Link from "next/link";

export default function RecipientTeaser() {
  return (
    <section
      style={{ backgroundColor: "var(--dark)" }}
      aria-labelledby="recipient-teaser-heading"
    >
      <div
        className="mx-auto px-6 text-center"
        style={{ maxWidth: "680px", paddingTop: "88px", paddingBottom: "96px" }}
      >
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "12px",
            fontWeight: 500,
            fontStyle: "italic",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            color: "#BDBAC8",
            marginBottom: "20px",
          }}
        >
          L&apos;expérience côté destinataire
        </p>

        <h2
          id="recipient-teaser-heading"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.4rem, 5vw, 4rem)",
            fontWeight: 700,
            color: "white",
            lineHeight: 1.05,
            marginBottom: "28px",
          }}
        >
          Et eux, ils vivent quoi ?
        </h2>

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "16px",
            fontWeight: 300,
            lineHeight: 1.75,
            color: "white",
            opacity: 0.6,
            marginBottom: "48px",
          }}
        >
          Un colis qui arrive à l&apos;improviste. Un emballage soigné.
          Des brownies faits à la main. Et dans leur tête — la certitude
          que quelqu&apos;un a pensé à eux.
        </p>

        <Link
          href="/comment-ca-marche"
          className="hover:opacity-80 transition-opacity"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "14px 36px",
            borderRadius: "999px",
            border: "1.5px solid rgba(255,255,255,0.35)",
            color: "white",
            fontFamily: "var(--font-body)",
            fontSize: "14px",
            fontWeight: 500,
            textDecoration: "none",
          }}
        >
          Voir comment ça marche
        </Link>
      </div>
    </section>
  );
}
