import React from 'react'
import type { CustomizationEstimate } from '../types/customizations.types'

export function CustomizationPriceSummary({ estimate }: { estimate?: CustomizationEstimate | null }) {
  if (!estimate) {
    return (
      <div className="rounded-2xl bg-[#24321d] p-4 text-white">
        <div className="text-sm">ملخّص تقدير السعر</div>
        <div className="mt-3 text-lg font-bold">0 ر.س</div>
        <div className="mt-2 text-xs opacity-80">سعر المنتج الأساسي + رسوم التخصيص + الشحن</div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-[#24321d] p-4 text-white">
      <div className="text-sm">ملخّص تقدير السعر</div>
      <div className="mt-3 text-lg font-bold">{Number(estimate.total).toLocaleString('ar-SA')} ر.س</div>

      <div className="mt-3 text-xs">
        <div className="flex justify-between"><span>سعر المنتج الأساسي</span><span>{Number(estimate.base_price).toLocaleString('ar-SA')} ر.س</span></div>
        <div className="flex justify-between"><span>رسوم التخصيص</span><span>{Number(estimate.customization_fee).toLocaleString('ar-SA')} ر.س</span></div>
        <div className="flex justify-between"><span>الشحن والتكاليف الأخرى</span><span>{Number(estimate.shipping).toLocaleString('ar-SA')} ر.س</span></div>
      </div>
    </div>
  )
}
