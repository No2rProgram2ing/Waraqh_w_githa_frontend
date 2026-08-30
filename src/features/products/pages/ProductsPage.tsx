import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";

import { ProductCard } from "@/features/products/components/ProductCard";
import { CatalogLayout } from "@/layouts/CatalogLayout";
import { useGetCategories, useGetProducts } from "@/features/products/hooks/useProductCatalog";
import type { ProductCategory } from "@/features/products/types";
import { cartApi } from "@/api/cartApi";
import { customerAuthStorage } from "@/features/auth-customer/services/customerAuthStorage";
import { useCartStore, type CartItem } from "@/features/cart/stores/cartStore";

const productPageSize = 9;

interface ApiCartItem {
  id: string | number;
  quantity: number;
  product: {
    id: string | number;
    name: string;
    price: number | string;
    description?: string | null;
    image?: string | null;
  };
}

interface ApiCartResponse {
  data?: {
    items?: ApiCartItem[] | { data?: ApiCartItem[] };
  };
}

function mapCartItems(response: ApiCartResponse): CartItem[] {
  const items = response.data?.items;
  const apiItems = Array.isArray(items) ? items : items?.data ?? [];

  return apiItems.map((item) => ({
    id: String(item.id),
    productId: String(item.product.id),
    name: item.product.name,
    subtitle: item.product.description ?? "",
    price: Number(item.product.price),
    quantity: item.quantity,
    image: item.product.image ?? "",
  }));
}

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category") ?? "all";
  const page = Number(searchParams.get("page") ?? "1") || 1;

  const { data: categories = [], isLoading: categoriesLoading } = useGetCategories();

  const hasExplicitCategory = searchParams.has("category") && selectedCategory !== "all";

  useEffect(() => {
    const hasRemovedFilters =
      searchParams.has("min_price") ||
      searchParams.has("max_price") ||
      searchParams.has("sort") ||
      searchParams.has("sort_by") ||
      searchParams.has("order") ||
      searchParams.has("in_stock") ||
      searchParams.has("available_only") ||
      searchParams.has("is_available");

    if (hasRemovedFilters) {
      setSearchParams((previous) => {
        const next = new URLSearchParams(previous);
        next.delete("min_price");
        next.delete("max_price");
        next.delete("sort");
        next.delete("sort_by");
        next.delete("order");
        next.delete("in_stock");
        next.delete("available_only");
        next.delete("is_available");
        return next;
      }, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const filters = useMemo(
    () => ({
      category_id: hasExplicitCategory ? Number(selectedCategory) : undefined,
      min_price: undefined,
      max_price: undefined,
      in_stock: undefined,
      page: page > 0 ? page : 1,
      per_page: productPageSize,
    }),
    [hasExplicitCategory, page, selectedCategory],
  );

  const { data: productsResponse, isLoading, isError, error, refetch } = useGetProducts(filters);
  const products = productsResponse?.data ?? [];
  const total = productsResponse?.meta?.total ?? products.length;
  const lastPage = productsResponse?.meta?.last_page ?? 1;
  const setCartItems = useCartStore((state) => state.setItems);

  useEffect(() => {
    if (!customerAuthStorage.getToken()) return;

    cartApi.getCart()
      .then((response) => setCartItems(mapCartItems(response as ApiCartResponse)))
      .catch((cartError) => console.error("Failed to load customer cart", cartError));
  }, [setCartItems]);

  const categoryOptions: Array<{ id: string; name: string }> = [
    { id: "all", name: "كل المنتجات" },
    ...categories.map((category: ProductCategory) => ({
      id: String(category.id),
      name: category.name,
    })),
  ];

  const updateSearchParam = (key: string, value: string | null) => {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous);

      if (
        key === "min_price" ||
        key === "max_price" ||
        key === "sort" ||
        key === "sort_by" ||
        key === "order" ||
        key === "in_stock" ||
        key === "available_only" ||
        key === "is_available"
      ) {
        next.delete("min_price");
        next.delete("max_price");
        next.delete("sort");
        next.delete("sort_by");
        next.delete("order");
        next.delete("in_stock");
        next.delete("available_only");
        next.delete("is_available");
        return next;
      }

      if (value === null || value === "" || value === "all") {
        next.delete(key);
      } else {
        next.set(key, value);
      }

      if (key !== "page") {
        next.set("page", "1");
      }

      return next;
    }, { replace: true });
  };

  const handleCategoryChange = (categoryId: string) => {
    updateSearchParam("category", categoryId === "all" ? "all" : categoryId);
  };

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 1 || nextPage > lastPage) {
      return;
    }

    updateSearchParam("page", String(nextPage));
  };

  return (
    <CatalogLayout>
      <motion.main
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        dir="rtl"
        className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8"
      >
        <div className="mb-8">
          <div>
            <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-[#7a7d71]">المتجر</p>
            <h1 className="mt-2 text-[34px] font-extrabold text-[#1d2119]">منتجات ورقة وجذع</h1>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            {categoryOptions.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => handleCategoryChange(category.id)}
                className={`rounded-full border px-3 py-2 text-[12px] font-medium transition-colors ${
                  selectedCategory === category.id
                    ? "border-[#d7cdbd] bg-[#f2ebdf] text-[#2d3329]"
                    : "border-[#e0d9d1] bg-[#f7f4f0] text-[#5b6157] hover:bg-[#efe8df]"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-[20px] border border-[#ece4d9] bg-[#f9f5f0] p-3 text-sm text-[#4f554d]">
          <span>
            {total} منتج
            {categoriesLoading ? " • جاري تحديث الفئات" : ""}
          </span>
        </div>

        {isError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
            <p className="text-lg font-bold">تعذر تحميل المنتجات حالياً</p>
            <p className="mt-2 text-sm text-red-600">
              {(error as Error | null)?.message ?? "يرجى التحقق من اتصال الإنترنت أو محاولة إعادة المحاولة."}
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-4 rounded-full bg-[#4b5d36] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#3d4d2b]"
            >
              إعادة المحاولة
            </button>
          </div>
        ) : isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="overflow-hidden rounded-[20px] border border-[#e5dfd5] bg-[#f8f5f1]">
                <div className="h-[300px] animate-pulse bg-[#efe8df]" />
                <div className="space-y-3 p-4">
                  <div className="h-4 w-20 animate-pulse rounded-full bg-[#ece3d8]" />
                  <div className="h-6 w-2/3 animate-pulse rounded-full bg-[#ece3d8]" />
                  <div className="h-4 w-full animate-pulse rounded-full bg-[#ece3d8]" />
                  <div className="h-4 w-1/2 animate-pulse rounded-full bg-[#ece3d8]" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#d9d0c6] bg-[#faf8f5] p-8 text-center text-[#666a61]">
            لا توجد منتجات متاحة حالياً.
          </div>
        ) : (
          <>
            <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} featured={index < 3} />
              ))}
            </section>

            {lastPage > 1 ? (
              <div className="mt-10 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 1}
                  className="rounded-full border border-[#dfd5c7] bg-white px-4 py-2 text-sm font-medium text-[#46513e] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  السابق
                </button>
                <span className="rounded-full bg-[#f2ebdf] px-3 py-2 text-sm font-semibold text-[#3b4337]">
                  {page} / {lastPage}
                </span>
                <button
                  type="button"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= lastPage}
                  className="rounded-full border border-[#dfd5c7] bg-white px-4 py-2 text-sm font-medium text-[#46513e] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  التالي
                </button>
              </div>
            ) : null}
          </>
        )}
      </motion.main>
    </CatalogLayout>
  );
}
