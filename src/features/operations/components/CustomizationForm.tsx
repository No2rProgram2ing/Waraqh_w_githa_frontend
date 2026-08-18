import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { CustomizationPriceSummary } from '../components/CustomizationPriceSummary'
import { CustomizationImageUploader } from '../components/CustomizationImageUploader'
import { useEstimateCustomization, useCreateCustomization, useSaveDraft } from '../hooks/useCustomizations'

export default function CustomizationForm() {
  const [form, setForm] = useState({
    customer_name: '',
    customer_phone: '',
    address: '',
    product_id: '' as any,
    quantity: 1,
    base_price: 0,
    customization_fee: 0,
    shipping: 0,
    color: '',
    notes: '',
  })

  const [attachments, setAttachments] = useState<File[]>([])
  const [estimate, setEstimate] = useState<any | null>(null)

  const estimateMutation = useEstimateCustomization(form)
  const createMutation = useCreateCustomization()
  const saveDraftMutation = useSaveDraft(null)

  const runEstimate = async () => {
    try {
      const payload = { ...form }
      const res = await estimateMutation.mutateAsync(payload)
      setEstimate(res)
      toast.success('تم حساب السعر بنجاح')
    } catch (err) {
      console.error('Estimate error', err)
      toast.error('حدث خطأ أثناء حساب السعر')
    }
  }

  const submit = async () => {
    const fd = new FormData()
    fd.append('customer_name', form.customer_name)
    fd.append('customer_phone', form.customer_phone)
    fd.append('address', form.address)
    fd.append('product_id', String(form.product_id))
    fd.append('quantity', String(form.quantity))
    fd.append('color', form.color)
    fd.append('notes', form.notes)
    fd.append('base_price', String(form.base_price))
    fd.append('customization_fee', String(form.customization_fee))
    fd.append('shipping', String(form.shipping))

    attachments.forEach((f) => fd.append('attachments[]', f))

    try {
      await createMutation.mutateAsync(fd)
      toast.success('تم إنشاء طلب التخصيص')
    } catch (err) {
      console.error(err)
      toast.error('حدث خطأ أثناء إنشاء الطلب')
    }
  }

  const saveDraft = async () => {
    try {
      const payload: Record<string, any> = {
        customer_name: form.customer_name,
        customer_phone: form.customer_phone,
        address: form.address,
        product_id: form.product_id,
        quantity: form.quantity,
        base_price: form.base_price,
        customization_fee: form.customization_fee,
        shipping: form.shipping,
        color: form.color,
        notes: form.notes,
        // attachments are not uploaded for draft in this implementation; we store filenames client-side
        attachments: attachments.map((f) => f.name),
      }

      await saveDraftMutation.mutateAsync(payload)
      toast.success('تم حفظ المسودة بنجاح')
    } catch (err) {
      console.error('Save draft error', err)
      toast.error('فشل حفظ المسودة')
    }
  }

  return (
    <motion.div dir="rtl" className="grid grid-cols-1 gap-6 lg:grid-cols-3" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }}>
      <div className="col-span-2 space-y-4">
        <div className="rounded-2xl border bg-white p-6">
          <h2 className="text-lg font-semibold text-right">إضافة طلب تخصيص جديد</h2>

          <div className="mt-4 grid grid-cols-1 gap-3">
            <input className="w-full rounded-md border p-3" placeholder="اسم العميل" value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} />
            <input className="w-full rounded-md border p-3" placeholder="هاتف العميل" value={form.customer_phone} onChange={(e) => setForm({ ...form, customer_phone: e.target.value })} />
            <input className="w-full rounded-md border p-3" placeholder="عنوان التوصيل" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />

            <div className="grid grid-cols-2 gap-3">
              <input type="number" className="rounded-md border p-3" placeholder="الكمية" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} />
              <input type="number" className="rounded-md border p-3" placeholder="سعر المنتج الأساسي" value={form.base_price} onChange={(e) => setForm({ ...form, base_price: Number(e.target.value) })} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input type="number" className="rounded-md border p-3" placeholder="رسوم التخصيص" value={form.customization_fee} onChange={(e) => setForm({ ...form, customization_fee: Number(e.target.value) })} />
              <input type="number" className="rounded-md border p-3" placeholder="الشحن" value={form.shipping} onChange={(e) => setForm({ ...form, shipping: Number(e.target.value) })} />
            </div>

            <textarea className="w-full rounded-md border p-3" placeholder="ملاحظات إضافية" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />

            <div className="mt-2">
              <CustomizationImageUploader onChange={(files) => setAttachments(files)} />
            </div>

            <div className="flex items-center gap-3 mt-4">
              <button onClick={runEstimate} className="rounded-md bg-[#3b6a2b] px-4 py-2 text-white hover:opacity-95 transition">احسب السعر</button>
              <button onClick={submit} className="rounded-md border px-4 py-2 hover:bg-gray-50 transition">إرسال طلب التخصيص</button>
              <button onClick={saveDraft} className="rounded-md bg-[#f3f4f6] px-4 py-2 text-sm text-[#374151] hover:opacity-95 transition">حفظ كمسودة</button>
            </div>
          </div>
        </div>
      </div>

      <aside>
        <CustomizationPriceSummary estimate={estimate} />
      </aside>
    </motion.div>
  )
}
