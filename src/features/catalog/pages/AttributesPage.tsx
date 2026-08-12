import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useAttributes, useDeleteAttribute } from '../hooks/useAttributes'
import AttributesTable from '../components/attributes/AttributesTable'
import AttributeFormModal from '../components/attributes/AttributeFormModal'
import type { ProductAttribute } from '../types/product-attribute'

export default function AttributesPage() {
    const { data: attributes = [], isLoading, isError, refetch } = useAttributes()
    const { mutate: deleteAttribute } = useDeleteAttribute()

    const [isFormOpen, setIsFormOpen] = useState(false)
    const [attributeToEdit, setAttributeToEdit] = useState<ProductAttribute | null>(null)

    const handleAddNew = () => {
        setAttributeToEdit(null)
        setIsFormOpen(true)
    }

    const handleEdit = (attribute: ProductAttribute) => {
        setAttributeToEdit(attribute)
        setIsFormOpen(true)
    }

    const handleDelete = (attribute: ProductAttribute) => {
        if (confirm(`هل أنت متأكد من حذف الخاصية "${attribute.display_name}"؟`)) {
            deleteAttribute(attribute.id)
        }
    }

    const handleCloseForm = () => {
        setIsFormOpen(false)
        setAttributeToEdit(null)
    }

    if (isLoading) {
        return (
            <div dir="rtl" className="space-y-6">
                <h1 className="text-[28px] font-extrabold text-[var(--color-text-primary)]">خصائص المنتجات</h1>
                <p className="text-sm text-[var(--color-text-muted)]">جاري تحميل الخصائص...</p>
            </div>
        )
    }

    if (isError) {
        return (
            <div dir="rtl" className="space-y-6">
                <h1 className="text-[28px] font-extrabold text-[var(--color-text-primary)]">خصائص المنتجات</h1>
                <p className="text-sm text-[var(--color-danger)]">حدث خطأ أثناء تحميل البيانات.</p>
                <button
                    onClick={() => void refetch()}
                    className="rounded-xl bg-[#45592D] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5D7243]"
                >
                    إعادة المحاولة
                </button>
            </div>
        )
    }

    return (
        <div dir="rtl" className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-[28px] font-extrabold text-[var(--color-text-primary)]">خصائص المنتجات</h1>
                    <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                        إدارة السمات والخصائص الإضافية للمنتجات (مثل المقاس، الوزن، المواد)
                    </p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="flex items-center gap-2 rounded-xl bg-[#45592D] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5D7243]"
                >
                    <Plus size={18} />
                    إضافة خاصية جديدة
                </button>
            </div>

            <AttributesTable
                attributes={attributes}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <AttributeFormModal
                isOpen={isFormOpen}
                onClose={handleCloseForm}
                attributeToEdit={attributeToEdit}
            />
        </div>
    )
}
