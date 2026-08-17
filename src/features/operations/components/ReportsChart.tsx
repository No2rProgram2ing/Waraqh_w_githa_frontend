import React from 'react'

export function ReportsChart({ rows = [], labelKey = 'label', valueKey = 'value' }: { rows?: any[]; labelKey?: string; valueKey?: string }){
  if (!rows || !rows.length) return <div className="p-4 text-sm text-gray-500">لا توجد بيانات لعرض الرسم البياني.</div>

  // simple bar chart SVG
  const max = Math.max(...rows.map((r) => Number(r[valueKey] || 0))) || 1
  const bars = rows.slice(0, 12)

  return (
    <div className="rounded-2xl border bg-white p-4">
      <div className="text-right font-semibold mb-3">مخطط تقريبي</div>
      <svg width="100%" height="160" viewBox="0 0 100 160" preserveAspectRatio="none">
        {bars.map((b, i) => {
          const h = (Number(b[valueKey] || 0) / max) * 120
          const x = (i * (100 / bars.length)) + 2
          const w = (100 / bars.length) - 4
          return (
            <g key={i} transform={`translate(${x}, ${140 - h})`}>
              <rect x={0} y={0} width={w} height={h} fill="#2563eb" rx="1" />
            </g>
          )
        })}
      </svg>
      <div className="mt-3 grid grid-cols-4 gap-2 text-xs text-gray-600">
        {bars.map((b, i) => (<div key={i} className="text-right">{String(b[labelKey] ?? '-')}</div>))}
      </div>
    </div>
  )
}
