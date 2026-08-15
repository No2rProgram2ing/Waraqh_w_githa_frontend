import { useState } from 'react'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { showErrorToast, showSuccessToast, showValidationErrorToast } from '@/lib/toast'
import { useColors, useDeleteColor } from '../../hooks/useColors'
import ColorFormModal from './ColorFormModal'
import type { Color } from '../../types/color'

export default function ColorsTab() {
    const { data: colors = [], isLoading, isError, refetch } = useColors()
    const { mutate: deleteColor } = useDeleteColor()

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [colorToEdit, setColorToEdit] = useState<Color | null>(null)

    const handleAdd = () => {
        setColorToEdit(null)
        setIsModalOpen(true)
    }

    const handleEdit = (color: Color) => {
        setColorToEdit(color)
        setIsModalOpen(true)
    }

    const handleDelete = (color: Color) => {
        if (confirm(`هل أنت متأكد من حذف اللون "${color.name}"؟`)) {
            deleteColor(color.id, {
                onSuccess: () => showSuccessToast('تم حذف اللون بنجاح'),
                onError: (error: any) => {
                    const validationErrors = error?.response?.data?.errors as Record<string, string[]> | undefined
                    if (validationErrors) {
                        showValidationErrorToast(validationErrors)
                        return
                    }
                    showErrorToast(error?.response?.data?.message || 'فشل في حذف اللون، يرجى المحاولة مرة أخرى.')
                },
            })
        }
    }

    if (isLoading) {
        return <div className="py-12 text-center text-sm text-[var(--color-text-muted)]">جاري تحميل الألوان...</div>
    }

    if (isError) {
        return (
            <div className="py-12 text-center">
                <p className="text-sm text-[var(--color-danger)] mb-4">حدث خطأ أثناء التحميل.</p>
                <button onClick={() => void refetch()} className="text-[#45592D] underline text-sm">
                    إعادة المحاولة
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-[var(--color-text-primary)]">ألوان المنتجات</h2>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 rounded-xl bg-[#45592D] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#5D7243]"
                >
                    <Plus size={16} />
                    إضافة لون
                </button>
            </div>

            {!colors.length ? (
                <div className="text-center py-16 text-[var(--color-text-muted)] text-sm bg-[var(--color-surface)] rounded-2xl border border-dashed border-[var(--color-border-muted)]">
                    لا توجد ألوان حالياً. أضف لوناً جديداً للبدء.
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {colors.map((color) => (
                        <div key={color.id} className="group relative rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-card)] p-4 overflow-hidden">
                            <div 
                                className="w-full aspect-square rounded-xl shadow-inner mb-3 border border-black/5" 
                                style={{ backgroundColor: color.hex_code }}
                            />
                            <h3 className="font-semibold text-sm text-[var(--color-text-primary)] text-center truncate">{color.name}</h3>
                            <p className="text-xs text-[var(--color-text-muted)] text-center mt-0.5" dir="ltr">{color.hex_code.toUpperCase()}</p>
                            
                            <div className="absolute inset-0 bg-[var(--color-surface-card)]/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button
                                    onClick={() => handleEdit(color)}
                                    className="p-2 rounded-full bg-[#EBE1D7] text-[var(--color-text-secondary)] hover:bg-[#DCCFC1] transition-colors"
                                    title="تعديل"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(color)}
                                    className="p-2 rounded-full bg-[var(--color-danger-subtle)] text-[var(--color-danger)] hover:bg-[var(--color-danger-subtle-hover)] transition-colors"
                                    title="حذف"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <ColorFormModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                colorToEdit={colorToEdit} 
            />
        </div>
    )
}
