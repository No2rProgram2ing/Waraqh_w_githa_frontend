import { motion } from "framer-motion";
import type { Product } from "@/features/products/types";
import { ShoppingBagIcon } from "@/components/ui/icons";

interface ProductCardProps {
  product: Product;
  index: number;
  featured?: boolean;
}

export function ProductCard({ product, index, featured = false }: ProductCardProps) {
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

        <button
          type="button"
          aria-label={`إضافة ${product.name} إلى السلة`}
          className="absolute bottom-4 left-4 flex h-12 w-12 items-center justify-center rounded-full border border-[#dfe7d6] bg-[#edf2e8] text-[#3d4b2f] shadow-[0_12px_20px_-12px_rgba(61,79,47,0.8)] transition-all duration-200 hover:scale-105"
        >
          <ShoppingBagIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-[#c09a5d]">
            <span className="text-xs">★</span>
            <span className="text-[11px] font-bold text-[#8a6e45]">{product.rating.toFixed(1)}</span>
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
            {product.price.toLocaleString("ar-SA")} ر.س
          </span>
          <button
            type="button"
            className="rounded-full border border-[#d4c7b9] bg-[#f4efe9] px-3 py-1.5 text-[11px] font-medium text-[#4a5248] transition-colors hover:bg-[#ece4d7]"
          >
            أضف إلى السلة
          </button>
        </div>
      </div>
    </motion.article>
  );
}
