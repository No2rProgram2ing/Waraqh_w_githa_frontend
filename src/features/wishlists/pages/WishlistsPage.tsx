import { motion } from "framer-motion";
import { AccountLayout } from "@/layouts/AccountLayout";
import { WishlistCard } from "@/features/wishlists/components/WishlistCard";
import { useWishlist } from "@/features/wishlists/hooks/useWishlist";

export function WishlistsPage() {
  const { items, isLoading, isError, error, refetch, toggleFavorite, isToggling } = useWishlist();

  const handleRemove = async (productId: string) => {
    await toggleFavorite(productId);
  };

  const renderContent = () => {
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
    <AccountLayout>
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="flex flex-col gap-6"
        dir="rtl"
      >
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-[28px] font-extrabold text-[#1d2218]">قائمة المفضلات</h1>
          {!isLoading && !isError ? (
            <span className="rounded-full border border-[#dacfbf] bg-[#f3efe9] px-3 py-1.5 text-[12px] font-medium text-[#4f5f3d]">
              {items.length} عناصر
            </span>
          ) : null}
        </div>

        {renderContent()}
      </motion.section>
    </AccountLayout>
  );
}
