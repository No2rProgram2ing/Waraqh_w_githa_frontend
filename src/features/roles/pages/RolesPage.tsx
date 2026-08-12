import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useRoles } from '../hooks/useRoles'
import RolesTable from '../components/RolesTable'
import RoleFormModal from '../components/RoleFormModal'
import RolePermissionsModal from '../components/RolePermissionsModal'
import type { Role } from '../types/role'

export default function RolesPage() {
    const { data: roles = [], isLoading, isError, refetch } = useRoles()

    const [isFormOpen, setIsFormOpen] = useState(false)
    const [roleToEdit, setRoleToEdit] = useState<Role | null>(null)
    const [permissionsRoleId, setPermissionsRoleId] = useState<number | null>(null)

    const handleAddNew = () => {
        setRoleToEdit(null)
        setIsFormOpen(true)
    }

    const handleEdit = (role: Role) => {
        setRoleToEdit(role)
        setIsFormOpen(true)
    }

    const handleCloseForm = () => {
        setIsFormOpen(false)
        setRoleToEdit(null)
    }

    if (isLoading) {
        return (
            <div dir="rtl" className="space-y-6">
                <h1 className="text-[28px] font-extrabold text-[var(--color-text-primary)]">الأدوار والصلاحيات</h1>
                <p className="text-sm text-[var(--color-text-muted)]">جاري تحميل الأدوار...</p>
            </div>
        )
    }

    if (isError) {
        return (
            <div dir="rtl" className="space-y-6">
                <h1 className="text-[28px] font-extrabold text-[var(--color-text-primary)]">الأدوار والصلاحيات</h1>
                <p className="text-sm text-[var(--color-danger)]">حدث خطأ أثناء تحميل الأدوار.</p>
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
                    <h1 className="text-[28px] font-extrabold text-[var(--color-text-primary)]">الأدوار والصلاحيات</h1>
                    <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                        إدارة أدوار المستخدمين الإداريين وضبط صلاحياتهم
                    </p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="flex items-center gap-2 rounded-xl bg-[#45592D] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5D7243]"
                >
                    <Plus size={18} />
                    إضافة دور جديد
                </button>
            </div>

            <RolesTable
                roles={roles}
                onEdit={handleEdit}
                onManagePermissions={(id) => setPermissionsRoleId(id)}
            />

            <RoleFormModal
                isOpen={isFormOpen}
                onClose={handleCloseForm}
                roleToEdit={roleToEdit}
            />

            <RolePermissionsModal
                roleId={permissionsRoleId}
                onClose={() => setPermissionsRoleId(null)}
            />
        </div>
    )
}
