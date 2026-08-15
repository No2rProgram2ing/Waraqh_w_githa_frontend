import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { AccountLayout } from "@/layouts/AccountLayout";
import { CheckCircleIcon, PlusIcon } from "@/components/ui/icons";
import { OrderListCard } from "@/features/orders/components/OrderListCard";
import type { OrderItem } from "@/features/orders/types";

const orders: OrderItem[] = [
  {
    id: "WJ-8942#",
    year: "2023",
    month: "12",
    price: "1,250.00",
    status: "تم التسليم",
    isActive: true,
  },
  {
    id: "WJ-8721#",
    year: "2023",
    month: "05",
    price: "4,800.00",
    status: "قيد التنفيذ",
  },
  {
    id: "WJ-8502#",
    year: "2023",
    month: "22",
    price: "920.00",
    status: "قيد التنفيذ",
  },
];

export function OrdersPage() {
  return (
    <AccountLayout>
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="flex flex-col gap-5"
        dir="rtl"
      >
        <div className="flex items-center justify-between gap-4 pt-1">

          <h1 className="text-[28px] font-extrabold text-[#1f231d]">طلباتي</h1>
        </div>

        <div className="rounded-[18px] border border-[#e0dfd8] bg-[#f8f6f3] p-3 sm:p-4 shadow-[0_8px_22px_-18px_rgba(38,47,26,0.25)]">
          <div className="mb-4 flex items-center justify-between gap-3 px-1">
            <div className="w-8" />
            <h2 className="text-[18px] font-bold text-[#1f231d]">طلباتي</h2>
            <div className="w-8" />
          </div>

          <div className="space-y-3">
            {orders.map((order) => (
              <OrderListCard key={order.id} order={order} />
            ))}
          </div>
        </div>

        <div className="rounded-[18px] border border-[#e4dfd6] bg-[#efe6da] p-4 shadow-[0_8px_22px_-18px_rgba(38,47,26,0.22)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex h-[120px] flex-1 items-center justify-center rounded-[14px] border border-dashed border-[#c9c0b3] bg-[#f1e7dd] text-[#8f8677] shadow-inner">
              <div className="h-20 w-40 rounded-[18px] border border-[#d8cec0] bg-[#e7e1d8]" />
            </div>

            <div className="flex flex-1 flex-col items-start gap-4 text-right md:items-end">
              <p className="text-[18px] font-bold text-[#1f231d]">هل لديك طلبك؟</p>
              <p className="max-w-md text-[13px] leading-7 text-[#4d4d48]">
                نحن نساعدك في متابعة جميع طلباتك من خلال معلومات التسليم ومراقبة حالة الشحنة في الوقت الحقيقي.
              </p>
              <Button
                variant="primary"
                className="h-11 rounded-xl bg-[#4a5c39] px-6 text-[15px] font-bold text-white shadow-[0_10px_20px_-12px_rgba(74,92,57,0.7)] hover:bg-[#3f4f32]"
              >
                <span className="ml-2">متابعة الطلب</span>
                <CheckCircleIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.section>
    </AccountLayout>
  );
}
