import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useReturns, useCreateReturn } from '../hooks/useReturns'
import { ReturnsTable } from '../components/ReturnsTable'
import { ReturnDetailsDrawer } from '../components/ReturnDetailsDrawer'

export default function ReturnsPage(){
  const [params] = useState({ per_page: 20 })
  const { data } = useReturns(params)
  const returnsList = data?.data ?? []
  const createMutation = useCreateReturn()

  const [form, setForm] = useState({ order_number: '', customer_name: '', reason: '' })
  const [attachments, setAttachments] = useState<File[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const submit = async () => {
    const fd = new FormData()
    fd.append('order_number', form.order_number)
    fd.append('customer_name', form.customer_name)
    fd.append('reason', form.reason)
    attachments.forEach((f) => fd.append('attachments[]', f))
    try {
      await createMutation.mutateAsync(fd)
      alert('تم إنشاء طلب الاستبدال')
    } catch (err) {
      console.error(err)
      alert('حدث خطأ')
    }
  }

  return (
    <div dir="rtl" className="space-y-6">
      <Helmet><title>الاستبدالات — لوحة الإدارة</title></Helmet>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">طلبات الاستبدال</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="col-span-2">
          <ReturnsTable returnsList={returnsList} onOpen={(id) => setSelectedId(id)} />
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border bg-white p-4">
            <h3 className="text-sm font-semibold text-right">إنشاء طلب استبدال جديد</h3>
            <div className="mt-3 space-y-2">
              <input className="w-full rounded-md border p-2" placeholder="رقم الطلب" value={form.order_number} onChange={(e) => setForm({ ...form, order_number: e.target.value })} />
              <input className="w-full rounded-md border p-2" placeholder="اسم العميل" value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} />
              <textarea className="w-full rounded-md border p-2" placeholder="سبب الاستبدال" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
              <input type="file" multiple accept="image/*" onChange={(e) => setAttachments(Array.from(e.target.files || []))} />
              <div className="mt-2"><button onClick={submit} className="rounded-md bg-[#3b6a2b] px-3 py-2 text-white">إرسال طلب</button></div>
            </div>
          </div>
        </aside>
      </div>

      {selectedId && <ReturnDetailsDrawer id={selectedId} onClose={() => setSelectedId(null)} />}
    </div>
  )
}
