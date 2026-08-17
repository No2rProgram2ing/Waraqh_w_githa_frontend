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

  const exportPdf = () => {
    // Client-side PDF fallback: open printable window and invoke print (user can save as PDF)
    try {
      const html = [`<html dir="rtl"><head><title>تقرير</title><style>table{width:100%;border-collapse:collapse;}td,th{border:1px solid #e5e7eb;padding:8px;text-align:right}</style></head><body><h2>تقرير</h2><table><thead><tr>${Object.keys(rows[0]).map(c => `<th>${c}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${Object.keys(r).map(k => `<td>${String(r[k] ?? '')}</td>`).join('')}</tr>`).join('')}</tbody></table></body></html>`].join('\n')
      const w = window.open('', '_blank')
      if (!w) {
        alert('فشل فتح نافذة الطباعة — الرجاء السماح بالنوافذ المنبثقة أو حاول التصدير مرة أخرى.')
        return
      }
      w.document.open()
      w.document.write(html)
      w.document.close()
      w.focus()
      // Give the new window a moment to render before printing
      setTimeout(() => {
        w.print()
      }, 500)
    } catch (err) {
      console.error('PDF export failed', err)
      alert('فشل تصدير PDF. يمكنك استخدام زر CSV كحل بديل.')
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button onClick={exportCsv} className="rounded-md bg-[#3b6a2b] px-3 py-2 text-white">تصدير CSV</button>
      <button onClick={exportPdf} className="rounded-md border px-3 py-2">تصدير PDF</button>
    </div>
  )
}
