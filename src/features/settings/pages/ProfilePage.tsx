import { useProfile } from '../hooks/useProfile'
import ProfileForm from '../components/ProfileForm'

export default function ProfilePage() {
    const { data: profile, isLoading, isError, refetch } = useProfile()

    if (isLoading) {
        return (
            <div dir="rtl" className="space-y-6">
                <div>
                    <h1 className="text-[28px] font-extrabold text-[var(--color-text-primary)]">البروفايل الشخصي</h1>
                    <p className="mt-2 text-sm text-[var(--color-text-muted)]">تعديل بياناتك الشخصية وكلمة المرور الخاصة بك</p>
                </div>
                <div className="text-center py-16 text-sm text-[var(--color-text-muted)]">جاري تحميل البيانات...</div>
            </div>
        )
    }

    if (isError || !profile) {
        return (
            <div dir="rtl" className="space-y-6">
                <div>
                    <h1 className="text-[28px] font-extrabold text-[var(--color-text-primary)]">البروفايل الشخصي</h1>
                    <p className="mt-2 text-sm text-[var(--color-text-muted)]">تعديل بياناتك الشخصية وكلمة المرور الخاصة بك</p>
                </div>
                <div className="bg-[var(--color-surface-card)] rounded-2xl border border-[var(--color-border)] p-8 text-center">
                    <p className="text-sm text-[var(--color-danger)] mb-4">حدث خطأ أثناء جلب بيانات الملف الشخصي.</p>
                    <button
                        onClick={() => void refetch()}
                        className="rounded-xl bg-[#45592D] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5D7243]"
                    >
                        إعادة المحاولة
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div dir="rtl" className="space-y-6">
            <div>
                <h1 className="text-[28px] font-extrabold text-[var(--color-text-primary)]">البروفايل الشخصي</h1>
                <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                    تعديل بياناتك الشخصية وكلمة المرور الخاصة بك بصفتك: <span className="font-semibold text-[#45592D]">{profile.role_name}</span>
                </p>
            </div>

            <ProfileForm profile={profile} />
        </div>
    )
}
