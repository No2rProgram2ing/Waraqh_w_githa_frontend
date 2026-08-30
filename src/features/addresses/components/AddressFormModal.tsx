import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { useCreateAddress, useUpdateAddress } from "@/features/addresses/hooks/useAddresses";
import type { AddressFormValues, AddressItem } from "@/features/addresses/types";

interface AddressFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  addressToEdit?: AddressItem | null;
}

const emptyForm: AddressFormValues = {
  customer_id: null,
  recipient_name: "",
  phone: "",
  country: "",
  city: "",
  district: "",
  street: "",
  postal_code: "",
  is_default: false,
};

const normalizePhone = (value: string) => value.replace(/\s+/g, " ").trim();

const validateAddressForm = (form: AddressFormValues) => {
  const errors: Record<string, string> = {};

  if (!form.recipient_name.trim()) {
    errors.recipient_name = "يرجى إدخال اسم المستلم.";
  }

  if (!form.country.trim()) {
    errors.country = "يرجى إدخال الدولة.";
  }

  if (!form.city.trim()) {
    errors.city = "يرجى إدخال المدينة.";
  }

  if (!form.street.trim()) {
    errors.street = "يرجى إدخال اسم الشارع.";
  }

  if (form.phone.trim()) {
    const normalized = normalizePhone(form.phone);
    const isValidPhone = /^\+?[0-9\s-]{7,20}$/.test(normalized);
    if (!isValidPhone) {
      errors.phone = "يرجى إدخال رقم هاتف صحيح.";
    }
  }

  return errors;
};

