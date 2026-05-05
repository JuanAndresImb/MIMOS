"use client";

import { useActionState } from "react";
import { deleteProduct } from "@/actions/admin";

export default function DeleteProductForm({ productId }: { productId: string }) {
  const [error, formAction, isPending] = useActionState(deleteProduct, null);

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (!confirm("Supprimer ce produit ? S'il a des commandes liées, il sera désactivé à la place.")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="productId" value={productId} />
      <button
        type="submit"
        disabled={isPending}
        className="text-xs font-semibold hover:underline disabled:opacity-50"
        style={{ color: "var(--error)", fontFamily: "var(--font-body)" }}
      >
        {isPending ? "…" : "Supprimer"}
      </button>
      {error && (
        <span className="text-xs ml-2" style={{ color: "var(--error)" }}>{error}</span>
      )}
    </form>
  );
}
