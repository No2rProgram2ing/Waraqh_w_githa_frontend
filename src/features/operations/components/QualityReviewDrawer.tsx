import { useState } from 'react'
import { Badge, type BadgeVariant } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { QualityReview } from '../types/quality.types'
import { useApproveReview, useRejectReview } from '../hooks/useQuality'
import { ImageLightbox } from './ImageLightbox'

function getQualityStatusVariant(status: string): BadgeVariant {
  switch (status) {
    case 'approved':
    case 'passed':
    case 'completed':
      return 'success'
    case 'pending':
    case 'under_review':
      return 'warning'
    case 'rejected':
    case 'failed':
      return 'danger'
    default:
      return 'neutral'
  }
}

export function QualityReviewDrawer({
  review,
  onClose,
  onUpdated,
}: {
  review: QualityReview | null
  onClose: () => void
  onUpdated?: () => void
}) {
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null)
  const approveMutation = useApproveReview()
  const rejectMutation = useRejectReview()

  if (!review) return null

  const onApprove = async () => {
    try {
      await approveMutation.mutateAsync({
        id: review.id,
      })
      onUpdated?.()
    } catch (err) {
      console.error(err)
    }
  }

  const onReject = async () => {
    try {
      await rejectMutation.mutateAsync({
        id: review.id,
        payload: {
          reason: 'rejected_by_admin',
        },
      })
      onUpdated?.()
    } catch (err) {
      console.error(err)
    }
  }

  const isUpdating =
    approveMutation.isPending || rejectMutation.isPending

  return (
    <div
      className="fixed inset-0 z-50 flex"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quality-review-title"
    >
      <button
        type="button"
        aria-label="إغلاق مراجعة الجودة"
        onClick={onClose}
        className="flex-1 bg-black/40 backdrop-blur-[2px]"
      />

      <aside className="flex h-full w-full max-w-[640px] flex-col border-s border-[var(--color-border)] bg-[var(--color-surface-card)] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-5">
          <h3
            id="quality-review-title"
            className="text-lg font-bold text-[var(--color-text-primary)]"
          >
            مراجعة جودة — {review.order_number}
          </h3>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
          >
            إغلاق
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="space-y-5 text-right">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-4">
                <p className="text-xs font-medium text-[var(--color-text-muted)]">
                  العميل
                </p>
                <p className="mt-1 font-semibold text-[var(--color-text-primary)]">
                  {review.customer_name ?? '—'}
                </p>
              </div>

              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-4">
                <p className="text-xs font-medium text-[var(--color-text-muted)]">
                  المنتج
                </p>
                <p className="mt-1 font-semibold text-[var(--color-text-primary)]">
                  {review.product_name ?? '—'}
                </p>
              </div>

              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-4 sm:col-span-2">
                <p className="text-xs font-medium text-[var(--color-text-muted)]">
                  الحالة
                </p>

                <div className="mt-2">
                  <Badge variant={getQualityStatusVariant(review.status)}>
                    {review.status}
                  </Badge>
                </div>
              </div>
            </div>

            <section>
              <h4 className="text-sm font-semibold text-[var(--color-text-primary)]">
                ملاحظات العميل
              </h4>

              <div className="mt-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm leading-6 text-[var(--color-text-secondary)]">
                {review.notes ?? '—'}
              </div>
            </section>

            <section>
              <h4 className="text-sm font-semibold text-[var(--color-text-primary)]">
                الصور
              </h4>

              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {review.images && review.images.length ? (
                  review.images.map((image) => (
                    <button
                      key={image.id}
                      type="button"
                      onClick={() => setLightboxUrl(image.url)}
                      className="group overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                      aria-label={`عرض صورة ${image.id}`}
                    >
                      <img
                        src={image.url}
                        alt={`صورة مراجعة الجودة ${image.id}`}
                        className="aspect-square w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                      />
                    </button>
                  ))
                ) : (
                  <div className="col-span-full rounded-xl border border-dashed border-[var(--color-border-muted)] px-4 py-4 text-sm text-[var(--color-text-muted)]">
                    لا توجد صور
                  </div>
                )}
              </div>
            </section>

            <div className="flex flex-col gap-2 pt-2 sm:flex-row">
              <Button
                type="button"
                onClick={onApprove}
                isLoading={approveMutation.isPending}
                disabled={isUpdating}
                fullWidth
              >
                موافقة
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={onReject}
                isLoading={rejectMutation.isPending}
                disabled={isUpdating}
                fullWidth
              >
                رفض
              </Button>
            </div>
          </div>
        </div>

        {lightboxUrl && (
          <ImageLightbox
            url={lightboxUrl}
            onClose={() => setLightboxUrl(null)}
          />
        )}
      </aside>
    </div>
  )
}