import { useSettings } from '../hooks/useSettings'
import SettingsTabs from '../components/SettingsTabs'

export default function SettingsPage() {
    const { data: settings, isLoading, isError, refetch } = useSettings()

    if (isLoading) {
        return (
            <div dir="rtl" className="space-y-6">
                <div>
                    <h1 className="text-[28px] font-extrabold text-[var(--color-text-primary)]">إعدادات النظام</h1>
                    <p className="mt-2 text-sm text-[var(--color-text-muted)]">التحكم في الإعدادات العامة والمالية للمتجر</p>
                </div>
                <div className="text-center py-16 text-sm text-[var(--color-text-muted)]">جاري تحميل الإعدادات...</div>
            </div>
        )
    }

    if (isError || !settings) {
        return (
            <div dir="rtl" className="space-y-6">
                <div>
                    <h1 className="text-[28px] font-extrabold text-[var(--color-text-primary)]">إعدادات النظام</h1>
                    <p className="mt-2 text-sm text-[var(--color-text-muted)]">التحكم في الإعدادات العامة والمالية للمتجر</p>
                </div>
                <div className="bg-[var(--color-surface-card)] rounded-2xl border border-[var(--color-border)] p-8 text-center">
                    <p className="text-sm text-[var(--color-danger)] mb-4">حدث خطأ أثناء جلب إعدادات النظام.</p>
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
                <h1 className="text-[28px] font-extrabold text-[var(--color-text-primary)]">إعدادات النظام</h1>
                <p className="mt-2 text-sm text-[var(--color-text-muted)]">التحكم في الإعدادات العامة والمالية ووضع الصيانة للمتجر</p>
            </div>

            <SettingsTabs settings={settings} />
        </div>
    )
}
