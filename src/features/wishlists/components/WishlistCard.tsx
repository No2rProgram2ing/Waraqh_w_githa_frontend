import { motion } from "framer-motion";
import { ShoppingBagIcon } from "@/components/ui/icons";
import type { WishlistItem } from "@/api/favoritesApi";

interface WishlistCardProps {
  item: WishlistItem;
  index: number;
  onRemove: (productId: string) => void;
  isRemoving: boolean;
}

export function WishlistCard({ item, index, onRemove, isRemoving }: WishlistCardProps) {
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
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#4f5f3d] text-white shadow-[0_12px_18px_-12px_rgba(79,95,61,0.8)] transition-transform duration-200 hover:scale-105"
            aria-label={`إضافة ${item.name} إلى السلة`}
          >
            <ShoppingBagIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
