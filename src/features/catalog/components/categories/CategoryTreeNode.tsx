import { useState } from 'react'
import { ChevronDown, ChevronRight, Edit2, Plus, Trash2 } from 'lucide-react'
import { showErrorToast, showSuccessToast, showValidationErrorToast } from '@/lib/toast'
import type { ProductCategory } from '../../types/product-category'
import { useDeleteCategory } from '../../hooks/useCategories'

export interface TreeNode extends ProductCategory {
    children: TreeNode[]
}

interface CategoryTreeNodeProps {
    node: TreeNode
    level: number
    onEdit: (category: ProductCategory) => void
    onAddChild: (parentId: number) => void
}

export default function CategoryTreeNode({ node, level, onEdit, onAddChild }: CategoryTreeNodeProps) {
    const [isExpanded, setIsExpanded] = useState(true)
    const { mutate: deleteCategory } = useDeleteCategory()
    
    const hasChildren = node.children && node.children.length > 0

    const handleDelete = () => {
        if (confirm(`هل أنت متأكد من حذف فئة "${node.name}"؟`)) {
            deleteCategory(node.id, {
                onSuccess: () => showSuccessToast('تم حذف الفئة بنجاح'),
                onError: (error: any) => {
                    const validationErrors = error?.response?.data?.errors as Record<string, string[]> | undefined
                    if (validationErrors) {
                        showValidationErrorToast(validationErrors)
                        return
                    }

                    showErrorToast(error?.response?.data?.message || 'فشل في حذف الفئة، يرجى المحاولة مرة أخرى.')
                },
            })
        }
    }

    return (
        <div className="select-none">
            <div 
                className={`flex items-center justify-between py-2.5 px-3 hover:bg-[var(--color-surface)] rounded-xl group transition-colors border border-transparent hover:border-[var(--color-border)] ${level === 0 ? 'mt-2' : ''}`}
                style={{ marginRight: `${level * 24}px` }}
            >
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setIsExpanded(!isExpanded)}
                        className={`w-6 h-6 flex items-center justify-center rounded-md text-[var(--color-text-muted)] hover:bg-[var(--color-border)] transition-colors ${!hasChildren && 'invisible'}`}
                    >
                        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                    
                    <span className="text-sm font-medium text-[var(--color-text-primary)]">{node.name}</span>
                    <span className="text-xs text-[var(--color-text-muted)] bg-[#EBE1D7]/50 px-2 py-0.5 rounded-full ml-2">
                        {node.slug}
                    </span>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity mr-4">
                    <button 
                        onClick={() => onAddChild(node.id)}
                        className="p-1.5 text-[#45592D] hover:bg-[var(--color-accent-subtle)] rounded-lg transition-colors"
                        title="إضافة فئة فرعية"
                    >
                        <Plus size={15} />
                    </button>
                    <button 
                        onClick={() => onEdit(node)}
                        className="p-1.5 text-[var(--color-text-muted)] hover:bg-[var(--color-border)] rounded-lg transition-colors"
                        title="تعديل"
                    >
                        <Edit2 size={15} />
                    </button>
                    <button 
                        onClick={handleDelete}
                        className="p-1.5 text-[var(--color-danger)] hover:bg-[var(--color-danger-subtle)] rounded-lg transition-colors"
                        title="حذف"
                    >
                        <Trash2 size={15} />
                    </button>
                </div>
            </div>

            {isExpanded && hasChildren && (
                <div className="flex flex-col relative before:absolute before:right-6 before:top-0 before:bottom-4 before:w-px before:bg-[#EBE1D7]">
                    {node.children.map(child => (
                        <CategoryTreeNode 
                            key={child.id} 
                            node={child} 
                            level={level + 1}
                            onEdit={onEdit}
                            onAddChild={onAddChild}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
