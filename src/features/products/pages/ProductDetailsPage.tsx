import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CatalogLayout } from "@/layouts/CatalogLayout";
import { ROUTES } from "@/routes/paths";
import { useCartStore } from "@/features/cart/stores/cartStore";
import { useEffect, useState } from "react";
import { customerApi } from "@/api/customerApi";
import { cartApi } from "@/api/cartApi";
import { getStoredWishlistIds, toggleWishlist } from "@/api/favoritesApi";
import { useCustomerAuthStore } from "@/features/auth-customer/stores/customerAuthStore";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { getProductImage } from "@/features/products/data/productImages";
import { useCurrencyConfig } from "@/features/catalog/hooks/useCurrencyConfig";

interface ProductDetailsData {
  id: string | number;
  name: string;
  subtitle?: string;
  short_description?: string;
  description?: string;
  price?: number | string;
  image?: string;
  image_url?: string;
  imageAlt?: string;
  media?: Array<{ url?: string | null; is_primary?: boolean } | null>;
}


function normalizeProductDetails(product: ProductDetailsData): ProductDetailsData {
  const primaryMedia = product.media?.find((media) => media?.is_primary) ?? product.media?.[0];

  return {
    ...product,
    image: getProductImage(product.id ?? "") ?? product.image ?? product.image_url ?? primaryMedia?.url ?? undefined,
    imageAlt: product.imageAlt ?? product.name,
  };
}

export function ProductDetailsPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const isAuthenticated = useCustomerAuthStore((state) => state.isAuthenticated);

  const [product, setProduct] = useState<ProductDetailsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(() => Boolean(productId && getStoredWishlistIds().includes(productId)));
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { data: currencyConfig } = useCurrencyConfig();

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
        if (mounted) {
          const normalizedProduct = payload ? normalizeProductDetails(payload) : null;
          setProduct(normalizedProduct);
          if (normalizedProduct) {
             setSelectedImage(normalizedProduct.image ?? normalizedProduct.image_url ?? null);
          }
        }
      } catch {
        if (mounted) setIsError(true);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchProduct();

    return () => {
      mounted = false;
    };
  }, [productId]);

  const handleAddToCart = async () => {
    if (isAddingToCart || !product) return;
    try {
      setIsAddingToCart(true);
      await cartApi.addToCart(product.id ?? productId, 1);
      // Update local cart state for immediate UX
      addItem({
        id: String(product.id ?? productId),
        name: product.name ?? '',
        subtitle: product.subtitle ?? product.description ?? '',
        price: Number(product.price ?? 0),
        image: (product.image ?? product.image_url) ?? '',
      });
      showSuccessToast('تمت إضافة المنتج إلى السلة');
      navigate(ROUTES.cart);
    } catch (err: any) {
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
      const favoriteState = await toggleWishlist(product.id ?? productId, isAuthenticated);
      setIsFavorite(Boolean(favoriteState));
      showSuccessToast(favoriteState ? 'تمت إضافة المنتج إلى المفضلة' : 'تمت إزالة المنتج من المفضلة');
    } catch {
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

  if (isError || !product) {
    return (
      <CatalogLayout>
        <main dir="rtl" className="space-y-6">
          <div>
            <h1 className="text-[28px] font-extrabold text-[var(--color-text-primary)]">تعذر تحميل المنتج</h1>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">حدث خطأ أثناء تحميل بيانات المنتج.</p>
          </div>

          <div className="flex items-center gap-3">
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
            <div className="flex flex-col gap-4">
              <div className="overflow-hidden rounded-[4px] bg-[#e5ded2]">
                <motion.img 
                  key={selectedImage}
                  initial={{ opacity: 0.8, scale: 1.02 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  transition={{ duration: 0.4 }} 
                  src={selectedImage ?? undefined} 
                  alt={product.name} 
                  className="aspect-[0.9] w-full object-cover" 
                />
              </div>
              
              {/* Image Thumbnails Gallery */}
              {product.media && product.media.length > 0 && (
                <div className="flex flex-wrap items-center gap-3">
                  {[
                    // Include the main image if it exists and isn't already in media (or just map media directly if it contains the primary)
                    ...(product.image && !product.media.find(m => m?.url === product.image) ? [{ url: product.image, id: 'main' }] : []),
                    ...product.media
                  ].filter(Boolean).map((mediaItem: any, idx: number) => {
                    const imgUrl = mediaItem.url;
                    if (!imgUrl) return null;
                    const isSelected = selectedImage === imgUrl;
                    return (
                      <button
                        key={mediaItem.id ?? idx}
                        type="button"
                        onClick={() => setSelectedImage(imgUrl)}
                        className={`overflow-hidden rounded-[4px] border-2 transition-all ${isSelected ? 'border-[#52663c] opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                      >
                        <img src={imgUrl} alt="Thumbnail" className="h-16 w-16 object-cover" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div>
              <p className="text-xs font-bold tracking-[0.16em] text-[#8b7652]">تفاصيل المنتج</p>
              <h1 className="mt-3 text-3xl font-bold leading-relaxed text-[#3e522c] sm:text-5xl">{product.name}</h1>
              <p className="mt-3 text-base font-bold text-[#8b7652]">{product.subtitle ?? product.short_description}</p>
              <p className="mt-6 text-sm leading-8 text-[#5e6258]">{product.description}</p>
              
              <div className="mt-8 flex items-center justify-between border-y border-[#e2dbd0] py-5">
                <div className="flex flex-col">
                  <span className="text-2xl font-extrabold text-[#20251b]">{Number(product.price ?? 0).toLocaleString('ar-SA')} ر.ي</span>
                  {currencyConfig && currencyConfig.exchange_rate > 0 && (
                     <span className="mt-1 text-sm font-medium text-gray-400">
                       {(Number(product.price ?? 0) / currencyConfig.exchange_rate).toLocaleString('ar-SA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currencyConfig.secondary_currency === 'SAR' ? 'ر.س' : currencyConfig.secondary_currency}
                     </span>
                  )}
                </div>
                <span className="text-xs text-[#77766d]">صناعة يدوية مختارة</span>
              </div>

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
