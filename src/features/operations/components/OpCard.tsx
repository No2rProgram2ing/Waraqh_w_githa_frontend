/**
 * OpCard — Card wrapper for operations pages ONLY.
 * Matches design language of ProductsPage card sections.
 * Has two variants:
 *  - default: padded card (like KPI cards)
 *  - table:   edge-to-edge card container (no inner padding, for tables/toolbars)
 *
 * ⚠️  Do NOT use in catalog, customers, or settings pages.
 */
import type { ReactNode } from 'react'
import clsx from 'clsx'

interface OpCardProps {
  children: ReactNode
  className?: string
  /** 'table' removes inner padding so table/toolbar can extend edge-to-edge */
  variant?: 'default' | 'table'
}

export function OpCard({ children, className, variant = 'default' }: OpCardProps) {
  return (
    <div
      className={clsx(
        'overflow-hidden rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface-card)] shadow-sm transition-shadow',
        variant === 'default' && 'p-5',
        className,
      )}
    >
      {children}
    </div>
  )
}

/**
 * OpCardSection — Toolbar / section header inside an OpCard(table).
 */
export function OpCardSection({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={clsx('flex flex-wrap items-center justify-between gap-4 border-b border-[var(--color-border)] px-5 py-4', className)}>
      {children}
    </div>
  )
}
