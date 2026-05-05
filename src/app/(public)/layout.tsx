import Navbar from "@/components/navbar/Navbar";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const t = await getTranslations("footer");

  return (
    <>
      {/* Announcement bar — fixed, always visible */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          backgroundColor: "var(--dahlia)",
          borderBottom: "1px solid rgba(35,21,16,0.06)",
          padding: "9px 16px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "12px",
            fontWeight: 500,
            fontStyle: "italic",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "var(--dark)",
          }}
        >
          Fait à la main en Belgique &nbsp;·&nbsp; Pensé en 3 minutes &nbsp;·&nbsp; Livré en 48h
        </p>
      </div>
      <Navbar />
      <main className="flex-1" style={{ paddingTop: "118px" }}>{children}</main>

      {/* Footer — fond identique à la page, style BuddyBuddy */}
      <footer style={{ backgroundColor: "var(--bg-primary)" }}>
        {/* Séparateur top subtil */}
        <div style={{ borderTop: "1px solid rgba(35,21,16,0.08)" }}>
          <div
            className="mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10"
            style={{ maxWidth: "72rem", paddingTop: "56px", paddingBottom: "48px" }}
          >
            {/* Marque */}
            <div className="col-span-2 md:col-span-1 flex flex-col gap-5">
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "22px",
                  fontWeight: 700,
                  color: "var(--dark)",
                }}
              >
                MIMOS
              </span>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "15px",
                  fontWeight: 300,
                  lineHeight: 1.65,
                  color: "var(--text-secondary)",
                  maxWidth: "220px",
                }}
              >
                Des attentions sincères, conçues avec soin pour les personnes qui comptent.
              </p>
            </div>

            {/* Occasions */}
            <div className="flex flex-col gap-3">
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "11px",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  fontStyle: "italic",
                  letterSpacing: "0.08em",
                  color: "var(--dark)",
                  opacity: 0.45,
                  marginBottom: "4px",
                }}
              >
                Occasions
              </p>
              {[
                { href: "/offrir/anniversaire", label: "Anniversaire" },
                { href: "/offrir/surprise",     label: "Juste parce que" },
                { href: "/offrir/collegue",     label: "Collègue / Merci" },
                { href: "/offrir/entreprise",   label: "Pour ton équipe" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="hover:opacity-60 transition-opacity"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "14px",
                    fontWeight: 300,
                    color: "var(--text-secondary)",
                    textDecoration: "none",
                  }}
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* À propos */}
            <div className="flex flex-col gap-3">
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "11px",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  fontStyle: "italic",
                  letterSpacing: "0.08em",
                  color: "var(--dark)",
                  opacity: 0.45,
                  marginBottom: "4px",
                }}
              >
                À propos
              </p>
              {[
                { href: "/comment-ca-marche", label: "Comment ça marche" },
                { href: "/nos-douceurs",      label: "Nos douceurs" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="hover:opacity-60 transition-opacity"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "14px",
                    fontWeight: 300,
                    color: "var(--text-secondary)",
                    textDecoration: "none",
                  }}
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* Légal */}
            <div className="flex flex-col gap-3">
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "11px",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  fontStyle: "italic",
                  letterSpacing: "0.08em",
                  color: "var(--dark)",
                  opacity: 0.45,
                  marginBottom: "4px",
                }}
              >
                Légal
              </p>
              {[
                { href: "/cgv",                              label: t("cgv") },
                { href: "/mentions-legales",                 label: t("mentionsLegales") },
                { href: "/politique-de-confidentialite",     label: t("confidentialite") },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="hover:opacity-60 transition-opacity"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "14px",
                    fontWeight: 300,
                    color: "var(--text-secondary)",
                    textDecoration: "none",
                  }}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Bottom bar — BuddyBuddy large logo bottom-left */}
          <div
            className="mx-auto px-6 flex items-end justify-between"
            style={{
              maxWidth: "72rem",
              paddingBottom: "32px",
              borderTop: "1px solid rgba(35,21,16,0.06)",
              paddingTop: "24px",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 5vw, 4rem)",
                fontWeight: 700,
                color: "var(--dark)",
                opacity: 0.08,
                lineHeight: 1,
                userSelect: "none",
              }}
              aria-hidden="true"
            >
              MIMOS
            </span>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "12px",
                fontWeight: 300,
                color: "var(--text-secondary)",
                opacity: 0.5,
              }}
            >
              {t("copyright", { year: new Date().getFullYear() })}
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
