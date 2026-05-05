import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { updateProduct } from "@/actions/admin";
import ProductForm from "../ProductForm";

export const metadata: Metadata = { title: "Modifier produit — Admin" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProduitPage({ params }: Props) {
  await requireAdmin();

  const { id } = await params;
  const supabase = createAdminClient();
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!product) notFound();

  return (
    <div>
      <h1
        className="text-2xl font-black mb-8"
        style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
      >
        Modifier — {product.name}
      </h1>

      <div
        className="rounded-2xl p-6"
        style={{ backgroundColor: "white", border: "1px solid var(--primary-100)", maxWidth: "48rem" }}
      >
        <ProductForm product={product} action={updateProduct} />
      </div>
    </div>
  );
}
