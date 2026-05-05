"use client";

import { useActionState } from "react";
import { anonymizeUserByEmail } from "@/actions/admin";

type State = { error: string | null; success: boolean };

async function anonymizeAction(_prev: State, formData: FormData): Promise<State> {
  const result = await anonymizeUserByEmail(null, formData);
  if (result) return { error: result, success: false };
  return { error: null, success: true };
}

export default function AnonymizeForm() {
  const [state, action, isPending] = useActionState(anonymizeAction, { error: null, success: false });

  return (
    <form action={action} className="flex flex-col gap-3">
      <label
        htmlFor="anonymize-email"
        className="text-xs font-semibold uppercase tracking-wider"
        style={{ fontFamily: "var(--font-label)", color: "var(--text-secondary)" }}
      >
        Email du demandeur
      </label>
      <input
        id="anonymize-email"
        name="email"
        type="email"
        placeholder="client@exemple.com"
        required
        className="w-full rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2"
        style={{
          border: "1px solid var(--primary-200)",
          fontFamily: "var(--font-body)",
          color: "var(--text-primary)",
          backgroundColor: "var(--bg-secondary)",
        }}
      />

      {state.error && (
        <p className="text-xs" style={{ color: "var(--error)", fontFamily: "var(--font-body)" }}>
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="text-xs" style={{ color: "var(--success)", fontFamily: "var(--font-body)" }}>
          ✓ Données anonymisées avec succès
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="px-5 py-2.5 rounded-full text-white text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-50"
        style={{ backgroundColor: "var(--error)", fontFamily: "var(--font-body)" }}
      >
        {isPending ? "Anonymisation…" : "Anonymiser maintenant"}
      </button>
      <p className="text-xs" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
        ⚠ Cette action est irréversible.
      </p>
    </form>
  );
}
