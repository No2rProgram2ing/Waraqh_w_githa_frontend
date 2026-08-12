import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import type { Role } from '../types/role'
import { useCreateRole, useUpdateRole } from '../hooks/useRoles'

interface RoleFormModalProps {
    isOpen: boolean
    onClose: () => void
    roleToEdit?: Role | null
}

export default function RoleFormModal({ isOpen, onClose, roleToEdit }: RoleFormModalProps) {
    const { mutate: createRole, isPending: isCreating } = useCreateRole()
    const { mutate: updateRole, isPending: isUpdating } = useUpdateRole()

    const [name, setName] = useState('')
    const [displayName, setDisplayName] = useState('')
    const [description, setDescription] = useState('')

    useEffect(() => {
        if (roleToEdit) {
            setName(roleToEdit.name)
            setDisplayName(roleToEdit.display_name)
            setDescription(roleToEdit.description ?? '')
        } else {
            setName('')
            setDisplayName('')
            setDescription('')
        }
    }, [roleToEdit, isOpen])

    if (!isOpen) return null

    const isPending = isCreating || isUpdating

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const payload = {
            name,
            display_name: displayName,
            description: description || null,
        }
        if (roleToEdit) {
            updateRole({ id: roleToEdit.id, data: payload }, { onSuccess: onClose })
        } else {
            createRole(payload, { onSuccess: onClose })
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-[var(--color-surface-card)] rounded-2xl w-full max-w-md shadow-xl" dir="rtl">
                <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)] bg-[var(--color-surface)] rounded-t-2xl">
                    <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
                        {roleToEdit ? 'تعديل الدور' : 'إضافة دور جديد'}
                    </h2>
                    <button onClick={onClose} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">اسم الدور (machine name)</label>
                        <input
                            required
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. editor"
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
                            placeholder="e.g. محرر المحتوى"
                            className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none focus:border-[#45592D] transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">الوصف (اختياري)</label>
                        <textarea
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full resize-none rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none focus:border-[#45592D] transition-colors"
                        />
                    </div>

                    <div className="pt-4 flex items-center justify-end gap-3 border-t border-[var(--color-border)]">
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
