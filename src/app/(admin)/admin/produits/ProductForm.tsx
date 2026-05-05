"use client";

import { useActionState, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { OCCASIONS_LIST } from "@/data/occasions";
import type { Database } from "@/lib/supabase/database.types";

type Product = Database["public"]["Tables"]["products"]["Row"];

const ALL_ALLERGENS = [
  { key: "gluten",      label: "Gluten" },
  { key: "crustaceans", label: "Crustacés" },
  { key: "eggs",        label: "Œufs" },
  { key: "fish",        label: "Poisson" },
  { key: "peanuts",     label: "Arachides" },
  { key: "soybeans",    label: "Soja" },
  { key: "milk",        label: "Lait" },
  { key: "nuts",        label: "Fruits à coque" },
  { key: "celery",      label: "Céleri" },
  { key: "mustard",     label: "Moutarde" },
  { key: "sesame",      label: "Sésame" },
  { key: "sulphites",   label: "Sulfites" },
  { key: "lupin",       label: "Lupin" },
  { key: "molluscs",    label: "Mollusques" },
];

interface Props {
  product?: Product;
  action: (prevState: string | null, formData: FormData) => Promise<string | null>;
}

const inputClass = "w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-[var(--primary-500)]";
const inputStyle = { borderColor: "var(--primary-100)", fontFamily: "var(--font-body)", color: "var(--text-primary)" };
const labelStyle = { fontFamily: "var(--font-body)", color: "var(--text-primary)" };

export default function ProductForm({ product, action }: Props) {
  const [error, formAction, isPending] = useActionState(action, null);

  const existingImages = Array.isArray(product?.images)
    ? (product.images as string[])
    : [];

  const [photos, setPhotos] = useState<string[]>(existingImages);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const remaining = 5 - photos.length;
    const toUpload = files.slice(0, remaining);
    if (toUpload.length === 0) {
      setUploadError("Maximum 5 photos atteint");
      return;
    }

    setUploading(true);
    setUploadError(null);

    const newUrls: string[] = [];
    for (const file of toUpload) {
      const fd = new FormData();
      fd.append("file", file);
      if (product?.id) fd.append("productId", product.id);

      const res = await fetch("/api/admin/upload-product-image", { method: "POST", body: fd });
      const json = await res.json() as { url?: string; error?: string };

      if (!res.ok || !json.url) {
        setUploadError(json.error ?? "Erreur d'upload");
        break;
      }
      newUrls.push(json.url);
    }

    setPhotos((prev) => [...prev, ...newUrls]);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removePhoto(url: string) {
    setPhotos((prev) => prev.filter((u) => u !== url));
  }

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {product && <input type="hidden" name="productId" value={product.id} />}

      {/* Photos */}
      <div>
        <p className="text-sm font-semibold mb-3" style={labelStyle}>
          Photos du produit <span style={{ color: "var(--text-secondary)", fontWeight: 400 }}>(max 5 — JPG, PNG, WebP, 2 Mo max)</span>
        </p>

        {/* Thumbnails */}
        {photos.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-3">
            {photos.map((url) => (
              <div key={url} className="relative w-20 h-20 rounded-xl overflow-hidden" style={{ border: "1px solid var(--primary-100)" }}>
                <Image src={url} alt="" fill className="object-cover" sizes="80px" />
                <button
                  type="button"
                  onClick={() => removePhoto(url)}
                  className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full text-white text-xs flex items-center justify-center"
                  style={{ backgroundColor: "var(--error)" }}
                  aria-label="Supprimer"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Hidden inputs carrying URLs */}
        {photos.map((url) => (
          <input key={url} type="hidden" name="imageUrls" value={url} />
        ))}

        {photos.length < 5 && (
          <label
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm cursor-pointer transition-colors hover:bg-[var(--primary-100)]"
            style={{ border: "1px dashed var(--primary-300)", fontFamily: "var(--font-body)", color: "var(--primary-700)" }}
          >
            <span>{uploading ? "Upload en cours…" : "+ Ajouter une photo"}</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="sr-only"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </label>
        )}

        {uploadError && (
          <p className="mt-2 text-xs" style={{ color: "var(--error)", fontFamily: "var(--font-body)" }}>{uploadError}</p>
        )}
      </div>

      {/* Nom */}
      <div>
        <label className="block text-sm font-semibold mb-1.5" style={labelStyle}>
          Nom du produit *
        </label>
        <input
          name="name"
          required
          defaultValue={product?.name ?? ""}
          placeholder="MIMOS"
          className={inputClass}
          style={inputStyle}
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold mb-1.5" style={labelStyle}>
          Description
        </label>
        <textarea
          name="description"
          rows={3}
          defaultValue={product?.description ?? ""}
          placeholder="Brownies artisanaux belges…"
          className={`${inputClass} resize-y`}
          style={inputStyle}
        />
      </div>

      {/* Prix + Stock */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={labelStyle}>
            Prix (€ TVA incl.) *
          </label>
          <input
            name="priceEuros"
            type="number"
            step="0.01"
            min="0.01"
            required
            defaultValue={product ? (product.price_cents / 100).toFixed(2) : "35.00"}
            className={inputClass}
            style={inputStyle}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={labelStyle}>
            Stock *
          </label>
          <input
            name="stock"
            type="number"
            min="0"
            required
            defaultValue={product?.stock ?? 100}
            className={inputClass}
            style={inputStyle}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={labelStyle}>
            Seuil alerte
          </label>
          <input
            name="alertThreshold"
            type="number"
            min="0"
            defaultValue={product?.stock_alert_threshold ?? 5}
            className={inputClass}
            style={inputStyle}
          />
        </div>
      </div>

      {/* Occasions */}
      <div>
        <p className="text-sm font-semibold mb-3" style={labelStyle}>
          Occasions associées *
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {OCCASIONS_LIST.map((occ) => (
            <label
              key={occ.slug}
              className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors hover:bg-[var(--primary-50)]"
              style={{ border: "1px solid var(--primary-100)" }}
            >
              <input
                type="checkbox"
                name="occasions"
                value={occ.slug}
                defaultChecked={product?.occasion_slugs.includes(occ.slug) ?? false}
                className="accent-[var(--primary-500)]"
              />
              <span className="text-sm" style={{ fontFamily: "var(--font-body)", color: "var(--text-primary)" }}>
                {occ.nom}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Allergènes */}
      <div>
        <p className="text-sm font-semibold mb-3" style={labelStyle}>
          Allergènes présents dans ce produit
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {ALL_ALLERGENS.map((a) => (
            <label
              key={a.key}
              className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors hover:bg-[var(--primary-50)]"
              style={{ border: "1px solid var(--primary-100)" }}
            >
              <input
                type="checkbox"
                name="allergens"
                value={a.key}
                defaultChecked={product?.allergens.includes(a.key) ?? false}
                className="accent-[var(--primary-500)]"
              />
              <span className="text-xs" style={{ fontFamily: "var(--font-body)", color: "var(--text-primary)" }}>
                {a.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {error && (
        <p
          className="text-sm px-4 py-3 rounded-xl"
          style={{ backgroundColor: "#fef2f2", color: "var(--error)", fontFamily: "var(--font-body)" }}
          role="alert"
        >
          {error}
        </p>
      )}

      <div className="flex gap-3 pt-2">
        <Link
          href="/admin/produits"
          className="flex-1 py-3 rounded-full text-center text-sm font-semibold transition-colors hover:bg-[var(--primary-100)]"
          style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)", border: "1px solid var(--primary-100)" }}
        >
          Annuler
        </Link>
        <button
          type="submit"
          disabled={isPending || uploading}
          className="flex-1 py-3 rounded-full text-white text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: "var(--primary-500)", fontFamily: "var(--font-body)" }}
        >
          {isPending ? "…" : product ? "Mettre à jour" : "Créer le produit"}
        </button>
      </div>
    </form>
  );
}
