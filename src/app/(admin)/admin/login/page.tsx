"use client";

import { useTranslations } from "next-intl";
import { useActionState } from "react";
import { login } from "@/actions/auth";

export default function LoginPage() {
  const t = useTranslations("admin.connexion");
  const [error, formAction, isPending] = useActionState(login, null);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--bg-secondary)]">
      <div
        className="w-full max-w-[24rem] bg-white rounded-[var(--radius-lg)] shadow-md p-8"
      >
        <h1
          className="text-2xl font-black mb-6 text-center"
          style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
        >
          {t("titre")}
        </h1>

        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="email"
              className="text-sm font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              {t("email")}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="rounded-[var(--radius-md)] border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="password"
              className="text-sm font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              {t("motDePasse")}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="rounded-[var(--radius-md)] border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
            />
          </div>

          {error && (
            <p className="text-sm text-[var(--error)]" role="alert">
              {t("erreur")}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="mt-2 rounded-[var(--radius-full)] bg-[var(--primary-500)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--primary-700)] disabled:opacity-50"
          >
            {isPending ? "…" : t("seConnecter")}
          </button>
        </form>
      </div>
    </main>
  );
}
