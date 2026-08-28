import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { Save, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { currencyOptions, normalizeCurrencyCode } from '@/lib/currency'
import type { SystemSettings } from '../types/settings'
import { useUpdateSettings } from '../hooks/useSettings'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'

interface SettingsTabsProps {
  settings: SystemSettings
}

type TabType = 'general' | 'finance' | 'maintenance'

export default function SettingsTabs({
  settings,
}: SettingsTabsProps) {
  const { mutate: updateSettings, isPending } = useUpdateSettings()

  const [activeTab, setActiveTab] =
    useState<TabType>('general')

  const [showSuccessToast, setShowSuccessToast] =
    useState(false)

  const [storeName, setStoreName] =
    useState(settings.store_name)

  const [contactEmail, setContactEmail] =
    useState(settings.contact_email)

  const [contactPhone, setContactPhone] =
    useState(settings.contact_phone ?? '')

  const [taxEnabled, setTaxEnabled] =
    useState((settings.tax_rate ?? 0) > 0)

  const [taxRate, setTaxRate] =
    useState(settings.tax_rate)

  const [defaultCurrency, setDefaultCurrency] =
    useState(() =>
      normalizeCurrencyCode(
        settings.default_currency || settings.currency,
      ),
    )

  const [maintenanceMode, setMaintenanceMode] =
    useState(settings.maintenance_mode)

  const [maintenanceMessage, setMaintenanceMessage] =
    useState(settings.maintenance_message ?? '')

  useEffect(() => {
    setStoreName(settings.store_name)
    setContactEmail(settings.contact_email)
    setContactPhone(settings.contact_phone ?? '')
    setTaxEnabled((settings.tax_rate ?? 0) > 0)
    setTaxRate(settings.tax_rate)
    setDefaultCurrency(
      normalizeCurrencyCode(
        settings.default_currency || settings.currency,
      ),
    )
    setMaintenanceMode(settings.maintenance_mode)
    setMaintenanceMessage(settings.maintenance_message ?? '')
  }, [settings])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const normalizedTaxRate = taxEnabled
      ? Number(taxRate || 0)
      : 0

    updateSettings(
      {
        store_name: storeName,
        contact_email: contactEmail,
        contact_phone: contactPhone || null,
        tax_rate: normalizedTaxRate,
        tax_enabled: taxEnabled,
        default_currency: defaultCurrency,
        maintenance_mode: maintenanceMode,
        maintenance_message: maintenanceMessage || null,
      },
      {
        onSuccess: () => {
          setShowSuccessToast(true)

          window.setTimeout(() => {
            setShowSuccessToast(false)
          }, 2600)
        },
      },
    )
  }

  const handleToggleMaintenance = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const checked = event.target.checked

    if (checked) {
      const confirmed = window.confirm(
        'تنبيه: تفعيل وضع الصيانة سيمنع جميع العملاء من تصفح الموقع بالكامل. هل أنت متأكد من رغبتك في التفعيل؟',
      )

      if (!confirmed) {
        return
      }
    }

    setMaintenanceMode(checked)
  }

  const tabs: Array<{
    id: TabType
    label: string
  }> = [
    {
      id: 'general',
      label: 'إعدادات عامة',
    },
    {
      id: 'finance',
      label: 'المالية والضرائب',
    },
    {
      id: 'maintenance',
      label: 'وضع الصيانة',
    },
  ]

  return (
    <form
      onSubmit={handleSubmit}
      dir="rtl"
      className="overflow-hidden rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-card)]"
    >
      {showSuccessToast && (
        <div className="pointer-events-none fixed left-1/2 top-5 z-50 flex -translate-x-1/2 items-center gap-2 rounded-xl border border-[var(--color-success-subtle)] bg-[var(--color-success-subtle)] px-4 py-3 text-sm font-medium text-[var(--color-success)] shadow-lg">
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          تم حفظ الإعدادات بنجاح
        </div>
      )}

      <div className="border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 sm:px-6">
        <nav
          className="flex gap-4 overflow-x-auto sm:gap-8"
          aria-label="إعدادات المتجر"
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                aria-current={isActive ? 'page' : undefined}
                className={[
                  'relative shrink-0 px-1 pb-4 pt-5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2',
                  isActive
                    ? 'text-[var(--color-accent)]'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]',
                ].join(' ')}
              >
                {tab.label}

                {isActive && (
                  <span
                    className="absolute bottom-0 left-0 h-0.5 w-full rounded-t-full bg-[var(--color-accent)]"
                    aria-hidden="true"
                  />
                )}
              </button>
            )
          })}
        </nav>
      </div>

      <div className="min-h-[300px] p-5 md:p-8">
        {activeTab === 'general' && (
          <div className="max-w-2xl space-y-5">
            <Input
              required
              label="اسم المتجر"
              value={storeName}
              onChange={(event) =>
                setStoreName(event.target.value)
              }
            />

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Input
                required
                type="email"
                label="البريد الإلكتروني للتواصل"
                value={contactEmail}
                dir="ltr"
                onChange={(event) =>
                  setContactEmail(event.target.value)
                }
              />

              <Input
                type="tel"
                label="رقم الهاتف (اختياري)"
                value={contactPhone}
                dir="ltr"
                onChange={(event) =>
                  setContactPhone(event.target.value)
                }
              />
            </div>
          </div>
        )}

        {activeTab === 'finance' && (
          <div className="max-w-2xl space-y-5">
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
              <label className="flex cursor-pointer items-center justify-between gap-4">
                <div>
                  <span className="block text-sm font-medium text-[var(--color-text-secondary)]">
                    تفعيل الضريبة
                  </span>

                  <span className="text-xs text-[var(--color-text-muted)]">
                    عند إيقافها، ستُخفي الضريبة من واجهة المتجر تلقائيًا
                  </span>
                </div>

                <input
                  type="checkbox"
                  checked={taxEnabled}
                  onChange={(event) =>
                    setTaxEnabled(event.target.checked)
                  }
                  className="h-5 w-5 accent-[var(--color-accent)]"
                  aria-label="تفعيل الضريبة"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Input
                type="number"
                min="0"
                max="100"
                step="0.01"
                label="نسبة الضريبة (٪)"
                value={taxRate}
                disabled={!taxEnabled}
                dir="ltr"
                onChange={(event) =>
                  setTaxRate(Number(event.target.value))
                }
              />

              <Input
                type="text"
                list="currency-options"
                label="العملة الافتراضية"
                value={defaultCurrency}
                placeholder="اكتب اسم العملة أو الرمز"
                dir="ltr"
                onChange={(event) =>
                  setDefaultCurrency(
                    event.target.value.toUpperCase(),
                  )
                }
              />

              <datalist id="currency-options">
                {currencyOptions.map((currency) => (
                  <option
                    key={currency.code}
                    value={currency.code}
                    label={currency.label}
                  />
                ))}
              </datalist>
            </div>

            {!taxEnabled && (
              <div className="rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface-subtle)] px-4 py-3 text-sm text-[var(--color-text-muted)]">
                الضريبة متوقفة حاليًا، لذا سيتم إخفاؤها تلقائيًا في واجهة المتجر.
              </div>
            )}
          </div>
        )}

        {activeTab === 'maintenance' && (
          <div className="max-w-2xl space-y-6">
            <div className="flex items-start gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
              <div className="pt-0.5">
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={maintenanceMode}
                    onChange={handleToggleMaintenance}
                    aria-label="تفعيل وضع الصيانة"
                  />

                  <span
                    className={[
                      'relative h-6 w-11 rounded-full transition-colors',
                      'after:absolute after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-[var(--color-border)] after:bg-[var(--color-surface-card)] after:transition-transform after:content-[""]',
                      'after:right-[2px]',
                      maintenanceMode
                        ? 'bg-[var(--color-accent)] after:-translate-x-5'
                        : 'bg-[var(--color-border-muted)]',
                      'peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--color-accent)] peer-focus-visible:ring-offset-2',
                    ].join(' ')}
                    aria-hidden="true"
                  />
                </label>
              </div>

              <div>
                <h3 className="mb-1 flex items-center gap-2 text-sm font-bold text-[var(--color-text-primary)]">
                  تفعيل وضع الصيانة

                  {maintenanceMode && (
                    <AlertTriangle
                      size={16}
                      className="text-[var(--color-danger)]"
                      aria-hidden="true"
                    />
                  )}
                </h3>

                <p className="text-xs leading-relaxed text-[var(--color-text-muted)]">
                  عند تفعيل هذا الخيار، لن يتمكن العملاء من تصفح المتجر أو إتمام الطلبات.
                  استخدمه فقط أثناء التحديثات الجوهرية.
                </p>
              </div>
            </div>

            {maintenanceMode && (
              <Textarea
                label="رسالة وضع الصيانة (تظهر للعملاء)"
                value={maintenanceMessage}
                placeholder="مثال: نقوم حاليًا ببعض التحديثات وسنعود قريبًا."
                onChange={(event) =>
                  setMaintenanceMessage(event.target.value)
                }
              />
            )}
          </div>
        )}
      </div>

      <div className="flex justify-end border-t border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6">
        <Button
          type="submit"
          disabled={isPending}
          isLoading={isPending}
          className="min-w-40"
        >
          {!isPending && (
            <Save size={18} aria-hidden="true" />
          )}
          {isPending ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
        </Button>
      </div>
    </form>
  )
}