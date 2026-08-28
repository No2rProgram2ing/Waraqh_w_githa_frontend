import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useCategories } from '../hooks/useCategories'
import CategoryTree from '../components/categories/CategoryTree'
import CategoryFormModal from '../components/categories/CategoryFormModal'
import type { ProductCategory } from '../types/product-category'

export default function CategoriesPage() {
    const { data: categories = [], isLoading, isError, refetch } = useCategories()
    
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [categoryToEdit, setCategoryToEdit] = useState<ProductCategory | null>(null)
    const [parentCategoryId, setParentCategoryId] = useState<number | null>(null)

    const handleAddMain = () => {
        setCategoryToEdit(null)
        setParentCategoryId(null)
        setIsModalOpen(true)
    }

    const handleAddChild = (parentId: number) => {
        setCategoryToEdit(null)
        setParentCategoryId(parentId)
        setIsModalOpen(true)
    }

    const handleEdit = (category: ProductCategory) => {
        setCategoryToEdit(category)
        setParentCategoryId(null)
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setCategoryToEdit(null)
        setParentCategoryId(null)
    }

    if (isLoading) {
        return (
            <div dir="rtl" className="space-y-6">
                <div>
                    <h1 className="text-[28px] font-extrabold text-[var(--color-text-primary)]">إدارة الفئات</h1>
                    <p className="mt-2 text-sm text-[var(--color-text-muted)]">جاري تحميل الفئات...</p>
                </div>
            </div>
        )
    }

    if (isError) {
        return (
            <div dir="rtl" className="space-y-6">
                <div>
                    <h1 className="text-[28px] font-extrabold text-[var(--color-text-primary)]">إدارة الفئات</h1>
                    <p className="mt-2 text-sm text-[var(--color-danger)]">حدث خطأ أثناء تحميل الفئات.</p>
                </div>
                <button onClick={() => void refetch()} className="rounded-xl bg-[#45592D] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5D7243]">
                    إعادة المحاولة
                </button>
            </div>
        )
    }

    return (
        <div dir="rtl" className="space-y-6 relative h-full">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-[28px] font-extrabold text-[var(--color-text-primary)]">إدارة الفئات</h1>
                    <p className="mt-2 text-sm text-[var(--color-text-muted)]">إدارة وتصنيف المنتجات في هيكل هرمي (Tree View)</p>
                </div>

                <button 
                    onClick={handleAddMain}
                    className="flex items-center gap-2 rounded-xl bg-[#45592D] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5D7243]"
                >
                    <Plus size={18} />
                    إضافة فئة رئيسية
                </button>
            </div>

            <div className="mt-6">
                <CategoryTree 
                    categories={categories} 
                    onEdit={handleEdit}
                    onAddChild={handleAddChild}
                />
            </div>

            <CategoryFormModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                categories={categories}
                categoryToEdit={categoryToEdit}
                parentCategoryId={parentCategoryId}
            />
        </div>
    )
}
