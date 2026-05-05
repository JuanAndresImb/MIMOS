import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { createProduct } from "@/actions/admin";
import ProductForm from "../ProductForm";

export const metadata: Metadata = { title: "Nouveau produit — Admin" };

export default async function NouveauProduitPage() {
  await requireAdmin();

  return (
    <div>
      <h1
        className="text-2xl font-black mb-8"
        style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
      >
        Nouveau produit
      </h1>

      <div
        className="rounded-2xl p-6"
        style={{ backgroundColor: "white", border: "1px solid var(--primary-100)", maxWidth: "48rem" }}
      >
        <ProductForm action={createProduct} />
      </div>
    </div>
  );
}
