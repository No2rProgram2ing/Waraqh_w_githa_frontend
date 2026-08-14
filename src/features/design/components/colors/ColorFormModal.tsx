import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { showErrorToast, showSuccessToast, showValidationErrorToast } from '@/lib/toast'
import type { Color } from '../../types/color'
import { useCreateColor, useUpdateColor } from '../../hooks/useColors'

interface ColorFormModalProps {
    isOpen: boolean
    onClose: () => void
    colorToEdit?: Color | null
}

export default function ColorFormModal({ isOpen, onClose, colorToEdit }: ColorFormModalProps) {
    const { mutate: createColor, isPending: isCreating } = useCreateColor()
    const { mutate: updateColor, isPending: isUpdating } = useUpdateColor()

    const [name, setName] = useState('')
    const [hexCode, setHexCode] = useState('#000000')

    useEffect(() => {
        if (colorToEdit) {
            setName(colorToEdit.name)
            setHexCode(colorToEdit.hex_code)
        } else {
            setName('')
            setHexCode('#000000')
        }
    }, [colorToEdit, isOpen])

    if (!isOpen) return null

    const isPending = isCreating || isUpdating

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const payload = { name, hex_code: hexCode }
        if (colorToEdit) {
            updateColor({ id: colorToEdit.id, data: payload }, {
                onSuccess: () => {
                    showSuccessToast('تم تحديث اللون بنجاح')
                    onClose()
                },
                onError: (error: any) => {
                    const validationErrors = error?.response?.data?.errors as Record<string, string[]> | undefined
                    if (validationErrors) {
                        showValidationErrorToast(validationErrors)
                        return
                    }
                    showErrorToast(error?.response?.data?.message || 'فشل في تحديث اللون، يرجى المحاولة مرة أخرى.')
                },
            })
        } else {
            createColor(payload, {
                onSuccess: () => {
                    showSuccessToast('تمت إضافة اللون بنجاح')
                    onClose()
                },
                onError: (error: any) => {
                    const validationErrors = error?.response?.data?.errors as Record<string, string[]> | undefined
                    if (validationErrors) {
                        showValidationErrorToast(validationErrors)
                        return
                    }
                    showErrorToast(error?.response?.data?.message || 'فشل في إضافة اللون، يرجى المحاولة مرة أخرى.')
                },
            })
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-[var(--color-surface-card)] rounded-2xl w-full max-w-sm shadow-xl" dir="rtl">
                <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)] bg-[var(--color-surface)] rounded-t-2xl">
                    <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
                        {colorToEdit ? 'تعديل اللون' : 'إضافة لون جديد'}
                    </h2>
                    <button onClick={onClose} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">اسم اللون</label>
                        <input
                            required
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none focus:border-[#45592D] transition-colors"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">كود اللون</label>
                        <div className="flex items-center gap-3">
                            <input
                                required
                                type="color"
                                value={hexCode}
                                onChange={(e) => setHexCode(e.target.value)}
                                className="h-10 w-12 cursor-pointer rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-card)] p-1"
                            />
                            <input
                                required
                                type="text"
                                pattern="^#[0-9A-Fa-f]{6}$"
                                value={hexCode}
                                onChange={(e) => setHexCode(e.target.value)}
                                className="flex-1 rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none focus:border-[#45592D] transition-colors"
                                placeholder="#000000"
                                dir="ltr"
                            />
                        </div>
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
                            disabled={isPending}
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
