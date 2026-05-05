"use client";

import { useState } from "react";

interface Props {
  defaultFrom: string;
  defaultTo: string;
}

export default function ExportForm({ defaultFrom, defaultTo }: Props) {
  const [from, setFrom] = useState(defaultFrom);
  const [to, setTo] = useState(defaultTo);

  const exportUrl = `/api/admin/export/factures?from=${from}&to=${to}`;

  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="flex flex-col gap-1">
        <label
          htmlFor="export-from"
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ fontFamily: "var(--font-label)", color: "var(--text-secondary)" }}
        >
          Du
        </label>
        <input
          id="export-from"
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="rounded-xl px-3 py-2 text-sm outline-none focus:ring-2"
          style={{
            border: "1px solid var(--primary-200)",
            fontFamily: "var(--font-body)",
            color: "var(--text-primary)",
          }}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label
          htmlFor="export-to"
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ fontFamily: "var(--font-label)", color: "var(--text-secondary)" }}
        >
          Au
        </label>
        <input
          id="export-to"
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="rounded-xl px-3 py-2 text-sm outline-none focus:ring-2"
          style={{
            border: "1px solid var(--primary-200)",
            fontFamily: "var(--font-body)",
            color: "var(--text-primary)",
          }}
        />
      </div>
      <a
        href={exportUrl}
        download
        className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-white text-sm font-semibold transition-opacity hover:opacity-90"
        style={{ backgroundColor: "var(--primary-500)", fontFamily: "var(--font-body)" }}
      >
        ↓ Télécharger CSV
      </a>
    </div>
  );
}
