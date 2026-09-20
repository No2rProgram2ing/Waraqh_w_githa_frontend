import { motion } from "framer-motion";
import { CheckCircleIcon, HeartIcon, ShoppingBagIcon } from "@/components/ui/icons";
import { defaultImage, type WishlistItem } from "@/api/favoritesApi";
import { cartApi } from "@/api/cartApi";
import { useCartStore } from "@/features/cart/stores/cartStore";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { useEffect, useState } from "react";

interface WishlistCardProps {
  item: WishlistItem;
  index: number;
  onRemove: (productId: string) => void;
  isRemoving: boolean;
}

export function WishlistCard({ item, index, onRemove, isRemoving }: WishlistCardProps) {
  const isInCart = useCartStore((state) =>
    state.items.some((cartItem) => cartItem.id === item.productId || cartItem.productId === item.productId),
  );
  const upsertItem = useCartStore((state) => state.upsertItem);
  const [isAdding, setIsAdding] = useState(false);
  const [isFavorite, setIsFavorite] = useState(true);
  const [imageSrc, setImageSrc] = useState(item.image || defaultImage);

  useEffect(() => {
    setImageSrc(item.image || defaultImage);
  }, [item.image]);

  const handleAddToCart = async () => {
    if (isInCart || isAdding) {
      if (isInCart) showSuccessToast("المنتج موجود مسبقاً في السلة");
      return;
    }

    try {
      setIsAdding(true);
      const response = await cartApi.addToCart(item.productId);
      const createdItem = response?.data?.item ?? response?.item ?? response?.data ?? response;
      const cartItemId = String(createdItem?.id ?? createdItem?.cart_item_id ?? item.productId);
      upsertItem({
        id: cartItemId,
        productId: item.productId,
        name: item.name,
        subtitle: item.category,
        price: item.price,
        image: item.image,
        stock: (item as any).stock ?? 5,
        quantity: Number(createdItem?.quantity ?? 1),
        reservedQuantity: Number(createdItem?.quantity ?? 1),
        isLimitedStock: true,
        isReserved: true,
      });
      showSuccessToast("تمت إضافة المنتج وحجز الكمية لسلتك بنجاح");
    } catch (error: any) {
      const msg = error?.response?.data?.message || "تعذر إضافة المنتج إلى السلة، يرجى المحاولة مرة أخرى.";
      showErrorToast(msg);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className="group overflow-hidden rounded-[20px] border border-[#e5dfd5] bg-[#f8f5f1] shadow-[0_14px_24px_-18px_rgba(48,54,38,0.28)] min-h-[370px]"
    >
      <div className="relative overflow-hidden">
        <motion.img
          src={imageSrc}
          alt={item.imageAlt}
          onError={() => {
            if (imageSrc !== defaultImage) {
              setImageSrc(defaultImage);
            }
          }}
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="h-[300px] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />

        <div className="absolute inset-x-3 top-3 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => onRemove(item.productId)}
            disabled={isRemoving}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e7e0d9] bg-white/90 text-[#4d564a] shadow-[0_12px_20px_-12px_rgba(61,79,47,0.8)] transition-all duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
            aria-label={`إزالة ${item.name}`}
          >
            {isRemoving ? <span className="text-xs font-bold">...</span> : <span className="text-xl">×</span>}
          </button>

          <button
            type="button"
            aria-label={isFavorite ? `إزالة ${item.name} من المفضلة` : `إضافة ${item.name} إلى المفضلة`}
            onClick={() => {
              setIsFavorite(false);
              onRemove(item.productId);
            }}
            className={`flex h-10 w-10 items-center justify-center rounded-full border shadow-[0_12px_20px_-12px_rgba(61,79,47,0.8)] transition-all duration-200 ${
              isFavorite
                ? "border-[#f5c4c4] bg-[#fff1f1] text-[#d64d4d]"
                : "border-[#e7e0d9] bg-white/90 text-[#4d564a] hover:scale-105"
            }`}
          >
            <HeartIcon className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
          </button>
        </div>
      </div>

      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-[#c09a5d]">
            <span className="text-xs">★</span>
            <span className="text-[11px] font-bold text-[#8a6e45]">4.8</span>
          </div>
          <span className="rounded-full border border-[#d9cfbf] bg-[#f3efe8] px-2 py-1 text-[10px] font-medium text-[#546143]">
            {item.tag}
          </span>
        </div>

        <div className="min-h-[52px]">
          <h3 className="text-[20px] font-bold leading-7 text-[#1e241d]">{item.name}</h3>
        </div>

        <p className="text-[12px] leading-6 text-[#5f635d]">{item.category}</p>

        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="flex flex-col">
            <span className="text-[18px] font-extrabold text-[#1e241d]">
              {item.price.toLocaleString("ar-SA")} ر.س
            </span>
          </div>

          <button
            type="button"
            onClick={() => void handleAddToCart()}
            disabled={isAdding}
            aria-label={isInCart ? `${item.name} موجود في السلة` : `إضافة ${item.name} إلى السلة`}
            className={`flex h-10 w-10 items-center justify-center rounded-full border shadow-[0_12px_20px_-12px_rgba(61,79,47,0.8)] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${
              isInCart
                ? "border-[#b8c8a9] bg-[#dfead8] text-[#52663c]"
                : "border-[#dfe7d6] bg-[#edf2e8] text-[#3d4b2f] hover:scale-105"
            }`}
          >
            {isAdding ? (
              <span className="text-xs font-bold">...</span>
            ) : isInCart ? (
              <CheckCircleIcon className="h-4 w-4" />
            ) : (
              <ShoppingBagIcon className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </motion.article>
  );
}
