import { motion } from 'framer-motion'
import type { CustomizationEstimate } from '../types/customizations.types'

export function CustomizationPriceSummary({
  estimate,
}: {
  estimate?: CustomizationEstimate | null
}) {
  const hasEstimate = Boolean(estimate)

  return (
    <motion.div
      className="rounded-2xl border border-[var(--color-accent)]/20 bg-[var(--color-accent)] p-5 text-white shadow-sm"
      initial={{ scale: 0.98 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="text-sm font-medium opacity-90">
        ملخّص تقدير السعر
      </div>

      <div className="mt-3 text-2xl font-bold">
        {hasEstimate
          ? `${Number(estimate?.total).toLocaleString('ar-SA')} ر.س`
          : '0 ر.س'}
      </div>

      {!hasEstimate ? (
        <p className="mt-2 text-xs opacity-80">
          سعر المنتج الأساسي + رسوم التخصيص + الشحن
        </p>
      ) : (
        <div className="mt-4 space-y-3 border-t border-white/15 pt-4 text-xs">
          <div className="flex items-center justify-between gap-4">
            <span className="opacity-80">سعر المنتج الأساسي</span>
            <span className="font-semibold">
              {Number(estimate.base_price).toLocaleString('ar-SA')} ر.س
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="opacity-80">رسوم التخصيص</span>
            <span className="font-semibold">
              {Number(estimate.customization_fee).toLocaleString('ar-SA')} ر.س
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="opacity-80">الشحن والتكاليف الأخرى</span>
            <span className="font-semibold">
              {Number(estimate.shipping).toLocaleString('ar-SA')} ر.س
            </span>
          </div>
        </div>
      )}
    </motion.div>
  )
}