export function AddressFormModal({ isOpen, onClose, addressToEdit }: AddressFormModalProps) {
  const { mutate: createAddress, isPending: isCreating } = useCreateAddress();
  const { mutate: updateAddress, isPending: isUpdating } = useUpdateAddress();

  const [form, setForm] = useState<AddressFormValues>(emptyForm);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (addressToEdit) {
      setForm({
        customer_id: addressToEdit.customer_id ?? null,
        recipient_name: addressToEdit.recipient_name ?? "",
        phone: addressToEdit.phone ?? "",
        country: addressToEdit.country ?? "",
        city: addressToEdit.city ?? "",
        district: addressToEdit.district ?? "",
        street: addressToEdit.street ?? "",
        postal_code: addressToEdit.postal_code ?? "",
        is_default: Boolean(addressToEdit.is_default),
      });
    } else {
      setForm(emptyForm);
    }

    setFieldErrors({});
  }, [addressToEdit, isOpen]);

  const isPending = isCreating || isUpdating;

  const formTitle = useMemo(() => (addressToEdit ? "تعديل العنوان" : "إضافة عنوان جديد"), [addressToEdit]);

  const updateField = (field: keyof AddressFormValues, value: string | boolean | number | null) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateAddressForm(form);
    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      return;
    }

    const payload = {
      customer_id: form.customer_id ?? undefined,
      recipient_name: form.recipient_name.trim(),
      phone: normalizePhone(form.phone),
      country: form.country.trim(),
      city: form.city.trim(),
      district: form.district.trim(),
      street: form.street.trim(),
      postal_code: form.postal_code.trim(),
      is_default: Boolean(form.is_default),
    };

    if (addressToEdit) {
      updateAddress(
        { id: addressToEdit.id, data: payload },
        { onSuccess: onClose },
      );
      return;
    }

    createAddress(payload, { onSuccess: onClose });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
      <div className="flex max-h-[92vh] min-h-0 w-full max-w-3xl flex-col overflow-hidden rounded-[24px] bg-[#fffdfb] shadow-[0_30px_70px_-30px_rgba(41,51,34,0.55)]" dir="rtl">
        <div className="flex items-center justify-between border-b border-[#ebe4d8] bg-[#f9f6f1] px-5 py-4">
          <h2 className="text-lg font-bold text-[#1d241a]">{formTitle}</h2>
          <button type="button" onClick={onClose} className="rounded-full p-2 text-[#5a6255] transition hover:bg-white hover:text-[#2d3828]" aria-label="إغلاق">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[calc(92vh-110px)] min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-[#465142]">اسم المستلم</label>
              <input
                value={form.recipient_name}
                onChange={(e) => updateField("recipient_name", e.target.value)}
                className="w-full rounded-xl border border-[#dfe5d8] bg-white px-3 py-2.5 text-sm text-[#1d241a] outline-none transition focus:border-[#4a5c39]"
                placeholder="مثل: محمد علي"
              />
              {fieldErrors.recipient_name && <p className="mt-1 text-xs text-[#a23a3a]">{fieldErrors.recipient_name}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[#465142]">الدولة</label>
              <input
                value={form.country}
                onChange={(e) => updateField("country", e.target.value)}
                className="w-full rounded-xl border border-[#dfe5d8] bg-white px-3 py-2.5 text-sm text-[#1d241a] outline-none transition focus:border-[#4a5c39]"
                placeholder="السعودية"
              />
              {fieldErrors.country && <p className="mt-1 text-xs text-[#a23a3a]">{fieldErrors.country}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[#465142]">المدينة</label>
              <input
                value={form.city}
                onChange={(e) => updateField("city", e.target.value)}
                className="w-full rounded-xl border border-[#dfe5d8] bg-white px-3 py-2.5 text-sm text-[#1d241a] outline-none transition focus:border-[#4a5c39]"
                placeholder="الرياض"
              />
              {fieldErrors.city && <p className="mt-1 text-xs text-[#a23a3a]">{fieldErrors.city}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[#465142]">الحي/المنطقة</label>
              <input
                value={form.district}
                onChange={(e) => updateField("district", e.target.value)}
                className="w-full rounded-xl border border-[#dfe5d8] bg-white px-3 py-2.5 text-sm text-[#1d241a] outline-none transition focus:border-[#4a5c39]"
                placeholder="حي النخيل"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[#465142]">الرمز البريدي</label>
              <input
                value={form.postal_code}
                onChange={(e) => updateField("postal_code", e.target.value)}
                className="w-full rounded-xl border border-[#dfe5d8] bg-white px-3 py-2.5 text-sm text-[#1d241a] outline-none transition focus:border-[#4a5c39]"
                placeholder="12345"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-[#465142]">الشارع/العنوان التفصيلي</label>
              <textarea
                value={form.street}
                onChange={(e) => updateField("street", e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-[#dfe5d8] bg-white px-3 py-2.5 text-sm text-[#1d241a] outline-none transition focus:border-[#4a5c39]"
                placeholder="شوارع، مبنى، رقم، تفاصيل أخرى"
              />
              {fieldErrors.street && <p className="mt-1 text-xs text-[#a23a3a]">{fieldErrors.street}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-[#465142]">رقم الهاتف</label>
              <input
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                dir="ltr"
                className="w-full rounded-xl border border-[#dfe5d8] bg-white px-3 py-2.5 text-sm text-[#1d241a] outline-none transition focus:border-[#4a5c39]"
                placeholder="+966500000000"
              />
              {fieldErrors.phone && <p className="mt-1 text-xs text-[#a23a3a]">{fieldErrors.phone}</p>}
            </div>
          </div>

          <label className="flex items-center gap-3 rounded-xl border border-[#e7e0d4] bg-[#f7f5f0] px-3 py-2.5 text-sm text-[#405039]">
            <input
              type="checkbox"
              checked={form.is_default}
              onChange={(e) => updateField("is_default", e.target.checked)}
              className="h-4 w-4 rounded border-[#c9d1bf] text-[#45592D] focus:ring-[#45592D]"
            />
            تعيين هذا العنوان كالعنوان الافتراضي
          </label>

          <div className="flex items-center justify-end gap-3 border-t border-[#ece5da] pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#d7d0c3] bg-white px-4 py-2.5 text-sm font-medium text-[#4f5d4c] transition hover:bg-[#f8f5f1]"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="rounded-xl bg-[#45592D] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#394d2b] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "جارٍ الحفظ..." : addressToEdit ? "تحديث" : "حفظ"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
