import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useMaterials } from '../hooks/useInventory'
import { InventoryTable } from '../components/InventoryTable'
import { InventoryForm } from '../components/InventoryForm'
import { PageHeader } from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/Button'

export default function InventoryPage() {
  const [params] = useState({ per_page: 50 })
  const { data: matData, refetch } = useMaterials(params)
  const materials = matData?.data ?? []
  const [editing, setEditing] = useState<any | null>(null)

  return (
    <div dir="rtl" className="space-y-6">
      <Helmet>
        <title>المخزون — لوحة الإدارة</title>
      </Helmet>

      <PageHeader
        title="المخزون والمواد الخام"
        action={
          <Button onClick={() => setEditing(null)}>
            إضافة مادة جديدة
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="col-span-2">
          <InventoryTable materials={materials} />
        </div>

        <aside>
          <InventoryForm
            material={editing}
            onSaved={() => refetch()}
          />
        </aside>
      </div>
    </div>
  )
}
