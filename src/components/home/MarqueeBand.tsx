// MarqueeBand — défilement infini CSS (UX-DR5)
// Pas de JS — pure animation CSS pour performance maximale
// Respecte prefers-reduced-motion (WCAG 2.1 AA)

const ITEMS = [
  "🎂 Anniversaire",
  "🍫 Brownies artisanaux belges",
  "🎄 Noël & Fêtes",
  "✉️ Livraison boîte aux lettres",
  "💛 Juste parce que",
  "🎁 Message personnalisé",
  "💼 Équipes & Entreprises",
  "🇧🇪 Fait en Belgique",
];

export default function MarqueeBand() {
  // Dupliquer pour la boucle infinie sans saut
  const items = [...ITEMS, ...ITEMS];

  return (
    <div
      className="w-full overflow-hidden py-4"
      style={{ backgroundColor: "var(--primary-500)" }}
      aria-hidden="true"
    >
      <style>{`
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track {
            animation: none !important;
          }
        }
      `}</style>
      <div
        className="marquee-track flex gap-0 whitespace-nowrap"
        style={{
          animation: "marquee-scroll 28s linear infinite",
          width: "max-content",
        }}
      >
        {items.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2 px-8 text-white font-semibold text-sm"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {item}
            <span className="text-white/40" aria-hidden="true">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
