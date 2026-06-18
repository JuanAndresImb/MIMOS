"use client";

import { useEffect, useState } from "react";
import { useActionState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { updatePassword } from "@/actions/auth";

const ERROR_MESSAGES: Record<string, string> = {
  WEAK_PASSWORD: "Le mot de passe doit contenir au moins 8 caractères.",
  SESSION_EXPIRED: "Ce lien a expiré. Demandez-en un nouveau ci-dessous.",
  UNKNOWN: "Une erreur est survenue. Réessayez dans quelques instants.",
};

export default function ResetPasswordForm() {
  // "checking" → on attend que Supabase établisse la session de récupération
  // depuis le lien reçu par email (token dans le fragment d'URL)
  const [sessionReady, setSessionReady] = useState<"checking" | "ready" | "missing">("checking");
  const [state, formAction, isPending] = useActionState(updatePassword, null);

  useEffect(() => {
    const supabase = createClient();

    // Le client Supabase détecte automatiquement le token de récupération
    // présent dans l'URL (#access_token=...&type=recovery) et établit la session
    const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || (event === "SIGNED_IN" && session)) {
        setSessionReady("ready");
      }
    });

    // Filet de sécurité : si une session existe déjà au montage
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setSessionReady((current) => (current === "checking" ? "ready" : current));
    });

    const timeout = setTimeout(() => {
      setSessionReady((current) => (current === "checking" ? "missing" : current));
    }, 4000);

    return () => {
      subscription.subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  if (sessionReady === "checking") {
    return (
      <p
        className="text-sm text-center"
        style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}
      >
        Vérification du lien…
      </p>
    );
  }

  if (sessionReady === "missing") {
    return (
      <div className="flex flex-col gap-4 text-center">
        <p
          className="text-sm"
          style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}
        >
          Ce lien de réinitialisation est invalide ou a expiré.
        </p>
        <Link
          href="/compte/mot-de-passe-oublie"
          className="text-sm font-semibold hover:underline"
          style={{ color: "var(--primary-500)" }}
        >
          Demander un nouveau lien →
        </Link>
      </div>
    );
  }

  if (state?.success) {
    return (
      <div className="flex flex-col gap-4 text-center">
        <div
          className="rounded-2xl p-5"
          style={{ backgroundColor: "var(--primary-100)" }}
        >
          <p
            className="text-sm"
            style={{ fontFamily: "var(--font-body)", color: "var(--text-primary)" }}
          >
            Votre mot de passe a été mis à jour. Vous pouvez maintenant vous connecter.
          </p>
        </div>
        <Link
          href="/compte"
          className="text-sm font-semibold hover:underline"
          style={{ color: "var(--primary-500)" }}
        >
          Accéder à mon compte →
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div>
        <label
          htmlFor="password"
          className="block text-xs font-medium mb-1"
          style={{ fontFamily: "var(--font-body)", color: "var(--text-primary)" }}
        >
          Nouveau mot de passe
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent"
          style={{
            fontFamily: "var(--font-body)",
            borderColor: "var(--primary-100)",
            backgroundColor: "white",
            color: "var(--text-primary)",
          }}
        />
        <p
          className="text-xs mt-1"
          style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)", opacity: 0.7 }}
        >
          8 caractères minimum
        </p>
      </div>

      {state && !state.success && (
        <p
          className="text-xs"
          style={{ color: "var(--error)", fontFamily: "var(--font-body)" }}
          role="alert"
        >
          {ERROR_MESSAGES[state.error]}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-3 rounded-full text-white text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)] focus-visible:ring-offset-2 mt-2"
        style={{ backgroundColor: "var(--primary-500)", fontFamily: "var(--font-body)" }}
      >
        {isPending ? "Mise à jour…" : "Mettre à jour le mot de passe"}
      </button>
    </form>
  );
}
