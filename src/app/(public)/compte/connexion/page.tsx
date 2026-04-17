"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginCustomer } from "@/actions/auth";

export default function CompteConnexionPage() {
  const [error, formAction, isPending] = useActionState(loginCustomer, null);

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12"
      style={{ backgroundColor: "var(--bg-secondary)" }}
    >
      <div className="w-full mx-auto px-6" style={{ maxWidth: "24rem" }}>
        <div
          className="rounded-3xl p-8"
          style={{ backgroundColor: "white", boxShadow: "0 2px 16px 0 rgba(0,0,0,0.06)" }}
        >
          <h1
            className="text-2xl font-black mb-1 text-center"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            Mon compte
          </h1>
          <p
            className="text-sm text-center mb-8"
            style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}
          >
            Connectez-vous pour voir vos commandes.
          </p>

          <form action={formAction} className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium mb-1"
                style={{ fontFamily: "var(--font-body)", color: "var(--text-primary)" }}
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent"
                style={{
                  fontFamily: "var(--font-body)",
                  borderColor: "var(--primary-100)",
                  backgroundColor: "white",
                  color: "var(--text-primary)",
                }}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium mb-1"
                style={{ fontFamily: "var(--font-body)", color: "var(--text-primary)" }}
              >
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent"
                style={{
                  fontFamily: "var(--font-body)",
                  borderColor: "var(--primary-100)",
                  backgroundColor: "white",
                  color: "var(--text-primary)",
                }}
              />
            </div>

            {error && (
              <p
                className="text-xs"
                style={{ color: "var(--error)", fontFamily: "var(--font-body)" }}
                role="alert"
              >
                Email ou mot de passe incorrect.
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 rounded-full text-white text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)] focus-visible:ring-offset-2 mt-2"
              style={{ backgroundColor: "var(--primary-500)", fontFamily: "var(--font-body)" }}
            >
              {isPending ? "Connexion…" : "Se connecter"}
            </button>
          </form>

          <p
            className="text-xs text-center mt-6"
            style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}
          >
            Pas encore de compte ?{" "}
            <Link
              href="/commander"
              className="font-semibold hover:underline"
              style={{ color: "var(--primary-500)" }}
            >
              Passez une commande
            </Link>{" "}
            et créez-en un à la confirmation.
          </p>
        </div>
      </div>
    </div>
  );
}
