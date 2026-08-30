import { motion } from "framer-motion";
import { useEffect } from "react";
import { AccountLayout } from "@/layouts/AccountLayout";
import { WishlistCard } from "@/features/wishlists/components/WishlistCard";
import { useWishlist } from "@/features/wishlists/hooks/useWishlist";
import { useCustomerAuthStore } from "@/features/auth-customer/stores/customerAuthStore";
import { ROUTES } from "@/routes/paths";
import { Link } from "react-router-dom";
import { cartApi } from "@/api/cartApi";
import { useCartStore, type CartItem } from "@/features/cart/stores/cartStore";
import { customerAuthStorage } from "@/features/auth-customer/services/customerAuthStorage";

interface ApiCartItem {
  id: string | number;
  quantity: number;
  product: { id: string | number; name: string; price: number | string; description?: string | null; image?: string | null };
}

function mapCartItems(response: { data?: { items?: ApiCartItem[] | { data?: ApiCartItem[] } } }): CartItem[] {
  const items = response.data?.items;
  const apiItems = Array.isArray(items) ? items : items?.data ?? [];
  return apiItems.map((item) => ({
    id: String(item.id), productId: String(item.product.id), name: item.product.name,
    subtitle: item.product.description ?? "", price: Number(item.product.price),
    quantity: item.quantity, image: item.product.image ?? "",
  }));
}

export function WishlistsPage() {
  const isAuthenticated = useCustomerAuthStore((state) => state.isAuthenticated);
  const { items = [], isLoading, isError, error, refetch, toggleFavorite, isToggling } = useWishlist(isAuthenticated);
  const setCartItems = useCartStore((state) => state.setItems);

  useEffect(() => {
    if (!isAuthenticated || !customerAuthStorage.getToken()) return;
    cartApi.getCart()
      .then((response) => setCartItems(mapCartItems(response)))
      .catch((cartError) => console.error("Failed to load customer cart", cartError));
  }, [isAuthenticated, setCartItems]);

  const handleRemove = async (productId: string) => {
    await toggleFavorite(productId);
  };

  const renderContent = () => {
    if (!isAuthenticated) {
      return (
        <div className="rounded-[24px] border border-[#e9e0d5] bg-[#f8f5f1] p-8 text-center shadow-sm sm:p-12">
          <p className="text-[28px] font-extrabold text-[#1d2218]">قائمة المفضلات</p>
          <p className="mt-4 text-[15px] leading-8 text-[#5d645b]">
            لتتمكن من مشاهدة منتجاتك المفضلة، عليك تسجيل الدخول إلى حسابك أولاً.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to={ROUTES.login}
              className="rounded-full bg-[#4f5f3d] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#3d4d2c]"
            >
              تسجيل الدخول
            </Link>
            <Link
              to={ROUTES.products}
              className="rounded-full border border-[#d9d0c2] bg-white px-6 py-3 text-sm font-semibold text-[#1d2218] transition hover:bg-[#f3efe9]"
            >
              تصفح المنتجات
            </Link>
          </div>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="flex min-h-[220px] items-center justify-center rounded-[20px] border border-[#e9e0d5] bg-[#f6f1ea] text-[#4f5f3d]">
          <div className="flex items-center gap-3">
            <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-[#c5ceb1] border-t-[#4f5f3d]" />
            <span>جارٍ تحميل قائمة المفضلات...</span>
          </div>
        </div>
      );
    }

    if (isError) {
      const message = error instanceof Error ? error.message : "تعذر تحميل قائمة المفضلات.";

      return (
        <div className="rounded-[20px] border border-[#e9e0d5] bg-[#f6f1ea] p-8 text-center text-[#1d2218]">
          <p className="mb-4 text-[18px] font-bold">لم نتمكن من تحميل قائمة المفضلات</p>
          <p className="mb-6 text-[14px] text-[#5d645b]">{message}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-full bg-[#4f5f3d] px-4 py-2 text-[13px] font-medium text-white"
          >
            إعادة المحاولة
          </button>
        </div>
      );
    }

    if (items.length === 0) {
      return (
        <div className="rounded-[20px] border border-dashed border-[#d9d0c2] bg-[#f8f5f1] p-10 text-center">
          <p className="text-[20px] font-bold text-[#1d2218]">لا توجد عناصر في المفضلة</p>
          <p className="mt-2 text-[14px] text-[#5d645b]">ابدأ بإضافة المنتجات التي تعجبك إلى قائمة المفضلات.</p>
        </div>
      );
    }

    return (
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item, index) => (
          <WishlistCard
            key={item.id}
            item={item}
            index={index}
            onRemove={handleRemove}
            isRemoving={isToggling}
          />
        ))}
      </div>
    );
  };

  return (
    <AccountLayout hideSidebar={!isAuthenticated}>
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="flex flex-col gap-6"
        dir="rtl"
      >
        {isAuthenticated ? (
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-[28px] font-extrabold text-[#1d2218]">قائمة المفضلات</h1>
            {!isLoading && !isError ? (
              <span className="rounded-full border border-[#dacfbf] bg-[#f3efe9] px-3 py-1.5 text-[12px] font-medium text-[#4f5f3d]">
                {items.length} عناصر
              </span>
            ) : null}
          </div>
        ) : null}

        {renderContent()}
      </motion.section>
    </AccountLayout>
  );
}
