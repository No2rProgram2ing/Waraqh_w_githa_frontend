import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, Heart, ShoppingBag, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { CatalogLayout } from "@/layouts/CatalogLayout";
import { ROUTES } from "@/routes/paths";
import { cartApi } from "@/api/cartApi";
import { getStoredWishlistIds, toggleWishlist } from "@/api/favoritesApi";
import { useCustomerAuthStore } from "@/features/auth-customer/stores/customerAuthStore";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { useCartStore } from "@/features/cart/stores/cartStore";
import { productReviewsApi, type ProductReview } from "@/api/productReviewsApi";
import { getProductImageByIndex, resolveProductImage } from "@/features/products/data/productImages";
import { productsCatalogApi } from "@/features/products/api/productsCatalogApi";
import { useGetCategories } from "@/features/products/hooks/useProductCatalog";

const images = {
  hero: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1800&q=88",
  basket: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=900&q=88",
  chair: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=900&q=88",
  lamp: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=900&q=88",
  planting: "https://images.unsplash.com/photo-1599685315640-7b89c1e9d7b8?auto=format&fit=crop&w=900&q=88",
  mountain: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=88",
  artisan: "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&w=1000&q=88",
  home: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=88",
};

type HomeProductRecord = Record<string, any>;

interface HomeProduct {
  id: string;
  name: string;
  type: string;
  image: string;
  description: string;
  price: number;
}

interface HomeReview extends ProductReview {
  productLabel: string;
}

const fallbackProductImage = images.basket;

function normalizeHomeProduct(product: HomeProductRecord, index: number): HomeProduct {
  const media = Array.isArray(product.media) ? product.media : Array.isArray(product.images) ? product.images : [];
  const primaryMedia = media.find((mediaItem: any) => mediaItem?.is_primary) ?? media[0];

  const productId = product.id ?? product.product_id ?? product.slug ?? `${index}`;
  const productName = product.name ?? product.title ?? "منتج";
  const productCategory =
    product.category_name ??
    product.category?.name ??
    product.category ??
    "منتج حرفي";

  return {
    id: String(productId),
    name: String(productName),
    type: String(productCategory),
    image: resolveProductImage(
      String(
        product.image_url ??
          product.image ??
          product.imageUrl ??
          product.thumbnail ??
          product.cover ??
          primaryMedia?.url ??
          getProductImageByIndex(index) ??
          fallbackProductImage,
      ),
      String(productId),
    ),
    description: String(product.description ?? product.short_description ?? product.subtitle ?? ""),
    price: Number(product.price ?? product.amount ?? product.sale_price ?? 0),
  };
}

function getCategoryFallbackImage(categoryName: string, index: number): string {
  const normalizedName = categoryName.toLowerCase();

  if (/إضاءة|مصابيح|لمبات|lamp|light/.test(normalizedName)) return images.lamp;
  if (/أثاث|كرسي|طاولة|خشب|furniture|chair|table/.test(normalizedName)) return images.chair;
  if (/سلال|منسوج|نسيج|basket|textile|woven/.test(normalizedName)) return images.basket;
  if (/نبات|زراعة|plant|garden/.test(normalizedName)) return images.planting;

  return [images.basket, images.chair, images.lamp, images.planting][index % 4];
}

function resolveCategoryImage(value: string | null | undefined, fallback: string): string {
  if (!value?.trim()) return fallback;

  const imagePath = value.trim();
  if (/(?:via\.placeholder\.com|placeholder\.com|placehold\.co)/i.test(imagePath)) {
    return fallback;
  }

  if (/^(https?:|data:|blob:)/i.test(imagePath)) return imagePath;

  const configuredApiBase = String(import.meta.env.VITE_API_BASE_URL ?? "").trim().replace(/\/+$/, "");
  const apiOrigin = configuredApiBase.replace(/\/api(?:\/v\d+)?$/i, "");
  const normalizedPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;

  return apiOrigin ? `${apiOrigin}${normalizedPath}` : normalizedPath;
}

