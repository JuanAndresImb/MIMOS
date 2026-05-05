"use client";

import { deleteMyAccount } from "@/actions/auth";

export default function DeleteAccountForm() {
  return (
    <form
      action={deleteMyAccount}
      onSubmit={(e) => {
        if (!confirm("Supprimer définitivement votre compte et toutes vos données personnelles ? Cette action est irréversible.")) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="text-xs underline underline-offset-2 transition-opacity hover:opacity-70"
        style={{ fontFamily: "var(--font-body)", color: "var(--error)" }}
      >
        Supprimer mon compte
      </button>
    </form>
  );
}
