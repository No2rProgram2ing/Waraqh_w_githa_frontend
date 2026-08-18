import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { ReportsChart } from '../components/ReportsChart'
import { useReports } from '../hooks/useReports'
import { ReportsExport } from '../components/ReportsExport'

export default function ReportsPage(){
  const [params, setParams] = useState({ per_page: 50 })
  const { data, refetch } = useReports(params)
  const rows = data?.data ?? []

  useEffect(() => { refetch() }, [params])

  return (
    <div dir="rtl" className="space-y-6">
      <Helmet><title>التقارير — لوحة الإدارة</title></Helmet>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">التقارير</h1>
        <ReportsExport rows={rows} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="col-span-2">
          <ReportsChart rows={rows.map((r: any) => ({ label: r.name ?? r.label ?? 'عنصر', value: r.value ?? r.amount ?? 0 }))} />
        </div>

        <aside>
          <div className="rounded-2xl border bg-white p-4">
            <h3 className="text-sm font-semibold text-right">فلترة</h3>
            <div className="mt-3 space-y-2">
              <input placeholder="بحث" className="w-full rounded-md border p-2" onChange={(e) => setParams({ ...params, q: e.target.value })} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
