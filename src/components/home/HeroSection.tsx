import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section
      className="w-full py-16 md:py-24"
      style={{ backgroundColor: "var(--primary-50)" }}
      aria-labelledby="hero-heading"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div
          className="grid grid-cols-1 md:grid-cols-[55fr_45fr] gap-12 items-center"
        >
          {/* Copy — 55% */}
          <div className="flex flex-col gap-6">
            {/* Eyebrow */}
            <span
              className="inline-block text-xs uppercase tracking-widest px-3 py-1 rounded-full w-fit"
              style={{
                fontFamily: "var(--font-label)",
                backgroundColor: "var(--primary-100)",
                color: "var(--primary-700)",
              }}
            >
              Brownie box artisanale belge
            </span>

            {/* Headline */}
            <h1
              id="hero-heading"
              className="text-4xl md:text-5xl xl:text-6xl leading-[1.05]"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                color: "var(--text-primary)",
              }}
            >
              Offrez un moment{" "}
              <span style={{ color: "var(--primary-500)" }}>mémorable</span>
              <br />
              directement dans{" "}
              <span
                className="inline-block"
                style={{
                  background: "var(--primary-100)",
                  borderRadius: "0.5rem",
                  padding: "0 0.25em",
                }}
              >
                la boîte aux lettres
              </span>
            </h1>

            {/* Sous-titre */}
            <p
              className="text-lg md:text-xl max-w-[32rem]"
              style={{
                fontFamily: "var(--font-body)",
                color: "var(--text-secondary)",
                lineHeight: 1.6,
              }}
            >
              Une brownie box artisanale avec votre message personnalisé, expédiée directement
              chez le destinataire. Sans vous déplacer. Sans emballage. Juste de la douceur.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mt-2">
              <Link
                href="/offrir/anniversaire"
                className="inline-flex items-center px-7 py-3.5 rounded-full text-white font-semibold text-base transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)] focus-visible:ring-offset-2"
                style={{
                  backgroundColor: "var(--primary-500)",
                  fontFamily: "var(--font-body)",
                }}
              >
                Choisir l&apos;occasion
              </Link>
              <Link
                href="/comment-ca-marche"
                className="inline-flex items-center px-7 py-3.5 rounded-full font-semibold text-base transition-colors hover:bg-[var(--primary-100)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)] focus-visible:ring-offset-2"
                style={{
                  color: "var(--text-primary)",
                  border: "2px solid var(--primary-100)",
                  fontFamily: "var(--font-body)",
                }}
              >
                Comment ça marche
              </Link>
            </div>

            {/* Signaux de confiance */}
            <div className="flex flex-wrap gap-4 mt-2">
              {[
                "🚪 Livraison boîte aux lettres",
                "✍️ Message personnalisé",
                "🍫 Brownies artisanaux belges",
              ].map((item) => (
                <span
                  key={item}
                  className="text-sm"
                  style={{
                    fontFamily: "var(--font-body)",
                    color: "var(--text-secondary)",
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Visuel — 45% */}
          <div className="relative flex items-center justify-center">
            <div
              className="relative w-full max-w-[24rem] mx-auto rounded-3xl overflow-hidden"
              style={{
                aspectRatio: "4/3",
                backgroundColor: "var(--primary-100)",
              }}
            >
              <Image
                src="/images/hero-placeholder.svg"
                alt="Brownie box artisanale belge — moment d'ouverture de boîte aux lettres"
                fill
                priority
                className="object-contain p-4"
                sizes="(max-width: 768px) 100vw, 45vw"
              />
            </div>

            {/* Badge incliné (UX-DR12) */}
            <div
              className="absolute -bottom-4 -right-4 md:bottom-4 md:right-0 px-4 py-2 rounded-xl shadow-lg"
              style={{
                backgroundColor: "white",
                transform: "rotate(3deg)",
                border: "2px solid var(--primary-100)",
              }}
            >
              <span
                className="text-sm font-bold block"
                style={{
                  fontFamily: "var(--font-label)",
                  color: "var(--primary-700)",
                }}
              >
                🇧🇪 Fait en Belgique
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
