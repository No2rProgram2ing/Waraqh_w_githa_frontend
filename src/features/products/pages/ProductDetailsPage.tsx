import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CatalogLayout } from "@/layouts/CatalogLayout";
import { ROUTES } from "@/routes/paths";
import { useCartStore } from "@/features/cart/stores/cartStore";
import { useEffect, useState } from "react";
import { customerApi } from "@/api/customerApi";
import { cartApi } from "@/api/cartApi";
import { favoritesApi } from "@/api/favoritesApi";
import { showErrorToast, showSuccessToast } from "@/lib/toast";

export function ProductDetailsPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
n  const [product, setProduct] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  useEffect(() => {
    let mounted = true;
    const id = productId;
    if (!id) return;

    const fetchProduct = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const resp = await customerApi.get(`/products/${id}`);
        // Accept both { data: Product } and raw product objects
        const payload = resp.data?.data ?? resp.data;
        if (mounted) setProduct(payload ?? null);
      } catch (err) {
        console.error('Failed to fetch product', err);
        if (mounted) setIsError(true);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchProduct();
n    return () => {
      mounted = false;
    };
  }, [productId]);

  const handleAddToCart = async () => {
    if (isAddingToCart || !product) return;
    try {
      setIsAddingToCart(true);
      await cartApi.addToCart(product.id ?? product.product_id ?? productId, 1);
      // Update local cart state for immediate UX
      addItem({ id: String(product.id ?? product.product_id ?? productId), name: product.name ?? '', subtitle: product.subtitle ?? product.description ?? '', price: Number(product.price ?? 0), image: (product.image ?? product.image_url) ?? '' });
      showSuccessToast('تمت إضافة المنتج إلى السلة');
      navigate(ROUTES.cart);
    } catch (err: any) {
      console.error('Add to cart failed', err);
      const message = err?.response?.data?.message ?? 'تعذر إضافة المنتج إلى السلة، يرجى المحاولة مرة أخرى.';
      showErrorToast(message);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (isTogglingFavorite || !product) return;
    try {
      setIsTogglingFavorite(true);
      // Optimistically toggle UI
      setIsFavorite((prev) => !prev);
      const favoriteState = await favoritesApi.toggleFavorite(product.id ?? product.product_id ?? productId);
      setIsFavorite(Boolean(favoriteState));
      showSuccessToast(favoriteState ? 'تمت إضافة المنتج إلى المفضلة' : 'تمت إزالة المنتج من المفضلة');
    } catch (err) {
      console.error('Toggle favorite failed', err);
      // Revert optimistic update on error
      setIsFavorite((prev) => !prev);
      showErrorToast('تعذر تحديث قائمة المفضلة، يرجى المحاولة مرة أخرى.');
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  if (isLoading) {
    return (
      <CatalogLayout>
        <main dir="rtl" className="space-y-6">
          <div>
            <h1 className="text-[28px] font-extrabold text-[var(--color-text-primary)]">تفاصيل المنتج</h1>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">جارٍ تحميل بيانات المنتج...</p>
          </div>
        </main>
      </CatalogLayout>
    );
  }
n  if (isError || !product) {
    return (
      <CatalogLayout>
        <main dir="rtl" className="space-y-6">
          <div>
            <h1 className="text-[28px] font-extrabold text-[var(--color-text-primary)]">تعذر تحميل المنتج</h1>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">حدث خطأ أثناء تحميل بيانات المنتج.</p>
          </div>
n          <div className="flex items-center gap-3">
            <button type="button" onClick={() => window.location.reload()} className="rounded-xl bg-[#45592D] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5D7243]">إعادة المحاولة</button>
            <Link to={ROUTES.products} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] px-4 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] transition hover:bg-[var(--color-surface)]">العودة للمتجر</Link>
          </div>
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
            <div className="overflow-hidden rounded-[4px] bg-[#e5ded2]"><motion.img initial={{ scale: 1.06 }} animate={{ scale: 1 }} transition={{ duration: 0.7 }} src={product.image ?? product.image_url} alt={product.name} className="aspect-[0.9] w-full object-cover" /></div>
            <div>
              <p className="text-xs font-bold tracking-[0.16em] text-[#8b7652]">تفاصيل المنتج</p>
              <h1 className="mt-3 text-3xl font-bold leading-relaxed text-[#3e522c] sm:text-5xl">{product.name}</h1>
              <p className="mt-3 text-base font-bold text-[#8b7652]">{product.subtitle ?? product.short_description}</p>
              <p className="mt-6 text-sm leading-8 text-[#5e6258]">{product.description}</p>
              <div className="mt-8 flex items-center justify-between border-y border-[#e2dbd0] py-5"><span className="text-2xl font-extrabold text-[#20251b]">{Number(product.price ?? 0).toLocaleString('ar-SA')} ر.س</span><span className="text-xs text-[#77766d]">صناعة يدوية مختارة</span></div>

              <div className="mt-6 flex items-center gap-3">
                <button type="button" onClick={handleAddToCart} disabled={isAddingToCart} className="inline-flex items-center gap-3 rounded-sm bg-[#52663c] px-7 py-3 text-sm font-bold text-white transition hover:bg-[#3e522c]">
                  <ShoppingBag className="size-4" /> {isAddingToCart ? 'جارٍ الإضافة...' : 'أضف إلى السلة'}
                </button>

                <button type="button" onClick={handleToggleFavorite} disabled={isTogglingFavorite} aria-pressed={isFavorite} className={`rounded-full px-4 py-2 text-sm font-medium transition ${isFavorite ? 'bg-[#fff1f1] text-[#d64d4d] border border-[#f5c4c4]' : 'bg-white border border-[#e7e0d9]'}`}>
                  {isTogglingFavorite ? '...' : isFavorite ? 'المفضلة ✓' : 'أضف للمفضلة'}
                </button>
              </div>
            </div>
          </section>
        </div>
      </motion.main>
    </CatalogLayout>
  );
}
