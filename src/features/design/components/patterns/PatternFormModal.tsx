import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import type { DesignPattern } from '../../types/pattern'
import { useCreatePattern, useUpdatePattern } from '../../hooks/usePatterns'

interface PatternFormModalProps {
    isOpen: boolean
    onClose: () => void
    patternToEdit?: DesignPattern | null
}

export default function PatternFormModal({ isOpen, onClose, patternToEdit }: PatternFormModalProps) {
    const { mutate: createPattern, isPending: isCreating } = useCreatePattern()
    const { mutate: updatePattern, isPending: isUpdating } = useUpdatePattern()

    const [name, setName] = useState('')
    const [imageUrl, setImageUrl] = useState('')

    useEffect(() => {
        if (patternToEdit) {
            setName(patternToEdit.name)
            setImageUrl(patternToEdit.image_url)
        } else {
            setName('')
            setImageUrl('')
        }
    }, [patternToEdit, isOpen])

    if (!isOpen) return null

    const isPending = isCreating || isUpdating

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const payload = { name, preview_image_url: imageUrl }
        if (patternToEdit) {
            updatePattern({ id: patternToEdit.id, data: payload }, { onSuccess: onClose })
        } else {
            createPattern(payload, { onSuccess: onClose })
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-[var(--color-surface-card)] rounded-2xl w-full max-w-md shadow-xl" dir="rtl">
                <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)] bg-[var(--color-surface)] rounded-t-2xl">
                    <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
                        {patternToEdit ? 'تعديل النمط' : 'إضافة نمط جديد'}
                    </h2>
                    <button onClick={onClose} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">اسم النمط</label>
                        <input
                            required
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none focus:border-[#45592D] transition-colors"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">رابط الصورة</label>
                        <input
                            required
                            type="url"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="https://example.com/pattern.jpg"
                            className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none focus:border-[#45592D] transition-colors"
                            dir="ltr"
                        />
                        {imageUrl && (
                            <div className="mt-3 p-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl flex justify-center">
                                <img src={imageUrl} alt="معاينة" className="max-h-32 object-contain rounded-lg" />
                            </div>
                        )}
                    </div>

                    <div className="pt-4 flex items-center justify-end gap-3 border-t border-[var(--color-border)] mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2.5 rounded-xl border border-[var(--color-border)] text-[var(--color-text-secondary)] text-sm font-medium hover:bg-[var(--color-surface)] transition-colors"
                        >
                            إلغاء
                        </button>
                        <button
                            type="submit"
                            disabled={isPending || !imageUrl.trim()}
                            className="px-4 py-2.5 rounded-xl bg-[#45592D] text-white text-sm font-semibold hover:bg-[#5D7243] transition-colors disabled:opacity-50"
                        >
                            {isPending ? 'جاري الحفظ...' : 'حفظ'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
