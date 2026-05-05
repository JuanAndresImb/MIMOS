import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatPriceCents } from "@/lib/utils";
import ProductStockForm from "./ProductStockForm";
import DeleteProductForm from "./DeleteProductForm";

export default async function ProduitsPage() {
  await requireAdmin();

  const supabase = createAdminClient();
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1
          className="text-2xl font-black"
          style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
        >
          Produits
        </h1>
        <Link
          href="/admin/produits/nouveau"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ backgroundColor: "var(--primary-500)", fontFamily: "var(--font-body)" }}
        >
          + Nouveau produit
        </Link>
      </div>

      <div className="flex flex-col gap-4">
        {(products ?? []).map((product) => (
          <div
            key={product.id}
            className="rounded-2xl p-5"
            style={{
              backgroundColor: "white",
              border: `1px solid ${product.is_active ? "var(--primary-100)" : "var(--error)"}`,
              opacity: product.is_active ? 1 : 0.65,
            }}
          >
            <div className="flex flex-wrap items-start gap-6">
              {/* Infos produit */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h2
                    className="text-base font-bold"
                    style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
                  >
                    {product.name}
                  </h2>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{
                      fontFamily: "var(--font-label)",
                      backgroundColor: product.is_active ? "#e8faf620" : "#fef2f2",
                      color: product.is_active ? "var(--success)" : "var(--error)",
                    }}
                  >
                    {product.is_active ? "Actif" : "Inactif"}
                  </span>
                </div>
                <p className="text-sm mb-2" style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}>
                  {product.description?.slice(0, 100)}
                </p>
                <p className="text-base font-black" style={{ fontFamily: "var(--font-display)", color: "var(--primary-500)" }}>
                  {formatPriceCents(product.price_cents)}
                </p>
                <p className="text-xs mt-1" style={{ fontFamily: "var(--font-label)", color: "var(--text-secondary)" }}>
                  Occasions : {product.occasion_slugs.join(", ") || "—"}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-3 mt-3">
                  <Link
                    href={`/admin/produits/${product.id}`}
                    className="text-xs font-semibold hover:underline"
                    style={{ color: "var(--primary-500)", fontFamily: "var(--font-body)" }}
                  >
                    Modifier
                  </Link>
                  <DeleteProductForm productId={product.id} />
                </div>
              </div>

              {/* Formulaire stock */}
              <div className="shrink-0 w-52">
                <ProductStockForm
                  productId={product.id}
                  currentStock={product.stock}
                  isActive={product.is_active}
                  alertThreshold={product.stock_alert_threshold}
                />
              </div>
            </div>
          </div>
        ))}
        {!products?.length && (
          <div
            className="rounded-2xl p-10 text-center"
            style={{ backgroundColor: "white", border: "1px solid var(--primary-100)" }}
          >
            <p className="text-sm mb-4" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
              Aucun produit. Commencez par en créer un.
            </p>
            <Link
              href="/admin/produits/nouveau"
              className="inline-flex items-center px-5 py-2.5 rounded-full text-white text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ backgroundColor: "var(--primary-500)", fontFamily: "var(--font-body)" }}
            >
              + Nouveau produit
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
