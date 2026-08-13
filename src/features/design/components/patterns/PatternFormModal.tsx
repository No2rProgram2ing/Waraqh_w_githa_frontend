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
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState('')

    useEffect(() => {
        if (patternToEdit) {
            setName(patternToEdit.name)
            setImageFile(null)
            setImagePreview(patternToEdit.image_url ?? patternToEdit.preview_image_url ?? '')
        } else {
            setName('')
            setImageFile(null)
            setImagePreview('')
        }
    }, [patternToEdit, isOpen])

    if (!isOpen) return null

    const isPending = isCreating || isUpdating

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]

        if (!file) {
            setImageFile(null)
            setImagePreview(patternToEdit?.image_url ?? patternToEdit?.preview_image_url ?? '')
            return
        }

        setImageFile(file)
        setImagePreview(URL.createObjectURL(file))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const safeName = (name || patternToEdit?.name || '').trim()
        const formData = new FormData()
        formData.append('name', safeName)

        if (imageFile) {
            formData.append('image', imageFile)
        }

        if (patternToEdit) {
            formData.append('_method', 'PUT')
            updatePattern(
                { id: patternToEdit.id, data: formData as unknown as Parameters<typeof updatePattern>[0]['data'] },
                { onSuccess: onClose }
            )
        } else {
            createPattern(formData as unknown as Parameters<typeof createPattern>[0], { onSuccess: onClose })
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
                        <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">صورة النمط</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm outline-none focus:border-[#45592D] transition-colors"
                        />
                        {imagePreview && (
                            <div className="mt-3 p-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl flex justify-center">
                                <img src={imagePreview} alt="معاينة النمط" className="max-h-32 object-contain rounded-lg" />
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
                            disabled={isPending || !name.trim() || (!imageFile && !imagePreview)}
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
