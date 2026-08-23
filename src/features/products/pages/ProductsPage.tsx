import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ProductCard } from "@/features/products/components/ProductCard";
import { CatalogLayout } from "@/layouts/CatalogLayout";
import type { Product } from "@/features/products/types";
import { customerApi } from "@/api/customerApi";
import { catalogProducts } from "@/features/products/data/products";

interface ApiProductRecord {
  id?: string | number;
  product_id?: string | number;
  name?: string;
  title?: string;
  subtitle?: string;
  short_description?: string;
  description?: string;
  price?: number | string;
  amount?: number | string;
  rating?: number | string;
  average_rating?: number | string;
  badge?: string;
  is_bestseller?: boolean;
  is_new?: boolean;
  is_limited_edition?: boolean;
  image?: string;
  image_url?: string;
  imageAlt?: string;
  media?: Array<{ url?: string | null; is_primary?: boolean } | null>;
  images?: Array<{ url?: string | null } | null>;
  category?: { name?: string } | string | null;
}

const defaultImage = "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80";

function normalizeProductRecord(item: ApiProductRecord): Product {
  const productId = String(item.id ?? item.product_id ?? "");
  const productName = item.name ?? item.title ?? "منتج";
  const description = item.subtitle ?? item.short_description ?? item.description ?? "";
  const primaryMedia = Array.isArray(item.media) ? item.media.find((m) => m?.is_primary) ?? item.media[0] : null;
  const firstImage = item.image_url ?? item.image ?? primaryMedia?.url ?? defaultImage;
  const priceValue = Number(item.price ?? item.amount ?? 0);
  const ratingValue = Number(item.rating ?? item.average_rating ?? 4.5);

  let badge: string | undefined;
  if (item.badge) badge = item.badge;
  else if (item.is_bestseller) badge = "الأكثر طلباً";
  else if (item.is_new) badge = "جديد";
  else if (item.is_limited_edition) badge = "حصري";

  return {
    id: productId,
    name: productName,
    subtitle: description || "منتج مميز مصمم بعناية.",
    price: Number.isFinite(priceValue) ? priceValue : 0,
    rating: Number.isFinite(ratingValue) ? ratingValue : 4.5,
    badge,
    image: firstImage || defaultImage,
    imageAlt: (item as any).image_alt ?? productName,
  };
}

function unwrapProductsPayload(payload: unknown): ApiProductRecord[] {
  if (Array.isArray(payload)) return payload as ApiProductRecord[];
  if (!payload || typeof payload !== "object") return [];
  const candidate = payload as Record<string, any>;
  const nested = [candidate.data, candidate.products, candidate.items, candidate.result, candidate.data?.data, candidate.data?.products];
  for (const v of nested) { if (Array.isArray(v)) return v as ApiProductRecord[] }
  return [];
}

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const resp = await customerApi.get('/products');
        const data = resp.data;
        const items = unwrapProductsPayload(data);
        if (items.length > 0) {
          const normalized = items.map(normalizeProductRecord);
          if (mounted) setProducts(normalized.length>0?normalized:catalogProducts);
        } else {
          if (mounted) setProducts(catalogProducts);
        }
      } catch (err) {
        console.warn('Product API not available, using local catalog', err);
        if (mounted) { setProducts(catalogProducts); setError(null) }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    fetchProducts();
    return () => { mounted = false };
  }, []);

  return (
    <CatalogLayout>
      <motion.main initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: 'easeOut' }} dir="rtl" className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
        ) : isLoading ? (
          <div className="flex min-h-[240px] items-center justify-center rounded-2xl border border-[#e5dfd5] bg-[#f8f5f1]">
            <div className="flex items-center gap-3 text-[#4f5f3d]"><div className="h-5 w-5 animate-spin rounded-full border-2 border-[#dfe7d6] border-t-[#4f5f3d]" /><span className="text-sm font-medium">جارٍ تحميل المنتجات...</span></div>
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#d9d0c6] bg-[#faf8f5] p-8 text-center text-[#666a61]">لا توجد منتجات متاحة حالياً.</div>
        ) : (
          <>
            <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.slice(0,3).map((p, i) => <ProductCard key={p.id} product={p} index={i} featured />)}
            </section>
            <section className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.slice(3).map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </section>
          </>
        )}
      </motion.main>
    </CatalogLayout>
  );
}
