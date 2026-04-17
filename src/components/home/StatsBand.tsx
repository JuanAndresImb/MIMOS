// StatsBand — section dark avec chiffres clés (UX-DR14)
// Fond #1a1a1a, chiffres Nunito 900, contraste WCAG AA vérifié

const STATS = [
  { value: "100%", label: "Artisanal belge" },
  { value: "📬", label: "Livraison boîte aux lettres" },
  { value: "3", label: "Sleeves pour chaque moment" },
];

export default function StatsBand() {
  return (
    <section
      className="w-full py-14 md:py-20"
      style={{ backgroundColor: "var(--dark)" }}
      aria-labelledby="stats-heading"
    >
      <div className="max-w-6xl mx-auto px-6">
        <h2
          id="stats-heading"
          className="sr-only"
        >
          Nos engagements
        </h2>
        <ul
          className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12"
          role="list"
        >
          {STATS.map((stat) => (
            <li
              key={stat.label}
              className="flex flex-col items-center text-center gap-3"
            >
              <span
                className="text-5xl md:text-6xl"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 900,
                  color: "var(--primary-500)",
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </span>
              <span
                className="text-base"
                style={{
                  fontFamily: "var(--font-body)",
                  // #e8e8e8 sur #1a1a1a = ratio ~12:1 — WCAG AAA
                  color: "#e8e8e8",
                }}
              >
                {stat.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
