// AllergensList — 14 allergènes majeurs UE (Règlement UE n°1169/2011)
// Présentation chaleureuse : "ce que contient ce MIMOS" — pas une annexe réglementaire froide

const ALL_ALLERGENS = [
  { key: "gluten",      label: "Gluten",         icon: "🌾" },
  { key: "crustaceans", label: "Crustacés",       icon: "🦐" },
  { key: "eggs",        label: "Œufs",            icon: "🥚" },
  { key: "fish",        label: "Poisson",         icon: "🐟" },
  { key: "peanuts",     label: "Arachides",       icon: "🥜" },
  { key: "soybeans",    label: "Soja",            icon: "🫘" },
  { key: "milk",        label: "Lait",            icon: "🥛" },
  { key: "nuts",        label: "Fruits à coque",  icon: "🌰" },
  { key: "celery",      label: "Céleri",          icon: "🌿" },
  { key: "mustard",     label: "Moutarde",        icon: "🌻" },
  { key: "sesame",      label: "Sésame",          icon: "✦" },
  { key: "sulphites",   label: "Sulfites",        icon: "🍷" },
  { key: "lupin",       label: "Lupin",           icon: "🌱" },
  { key: "molluscs",    label: "Mollusques",      icon: "🐚" },
] as const;

interface Props {
  presentAllergens: string[];
  accentColor?: string;
}

export default function AllergensList({
  presentAllergens,
  accentColor = "var(--primary-500)",
}: Props) {
  const presentSet = new Set(presentAllergens.map((a) => a.toLowerCase()));
  const presentCount = ALL_ALLERGENS.filter(({ key }) => presentSet.has(key)).length;

  return (
    <section aria-labelledby="allergens-heading">

      {/* Heading chaleureux */}
      <div className="flex items-baseline justify-between mb-3">
        <h3
          id="allergens-heading"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "11px",
            fontWeight: 600,
            color: "var(--text-secondary)",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
          }}
        >
          Ce que contient ce MIMOS
        </h3>
        {presentCount > 0 && (
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "11px",
              color: "var(--text-secondary)",
              opacity: 0.6,
            }}
          >
            {presentCount} allergène{presentCount > 1 ? "s" : ""} présent{presentCount > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Pills */}
      <ul
        className="flex flex-wrap gap-1.5"
        role="list"
        aria-label="14 allergènes majeurs UE — ceux présents sont mis en évidence"
      >
        {ALL_ALLERGENS.map(({ key, label, icon }) => {
          const isPresent = presentSet.has(key);
          return (
            <li
              key={key}
              className="flex items-center gap-1.5 text-xs transition-all"
              style={{
                fontFamily: "var(--font-body)",
                padding: "5px 12px",
                borderRadius: "999px",
                fontWeight: isPresent ? 600 : 400,
                backgroundColor: isPresent
                  ? `${accentColor}18`
                  : "var(--bg-secondary)",
                color: isPresent ? accentColor : "var(--text-secondary)",
                border: isPresent
                  ? `1.5px solid ${accentColor}55`
                  : "1.5px solid transparent",
              }}
              aria-label={`${label}${isPresent ? " — présent" : ""}`}
            >
              <span aria-hidden="true" style={{ fontSize: "13px" }}>{icon}</span>
              {label}
            </li>
          );
        })}
      </ul>

      {/* Note légale — présente mais discrète */}
      <p
        className="mt-3 text-xs leading-relaxed"
        style={{
          fontFamily: "var(--font-body)",
          color: "var(--text-secondary)",
          opacity: 0.65,
        }}
      >
        Fabriqué dans un atelier utilisant du gluten, des œufs, du lait et des fruits à coque.
        Les allergènes mis en évidence sont présents dans ce produit
        (Règl. UE n°1169/2011).
      </p>
    </section>
  );
}
