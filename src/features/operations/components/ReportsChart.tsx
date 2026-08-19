import React from 'react'

interface ReportsChartProps {
  rows?: any[]
  labelKey?: string
  valueKey?: string
}

export function ReportsChart({ rows = [], labelKey = 'label', valueKey = 'value' }: ReportsChartProps) {
  if (!rows || !rows.length) {
    return (
      <section className="overflow-hidden rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface-card)] shadow-sm">
        <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
          <p className="text-sm font-medium text-[var(--color-text-muted)]">
            لا توجد بيانات لعرض الرسم البياني.
          </p>
        </div>
      </section>
    )
  }

  // simple bar chart SVG
  const max = Math.max(...rows.map((r) => Number(r[valueKey] || 0))) || 1
  const bars = rows.slice(0, 12)

  return (
    <section className="overflow-hidden rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface-card)] shadow-sm">
      <div className="border-b border-[var(--color-border)] px-5 py-4">
        <h2 className="text-base font-bold text-[var(--color-text-primary)]">مخطط تقريبي</h2>
      </div>
      <div className="p-5">
        <svg width="100%" height="160" viewBox="0 0 100 160" preserveAspectRatio="none">
          {bars.map((b, i) => {
            const h = (Number(b[valueKey] || 0) / max) * 120
            const x = i * (100 / bars.length) + 2
            const w = 100 / bars.length - 4
            return (
              <g key={i} transform={`translate(${x}, ${140 - h})`}>
                <rect x={0} y={0} width={w} height={h} fill="var(--color-accent)" rx="2" />
              </g>
            )
          })}
        </svg>
        <div className="mt-4 grid grid-cols-4 gap-2 text-xs font-medium text-[var(--color-text-secondary)] sm:grid-cols-6 md:grid-cols-12">
          {bars.map((b, i) => (
            <div key={i} className="truncate text-center" title={String(b[labelKey] ?? '-')}>
              {String(b[labelKey] ?? '-')}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
