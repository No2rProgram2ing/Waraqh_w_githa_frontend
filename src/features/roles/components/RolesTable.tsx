import { Edit2, ShieldCheck, Trash2 } from 'lucide-react'
import type { Role } from '../types/role'
import { useDeleteRole } from '../hooks/useRoles'

interface RolesTableProps {
    roles: Role[]
    onEdit: (role: Role) => void
    onManagePermissions: (roleId: number) => void
}

export default function RolesTable({ roles, onEdit, onManagePermissions }: RolesTableProps) {
    const { mutate: deleteRole } = useDeleteRole()

    const handleDelete = (role: Role) => {
        if (confirm(`هل أنت متأكد من حذف الدور "${role.display_name}"؟`)) {
            deleteRole(role.id, {
                onSuccess: () => showSuccessToast('تم حذف الدور بنجاح'),
                onError: (error: any) => {
                    const validationErrors = error?.response?.data?.errors as Record<string, string[]> | undefined
                    if (validationErrors) {
                        showValidationErrorToast(validationErrors)
                        return
                    }
                    showErrorToast(error?.response?.data?.message || 'فشل في حذف الدور، يرجى المحاولة مرة أخرى.')
                },
            })
        }
    }

    if (!roles.length) {
        return (
            <div className="text-center py-12 text-[var(--color-text-muted)] text-sm bg-[var(--color-surface)] rounded-2xl border border-dashed border-[var(--color-border-muted)]">
                لا توجد أدوار حتى الآن.
            </div>
        )
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-card)]" dir="rtl">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)] text-right">
                        <th className="px-5 py-3.5 font-semibold text-[var(--color-text-secondary)]">الاسم</th>
                        <th className="px-5 py-3.5 font-semibold text-[var(--color-text-secondary)]">الاسم التقني</th>
                        <th className="px-5 py-3.5 font-semibold text-[var(--color-text-secondary)] text-center">الصلاحيات</th>
                        <th className="px-5 py-3.5 font-semibold text-[var(--color-text-secondary)]">الوصف</th>
                        <th className="px-5 py-3.5 font-semibold text-[var(--color-text-secondary)] text-left">الإجراءات</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#EBE1D7]">
                    {roles.map((role) => (
                        <tr key={role.id} className="hover:bg-[var(--color-surface)] transition-colors group">
                            <td className="px-5 py-4 font-medium text-[var(--color-text-primary)]">{role.display_name}</td>
                            <td className="px-5 py-4">
                                <code className="text-xs bg-[#EBE1D7]/60 text-[var(--color-text-secondary)] px-2 py-0.5 rounded">
                                    {role.name}
                                </code>
                            </td>
                            <td className="px-5 py-4 text-center">
                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-accent-subtle)] text-[#45592D] text-xs font-bold">
                                    {role.permissions_count}
                                </span>
                            </td>
                            <td className="px-5 py-4 text-[var(--color-text-muted)] max-w-xs truncate">
                                {role.description ?? '—'}
                            </td>
                            <td className="px-5 py-4">
                                <div className="flex items-center justify-end gap-1">
                                    <button
                                        onClick={() => onManagePermissions(role.id)}
                                        className="p-2 rounded-lg text-[#45592D] hover:bg-[var(--color-accent-subtle)] transition-colors"
                                        title="إدارة الصلاحيات"
                                    >
                                        <ShieldCheck size={16} />
                                    </button>
                                    <button
                                        onClick={() => onEdit(role)}
                                        className="p-2 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-border)] transition-colors"
                                        title="تعديل"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(role)}
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
