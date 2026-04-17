import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Formate un prix en centimes → chaîne euro lisible. Ex : 2950 → "29,50 €" */
export function formatPriceCents(cents: number): string {
  return new Intl.NumberFormat("fr-BE", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}
