import { Card } from '@/components/ui/Card'
import { clsx } from 'clsx'
import type { ReactNode } from 'react'

interface Props {
  title: string
  value: ReactNode
  subtitle?: string
  percent?: number | null
  variant?: 'normal' | 'positive' | 'warning'
}

export function DashboardKpiCard({
  title,
  value,
  subtitle,
  percent = null,
  variant = 'normal',
}: Props) {
  const percentClass = {
    normal: 'text-[var(--color-text-muted)]',
    positive: 'text-[var(--color-success)]',
    warning: 'text-[var(--color-warning)]',
  }[variant]

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 text-right">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
            {title}
          </h3>

          {subtitle && (
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              {subtitle}
            </p>
          )}
        </div>

        <div className="text-left">
          <div className="text-xl font-extrabold text-[var(--color-text-primary)]">
            {value}
          </div>

          {percent !== null && (
            <div
              className={clsx(
                'mt-1 text-sm font-semibold',
                percentClass,
              )}
            >
              {percent > 0 ? `+${percent}%` : `${percent}%`}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
