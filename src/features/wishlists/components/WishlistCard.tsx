import { motion } from "framer-motion";
import { CheckCircle, ShoppingBag } from "lucide-react";
import type { WishlistItem } from "@/api/favoritesApi";
import { cartApi } from "@/api/cartApi";
import { useCartStore } from "@/features/cart/stores/cartStore";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { useState } from "react";

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
  const addItem = useCartStore((state) => state.addItem);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (isInCart || isAdding) {
      if (isInCart) showSuccessToast("المنتج موجود مسبقاً في السلة");
      return;
    }

    try {
      setIsAdding(true);
      await cartApi.addToCart(item.productId);
      addItem({
        id: item.productId,
        productId: item.productId,
        name: item.name,
        subtitle: item.category,
        price: item.price,
        image: item.image,
      });
      showSuccessToast("تمت إضافة المنتج إلى السلة");
    } catch {
      showErrorToast("تعذر إضافة المنتج إلى السلة، يرجى المحاولة مرة أخرى.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06, ease: "easeOut" }}
      className="group overflow-hidden rounded-[20px] border border-[#e9e0d5] bg-[#f6f1ea] shadow-[0_10px_20px_-18px_rgba(38,47,26,0.25)]"
    >
      <div className="relative">
        <img
          src={item.image}
          alt={item.imageAlt}
          className="h-60 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />

        <button
          type="button"
          onClick={() => onRemove(item.productId)}
          disabled={isRemoving}
          className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-[#d8d0c5] bg-white/90 text-[#4d4f4a] shadow-sm transition-opacity duration-200 disabled:cursor-not-allowed disabled:opacity-60"
          aria-label={`إزالة ${item.name}`}
        >
          {isRemoving ? "..." : "×"}
        </button>
      </div>

      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="rounded-full bg-[#eef2e8] px-2 py-1 text-[9px] font-medium text-[#4d6340]">
            {item.tag}
          </span>
          <span className="text-[11px] text-[#7a7b75]">{item.category}</span>
        </div>

        <p className="text-[16px] font-bold text-[#1c211b]">{item.name}</p>

        <div className="flex items-center justify-between gap-3">
          <span className="text-[17px] font-extrabold text-[#1d2218]">
            {item.price.toLocaleString("ar-SA")} ر.س
          </span>
          <button
            type="button"
            onClick={() => void handleAddToCart()}
            disabled={isAdding}
            className={`flex h-9 w-9 items-center justify-center rounded-full text-white shadow-[0_12px_18px_-12px_rgba(79,95,61,0.8)] transition-transform duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60 ${
              isInCart ? "bg-[#71865b]" : "bg-[#4f5f3d]"
            }`}
            aria-label={isInCart ? `${item.name} موجود في السلة` : `إضافة ${item.name} إلى السلة`}
          >
            {isAdding ? <span className="text-xs font-bold">...</span> : isInCart ? <CheckCircle className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </motion.article>
  );
}
