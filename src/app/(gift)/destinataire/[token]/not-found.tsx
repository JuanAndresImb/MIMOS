export default function RecipientNotFound() {
  return (
    <main
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "var(--bg-secondary)" }}
    >
      <div className="text-center max-w-[28rem] mx-4">
        <p
          className="text-5xl font-black mb-4"
          style={{ fontFamily: "var(--font-display)", color: "var(--primary-500)" }}
        >
          🍫
        </p>
        <h1
          className="text-xl font-black mb-2"
          style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
        >
          Cette page n&apos;est plus disponible
        </h1>
        <p
          className="text-sm"
          style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}
        >
          Le lien a peut-être expiré ou n&apos;existe pas.
        </p>
      </div>
    </main>
  );
}