function HomePage() {
  const { data: categories = [], isLoading: isCategoriesLoading, isError: hasCategoriesError } = useGetCategories();
  const [categoryStart, setCategoryStart] = useState(0);
  const [bestsellers, setBestsellers] = useState<HomeProduct[]>([]);
  const [newArrivals, setNewArrivals] = useState<HomeProduct[]>([]);
  const [isFeaturedLoading, setIsFeaturedLoading] = useState(true);
  const [featuredError, setFeaturedError] = useState(false);
  const [latestReviews, setLatestReviews] = useState<HomeReview[]>([]);
  const [isReviewsLoading, setIsReviewsLoading] = useState(true);

  useEffect(() => {
    setCategoryStart(0);
  }, [categories.length]);

  const visibleCategories = categories.length <= 3
    ? categories
    : Array.from({ length: 3 }, (_, index) => categories[(categoryStart + index) % categories.length]);

  const showCategoryNavigation = categories.length > 3;
  const showPreviousCategories = () => {
    setCategoryStart((current) => (current - 3 + categories.length) % categories.length);
  };
  const showNextCategories = () => {
    setCategoryStart((current) => (current + 3) % categories.length);
  };

  useEffect(() => {
    let isMounted = true;

    const loadFeaturedProducts = async () => {
      try {
        const catalogResponse = await productsCatalogApi.getProducts({ page: 1, per_page: 6 });
        const catalogItems = catalogResponse.data ?? [];

        if (isMounted) {
          const sortedByNewest = [...catalogItems].sort((a: any, b: any) => {
            const aDate = new Date(a.created_at ?? a.createdAt ?? 0).getTime();
            const bDate = new Date(b.created_at ?? b.createdAt ?? 0).getTime();
            return bDate - aDate;
          });

          setBestsellers(catalogItems.slice(0, 3).map((item, index) => normalizeHomeProduct(item as any, index)));
          setNewArrivals(sortedByNewest.slice(0, 3).map((item, index) => normalizeHomeProduct(item as any, index)));
          setFeaturedError(false);
        }

        const reviews = await productReviewsApi.getLatestReviews(catalogItems.map((product) => product.id));

        if (isMounted) {
          setLatestReviews(
            reviews.map((review) => ({
              ...review,
              productLabel:
                review.product_name ??
                review.product?.name ??
                review.product?.title ??
                catalogItems.find((product) => String(product.id) === String(review.product_id))?.name ??
                "منتج",
            })),
          );
        }
      } catch (error) {
        console.error("Failed to load catalog products for home page", error);
        if (isMounted) {
          setBestsellers([]);
          setNewArrivals([]);
          setFeaturedError(true);
        }
      } finally {
        if (isMounted) {
          setIsFeaturedLoading(false);
          setIsReviewsLoading(false);
        }
      }
    };

    void loadFeaturedProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <CatalogLayout>
      <main dir="rtl" className="overflow-hidden bg-[#fbfaf7] text-[#2b3024]">
      <section className="relative flex min-h-[610px] items-center justify-center bg-cover bg-center px-5 pt-16 text-center text-white" style={{ backgroundImage: `linear-gradient(rgb(34 38 26 / .35), rgb(34 38 26 / .52)), url(${images.hero})` }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }} className="max-w-2xl">
          <p className="mb-5 text-sm font-semibold tracking-[.25em] text-[#e6d4b4]">من أرضنا إلى بيتك</p>
          <h1 className="text-4xl font-bold leading-[1.45] sm:text-6xl">حرفية يمنية أصيلة<br /><span className="text-[#d9c49c]">بروح مستدامة</span></h1>
          <p className="mx-auto mt-6 max-w-lg text-sm leading-8 text-white/85 sm:text-base">نحكي قصة الأرض والحرفة في قطع فريدة، صنعت بأيدي حرفيين يمنيين لتمنح منزلك روحًا لا تشبه سواها.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3"><Link to={ROUTES.products} className="flex items-center gap-2 bg-[#52683b] px-6 py-3 text-sm font-bold transition hover:bg-[#40542e]">اكتشف مجموعتنا <ArrowLeft className="size-4" /></Link><Link to={ROUTES.aboutUs} className="border border-white/70 px-6 py-3 text-sm font-bold transition hover:bg-white/10">تعرف على قصتنا</Link></div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <SectionHeading eyebrow="اختياراتنا" title="الأكثر مبيعًا" link="تصفح الكل" />
        <FeaturedProductsGrid products={bestsellers} isLoading={isFeaturedLoading} hasError={featuredError} />
      </section>

      <section className="bg-[#f2f0e9] px-5 py-16 sm:px-8"><div className="mx-auto max-w-7xl"><SectionHeading eyebrow="من الطبيعة" title="وصلنا جديدًا" link="اكتشف الجديد" /><FeaturedProductsGrid products={newArrivals} isLoading={isFeaturedLoading} hasError={featuredError} /></div></section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="flex items-end justify-between border-b border-[#e5e0d7] pb-4">
          <div>
            <p className="text-xs font-bold text-[#8b7652]">تشكيلة الموسم</p>
            <h2 className="mt-2 text-2xl font-bold text-[#39432d] sm:text-3xl">تسوق حسب الفئة</h2>
          </div>
          {showCategoryNavigation && (
            <div className="flex items-center gap-2" dir="ltr">
              <button
                type="button"
                onClick={showPreviousCategories}
                aria-label="الفئات السابقة"
                className="flex size-10 items-center justify-center rounded-full border border-[#d8d2c7] bg-white text-[#52663c] transition hover:bg-[#f2eee7]"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={showNextCategories}
                aria-label="الفئات التالية"
                className="flex size-10 items-center justify-center rounded-full border border-[#d8d2c7] bg-white text-[#52663c] transition hover:bg-[#f2eee7]"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          )}
        </div>
        {isCategoriesLoading ? (
          <div className="mt-8 flex min-h-60 items-center justify-center text-sm text-[#77766d]">
            جارٍ تحميل الفئات...
          </div>
        ) : hasCategoriesError || categories.length === 0 ? (
          <div className="mt-8 flex min-h-60 items-center justify-center text-sm text-[#77766d]">
            لا توجد فئات متاحة حاليًا.
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {visibleCategories.map((category, index) => (
              <Link
                to={`${ROUTES.products}?category=${encodeURIComponent(String(category.id))}`}
                key={category.id}
                className="group relative aspect-[.86] overflow-hidden"
              >
                <img
                  src={resolveCategoryImage(
                    category.image_url,
                    getCategoryFallbackImage(category.name, categoryStart + index),
                  )}
                  alt={category.name}
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = getCategoryFallbackImage(category.name, categoryStart + index);
                  }}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute inset-x-5 bottom-5 text-white">
                  <h3 className="text-xl font-bold">{category.name}</h3>
                  <span className="mt-2 inline-flex items-center gap-1 text-xs text-white/80">
                    استكشف المجموعة <ArrowLeft className="size-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="grid bg-[#eee9df] lg:grid-cols-2"><div className="min-h-[420px] bg-cover bg-center" style={{ backgroundImage: `url(${images.artisan})` }} /><div className="flex items-center px-8 py-14 sm:px-16"><div className="max-w-xl"><p className="text-sm font-bold text-[#8b7652]">حكاية من أيدينا</p><h2 className="mt-4 text-3xl font-bold leading-relaxed text-[#4f6236] sm:text-4xl">نمنح الحرفة حياة جديدة، ونحفظ أثرها في كل قطعة</h2><p className="mt-5 leading-8 text-[#67665c]">خلف كل منتج حكاية إنسان ومكان. نعمل مع حرفيين محليين لنقدم تصاميم تحترم الطبيعة وتحتفي بالتفاصيل التي لا تصنعها الآلات.</p><Link to={ROUTES.aboutUs} className="mt-7 inline-flex items-center gap-2 border border-[#718254] px-5 py-3 text-sm font-bold text-[#4f6236]">اقرأ قصتنا <ArrowLeft className="size-4" /></Link></div></div></section>

      <section className="bg-[#53683b] px-5 py-16 text-white sm:px-8"><div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[.9fr_1.1fr]"><div className="grid grid-cols-2 gap-3"><img src={images.mountain} alt="جبال اليمن" className="h-44 w-full object-cover" /><img src={images.basket} alt="منتج طبيعي" className="mt-8 h-44 w-full object-cover" /></div><div><p className="text-sm text-[#d9d5a6]">رحلة القطعة</p><h2 className="mt-3 text-3xl font-bold leading-relaxed sm:text-4xl">من الأرض إلى منزلك</h2><p className="mt-4 max-w-xl leading-8 text-white/80">نختار المواد بعناية، ونعمل مع أيادٍ تعرف قيمة التفاصيل، لتصل إليك قطعة صادقة تعيش طويلًا وتزداد جمالًا مع الوقت.</p><Link to={ROUTES.products} className="mt-7 inline-flex items-center gap-2 bg-white px-5 py-3 text-sm font-bold text-[#53683b]">تسوق القطع المستدامة <ArrowLeft className="size-4" /></Link></div></div></section>

      <section className="relative min-h-[430px] bg-cover bg-center px-5 py-20 text-center text-white" style={{ backgroundImage: `linear-gradient(rgb(28 37 24 / .42), rgb(28 37 24 / .55)), url(${images.home})` }}><div className="mx-auto max-w-xl"><p className="text-sm text-[#e1d2b5]">مجموعة تستوطن الجديدة</p><h2 className="mt-4 text-3xl font-bold sm:text-5xl">بيتك يحكي حكايتك</h2><p className="mt-5 leading-8 text-white/85">أضف لمسات دافئة تحمل روح اليمن إلى مساحتك.</p><Link to={ROUTES.products} className="mt-7 inline-flex bg-[#53683b] px-6 py-3 text-sm font-bold">شاهد المجموعة <ArrowLeft className="mr-2 size-4" /></Link></div></section>

      {!isReviewsLoading && latestReviews.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <SectionHeading eyebrow="صوت عملائنا" title="قالوا عنا" />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {latestReviews.map((review) => (
              <article key={review.id} className="border border-[#ddd8cf] bg-white p-6">
                <div className="flex gap-1 text-[#c3954c]" aria-label={`التقييم ${review.rating} من 5`}>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className={`size-3 ${index < review.rating ? "fill-current" : ""}`}
                    />
                  ))}
                </div>
                <p className="mt-5 text-sm leading-8 text-[#565950]">“{review.comment}”</p>
                <p className="mt-3 text-xs text-[#8b7652]">{review.productLabel}</p>
                <div className="mt-5 flex items-center gap-2 text-xs font-bold">
                  <span className="size-7 rounded-full bg-[#d9cdbb]" />
                  {review.customer_name ?? review.customer?.name ?? review.user?.name ?? "عميل ورقة وجذع"}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

    </main>
    </CatalogLayout>
  );
}

function FeaturedProductsGrid({ products, isLoading, hasError }: { products: HomeProduct[]; isLoading: boolean; hasError: boolean }) {
  if (isLoading) {
    return <div className="mt-8 flex min-h-60 items-center justify-center text-sm text-[#77766d]">جارٍ تحميل المنتجات...</div>;
  }

  if (hasError || products.length === 0) {
    return <div className="mt-8 flex min-h-60 items-center justify-center text-sm text-[#77766d]">لا توجد منتجات متاحة حاليًا.</div>;
  }

  return <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">{products.map((item, index) => <ProductTile key={item.id} item={item} index={index} />)}</div>;
}

function SectionHeading({ eyebrow, title, link }: { eyebrow: string; title: string; link?: string }) {
  return <div className="flex items-end justify-between border-b border-[#e5e0d7] pb-4"><div><p className="text-xs font-bold text-[#8b7652]">{eyebrow}</p><h2 className="mt-2 text-2xl font-bold text-[#39432d] sm:text-3xl">{title}</h2></div>{link && <Link to={ROUTES.products} className="flex items-center gap-1 text-xs font-bold text-[#617049]">{link}<ArrowLeft className="size-3" /></Link>}</div>;
}

function ProductTile({ item, index }: { item: HomeProduct; index: number }) {
  const isAuthenticated = useCustomerAuthStore((state) => state.isAuthenticated);
  const isInCart = useCartStore((state) =>
    state.items.some((cartItem) => cartItem.id === item.id || cartItem.productId === item.id),
  );
  const [isFavorite, setIsFavorite] = useState(() => getStoredWishlistIds().includes(item.id));
  const [isCartLoading, setIsCartLoading] = useState(false);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = async () => {
    if (isCartLoading || isInCart) {
      if (isInCart) {
        showSuccessToast("المنتج موجود مسبقاً في السلة");
      }
      return;
    }

    try {
      setIsCartLoading(true);
      await cartApi.addToCart(item.id);
      addItem({
        id: item.id,
        productId: item.id,
        name: item.name,
        subtitle: item.description,
        price: item.price,
        image: item.image,
        stock: (item as any).stock ?? 5,
        isLimitedStock: true,
        isReserved: true,
      });
      showSuccessToast("تمت إضافة المنتج وحجز الكمية لسلتك بنجاح");
    } catch (error: any) {
      const msg = error?.response?.data?.message || "تعذر إضافة المنتج إلى السلة، يرجى المحاولة مرة أخرى.";
      showErrorToast(msg);
    } finally {
      setIsCartLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (isFavoriteLoading) return;

    try {
      setIsFavoriteLoading(true);
      const favoriteState = await toggleWishlist(item.id, isAuthenticated);
      setIsFavorite(favoriteState);
      showSuccessToast(favoriteState ? "تمت إضافة المنتج إلى المفضلة" : "تمت إزالة المنتج من المفضلة");
    } catch (error) {
      console.error(error);
      showErrorToast("تعذر تحديث قائمة المفضلة، يرجى المحاولة مرة أخرى.");
    } finally {
      setIsFavoriteLoading(false);
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.35, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className="group overflow-hidden rounded-[20px] border border-[#e5dfd5] bg-[#f8f5f1] shadow-[0_14px_24px_-18px_rgba(48,54,38,0.28)]"
    >
      <div className="relative overflow-hidden">
        <motion.img
          src={item.image}
          alt={item.name}
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = getProductImageByIndex(index);
          }}
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          whileHover={{ scale: 1.04 }}
          className="h-[300px] w-full object-cover transition duration-500"
        />

        <div className="absolute inset-x-3 top-3 flex items-center justify-between gap-2">
          <button
            type="button"
            aria-label={isFavorite ? `إزالة ${item.name} من المفضلة` : `إضافة ${item.name} إلى المفضلة`}
            onClick={() => void handleToggleFavorite()}
            disabled={isFavoriteLoading}
            className={`flex h-10 w-10 items-center justify-center rounded-full border shadow-[0_12px_20px_-12px_rgba(61,79,47,0.8)] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${
              isFavorite
                ? "border-[#f5c4c4] bg-[#fff1f1] text-[#d64d4d]"
                : "border-[#e7e0d9] bg-white/90 text-[#4d564a] hover:scale-105"
            }`}
          >
            {isFavoriteLoading ? (
              <span className="text-xs font-bold">...</span>
            ) : (
              <Heart className={`size-4 ${isFavorite ? "fill-current" : ""}`} />
            )}
          </button>

          <button
            type="button"
            aria-label={isInCart ? `${item.name} موجود في السلة` : `إضافة ${item.name} إلى السلة`}
            onClick={() => void handleAddToCart()}
            disabled={isCartLoading || isInCart}
            className={`flex h-10 w-10 items-center justify-center rounded-full border shadow-[0_12px_20px_-12px_rgba(61,79,47,0.8)] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${
              isInCart
                ? "border-[#b8c8a9] bg-[#dfead8] text-[#52663c]"
                : "border-[#dfe7d6] bg-[#edf2e8] text-[#3d4b2f] hover:scale-105"
            }`}
          >
            {isCartLoading ? (
              <span className="text-xs font-bold">...</span>
            ) : isInCart ? (
              <span className="text-sm font-black">✓</span>
            ) : (
              <ShoppingBag className="size-4" />
            )}
          </button>
        </div>
      </div>

      <div className="space-y-3 p-4">
        <h3 className="text-base font-bold text-[#34392d]">{item.name}</h3>
        <p className="text-xs text-[#85877d]">{item.type}</p>

        <div className="flex items-center justify-between gap-2 pt-2">
          <Link
            to={ROUTES.productDetails(item.id)}
            className="inline-flex items-center justify-center rounded-full bg-white px-3 py-2 text-xs font-bold text-[#52683b] shadow-sm transition hover:bg-[#f2eee5]"
          >
            تفاصيل المنتج
          </Link>

          <span className="text-base font-extrabold text-[#34392d]">{item.price.toLocaleString("ar-SA")} ر.س</span>
        </div>
      </div>
    </motion.article>
  );
}

export { HomePage };