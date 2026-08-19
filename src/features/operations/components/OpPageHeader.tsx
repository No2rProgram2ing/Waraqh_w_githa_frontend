/**
 * OpPageHeader — Standard page header for operations pages ONLY.
 * Matches the same header pattern used in ProductsPage (Design Reference).
 *
 * ⚠️  Do NOT use in catalog, customers, or settings pages.
 */
import type { ReactNode } from 'react'

interface OpPageHeaderProps {
  title: string
  description?: string
  action?: ReactNode
}

export function OpPageHeader({ title, description, action }: OpPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-[28px] font-extrabold leading-tight text-[var(--color-text-primary)]">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 text-sm text-[var(--color-text-muted)]">
            {description}
          </p>
        )}
      </div>
      {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
    </div>
  )
}
