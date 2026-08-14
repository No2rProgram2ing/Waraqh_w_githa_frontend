import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { showErrorToast, showSuccessToast, showValidationErrorToast } from '@/lib/toast'
import type { Review } from '../types/review'
import { useReplyToReview } from '../hooks/useReviews'

interface ReviewReplyModalProps {
    isOpen: boolean
    onClose: () => void
    review: Review | null
}

export default function ReviewReplyModal({ isOpen, onClose, review }: ReviewReplyModalProps) {
    const [replyText, setReplyText] = useState('')
    const { mutate: replyToReview, isPending } = useReplyToReview()

    useEffect(() => {
        if (review) {
            setReplyText(review.admin_reply ?? '')
        }
    }, [review, isOpen])

    if (!isOpen || !review) return null

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        replyToReview(
            { id: review.id, admin_reply: replyText },
            {
                onSuccess: () => {
                    showSuccessToast('تم إرسال الرد بنجاح')
                    onClose()
                },
                onError: (error: any) => {
                    const validationErrors = error?.response?.data?.errors as Record<string, string[]> | undefined
                    if (validationErrors) {
                        showValidationErrorToast(validationErrors)
                        return
                    }
                    showErrorToast(error?.response?.data?.message || 'فشل في إرسال الرد، يرجى المحاولة مرة أخرى.')
                },
            }
        )
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-[var(--color-surface-card)] rounded-2xl w-full max-w-lg shadow-xl flex flex-col" dir="rtl">
                <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)] bg-[var(--color-surface)] rounded-t-2xl shrink-0">
                    <h2 className="text-lg font-bold text-[var(--color-text-primary)]">الرد على العميل</h2>
                    <button onClick={onClose} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-5 flex-1 overflow-y-auto">
                    <div className="mb-5 p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
                        <p className="text-xs text-[var(--color-text-muted)] mb-1">رسالة العميل ({review.customer_name}):</p>
                        <p className="text-sm text-[var(--color-text-primary)]">{review.comment ?? 'لا يوجد تعليق نصي'}</p>
                    </div>

                    <form id="reply-form" onSubmit={handleSubmit}>
                        <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">رد الإدارة</label>
                        <textarea
                            required
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="اكتب ردك هنا... سيظهر هذا الرد للعميل على الموقع."
                            className="w-full rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm outline-none focus:border-[#45592D] transition-colors resize-none h-32"
                        />
                    </form>
                </div>

                <div className="p-5 flex items-center justify-end gap-3 border-t border-[var(--color-border)] shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2.5 rounded-xl border border-[var(--color-border)] text-[var(--color-text-secondary)] text-sm font-medium hover:bg-[var(--color-surface)] transition-colors"
                    >
                        إلغاء
                    </button>
                    <button
                        type="submit"
                        form="reply-form"
                        disabled={isPending || !replyText.trim()}
                        className="px-4 py-2.5 rounded-xl bg-[#45592D] text-white text-sm font-semibold hover:bg-[#5D7243] transition-colors disabled:opacity-50"
                    >
                        {isPending ? 'جاري الإرسال...' : 'نشر الرد'}
                    </button>
                </div>
            </div>
        </div>
    )
}
