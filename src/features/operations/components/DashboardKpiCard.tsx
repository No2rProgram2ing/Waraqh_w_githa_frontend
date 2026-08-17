import { Card } from '@/components/ui/Card'
import type { ReactNode } from 'react'

interface Props {
  title: string
  value: ReactNode
  subtitle?: string
}

export function DashboardKpiCard({ title, value, subtitle }: Props) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 text-right">
          <h3 className="text-sm font-semibold text-[#23321f]">{title}</h3>
          {subtitle && <p className="mt-1 text-xs text-[#6a6a6a]">{subtitle}</p>}
        </div>
        <div className="text-left">
          <div className="text-xl font-extrabold text-[#1e241d]">{value}</div>
        </div>
      </div>
    </Card>
  )
}
