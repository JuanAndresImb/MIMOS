"use client";

import { useActionState, useState } from "react";
import { updateOrderStatus } from "@/actions/admin";

const STATUSES = [
  { value: "pending",   label: "En attente" },
  { value: "paid",      label: "Payée" },
  { value: "preparing", label: "En préparation" },
  { value: "shipped",   label: "Expédiée" },
  { value: "delivered", label: "Livrée" },
  { value: "cancelled", label: "Annulée" },
];

export default function OrderStatusForm({
  orderId,
  currentStatus,
  currentTrackingNumber,
}: {
  orderId: string;
  currentStatus: string;
  currentTrackingNumber?: string | null;
}) {
  const [error, formAction, isPending] = useActionState(updateOrderStatus, null);
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);

  const isShipping = selectedStatus === "shipped";

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="orderId" value={orderId} />

      <select
        name="status"
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
        className="w-full px-3 py-2 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
        style={{
          fontFamily: "var(--font-body)",
          borderColor: "var(--primary-100)",
          color: "var(--text-primary)",
        }}
      >
        {STATUSES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>

      {/* Champ numéro de suivi — obligatoire uniquement quand on passe en "Expédiée" */}
      {isShipping && (
        <div>
          <label
            htmlFor="trackingNumber"
            className="block text-xs font-medium mb-1"
            style={{ fontFamily: "var(--font-body)", color: "var(--text-primary)" }}
          >
            Numéro de suivi bpost
            <span className="ml-0.5" style={{ color: "var(--error)" }} aria-hidden>*</span>
          </label>
          <input
            id="trackingNumber"
            name="trackingNumber"
            type="text"
            defaultValue={currentTrackingNumber ?? ""}
            placeholder="323100000000000000"
            required
            className="w-full px-3 py-2 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
            style={{
              fontFamily: "var(--font-body)",
              borderColor: "var(--primary-100)",
              color: "var(--text-primary)",
            }}
          />
          <p
            className="text-xs mt-1"
            style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}
          >
            L&apos;acheteur recevra automatiquement un email avec le lien de suivi bpost.
          </p>
        </div>
      )}

      {error && (
        <p className="text-xs" style={{ color: "var(--error)", fontFamily: "var(--font-body)" }} role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-2 rounded-full text-white text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-50"
        style={{ backgroundColor: "var(--primary-500)", fontFamily: "var(--font-body)" }}
      >
        {isPending ? "Mise à jour…" : "Enregistrer"}
      </button>
    </form>
  );
}
