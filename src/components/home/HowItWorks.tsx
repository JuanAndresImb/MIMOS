import Link from "next/link";

const STEPS = [
  {
    num: "01",
    title: "Tu choisis l'occasion",
    desc: "Anniversaire, merci, surprise… trouve le moment qui colle et on s'adapte.",
  },
  {
    num: "02",
    title: "Tu écris tes mots",
    desc: "Quelques phrases sincères. On les soigne, on les glisse à l'intérieur.",
  },
  {
    num: "03",
    title: "On s'occupe du reste",
    desc: "Emballé avec soin, expédié rapidement. Eux reçoivent quelque chose de vrai.",
  },
];

export default function HowItWorks() {
  return (
    <section
      style={{ backgroundColor: "var(--lime)" }}
      aria-labelledby="how-it-works-heading"
    >
      <div
        className="mx-auto px-6"
        style={{ maxWidth: "72rem", paddingTop: "64px", paddingBottom: "72px" }}
      >
        {/* En-tête */}
        <div style={{ marginBottom: "56px" }}>
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
              marginBottom: "12px",
            }}
          >
            Simple comme bonjour
          </p>
          <h2
            id="how-it-works-heading"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.8rem, 3.2vw, 2.6rem)",
              fontWeight: 700,
              color: "var(--dark)",
              lineHeight: 1.1,
            }}
          >
            Trois étapes.<br />Zéro galère.
          </h2>
        </div>

        {/* Étapes */}
        <div
          className="grid grid-cols-1 md:grid-cols-3"
          style={{ gap: "48px", marginBottom: "60px" }}
        >
          {STEPS.map((step) => (
            <div
              key={step.num}
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            >
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "11px",
                  fontWeight: 500,
                  fontStyle: "italic",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "var(--dark)",
                  opacity: 0.3,
                }}
              >
                {step.num}
              </span>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "var(--dark)",
                  lineHeight: 1.25,
                }}
              >
                {step.title}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "15px",
                  fontWeight: 300,
                  lineHeight: 1.7,
                  color: "var(--dark)",
                  opacity: 0.65,
                }}
              >
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center" }}>
          <Link
            href="/offrir/anniversaire"
            className="hover:opacity-80 transition-opacity"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "14px 40px",
              borderRadius: "999px",
              backgroundColor: "var(--dark)",
              color: "white",
              fontFamily: "var(--font-body)",
              fontSize: "14px",
              fontWeight: 500,
              textDecoration: "none",
              letterSpacing: "0.02em",
            }}
          >
            Commencer — à partir de €24,99
          </Link>
        </div>
      </div>
    </section>
  );
}
