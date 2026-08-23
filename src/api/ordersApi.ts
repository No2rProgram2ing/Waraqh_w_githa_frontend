import { customerApi } from "@/api/customerApi";

export const ordersApi = {
  getMyOrders: (page = 1) => customerApi.get(`/customer/orders`, { params: { page } }),
  getOrder: (id: string | number) => customerApi.get(`/customer/orders/${id}`),
};
