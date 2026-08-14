import { useState } from 'react'
import { Plus } from 'lucide-react'
import { showErrorToast, showSuccessToast, showValidationErrorToast } from '@/lib/toast'
import { useAdminUsers, useDeleteAdminUser } from '../hooks/useAdminUsers'
import AdminUsersTable from '../components/AdminUsersTable'
import AdminUserFormModal from '../components/AdminUserFormModal'
import type { AdminUser } from '../types/admin-user'

export default function AdminUsersPage() {
    const { data: users = [], isLoading, isError, refetch } = useAdminUsers()
    const { mutate: deleteUser } = useDeleteAdminUser()

    const [isFormOpen, setIsFormOpen] = useState(false)
    const [userToEdit, setUserToEdit] = useState<AdminUser | null>(null)

    const handleAddNew = () => {
        setUserToEdit(null)
        setIsFormOpen(true)
    }

    const handleEdit = (user: AdminUser) => {
        setUserToEdit(user)
        setIsFormOpen(true)
    }

    const handleDelete = (user: AdminUser) => {
        if (confirm(`هل أنت متأكد من حذف حساب المدير "${user.first_name} ${user.last_name}"؟`)) {
            deleteUser(user.id, {
                onSuccess: () => showSuccessToast('تم حذف المستخدم الإداري بنجاح'),
                onError: (error: any) => {
                    const validationErrors = error?.response?.data?.errors as Record<string, string[]> | undefined
                    if (validationErrors) {
                        showValidationErrorToast(validationErrors)
                        return
                    }
                    showErrorToast(error?.response?.data?.message || 'فشل في حذف المستخدم الإداري، يرجى المحاولة مرة أخرى.')
                },
            })
        }
    }

    const handleCloseForm = () => {
        setIsFormOpen(false)
        setUserToEdit(null)
    }

    if (isError) {
        return (
            <div dir="rtl" className="space-y-6">
                <h1 className="text-[28px] font-extrabold text-[var(--color-text-primary)]">المستخدمون الإداريون</h1>
                <p className="text-sm text-[var(--color-danger)]">حدث خطأ أثناء تحميل المستخدمين.</p>
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
                    <h1 className="text-[28px] font-extrabold text-[var(--color-text-primary)]">المستخدمون الإداريون</h1>
                    <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                        إدارة حسابات فريق العمل وصلاحياتهم داخل النظام
                    </p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="flex items-center gap-2 rounded-xl bg-[#45592D] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5D7243]"
                >
                    <Plus size={18} />
                    إضافة مستخدم جديد
                </button>
            </div>

            {isLoading ? (
                <div className="text-center py-16 text-sm text-[var(--color-text-muted)]">جاري التحميل...</div>
            ) : (
                <AdminUsersTable
                    users={users}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}

            <AdminUserFormModal
                isOpen={isFormOpen}
                onClose={handleCloseForm}
                userToEdit={userToEdit}
            />
        </div>
    )
}
