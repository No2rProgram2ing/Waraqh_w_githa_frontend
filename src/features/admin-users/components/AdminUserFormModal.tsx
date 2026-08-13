import { useState, useEffect } from 'react'
import { X, Eye, EyeOff } from 'lucide-react'
import type { AdminUser, AdminUserStatus } from '../types/admin-user'
import { useCreateAdminUser, useUpdateAdminUser } from '../hooks/useAdminUsers'

interface AdminUserFormModalProps {
    isOpen: boolean
    onClose: () => void
    userToEdit?: AdminUser | null
}

export default function AdminUserFormModal({ isOpen, onClose, userToEdit }: AdminUserFormModalProps) {
    const { mutate: createUser, isPending: isCreating } = useCreateAdminUser()
    const { mutate: updateUser, isPending: isUpdating } = useUpdateAdminUser()

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [roleId, setRoleId] = useState<number>(1) // Assuming 1 is a default role
    const [status, setStatus] = useState<AdminUserStatus>('active')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    useEffect(() => {
        if (userToEdit) {
            setFirstName(userToEdit.first_name ?? '')
            setLastName(userToEdit.last_name ?? '')
            setEmail(userToEdit.email ?? '')
            setStatus(userToEdit.status)
            // Ideally we'd map role_name back to role_id if we had the full roles list, 
            // for now leaving as default 1 since it's a mockup.
            setRoleId(1) 
        } else {
            setFirstName('')
            setLastName('')
            setEmail('')
            setStatus('active')
            setRoleId(1)
        }
        setPassword('')
        setShowPassword(false)
    }, [userToEdit, isOpen])

    if (!isOpen) return null

    const isPending = isCreating || isUpdating

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (userToEdit) {
            const payload = {
                full_name: `${firstName} ${lastName}`.trim(),
                email,
                role_id: roleId,
                status,
                ...(password ? { password } : {})
            }
            updateUser({ id: userToEdit.id, data: payload }, { onSuccess: onClose })
        } else {
            const payload = {
                full_name: `${firstName} ${lastName}`.trim(),
                email,
                role_id: roleId,
                password
            }
            createUser(payload, { onSuccess: onClose })
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-[var(--color-surface-card)] rounded-2xl w-full max-w-lg shadow-xl max-h-[90vh] flex flex-col" dir="rtl">
                <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)] bg-[var(--color-surface)] rounded-t-2xl shrink-0">
                    <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
                        {userToEdit ? 'تعديل المستخدم الإداري' : 'إضافة مستخدم إداري جديد'}
                    </h2>
                    <button onClick={onClose} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-5 overflow-y-auto">
                    <form id="admin-user-form" onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">الاسم الأول</label>
                                <input
                                    required
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none focus:border-[#45592D] transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">الاسم الأخير</label>
                                <input
                                    required
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none focus:border-[#45592D] transition-colors"
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">البريد الإلكتروني</label>
                            <input
                                required
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none focus:border-[#45592D] transition-colors"
                                dir="ltr"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">الصلاحية (الدور)</label>
                            <select
                                value={roleId}
                                onChange={(e) => setRoleId(Number(e.target.value))}
                                className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none focus:border-[#45592D] bg-[var(--color-surface-card)] transition-colors"
                            >
                                <option value={1}>مدير عام (Super Admin)</option>
                                <option value={2}>مشرف طلبات (Orders Manager)</option>
                                <option value={3}>محرر كتالوج (Catalog Editor)</option>
                            </select>
                        </div>

                        {userToEdit && (
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">حالة الحساب</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value as AdminUserStatus)}
                                    className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none focus:border-[#45592D] bg-[var(--color-surface-card)] transition-colors"
                                >
                                    <option value="active">نشط</option>
                                    <option value="inactive">موقوف</option>
                                </select>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                                كلمة المرور
                                {userToEdit && <span className="text-[var(--color-text-muted)] text-xs mr-2">(اتركها فارغة إذا لم ترد تغييرها)</span>}
                            </label>
                            <div className="relative">
                                <input
                                    required={!userToEdit}
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full rounded-xl border border-[var(--color-border)] pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#45592D] transition-colors"
                                    dir="ltr"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
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
                        form="admin-user-form"
                        disabled={isPending}
                        className="px-4 py-2.5 rounded-xl bg-[#45592D] text-white text-sm font-semibold hover:bg-[#5D7243] transition-colors disabled:opacity-50"
                    >
                        {isPending ? 'جاري الحفظ...' : 'حفظ'}
                    </button>
                </div>
            </div>
        </div>
    )
}
