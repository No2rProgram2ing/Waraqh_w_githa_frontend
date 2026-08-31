import { create } from "zustand";
import { customerAuthStorage } from "@/features/auth-customer/services/customerAuthStorage";
import { getProductImage } from "@/features/products/data/productImages";

const GUEST_CART_KEY = "guest_cart";

function readGuestCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(GUEST_CART_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeGuestCart(items: CartItem[]): void {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
  }
}

function clearGuestCart(): void {
  if (typeof window !== "undefined") window.localStorage.removeItem(GUEST_CART_KEY);
}

interface ApiCartItem {
  id: string | number;
  quantity?: number;
  product?: {
    id?: string | number;
    name?: string;
    description?: string | null;
    price?: string | number;
    image?: string | null;
  };
  product_id?: string | number;
}

export interface CartItem {
  id: string;
  productId?: string;
  name: string;
  subtitle: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartState {
  items: CartItem[];
  setItems: (items: CartItem[]) => void;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  updateQuantity: (id: string, amount: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  syncGuestCart: () => Promise<void>;
}

export const useCartStore = create<CartState>()((set) => ({
  items: readGuestCart(),
  setItems: (items) => {
    set({ items });
    if (!customerAuthStorage.getToken()) writeGuestCart(items);
  },
  addItem: (item) =>
    set((state) => {
      const existingItem = state.items.find(
        (currentItem) => currentItem.id === item.id || (
          item.productId && currentItem.productId === item.productId
        ),
      );
      const items = existingItem
        ? state.items.map((currentItem) => currentItem.id === existingItem.id
            ? { ...currentItem, quantity: currentItem.quantity + 1 }
            : currentItem)
        : [...state.items, { ...item, quantity: 1 }];
      if (!customerAuthStorage.getToken()) writeGuestCart(items);
      return { items };
    }),
  updateQuantity: (id, amount) =>
    set((state) => {
      const items = state.items.map((item) => item.id === id
        ? { ...item, quantity: Math.max(1, item.quantity + amount) }
        : item);
      if (!customerAuthStorage.getToken()) writeGuestCart(items);
      return { items };
    }),
  removeItem: (id) =>
    set((state) => {
      const items = state.items.filter((item) => item.id !== id);
      if (!customerAuthStorage.getToken()) writeGuestCart(items);
      return { items };
    }),
  clearCart: () => {
    clearGuestCart();
    set({ items: [] });
  },
  syncGuestCart: async () => {
    if (!customerAuthStorage.getToken()) return;
    const guestItems = readGuestCart();
    if (guestItems.length === 0) return;

    try {
      const { cartApi } = await import("@/api/cartApi");

      // Try bulk sync first (preferred)
      let bulkOk = false;
      try {
        await cartApi.sync(
          guestItems.map((item) => ({ product_id: item.productId ?? item.id, quantity: item.quantity })),
        );
        bulkOk = true;
      } catch (bulkErr) {
        // Backend might not support bulk endpoint or returned an error for some items.
        console.warn("Bulk cart sync failed, falling back to per-item add:", bulkErr);
      }

      // If bulk sync failed, try adding items individually (best-effort)
      let addedCount = 0;
      if (!bulkOk) {
        for (const gi of guestItems) {
          try {
            await cartApi.addToCart(gi.productId ?? gi.id, gi.quantity ?? 1);
            addedCount += 1;
          } catch (err) {
            console.warn("Failed to add guest item to server cart", gi, err);
          }
        }
      }

      // Fetch server cart to reflect authoritative state
      const response = await cartApi.getCart();
      const rawItems = response?.data?.items;
      const apiItems = Array.isArray(rawItems) ? rawItems : rawItems?.data ?? [];

      const mapped = (apiItems as ApiCartItem[]).map((item) => ({
        id: String(item.id),
        productId: String(item.product?.id ?? item.product_id),
        name: item.product?.name ?? "",
        subtitle: item.product?.description ?? "",
        price: Number(item.product?.price ?? 0),
        quantity: Number(item.quantity ?? 1),
        image: getProductImage(item.product?.id ?? item.product_id ?? item.id),
      }));

      set({ items: mapped });

      // Only clear guest cart if we successfully migrated something OR server now has items
      const serverTotalQty = mapped.reduce((s, it) => s + it.quantity, 0);
      const guestTotalQty = guestItems.reduce((s, it) => s + (it.quantity ?? 0), 0);

      if (bulkOk || addedCount > 0 || serverTotalQty >= guestTotalQty) {
        clearGuestCart();
      } else {
        console.warn("Guest cart not cleared: no evidence of successful migration");
      }
    } catch (error) {
      console.error("Failed to sync guest cart", error);
    }
  },

}));
