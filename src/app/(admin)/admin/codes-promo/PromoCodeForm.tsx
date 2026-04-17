"use client";

import { useActionState, useRef } from "react";
import { createPromoCode } from "@/actions/admin";

const inputClass =
  "w-full px-3 py-2 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-[var(--primary-500)]";
const inputStyle = {
  fontFamily: "var(--font-body)",
  borderColor: "var(--primary-100)",
  color: "var(--text-primary)",
};

export default function PromoCodeForm() {
  const [error, formAction, isPending] = useActionState(createPromoCode, null);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleAction(formData: FormData) {
    await formAction(formData);
    formRef.current?.reset();
  }

  return (
    <form ref={formRef} action={handleAction} className="flex flex-col gap-4">
      {/* Code */}
      <div>
        <label className="block text-xs font-semibold mb-1 uppercase tracking-wider" style={{ fontFamily: "var(--font-label)", color: "var(--text-secondary)" }}>
          Code <span style={{ color: "var(--error)" }}>*</span>
        </label>
        <input
          type="text"
          name="code"
          placeholder="BIENVENUE10"
          required
          className={inputClass}
          style={inputStyle}
        />
      </div>

      {/* Type */}
      <div>
        <label className="block text-xs font-semibold mb-1 uppercase tracking-wider" style={{ fontFamily: "var(--font-label)", color: "var(--text-secondary)" }}>
          Type <span style={{ color: "var(--error)" }}>*</span>
        </label>
        <select name="type" required className={inputClass} style={inputStyle}>
          <option value="fixed">Montant fixe (€)</option>
          <option value="percent">Pourcentage (%)</option>
        </select>
      </div>

      {/* Valeur */}
      <div>
        <label className="block text-xs font-semibold mb-1 uppercase tracking-wider" style={{ fontFamily: "var(--font-label)", color: "var(--text-secondary)" }}>
          Valeur <span style={{ color: "var(--error)" }}>*</span>
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            name="valueCents"
            placeholder="500"
            required
            min={1}
            className={inputClass}
            style={inputStyle}
          />
          <span className="text-xs shrink-0" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-label)" }}>
            centimes / %×100
          </span>
        </div>
        <p className="text-xs mt-1" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
          Ex : 500 = 5€ fixe, ou 1000 = 10%
        </p>
      </div>

      {/* Expiration */}
      <div>
        <label className="block text-xs font-semibold mb-1 uppercase tracking-wider" style={{ fontFamily: "var(--font-label)", color: "var(--text-secondary)" }}>
          Date d&apos;expiration
        </label>
        <input
          type="date"
          name="expiresAt"
          className={inputClass}
          style={inputStyle}
        />
      </div>

      {error && (
        <p className="text-xs" style={{ color: "var(--error)", fontFamily: "var(--font-body)" }} role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-2.5 rounded-full text-white text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-50"
        style={{ backgroundColor: "var(--primary-500)", fontFamily: "var(--font-body)" }}
      >
        {isPending ? "Création…" : "Créer le code"}
      </button>
    </form>
  );
}
