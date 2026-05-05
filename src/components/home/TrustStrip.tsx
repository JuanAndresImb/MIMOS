export default function TrustStrip() {
  return (
    <div
      style={{
        backgroundColor: "var(--chantilly)",
        borderTop: "1px solid rgba(35,21,16,0.06)",
        borderBottom: "1px solid rgba(35,21,16,0.08)",
      }}
    >
      <div
        className="mx-auto px-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-2"
        style={{ maxWidth: "72rem", paddingTop: "16px", paddingBottom: "16px" }}
      >
        {[
          "Livré directement chez eux",
          "Ton message, leur surprise"
        ].map((text) => (
          <span
            key={text}
            className="flex items-center gap-2"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "13px",
              fontWeight: 400,
              fontStyle: "italic",
              color: "var(--dark)",
              opacity: 0.65, 
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                backgroundColor: "var(--primary-500)",
                flexShrink: 0,
              }}
              aria-hidden="true"
            />
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
