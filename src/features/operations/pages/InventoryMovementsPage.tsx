import { Helmet } from 'react-helmet-async'
import { InventoryMovements } from '../components/InventoryMovements'
import { PageHeader } from '@/components/shared/PageHeader'

export default function InventoryMovementsPage() {
  return (
    <div dir="rtl" className="space-y-6">
      <Helmet>
        <title>حركات المخزون — لوحة الإدارة</title>
      </Helmet>

      <PageHeader title="حركات المخزون" />

      <InventoryMovements />
    </div>
  )
}
