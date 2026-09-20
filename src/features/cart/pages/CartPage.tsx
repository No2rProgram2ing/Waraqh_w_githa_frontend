import { motion } from "framer-motion";
import { ShoppingBag, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";
import { CatalogLayout } from "@/layouts/CatalogLayout";
import { ROUTES } from "@/routes/paths";
import { useEffect, useRef, useState } from "react";
import { cartApi } from "@/api/cartApi";
import { customerAuthStorage } from "@/features/auth-customer/services/customerAuthStorage";
import { useCartStore, type CartItem } from "@/features/cart/stores/cartStore";
import { MAX_CART_QUANTITY } from "@/features/cart/constants";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { CartReservationTimer } from "@/features/cart/components/CartReservationTimer";
import { CartItem as CartItemView } from "@/features/cart/components/CartItem";

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
    reserved_quantity?: number;
    available_stock?: number;
  };
  reserved_quantity?: number;
  is_reserved?: boolean;
  is_expired?: boolean;
}

interface ApiCartResponse {
  items?: ApiCartItem[] | { data?: ApiCartItem[] };
  expires_at?: string | number | null;
  data?: {
    expires_at?: string | number | null;
    items?: ApiCartItem[] | { data?: ApiCartItem[] };
    data?: {
      expires_at?: string | number | null;
      items?: ApiCartItem[] | { data?: ApiCartItem[] };
    };
  };
}

function mapCartItems(response: ApiCartResponse): CartItem[] {
  const payload = response.data?.data ?? response.data ?? response;
  const items = payload?.items ?? payload?.data?.items;
  const apiItems = Array.isArray(items) ? items : items?.data ?? [];

  return apiItems.map((item) => {
    const reservedQuantity = Math.min(
      item.quantity,
      Math.max(0, Number(item.reserved_quantity ?? 0)),
    );
    const isReserved =
      Boolean(item.is_reserved ?? reservedQuantity > 0) &&
      reservedQuantity > 0 &&
      !item.is_expired;

    return {
      id: String(item.id),
      productId: String(item.product.id),
      name: item.product.name,
      subtitle: item.product.description ?? "",
      price: Number(item.product.price),
      quantity: item.quantity,
      image: item.product.image ?? "",
      stock: Number(item.product.available_stock ?? 0),
      availableStock: Number(item.product.available_stock ?? 0),
      reservedQuantity,
      reservedUntil: isReserved
        ? payload?.expires_at ?? response.expires_at ?? null
        : null,
      isReserved,
    };
  });
}

function getCartExpiry(response: ApiCartResponse): number | null {
  const payload = response.data?.data ?? response.data ?? response;
  const value = payload?.expires_at ?? payload?.reserved_until;
  if (!value) return null;

  const expiry = new Date(value).getTime();
  return Number.isFinite(expiry) ? expiry : null;
}

function isExpectedStockSyncError(error: unknown): boolean {
  if (!axios.isAxiosError(error)) return false;

  const status = error.response?.status;
  if (![400, 409, 422].includes(status ?? 0)) return false;

  const data = error.response?.data;
  const message = typeof data?.message === "string" ? data.message : "";
  const details = typeof data?.detail === "string" ? data.detail : "";
  const payload = `${message} ${details} ${JSON.stringify(data ?? {})}`.toLowerCase();

  return /stock|مخزون|available|متاح|reserve|حجز|quantity|كمية|inventory|مخزون|insufficient|not enough/i.test(payload);
}

