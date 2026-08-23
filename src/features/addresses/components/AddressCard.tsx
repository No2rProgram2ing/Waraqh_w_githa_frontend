import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, MapPin, Phone,} from 'lucide-react'
import type { AddressItem } from "@/features/addresses/types";

interface AddressCardProps {
  address: AddressItem;
  onEdit?: (address: AddressItem) => void;
  onDelete?: (id: number | string) => void;
  onSetDefault?: (id: number | string) => void;
}

export function AddressCard({ address, onEdit, onDelete, onSetDefault }: AddressCardProps) {
  const isPrimary = Boolean(address.is_default);
  const safeAddress = [address.country, address.city, address.district, address.street]
    .filter((part): part is string => Boolean(part && part.trim()))
    .join("، ") || "لا توجد تفاصيل العنوان";

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
              {isPrimary ? "العنوان الافتراضي" : "العنوان"}
            </span>
            {isPrimary && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#dfe9d5] px-2 py-1 text-[10px] font-bold text-[#587040]">
                <CheckCircle2 className="h-3.5 w-3.5" />
                مفضل
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!isPrimary && onSetDefault && (
              <Button
                variant="ghost"
                className="h-9 rounded-full px-3 text-[12px] font-medium text-[#4b5d39] hover:bg-white"
                onClick={() => onSetDefault(address.id)}
              >
                تعيين افتراضي
              </Button>
            )}
            {onEdit && (
              <Button
                variant="ghost"
                className="h-9 rounded-full px-3 text-[12px] font-medium text-[#4b5d39] hover:bg-white"
                onClick={() => onEdit(address)}
              >
                تعديل
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e9eadf] text-[#3d4d2f]">
              <MapPin className="h-4 w-4" aria-hidden="true"/>
            </div>
            <div>
              <p className="text-[15px] font-bold text-[#21261d]">{address.recipient_name || "عنوان"}</p>
              <p className="text-[12px] text-[#6d7267]">{address.city || "-"}</p>
            </div>
          </div>

          <p className="text-[13px] leading-7 text-[#51574d]">{safeAddress}</p>

<<<<<<< HEAD
          <div className="flex items-center gap-3 rounded-2xl border border-[#e5e1d9] bg-white/70 px-3 py-2 text-[13px] text-[#3d423a]">
            <Phone className="h-4 w-4 text-[#4b5d39]" aria-hidden="true"/>
            <span dir="ltr">{address.phone}</span>
          </div>
=======
          {address.phone && (
            <div className="flex items-center gap-3 rounded-2xl border border-[#e5e1d9] bg-white/70 px-3 py-2 text-[13px] text-[#3d423a]">
              <PhoneIcon className="h-4 w-4 text-[#4b5d39]" />
              <span dir="ltr">{address.phone}</span>
            </div>
          )}

          {address.postal_code && (
            <div className="text-[12px] text-[#5e655d]">الرمز البريدي: {address.postal_code}</div>
          )}
>>>>>>> dad121843105060107acde3b906c6c7d331c9270
        </div>

        {onDelete && (
          <Button
            variant="outline"
            className="h-10 rounded-xl border-[#d8d0c4] px-4 text-[12px] font-semibold text-[#7a2d2d] hover:bg-[#fff6f5]"
            onClick={() => onDelete(address.id)}
          >
            حذف العنوان
          </Button>
        )}
      </Card>
    </motion.article>
  );
}
