import { useParams } from 'react-router-dom'
import { OpPageHeader } from '../components/OpPageHeader'
import { OpCard } from '../components/OpCard'

export default function OrderDetailsPage() {
  const { id } = useParams()

  return (
    <div dir="rtl" className="space-y-6">
      <OpPageHeader
        title={`تفاصيل الطلب #${id ?? ''}`}
        description="متابعة حالة الطلب والمنتجات والمواصفات الخاصة بالعميل"
      />

      <OpCard>
        <div className="p-8 text-center text-xs text-gray-500">
          تفاصيل الطلب رقم #{id}
        </div>
      </OpCard>
    </div>
  )
}