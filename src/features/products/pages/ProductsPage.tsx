import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { ProductCard } from "@/features/products/components/ProductCard";
import { CatalogLayout } from "@/layouts/CatalogLayout";
import type { Product } from "@/features/products/types";
import { customerApiBase } from "@/api/customerApi";
import { customerAuthStorage } from "@/features/auth-customer/services/customerAuthStorage";

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
  imageUrl?: string;
  image_alt?: string;
  media?: Array<{ url?: string | null; is_primary?: boolean } | null>;
  images?: Array<{ url?: string | null } | null>;
  category?: { name?: string } | string | null;
}

const defaultImage = "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80";

const fallbackProducts: Product[] = [
  {
    id: "mock-1",
    name: "طقم سلة يدوية",
    subtitle: "مجموعة فاخرة من السلال الطبيعية مع لمسات يدويّة أنيقة وملاءمة مثالية للديكور العصري.",
    price: 390,
    rating: 4.8,
    badge: "الأكثر طلباً",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
    imageAlt: "طقم سلال يدوي",
  },
  {
    id: "mock-2",
    name: "أريكة ريفية",
    subtitle: "تشكيلة مريحة وبنية صناعية هادئة مستوحاة من فخامة المنازل التقليدية في اليمن.",
    price: 520,
    rating: 4.9,
    badge: "حصري",
    image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80",
    imageAlt: "أريكة ريفية",
  },
  {
    id: "mock-3",
    name: "مقعد خيزران",
    subtitle: "تصميم مستوحى من الحرف اليدوية اليمنية، بلمسة معاصرة وراحة يومية مريحة.",
    price: 480,
    rating: 4.7,
    badge: "جديد",
    image: "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=900&q=80",
    imageAlt: "مقعد خيزران",
  },
  {
    id: "mock-4",
    name: "مصباح خشبي",
    subtitle: "إضاءة دافئة تضيف جوّاً مريحاً في كل زاوية منزلية مع لمسة تراثية أنيقة.",
    price: 420,
    rating: 4.6,
    badge: "مميز",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
    imageAlt: "مصباح خشبي",
  },
  {
    id: "mock-5",
    name: "طاولة قهوة بتصميم عربي",
    subtitle: "طاولة قهوة عملية ومريحة بلمسة تركيبيّة عربية أنيقة تضيف دفئاً للغرفة.",
    price: 610,
    rating: 4.8,
    badge: "مميز",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80",
    imageAlt: "طاولة قهوة عربية",
  },
  {
    id: "mock-6",
    name: "خزانة خشبية متخصصة",
    subtitle: "تنسيق فني يوازن بين الوظيفة والديكور، مصمم ليُكمل أجواء المنزل اليمني العصري.",
    price: 880,
    rating: 4.9,
    badge: "حصري",
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80",
    imageAlt: "خزانة خشبية",
  },
];

const categories = ["كل المنتجات", "سلال", "أثاث", "ديكور", "إضاءة"];

function normalizeProductRecord(item: ApiProductRecord): Product {
  const productId = String(item.id ?? item.product_id ?? "");
  const productName = item.name ?? item.title ?? "منتج";
  const description = item.subtitle ?? item.short_description ?? item.description ?? "";
  const primaryMedia = Array.isArray(item.media) ? item.media.find((media) => media?.is_primary) ?? item.media[0] : null;
  const firstImage = item.image_url ?? item.image ?? item.imageUrl ?? primaryMedia?.url ?? item.images?.[0]?.url ?? defaultImage;

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
    imageAlt: item.image_alt ?? productName,
  };
}

function unwrapProductsPayload(payload: unknown): ApiProductRecord[] {
  if (Array.isArray(payload)) return payload as ApiProductRecord[];
  if (!payload || typeof payload !== "object") return [];

  const candidate = payload as Record<string, unknown>;
  const nestedValues = [candidate.data, candidate.products, candidate.items, candidate.result, candidate.data?.data, candidate.data?.products];

  for (const value of nestedValues) {
    if (Array.isArray(value)) return value as ApiProductRecord[];
  }

  return [];
}

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const token = customerAuthStorage.getToken();
        const baseUrl = customerApiBase.replace(/\/+$/, "");
        const endpoints = [`${baseUrl}/products`];

        let lastError: unknown;

        for (const endpoint of endpoints) {
          try {
            const { data } = await axios.get(endpoint, {
              headers: token ? { Authorization: `Bearer ${token}` } : {},
            });

            const items = unwrapProductsPayload(data);

            if (items.length > 0 || (data && typeof data === "object" && Object.keys(data as Record<string, unknown>).length > 0)) {
              const normalized = items.map((item) => normalizeProductRecord(item));
              if (isMounted) {
                setProducts(normalized.length > 0 ? normalized : fallbackProducts);
              }
              return;
            }
          } catch (requestError) {
            lastError = requestError;
          }
        }

        if (lastError) {
          console.warn("Using fallback product data because the API request failed.", lastError);
        }

        if (isMounted) {
          setProducts(fallbackProducts);
          setError(null);
        }
      } catch (fetchError) {
        console.error("Failed to fetch products:", fetchError);
        if (isMounted) {
          setProducts(fallbackProducts);
          setError(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <CatalogLayout>
      <motion.main
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        dir="rtl"
        className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8"
      >
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-[#7a7d71]">المتجر</p>
            <h1 className="mt-2 text-[34px] font-extrabold text-[#1d2119]">منتجات ورقة وجذع</h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {categories.map((category, index) => (
              <button
                key={category}
                type="button"
                className={`rounded-full border px-3 py-2 text-[12px] font-medium transition-colors ${
                  index === 0
                    ? "border-[#d7cdbd] bg-[#f2ebdf] text-[#2d3329]"
                    : "border-[#e0d9d1] bg-[#f7f4f0] text-[#5b6157] hover:bg-[#efe8df]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
        ) : isLoading ? (
          <div className="flex min-h-[240px] items-center justify-center rounded-2xl border border-[#e5dfd5] bg-[#f8f5f1]">
            <div className="flex items-center gap-3 text-[#4f5f3d]">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#dfe7d6] border-t-[#4f5f3d]" />
              <span className="text-sm font-medium">جارٍ تحميل المنتجات...</span>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#d9d0c6] bg-[#faf8f5] p-8 text-center text-[#666a61]">
            لا توجد منتجات متاحة حالياً.
          </div>
        ) : (
          <>
            <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.slice(0, 3).map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} featured />
              ))}
            </section>

            <section className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.slice(3).map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </section>
          </>
        )}
      </motion.main>
    </CatalogLayout>
  );
}
