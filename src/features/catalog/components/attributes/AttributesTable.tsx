import { Edit2, Trash2 } from 'lucide-react'
import type { ProductAttribute } from '../../types/product-attribute'

interface AttributesTableProps {
    attributes: ProductAttribute[]
    onEdit: (attribute: ProductAttribute) => void
    onDelete: (attribute: ProductAttribute) => void
}

const typeLabels: Record<string, string> = {
    text: 'نص',
    number: 'رقم',
    select: 'قائمة منسدلة',
    boolean: 'نعم/لا',
    color: 'لون',
}

export default function AttributesTable({ attributes, onEdit, onDelete }: AttributesTableProps) {
    if (!attributes.length) {
        return (
            <div className="text-center py-12 text-[var(--color-text-muted)] text-sm bg-[var(--color-surface)] rounded-2xl border border-dashed border-[var(--color-border-muted)]">
                لا توجد خصائص مضافة حتى الآن.
            </div>
        )
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-card)]" dir="rtl">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)] text-right">
                        <th className="px-5 py-3.5 font-semibold text-[var(--color-text-secondary)]">الاسم (للعرض)</th>
                        <th className="px-5 py-3.5 font-semibold text-[var(--color-text-secondary)]">الاسم التقني</th>
                        <th className="px-5 py-3.5 font-semibold text-[var(--color-text-secondary)]">النوع</th>
                        <th className="px-5 py-3.5 font-semibold text-[var(--color-text-secondary)] text-center">مطلوب؟</th>
                        <th className="px-5 py-3.5 font-semibold text-[var(--color-text-secondary)]">الخيارات</th>
                        <th className="px-5 py-3.5 font-semibold text-[var(--color-text-secondary)] text-left">الإجراءات</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                    {attributes.map((attr) => (
                        <tr key={attr.id} className="hover:bg-[var(--color-surface)] transition-colors group">
                            <td className="px-5 py-4 font-medium text-[var(--color-text-primary)]">{attr.display_name}</td>
                            <td className="px-5 py-4">
                                <code className="text-xs bg-[var(--color-surface-subtle)] border border-[var(--color-border)] text-[var(--color-text-secondary)] px-2 py-0.5 rounded">
                                    {attr.name}
                                </code>
                            </td>
                            <td className="px-5 py-4 text-[var(--color-text-secondary)]">
                                {typeLabels[attr.type] ?? attr.type}
                            </td>
                            <td className="px-5 py-4 text-center">
                                {attr.is_required ? (
                                    <span className="inline-flex items-center justify-center rounded-full bg-[var(--color-accent-subtle)] px-2 py-0.5 text-xs font-semibold text-[#45592D]">
                                        نعم
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center justify-center rounded-full bg-[var(--color-surface-subtle)] border border-[var(--color-border)] px-2 py-0.5 text-xs font-semibold text-[var(--color-text-muted)]">
                                        لا
                                    </span>
                                )}
                            </td>
                            <td className="px-5 py-4 text-[var(--color-text-muted)] max-w-xs truncate">
                                {attr.type === 'select' && attr.options?.length ? (
                                    <span className="text-xs">{attr.options.join(' ، ')}</span>
                                ) : (
                                    '—'
                                )}
                            </td>
                            <td className="px-5 py-4">
                                <div className="flex items-center justify-end gap-1">
                                    <button
                                        onClick={() => onEdit(attr)}
                                        className="p-2 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-border)] transition-colors"
                                        title="تعديل"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => onDelete(attr)}
                                        className="p-2 rounded-lg text-[var(--color-danger)] hover:bg-[var(--color-danger-subtle)] transition-colors"
                                        title="حذف"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
