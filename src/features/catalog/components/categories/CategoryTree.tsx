import { useMemo } from 'react'
import type { ProductCategory } from '../../types/product-category'
import CategoryTreeNode, { type TreeNode } from './CategoryTreeNode'

interface CategoryTreeProps {
    categories: ProductCategory[]
    onEdit: (category: ProductCategory) => void
    onAddChild: (parentId: number) => void
}

export default function CategoryTree({ categories, onEdit, onAddChild }: CategoryTreeProps) {
    const tree = useMemo(() => {
        const categoryMap = new Map<number, TreeNode>()
        const roots: TreeNode[] = []

        categories.forEach(cat => {
            categoryMap.set(cat.id, { ...cat, children: [] })
        })

        categories.forEach(cat => {
            const node = categoryMap.get(cat.id)!
            if (cat.parent_id === null) {
                roots.push(node)
            } else {
                const parent = categoryMap.get(cat.parent_id)
                if (parent) {
                    parent.children.push(node)
                } else {
                    roots.push(node)
                }
            }
        })

        return roots
    }, [categories])

    if (!tree.length) {
        return (
            <div className="text-center py-12 text-[var(--color-text-muted)] text-sm bg-[var(--color-surface)] rounded-2xl border border-dashed border-[var(--color-border-muted)]">
                لا توجد فئات حتى الآن. أضف فئة جديدة للبدء.
            </div>
        )
    }

    return (
        <div className="bg-[var(--color-surface-card)] rounded-2xl border border-[var(--color-border)] p-4">
            {tree.map(node => (
                <CategoryTreeNode 
                    key={node.id} 
                    node={node} 
                    level={0}
                    onEdit={onEdit}
                    onAddChild={onAddChild}
                />
            ))}
        </div>
    )
}
