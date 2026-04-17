"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

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
  await supabase
    .from("customers")
    .update({
      user_id:           authData.user.id,
      marketing_consent: parsed.data.marketingConsent,
      updated_at:        new Date().toISOString(),
    })
    .eq("email", parsed.data.email);

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
