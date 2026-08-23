import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { PackageIcon } from "@/components/ui/icons";
import type { OrderItem } from "@/features/orders/types";

interface OrderListCardProps {
  order: OrderItem;
}

export function OrderListCard({ order }: OrderListCardProps) {
  // Use numeric id for routing to match backend resource identifier
  const orderPath = order.id;

  return (
    <motion.article
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={[
        "flex items-center justify-between gap-3 rounded-[18px] border bg-[#f5f3ef] px-3 py-3 shadow-[0_8px_18px_-18px_rgba(38,47,26,0.28)]",
        order.isActive ? "border-[#dfe5d3] bg-[#edf2e7]" : "border-[#e6e1d9] bg-[#f4f1ec]",
      ].join(" ")}
      dir="rtl"
    >
      <div className="flex max-w-[55%] items-center gap-3 text-right">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#d9dccf] bg-white text-[#4a5c39] shadow-sm">
          <PackageIcon className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[13px] font-bold text-[#1f231d]">
            <span>{order.id}</span>
          </div>
          <div className="mt-1 flex items-center gap-2 text-[12px] text-[#5f665d]">
            <span>{order.year}</span>
            <span>{order.month}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#a3a89a]" />
            <span>{order.status}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="rounded-xl border border-[#d9d5ce] bg-[#f9f6f3] px-3 py-2 text-[12px] font-semibold text-[#1f231d]">
          {order.price}
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/orders/${orderPath}`}
            className={[
              "inline-flex items-center justify-center rounded-xl px-4 py-2 text-[12px] font-bold transition-all",
              order.isActive
                ? "bg-[#4a5c39] text-white shadow-[0_8px_18px_-12px_rgba(74,92,57,0.9)] hover:bg-[#3d4d2d]"
                : "border border-[#d7d2c8] bg-white text-[#454a42] hover:bg-[#f1f0ed]",
            ].join(" ")}
          >
            <span>التفاصيل</span>
          </Link>

          <Link
            to={`/orders/${orderPath}/track`}
            className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-[12px] font-bold border border-[#d7d2c8] bg-white text-[#454a42] hover:bg-[#f1f0ed]"
          >
            <span>تتبع الطلب</span>
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
