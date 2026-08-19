import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useMaterials, useAdjustStock } from '../hooks/useInventory'
import { InventoryTable } from '../components/InventoryTable'
import { InventoryForm } from '../components/InventoryForm'
import { OpPageHeader } from '../components/OpPageHeader'
import { Plus } from 'lucide-react'

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

      {/* Page Header */}
      <OpPageHeader
        title="المخزون والمواد الخام"
        description="إدارة المواد الخام ومستويات المخزون ونقاط إعادة الطلب"
        action={
          <button
            id="inventory-add-material-btn"
            onClick={() => setEditing(null)}
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-accent)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--color-accent-hover)]"
          >
            <Plus size={16} strokeWidth={2.5} aria-hidden="true" />
            إضافة مادة جديدة
          </button>
        }
      />

      {/* Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Table — spans 2 cols on large screens */}
        <div className="lg:col-span-2">
          <InventoryTable materials={materials} onEdit={(m) => setEditing(m)} />
        </div>

        {/* Form — sidebar */}
        <aside>
          <InventoryForm material={editing} onSaved={() => { setEditing(null); refetch() }} />
        </aside>
      </div>
    </div>
  )
}
