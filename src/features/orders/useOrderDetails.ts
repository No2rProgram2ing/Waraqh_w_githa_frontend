import { useQuery } from "@tanstack/react-query";
import { ordersApi } from "@/api/ordersApi";
import type { OrderApiEnvelope, OrderApiResource, OrderItem as UIOrderItem } from "@/features/orders/types";

function unwrapOrderPayload(raw: OrderApiEnvelope | OrderApiResource | null | undefined): OrderApiResource | null {
  if (!raw || typeof raw !== "object") return null;

  const root = (raw as any).data ?? (raw as any).order ?? (raw as any).result ?? raw;
  if (!root || typeof root !== "object") return null;

  if (Array.isArray(root)) {
    return (root[0] as OrderApiResource) ?? null;
  }

  return (root as OrderApiResource) ?? null;
}

function mapOrderResourceToUI(order: OrderApiResource | null): UIOrderItem {
  const statusMap: Record<string, string> = {
    received: "مستلم",
    in_production: "قيد التنفيذ",
    in_transit: "قيد الشحن",
    cancelled: "ملغي",
  };

  const safeOrder = order ?? {};
  const statusValue = typeof safeOrder.status === "object" ? safeOrder.status?.value : safeOrder.status;

  const items = (safeOrder.items ?? []).map((it) => ({
    id: String(it.id ?? ""),
    name: it.product?.name ?? it.name ?? "",
    quantity: it.quantity ?? 0,
    unitPrice: Number(it.price ?? it.unit_price ?? 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
  }));

  const total = Number(safeOrder.total ?? safeOrder.total_amount ?? 0);
  const createdAt = safeOrder.created_at ? new Date(safeOrder.created_at) : null;

  return {
    id: String(safeOrder.id ?? ""),
    slug: safeOrder.order_number ?? undefined,
    year: createdAt ? String(createdAt.getFullYear()) : "",
    month: createdAt ? String(createdAt.getMonth() + 1).padStart(2, "0") : "",
    price: total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    status: statusMap[String(statusValue ?? "")] ?? String(statusValue ?? ""),
    isActive: String(statusValue ?? "") !== "cancelled",
    items,
  };
}

export function useOrderDetails(id?: string | null) {
  return useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      if (!id) throw new Error("No order id");
      const res = await ordersApi.getOrder(id);
      return res.data;
    },
    enabled: !!id,
    select: (raw: OrderApiEnvelope | OrderApiResource | null | undefined) => {
      const order = unwrapOrderPayload(raw);
      return mapOrderResourceToUI(order);
    },
  });
}
