import { Download, FileText } from 'lucide-react'
import { OpButton } from './OpButton'

export function ReportsExport({ rows }: { rows: any[] }) {
  const exportCsv = () => {
    if (!rows || !rows.length) return
    
    // Map keys to Arabic
    const translatedRows = rows.map((r) => ({
      'التاريخ': r.date,
      'الإيرادات': r.revenue,
    }))

    const cols = Object.keys(translatedRows[0])
    const esc = (v: any) => `"${String(v ?? '').replace(/"/g, '""')}"`
    const header = cols.map(esc).join(',')
    const body = translatedRows.map((r: any) => cols.map((c) => esc(r[c])).join(',')).join('\n')
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
      const translatedRows = rows?.map((r) => ({
        'التاريخ': r.date,
        'الإيرادات': r.revenue,
      })) ?? []

      const html = [
        `<html dir="rtl"><head><title>تقرير</title><style>table{width:100%;border-collapse:collapse;font-family:sans-serif;}td,th{border:1px solid #e5e7eb;padding:8px;text-align:right}</style></head><body><h2>تقرير</h2><table><thead><tr>${Object.keys(translatedRows[0] ?? {})
          .map((c) => `<th>${c}</th>`)
          .join('')}</tr></thead><tbody>${translatedRows
          .map(
            (r: any) =>
              `<tr>${Object.keys(r)
                .map((k) => `<td>${String(r[k] ?? '')}</td>`)
                .join('')}</tr>`
          )
          .join('')}</tbody></table></body></html>`,
      ].join('\n')
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
    <div className="flex shrink-0 items-center gap-2">
      <OpButton size="sm" variant="primary" onClick={exportCsv} icon={<Download size={15} strokeWidth={2} aria-hidden="true" />}>تصدير CSV</OpButton>
      <OpButton size="sm" onClick={exportPdf} icon={<FileText size={15} strokeWidth={2} aria-hidden="true" />}>تصدير PDF</OpButton>
    </div>
  )
}
