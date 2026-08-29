import { motion } from "framer-motion";
import { ShoppingBagIcon } from "@/components/ui/icons";
import { AccountLayout } from "@/layouts/AccountLayout";
import { useSystemCurrency } from '@/lib/currency'

const results = [
  {
    id: "sr-1",
    name: "سلة يدوية مزخرفة",
    price: 390,
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
    imageAlt: "سلة يدوية مزخرفة",
    category: "ديكور منزلي",
    tag: "مميز",
  },
  {
    id: "sr-2",
    name: "طاولة خشبية فاخرة",
    price: 540,
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80",
    imageAlt: "طاولة خشبية فاخرة",
    category: "أثاث",
    tag: "جديد",
  },
  {
    id: "sr-3",
    name: "مقعد خيزران عربي",
    price: 480,
    image:
      "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=900&q=80",
    imageAlt: "مقعد خيزران عربي",
    category: "مفروشات",
    tag: "حصري",
  },
  {
    id: "sr-4",
    name: "مصباح خشبي أنيق",
    price: 425,
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
    imageAlt: "مصباح خشبي أنيق",
    category: "إضاءة",
    tag: "شائع",
  },
  {
    id: "sr-5",
    name: "مجموعة أقمشة فاخرة",
    price: 620,
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80",
    imageAlt: "مجموعة أقمشة فاخرة",
    category: "ديكور",
    tag: "أفضل قيمة",
  },
  {
    id: "sr-6",
    name: "سلة نخل ريفية",
    price: 570,
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
    imageAlt: "سلة نخل ريفية",
    category: "استوديو",
    tag: "مميز",
  },
];

const suggestedTerms = ["خيزران", "ديكور", "سلة", "مصباح", "طاولة", "تراث"];

export function SearchPage() {
  const { formatAmount } = useSystemCurrency()
  return (
    <AccountLayout hideSidebar>
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="flex flex-col gap-6"
        dir="rtl"
      >
        <div className="rounded-[24px] border border-[#e3ddd5] bg-[#f8f4f0] p-4 shadow-[0_8px_22px_-18px_rgba(38,47,26,0.2)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 items-center gap-3 rounded-2xl border border-[#d7cec2] bg-white px-4 py-3">
              <span className="text-[#5e634f]">⌕</span>
              <input
                aria-label="ابحث في المنتجات"
                defaultValue="سلة"
                className="w-full border-0 bg-transparent text-right text-[15px] text-[#20251f] placeholder:text-[#7f827b] focus:outline-none"
              />
            </div>

            <button
              type="button"
              className="rounded-xl bg-[#4f5f3d] px-5 py-3 text-sm font-bold text-white shadow-[0_12px_18px_-12px_rgba(79,95,61,0.8)] hover:bg-[#45593a]"
            >
              بحث
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {suggestedTerms.map((term) => (
              <button
                key={term}
                type="button"
                className="rounded-full border border-[#d9d1c6] bg-white px-3 py-1.5 text-[12px] text-[#4a5149] transition-colors hover:bg-[#f0e9e1]"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <h1 className="text-[28px] font-extrabold text-[#1d2218]">نتائج البحث</h1>
          <span className="rounded-full border border-[#dacfbf] bg-[#f3efe9] px-3 py-1.5 text-[12px] font-medium text-[#4f5f3d]">
            {results.length} نتائج
          </span>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {results.map((item, index) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.06, ease: "easeOut" }}
              className="group overflow-hidden rounded-[20px] border border-[#e9e0d5] bg-[#f6f1ea] shadow-[0_10px_20px_-18px_rgba(38,47,26,0.25)]"
            >
              <img
                src={item.image}
                alt={item.imageAlt}
                className="h-60 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />

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
