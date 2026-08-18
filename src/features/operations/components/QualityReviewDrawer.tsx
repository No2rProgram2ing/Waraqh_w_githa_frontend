import React, { useState } from 'react'
import type { QualityReview } from '../types/quality.types'
import { useApproveReview, useRejectReview } from '../hooks/useQuality'
import { ImageLightbox } from './ImageLightbox'

export function QualityReviewDrawer({ review, onClose, onUpdated }: { review: QualityReview | null; onClose: () => void; onUpdated?: () => void }){
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null)
  const approveMutation = useApproveReview()
  const rejectMutation = useRejectReview()

  if (!review) return null

  const onApprove = async () => {
    try {
      await approveMutation.mutateAsync({ id: review.id })
      onUpdated && onUpdated()
    } catch (err) {
      console.error(err)
    }
  }

  const onReject = async () => {
    try {
      await rejectMutation.mutateAsync({ id: review.id, payload: { reason: 'rejected_by_admin' } })
      onUpdated && onUpdated()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1" onClick={onClose} />
      <aside className="w-[640px] bg-white p-6 shadow-xl overflow-auto">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">مراجعة جودة — {review.order_number}</h3>
          <button onClick={onClose} className="text-sm">إغلاق</button>
        </div>

        <div className="mt-4 space-y-4 text-right">
          <div><strong>العميل:</strong> {review.customer_name ?? '-'}</div>
          <div><strong>المنتج:</strong> {review.product_name ?? '-'}</div>
          <div><strong>الحالة:</strong> {review.status}</div>
          <div><strong>ملاحظات العميل:</strong> {review.notes ?? '-'}</div>

          <div>
            <strong>الصور:</strong>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {review.images && review.images.length ? (
                review.images.map((img) => (
                  <img key={img.id} src={img.url} className="h-28 w-full object-cover rounded cursor-pointer" onClick={() => setLightboxUrl(img.url)} />
                ))
              ) : (
                <div>لا توجد صور</div>
              )}
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button onClick={onApprove} className="rounded-md bg-emerald-600 px-4 py-2 text-white">موافقة</button>
            <button onClick={onReject} className="rounded-md bg-red-600 px-4 py-2 text-white">رفض</button>
          </div>
        </div>

        {lightboxUrl && <ImageLightbox url={lightboxUrl} onClose={() => setLightboxUrl(null)} />}
      </aside>
    </div>
  )
}
