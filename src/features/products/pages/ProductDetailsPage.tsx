import { motion } from "framer-motion";
import { ArrowRight, Heart, ShoppingBag } from "lucide-react";
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
import { resolveProductImage } from "@/features/products/data/productImages";
import { useCurrencyConfig } from "@/features/catalog/hooks/useCurrencyConfig";
import { ProductReviews } from "@/features/products/components/ProductReviews";

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
  is_favorited?: boolean;
  media?: Array<{ url?: string | null; is_primary?: boolean } | null>;
}


function normalizeProductDetails(product: ProductDetailsData): ProductDetailsData {
  const primaryMedia = product.media?.find((media) => media?.is_primary) ?? product.media?.[0];

  return {
    ...product,
    image: resolveProductImage(
      product.image ?? product.image_url ?? primaryMedia?.url,
      product.id ?? "",
    ),
    imageAlt: product.imageAlt ?? product.name,
  };
}

function isInventoryShortageError(error: unknown): boolean {
  const response = (error as { response?: { status?: number; data?: { message?: string } } })?.response;
  const message = String(response?.data?.message ?? "").toLowerCase();
  return (
    response?.status === 409 ||
    response?.status === 422 ||
    /stock|inventory|available|quantity|out of|مخزون|متوفر|كمية|نفد|محجوز/.test(message)
  );
}

