import React from 'react'

interface Props {
  from?: string
  to?: string
  onChange: (values: { from?: string; to?: string }) => void
}

export function ReportsFilters({ from, to, onChange }: Props){
  return (
    <div className="rounded-2xl border bg-white p-4 flex items-center gap-3 justify-between">
      <div className="flex items-center gap-2">
        <label className="text-sm">من</label>
        <input type="date" defaultValue={from} onChange={(e) => onChange({ from: e.target.value, to })} className="rounded-md border p-2" />
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm">إلى</label>
        <input type="date" defaultValue={to} onChange={(e) => onChange({ from, to: e.target.value })} className="rounded-md border p-2" />
      </div>

      <div>
        <button onClick={() => onChange({})} className="rounded-md bg-gray-100 px-3 py-2">إعادة تعيين</button>
      </div>
    </div>
  )
}
