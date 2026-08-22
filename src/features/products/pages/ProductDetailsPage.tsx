import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CatalogLayout } from "@/layouts/CatalogLayout";
import { ROUTES } from "@/routes/paths";
import { useCartStore } from "@/features/cart/stores/cartStore";
import { catalogProducts } from "@/features/products/data/products";

export function ProductDetailsPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const product = catalogProducts.find((item) => item.id === productId);
  const addItem = useCartStore((state) => state.addItem);

  if (!product) {
    return (
      <CatalogLayout>
        <main dir="rtl" className="flex min-h-[55vh] flex-col items-center justify-center bg-[#fbf8f2] px-5 text-center">
          <h1 className="text-3xl font-bold text-[#3e522c]">المنتج غير موجود</h1>
          <p className="mt-3 text-sm text-[#77766d]">ربما تم تغيير الرابط أو أن المنتج لم يعد متاحاً.</p>
          <Link to={ROUTES.products} className="mt-6 inline-flex items-center gap-2 rounded-sm bg-[#52663c] px-6 py-3 text-sm font-bold text-white">العودة إلى المنتجات <ArrowRight className="size-4" /></Link>
        </main>
      </CatalogLayout>
    );
  }

  return (
    <CatalogLayout>
      <motion.main initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} dir="rtl" className="bg-[#fbf8f2] px-5 py-12 text-[#26291f] sm:py-20">
        <div className="mx-auto max-w-6xl">
          <Link to={ROUTES.products} className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-[#52663c] hover:text-[#3e522c]"><ArrowRight className="size-4" /> العودة إلى المنتجات</Link>
          <section className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="overflow-hidden rounded-[4px] bg-[#e5ded2]"><motion.img initial={{ scale: 1.06 }} animate={{ scale: 1 }} transition={{ duration: 0.7 }} src={product.image} alt={product.name} className="aspect-[0.9] w-full object-cover" /></div>
            <div>
              <p className="text-xs font-bold tracking-[0.16em] text-[#8b7652]">تفاصيل المنتج</p>
              <h1 className="mt-3 text-3xl font-bold leading-relaxed text-[#3e522c] sm:text-5xl">{product.name}</h1>
              <p className="mt-3 text-base font-bold text-[#8b7652]">{product.subtitle}</p>
              <p className="mt-6 text-sm leading-8 text-[#5e6258]">{product.description}</p>
              <div className="mt-8 flex items-center justify-between border-y border-[#e2dbd0] py-5"><span className="text-2xl font-extrabold text-[#20251b]">{product.price.toLocaleString("ar-SA")} ر.س</span><span className="text-xs text-[#77766d]">صناعة يدوية مختارة</span></div>
              <button type="button" onClick={() => { addItem({ id: product.id, name: product.name, subtitle: product.subtitle, price: product.price, image: product.image }); navigate(ROUTES.cart); }} className="mt-8 inline-flex items-center gap-3 rounded-sm bg-[#52663c] px-7 py-3 text-sm font-bold text-white transition hover:bg-[#3e522c]"><ShoppingBag className="size-4" /> أضف إلى السلة</button>
            </div>
          </section>
        </div>
      </motion.main>
    </CatalogLayout>
  );
}
