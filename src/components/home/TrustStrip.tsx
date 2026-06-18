/**
 * TrustStrip — Bande de réassurance sous le hero
 * 4 signaux de confiance, icônes symboliques, italic discret
 */

const ITEMS = [
  { icon: "✦", text: "Livré directement chez eux" },
  { icon: "◎", text: "Votre message sur l'emballage" },
  { icon: "→", text: "Prêt en quelques minutes" },
  { icon: "✧", text: "Satisfaction garantie" },
] as const;

export default function TrustStrip() {
  return (
    <div
      style={{
        backgroundColor: "var(--chantilly)",
        borderTop: "1px solid rgba(30,27,46,0.06)",
        borderBottom: "1px solid rgba(30,27,46,0.08)",
      }}
    >
      <div
        className="mx-auto px-6 flex flex-wrap items-center justify-center"
        style={{
          maxWidth: "72rem",
          paddingTop: "13px",
          paddingBottom: "13px",
          gap: "8px 32px",
        }}
      >
        {ITEMS.map(({ icon, text }) => (
          <span
            key={text}
            className="flex items-center gap-2"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "12px",
              fontWeight: 400,
              fontStyle: "italic",
              color: "var(--dark)",
              opacity: 0.5,
            }}
          >
            <span
              aria-hidden="true"
              style={{
                fontStyle: "normal",
                fontSize: "10px",
                color: "var(--primary-500)",
                flexShrink: 0,
              }}
            >
              {icon}
            </span>
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
