import { useQuery } from "@tanstack/react-query";
import { ordersApi } from "@/api/ordersApi";
import type { OrderItem as UIOrderItem } from "@/features/orders/types";

function mapOrderResourceToUI(order: any): UIOrderItem {
  const statusMap: Record<string, string> = {
    received: "مستلم",
    in_production: "قيد التنفيذ",
    in_transit: "قيد الشحن",
    cancelled: "ملغي",
  };

  const items = (order.items || []).map((it: any) => ({
    id: String(it.id),
    name: it.product?.name ?? "",
    quantity: it.quantity ?? 0,
    unitPrice: Number(it.price ?? it.unit_price ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
  }));

  const total = Number(order.total ?? order.total_amount ?? 0);
  const createdAt = order.created_at ? new Date(order.created_at) : null;

  return {
    id: String(order.id),
    slug: order.order_number ?? undefined,
    year: createdAt ? String(createdAt.getFullYear()) : "",
    month: createdAt ? String(createdAt.getMonth() + 1).padStart(2, "0") : "",
    price: total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    status: statusMap[order.status?.value ?? order.status] ?? String(order.status ?? ""),
    isActive: order.status?.value !== 'cancelled' && order.status !== 'cancelled',
    items,
  };
}

export function useOrders(page = 1) {
  return useQuery({
    queryKey: ["orders", page],
    queryFn: async () => {
      const res = await ordersApi.getMyOrders(page);
      return res.data;
    },
    select: (raw: any) => {
      // raw expected to be a Laravel paginated resource: { data: [...], meta, links }
      const mapped = (raw?.data || []).map(mapOrderResourceToUI);
      return {
        ...raw,
        data: mapped,
      };
    },
  });
}
