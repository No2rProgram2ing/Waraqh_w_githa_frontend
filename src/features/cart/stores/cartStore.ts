import { create } from "zustand";

export interface CartItem {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  updateQuantity: (id: string, amount: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  addItem: (item) =>
    set((state) => {
      const existingItem = state.items.find((currentItem) => currentItem.id === item.id);
      if (existingItem) {
        return {
          items: state.items.map((currentItem) => currentItem.id === item.id
            ? { ...currentItem, quantity: currentItem.quantity + 1 }
            : currentItem),
        };
      }
      return { items: [...state.items, { ...item, quantity: 1 }] };
    }),
  updateQuantity: (id, amount) =>
    set((state) => ({
      items: state.items.map((item) => item.id === id
        ? { ...item, quantity: Math.max(1, item.quantity + amount) }
        : item),
    })),
  removeItem: (id) =>
    set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
  clearCart: () => set({ items: [] }),
}));
