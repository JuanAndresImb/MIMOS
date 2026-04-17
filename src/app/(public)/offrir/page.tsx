import { redirect } from "next/navigation";

// Hub `/offrir` — redirige vers l'accueil
// L'entrée principale est via le dropdown navbar (Story 2.2)
export default function OffrirHub() {
  redirect("/");
}
