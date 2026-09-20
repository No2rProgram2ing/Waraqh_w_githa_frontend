import { motion } from "framer-motion";
import { Minus, Plus, Trash2 } from "lucide-react";
import type { CartItem as CartItemModel } from "@/features/cart/stores/cartStore";
import { getProductImage } from "@/features/products/data/productImages";

interface CartItemProps {
  item: CartItemModel;
  index: number;
  isUpdating: boolean;
  maxQuantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
  onRereserve: () => void;
}

const formatPrice = (price: number) => `${price.toLocaleString("ar-SA")} ر.س`;

export function CartItem({
  item,
  index,
  isUpdating,
  maxQuantity,
  onIncrease,
  onDecrease,
  onRemove,
  onRereserve,
}: CartItemProps) {
  const availableStock = Math.max(0, item.availableStock ?? item.stock ?? 0);
  const reservedQuantity = item.isReserved ? Math.max(0, item.reservedQuantity ?? 0) : 0;
  const inStockQuantity = Math.min(item.quantity, availableStock);
  const isMadeToOrder = item.quantity > availableStock;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="rounded-2xl border border-[#d3ded0] bg-[#f4f7f2] p-4 shadow-sm transition-all duration-300 sm:p-5"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <img
          src={item.image || getProductImage(item.productId ?? item.id)}
          alt={item.name}
          className="h-28 w-full rounded-xl object-cover sm:h-24 sm:w-28"
        />

        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-bold text-[#52663c]">{item.name}</h2>
          <p className="mt-1 text-xs text-[#77766d]">{item.subtitle}</p>
          <p className="mt-3 text-base font-extrabold text-[#795238]">{formatPrice(item.price)}</p>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-semibold">
            {item.isReserved && (item.reservedQuantity ?? 0) > 0 ? (
              <span className="rounded-full bg-[#e5eedf] px-3 py-1 text-[#3e522c]">
                محجوز لك: {item.reservedQuantity}
              </span>
            ) : (
              <button
                type="button"
                onClick={onRereserve}
                className="rounded-full bg-[#fef2f2] px-3 py-1 text-[#a04a3a] transition hover:bg-[#fee2e2]"
              >
                غير محجوز - إعادة الحجز
              </button>
            )}
            <span className="rounded-full bg-[#f1ede5] px-3 py-1 text-[#795238]">
              المتبقي بالمخزون: {availableStock}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-5 sm:flex-col sm:items-end">
          <div className="flex items-center gap-3 rounded-full border border-[#d8d0c3] bg-white px-2 py-1">
            <button
              type="button"
              onClick={onIncrease}
              disabled={item.quantity >= maxQuantity || isUpdating}
              aria-label="زيادة الكمية"
              className="text-[#52663c] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Plus className="size-4" />
            </button>
            <span className="min-w-5 text-center text-sm font-bold">{item.quantity}</span>
            <button
              type="button"
              onClick={onDecrease}
              disabled={item.quantity <= 1 || isUpdating}
              aria-label="تقليل الكمية"
              className="text-[#52663c] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Minus className="size-4" />
            </button>
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex items-center gap-1 text-xs text-[#8b7652] hover:text-[#a04a3a]"
          >
            <Trash2 className="size-4" /> حذف
          </button>
        </div>
      </div>

      {isMadeToOrder && (
        <div
          role="status"
          className="mt-4 rounded-xl border border-[#e6c98e] bg-[#fff8e8] px-3 py-2 text-xs leading-6 text-[#76531e]"
        >
          المتوفر حاليًا {inStockQuantity} قطع جاهزة، أما الكمية الإضافية فسيتم تجهيزها
          خصيصًا لك، وقد يترتب على ذلك زيادة بضعة أيام في مدة التوصيل.
        </div>
      )}
    </motion.article>
  );
}
