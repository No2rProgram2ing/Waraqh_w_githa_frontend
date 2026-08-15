import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { showErrorToast, showSuccessToast, showValidationErrorToast } from '@/lib/toast'
import { useRole, useAllPermissions, useSyncRolePermissions } from '../hooks/useRoles'
import PermissionsAccordion from './PermissionsAccordion'

interface RolePermissionsModalProps {
    roleId: number | null
    onClose: () => void
}

export default function RolePermissionsModal({ roleId, onClose }: RolePermissionsModalProps) {
    const isOpen = roleId !== null

    const { data: role, isLoading: roleLoading } = useRole(roleId ?? 0)
    const { data: allPermissions = [], isLoading: permsLoading } = useAllPermissions()
    const { mutate: syncPermissions, isPending } = useSyncRolePermissions()

    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())

    // Sync selected IDs when role data arrives
    useEffect(() => {
        if (role?.permissions) {
            setSelectedIds(new Set(role.permissions.map((p) => p.id)))
        }
    }, [role])

    if (!isOpen) return null

    const handleChange = (id: number, checked: boolean) => {
        setSelectedIds((prev) => {
            const next = new Set(prev)
            if (checked) next.add(id)
            else next.delete(id)
            return next
        })
    }

    const handleSave = () => {
        if (!roleId) return
        syncPermissions(
            { roleId, permissionIds: Array.from(selectedIds) },
            {
                onSuccess: () => {
                    showSuccessToast('تم تحديث صلاحيات الدور بنجاح')
                    onClose()
                },
                onError: (error: any) => {
                    const validationErrors = error?.response?.data?.errors as Record<string, string[]> | undefined
                    if (validationErrors) {
                        showValidationErrorToast(validationErrors)
                        return
                    }
                    showErrorToast(error?.response?.data?.message || 'فشل في تحديث صلاحيات الدور، يرجى المحاولة مرة أخرى.')
                },
            }
        )
    }

    const isLoading = roleLoading || permsLoading

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-[var(--color-surface-card)] rounded-2xl w-full max-w-2xl shadow-xl flex flex-col max-h-[85vh]" dir="rtl">
                <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)] bg-[var(--color-surface)] rounded-t-2xl shrink-0">
                    <div>
                        <h2 className="text-lg font-bold text-[var(--color-text-primary)]">إدارة الصلاحيات</h2>
                        {role && (
                            <p className="text-sm text-[var(--color-text-muted)] mt-0.5">{role.display_name}</p>
                        )}
                    </div>
                    <button onClick={onClose} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 p-5">
                    {isLoading ? (
                        <p className="text-sm text-[var(--color-text-muted)] text-center py-8">جاري التحميل...</p>
                    ) : (
                        <PermissionsAccordion
                            permissions={allPermissions}
                            selectedIds={selectedIds}
                            onChange={handleChange}
                        />
                    )}
                </div>

                <div className="flex items-center justify-end gap-3 p-5 border-t border-[var(--color-border)] shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2.5 rounded-xl border border-[var(--color-border)] text-[var(--color-text-secondary)] text-sm font-medium hover:bg-[var(--color-surface)] transition-colors"
                    >
                        إلغاء
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={isPending || isLoading}
                        className="px-4 py-2.5 rounded-xl bg-[#45592D] text-white text-sm font-semibold hover:bg-[#5D7243] transition-colors disabled:opacity-50"
                    >
                        {isPending ? 'جاري الحفظ...' : `حفظ الصلاحيات (${selectedIds.size})`}
                    </button>
                </div>
            </div>
        </div>
    )
}
