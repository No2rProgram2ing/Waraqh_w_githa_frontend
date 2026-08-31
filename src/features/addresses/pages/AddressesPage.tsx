import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { AccountLayout } from "@/layouts/AccountLayout";
import { AddressCard } from "@/features/addresses/components/AddressCard";
import { AddressFormModal } from "@/features/addresses/components/AddressFormModal";
import { AddressMapCard } from "@/features/addresses/components/AddressMapCard";
import { useAddresses, useDeleteAddress, useSetDefaultAddress } from "@/features/addresses/hooks/useAddresses";
import { PlusIcon } from "@/components/ui/icons";
import type { AddressItem } from "@/features/addresses/types";

export function AddressesPage() {
  const { data: addresses = [], isLoading, isError, refetch } = useAddresses();
  const { mutate: deleteAddress } = useDeleteAddress();
  const { mutate: setDefaultAddress } = useSetDefaultAddress();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState<AddressItem | null>(null);

  const openCreateModal = () => {
    setAddressToEdit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (address: AddressItem) => {
    setAddressToEdit(address);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setAddressToEdit(null);
    setIsModalOpen(false);
  };

  const handleDelete = (id: number | string) => {
    if (window.confirm("هل أنت متأكد من حذف هذا العنوان؟")) {
      deleteAddress(id);
    }
  };

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
            onClick={openCreateModal}
          >
            <span className="mr-2">إضافة عنوان جديد</span>
            <PlusIcon className="h-4 w-4" />
          </Button>
        </div>

        {isLoading ? (
          <div className="rounded-[22px] border border-[#e4e1d8] bg-[#f8f6f1] p-8 text-center text-sm text-[#5b6156]">
            جارٍ تحميل العناوين...
          </div>
        ) : isError ? (
          <div className="rounded-[22px] border border-[#f1d3d3] bg-[#fff7f7] p-6 text-right text-sm text-[#7a2d2d]">
            <p className="font-semibold">تعذر تحميل العناوين.</p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-3 rounded-xl bg-[#4a5c39] px-3 py-2 text-white transition hover:bg-[#3f4f32]"
            >
              إعادة المحاولة
            </button>
          </div>
        ) : addresses.length === 0 ? (
          <div className="rounded-[22px] border border-dashed border-[#d9d4ca] bg-[#faf8f5] p-8 text-center text-sm text-[#5b6156]">
            لا توجد عناوين مسجلة بعد.
          </div>
        ) : (
          <div className="grid gap-5 xl:grid-cols-2">
            {addresses.map((address) => (
              <AddressCard
                key={String(address.id)}
                address={address}
                onEdit={openEditModal}
                onDelete={handleDelete}
                onSetDefault={(id) => setDefaultAddress(id)}
              />
            ))}
          </div>
        )}

        <div className="pt-2">
          <AddressMapCard onOpenModal={openCreateModal} />
        </div>
      </motion.section>

      <AddressFormModal isOpen={isModalOpen} onClose={closeModal} addressToEdit={addressToEdit} />
    </AccountLayout>
  );
}
