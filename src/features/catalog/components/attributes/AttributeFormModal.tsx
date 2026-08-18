import { useState, useEffect } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'
import type { ProductAttribute, AttributeType } from '../../types/product-attribute'
import { useCreateAttribute, useUpdateAttribute } from '../../hooks/useAttributes'

interface AttributeFormModalProps {
    isOpen: boolean
    onClose: () => void
    attributeToEdit?: ProductAttribute | null
}

export default function AttributeFormModal({ isOpen, onClose, attributeToEdit }: AttributeFormModalProps) {
    const { mutate: createAttribute, isPending: isCreating } = useCreateAttribute()
    const { mutate: updateAttribute, isPending: isUpdating } = useUpdateAttribute()

    const [name, setName] = useState('')
    const [displayName, setDisplayName] = useState('')
    const [type, setType] = useState<AttributeType>('text')
    const [isRequired, setIsRequired] = useState(false)
    const [options, setOptions] = useState<string[]>([])
    const [newOption, setNewOption] = useState('')

    useEffect(() => {
        if (attributeToEdit) {
            setName(attributeToEdit.name)
            setDisplayName(attributeToEdit.display_name)
            setType(attributeToEdit.type)
            setIsRequired(attributeToEdit.is_required)
            setOptions(attributeToEdit.options ?? [])
        } else {
            setName('')
            setDisplayName('')
            setType('text')
            setIsRequired(false)
            setOptions([])
        }
        setNewOption('')
    }, [attributeToEdit, isOpen])

    if (!isOpen) return null

    const isPending = isCreating || isUpdating

    const handleAddOption = () => {
        const trimmed = newOption.trim()
        if (trimmed && !options.includes(trimmed)) {
            setOptions([...options, trimmed])
            setNewOption('')
        }
    }

    const handleRemoveOption = (index: number) => {
        setOptions(options.filter((_, i) => i !== index))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const safeName = (name || attributeToEdit?.name || '').trim()
        const safeDisplayName = (displayName || attributeToEdit?.display_name || safeName).trim()
        const safeType = type || attributeToEdit?.input_type || 'text'

        const payload = {
            name: safeName,
            display_name: safeDisplayName,
            type: safeType,
            input_type: safeType,
            is_required: isRequired,
            options: safeType === 'select' ? options : null,
        }

        if (attributeToEdit) {
            updateAttribute({ id: attributeToEdit.id, data: payload }, { onSuccess: onClose })
        } else {
            createAttribute(payload, { onSuccess: onClose })
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-[var(--color-surface-card)] rounded-2xl w-full max-w-md shadow-xl max-h-[90vh] flex flex-col" dir="rtl">
                <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)] bg-[var(--color-surface)] rounded-t-2xl shrink-0">
                    <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
                        {attributeToEdit ? 'تعديل الخاصية' : 'إضافة خاصية جديدة'}
                    </h2>
                    <button onClick={onClose} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-5 overflow-y-auto">
                    <form id="attribute-form" onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">الاسم التقني (Machine Name)</label>
                            <input
                                required
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. size"
                                className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none focus:border-[#45592D] transition-colors"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">الاسم للعرض</label>
                            <input
                                required
                                type="text"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                placeholder="e.g. المقاس"
                                className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none focus:border-[#45592D] transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">نوع الإدخال</label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value as AttributeType)}
                                className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none focus:border-[#45592D] bg-[var(--color-surface-card)] transition-colors"
                            >
                                <option value="text">نص حر (Text)</option>
                                <option value="select">قائمة منسدلة (Select)</option>
                                <option value="boolean">نعم/لا (Boolean)</option>
                                <option value="number">رقم (Number)</option>
                                <option value="color">لون (Color)</option>
                            </select>
                        </div>

                        <label className="flex items-center gap-2 cursor-pointer pt-2">
                            <input
                                type="checkbox"
                                checked={isRequired}
                                onChange={(e) => setIsRequired(e.target.checked)}
                                className="w-4 h-4 accent-[#45592D] rounded"
                            />
                            <span className="text-sm font-medium text-[var(--color-text-secondary)]">حقل مطلوب (إلزامي للمنتجات)</span>
                        </label>

                        {type === 'select' && (
                            <div className="pt-4 border-t border-[var(--color-border)] mt-4">
                                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">خيارات القائمة المنسدلة</label>
                                <div className="flex gap-2 mb-3">
                                    <input
                                        type="text"
                                        value={newOption}
                                        onChange={(e) => setNewOption(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault()
                                                handleAddOption()
                                            }
                                        }}
                                        placeholder="اكتب الخيار واضغط Enter"
                                        className="flex-1 rounded-xl border border-[var(--color-border)] px-4 py-2 text-sm outline-none focus:border-[#45592D] transition-colors"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddOption}
                                        disabled={!newOption.trim()}
                                        className="px-3 py-2 bg-[#EBE1D7] text-[var(--color-text-secondary)] rounded-xl hover:bg-[#DCCFC1] transition-colors disabled:opacity-50"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>

                                {options.length > 0 && (
                                    <ul className="space-y-2">
                                        {options.map((opt, idx) => (
                                            <li key={idx} className="flex items-center justify-between bg-[var(--color-surface)] px-3 py-2 rounded-lg border border-[var(--color-border)]">
                                                <span className="text-sm text-[var(--color-text-secondary)]">{opt}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveOption(idx)}
                                                    className="text-[var(--color-danger)] hover:bg-[var(--color-danger-subtle)] p-1 rounded transition-colors"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                {options.length === 0 && (
                                    <p className="text-xs text-[var(--color-danger)]">يرجى إضافة خيار واحد على الأقل.</p>
                                )}
                            </div>
                        )}
                    </form>
                </div>

                <div className="p-5 flex items-center justify-end gap-3 border-t border-[var(--color-border)] shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2.5 rounded-xl border border-[var(--color-border)] text-[var(--color-text-secondary)] text-sm font-medium hover:bg-[var(--color-surface)] transition-colors"
                    >
                        إلغاء
                    </button>
                    <button
                        type="submit"
                        form="attribute-form"
                        disabled={isPending || (type === 'select' && options.length === 0)}
                        className="px-4 py-2.5 rounded-xl bg-[#45592D] text-white text-sm font-semibold hover:bg-[#5D7243] transition-colors disabled:opacity-50"
                    >
                        {isPending ? 'جاري الحفظ...' : 'حفظ'}
                    </button>
                </div>
            </div>
        </div>
    )
}
