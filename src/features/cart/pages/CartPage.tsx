import { motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import { CatalogLayout } from "@/layouts/CatalogLayout";
import { ROUTES } from "@/routes/paths";
import { useEffect } from "react";
import { cartApi } from "@/api/cartApi";
import { customerAuthStorage } from "@/features/auth-customer/services/customerAuthStorage";
import { useCartStore, type CartItem } from "@/features/cart/stores/cartStore";
import { getProductImage } from "@/features/products/data/productImages";

const formatPrice = (price: number) => `${price.toLocaleString("ar-SA")} ر.س`;

interface ApiCartItem {
  id: string | number;
  quantity: number;
  product: {
    id: string | number;
    name: string;
    price: number | string;
    description?: string | null;
    image?: string | null;
  };
}

interface ApiCartResponse {
  data?: {
    items?: ApiCartItem[] | { data?: ApiCartItem[] };
  };
}

function mapCartItems(response: ApiCartResponse): CartItem[] {
  const items = response.data?.items;
  const apiItems = Array.isArray(items) ? items : items?.data ?? [];

  return apiItems.map((item) => ({
    id: String(item.id),
    productId: String(item.product.id),
    name: item.product.name,
    subtitle: item.product.description ?? "",
    price: Number(item.product.price),
    quantity: item.quantity,
    image: item.product.image ?? "",
  }));
}

export function CartPage() {
  const items = useCartStore((state) => state.items);
  const setItems = useCartStore((state) => state.setItems);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    if (!customerAuthStorage.getToken()) return;

    cartApi.getCart()
      .then((response) => setItems(mapCartItems(response as ApiCartResponse)))
      .catch((error) => console.error("Failed to load customer cart", error));
  }, [setItems]);

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 30 : 0;
  const total = subtotal + shipping;

  const handleQuantityChange = async (item: CartItem, amount: number) => {
    const quantity = Math.max(1, item.quantity + amount);
    try {
      if (customerAuthStorage.getToken()) {
        await cartApi.updateItem(item.id, quantity);
      }
      updateQuantity(item.id, amount);
    } catch (error) {
      console.error("Failed to update cart item", error);
    }
  };

  const handleRemoveItem = async (item: CartItem) => {
    try {
      if (customerAuthStorage.getToken()) {
        await cartApi.removeItem(item.id);
      }
      removeItem(item.id);
    } catch (error) {
      console.error("Failed to remove cart item", error);
    }
  };

  const handleClearCart = async () => {
    try {
      await cartApi.clearCart();
      clearCart();
    } catch (error) {
      console.error("Failed to clear cart", error);
    }
  };

  return (
    <CatalogLayout>
      <main dir="rtl" className="min-h-[calc(100vh-20rem)] bg-[#fbf9f5] px-5 py-12 text-[#26291f] sm:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10">
            <p className="text-xs font-bold tracking-[0.16em] text-[#8b7652]">سلة التسوق</p>
            <h1 className="mt-2 text-3xl font-bold text-[#52663c] sm:text-4xl">سلة التسوق</h1>
            <p className="mt-2 text-sm text-[#77766d]">لديك {items.length} منتجات في سلتك</p>
          </div>

          {items.length === 0 ? (
            <section className="flex min-h-[360px] flex-col items-center justify-center border border-dashed border-[#d8d0c3] bg-[#f8f5ef] px-5 text-center">
              <ShoppingBag className="size-12 text-[#9b987f]" />
              <h2 className="mt-5 text-2xl font-bold text-[#52663c]">السلة فارغة</h2>
              <p className="mt-2 text-sm text-[#77766d]">أضف قطعة تحبها لتظهر هنا.</p>
              <Link to={ROUTES.products} className="mt-6 rounded-sm bg-[#52663c] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#3e522c]">تصفح المنتجات</Link>
            </section>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[1fr_330px] lg:items-start">
              <section className="space-y-4">
                {items.map((item, index) => (
                  <motion.article key={item.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }} className="flex flex-col gap-5 border-b border-[#e1dbd1] bg-[#fbf9f5] px-1 py-4 sm:flex-row sm:items-center">
                    <img src={getProductImage(item.productId ?? item.id)} alt={item.name} className="h-28 w-full object-cover sm:h-24 sm:w-28" />
                    <div className="min-w-0 flex-1">
                      <h2 className="text-lg font-bold text-[#52663c]">{item.name}</h2>
                      <p className="mt-1 text-xs text-[#77766d]">{item.subtitle}</p>
                      <p className="mt-3 text-base font-extrabold text-[#795238]">{formatPrice(item.price)}</p>
                    </div>
                    <div className="flex items-center justify-between gap-5 sm:flex-col sm:items-end">
                      <div className="flex items-center gap-3 rounded-full border border-[#d8d0c3] bg-white px-2 py-1"><button type="button" onClick={() => void handleQuantityChange(item, 1)} aria-label="زيادة الكمية" className="text-[#52663c]"><Plus className="size-4" /></button><span className="min-w-5 text-center text-sm font-bold">{item.quantity}</span><button type="button" onClick={() => void handleQuantityChange(item, -1)} aria-label="تقليل الكمية" className="text-[#52663c]"><Minus className="size-4" /></button></div>
                      <button type="button" onClick={() => void handleRemoveItem(item)} className="inline-flex items-center gap-1 text-xs text-[#8b7652] hover:text-[#a04a3a]"><Trash2 className="size-4" /> حذف</button>
                    </div>
                  </motion.article>
                ))}
                <div className="flex items-center justify-between pt-3">
                  <Link to={ROUTES.products} className="inline-flex items-center gap-2 text-sm font-bold text-[#52663c] hover:text-[#3e522c]">متابعة التسوق <span>←</span></Link>
                  <button type="button" onClick={() => void handleClearCart()} className="text-xs text-[#8b7652] hover:text-[#a04a3a]">إفراغ السلة</button>
                </div>
              </section>

              <aside className="border border-[#e1dbd1] bg-[#f1ede5] p-6 shadow-sm">
                <h2 className="text-xl font-bold text-[#52663c]">ملخص الطلب</h2>
                <div className="mt-6 space-y-4 border-b border-[#d8d0c3] pb-5 text-sm"><div className="flex justify-between"><span className="text-[#77766d]">المجموع الفرعي</span><strong>{formatPrice(subtotal)}</strong></div><div className="flex justify-between"><span className="text-[#77766d]">الشحن</span><strong>{formatPrice(shipping)}</strong></div></div>
                <div className="flex items-center justify-between py-5 text-lg font-extrabold text-[#52663c]"><span>الإجمالي</span><span>{formatPrice(total)}</span></div>
                <Link to={ROUTES.checkout} className="block w-full rounded-sm bg-[#52663c] px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-[#3e522c]">إتمام الطلب <span className="mr-2">←</span></Link>
                <div className="mt-6 grid grid-cols-3 gap-2 border-t border-[#d8d0c3] pt-5 text-center text-[10px] text-[#77766d]"><div><ShieldCheck className="mx-auto mb-2 size-4 text-[#b28a3d]" />دفع آمن</div><div><Truck className="mx-auto mb-2 size-4 text-[#b28a3d]" />شحن سريع</div><div><RotateCcw className="mx-auto mb-2 size-4 text-[#b28a3d]" />إرجاع سهل</div></div>
              </aside>
            </div>
          )}
        </div>
      </main>
    </CatalogLayout>
  );
}
