import { motion } from "framer-motion";
import { AccountLayout } from "@/layouts/AccountLayout";

const notifications = [
  {
    id: "n-1",
    title: "تم تجهيز طلبك",
    text: "تم تجهيز طلبك رقم #2451 بنجاح وسيصل خلال 48 ساعة.",
    time: "منذ 5 دقائق",
    unread: true,
  },
  {
    id: "n-2",
    title: "خصم خاص لك",
    text: "خصم 15% على منتجات الحرف اليدوية خلال هذا الأسبوع فقط.",
    time: "منذ يوم",
    unread: false,
  },
  {
    id: "n-3",
    title: "مراجعة المنتج",
    text: "تمت إضافة تقييمك على المنتج الذي اشتريته، يمكنك الاطلاع عليه الآن.",
    time: "منذ 3 أيام",
    unread: false,
  },
];

export function NotificationsPage() {
  return (
    <AccountLayout hideSidebar>
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        dir="rtl"
        className="mx-auto max-w-4xl space-y-6"
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-[#7a7d71]">الإشعارات</p>
            <h1 className="mt-2 text-[32px] font-extrabold text-[#1d2119]">إشعاراتك</h1>
          </div>
          <span className="rounded-full border border-[#d8ceb9] bg-[#f2efe9] px-3 py-1.5 text-[12px] font-medium text-[#4f5f3d]">
            {notifications.filter((item) => item.unread).length} جديدة
          </span>
        </div>

        <div className="space-y-4">
          {notifications.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex items-start gap-4 rounded-[20px] border p-4 shadow-[0_10px_20px_-18px_rgba(38,47,26,0.2)] ${
                item.unread
                  ? "border-[#dfe7d2] bg-[#f3f7ec]"
                  : "border-[#e7dfd4] bg-[#f9f5f1]"
              }`}
            >
              <div
                className={`mt-1 h-3 w-3 rounded-full ${item.unread ? "bg-[#4f5f3d]" : "bg-[#d4cabd]"}`}
              />

              <div className="flex-1">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-[18px] font-bold text-[#1d2119]">{item.title}</h2>
                  <span className="text-[11px] text-[#7a7b75]">{item.time}</span>
                </div>
                <p className="mt-2 text-[14px] leading-7 text-[#565b53]">{item.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </AccountLayout>
  );
}
