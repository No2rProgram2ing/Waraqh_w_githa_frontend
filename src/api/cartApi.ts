import { customerApi } from "@/api/customerApi";

export const cartApi = {
  addToCart: async (productId: string | number, quantity = 1) => {
    const payload = {
      product_id: productId,
      quantity,
    };

    const { data } = await customerApi.post("/customer/cart/add", payload);
    return data;
  },
};
