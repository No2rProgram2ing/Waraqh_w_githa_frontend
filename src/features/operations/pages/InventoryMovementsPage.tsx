import React from 'react'
import { Helmet } from 'react-helmet'
import { InventoryMovements } from '../components/InventoryMovements'

export default function InventoryMovementsPage(){
  return (
    <div dir="rtl" className="space-y-6">
      <Helmet><title>حركات المخزون — لوحة الإدارة</title></Helmet>
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold">حركات المخزون</h1></div>
      <InventoryMovements />
    </div>
  )
}
