import { customerApi } from "@/api/customerApi";

export const ordersApi = {
  createOrder: (payload: {
    address_id: string | number;
    order_type: "ready_made" | "custom" | "mixed";
    items: Array<{ product_id: string | number; quantity: number }>;
  }) => customerApi.post("/customer/orders", payload),
  getMyOrders: (page = 1) => customerApi.get(`/customer/orders`, { params: { page } }),
  getOrder: (id: string | number) => customerApi.get(`/customer/orders/${id}`),
  // Fetch tracking/status details for a single order
  getTracking: (id: string | number) => customerApi.get(`/customer/orders/${id}/tracking`),
};
