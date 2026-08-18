import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import { useMaterials, useMovements, useAdjustStock } from '../hooks/useInventory'
import { InventoryTable } from '../components/InventoryTable'
import { InventoryForm } from '../components/InventoryForm'

export default function InventoryPage(){
  const [params] = useState({ per_page: 50 })
  const { data: matData, refetch } = useMaterials(params)
  const materials = matData?.data ?? []
  const [editing, setEditing] = useState<any | null>(null)

  return (
    <div dir="rtl" className="space-y-6">
      <Helmet><title>المخزون — لوحة الإدارة</title></Helmet>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">المخزون والمواد الخام</h1>
        <div>
          <button onClick={() => setEditing(null)} className="rounded-md bg-[#3b6a2b] px-3 py-2 text-white">إضافة مادة جديدة</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="col-span-2">
          <InventoryTable materials={materials} />
        </div>

        <aside>
          <InventoryForm material={editing} onSaved={() => refetch()} />
        </aside>
      </div>
    </div>
  )
}
