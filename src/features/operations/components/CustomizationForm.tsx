import React, { useState } from 'react'
import { CustomizationPriceSummary } from '../components/CustomizationPriceSummary'
import { CustomizationImageUploader } from '../components/CustomizationImageUploader'
import { useEstimateCustomization, useCreateCustomization } from '../hooks/useCustomizations'

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

  const runEstimate = async () => {
    try {
      const payload = { ...form }
      const res = await estimateMutation.mutateAsync(payload)
      setEstimate(res)
    } catch (err) {
      console.error('Estimate error', err)
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
      alert('تم إنشاء طلب التخصيص')
    } catch (err) {
      console.error(err)
      alert('حدث خطأ أثناء إنشاء الطلب')
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
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
              <button onClick={runEstimate} className="rounded-md bg-[#3b6a2b] px-4 py-2 text-white">احسب السعر</button>
              <button onClick={submit} className="rounded-md border px-4 py-2">إرسال طلب التخصيص</button>
            </div>
          </div>
        </div>
      </div>

      <aside>
        <CustomizationPriceSummary estimate={estimate} />
      </aside>
    </div>
  )
}
