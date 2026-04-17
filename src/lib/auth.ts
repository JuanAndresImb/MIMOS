import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

/**
 * Vérifie que l'utilisateur est connecté en tant qu'admin.
 * Redirige vers /admin/login si non authentifié.
 */
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/admin/login");
  }

  return user;
}
