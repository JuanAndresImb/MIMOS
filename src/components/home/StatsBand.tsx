const STATS = [
  { value: "100%", label: "Fait maison" },
  { value: "5★", label: "Avis clients" },
  { value: "🎁", label: "Pour chaque occasion" },
];

export default function StatsBand() {
  return (
    <section
      style={{ backgroundColor: "var(--dark)" }}
      aria-labelledby="stats-heading"
    >
      <h2 id="stats-heading" className="sr-only">Nos engagements</h2>
      <div
        className="mx-auto px-6"
        style={{ maxWidth: "72rem", paddingTop: "56px", paddingBottom: "64px" }}
      >
        <ul
          className="grid grid-cols-1 sm:grid-cols-3"
          style={{ gap: "40px" }}
          role="list"
        >
          {STATS.map((stat) => (
            <li
              key={stat.label}
              className="flex flex-col items-center text-center"
              style={{ gap: "10px" }}
            >
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2.8rem, 6vw, 4rem)",
                  fontWeight: 900,
                  color: "var(--lime)",
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "13px",
                  fontWeight: 300,
                  fontStyle: "italic",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "#e8e8e8",
                  opacity: 0.75,
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
