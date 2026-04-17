"use client";

import { useActionState, useState } from "react";
import { saveWebhookSettings, testWebhookConnection } from "@/actions/admin";

const inputClass =
  "w-full px-3 py-2 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-[var(--primary-500)]";
const inputStyle = {
  fontFamily: "var(--font-body)",
  borderColor: "var(--primary-100)",
  color: "var(--text-primary)",
};

const EVENT_LABELS: Record<string, string> = {
  new_order: "Nouvelle commande",
  low_stock: "Stock bas",
  invoice_error: "Erreur facture",
  wire_payment_received: "Virement reçu",
};

interface Props {
  initialUrl: string | null;
  initialEvents: string[];
}

export default function ParametresForm({ initialUrl, initialEvents }: Props) {
  const [saveError, saveAction, isSaving] = useActionState(saveWebhookSettings, null);
  const [testResult, testAction, isTesting] = useActionState(testWebhookConnection, null);
  const [saved, setSaved] = useState(false);
  const [url, setUrl] = useState(initialUrl ?? "");

  function handleSave(formData: FormData) {
    saveAction(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Save form */}
      <form action={handleSave} className="flex flex-col gap-6">
        {/* URL */}
        <div>
          <label
            htmlFor="webhookUrl"
            className="block text-xs font-semibold mb-1 uppercase tracking-wider"
            style={{ fontFamily: "var(--font-label)", color: "var(--text-secondary)" }}
          >
            URL du webhook
          </label>
          <input
            id="webhookUrl"
            type="url"
            name="webhookUrl"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://hooks.example.com/browniebox"
            className={inputClass}
            style={inputStyle}
          />
          <p className="text-xs mt-1" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
            Laissez vide pour désactiver les notifications.
          </p>
        </div>

        {/* Events */}
        <fieldset>
          <legend
            className="block text-xs font-semibold mb-2 uppercase tracking-wider"
            style={{ fontFamily: "var(--font-label)", color: "var(--text-secondary)" }}
          >
            Événements à notifier
          </legend>
          <div className="flex flex-col gap-2">
            {Object.entries(EVENT_LABELS).map(([key, label]) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name={`event_${key}`}
                  defaultChecked={initialEvents.includes(key)}
                  className="w-4 h-4 rounded accent-[var(--primary-500)]"
                />
                <span className="text-sm" style={{ fontFamily: "var(--font-body)", color: "var(--text-primary)" }}>
                  {label}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {saveError && (
          <p className="text-xs" style={{ color: "var(--error)", fontFamily: "var(--font-body)" }} role="alert">
            {saveError}
          </p>
        )}

        {saved && !saveError && (
          <p className="text-xs" style={{ color: "var(--success, #16a34a)", fontFamily: "var(--font-body)" }} role="status">
            ✅ Paramètres sauvegardés
          </p>
        )}

        <button
          type="submit"
          disabled={isSaving}
          className="w-full py-2.5 rounded-full text-white text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: "var(--primary-500)", fontFamily: "var(--font-body)" }}
        >
          {isSaving ? "Sauvegarde…" : "Sauvegarder"}
        </button>
      </form>

      {/* Test connection */}
      <div className="border-t pt-6" style={{ borderColor: "var(--primary-100)" }}>
        <h3
          className="text-xs font-semibold uppercase tracking-wider mb-3"
          style={{ fontFamily: "var(--font-label)", color: "var(--text-secondary)" }}
        >
          Tester la connexion
        </h3>
        <form action={testAction} className="flex flex-col gap-3">
          <input type="hidden" name="webhookUrl" value={url} />
          <p className="text-sm" style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}>
            Envoie un payload <code>type: &quot;test&quot;</code> à l&apos;URL configurée ci-dessus.
          </p>
          <button
            type="submit"
            disabled={isTesting}
            className="py-2.5 rounded-full text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-50 border"
            style={{
              fontFamily: "var(--font-body)",
              color: "var(--primary-500)",
              borderColor: "var(--primary-500)",
              backgroundColor: "transparent",
            }}
          >
            {isTesting ? "Test en cours…" : "Envoyer un test"}
          </button>
          {testResult && (
            <p
              className="text-xs"
              style={{
                fontFamily: "var(--font-body)",
                color: testResult.ok ? "var(--success, #16a34a)" : "var(--error)",
              }}
              role="status"
            >
              {testResult.message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
