"use client";

import { useActionState } from "react";
import { updateProductStock, toggleProductActive } from "@/actions/admin";

export default function ProductStockForm({
  productId,
  currentStock,
  isActive,
  alertThreshold,
}: {
  productId: string;
  currentStock: number;
  isActive: boolean;
  alertThreshold: number;
}) {
  const [stockError, stockAction, isStockPending] = useActionState(updateProductStock, null);
  const [toggleError, toggleAction, isTogglePending] = useActionState(toggleProductActive, null);

  const isLowStock = currentStock <= alertThreshold;

  return (
    <div className="flex flex-col gap-3">
      {/* Stock */}
      <div>
        <p
          className="text-xs uppercase tracking-widest mb-1"
          style={{
            fontFamily: "var(--font-label)",
            color: isLowStock ? "var(--warning)" : "var(--text-secondary)",
          }}
        >
          Stock {isLowStock && "⚠️"}
        </p>
        <form action={stockAction} className="flex gap-2">
          <input type="hidden" name="productId" value={productId} />
          <input
            type="number"
            name="stock"
            defaultValue={currentStock}
            min={0}
            className="w-20 px-2 py-1.5 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-[var(--primary-500)] text-center"
            style={{ borderColor: "var(--primary-100)", fontFamily: "var(--font-body)" }}
          />
          <button
            type="submit"
            disabled={isStockPending}
            className="flex-1 py-1.5 rounded-lg text-white text-xs font-semibold transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: "var(--primary-500)", fontFamily: "var(--font-body)" }}
          >
            {isStockPending ? "…" : "Mettre à jour"}
          </button>
        </form>
        {stockError && (
          <p className="text-xs mt-1" style={{ color: "var(--error)" }} role="alert">{stockError}</p>
        )}
      </div>

      {/* Toggle actif */}
      <form action={toggleAction}>
        <input type="hidden" name="productId" value={productId} />
        <input type="hidden" name="isActive" value={isActive.toString()} />
        <button
          type="submit"
          disabled={isTogglePending}
          className="w-full py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
          style={{
            fontFamily: "var(--font-body)",
            backgroundColor: isActive ? "#fef2f2" : "#e8faf6",
            color: isActive ? "var(--error)" : "var(--success)",
          }}
        >
          {isTogglePending ? "…" : isActive ? "Désactiver" : "Activer"}
        </button>
        {toggleError && (
          <p className="text-xs mt-1" style={{ color: "var(--error)" }} role="alert">{toggleError}</p>
        )}
      </form>
    </div>
  );
}