export function CartPage() {
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);
  const hasLocalCartMutation = useRef(false);
  const items = useCartStore((state) => state.items);
  const isCartHydrated = useCartStore((state) => state.isHydrated);
  const setItems = useCartStore((state) => state.setItems);
  const reserveCart = useCartStore((state) => state.reserveCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const updateInventory = useCartStore((state) => state.updateInventory);
  const setReservationExpiry = useCartStore((state) => state.setReservationExpiry);
  const refreshCart = useCartStore((state) => state.refreshCart);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    if (!isCartHydrated || !customerAuthStorage.getToken()) return;

    cartApi.getCart()
      .then((response) => {
        if (hasLocalCartMutation.current) return;

        const cartResponse = response as ApiCartResponse;
        const loadedItems = mapCartItems(cartResponse);
        const expiry = getCartExpiry(cartResponse);
        const persistedItems = useCartStore.getState().items;

        // Keep the last persisted cart when the backend does not yet have data or
        // returns an empty result for the current user. Refreshing the page should
        // not wipe a valid local cart just because the server is temporarily empty.
        if (persistedItems.length > 0 && loadedItems.length === 0) {
          setItems(persistedItems, useCartStore.getState().reservationExpiresAt ?? expiry);
          return;
        }

        // For authenticated users the API is the source of truth. Do not keep
        // persisted entries whose cart-item IDs no longer exist on the server.
        setItems(loadedItems, expiry);
      })
      .catch((error) => console.error("Failed to load customer cart", error));
  }, [isCartHydrated, setItems]);

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const shippingFee = 0;
  const total = subtotal + shippingFee;

  const handleQuantityChange = async (item: CartItem, amount: number) => {
    if (updatingItemId === item.id) return;

    const previousQuantity = item.quantity;
    const quantity = Math.min(MAX_CART_QUANTITY, Math.max(1, previousQuantity + amount));
    if (quantity === previousQuantity) return;

    hasLocalCartMutation.current = true;
    setUpdatingItemId(item.id);
    updateQuantity(item.id, quantity);

    try {
      if (customerAuthStorage.getToken()) {
        let response;
        let requestItemId = item.id;
        try {
          response = await cartApi.updateItem(requestItemId, quantity);
        } catch (error: unknown) {
          if (!axios.isAxiosError(error) || error.response?.status !== 404) {
            throw error;
          }

          // A persisted cart can contain an ID removed by the backend. Refresh
          // once and retry with the current cart-item ID for this product.
          const freshResponse = (await cartApi.getCart()) as ApiCartResponse;
          const freshItems = mapCartItems(freshResponse);
          const freshItem = freshItems.find((entry) => entry.productId === item.productId);

          if (!freshItem) {
            updateQuantity(item.id, previousQuantity);
            showErrorToast("تعذر العثور على المنتج في السلة على الخادم، تمت استعادة الكمية السابقة.");
            return;
          }

          setItems(freshItems, getCartExpiry(freshResponse));
          requestItemId = freshItem.id;
          const freshQuantity = Math.min(
            MAX_CART_QUANTITY,
            Math.max(1, freshItem.quantity + amount),
          );
          updateQuantity(requestItemId, freshQuantity);
          response = await cartApi.updateItem(requestItemId, freshQuantity);
        }

        const serverItem = response?.data?.data?.item
          ?? response?.data?.item
          ?? response?.item
          ?? response?.data?.data
          ?? response?.data;
        const serverQuantity = Number(serverItem?.quantity);

        if (Number.isFinite(serverQuantity) && serverQuantity > 0) {
          updateQuantity(requestItemId, serverQuantity);
        }

        if (serverItem?.product) {
          updateInventory(
            requestItemId,
            Number(serverItem.reserved_quantity ?? serverItem.product.reserved_quantity ?? 0),
            Number(serverItem.product.available_stock ?? 0),
          );
        }

        const activeReservation = Boolean(
          serverItem?.expires_at ||
          (useCartStore.getState().reservationExpiresAt && useCartStore.getState().reservationExpiresAt > Date.now()) ||
          items.some((entry) => entry.isReserved && (entry.reservedQuantity ?? 0) > 0)
        );

        if (serverItem?.expires_at) {
          setReservationExpiry(new Date(serverItem.expires_at).getTime());
        }

        if (activeReservation || useCartStore.getState().reservationExpiresAt === null) {
          await reserveCart();
        }
      } else {
        await reserveCart();
      }
    } catch (error: unknown) {
      const isTransientSyncIssue = axios.isAxiosError(error)
        ? [400, 404, 405, 409, 422, 500, 502, 503].includes(error.response?.status ?? 0)
        : false;

      if (isExpectedStockSyncError(error)) {
        try {
          await refreshCart();
          await reserveCart();
        } catch {
          // Ignore reconciliation failures here so the cart keeps the latest quantity.
        }
        return;
      }

      // Keep the optimistic local update when the server cannot confirm the change.
      // This avoids the cart appearing to "stick" on the old quantity while the
      // backend is temporarily unavailable or the cart endpoint is missing.
      if (!isTransientSyncIssue) {
        updateQuantity(item.id, previousQuantity);
      }

      if (axios.isAxiosError(error)) {
        console.error("Failed to update cart item", {
          status: error.response?.status,
          response: error.response?.data,
          request: error.config?.url,
        });
      } else {
        console.error("Failed to update cart item", error);
      }

      if (!isTransientSyncIssue) {
        showErrorToast(
          axios.isAxiosError(error) && typeof error.response?.data?.message === "string"
            ? error.response.data.message
            : "تعذر تحديث كمية المنتج، تمت استعادة الكمية السابقة.",
        );
      }
    } finally {
      setUpdatingItemId(null);
      hasLocalCartMutation.current = false;
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

  const handleRereserve = async (item: CartItem) => {
    if (!customerAuthStorage.getToken()) {
      await reserveCart();
      return;
    }

    try {
      const renewed = await reserveCart();
      if (!renewed) {
        throw new Error("Cart reservation was not renewed.");
      }
      await refreshCart();
      showSuccessToast("تم إعادة حجز كميات السلة بنجاح لمدة 5 دقائق.");
    } catch (error: any) {
      console.error("Failed to rereserve cart", error);
      showErrorToast(
        error?.response?.data?.message ?? "لا توجد كمية كافية لإعادة حجز هذا المنتج حالياً.",
      );
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
                <CartReservationTimer variant="banner" />
                {items.map((item, index) => (
                  <CartItemView
                    key={item.id}
                    item={item}
                    index={index}
                    isUpdating={updatingItemId === item.id}
                    maxQuantity={MAX_CART_QUANTITY}
                    onIncrease={() => void handleQuantityChange(item, 1)}
                    onDecrease={() => void handleQuantityChange(item, -1)}
                    onRemove={() => void handleRemoveItem(item)}
                    onRereserve={() => void handleRereserve(item)}
                  />
                ))}
                <div className="flex items-center justify-between pt-3">
                  <Link to={ROUTES.products} className="inline-flex items-center gap-2 text-sm font-bold text-[#52663c] hover:text-[#3e522c]">متابعة التسوق <span>←</span></Link>
                  <button type="button" onClick={() => void handleClearCart()} className="text-xs text-[#8b7652] hover:text-[#a04a3a]">إفراغ السلة</button>
                </div>
              </section>

              <aside className="border border-[#e1dbd1] bg-[#f1ede5] p-6 shadow-sm">
                <h2 className="text-xl font-bold text-[#52663c]">ملخص الطلب</h2>
                <div className="mt-6 space-y-4 border-b border-[#d8d0c3] pb-5 text-sm"><div className="flex justify-between"><span className="text-[#77766d]">المجموع الفرعي</span><strong>{formatPrice(subtotal)}</strong></div><div className="flex justify-between"><span className="text-[#77766d]">الشحن</span><strong>{shippingFee === 0 ? "غير محسوبة ضمن الإجمالي" : formatPrice(shippingFee)}</strong></div></div>
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
