import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowLeft, Heart, ShoppingBag, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { CatalogLayout } from "@/layouts/CatalogLayout";
import { ROUTES } from "@/routes/paths";
import { customerApi } from "@/api/customerApi";
import { cartApi } from "@/api/cartApi";
import { favoritesApi } from "@/api/favoritesApi";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { useCartStore } from "@/features/cart/stores/cartStore";

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

const categories = [
  { name: "إضاءة وأجواء", image: images.lamp },
  { name: "أثاث ريفي", image: images.chair },
  { name: "سلال ومنسوجات", image: images.basket },
];

interface FeaturedProductRecord {
  id: string | number;
  name: string;
  description?: string | null;
  price?: number | string;
  is_bestseller?: boolean;
  is_new?: boolean;
  media?: Array<{ url?: string | null; is_primary?: boolean } | null>;
  category?: { name?: string } | null;
}

interface FeaturedProductsResponse {
  data: {
    bestsellers?: FeaturedProductRecord[];
    new_arrivals?: FeaturedProductRecord[];
  };
}

interface HomeProduct {
  id: string;
  name: string;
  type: string;
  image: string;
  description: string;
  price: number;
}

const fallbackProductImage = images.basket;

function normalizeHomeProduct(product: FeaturedProductRecord): HomeProduct {
  const primaryMedia = product.media?.find((media) => media?.is_primary) ?? product.media?.[0];

  return {
    id: String(product.id),
    name: product.name,
    type: product.category?.name ?? "منتج حرفي",
    image: primaryMedia?.url ?? fallbackProductImage,
    description: product.description ?? "",
    price: Number(product.price ?? 0),
  };
}

