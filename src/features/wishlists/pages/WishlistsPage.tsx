import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBagIcon } from "@/components/ui/icons";
import { AccountLayout } from "@/layouts/AccountLayout";
import { useSystemCurrency } from '@/lib/currency'

const initialWishlistItems = [
  {
    id: "wl-1",
    name: "سلة يدوية مزخرفة",
    price: 390,
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
    imageAlt: "سلة يدوية مزخرفة",
    category: "ديكور منزلي",
    tag: "مميز",
  },
  {
    id: "wl-2",
    name: "طاولة خشبية فاخرة",
    price: 540,
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80",
    imageAlt: "طاولة خشبية فاخرة",
    category: "أثاث",
    tag: "جديد",
  },
  {
    id: "wl-3",
    name: "مقعد خيزران عربي",
    price: 480,
    image:
      "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=900&q=80",
    imageAlt: "مقعد خيزران عربي",
    category: "مفروشات",
    tag: "حصري",
  },
  {
    id: "wl-4",
    name: "مصباح خشبي أنيق",
    price: 425,
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
    imageAlt: "مصباح خشبي أنيق",
    category: "إضاءة",
    tag: "شائع",
  },
];

export function WishlistsPage() {
  const { formatAmount } = useSystemCurrency()
  const [wishlistItems, setWishlistItems] = useState(initialWishlistItems);

  const handleRemove = (id: string) => {
    setWishlistItems((current) => current.filter((item) => item.id !== id));
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
          <span className="rounded-full border border-[#dacfbf] bg-[#f3efe9] px-3 py-1.5 text-[12px] font-medium text-[#4f5f3d]">
            {wishlistItems.length} عناصر
          </span>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {wishlistItems.map((item, index) => (
            <motion.article
              key={item.id}
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
                  onClick={() => handleRemove(item.id)}
                  className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-[#d8d0c5] bg-white/90 text-[#4d4f4a] shadow-sm"
                  aria-label={`إزالة ${item.name}`}
                >
                  ×
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
                    {formatAmount(item.price)}
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
          ))}
        </div>
      </motion.section>
    </AccountLayout>
  );
}
