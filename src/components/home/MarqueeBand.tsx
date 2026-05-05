const ITEMS = [
  { label: "🎂 Anniversaire",              color: "var(--lavande)" },
  { label: "🍫 Brownies artisanaux belges", color: "var(--saumon)"  },
  { label: "🎄 Noël & Fêtes",              color: "var(--menthe)"  },
  { label: "✉️ Livraison boîte aux lettres",color: "var(--lavande)" },
  { label: "💛 Juste parce que",            color: "var(--saumon)"  },
  { label: "🎁 Message personnalisé",       color: "var(--menthe)"  },
  { label: "💼 Équipes & Entreprises",      color: "var(--lavande)" },
  { label: "🇧🇪 Fait en Belgique",          color: "var(--saumon)"  },
];

export default function MarqueeBand() {
  const items = [...ITEMS, ...ITEMS];

  return (
    <div
      className="w-full overflow-hidden"
      style={{ backgroundColor: "var(--lime)" }}
      aria-hidden="true"
    >
      <style>{`
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track { animation: none !important; }
        }
      `}</style>

      {/* Ligne lime avec texte foncé */}
      <div
        className="marquee-track flex whitespace-nowrap py-3"
        style={{ animation: "marquee-scroll 32s linear infinite", width: "max-content" }}
      >
        {items.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2 px-6 text-sm font-semibold"
            style={{ fontFamily: "var(--font-body)", color: "var(--dark)" }}
          >
            {item.label}
            <span style={{ color: "rgba(35,21,16,0.3)" }} aria-hidden="true">✦</span>
          </span>
        ))}
      </div>

      {/* Bande de blocs colorés défilants */}
      <div
        className="marquee-track flex whitespace-nowrap"
        style={{ animation: "marquee-scroll 32s linear infinite", width: "max-content" }}
      >
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              width: "clamp(180px, 22vw, 280px)",
              height: "72px",
              backgroundColor: item.color,
              flexShrink: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}
