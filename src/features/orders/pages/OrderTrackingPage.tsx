import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Check, ChevronLeft, CreditCard, MapPin, PackageCheck, Truck } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { ordersApi } from "@/api/ordersApi";
import { AccountLayout } from "@/layouts/AccountLayout";
import { ROUTES } from "@/routes/paths";

type TrackingOrder = {
  id: number;
  order_number: string;
  status: string;
  total: number | string;
  subtotal?: number | string;
  shipping_fee?: number | string;
  expected_delivery_date?: string | null;
  customer?: { name?: string | null; phone?: string | null };
  address?: { city?: string; district?: string; street?: string; phone?: string } | null;
  items?: Array<{
    id: number;
    product?: {
      name?: string;
      media?: Array<{ url?: string | null; is_primary?: boolean }>;
    };
    name?: string;
    quantity: number;
    price?: number | string;
    unit_price?: number | string;
  }>;
  payment?: { method?: string | null; status?: string } | null;
  status_history?: Array<{ status: string; created_at?: string }>;
};

const statusLabels: Record<string, string> = {
  received: "تم الاستلام",
  in_production: "قيد التصنيع",
  in_transit: "في الطريق",
  cancelled: "ملغي",
};

const stages = [
  { key: "received", title: "تم الاستلام", icon: Check },
  { key: "in_production", title: "قيد التصنيع", icon: PackageCheck },
  { key: "in_transit", title: "في الطريق", icon: Truck },
  { key: "delivered", title: "تم التوصيل", icon: PackageCheck },
] as const;

