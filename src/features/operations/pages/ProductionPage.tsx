import { Link } from 'react-router-dom'
import { OpCard, OpCardSection } from '../components/OpCard'
import { OpEmptyState } from '../components/OpEmptyState'
import { OpPageHeader } from '../components/OpPageHeader'
import { useProductionStages } from '../hooks/useProduction'

export default function ProductionPage() {
  const { data: stages, isLoading, isError } = useProductionStages()

  return (
    <div className="space-y-6" dir="rtl">
      <OpPageHeader
        title="مراحل الإنتاج"
        description="المراحل المعتمدة في النظام ومتابعة انتقال الطلبات بينها"
        action={<Link to="../orders" className="inline-flex items-center justify-center rounded-xl bg-[var(--color-accent)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--color-accent-hover)]">الانتقال إلى الطلبات</Link>}
      />

      <OpCard variant="table">
        <OpCardSection>
          <div>
            <h2 className="text-sm font-bold text-[var(--color-text-primary)]">تسلسل مراحل الإنتاج</h2>
            <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">تُقرأ مباشرة من Laravel Admin API</p>
          </div>
          {stages?.length ? <span className="rounded-full bg-[var(--color-surface-subtle)] px-3 py-1 text-xs text-[var(--color-text-muted)]">{stages.length} مراحل</span> : null}
        </OpCardSection>

        {isLoading ? (
          <OpEmptyState>جارٍ تحميل مراحل الإنتاج...</OpEmptyState>
        ) : isError ? (
          <OpEmptyState tone="error">تعذر تحميل مراحل الإنتاج من الخادم.</OpEmptyState>
        ) : !stages?.length ? (
          <OpEmptyState>لا توجد مراحل إنتاج معرفة في النظام.</OpEmptyState>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {stages.map((stage, index) => (
              <div key={stage.id} className="flex items-center gap-4 px-5 py-4 transition hover:bg-[var(--color-surface-subtle)]">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-surface-subtle)] font-bold text-[var(--color-text-primary)]">{index + 1}</div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-[var(--color-text-primary)]">{stage.name}</div>
                  <div className="mt-1 text-xs text-[var(--color-text-muted)]">ترتيب المرحلة: {index + 1}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </OpCard>

      <OpCard>
        <div className="space-y-3">
          <h2 className="font-bold text-[var(--color-text-primary)]">تغيير مرحلة طلب</h2>
          <p className="text-sm leading-6 text-[var(--color-text-muted)]">افتح أي طلب من صفحة الطلبات، ثم استخدم مدير مراحل الإنتاج لتعيين المرحلة أو الانتقال إلى المرحلة التالية.</p>
          <Link to="../orders" className="inline-flex text-sm font-semibold text-[var(--color-accent)] hover:underline">عرض الطلبات</Link>
        </div>
      </OpCard>
    </div>
  )
}
