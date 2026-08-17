import type { DashboardStats } from '../types/dashboard.types'

interface Props {
  data?: DashboardStats | null
}

export function DashboardSalesChart({ data }: Props) {
  if (!data) {
    return (
      <div className="rounded-2xl border border-[#e6e2d8] bg-[#f8f6f1] p-6 text-center">
        <div className="text-lg font-semibold mb-2">إحصائيات المبيعات</div>
        <p className="text-sm text-[#6d6d6d]">لا توجد بيانات كافية لعرض الرسم البياني. يُنصح بإضافة endpoint خاص ببيانات المبيعات.</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-[#e6e2d8] bg-[#f8f6f1] p-6 text-center">
      <div className="text-lg font-semibold mb-2">أداء المبيعات للمنتجات الحرفية — آخر 30 يوم</div>
      <p className="text-sm text-[#6d6d6d]">البيانات الزمنية غير متوفرة حالياً.</p>
    </div>
  )
}
