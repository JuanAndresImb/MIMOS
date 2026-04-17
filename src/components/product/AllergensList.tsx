// AllergensList — 14 allergènes majeurs UE (Règlement UE n°1169/2011) — FR46
// Les allergènes présents dans le produit sont mis en évidence

// Les 14 allergènes réglementaires UE
const ALL_ALLERGENS = [
  { key: "gluten", label: "Gluten", icon: "🌾" },
  { key: "crustaceans", label: "Crustacés", icon: "🦐" },
  { key: "eggs", label: "Œufs", icon: "🥚" },
  { key: "fish", label: "Poisson", icon: "🐟" },
  { key: "peanuts", label: "Arachides", icon: "🥜" },
  { key: "soybeans", label: "Soja", icon: "🫘" },
  { key: "milk", label: "Lait", icon: "🥛" },
  { key: "nuts", label: "Fruits à coque", icon: "🌰" },
  { key: "celery", label: "Céleri", icon: "🌿" },
  { key: "mustard", label: "Moutarde", icon: "🌻" },
  { key: "sesame", label: "Sésame", icon: "✦" },
  { key: "sulphites", label: "Sulfites", icon: "🍷" },
  { key: "lupin", label: "Lupin", icon: "🌱" },
  { key: "molluscs", label: "Mollusques", icon: "🐚" },
] as const;

interface Props {
  /** Allergènes présents dans le produit — correspond aux clés ci-dessus */
  presentAllergens: string[];
}

export default function AllergensList({ presentAllergens }: Props) {
  const presentSet = new Set(presentAllergens.map((a) => a.toLowerCase()));

  return (
    <section aria-labelledby="allergens-heading">
      <h3
        id="allergens-heading"
        className="text-sm font-semibold mb-3"
        style={{
          fontFamily: "var(--font-label)",
          color: "var(--text-secondary)",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        Allergènes (14 allergènes majeurs UE)
      </h3>

      <ul
        className="flex flex-wrap gap-2"
        role="list"
        aria-label="Liste des 14 allergènes majeurs — ceux présents dans ce produit sont mis en évidence"
      >
        {ALL_ALLERGENS.map(({ key, label, icon }) => {
          const isPresent = presentSet.has(key);
          return (
            <li
              key={key}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
              style={{
                fontFamily: "var(--font-body)",
                backgroundColor: isPresent ? "var(--primary-100)" : "var(--bg-secondary)",
                color: isPresent ? "var(--primary-700)" : "var(--text-secondary)",
                border: isPresent
                  ? "1.5px solid var(--primary-500)"
                  : "1.5px solid transparent",
                fontWeight: isPresent ? 700 : 400,
              }}
              aria-label={`${label}${isPresent ? " — présent dans ce produit" : ""}`}
            >
              <span aria-hidden="true">{icon}</span>
              {label}
              {isPresent && (
                <span className="sr-only"> (présent)</span>
              )}
            </li>
          );
        })}
      </ul>

      <p
        className="mt-3 text-xs"
        style={{
          fontFamily: "var(--font-body)",
          color: "var(--text-secondary)",
        }}
      >
        Les allergènes mis en évidence sont présents dans ce produit.
        Fabriqué dans un atelier utilisant du gluten, des œufs, du lait et des fruits à coque.
      </p>
    </section>
  );
}
