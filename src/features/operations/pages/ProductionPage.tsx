import { Helmet } from 'react-helmet-async'
import { Factory } from 'lucide-react'
import { OpPageHeader } from '../components/OpPageHeader'

export default function ProductionPage() {
  return (
    <div dir="rtl" className="space-y-6">
      <Helmet>
        <title>الإنتاج — لوحة الإدارة</title>
      </Helmet>

      {/* Page Header */}
      <OpPageHeader
        title="الإنتاج"
        description="متابعة مراحل الإنتاج وحالة الطلبات الجارية"
      />

      {/* Placeholder Card */}
      <div className="overflow-hidden rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface-card)] shadow-sm">
        <div className="flex flex-col items-center justify-center px-5 py-24 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-surface)]">
            <Factory size={26} className="text-[var(--color-text-muted)]" aria-hidden="true" />
          </div>
          <h2 className="text-base font-bold text-[var(--color-text-primary)]">
            إدارة مراحل الإنتاج
          </h2>
          <p className="mt-2 max-w-xs text-sm text-[var(--color-text-muted)]">
            هذه الصفحة قيد التطوير. سيتم ربطها بالـ API عند تنفيذ الميّزات المتعلقة بها.
          </p>
        </div>
      </div>
    </div>
  )
}
