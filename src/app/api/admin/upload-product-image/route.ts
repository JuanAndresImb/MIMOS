import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 2 * 1024 * 1024; // 2 MB

export async function POST(req: Request) {
  // Auth check
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const productId = (formData.get("productId") as string | null) ?? "tmp";

  if (!file) return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Format non supporté (JPG, PNG ou WebP uniquement)" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Fichier trop lourd (max 2 Mo)" }, { status: 400 });
  }

  const ext = file.name.split(".").pop() ?? "jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const path = `${productId}/${filename}`;

  const admin = createAdminClient();
  const { error } = await admin.storage
    .from("products")
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) {
    return NextResponse.json({ error: "Erreur upload: " + error.message }, { status: 500 });
  }

  const { data: { publicUrl } } = admin.storage.from("products").getPublicUrl(path);

  return NextResponse.json({ url: publicUrl });
}
