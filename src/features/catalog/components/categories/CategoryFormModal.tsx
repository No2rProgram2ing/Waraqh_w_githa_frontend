import { useState, useEffect } from 'react'
import type { ProductCategory } from '../../types/product-category'
import { useCreateCategory, useUpdateCategory } from '../../hooks/useCategories'
import { X } from 'lucide-react'

interface CategoryFormModalProps {
    isOpen: boolean
    onClose: () => void
    categories: ProductCategory[]
    categoryToEdit?: ProductCategory | null
    parentCategoryId?: number | null
}

export default function CategoryFormModal({ 
    isOpen, 
    onClose, 
    categories, 
    categoryToEdit, 
    parentCategoryId 
}: CategoryFormModalProps) {
    const { mutate: createCategory, isPending: isCreating } = useCreateCategory()
    const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory()

    const [name, setName] = useState('')
    const [slug, setSlug] = useState('')
    const [parentId, setParentId] = useState<number | ''>('')
    const [imageUrl, setImageUrl] = useState('')

    useEffect(() => {
        if (categoryToEdit) {
            setName(categoryToEdit.name)
            setSlug(categoryToEdit.slug)
            setParentId(categoryToEdit.parent_id ?? '')
            setImageUrl(categoryToEdit.image_url ?? '')
        } else {
            setName('')
            setSlug('')
            setParentId(parentCategoryId ?? '')
            setImageUrl('')
        }
    }, [categoryToEdit, parentCategoryId, isOpen])

    if (!isOpen) return null

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        
        const payload = {
            name,
            slug,
            image_url: imageUrl || null,
            parent_id: parentId === '' ? null : Number(parentId)
        }

        if (categoryToEdit) {
            updateCategory(
                { id: categoryToEdit.id, data: payload },
                { onSuccess: onClose }
            )
        } else {
            createCategory(payload, { onSuccess: onClose })
        }
    }

    const isPending = isCreating || isUpdating

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-[var(--color-surface-card)] rounded-2xl w-full max-w-md overflow-hidden shadow-xl" dir="rtl">
                <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
                    <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
                        {categoryToEdit ? 'تعديل الفئة' : 'إضافة فئة جديدة'}
                    </h2>
                    <button onClick={onClose} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">
                        <X size={20} />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">اسم الفئة</label>
                        <input
                            required
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none focus:border-[#45592D] transition-colors"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">الرابط (Slug)</label>
                        <input
                            required
                            type="text"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none focus:border-[#45592D] transition-colors"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">الفئة الأب (اختياري)</label>
                        <select
                            value={parentId}
                            onChange={(e) => setParentId(e.target.value === '' ? '' : Number(e.target.value))}
                            className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none focus:border-[#45592D] transition-colors"
                        >
                            <option value="">بدون فئة أب (رئيسية)</option>
                            {categories
                                .filter(c => c.id !== categoryToEdit?.id)
                                .map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))
                            }
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">رابط الصورة (اختياري)</label>
                        <input
                            type="url"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none focus:border-[#45592D] transition-colors"
                        />
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
