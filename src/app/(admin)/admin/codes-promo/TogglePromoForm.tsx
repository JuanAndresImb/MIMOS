"use client";

import { useActionState } from "react";
import { togglePromoCode } from "@/actions/admin";

export default function TogglePromoForm({
  id,
  isActive,
}: {
  id: string;
  isActive: boolean;
}) {
  const [, formAction, isPending] = useActionState(togglePromoCode, null);

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="isActive" value={isActive.toString()} />
      <button
        type="submit"
        disabled={isPending}
        className="text-xs px-2 py-1 rounded-lg font-semibold transition-colors disabled:opacity-50"
        style={{
          fontFamily: "var(--font-body)",
          backgroundColor: isActive ? "#fef2f2" : "#e8faf6",
          color: isActive ? "var(--error)" : "var(--success)",
        }}
      >
        {isPending ? "…" : isActive ? "Désactiver" : "Activer"}
      </button>
    </form>
  );
}
