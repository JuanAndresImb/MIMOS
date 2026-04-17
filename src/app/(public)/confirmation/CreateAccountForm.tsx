"use client";

import { useActionState, useState } from "react";
import { signUpAfterPurchase } from "@/actions/auth";

export default function CreateAccountForm({ email }: { email: string }) {
  const [result, formAction, isPending] = useActionState(signUpAfterPurchase, null);
  const [dismissed, setDismissed] = useState(false);

  // Compte créé avec succès
  if (result?.success) {
    return (
      <div
        className="rounded-2xl p-5 text-center"
        style={{ backgroundColor: "#f0faf7", border: "1px solid var(--success)" }}
      >
        <p
          className="text-sm font-semibold"
          style={{ fontFamily: "var(--font-body)", color: "var(--success)" }}
        >
          Compte créé ! Vous pouvez vous connecter avec votre email et votre mot de passe.
        </p>
      </div>
    );
  }

  // Invitation ignorée
  if (dismissed) return null;

  const errorMessages: Record<string, string> = {
    EMAIL_EXISTS:   "Un compte existe déjà pour cet email.",
    WEAK_PASSWORD:  "Le mot de passe doit contenir au moins 8 caractères.",
    UNKNOWN:        "Une erreur est survenue, veuillez réessayer.",
  };

  return (
    <div
      className="rounded-2xl p-5 mt-2"
      style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--primary-100)" }}
    >
      <p
        className="text-xs uppercase tracking-widest mb-1"
        style={{ fontFamily: "var(--font-label)", color: "var(--primary-500)" }}
      >
        Optionnel
      </p>
      <h2
        className="text-base font-black mb-1"
        style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
      >
        Créer un compte
      </h2>
      <p
        className="text-sm mb-4"
        style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}
      >
        Retrouvez vos commandes et commandez plus vite la prochaine fois.
      </p>

      <form action={formAction} className="flex flex-col gap-3">
        {/* Email pré-rempli en lecture seule */}
        <div>
          <label
            htmlFor="ca-email"
            className="block text-xs font-medium mb-1"
            style={{ fontFamily: "var(--font-body)", color: "var(--text-primary)" }}
          >
            Email
          </label>
          <input
            id="ca-email"
            name="email"
            type="email"
            value={email}
            readOnly
            className="w-full px-3 py-2 rounded-xl border text-sm"
            style={{
              fontFamily: "var(--font-body)",
              borderColor: "var(--primary-100)",
              backgroundColor: "var(--primary-50)",
              color: "var(--text-secondary)",
              cursor: "default",
            }}
          />
        </div>

        {/* Mot de passe */}
        <div>
          <label
            htmlFor="ca-password"
            className="block text-xs font-medium mb-1"
            style={{ fontFamily: "var(--font-body)", color: "var(--text-primary)" }}
          >
            Mot de passe
            <span className="ml-0.5" style={{ color: "var(--error)" }} aria-hidden>*</span>
          </label>
          <input
            id="ca-password"
            name="password"
            type="password"
            placeholder="8 caractères minimum"
            required
            minLength={8}
            className="w-full px-3 py-2 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent"
            style={{
              fontFamily: "var(--font-body)",
              borderColor: "var(--primary-100)",
              backgroundColor: "white",
              color: "var(--text-primary)",
            }}
          />
        </div>

        {/* Consentement marketing — opt-in explicite (RGPD) */}
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            name="marketingConsent"
            type="checkbox"
            className="mt-0.5 rounded accent-[var(--primary-500)]"
            style={{ width: "16px", height: "16px", flexShrink: 0 }}
          />
          <span
            className="text-xs leading-relaxed"
            style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}
          >
            J&apos;accepte de recevoir des offres et actualités de La Brownie Box Belge par email.
            Je peux me désabonner à tout moment.
          </span>
        </label>

        {/* Erreur */}
        {result && !result.success && (
          <p
            className="text-xs"
            style={{ color: "var(--error)", fontFamily: "var(--font-body)" }}
            role="alert"
          >
            {errorMessages[result.error] ?? errorMessages.UNKNOWN}
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2 pt-1">
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 py-2.5 rounded-full text-white text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)] focus-visible:ring-offset-2"
            style={{ backgroundColor: "var(--primary-500)", fontFamily: "var(--font-body)" }}
          >
            {isPending ? "Création…" : "Créer mon compte"}
          </button>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            disabled={isPending}
            className="flex-1 py-2.5 rounded-full text-sm font-semibold transition-colors hover:bg-[var(--primary-100)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)] focus-visible:ring-offset-2"
            style={{
              color: "var(--text-secondary)",
              border: "1px solid var(--primary-100)",
              fontFamily: "var(--font-body)",
            }}
          >
            Non merci
          </button>
        </div>
      </form>
    </div>
  );
}
