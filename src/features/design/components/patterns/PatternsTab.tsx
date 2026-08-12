import { useState } from 'react'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { usePatterns, useDeletePattern } from '../../hooks/usePatterns'
import PatternFormModal from './PatternFormModal'
import type { DesignPattern } from '../../types/pattern'

export default function PatternsTab() {
    const { data: patterns = [], isLoading, isError, refetch } = usePatterns()
    const { mutate: deletePattern } = useDeletePattern()

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [patternToEdit, setPatternToEdit] = useState<DesignPattern | null>(null)

    const handleAdd = () => {
        setPatternToEdit(null)
        setIsModalOpen(true)
    }

    const handleEdit = (pattern: DesignPattern) => {
        setPatternToEdit(pattern)
        setIsModalOpen(true)
    }

    const handleDelete = (pattern: DesignPattern) => {
        if (confirm(`هل أنت متأكد من حذف النمط "${pattern.name}"؟`)) {
            deletePattern(pattern.id)
        }
    }

    if (isLoading) {
        return <div className="py-12 text-center text-sm text-[var(--color-text-muted)]">جاري تحميل الأنماط...</div>
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
                <h2 className="text-xl font-bold text-[var(--color-text-primary)]">أنماط التصميم</h2>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 rounded-xl bg-[#45592D] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#5D7243]"
                >
                    <Plus size={16} />
                    إضافة نمط
                </button>
            </div>

            {!patterns.length ? (
                <div className="text-center py-16 text-[var(--color-text-muted)] text-sm bg-[var(--color-surface)] rounded-2xl border border-dashed border-[var(--color-border-muted)]">
                    لا توجد أنماط حالياً. أضف نمطاً جديداً للبدء.
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {patterns.map((pattern) => (
                        <div key={pattern.id} className="group relative rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-card)] p-3 overflow-hidden flex flex-col">
                            <div className="w-full aspect-square bg-[var(--color-surface)] rounded-xl mb-3 overflow-hidden flex items-center justify-center border border-[var(--color-border)]">
                                <img src={pattern.image_url} alt={pattern.name} className="w-full h-full object-cover" />
                            </div>
                            <h3 className="font-semibold text-sm text-[var(--color-text-primary)] text-center truncate px-2 mb-1">{pattern.name}</h3>
                            
                            <div className="absolute inset-0 bg-[var(--color-surface-card)]/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button
                                    onClick={() => handleEdit(pattern)}
                                    className="p-2 rounded-full bg-[#EBE1D7] text-[var(--color-text-secondary)] hover:bg-[#DCCFC1] transition-colors"
                                    title="تعديل"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(pattern)}
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

            <PatternFormModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                patternToEdit={patternToEdit} 
            />
        </div>
    )
}
