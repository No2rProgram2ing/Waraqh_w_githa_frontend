import { customerApi } from "@/api/customerApi";
import { customerAuthStorage } from "@/features/auth-customer/services/customerAuthStorage";

export interface CartSyncItem {
  product_id: string;
  quantity: number;
}

export const cartApi = {
  getCart: async () => {
    if (!customerAuthStorage.getToken()) return { data: { items: [] } };
    const { data } = await customerApi.get("/customer/cart");
    return data;
  },

  addToCart: async (productId: string | number, quantity = 1) => {
    if (!customerAuthStorage.getToken()) return { data: null };
    const payload = {
      product_id: productId,
      quantity,
    };

    const { data } = await customerApi.post("/customer/cart/items", payload);
    return data;
  },

  updateItem: async (cartItemId: string | number, quantity: number) => {
    if (!customerAuthStorage.getToken()) return { data: null };
    const { data } = await customerApi.put(`/customer/cart/items/${cartItemId}`, { quantity });
    return data;
  },

  removeItem: async (cartItemId: string | number) => {
    if (!customerAuthStorage.getToken()) return { data: null };
    const { data } = await customerApi.delete(`/customer/cart/items/${cartItemId}`);
    return data;
  },

  clearCart: async () => {
    if (!customerAuthStorage.getToken()) return { data: null };
    const { data } = await customerApi.delete("/customer/cart");
    return data;
  },

  sync: async (items: CartSyncItem[]) => {
    const { data } = await customerApi.post("/customer/cart/sync", { items });
    return data;
  },
};
