import Link from "next/link";

export default function HeroFullscreen() {
  return (
    <section
      className="w-full flex flex-col items-center justify-center text-center"
      style={{
        minHeight: "calc(100svh - 118px)",
        backgroundColor: "var(--bleu)",
        padding: "72px 24px 80px",
      }}
      aria-labelledby="hero-heading"
    >
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "13px",
          fontWeight: 300,
          fontStyle: "italic",
          color: "var(--dark)",
          opacity: 0.5,
          marginBottom: "24px",
          letterSpacing: "0.01em",
        }}
      >
        Brownies artisanaux · Belgique
      </p>

      <h1
        id="hero-heading"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(2.8rem, 6.5vw, 5.2rem)",
          fontWeight: 700,
          color: "var(--dark)",
          lineHeight: 1.05,
          marginBottom: "44px",
          maxWidth: "14ch",
        }}
      >
        Pour quand un message ne suffit pas.
      </h1>

      <Link
        href="/offrir/anniversaire"
        style={{
          display: "inline-flex",
          alignItems: "center",
          padding: "15px 44px",
          borderRadius: "999px",
          backgroundColor: "var(--dark)",
          color: "var(--chantilly)",
          fontFamily: "var(--font-body)",
          fontSize: "14px",
          fontWeight: 500,
          textDecoration: "none",
          letterSpacing: "0.02em",
          transition: "opacity 0.2s",
        }}
        className="hover:opacity-75"
      >
        Choisir le moment
      </Link>
    </section>
  );
}