export function ProductDetailsPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const upsertItem = useCartStore((state) => state.upsertItem);
  const isAuthenticated = useCustomerAuthStore((state) => state.isAuthenticated);

  const [product, setProduct] = useState<ProductDetailsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(() => Boolean(productId && getStoredWishlistIds().includes(productId)));
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const isInCart = useCartStore((state) =>
    product
      ? state.items.some(
          (item) =>
            item.productId === String(product.id) ||
            item.id === String(product.id),
        )
      : false,
  );

  const { data: currencyConfig } = useCurrencyConfig();
  const availableStock =
    (product as any)?.available_stock !== undefined
      ? Number((product as any).available_stock)
      : (product as any)?.stock_quantity !== undefined
        ? Number((product as any).stock_quantity)
        : 0;

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
             setSelectedImage(normalizedProduct.image ?? null);
             setIsFavorite(
               Boolean(
                 normalizedProduct.is_favorited ||
                 getStoredWishlistIds().includes(String(normalizedProduct.id)),
               ),
             );
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

    if (isInCart) {
      showSuccessToast("المنتج مضاف للسلة مسبقًا");
      return;
    }

    try {
      setIsAddingToCart(true);
      const targetId = String(product.id ?? (product as any).product_id ?? productId);

      const response = await cartApi.addToCart(product.id ?? (product as any).product_id ?? productId, 1);
      const createdItem = response?.data?.item ?? response?.item ?? response?.data ?? response;
      const cartItemId = String(createdItem?.id ?? createdItem?.cart_item_id ?? targetId);
      // Update local cart state for immediate UX
      upsertItem({
        id: cartItemId,
        productId: targetId,
        name: product.name ?? '',
        subtitle: (product as any).subtitle ?? product.description ?? '',
        price: Number(product.price ?? 0),
        image: (product.image ?? (product as any).image_url) ?? '',
        stock: availableStock,
        quantity: Number(createdItem?.quantity ?? 1),
        reservedQuantity: Number(createdItem?.quantity ?? 1),
        isLimitedStock: availableStock > 0 && availableStock <= 5,
        isReserved: true,
      });
      showSuccessToast(
        availableStock > 0
          ? 'تمت إضافة المنتج وحجز الكمية لسلتك بنجاح'
          : 'تمت إضافة المنتج للسلة، وسيتم تجهيزه عند توفره',
      );
      navigate(ROUTES.cart);
    } catch (err: any) {
      if (isInventoryShortageError(err) || availableStock <= 0) {
        const targetId = String(product.id ?? (product as any).product_id ?? productId);
        upsertItem({
          id: targetId,
          productId: targetId,
          name: product.name ?? "",
          subtitle: (product as any).subtitle ?? product.description ?? "",
          price: Number(product.price ?? 0),
          image: (product.image ?? (product as any).image_url) ?? "",
          stock: availableStock,
          quantity: 1,
          reservedQuantity: 0,
          isLimitedStock: true,
          isReserved: false,
          isBackordered: true,
        });
        showSuccessToast("تمت إضافة المنتج للسلة، وقد تتأخر الكمية حتى يتم تجهيزها.");
        navigate(ROUTES.cart);
        return;
      }
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

  const galleryImages = Array.from(
    new Set(
      [
        product.image,
        ...(
          product.media
            ?.map((mediaItem) => resolveProductImage(mediaItem?.url, product.id))
            ?? []
        ),
      ].filter((image): image is string => Boolean(image)),
    ),
  );

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
                  onError={() => setSelectedImage(resolveProductImage(null, product.id))}
                  alt={product.name} 
                  className="aspect-[0.9] w-full object-cover" 
                />
              </div>
              
              {/* Show thumbnails only when the product has additional images. */}
              {galleryImages.length > 1 && (
                <div className="flex flex-wrap items-center gap-3">
                  {galleryImages.map((imgUrl) => {
                    const isSelected = selectedImage === imgUrl;
                    return (
                      <button
                        key={imgUrl}
                        type="button"
                        onClick={() => setSelectedImage(imgUrl)}
                        className={`overflow-hidden rounded-[4px] border-2 transition-all ${isSelected ? 'border-[#52663c] opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                      >
                        <img
                          src={imgUrl}
                          alt="Thumbnail"
                          onError={(event) => {
                            event.currentTarget.src = resolveProductImage(null, product.id);
                          }}
                          className="h-16 w-16 object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div>
              <p className="text-xs font-bold tracking-[0.16em] text-[#8b7652]">تفاصيل المنتج والمخزون</p>
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
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || isInCart}
                  className={`inline-flex items-center gap-3 rounded-xl px-7 py-3 text-sm font-bold text-white shadow-sm transition ${
                    isInCart
                      ? "cursor-not-allowed bg-[#8b9b7b]"
                      : "bg-[#52663c] hover:bg-[#3e522c] hover:shadow"
                  }`}
                >
                  <ShoppingBag className="size-4" />
                  {isAddingToCart
                    ? "جارٍ الحجز والإضافة..."
                    : isInCart
                      ? "مضاف للسلة مسبقًا"
                      : "أضف إلى السلة (حجز مؤقت)"}
                </button>

                <button
                  type="button"
                  onClick={handleToggleFavorite}
                  disabled={isTogglingFavorite}
                  aria-label={isFavorite ? "إزالة المنتج من المفضلة" : "إضافة المنتج إلى المفضلة"}
                  aria-pressed={isFavorite}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                    isFavorite
                      ? "border border-[#f5c4c4] bg-[#fff1f1] text-[#d52222]"
                      : "border border-[#e7e0d9] bg-white text-[#5e6258]"
                  }`}
                >
                  <Heart
                    className={`size-5 transition-colors ${
                      isFavorite ? "fill-[#d52222] text-[#d52222]" : "text-[#77766d]"
                    }`}
                  />
                  {isTogglingFavorite ? "..." : isFavorite ? "المفضلة ✓" : "أضف للمفضلة"}
                </button>
              </div>

              {availableStock <= 0 && (
                <div
                  role="status"
                  className="mt-4 rounded-xl border border-[#e6c98e] bg-[#fff8e8] p-3 text-xs leading-6 text-[#76531e]"
                >
                  هذا المنتج غير جاهز حاليًا، ويمكنك حجز الكمية المطلوبة. قد تتأخر هذه الكمية
                  حتى يتم تجهيزها وتوفرها.
                </div>
              )}

              {/* Inventory reservation guarantee badge */}
              <div className="mt-6 flex items-center gap-2 rounded-xl border border-[#d6dfcf] bg-[#f3f7ef] p-3 text-xs text-[#3e522c]">
                <span className="font-bold">🔒 حجز فوري للمخزون:</span>
                <span className="text-[#556943]">بمجرد إضافة القطعة للسلة، يتم حجزها لك مؤقتاً لمدة 15 دقيقة لمنع شرائها من عملاء آخرين.</span>
              </div>
            </div>
          </section>
          <ProductReviews productId={product.id} />
        </div>
      </motion.main>
    </CatalogLayout>
  );
}
