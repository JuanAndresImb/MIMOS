import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales",
  robots: { index: false, follow: false },
};

export default function MentionsLegalesPage() {
  return (
    <div style={{ backgroundColor: "var(--bg-primary)" }}>
      <section className="w-full py-20 md:py-28">
        <div className="max-w-[48rem] mx-auto px-6">
          <h1
            className="text-4xl md:text-5xl mb-4"
            style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--text-primary)" }}
          >
            Mentions légales
          </h1>
          <p
            className="text-base mb-16"
            style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}
          >
            Dernière mise à jour : avril 2026
          </p>

          <div className="flex flex-col gap-10">
            <div>
              <h2
                className="text-lg font-bold mb-3"
                style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
              >
                Éditeur du site
              </h2>
              <p className="text-base leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}>
                MIMOS<br />
                Belgique<br />
                Email : hello@mimos.be<br />
                Site : mimos.be
              </p>
            </div>

            <div>
              <h2
                className="text-lg font-bold mb-3"
                style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
              >
                Fondateur
              </h2>
              <p className="text-base leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}>
                Juan Imbaquingo
              </p>
            </div>

            <div>
              <h2
                className="text-lg font-bold mb-3"
                style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
              >
                Hébergement
              </h2>
              <p className="text-base leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}>
                Vercel Inc.<br />
                440 N Barranca Ave #4133<br />
                Covina, CA 91723, États-Unis<br />
                vercel.com
              </p>
            </div>

            <div>
              <h2
                className="text-lg font-bold mb-3"
                style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
              >
                Propriété intellectuelle
              </h2>
              <p className="text-base leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}>
                L&apos;ensemble des contenus présents sur mimos.be (textes, images, logos, mascottes) est protégé par le droit de la propriété intellectuelle. Toute reproduction, même partielle, est interdite sans accord préalable.
              </p>
            </div>

            <div>
              <h2
                className="text-lg font-bold mb-3"
                style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
              >
                Contact
              </h2>
              <p className="text-base leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}>
                Pour toute question ou réclamation : hello@mimos.be
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
