import { useState, useEffect } from 'react'
import { Save, AlertTriangle, CheckCircle2 } from 'lucide-react'
import type { SystemSettings } from '../types/settings'
import { useUpdateSettings } from '../hooks/useSettings'

interface SettingsTabsProps {
    settings: SystemSettings
}

type TabType = 'general' | 'finance' | 'maintenance'

const currencyOptions = [
    { code: 'SAR', label: 'ريال سعودي (SAR)' },
    { code: 'USD', label: 'دولار أمريكي (USD)' },
    { code: 'YER', label: 'ريال يمني (YER)' },
    { code: 'AED', label: 'درهم إماراتي (AED)' },
    { code: 'EGP', label: 'جنيه مصري (EGP)' },
    { code: 'JOD', label: 'دينار أردني (JOD)' },
    { code: 'KWD', label: 'دينار كويتي (KWD)' },
    { code: 'QAR', label: 'ريال قطري (QAR)' },
]

export default function SettingsTabs({ settings }: SettingsTabsProps) {
    const { mutate: updateSettings, isPending } = useUpdateSettings()
    const [activeTab, setActiveTab] = useState<TabType>('general')
    const [showSuccessToast, setShowSuccessToast] = useState(false)

    // Local form state
    const [storeName, setStoreName] = useState(settings.store_name)
    const [contactEmail, setContactEmail] = useState(settings.contact_email)
    const [contactPhone, setContactPhone] = useState(settings.contact_phone ?? '')
    const [taxEnabled, setTaxEnabled] = useState((settings.tax_rate ?? 0) > 0)
    const [taxRate, setTaxRate] = useState(settings.tax_rate)
    const [defaultCurrency, setDefaultCurrency] = useState(settings.default_currency)
    const [maintenanceMode, setMaintenanceMode] = useState(settings.maintenance_mode)
    const [maintenanceMessage, setMaintenanceMessage] = useState(settings.maintenance_message ?? '')

    // Update local state if settings prop changes from backend
    useEffect(() => {
        setStoreName(settings.store_name)
        setContactEmail(settings.contact_email)
        setContactPhone(settings.contact_phone ?? '')
        setTaxEnabled((settings.tax_rate ?? 0) > 0)
        setTaxRate(settings.tax_rate)
        setDefaultCurrency(settings.default_currency)
        setMaintenanceMode(settings.maintenance_mode)
        setMaintenanceMessage(settings.maintenance_message ?? '')
    }, [settings])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const normalizedTaxRate = taxEnabled ? Number(taxRate || 0) : 0

        updateSettings({
            store_name: storeName,
            contact_email: contactEmail,
            contact_phone: contactPhone || null,
            tax_rate: normalizedTaxRate,
            tax_enabled: taxEnabled,
            default_currency: defaultCurrency,
            maintenance_mode: maintenanceMode,
            maintenance_message: maintenanceMessage || null
        }, {
            onSuccess: () => {
                setShowSuccessToast(true)
                window.setTimeout(() => setShowSuccessToast(false), 2600)
            }
        })
    }

    const handleToggleMaintenance = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked
        if (checked) {
            if (!confirm('تنبيه: تفعيل وضع الصيانة سيمنع جميع العملاء من تصفح الموقع بالكامل. هل أنت متأكد من رغبتك في التفعيل؟')) {
                return // User cancelled
            }
        }
        setMaintenanceMode(checked)
    }

    return (
        <form onSubmit={handleSubmit} className="bg-[var(--color-surface-card)] rounded-[24px] border border-[var(--color-border)] overflow-hidden" dir="rtl">
            {showSuccessToast && (
                <div className="pointer-events-none fixed left-1/2 top-5 z-50 flex -translate-x-1/2 items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800 shadow-lg">
                    <CheckCircle2 className="h-4 w-4" />
                    تم حفظ الإعدادات بنجاح
                </div>
            )}
            {/* Tabs Header */}
            <div className="border-b border-[var(--color-border)] px-6 bg-[var(--color-surface)]">
                <nav className="flex gap-8">
                    <button
                        type="button"
                        onClick={() => setActiveTab('general')}
                        className={`pt-5 pb-4 text-sm font-semibold transition-colors relative ${
                            activeTab === 'general' ? 'text-[#45592D]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
                        }`}
                    >
                        إعدادات عامة
                        {activeTab === 'general' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#45592D] rounded-t-full" />}
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('finance')}
                        className={`pt-5 pb-4 text-sm font-semibold transition-colors relative ${
                            activeTab === 'finance' ? 'text-[#45592D]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
                        }`}
                    >
                        المالية والضرائب
                        {activeTab === 'finance' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#45592D] rounded-t-full" />}
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('maintenance')}
                        className={`pt-5 pb-4 text-sm font-semibold transition-colors relative ${
                            activeTab === 'maintenance' ? 'text-[#45592D]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
                        }`}
                    >
                        وضع الصيانة
                        {activeTab === 'maintenance' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#45592D] rounded-t-full" />}
                    </button>
                </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6 md:p-8 min-h-[300px]">
                {activeTab === 'general' && (
                    <div className="space-y-5 max-w-2xl">
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">اسم المتجر</label>
                            <input
                                required
                                type="text"
                                value={storeName}
                                onChange={(e) => setStoreName(e.target.value)}
                                className="w-full rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm outline-none focus:border-[#45592D] transition-colors"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">البريد الإلكتروني للتواصل</label>
                                <input
                                    required
                                    type="email"
                                    value={contactEmail}
                                    onChange={(e) => setContactEmail(e.target.value)}
                                    className="w-full rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm outline-none focus:border-[#45592D] transition-colors"
                                    dir="ltr"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">رقم الهاتف (اختياري)</label>
                                <input
                                    type="tel"
                                    value={contactPhone}
                                    onChange={(e) => setContactPhone(e.target.value)}
                                    className="w-full rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm outline-none focus:border-[#45592D] transition-colors"
                                    dir="ltr"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'finance' && (
                    <div className="space-y-5 max-w-2xl">
                        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
                            <label className="flex cursor-pointer items-center justify-between gap-4">
                                <div>
                                    <span className="block text-sm font-medium text-[var(--color-text-secondary)]">تفعيل الضريبة</span>
                                    <span className="text-xs text-[var(--color-text-muted)]">عند إيقافها، ستُخفي الضريبة من واجهة المتجر تلقائياً</span>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={taxEnabled}
                                    onChange={(e) => setTaxEnabled(e.target.checked)}
                                    className="h-5 w-5 accent-[#45592D]"
                                />
                            </label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">نسبة الضريبة (٪)</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.01"
                                    value={taxRate}
                                    onChange={(e) => setTaxRate(Number(e.target.value))}
                                    disabled={!taxEnabled}
                                    className="w-full rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm outline-none transition-colors focus:border-[#45592D] disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
                                    dir="ltr"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">العملة الافتراضية</label>
                                <input
                                    type="text"
                                    list="currency-options"
                                    value={defaultCurrency}
                                    onChange={(e) => setDefaultCurrency(e.target.value.toUpperCase())}
                                    placeholder="اكتب اسم العملة أو الرمز"
                                    className="w-full rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm outline-none focus:border-[#45592D] transition-colors bg-white text-gray-700"
                                    dir="ltr"
                                />
                                <datalist id="currency-options">
                                    {currencyOptions.map((currency) => (
                                        <option key={currency.code} value={currency.code} label={currency.label} />
                                    ))}
                                </datalist>
                            </div>
                        </div>

                        {!taxEnabled && (
                            <div className="rounded-xl border border-dashed border-[var(--color-border)] bg-[#F8F5F0] px-4 py-3 text-sm text-[var(--color-text-muted)]">
                                الضريبة متوقفة حاليًا، لذا سيتم إخفاؤها تلقائيًا في واجهة المتجر.
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'maintenance' && (
                    <div className="space-y-6 max-w-2xl">
                        <div className="flex items-start gap-4 p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
                            <div className="pt-0.5">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="sr-only peer"
                                        checked={maintenanceMode}
                                        onChange={handleToggleMaintenance}
                                    />
                                    <div className="w-11 h-6 bg-[#DCCFC1] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:-translate-x-0 rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] rtl:after:left-auto rtl:after:right-[2px] after:bg-[var(--color-surface-card)] after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#45592D]"></div>
                                </label>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-[var(--color-text-primary)] mb-1 flex items-center gap-2">
                                    تفعيل وضع الصيانة
                                    {maintenanceMode && <AlertTriangle size={16} className="text-[var(--color-danger)]" />}
                                </h3>
                                <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                                    عند تفعيل هذا الخيار، لن يتمكن العملاء من تصفح المتجر أو إتمام الطلبات.
                                    استخدمه فقط أثناء التحديثات الجوهرية.
                                </p>
                            </div>
                        </div>

                        {maintenanceMode && (
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">رسالة وضع الصيانة (تظهر للعملاء)</label>
                                <textarea
                                    value={maintenanceMessage}
                                    onChange={(e) => setMaintenanceMessage(e.target.value)}
                                    placeholder="مثال: نقوم حالياً ببعض التحديثات وسنعود قريباً."
                                    className="w-full rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm outline-none focus:border-[#45592D] transition-colors resize-none h-24"
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="border-t border-[var(--color-border)] p-6 bg-[var(--color-surface)] flex justify-end">
                <button
                    type="submit"
                    disabled={isPending}
                    className="flex items-center gap-2 rounded-xl bg-[#45592D] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#5D7243] disabled:opacity-50"
                >
                    <Save size={18} />
                    {isPending ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
                </button>
            </div>
        </form>
    )
}
