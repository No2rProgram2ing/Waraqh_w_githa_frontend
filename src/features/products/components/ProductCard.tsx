import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import type { Product } from "@/features/products/types";
import { HeartIcon, ShoppingBagIcon } from "@/components/ui/icons";
import { favoritesApi } from "@/api/favoritesApi";
import { cartApi } from "@/api/cartApi";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { formatCurrency } from '@/lib/currency'
import { ROUTES } from '@/routes/paths';

interface ProductCardProps {
  product: Product;
  index: number;
  featured?: boolean;
}

export function ProductCard({ product, index, featured = false }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isCartLoading, setIsCartLoading] = useState(false);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);

  const handleAddToCart = async () => {
    if (isCartLoading) return;

    try {
      setIsCartLoading(true);
      await cartApi.addToCart(product.id);

      // Update local cart store for immediate UX
      try {
        const addItem = (await import('@/features/cart/stores/cartStore')).useCartStore.getState().addItem;
        addItem({ id: String(product.id), name: product.name ?? '', subtitle: product.subtitle ?? product.description ?? '', price: Number(product.price ?? 0), image: product.image ?? product.imageUrl ?? '' });
      } catch (e) {
        // If importing store fails, fall back silently — the server cart still has the item.
        console.warn('Failed to update local cart store', e);
      }

      showSuccessToast("تمت إضافة المنتج إلى السلة");
    } catch (error) {
      console.error(error);
      showErrorToast("تعذر إضافة المنتج إلى السلة، يرجى المحاولة مرة أخرى.");
    } finally {
      setIsCartLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (isFavoriteLoading) return;

    try {
      setIsFavoriteLoading(true);
      const favoriteState = await favoritesApi.toggleFavorite(product.id);
      setIsFavorite(favoriteState);
      showSuccessToast(
        favoriteState ? "تمت إضافة المنتج إلى المفضلة" : "تمت إزالة المنتج من المفضلة",
      );
    } catch (error) {
      console.error(error);
      showErrorToast("تعذر تحديث قائمة المفضلة، يرجى المحاولة مرة أخرى.");
    } finally {
      setIsFavoriteLoading(false);
    }
  };
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className={`group overflow-hidden rounded-[20px] border border-[#e5dfd5] bg-[#f8f5f1] shadow-[0_14px_24px_-18px_rgba(48,54,38,0.28)] ${featured ? "min-h-[420px]" : "min-h-[370px]"}`}
    >
      <div className="relative overflow-hidden">
        <motion.img
          src={product.image}
          alt={product.imageAlt}
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="h-[300px] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />

        <div className="absolute inset-x-3 top-3 flex items-center justify-between gap-2">
          <button
            type="button"
            aria-label={isFavorite ? `إزالة ${product.name} من المفضلة` : `إضافة ${product.name} إلى المفضلة`}
            onClick={handleToggleFavorite}
            disabled={isFavoriteLoading}
            className={`flex h-10 w-10 items-center justify-center rounded-full border shadow-[0_12px_20px_-12px_rgba(61,79,47,0.8)] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${
              isFavorite
                ? "border-[#f5c4c4] bg-[#fff1f1] text-[#d64d4d]"
                : "border-[#e7e0d9] bg-white/90 text-[#4d564a] hover:scale-105"
            }`}
          >
            {isFavoriteLoading ? (
              <span className="text-xs font-bold">...</span>
            ) : (
              <HeartIcon className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
            )}
          </button>

          <button
            type="button"
            aria-label={`إضافة ${product.name} إلى السلة`}
            onClick={handleAddToCart}
            disabled={isCartLoading}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#dfe7d6] bg-[#edf2e8] text-[#3d4b2f] shadow-[0_12px_20px_-12px_rgba(61,79,47,0.8)] transition-all duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isCartLoading ? <span className="text-xs font-bold">...</span> : <ShoppingBagIcon className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-[#c09a5d]">
            <span className="text-xs">★</span>
            <span className="text-[11px] font-bold text-[#8a6e45]">{Number.isFinite(Number(product?.rating ?? NaN)) ? Number(product.rating).toFixed(1) : '—'}</span>
          </div>
          {product.badge ? (
            <span className="rounded-full border border-[#d9cfbf] bg-[#f3efe8] px-2 py-1 text-[10px] font-medium text-[#546143]">
              {product.badge}
            </span>
          ) : null}
        </div>

        <div className="min-h-[52px]">
          <h3 className="text-[20px] font-bold leading-7 text-[#1e241d]">{product.name}</h3>
        </div>

        <p className="text-[12px] leading-6 text-[#5f635d]">{product.subtitle}</p>

        <div className="flex items-center justify-between gap-3 pt-1">
          <span className="text-[18px] font-extrabold text-[#1e241d]">
            {formatCurrency(product.price, 'YER')}
          </span>
          <Link
            to={ROUTES.productDetails(product.id)}
            className="text-xs font-bold text-[#52663c] transition hover:text-[#3e522c]"
          >
            عرض التفاصيل
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