function HomePage() {
  const [bestsellers, setBestsellers] = useState<HomeProduct[]>([]);
  const [newArrivals, setNewArrivals] = useState<HomeProduct[]>([]);
  const [isFeaturedLoading, setIsFeaturedLoading] = useState(true);
  const [featuredError, setFeaturedError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    customerApi.get<FeaturedProductsResponse>("/products/featured")
      .then(({ data }) => {
        if (!isMounted) return;
        setBestsellers((data.data.bestsellers ?? []).map(normalizeHomeProduct));
        setNewArrivals((data.data.new_arrivals ?? []).map(normalizeHomeProduct));
      })
      .catch((error) => {
        console.error("Failed to load featured products", error);
        if (isMounted) setFeaturedError(true);
      })
      .finally(() => {
        if (isMounted) setIsFeaturedLoading(false);
      });

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

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8"><SectionHeading eyebrow="تشكيلة الموسم" title="تسوق حسب الفئة" /><div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">{categories.map((category) => <Link to={ROUTES.products} key={category.name} className="group relative aspect-[.86] overflow-hidden"><img src={category.image} alt={category.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" /><div className="absolute inset-x-5 bottom-5 text-white"><h3 className="text-xl font-bold">{category.name}</h3><span className="mt-2 inline-flex items-center gap-1 text-xs text-white/80">استكشف المجموعة <ArrowLeft className="size-3" /></span></div></Link>)}</div></section>

      <section className="grid bg-[#eee9df] lg:grid-cols-2"><div className="min-h-[420px] bg-cover bg-center" style={{ backgroundImage: `url(${images.artisan})` }} /><div className="flex items-center px-8 py-14 sm:px-16"><div className="max-w-xl"><p className="text-sm font-bold text-[#8b7652]">حكاية من أيدينا</p><h2 className="mt-4 text-3xl font-bold leading-relaxed text-[#4f6236] sm:text-4xl">نمنح الحرفة حياة جديدة، ونحفظ أثرها في كل قطعة</h2><p className="mt-5 leading-8 text-[#67665c]">خلف كل منتج حكاية إنسان ومكان. نعمل مع حرفيين محليين لنقدم تصاميم تحترم الطبيعة وتحتفي بالتفاصيل التي لا تصنعها الآلات.</p><Link to={ROUTES.aboutUs} className="mt-7 inline-flex items-center gap-2 border border-[#718254] px-5 py-3 text-sm font-bold text-[#4f6236]">اقرأ قصتنا <ArrowLeft className="size-4" /></Link></div></div></section>

      <section className="bg-[#53683b] px-5 py-16 text-white sm:px-8"><div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[.9fr_1.1fr]"><div className="grid grid-cols-2 gap-3"><img src={images.mountain} alt="جبال اليمن" className="h-44 w-full object-cover" /><img src={images.basket} alt="منتج طبيعي" className="mt-8 h-44 w-full object-cover" /></div><div><p className="text-sm text-[#d9d5a6]">رحلة القطعة</p><h2 className="mt-3 text-3xl font-bold leading-relaxed sm:text-4xl">من الأرض إلى منزلك</h2><p className="mt-4 max-w-xl leading-8 text-white/80">نختار المواد بعناية، ونعمل مع أيادٍ تعرف قيمة التفاصيل، لتصل إليك قطعة صادقة تعيش طويلًا وتزداد جمالًا مع الوقت.</p><Link to={ROUTES.products} className="mt-7 inline-flex items-center gap-2 bg-white px-5 py-3 text-sm font-bold text-[#53683b]">تسوق القطع المستدامة <ArrowLeft className="size-4" /></Link></div></div></section>

      <section className="relative min-h-[430px] bg-cover bg-center px-5 py-20 text-center text-white" style={{ backgroundImage: `linear-gradient(rgb(28 37 24 / .42), rgb(28 37 24 / .55)), url(${images.home})` }}><div className="mx-auto max-w-xl"><p className="text-sm text-[#e1d2b5]">مجموعة تستوطن الجديدة</p><h2 className="mt-4 text-3xl font-bold sm:text-5xl">بيتك يحكي حكايتك</h2><p className="mt-5 leading-8 text-white/85">أضف لمسات دافئة تحمل روح اليمن إلى مساحتك.</p><Link to={ROUTES.products} className="mt-7 inline-flex bg-[#53683b] px-6 py-3 text-sm font-bold">شاهد المجموعة <ArrowLeft className="mr-2 size-4" /></Link></div></section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8"><SectionHeading eyebrow="صوت عملائنا" title="قالوا عنا" /><div className="mt-8 grid gap-5 md:grid-cols-3">{["قطعة جميلة جدًا والتغليف كان رائعًا. واضح الاهتمام بكل تفصيلة.", "أحببت القصة خلف المنتج، وصلتني قطعة تحمل معنى وليس مجرد ديكور.", "تجربة مميزة من أول طلب حتى التوصيل. سأعود للتسوق بالتأكيد."].map((quote) => <article key={quote} className="border border-[#ddd8cf] bg-white p-6"><div className="flex gap-1 text-[#c3954c]">{Array.from({ length: 5 }).map((_, index) => <Star key={index} className="size-3 fill-current" />)}</div><p className="mt-5 text-sm leading-8 text-[#565950]">“{quote}”</p><div className="mt-5 flex items-center gap-2 text-xs font-bold"><span className="size-7 rounded-full bg-[#d9cdbb]" /> عميلة ورقة وجذع</div></article>)}</div></section>

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
  const [isFavorite, setIsFavorite] = useState(false);
  const [isCartLoading, setIsCartLoading] = useState(false);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = async () => {
    if (isCartLoading) return;

    try {
      setIsCartLoading(true);
      await cartApi.addToCart(item.id);
      addItem({ id: item.id, name: item.name, subtitle: item.description, price: item.price, image: item.image });
      showSuccessToast("تمت إضافة المنتج إلى السلة");
    } catch (error) {
      console.error(error);
      showErrorToast("تعذر إضافة المنتج إلى السلة، يرجى المحاولة مرة أخرى.");
    } finally {
      setIsCartLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (isFavoriteLoading) return;

    try {
      setIsFavoriteLoading(true);
      const favoriteState = await favoritesApi.toggleFavorite(item.id);
      setIsFavorite(favoriteState);
      showSuccessToast(favoriteState ? "تمت إضافة المنتج إلى المفضلة" : "تمت إزالة المنتج من المفضلة");
    } catch (error) {
      console.error(error);
      showErrorToast("تعذر تحديث قائمة المفضلة، يرجى المحاولة مرة أخرى.");
    } finally {
      setIsFavoriteLoading(false);
    }
  };

  return <motion.article initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .08 }} className="group"><div className="relative aspect-[.8] overflow-hidden bg-[#eee9df]"><img src={item.image} alt={item.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /><button type="button" aria-label={isFavorite ? `إزالة ${item.name} من المفضلة` : `إضافة ${item.name} للمفضلة`} onClick={() => void handleToggleFavorite()} disabled={isFavoriteLoading} className="absolute left-3 top-3 rounded-full bg-white/90 p-2 text-[#52683b] disabled:opacity-60"><Heart className={`size-4 ${isFavorite ? "fill-current" : ""}`} /></button><div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-2"><Link to={ROUTES.productDetails(item.id)} className="bg-white px-3 py-2 text-xs font-bold text-[#52683b] shadow-sm transition hover:bg-[#f2eee5]">تفاصيل المنتج</Link><button type="button" onClick={() => void handleAddToCart()} disabled={isCartLoading} aria-label={`إضافة ${item.name} إلى السلة`} className="flex size-9 items-center justify-center rounded-full bg-[#52683b] text-white disabled:opacity-60">{isCartLoading ? <span className="text-xs font-bold">...</span> : <ShoppingBag className="size-4" />}</button></div></div><h3 className="mt-4 text-base font-bold text-[#34392d]">{item.name}</h3><p className="mt-1 text-xs text-[#85877d]">{item.type}</p></motion.article>;
}

export { HomePage };