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

const generateSlug = (text: string): string => {
    return text
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\u0600-\u06FF-]+/g, '')
        .replace(/^-+|-+$/g, '')
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
    const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false)
    const [parentId, setParentId] = useState<number | ''>('')
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState('')

    useEffect(() => {
        if (categoryToEdit) {
            setName(categoryToEdit.name ?? '')
            setSlug(categoryToEdit.slug ?? '')
            setIsSlugManuallyEdited(true)
            setParentId(categoryToEdit.parent_id ?? '')
            setImageFile(null)
            setImagePreview(categoryToEdit.image_url ?? '')
        } else {
            setName('')
            setSlug('')
            setIsSlugManuallyEdited(false)
            setParentId(parentCategoryId ?? '')
            setImageFile(null)
            setImagePreview('')
        }
    }, [categoryToEdit, parentCategoryId, isOpen])

    if (!isOpen) return null

    const handleNameChange = (val: string) => {
        setName(val)
        if (!isSlugManuallyEdited) {
            setSlug(generateSlug(val))
        }
    }

    const handleSlugChange = (val: string) => {
        setSlug(val)
        setIsSlugManuallyEdited(true)
    }

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]

        if (!file) {
            setImageFile(null)
            setImagePreview(categoryToEdit?.image_url ?? '')
            return
        }

        setImageFile(file)
        setImagePreview(URL.createObjectURL(file))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const finalSlug = slug.trim() || generateSlug(name)

        const formData = new FormData()
        formData.append('name', name)
        formData.append('slug', finalSlug)

        if (parentId !== '') {
            formData.append('parent_id', String(Number(parentId)))
        }

        if (imageFile) {
            formData.append('image', imageFile)
        }

        if (categoryToEdit) {
            formData.append('_method', 'PUT')
            updateCategory(
                { id: categoryToEdit.id, data: formData as unknown as Parameters<typeof updateCategory>[0]['data'] },
                { onSuccess: onClose }
            )
        } else {
            createCategory(formData as unknown as Parameters<typeof createCategory>[0], { onSuccess: onClose })
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
                            onChange={(e) => handleNameChange(e.target.value)}
                            className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none focus:border-[#45592D] transition-colors"
                            placeholder="أدخل اسم الفئة"
                        />
                    </div>
                    
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="block text-sm font-medium text-[var(--color-text-secondary)]">الرابط (Slug)</label>
                            {isSlugManuallyEdited && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsSlugManuallyEdited(false)
                                        setSlug(generateSlug(name))
                                    }}
                                    className="text-xs text-[#45592D] hover:underline"
                                >
                                    إعادة توليد تلقائي
                                </button>
                            )}
                        </div>
                        <input
                            required
                            type="text"
                            value={slug}
                            onChange={(e) => handleSlugChange(e.target.value)}
                            className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none focus:border-[#45592D] transition-colors"
                            placeholder="يتولّد تلقائياً من اسم الفئة"
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
                        <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">صورة الفئة (اختياري)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm outline-none focus:border-[#45592D] transition-colors"
                        />
                        {imagePreview && (
                            <div className="mt-3 p-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl flex justify-center">
                                <img src={imagePreview} alt="معاينة الفئة" className="max-h-28 object-cover rounded-lg" />
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
