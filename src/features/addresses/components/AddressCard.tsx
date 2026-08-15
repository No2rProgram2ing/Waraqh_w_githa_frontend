import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MapPinIcon, PhoneIcon, CheckCircleIcon } from "@/components/ui/icons";
import type { AddressItem } from "@/features/addresses/types";

interface AddressCardProps {
  address: AddressItem;
}

export function AddressCard({ address }: AddressCardProps) {
  const isPrimary = address.isPrimary;

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Card interactive className="flex h-full flex-col justify-between gap-5 rounded-[22px] border border-[#e3e0d7] bg-[#f9f7f3] p-5 text-right shadow-[0_10px_30px_-20px_rgba(38,47,26,0.22)]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-[#edf2e6] px-2.5 py-1 text-[11px] font-semibold text-[#4b5d39]">
              {address.type === "work" ? "عنوان العمل" : address.type === "home" ? "العنوان الأساسي" : "عنوان آخر"}
            </span>
            {isPrimary && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#dfe9d5] px-2 py-1 text-[10px] font-bold text-[#587040]">
                <CheckCircleIcon className="h-3.5 w-3.5" />
                مفضل
              </span>
            )}
          </div>

          <Button
            variant="ghost"
            className="h-9 rounded-full px-3 text-[12px] font-medium text-[#4b5d39] hover:bg-white"
          >
            تعديل
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e9eadf] text-[#3d4d2f]">
              <MapPinIcon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[15px] font-bold text-[#21261d]">{address.title}</p>
              <p className="text-[12px] text-[#6d7267]">{address.city}</p>
            </div>
          </div>

          <p className="text-[13px] leading-7 text-[#51574d]">{address.address}</p>

          <div className="flex items-center gap-3 rounded-2xl border border-[#e5e1d9] bg-white/70 px-3 py-2 text-[13px] text-[#3d423a]">
            <PhoneIcon className="h-4 w-4 text-[#4b5d39]" />
            <span dir="ltr">{address.phone}</span>
          </div>
        </div>

        {address.note && (
          <p className="rounded-xl bg-[#f0f2ea] px-3 py-2 text-[12px] text-[#4d5644]">{address.note}</p>
        )}
      </Card>
    </motion.article>
  );
}
