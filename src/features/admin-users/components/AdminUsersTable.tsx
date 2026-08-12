import { Edit2, Trash2 } from 'lucide-react'
import type { AdminUser } from '../types/admin-user'

interface AdminUsersTableProps {
    users: AdminUser[]
    onEdit: (user: AdminUser) => void
    onDelete: (user: AdminUser) => void
}

function formatDate(iso: string): string {
    return new Intl.DateTimeFormat('ar-SA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(new Date(iso))
}

export default function AdminUsersTable({ users, onEdit, onDelete }: AdminUsersTableProps) {
    if (!users.length) {
        return (
            <div className="text-center py-16 text-[var(--color-text-muted)] text-sm bg-[var(--color-surface)] rounded-2xl border border-dashed border-[var(--color-border-muted)]">
                لا يوجد مدراء حتى الآن.
            </div>
        )
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-card)]" dir="rtl">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)] text-right">
                        <th className="px-5 py-3.5 font-semibold text-[var(--color-text-secondary)]">الاسم</th>
                        <th className="px-5 py-3.5 font-semibold text-[var(--color-text-secondary)]">البريد الإلكتروني</th>
                        <th className="px-5 py-3.5 font-semibold text-[var(--color-text-secondary)]">الصلاحية (الدور)</th>
                        <th className="px-5 py-3.5 font-semibold text-[var(--color-text-secondary)] text-center">الحالة</th>
                        <th className="px-5 py-3.5 font-semibold text-[var(--color-text-secondary)]">تاريخ الإضافة</th>
                        <th className="px-5 py-3.5 font-semibold text-[var(--color-text-secondary)] text-left">الإجراءات</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#EBE1D7]">
                    {users.map((user) => (
                        <tr key={user.id} className="hover:bg-[var(--color-surface)] transition-colors group">
                            <td className="px-5 py-4 font-medium text-[var(--color-text-primary)] whitespace-nowrap">
                                {user.first_name} {user.last_name}
                            </td>
                            <td className="px-5 py-4 text-[var(--color-text-muted)]">{user.email}</td>
                            <td className="px-5 py-4">
                                <span className="inline-flex items-center justify-center rounded-lg bg-[#EBE1D7]/50 border border-[var(--color-border)] px-2.5 py-1 text-xs font-semibold text-[var(--color-text-secondary)]">
                                    {user.role_name}
                                </span>
                            </td>
                            <td className="px-5 py-4 text-center">
                                {user.status === 'active' ? (
                                    <span className="inline-flex items-center justify-center rounded-full bg-[var(--color-accent-subtle)] px-2 py-0.5 text-xs font-semibold text-[#45592D]">
                                        نشط
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center justify-center rounded-full bg-[var(--color-danger-subtle)] px-2 py-0.5 text-xs font-semibold text-[var(--color-danger)]">
                                        موقوف
                                    </span>
                                )}
                            </td>
                            <td className="px-5 py-4 text-[var(--color-text-muted)] text-xs whitespace-nowrap">
                                {formatDate(user.created_at)}
                            </td>
                            <td className="px-5 py-4">
                                <div className="flex items-center justify-end gap-1">
                                    <button
                                        onClick={() => onEdit(user)}
                                        className="p-2 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-border)] transition-colors"
                                        title="تعديل"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => onDelete(user)}
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
