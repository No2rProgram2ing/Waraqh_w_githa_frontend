import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { RefreshCw, Search, Filter } from 'lucide-react'
import { useFreeDesigns, useAssignFreeDesign } from '../hooks/useFreeDesigns'
import { FreeDesignList } from '../components/FreeDesignList'
import { OpPageHeader } from '../components/OpPageHeader'
import { OpCard } from '../components/OpCard'

export default function FreeDesignsPage() {
  const [params, setParams] = useState({ per_page: 30, search: '', status: '' })
  const { data, isLoading, isFetching, isError, refetch } = useFreeDesigns(params)
  const items = data?.data ?? (Array.isArray(data) ? data : [])
  const assignMutation = useAssignFreeDesign()

  const assign = async (id: number) => {
    const assignee = prompt('أدخل اسم الموظف لتعيينه:')
    if (!assignee) return
    try {
      await assignMutation.mutateAsync({ id, payload: { assignee, status: 'assigned' } })
      alert('تم تعيين الطلب بنجاح')
    } catch (err) {
      console.error(err)
      alert('فشل تعيين الطلب')
    }
  }

  return (
    <div dir="rtl" className="space-y-6">
      <Helmet>
        <title>طلبات التصميم الحر — لوحة الإدارة</title>
      </Helmet>

      {/* 1. الهيدر باستخدام OpPageHeader */}
      <OpPageHeader
        title="طلبات التصميم الحر"
        description="إدارة ومتابعة طلبات التصاميم اليدوية والقطع المخصصة المقدمة من العملاء"
        action={
          <button
            type="button"
            onClick={() => void refetch()}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 border border-gray-200 hover:bg-gray-50 transition shadow-sm cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin text-[#45592D]' : 'text-gray-500'}`} />
            تحديث البيانات
          </button>
        }
      />

      {/* 2. أدوات البحث والفلترة */}
      <div className="flex flex-col gap-4 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="ابحث عن طلب..."
            value={params.search}
            onChange={(e) => setParams({ ...params, search: e.target.value })}
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pr-10 pl-4 text-xs text-gray-800 placeholder-gray-400 focus:border-[#45592D] focus:ring-1 focus:ring-[#45592D] focus:outline-none transition"
          />
        </div>

        <div className="flex w-full items-center justify-end gap-2 md:w-auto">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={params.status}
            onChange={(e) => setParams({ ...params, status: e.target.value })}
            className="rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-medium text-gray-700 focus:border-[#45592D] focus:outline-none transition cursor-pointer"
          >
            <option value="">جميع الحالات</option>
            <option value="pending">قيد الانتظار</option>
            <option value="assigned">تم التعيين</option>
            <option value="completed">مكتمل</option>
          </select>
        </div>
      </div>

      {/* 3. عرض المكون FreeDesignList داخل OpCard */}
      <OpCard>
        {isLoading ? (
          <div className="p-8 text-center text-xs text-gray-500">جاري تحميل طلبات التصميم...</div>
        ) : isError ? (
          <div className="p-8 text-center text-xs text-red-600">حدث خطأ أثناء تحميل البيانات.</div>
        ) : (
          <FreeDesignList items={items} onAssign={assign} />
        )}
      </OpCard>
    </div>
  )
}