import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useFreeDesigns, useAssignFreeDesign } from '../hooks/useFreeDesigns'
import { FreeDesignList } from '../components/FreeDesignList'
export default function FreeDesignsPage(){
  const [params] = useState({ per_page: 30 })
  const { data } = useFreeDesigns(params)
  const items = data?.data ?? []
  const assignMutation = useAssignFreeDesign()

  const assign = async (id: number) => {
    const assignee = prompt('أدخل اسم الموظف لتعيينه:')
    if (!assignee) return
    try {
      await assignMutation.mutateAsync({ id, payload: { assignee, status: 'assigned' } })
      alert('تم التعيين')
    } catch (err) {
      console.error(err)
      alert('فشل التعيين')
    }
  }

  return (
    <div dir="rtl" className="space-y-6">
      <Helmet><title>طلبات التصميم الحر — لوحة الإدارة</title></Helmet>

      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold">طلبات التصميم الحر</h1></div>

      <div>
        <FreeDesignList items={items} onAssign={assign} />
      </div>
    </div>
  )
}
