import { Card } from '@/components/ui/Card'

export function OrdersTableSkeleton() {
  return (
    <Card className="p-4">
      <div className="text-sm text-[#6d6d6d]">قائمة الطلبات قيد الإعداد...</div>
    </Card>
  )
}
