import { createMollieClient } from "@mollie/api-client";

/**
 * Client Mollie — usage serveur uniquement (Server Actions, API routes, webhooks).
 * Jamais exposé côté client.
 */
export function getMollieClient() {
  const apiKey = process.env.MOLLIE_API_KEY;
  if (!apiKey) {
    throw new Error("MOLLIE_API_KEY manquante — ajoutez-la dans .env.local");
  }
  return createMollieClient({ apiKey });
}

/**
 * URL de base de l'application — utilisée pour construire redirectUrl et webhookUrl.
 * En dev : http://localhost:3000
 * En prod : https://www.votredomaine.be
 */
export function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
}
