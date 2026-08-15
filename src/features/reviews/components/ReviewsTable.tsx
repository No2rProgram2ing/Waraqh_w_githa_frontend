import { Star, MessageSquare, Trash2, CheckCircle, XCircle } from 'lucide-react'
import type { Review } from '../types/review'

interface ReviewsTableProps {
    reviews: Review[]
    onReply: (review: Review) => void
    onUpdateStatus: (id: number, status: 'published' | 'rejected') => void
    onDelete: (review: Review) => void
}

function formatDate(iso: string): string {
    return new Intl.DateTimeFormat('ar-SA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(new Date(iso))
}

export default function ReviewsTable({ reviews, onReply, onUpdateStatus, onDelete }: ReviewsTableProps) {
    if (!reviews.length) {
        return (
            <div className="text-center py-16 text-[var(--color-text-muted)] text-sm bg-[var(--color-surface)] rounded-2xl border border-dashed border-[var(--color-border-muted)]">
                لا توجد تقييمات مطابقة للبحث.
            </div>
        )
    }

    return (
        <div className="space-y-4" dir="rtl">
            {reviews.map((review) => (
                <div key={review.id} className="bg-[var(--color-surface-card)] rounded-2xl border border-[var(--color-border)] p-5 flex flex-col md:flex-row gap-5 transition-shadow hover:shadow-sm">
                    {/* Left/Top Info */}
                    <div className="md:w-[250px] shrink-0 border-b md:border-b-0 md:border-l border-[var(--color-border)] pb-4 md:pb-0 md:pl-5">
                        <p className="font-bold text-[var(--color-text-primary)] mb-1">{review.customer_name}</p>
                        <p className="text-xs text-[var(--color-text-muted)] mb-3">حول: <span className="font-medium text-[#45592D]">{review.product_name}</span></p>
                        
                        <div className="flex gap-0.5 mb-2" dir="ltr">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    size={14}
                                    className={star <= review.rating ? 'fill-[#E8B92A] text-[#E8B92A]' : 'fill-[#EBE1D7] text-[#EBE1D7]'}
                                />
                            ))}
                        </div>
                        <p className="text-[11px] text-[var(--color-text-faint)]">{formatDate(review.created_at)}</p>
                    </div>

                    {/* Comment & Images */}
                    <div className="flex-1">
                        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4">
                            {review.comment ?? <span className="text-[var(--color-text-faint)] italic">لا يوجد تعليق نصي، تقييم بالنجوم فقط.</span>}
                        </p>

                        {review.image_urls && review.image_urls.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {review.image_urls.map((url, idx) => (
                                    <a key={idx} href={url} target="_blank" rel="noreferrer" className="block w-16 h-16 rounded-lg border border-[var(--color-border)] overflow-hidden hover:opacity-80 transition-opacity">
                                        <img src={url} alt={`مرفق ${idx + 1}`} className="w-full h-full object-cover" />
                                    </a>
                                ))}
                            </div>
                        )}

                        {review.admin_reply && (
                            <div className="bg-[var(--color-surface)] p-3 rounded-xl border border-[var(--color-border)] mt-3">
                                <p className="text-xs font-bold text-[#45592D] mb-1">رد الإدارة:</p>
                                <p className="text-sm text-[var(--color-text-secondary)]">{review.admin_reply}</p>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="shrink-0 flex md:flex-col gap-2 items-end justify-center md:border-r border-[var(--color-border)] md:pr-5 pt-4 md:pt-0 border-t md:border-t-0">
                        <div className="flex gap-2">
                            {review.status !== 'published' && (
                                <button
                                    onClick={() => onUpdateStatus(review.id, 'published')}
                                    className="p-2 rounded-lg bg-[var(--color-accent-subtle)] text-[#45592D] hover:bg-[var(--color-accent-subtle-hover)] transition-colors"
                                    title="موافقة ونشر"
                                >
                                    <CheckCircle size={18} />
                                </button>
                            )}
                            {review.status !== 'rejected' && (
                                <button
                                    onClick={() => onUpdateStatus(review.id, 'rejected')}
                                    className="p-2 rounded-lg bg-[var(--color-danger-subtle)] text-[var(--color-danger)] hover:bg-[var(--color-danger-subtle-hover)] transition-colors"
                                    title="رفض"
                                >
                                    <XCircle size={18} />
                                </button>
                            )}
                        </div>

                        <button
                            onClick={() => onReply(review)}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[var(--color-surface-subtle)] text-[var(--color-text-secondary)] text-xs font-semibold hover:bg-[var(--color-border)] transition-colors"
                        >
                            <MessageSquare size={14} />
                            {review.admin_reply ? 'تعديل الرد' : 'رد'}
                        </button>
                        
                        <button
                            onClick={() => onDelete(review)}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-transparent text-[var(--color-danger)] text-xs font-semibold hover:bg-[var(--color-danger-subtle)] transition-colors"
                        >
                            <Trash2 size={14} />
                            حذف نهائي
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}
