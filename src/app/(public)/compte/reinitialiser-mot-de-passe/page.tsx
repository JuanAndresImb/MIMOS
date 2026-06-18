import type { Metadata } from "next";
import ResetPasswordForm from "./ResetPasswordForm";

export const metadata: Metadata = {
  title: "Réinitialiser le mot de passe — MIMOS",
  robots: { index: false, follow: false },
};

export default function ReinitialiserMotDePassePage() {
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
            Nouveau mot de passe
          </h1>
          <p
            className="text-sm text-center mb-8"
            style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}
          >
            Choisissez un nouveau mot de passe pour votre compte MIMOS.
          </p>

          <ResetPasswordForm />
        </div>
      </div>
    </div>
  );
}
