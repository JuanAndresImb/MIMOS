// Mapping des codes événements bpost → libellés FR chaleureux pour la frise de suivi native
// Utilisé dans /compte pour afficher l'expérience de suivi sans renvoyer vers bpost.cloud

export interface ShippingEventDisplay {
  code: string;
  label: string;
  emoji: string;
}

const BPOST_EVENT_LABELS: Record<string, ShippingEventDisplay> = {
  SENT: { code: "SENT", label: "Votre box a été confiée à bpost", emoji: "📦" },
  COLLECTED: { code: "COLLECTED", label: "Colis pris en charge par bpost", emoji: "📦" },
  IN_TRANSIT: { code: "IN_TRANSIT", label: "En route vers vous", emoji: "🚚" },
  ARRIVED_AT_DEPOT: { code: "ARRIVED_AT_DEPOT", label: "Arrivée au centre de tri le plus proche", emoji: "🏭" },
  OUT_FOR_DELIVERY: { code: "OUT_FOR_DELIVERY", label: "En cours de livraison aujourd'hui", emoji: "🚲" },
  AVAILABLE_AT_PICK_UP_POINT: { code: "AVAILABLE_AT_PICK_UP_POINT", label: "Disponible en point relais", emoji: "🏪" },
  DELIVERY_FAILED: { code: "DELIVERY_FAILED", label: "Tentative de livraison infructueuse", emoji: "⚠️" },
  DELIVERED: { code: "DELIVERED", label: "Livrée — bon moment de pause ! 🤍", emoji: "🎁" },
  DELIVERED_AT_DOOR: { code: "DELIVERED_AT_DOOR", label: "Livrée devant la porte — bon moment de pause ! 🤍", emoji: "🎁" },
  DELIVERED_IN_MAILBOX: { code: "DELIVERED_IN_MAILBOX", label: "Livrée dans la boîte aux lettres — bon moment de pause ! 🤍", emoji: "🎁" },
  DELIVERED_AT_PICK_UP_POINT: { code: "DELIVERED_AT_PICK_UP_POINT", label: "Livrée en point relais — bon moment de pause ! 🤍", emoji: "🎁" },
};

const FALLBACK: ShippingEventDisplay = { code: "UNKNOWN", label: "Mise à jour du suivi", emoji: "📍" };

export function getShippingEventDisplay(code: string): ShippingEventDisplay {
  return BPOST_EVENT_LABELS[code] ?? { ...FALLBACK, code };
}

export const DELIVERED_EVENT_CODES = new Set([
  "DELIVERED",
  "DELIVERED_AT_DOOR",
  "DELIVERED_IN_MAILBOX",
  "DELIVERED_AT_PICK_UP_POINT",
]);
