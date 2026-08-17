import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import { useMaterials } from '../hooks/useInventory'
import { InventoryTable } from '../components/InventoryTable'

export default function InventoryPage(){
  const [params] = useState({ per_page: 50 })
  const { data } = useMaterials(params)
  const materials = data?.data ?? []

  return (
    <div dir="rtl" className="space-y-6">
      <Helmet><title>المخزون — لوحة الإدارة</title></Helmet>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">المخزون والمواد الخام</h1>
      </div>

      <div>
        <InventoryTable materials={materials} />
      </div>
    </div>
  )
}