function formatAmount(value: number | string | undefined) {
  return Number(value ?? 0).toLocaleString("ar-SA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDate(value?: string | null) {
  return value ? new Date(value).toLocaleDateString("ar-SA") : "غير محدد";
}

function unwrapOrder(raw: unknown): TrackingOrder {
  const payload = raw as { data?: TrackingOrder; order?: TrackingOrder };
  return (payload?.data ?? payload?.order ?? payload) as TrackingOrder;
}

function Timeline({ order }: { order: TrackingOrder }) {
  const currentIndex = order.status === "cancelled"
    ? -1
    : Math.max(0, stages.findIndex((stage) => stage.key === order.status));
  const history = order.status_history ?? [];
  const progress = currentIndex > 0 ? `${(currentIndex / (stages.length - 1)) * 82}%` : "0%";

  return (
    <div className="relative flex items-start justify-between gap-1 px-1 py-2">
      <div className="absolute right-[9%] left-[9%] top-7 h-px bg-[#d5d3ca]" />
      <div className="absolute right-[9%] top-7 h-px bg-[#52663c]" style={{ width: progress }} />
      {stages.map(({ key, title, icon: Icon }, index) => {
        const event = history.find((item) => item.status === key);
        const state = index < currentIndex ? "complete" : index === currentIndex ? "current" : "upcoming";
        return (
          <div key={key} className="relative z-10 flex min-w-0 flex-1 flex-col items-center text-center">
            <span className={`flex size-9 items-center justify-center rounded-full border-2 ${state === "complete" ? "border-[#52663c] bg-[#52663c] text-white" : state === "current" ? "border-[#52663c] bg-[#718658] text-white" : "border-[#d5d3ca] bg-[#f8f6f1] text-[#aaa99f]"}`}>
              <Icon className="size-4" />
            </span>
            <strong className={`mt-3 text-[10px] sm:text-xs ${state === "upcoming" ? "text-[#aaa99f]" : "text-[#52663c]"}`}>{title}</strong>
            <span className="mt-1 text-[9px] text-[#8e8d84]">
              {event?.created_at ? formatDate(event.created_at) : index === 2 && order.expected_delivery_date ? `متوقع ${formatDate(order.expected_delivery_date)}` : state === "upcoming" ? "لم تبدأ" : ""}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function OrderTrackingPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const query = useQuery({
    queryKey: ["order-tracking", orderId],
    queryFn: async () => unwrapOrder((await ordersApi.getTracking(orderId as string)).data),
    enabled: Boolean(orderId),
  });

  if (query.isLoading) return <AccountLayout><div className="p-12 text-center" dir="rtl">جارٍ تحميل تفاصيل التتبع...</div></AccountLayout>;
  if (query.isError || !query.data) return <AccountLayout><div className="p-12 text-center text-red-600" dir="rtl">تعذر تحميل بيانات تتبع الطلب.</div></AccountLayout>;

  const order = query.data;
  const address = order.address;
  const statusLabel = statusLabels[order.status] ?? order.status;

  return (
    <AccountLayout>
      <motion.main initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} dir="rtl" className="bg-[#f5f3ef] px-5 py-12 text-[#26291f] sm:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-xs font-bold tracking-[0.16em] text-[#8b7652]">طلبك الحالي</p>
              <h1 className="mt-2 text-3xl font-bold text-[#52663c] sm:text-4xl">تتبع طلبك</h1>
              <p className="mt-2 text-xs text-[#77766d]">رقم الطلب: <span className="font-bold text-[#795238]">#{order.order_number}</span></p>
            </div>
            <Link to={ROUTES.products} className="hidden items-center gap-1 text-xs font-bold text-[#52663c] sm:flex">متابعة التسوق <ChevronLeft className="size-4" /></Link>
          </div>

          <section className="mb-8 border-b border-[#ddd9d0] pb-8"><Timeline order={order} /></section>

          <div className="grid gap-6 lg:grid-cols-[1fr_270px]">
            <div className="space-y-5">
              <section className="border border-[#e0ddd5] bg-[#fbfaf7] p-5 shadow-sm">
                <p className="text-xs font-bold text-[#8b7652]">الحالة الحالية</p>
                <h2 className="mt-2 text-2xl font-bold text-[#52663c]">{statusLabel}</h2>
                <p className="mt-3 text-sm leading-7 text-[#77766d]">يمكنك متابعة حالة طلبك وتفاصيله من خلال البيانات المحدثة من النظام.</p>
              </section>

              <section className="border border-[#e0ddd5] bg-[#fbfaf7] p-5">
                <h2 className="border-b border-[#e6e2da] pb-4 text-lg font-bold text-[#52663c]">تفاصيل المنتجات</h2>
                <div className="divide-y divide-[#e6e2da]">
                  {(order.items ?? []).map((item) => {
                    const media = item.product?.media ?? [];
                    const image = media.find((entry) => entry.is_primary)?.url ?? media[0]?.url;

                    return (
                    <article key={item.id} className="flex items-center gap-4 py-4">
                      {image ? (
                        <img src={image} alt={item.product?.name ?? item.name ?? "منتج"} className="size-14 rounded object-cover" />
                      ) : (
                        <div className="flex size-14 items-center justify-center bg-[#eeece7] text-[#52663c]"><PackageCheck className="size-5" /></div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-bold text-[#26291f]">{item.product?.name ?? item.name ?? "منتج"}</h3>
                        <p className="mt-1 text-[10px] text-[#77766d]">الكمية: {item.quantity}</p>
                      </div>
                      <strong className="text-sm text-[#795238]">{formatAmount(item.price ?? item.unit_price)}</strong>
                    </article>
                    );
                  })}
                </div>
              </section>
            </div>

            <aside className="space-y-5">
              <section className="border border-[#e0ddd5] bg-[#eeece7] p-5">
                <div className="flex items-center gap-2 text-[#52663c]"><MapPin className="size-4" /><h2 className="font-bold">عنوان الشحن</h2></div>
                <p className="mt-4 text-sm font-bold">{order.customer?.name ?? "غير محدد"}</p>
                <p className="mt-2 text-xs leading-6 text-[#77766d]">{address?.street ?? "العنوان غير محدد"}{address?.district ? `، ${address.district}` : ""}<br />{address?.city ?? "غير محدد"}<br />اليمن</p>
                <p className="mt-3 text-[10px] text-[#77766d]">{address?.phone ?? order.customer?.phone ?? "غير محدد"}</p>
              </section>

              <section className="border border-[#e0ddd5] bg-[#eeece7] p-5">
                <div className="flex items-center gap-2 text-[#52663c]"><CreditCard className="size-4" /><h2 className="font-bold">طريقة الدفع</h2></div>
                <p className="mt-4 flex justify-between text-xs"><span>{order.payment?.method ?? "غير محددة"}</span><strong>{order.payment?.status ?? "غير مدفوعة"}</strong></p>
                <div className="mt-4 space-y-3 border-t border-[#d8d4cb] pt-4 text-xs">
                  <p className="flex justify-between"><span>موعد الاستلام</span><strong>{formatDate(order.expected_delivery_date)}</strong></p>
                  <p className="flex justify-between text-base font-bold text-[#52663c]"><span>الإجمالي</span><strong>{formatAmount(order.subtotal)} ر.س</strong></p>
                </div>
              </section>
            </aside>
          </div>
        </div>
      </motion.main>
    </AccountLayout>
  );
}
