import React from 'react'

export function ReportsExport({ rows }: { rows: any[] }){
  const exportCsv = () => {
    if (!rows || !rows.length) return
    const cols = Object.keys(rows[0])
    const esc = (v: any) => `"${String(v ?? '').replace(/"/g, '""')}"`
    const header = cols.map(esc).join(',')
    const body = rows.map((r) => cols.map((c) => esc(r[c])).join(',')).join('\n')
    const csv = header + '\n' + body
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `reports_${new Date().toISOString()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex items-center gap-2">
      <button onClick={exportCsv} className="rounded-md bg-[#3b6a2b] px-3 py-2 text-white">تصدير CSV</button>
      <button className="rounded-md border px-3 py-2">تصدير PDF</button>
    </div>
  )
}
