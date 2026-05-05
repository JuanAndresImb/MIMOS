import { requireAdmin } from "@/lib/auth";
import { getRgpdStats } from "@/actions/admin";
import AnonymizeForm from "./AnonymizeForm";

export default async function RgpdPage() {
  await requireAdmin();

  const stats = await getRgpdStats();

  return (
    <div>
      <h1
        className="text-2xl font-black mb-2"
        style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
      >
        Conformité RGPD
      </h1>
      <p
        className="text-sm mb-8"
        style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}
      >
        Gestion des données personnelles — droit à l&apos;oubli et anonymisation automatique
      </p>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Pages destinataires actives", value: stats.activePages, note: "non expirées" },
          { label: "Anonymisées (30 derniers jours)", value: stats.anonymizedRecent, note: "cron quotidien" },
          { label: "Total anonymisées", value: stats.totalAnonymized, note: "depuis le lancement" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl p-5"
            style={{ backgroundColor: "white", border: "1px solid var(--primary-100)" }}
          >
            <p
              className="text-xs uppercase tracking-widest mb-2"
              style={{ fontFamily: "var(--font-label)", color: "var(--text-secondary)" }}
            >
              {s.label}
            </p>
            <p
              className="text-3xl font-black"
              style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
            >
              {s.value}
            </p>
            <p
              className="text-xs mt-1"
              style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}
            >
              {s.note}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Anonymisation manuelle — droit à l'oubli */}
        <div
          className="rounded-2xl p-6"
          style={{ backgroundColor: "white", border: "1px solid var(--primary-100)" }}
        >
          <h2
            className="text-base font-bold mb-1"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            Droit à l&apos;effacement
          </h2>
          <p
            className="text-xs mb-5"
            style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}
          >
            Anonymise immédiatement toutes les données personnelles liées à cet email :
            noms, messages, adresses de livraison. Les agrégats financiers sont conservés.
          </p>
          <AnonymizeForm />
        </div>

        {/* Info cron automatique */}
        <div
          className="rounded-2xl p-6"
          style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--primary-100)" }}
        >
          <h2
            className="text-base font-bold mb-3"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            Cron automatique
          </h2>
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full mt-0.5 shrink-0"
                style={{ backgroundColor: "var(--success)20", color: "var(--success)", fontFamily: "var(--font-label)" }}
              >
                Actif
              </span>
              <div>
                <p
                  className="text-sm font-semibold"
                  style={{ fontFamily: "var(--font-body)", color: "var(--text-primary)" }}
                >
                  Anonymisation des pages expirées
                </p>
                <p
                  className="text-xs mt-0.5"
                  style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}
                >
                  Chaque jour à 02h00 UTC — anonymise toutes les pages destinataires
                  dont la date d&apos;expiration (1 an après commande) est dépassée.
                </p>
              </div>
            </div>
            <div
              className="rounded-xl p-3 font-mono text-xs"
              style={{ backgroundColor: "var(--primary-50)", color: "var(--primary-700)" }}
            >
              GET /api/cron/anonymize-expired<br />
              Schedule : 0 2 * * * (quotidien 02h00)
            </div>
          </div>

          <div
            className="mt-5 pt-4"
            style={{ borderTop: "1px solid var(--primary-100)" }}
          >
            <h3
              className="text-xs font-bold mb-2 uppercase tracking-wider"
              style={{ fontFamily: "var(--font-label)", color: "var(--text-secondary)" }}
            >
              Données anonymisées
            </h3>
            <ul className="text-xs space-y-1" style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}>
              {[
                "Nom de l'expéditeur (recipient_pages.sender_name)",
                "Message personnel (recipient_pages.message)",
                "Prénom du destinataire (recipient_pages.recipient_first_name)",
              ].map((item) => (
                <li key={item} className="flex items-center gap-1.5">
                  <span style={{ color: "var(--success)" }}>✓</span> {item}
                </li>
              ))}
            </ul>
            <p
              className="text-xs mt-3 italic"
              style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}
            >
              Les données financières (montants, numéros de commande) sont conservées
              pour les obligations comptables.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
