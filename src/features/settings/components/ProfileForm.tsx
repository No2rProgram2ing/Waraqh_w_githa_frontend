import { useState, useEffect } from 'react'
import { Eye, EyeOff, Save } from 'lucide-react'
import type { AdminProfile } from '../types/profile'
import { useUpdateProfile } from '../hooks/useProfile'

interface ProfileFormProps {
    profile: AdminProfile
}

export default function ProfileForm({ profile }: ProfileFormProps) {
    const { mutate: updateProfile, isPending } = useUpdateProfile()

    const [firstName, setFirstName] = useState(profile.first_name)
    const [lastName, setLastName] = useState(profile.last_name)
    const [email, setEmail] = useState(profile.email)

    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPasswords, setShowPasswords] = useState(false)
    const [passwordError, setPasswordError] = useState('')

    // Reset when profile changes
    useEffect(() => {
        setFirstName(profile.first_name)
        setLastName(profile.last_name)
        setEmail(profile.email)
    }, [profile])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setPasswordError('')

        // If user typed something in password fields, ensure they filled all three and they match
        if (currentPassword || newPassword || confirmPassword) {
            if (!currentPassword || !newPassword || !confirmPassword) {
                setPasswordError('لتغيير كلمة المرور، يرجى تعبئة الحقول الثلاثة معاً.')
                return
            }
            if (newPassword !== confirmPassword) {
                setPasswordError('كلمة المرور الجديدة غير متطابقة مع التأكيد.')
                return
            }
        }

        updateProfile({
            first_name: firstName,
            last_name: lastName,
            email,
            ...(newPassword ? {
                current_password: currentPassword,
                new_password: newPassword,
                new_password_confirmation: confirmPassword
            } : {})
        }, {
            onSuccess: () => {
                // Clear password fields on success
                setCurrentPassword('')
                setNewPassword('')
                setConfirmPassword('')
            }
        })
    }

    return (
        <form onSubmit={handleSubmit} className="bg-[var(--color-surface-card)] rounded-[24px] border border-[var(--color-border)] p-6 md:p-8 space-y-8" dir="rtl">
            
            {/* Basic Info */}
            <div>
                <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-4">المعلومات الشخصية</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">الاسم الأول</label>
                        <input
                            required
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm outline-none focus:border-[#45592D] transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">الاسم الأخير</label>
                        <input
                            required
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm outline-none focus:border-[#45592D] transition-colors"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">البريد الإلكتروني</label>
                        <input
                            required
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm outline-none focus:border-[#45592D] transition-colors"
                            dir="ltr"
                        />
                    </div>
                </div>
            </div>

            <hr className="border-[var(--color-border)]" />

            {/* Password Change */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-[var(--color-text-primary)]">تغيير كلمة المرور</h2>
                    <button
                        type="button"
                        onClick={() => setShowPasswords(!showPasswords)}
                        className="text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] flex items-center gap-1.5 text-sm font-medium transition-colors"
                    >
                        {showPasswords ? <EyeOff size={16} /> : <Eye size={16} />}
                        {showPasswords ? 'إخفاء' : 'إظهار'}
                    </button>
                </div>
                
                <p className="text-sm text-[var(--color-text-muted)] mb-5">
                    اترك الحقول التالية فارغة إذا كنت لا ترغب في تغيير كلمة المرور.
                </p>

                {passwordError && (
                    <div className="mb-4 p-3 bg-[var(--color-danger-subtle)] text-[var(--color-danger)] text-sm rounded-xl border border-[#F3D7D3]">
                        {passwordError}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">كلمة المرور الحالية</label>
                        <input
                            type={showPasswords ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm outline-none focus:border-[#45592D] transition-colors"
                            dir="ltr"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">كلمة المرور الجديدة</label>
                        <input
                            type={showPasswords ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm outline-none focus:border-[#45592D] transition-colors"
                            dir="ltr"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">تأكيد كلمة المرور الجديدة</label>
                        <input
                            type={showPasswords ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm outline-none focus:border-[#45592D] transition-colors"
                            dir="ltr"
                        />
                    </div>
                </div>
            </div>

            <div className="pt-4 flex justify-end">
                <button
                    type="submit"
                    disabled={isPending}
                    className="flex items-center gap-2 rounded-xl bg-[#45592D] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#5D7243] disabled:opacity-50"
                >
                    <Save size={18} />
                    {isPending ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                </button>
            </div>
        </form>
    )
}
