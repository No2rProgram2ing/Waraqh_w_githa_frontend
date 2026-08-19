import { Helmet } from 'react-helmet-async'
import { Construction } from 'lucide-react'

export default function CustomizationsPage() {
  return (
    <div dir="rtl" className="space-y-6">
      <Helmet>
        <title>التخصيصات — لوحة الإدارة</title>
      </Helmet>

      {/* Page Header */}
      <div>
        <h1 className="text-[28px] font-extrabold leading-tight text-[var(--color-text-primary)]">
          التخصيصات
        </h1>
        <p className="mt-1.5 text-sm text-[var(--color-text-muted)]">
          إدارة طلبات تخصيص المنتجات
        </p>
      </div>

      {/* Placeholder Card */}
      <div className="overflow-hidden rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface-card)] shadow-sm">
        <div className="flex flex-col items-center justify-center px-5 py-24 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-surface)]">
            <Construction size={26} className="text-[var(--color-text-muted)]" aria-hidden="true" />
          </div>
          <h2 className="text-base font-bold text-[var(--color-text-primary)]">
            طلبات التخصيص
          </h2>
          <p className="mt-2 max-w-xs text-sm text-[var(--color-text-muted)]">
            هذه الصفحة قيد التطوير. سيتم ربطها بالـ API عند تنفيذ الميّزات المتعلقة بها.
          </p>
        </div>
      </div>
    </div>
  )
}
