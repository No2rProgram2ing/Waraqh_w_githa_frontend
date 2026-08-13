import { useState } from 'react'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { useReviews, useUpdateReviewStatus, useDeleteReview } from '../hooks/useReviews'
import ReviewsTable from '../components/ReviewsTable'
import ReviewFiltersBar from '../components/ReviewFiltersBar'
import ReviewReplyModal from '../components/ReviewReplyModal'
import type { ReviewFilters, Review } from '../types/review'

const DEFAULT_FILTERS: ReviewFilters = {
    search: '',
    status: '',
    rating: '',
    date_from: '',
    date_to: '',
    page: 1,
}

export default function ReviewsPage() {
    const [filters, setFilters] = useState<ReviewFilters>(DEFAULT_FILTERS)
    const [replyModalOpen, setReplyModalOpen] = useState(false)
    const [reviewToReply, setReviewToReply] = useState<Review | null>(null)

    const { data, isLoading, isError, refetch } = useReviews(filters)
    const { mutate: updateStatus } = useUpdateReviewStatus()
    const { mutate: deleteReview } = useDeleteReview()

    const reviews = data?.data ?? []
    const meta = data?.meta

    const handleUpdateStatus = (id: number, status: 'published' | 'rejected') => {
        const statusLabel = status === 'published' ? 'موافقة ونشر' : 'رفض'
        if (confirm(`هل أنت متأكد من ${statusLabel} هذا التقييم؟`)) {
            updateStatus({ id, status })
        }
    }

    const handleDelete = (review: Review) => {
        if (confirm(`هل أنت متأكد من الحذف النهائي لتقييم العميل ${review.customer_name}؟ لا يمكن التراجع عن هذا الإجراء.`)) {
            deleteReview(review.id)
        }
    }

    const handleReply = (review: Review) => {
        setReviewToReply(review)
        setReplyModalOpen(true)
    }

    if (isError) {
        return (
            <div dir="rtl" className="space-y-6">
                <h1 className="text-[28px] font-extrabold text-[var(--color-text-primary)]">مراجعة التقييمات</h1>
                <p className="text-sm text-[var(--color-danger)]">حدث خطأ أثناء تحميل التقييمات.</p>
                <button
                    onClick={() => void refetch()}
                    className="rounded-xl bg-[#45592D] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5D7243]"
                >
                    إعادة المحاولة
                </button>
            </div>
        )
    }

    return (
        <div dir="rtl" className="space-y-6">
            <div>
                <h1 className="text-[28px] font-extrabold text-[var(--color-text-primary)]">التقييمات والتعليقات</h1>
                <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                    مراجعة تقييمات العملاء للمنتجات، والموافقة عليها، والرد على استفساراتهم
                    {meta && ` — ${meta.total} تقييم إجمالاً`}
                </p>
            </div>

            {/* Filters */}
            <div className="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface-card)] p-5">
                <ReviewFiltersBar
                    filters={filters}
                    onChange={setFilters}
                    onReset={() => setFilters(DEFAULT_FILTERS)}
                />
            </div>

            {/* List */}
            {isLoading ? (
                <div className="text-center py-16 text-sm text-[var(--color-text-muted)]">جاري التحميل...</div>
            ) : (
                <ReviewsTable
                    reviews={reviews}
                    onReply={handleReply}
                    onUpdateStatus={handleUpdateStatus}
                    onDelete={handleDelete}
                />
            )}

            {/* Pagination */}
            {meta && meta.last_page > 1 && (
                <div className="flex items-center justify-between" dir="rtl">
                    <p className="text-sm text-[var(--color-text-muted)]">
                        صفحة {meta.current_page} من {meta.last_page}
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            disabled={meta.current_page <= 1}
                            onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) - 1 }))}
                            className="flex items-center gap-1 rounded-xl border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight size={16} />
                            السابق
                        </button>
                        <button
                            disabled={meta.current_page >= meta.last_page}
                            onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) + 1 }))}
                            className="flex items-center gap-1 rounded-xl border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            التالي
                            <ChevronLeft size={16} />
                        </button>
                    </div>
                </div>
            )}

            <ReviewReplyModal
                isOpen={replyModalOpen}
                onClose={() => {
                    setReplyModalOpen(false)
                    setReviewToReply(null)
                }}
                review={reviewToReply}
            />
        </div>
    )
}
