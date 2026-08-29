import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { AccountLayout } from "@/layouts/AccountLayout";
import { AddressCard } from "@/features/addresses/components/AddressCard";
import { AddressMapCard } from "@/features/addresses/components/AddressMapCard";
import type { AddressItem } from "@/features/addresses/types";
import { PlusIcon } from "@/components/ui/icons";

const addresses: AddressItem[] = [
  {
    id: "home",
    title: "المنزل",
    type: "home",
    isPrimary: true,
    city: "صنعاء",
    address: "حي المعلا، شارع النخيل، عمارة 15، الدور 4، شقة 7",
    phone: "+966 55 123 4567",
    note: "الاستلام أثناء ساعات المساء والليل",
  },
  {
    id: "work",
    title: "مكتب العمل",
    type: "work",
    isPrimary: false,
    city: "صنعاء",
    address: "شارع الزبيري، بجوار متجر الحوش، المبنى الرئيسي، الطابق الثاني",
    phone: "+966 11 987 6543",
    note: "مناسبة للطلبات الرسمية والعمل خلال ساعات الدوام",
  },
];

export function AddressesPage() {
  return (
    <AccountLayout>
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="flex flex-col gap-6"
      >
        <div className="flex items-center justify-end gap-4">
          <h1 className="ml-auto text-[26px] font-extrabold text-[#1f231d]">عناويني</h1>

          <Button
            variant="primary"
            className="h-12 rounded-xl bg-[#4a5c39] px-5 text-[15px] font-bold text-white shadow-[0_10px_20px_-12px_rgba(74,92,57,0.7)] hover:bg-[#3f4f32]"
          >
            <span className="mr-2">إضافة عنوان جديد</span>
            <PlusIcon className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          {addresses.map((address) => (
            <AddressCard key={address.id} address={address} />
          ))}
        </div>

        <div className="pt-2">
          <AddressMapCard />
        </div>
      </motion.section>
    </AccountLayout>
  );
}
