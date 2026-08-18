import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'

export default function FreeDesignDetailsPage({ id }: { id?: number | null }){
  const [item, setItem] = useState<any | null>(null)
  const [comment, setComment] = useState('')
  const [thread, setThread] = useState<any[]>([])

  useEffect(() => {
    if (!id) return
    const raw = localStorage.getItem('local_free_designs')
    const arr = raw ? JSON.parse(raw) : []
    const found = arr.find((it: any) => it.id === id)
    setItem(found || null)
    const thr = localStorage.getItem(`free_design_thread_${id}`)
    setThread(thr ? JSON.parse(thr) : [])
  }, [id])

  const addComment = () => {
    if (!id) return
    if (!comment.trim()) return
    const t = [{ text: comment, at: new Date().toISOString() }, ...thread]
    setThread(t)
    localStorage.setItem(`free_design_thread_${id}`, JSON.stringify(t))
    setComment('')
  }

  if (!id) return <div className="p-4">اختر طلبًا لعرض التفاصيل.</div>
  if (!item) return <div className="p-4">لا توجد بيانات للعرض.</div>

  return (
    <div dir="rtl" className="space-y-4">
      <Helmet><title>تفاصيل طلب التصميم — {item.title}</title></Helmet>
      <div className="rounded-2xl border bg-white p-4">
        <h2 className="text-lg font-semibold text-right">{item.title}</h2>
        <div className="text-sm text-right">العميل: {item.customer_name}</div>
        <div className="mt-3 text-right">{item.description}</div>

        <div className="mt-3">
          <strong>المرفقات:</strong>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {item.attachments && item.attachments.length ? item.attachments.map((a: string, i: number) => (
              <a key={i} href={a} target="_blank" rel="noreferrer" className="text-blue-600">عرض المرفق {i+1}</a>
            )) : <div>لا توجد مرفقات</div>}
          </div>
        </div>

        <div className="mt-4">
          <strong>تعليقات:</strong>
          <div className="mt-2">
            <textarea className="w-full border rounded p-2" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="أضف تعليقاً" />
            <div className="mt-2 flex justify-end"><button onClick={addComment} className="rounded-md bg-[#2563eb] px-3 py-2 text-white">إرسال</button></div>
          </div>

          <div className="mt-3 space-y-2">
            {thread.map((t, i) => (
              <div key={i} className="rounded border p-2 text-sm">{t.text} <div className="text-xs text-gray-400">{new Date(t.at).toLocaleString()}</div></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
