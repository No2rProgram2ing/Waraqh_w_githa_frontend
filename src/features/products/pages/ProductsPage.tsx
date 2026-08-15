import { motion } from "framer-motion";
import { ProductCard } from "@/features/products/components/ProductCard";
import { CatalogLayout } from "@/layouts/CatalogLayout";
import type { Product } from "@/features/products/types";

const products: Product[] = [
  {
    id: "p-1",
    name: "طقم سلة يدوية",
    subtitle: "مجموعة فاخرة من السلال الطبيعية مع لمسات يدويّة أنيقة وملاءمة مثالية للديكور العصري.",
    price: 390,
    rating: 4.8,
    badge: "الأكثر طلباً",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
    imageAlt: "طقم سلال يدوي",
  },
  {
    id: "p-2",
    name: "أريكة ريفية",
    subtitle: "تشكيلة مريحة وبنية صناعية هادئة مستوحاة من فخامة المنازل التقليدية في اليمن.",
    price: 520,
    rating: 4.9,
    badge: "حصري",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80",
    imageAlt: "أريكة ريفية",
  },
  {
    id: "p-3",
    name: "مقعد خيزران",
    subtitle: "تصميم مستوحى من الحرف اليدوية اليمنية، بلمسة معاصرة وراحة يومية مريحة.",
    price: 480,
    rating: 4.7,
    badge: "جديد",
    image:
      "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=900&q=80",
    imageAlt: "مقعد خيزران", 
  },
  {
    id: "p-4",
    name: "مصباح خشبي",
    subtitle: "إضاءة دافئة تضيف جوّاً مريحاً في كل زاوية منزلية مع لمسة تراثية أنيقة.",
    price: 420,
    rating: 4.6,
    badge: "مميز",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
    imageAlt: "مصباح خشبي",
  },
];

const categories = ["كل المنتجات", "سلال", "أثاث", "ديكور", "إضاءة"];

export function ProductsPage() {
  return (
    <CatalogLayout>
      <motion.main
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        dir="rtl"
        className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8"
      >
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-[#7a7d71]">المتجر</p>
            <h1 className="mt-2 text-[34px] font-extrabold text-[#1d2119]">منتجات ورقة وجذع</h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {categories.map((category, index) => (
              <button
                key={category}
                type="button"
                className={`rounded-full border px-3 py-2 text-[12px] font-medium transition-colors ${
                  index === 0
                    ? "border-[#d7cdbd] bg-[#f2ebdf] text-[#2d3329]"
                    : "border-[#e0d9d1] bg-[#f7f4f0] text-[#5b6157] hover:bg-[#efe8df]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <section className="grid gap-6 xl:grid-cols-2">
          {products.slice(0, 2).map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} featured />
          ))}
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-2">
          {products.slice(2).map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </section>
      </motion.main>
    </CatalogLayout>
  );
}
