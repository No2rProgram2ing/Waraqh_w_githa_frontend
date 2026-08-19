import { clsx } from 'clsx'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

interface Props {
  title: string
  value: ReactNode
  subtitle?: string
  percent?: number | null
  variant?: 'normal' | 'positive' | 'warning'
  icon?: LucideIcon
}

export function DashboardKpiCard({
  title,
  value,
  subtitle,
  percent = null,
  variant = 'normal',
  icon: Icon,
}: Props) {
  const accentMap = {
    normal:   { bar: 'bg-[var(--color-border)]',         icon: 'bg-[var(--color-surface)] text-[var(--color-text-muted)]' },
    positive: { bar: 'bg-emerald-500',                   icon: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' },
    warning:  { bar: 'bg-amber-500',                     icon: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' },
  }[variant]

  const percentClass = {
    normal:   'text-[var(--color-text-muted)]',
    positive: 'text-emerald-600 dark:text-emerald-400',
    warning:  'text-amber-600 dark:text-amber-400',
  }[variant]

  return (
    <div className="relative overflow-hidden rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface-card)] p-5 shadow-sm">
      {/* Top accent bar */}
      <div className={clsx('absolute inset-x-0 top-0 h-0.5', accentMap.bar)} />

      <div className="flex items-start justify-between gap-3">
        {/* Text content */}
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-secondary)]">
            {title}
          </p>

          <div className="mt-3 text-[2rem] font-extrabold leading-none tracking-tight text-[var(--color-text-primary)]">
            {value}
          </div>

          {subtitle && (
            <p className="mt-2 text-xs text-[var(--color-text-muted)]">{subtitle}</p>
          )}

          {percent !== null && (
            <div className={clsx('mt-2 flex items-center gap-1 text-xs font-semibold', percentClass)}>
              <span>{percent > 0 ? '↑' : '↓'}</span>
              <span>{Math.abs(percent)}%</span>
              <span className="font-normal text-[var(--color-text-muted)]">مقارنة بالشهر السابق</span>
            </div>
          )}
        </div>

        {/* Icon container */}
        {Icon && (
          <div className={clsx('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', accentMap.icon)}>
            <Icon size={20} strokeWidth={1.8} aria-hidden="true" />
          </div>
        )}
      </div>
    </div>
  )
}
