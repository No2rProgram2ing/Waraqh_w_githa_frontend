import { motion } from "framer-motion";

import { AccountLayout } from "@/layouts/AccountLayout";
import { OrderListCard } from "@/features/orders/components/OrderListCard";
import { useOrders } from "@/features/orders/useOrders";

export function OrdersPage() {
  const { data, isLoading, isError, error } = useOrders();
  const orders = data?.data ?? [];

  return (
    <AccountLayout>
      <motion.main
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        dir="rtl"
        className="bg-[#f5f3ef] px-5 py-12 text-[#26291f] sm:py-16"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#52663c] sm:text-4xl">طلباتي</h1>
            <p className="mt-2 text-xs text-[#77766d]">قائمة بجميع طلباتك السابقة والحالية</p>
          </div>

          <div className="space-y-3">
            {isLoading && (
              <div className="py-10 text-center text-sm text-[#666a61]">
                جارٍ تحميل الطلبات...
              </div>
            )}

            {isError && (
              <div className="py-10 text-center text-sm text-[#cc3333]">
                فشل تحميل الطلبات.
                <div className="mt-1 text-xs text-[#aa3333]">
                  {(() => {
                    const resp = (error as any)?.response;
                    if (resp) return `رمز الاستجابة: ${resp.status} — ${resp.data?.message ?? JSON.stringify(resp.data)}`;
                    return (error as any)?.message ?? String(error);
                  })()}
                </div>
              </div>
            )}

            {!isLoading && !isError && orders.length === 0 && (
              <div className="py-10 text-center text-sm text-[#666a61]">
                لا توجد طلبات لعرضها.
              </div>
            )}

            {!isLoading && !isError && orders.map((order) => (
              <OrderListCard key={order.id} order={order} />
            ))}
          </div>
        </div>
      </motion.main>
    </AccountLayout>
  );
}