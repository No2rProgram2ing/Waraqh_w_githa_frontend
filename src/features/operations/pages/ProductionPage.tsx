import { OpPageHeader } from '../components/OpPageHeader'
import { OpCard } from '../components/OpCard'
import { ProductionStageManager } from '../components/ProductionStageManager'

export default function ProductionPage() {
  return (
    <div dir="rtl" className="space-y-6 p-6">
      <OpPageHeader
        title="إدارة الإنتاج والمراحل"
        description="متابعة مراحل تصنيع الروتان، غزل الخيزران، وتتبع أوامر الورشة"
      />

      <OpCard>
        <div className="p-4">
          {/* تمرير id الطلب المطلوبة أو المبدئية للمكون */}
          <ProductionStageManager orderId={1} />
        </div>
      </OpCard>
    </div>
  )
}