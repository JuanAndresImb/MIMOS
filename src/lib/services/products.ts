import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";
export { formatPriceCents } from "@/lib/utils";

export type Product = Database["public"]["Tables"]["products"]["Row"];

/**
 * Récupère le produit actif pour une occasion donnée.
 * Retourne `null` si aucun produit n'est configuré — la page se dégrade gracieusement.
 * Appelé côté serveur uniquement (Server Component / generateMetadata).
 */
export async function getProductByOccasion(
  occasionSlug: string
): Promise<Product | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .contains("occasion_slugs", [occasionSlug])
    .eq("is_active", true)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    // Log en production — capturé par Sentry via instrumentation.ts
    console.error("[getProductByOccasion] Supabase error:", error.message);
    return null;
  }

  return data;
}

/**
 * Récupère tous les produits actifs, triés du moins au plus cher.
 */
export async function getAllActiveProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("price_cents", { ascending: true });

  if (error) {
    console.error("[getAllActiveProducts] Supabase error:", error.message);
    return [];
  }
  return data ?? [];
}

/**
 * Récupère un produit actif par son ID.
 */
export async function getProductById(id: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error("[getProductById] Supabase error:", error.message);
    return null;
  }
  return data;
}
