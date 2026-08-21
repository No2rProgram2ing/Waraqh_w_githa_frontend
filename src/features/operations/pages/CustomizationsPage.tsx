import { useState } from 'react'
import { Plus, Search, Filter, RefreshCw, Edit2, Layers } from 'lucide-react'
import { useCustomizations } from '../hooks/useCustomizations'

import { OpPageHeader } from '../components/OpPageHeader'
import { OpCard } from '../components/OpCard'
import { CustomizationForm } from '../components/CustomizationForm'
import { CustomizationPriceSummary } from '../components/CustomizationPriceSummary'
import type { CustomizationOption } from '../types/customizations.types'

export default function CustomizationsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [selectedCustomization, setSelectedCustomization] = useState<CustomizationOption | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const { data: responseData, isLoading, isFetching, isError, refetch } = useCustomizations({
    search: searchTerm || undefined,
    type: typeFilter !== 'all' ? typeFilter : undefined,
  })

  const customizations: CustomizationOption[] = responseData?.data || (Array.isArray(responseData) ? responseData : [])

  const handleCreateNew = () => {
    setSelectedCustomization(null)
    setIsFormOpen(true)
  }

  const handleEdit = (item: CustomizationOption) => {
    setSelectedCustomization(item)
    setIsFormOpen(true)
  }

  return (
    <div dir="rtl" className="space-y-6">
      {/* 1. هيدر الصفحة */}
      <OpPageHeader
        title="إدارة التخصيصات"
        description="إدارة وأنماط حياكة الروتان، خامات التصنيع، والمقاسات الخاصة بطلبات العملاء"
        action={
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => void refetch()}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 border border-gray-200 hover:bg-gray-50 transition shadow-sm cursor-pointer"
            >
              <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin text-[#45592D]' : 'text-gray-500'}`} />
              تحديث
            </button>
            <button
              type="button"
              onClick={handleCreateNew}
              className="inline-flex items-center gap-2 rounded-xl bg-[#45592D] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#384824] transition shadow-sm cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              إضافة تخصيص جديد
            </button>
          </div>
        }
      />

      {/* 2. شريط البحث والفلترة */}
      <div className="flex flex-col gap-4 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="ابحث عن خيار تخصيص، نمط حياكة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pr-10 pl-4 text-xs text-gray-800 placeholder-gray-400 focus:border-[#45592D] focus:ring-1 focus:ring-[#45592D] focus:outline-none transition"
          />
        </div>

        <div className="flex w-full items-center justify-end gap-2 md:w-auto">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-medium text-gray-700 focus:border-[#45592D] focus:outline-none transition cursor-pointer"
          >
            <option value="all">جميع الأنواع</option>
            <option value="weaving">أنماط الحياكة (Weaving)</option>
            <option value="dimensions">الأبعاد والمقاسات</option>
            <option value="color">الألوان والدهانات</option>
            <option value="material">أنواع الروتان والخامات</option>
          </select>
        </div>
      </div>

      {/* 3. شبكة التخصيصات وعرض الأسعار */}
      {isError ? (
        <div className="rounded-2xl border border-gray-200/80 bg-white p-12 text-center shadow-sm">
          <p className="text-sm font-semibold text-red-600">حدث خطأ أثناء تحميل بيانات التخصيصات.</p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-4 rounded-xl bg-[#45592D] px-4 py-2 text-xs font-semibold text-white hover:bg-[#384824] transition shadow-sm cursor-pointer"
          >
            إعادة المحاولة
          </button>
        </div>
      ) : (
        <OpCard>
          {isLoading ? (
            <div className="p-8 text-center text-xs text-gray-500">جاري تحميل بيانات التخصيصات...</div>
          ) : customizations.length === 0 ? (
            <div className="p-12 text-center text-xs text-gray-500">لا توجد خيارات تخصيص مسجلة حالياً.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
              {customizations.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-gray-200/80 bg-white p-4 hover:border-[#45592D]/40 transition shadow-sm flex flex-col justify-between gap-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-[#45592D]/10 text-[#45592D]">
                        <Layers className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-800">{item.name}</h4>
                        <span className="text-[10px] text-gray-400">{item.type}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleEdit(item)}
                      className="p-1.5 text-gray-400 hover:text-[#45592D] hover:bg-gray-50 rounded-lg transition"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* ملخص السعر الخاص بالتخصيص */}
                  <CustomizationPriceSummary item={item} />
                </div>
              ))}
            </div>
          )}
        </OpCard>
      )}

      {/* 4. نموذج إضافة/تعديل التخصيص */}
      {isFormOpen && (
        <CustomizationForm
          initialData={selectedCustomization}
          onClose={() => setIsFormOpen(false)}
          onSuccess={() => {
            setIsFormOpen(false)
            void refetch()
          }}
        />
      )}
    </div>
  )
}