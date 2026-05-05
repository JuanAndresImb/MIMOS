import { Resend } from "resend";

export function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY manquante — ajoutez-la dans .env.local");
  }
  return new Resend(apiKey);
}

/**
 * Adresse expéditeur.
 * TODO (prod) : remplacer par "MIMOS <bonjour@mimos.be>"
 * une fois le domaine mimos.be vérifié dans Resend.
 */
export const FROM_EMAIL = "MIMOS <onboarding@resend.dev>";
