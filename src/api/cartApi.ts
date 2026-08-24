import { customerApi } from "@/api/customerApi";

export const cartApi = {
  getCart: async () => {
    const { data } = await customerApi.get("/customer/cart");
    return data;
  },

  addToCart: async (productId: string | number, quantity = 1) => {
    const payload = {
      product_id: productId,
      quantity,
    };

    const { data } = await customerApi.post("/customer/cart/items", payload);
    return data;
  },

  updateItem: async (cartItemId: string | number, quantity: number) => {
    const { data } = await customerApi.put(`/customer/cart/items/${cartItemId}`, { quantity });
    return data;
  },

  removeItem: async (cartItemId: string | number) => {
    const { data } = await customerApi.delete(`/customer/cart/items/${cartItemId}`);
    return data;
  },
};
