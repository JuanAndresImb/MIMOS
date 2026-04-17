import { getWebhookSettings } from "@/actions/admin";
import ParametresForm from "./ParametresForm";

export default async function ParametresPage() {
  const settings = await getWebhookSettings();

  return (
    <div>
      <h1
        className="text-2xl font-black mb-8"
        style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
      >
        Paramètres
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Webhook */}
        <div
          className="rounded-2xl p-6"
          style={{ backgroundColor: "white", border: "1px solid var(--primary-100)" }}
        >
          <h2
            className="text-sm font-bold mb-1"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            Notifications webhook
          </h2>
          <p className="text-xs mb-5" style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}>
            Recevez un appel HTTP POST sur l&apos;URL de votre choix pour les événements sélectionnés.
          </p>
          <ParametresForm
            initialUrl={settings.webhook_url}
            initialEvents={settings.webhook_events}
          />
        </div>

        {/* Payload reference */}
        <div
          className="rounded-2xl p-6 self-start"
          style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--primary-100)" }}
        >
          <h2
            className="text-sm font-bold mb-3"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            Format du payload
          </h2>
          <pre
            className="text-xs leading-relaxed overflow-auto"
            style={{ fontFamily: "var(--font-mono, monospace)", color: "var(--text-secondary)" }}
          >
{`{
  "type": "new_order",
  "timestamp": "2026-04-15T10:00:00.000Z",
  "data": {
    "orderId": "uuid",
    "amount": 3500,
    "status": "paid"
  }
}`}
          </pre>
        </div>
      </div>
    </div>
  );
}
