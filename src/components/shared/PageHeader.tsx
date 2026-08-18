import type { ReactNode } from 'react'
import { clsx } from 'clsx'

interface PageHeaderProps {
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function PageHeader({
  title,
  description,
  action,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={clsx(
        'flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      <div>
        <h1 className="text-[28px] font-extrabold text-[var(--color-text-primary)]">
          {title}
        </h1>

        {description && (
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            {description}
          </p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}