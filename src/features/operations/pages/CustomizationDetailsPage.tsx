import { useNavigate, useParams } from 'react-router-dom'
import { ArrowRight, RefreshCw } from 'lucide-react'
import { useCustomization, useUpdateCustomizationStatus } from '../hooks/useCustomizations'
import { OpButton } from '../components/OpButton'
import { OpCard, OpCardSection } from '../components/OpCard'
import { OpEmptyState } from '../components/OpEmptyState'
import { OpPageHeader } from '../components/OpPageHeader'
import { OpStatusBadge } from '../components/OpStatusBadge'
import { useSystemCurrency } from '@/lib/currency'

export default function CustomizationDetailsPage() {
  const { id } = useParams()
  const nav = useNavigate()
  const itemId = Number(id)
  const { data: item, isLoading, isError, refetch } = useCustomization(itemId)
  const update = useUpdateCustomizationStatus()
  const { formatAmount } = useSystemCurrency()

  if (isLoading) return <div className="flex min-h-[280px] items-center justify-center" dir="rtl"><OpEmptyState>جارٍ التحميل...</OpEmptyState></div>
  if (isError || !item) return <div className="flex min-h-[280px] items-center justify-center" dir="rtl"><OpEmptyState tone="error">طلب التخصيص غير موجود أو تعذر تحميله.</OpEmptyState></div>

  return (
    <div dir="rtl" className="space-y-6">
      <OpPageHeader
        title={`طلب التخصيص ${item.request_code}`}
        description={item.product?.name ?? 'تفاصيل طلب التخصيص'}
        action={
          <>
            <OpButton size="sm" variant="ghost" onClick={() => nav('/admin/customizations')} icon={<ArrowRight className="h-4 w-4" />}>العودة</OpButton>
            <OpButton size="sm" onClick={() => void refetch()} icon={<RefreshCw className="h-4 w-4" />}>تحديث</OpButton>
          </>
        }
      />

      <OpCard>
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-[var(--color-text-primary)]">بيانات التخصيص</h2>
              <p className="mt-1 text-xs text-[var(--color-text-muted)]">المعلومات المتوفرة فعلياً من الـ Backend</p>
            </div>
            <OpStatusBadge status={String(item.status)} />
          </div>
          {item.attributes && item.attributes.length > 0 && (
          <div className="border-t border-[var(--color-border)] pt-6">
            <div className="mb-4">
              <h2 className="text-sm font-bold text-[var(--color-text-primary)]">
                خصائص المنتج المختارة
              </h2>

              <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                القيم التي تم اختيارها لهذا الطلب ويمكن الرجوع إليها أثناء التنفيذ.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {item.attributes.map((attribute) => (
                <div
                  key={attribute.id}
                  className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-4"
                >
                  <div className="text-xs text-[var(--color-text-muted)]">
                    {attribute.display_name ?? attribute.name ?? 'خاصية'}
                  </div>

                  <div className="mt-1 font-semibold text-[var(--color-text-primary)]">
                    {attribute.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ['الكمية', item.quantity],
              ['اللون', item.color ?? '—'],
              ['النقشة', item.design_pattern ?? '—'],
              ['الطول', `${item.dimensions?.length ?? '—'} سم`],
              ['العرض', `${item.dimensions?.width ?? '—'} سم`],
              ['الارتفاع', `${item.dimensions?.height ?? '—'} سم`],
            ].map(([label, value]) => (
              <div key={String(label)} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-4">
                <div className="text-xs text-[var(--color-text-muted)]">{label}</div>
                <div className="mt-1 font-semibold text-[var(--color-text-primary)]">{value}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {[
              ['السعر الأساسي', item.price?.base],
              ['رسوم التخصيص', item.price?.customization],
              ['الإجمالي', item.price?.total],
            ].map(([label, value]) => (
              <div key={String(label)} className="rounded-xl border border-[var(--color-border)] p-4">
                <div className="text-xs text-[var(--color-text-muted)]">{label}</div>
                <div className="mt-1 text-lg font-bold text-[var(--color-text-primary)]">{formatAmount(value ?? 0)}</div>
              </div>
            ))}
          </div>
        </div>
      </OpCard>

      <OpCard variant="table">
        <OpCardSection>
          <div>
            <h2 className="text-sm font-bold text-[var(--color-text-primary)]">تحديث الحالة</h2>
            <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">تغيير الحالة وفق الحالات التي يدعمها النظام</p>
          </div>
          <select
            value={String(item.status)}
            disabled={update.isPending}
            onChange={(e) => update.mutate({ id: item.id, status: e.target.value as any })}
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
          >
            <option value="pending_approval">بانتظار الموافقة</option>
            <option value="in_production">قيد التصنيع</option>
            <option value="completed">مكتمل</option>
          </select>
        </OpCardSection>
      </OpCard>

    </div>
  )
}
