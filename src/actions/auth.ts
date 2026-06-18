"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendWelcomeEmail } from "@/actions/emails";

export async function login(
  _prevState: string | null,
  formData: FormData
): Promise<string | null> {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Jamais exposer le message d'erreur Supabase — message générique côté client
    return "error";
  }

  revalidatePath("/admin", "layout");
  redirect("/admin");
}

// ─── Signup post-achat ────────────────────────────────────────────────────────

const signUpSchema = z.object({
  email:             z.string().email(),
  password:          z.string().min(8, "8 caractères minimum"),
  marketingConsent:  z.boolean(),
});

export type SignUpResult =
  | { success: true }
  | { success: false; error: "EMAIL_EXISTS" | "WEAK_PASSWORD" | "UNKNOWN" };

/**
 * Crée un compte Supabase Auth pour un acheteur post-confirmation.
 * - Utilise l'admin client pour créer l'utilisateur directement confirmé
 *   (l'email a déjà été validé via l'email de confirmation de commande).
 * - Met à jour le customer existant pour lier le user_id Auth + consentement marketing.
 */
export async function signUpAfterPurchase(
  _prevState: SignUpResult | null,
  formData: FormData
): Promise<SignUpResult> {
  const raw = {
    email:            (formData.get("email") as string)?.toLowerCase().trim(),
    password:         formData.get("password") as string,
    marketingConsent: formData.get("marketingConsent") === "on",
  };

  const parsed = signUpSchema.safeParse(raw);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0]?.message;
    if (firstIssue?.includes("8 caractères")) return { success: false, error: "WEAK_PASSWORD" };
    return { success: false, error: "UNKNOWN" };
  }

  const supabase = createAdminClient();

  // Créer l'utilisateur Supabase Auth directement confirmé
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email:             parsed.data.email,
    password:          parsed.data.password,
    email_confirm:     true,
  });

  if (authError) {
    if (authError.message.toLowerCase().includes("already registered") ||
        authError.code === "email_exists") {
      return { success: false, error: "EMAIL_EXISTS" };
    }
    if (authError.message.toLowerCase().includes("password")) {
      return { success: false, error: "WEAK_PASSWORD" };
    }
    console.error("[signUpAfterPurchase] auth error:", authError);
    return { success: false, error: "UNKNOWN" };
  }

  // Lier le customer existant au nouveau compte Auth
  const { data: customer } = await supabase
    .from("customers")
    .update({
      user_id:           authData.user.id,
      marketing_consent: parsed.data.marketingConsent,
      updated_at:        new Date().toISOString(),
    })
    .eq("email", parsed.data.email)
    .select("first_name")
    .maybeSingle();

  // Email de bienvenue — fire-and-forget, ne bloque jamais la création du compte
  sendWelcomeEmail(parsed.data.email, customer?.first_name ?? "").catch((err) =>
    console.error("[signUpAfterPurchase] échec envoi email de bienvenue:", err)
  );

  return { success: true };
}

// ─── Login client (espace compte) ────────────────────────────────────────────

export async function loginCustomer(
  _prevState: string | null,
  formData: FormData
): Promise<string | null> {
  const supabase = await createClient();

  const email    = (formData.get("email")    as string)?.toLowerCase().trim();
  const password =  formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return "error";

  revalidatePath("/compte", "layout");
  redirect("/compte");
}

// ─── Mot de passe oublié (espace client) ──────────────────────────────────────

function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
}

/**
 * Envoie un email de réinitialisation de mot de passe via Supabase Auth.
 * Toujours retourne "ok" — même si l'email n'existe pas — pour ne pas
 * permettre l'énumération des comptes (sécurité).
 */
export async function requestPasswordReset(
  _prevState: "ok" | null,
  formData: FormData
): Promise<"ok"> {
  const email = (formData.get("email") as string)?.toLowerCase().trim();

  if (email) {
    const supabase = await createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${getBaseUrl()}/compte/reinitialiser-mot-de-passe`,
    });
    if (error) {
      console.error("[requestPasswordReset] erreur Supabase Auth:", error);
    }
  }

  // Réponse identique que l'email existe ou non — anti-énumération
  return "ok";
}

export type UpdatePasswordResult =
  | { success: true }
  | { success: false; error: "WEAK_PASSWORD" | "SESSION_EXPIRED" | "UNKNOWN" };

/**
 * Met à jour le mot de passe — appelée depuis la page de réinitialisation,
 * une fois la session de récupération établie via le lien reçu par email.
 */
export async function updatePassword(
  _prevState: UpdatePasswordResult | null,
  formData: FormData
): Promise<UpdatePasswordResult> {
  const password = formData.get("password") as string;

  if (!password || password.length < 8) {
    return { success: false, error: "WEAK_PASSWORD" };
  }

  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "SESSION_EXPIRED" };
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    if (error.message.toLowerCase().includes("password")) {
      return { success: false, error: "WEAK_PASSWORD" };
    }
    console.error("[updatePassword] erreur Supabase Auth:", error);
    return { success: false, error: "UNKNOWN" };
  }

  revalidatePath("/compte", "layout");
  return { success: true };
}

// ─── Logout admin ─────────────────────────────────────────────────────────────

export async function logout(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/admin/login");
}

// ─── Logout client ────────────────────────────────────────────────────────────

export async function logoutCustomer(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

// ─── Suppression compte (droit à l'effacement RGPD) ──────────────────────────

export async function deleteMyAccount(): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/compte/connexion");

  const admin = createAdminClient();

  // Récupérer le customer lié
  const { data: customer } = await admin
    .from("customers")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (customer) {
    // Récupérer les commandes pour anonymiser les données liées
    const { data: orders } = await admin
      .from("orders")
      .select("id")
      .eq("customer_id", customer.id);

    if (orders && orders.length > 0) {
      const orderIds = orders.map((o) => o.id);

      // Anonymiser recipient_pages
      await admin
        .from("recipient_pages")
        .update({
          sender_name: "[supprimé]",
          message: "[supprimé]",
          recipient_first_name: null,
          anonymized_at: new Date().toISOString(),
        })
        .in("order_id", orderIds)
        .is("anonymized_at", null);

      // Anonymiser les adresses et messages dans les commandes
      for (const orderId of orderIds) {
        await admin
          .from("orders")
          .update({
            delivery_address: { anonymized: true },
            sender_name: null,
            recipient_message: null,
          })
          .eq("id", orderId);
      }
    }

    // Anonymiser le customer (conserver la ligne pour les agrégats financiers)
    await admin
      .from("customers")
      .update({
        first_name: null,
        last_name: null,
        email: `[supprimé-${customer.id.slice(0, 8)}]`,
        marketing_consent: false,
        user_id: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", customer.id);
  }

  // Supprimer le compte Supabase Auth
  await admin.auth.admin.deleteUser(user.id);

  // Invalider la session et rediriger
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
