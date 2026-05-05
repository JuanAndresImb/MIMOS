export default function IntroText() {
  return (
    <section
      className="w-full py-20 md:py-28"
      style={{ backgroundColor: "var(--chantilly)" }}
      aria-label="Introduction MIMOS"
    >
      <div className="mx-auto px-6 text-center" style={{ maxWidth: "48rem" }}>
        <p
          className="text-xs uppercase tracking-[0.2em] mb-6"
          style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}
        >
          Bruxelles · Belgique
        </p>
        <h2
          className="text-3xl md:text-4xl xl:text-5xl leading-tight mb-6"
          style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--text-primary)" }}
        >
          Des douceurs artisanales{" "}
          <em style={{ color: "var(--dark)", fontStyle: "italic" }}>livrées dans la boîte aux lettres</em>
        </h2>
        <p
          className="text-base md:text-lg leading-relaxed mx-auto"
          style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)", maxWidth: "36rem" }}
        >
          Pas besoin de passer par la boutique. Tu choisis l&apos;occasion, tu écris ton message —
          on emballe et on livre directement chez eux. Simple, sincère, inoubliable.
        </p>
      </div>
    </section>
  );
}
