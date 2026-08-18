import type { ReactNode } from 'react'
import { clsx } from 'clsx'

interface FilterToolbarProps {
  children: ReactNode
  className?: string
}

export function FilterToolbar({
  children,
  className,
}: FilterToolbarProps) {
  return (
    <div
      dir="rtl"
      className={clsx(
        'flex flex-wrap items-end gap-3',
        className,
      )}
    >
      {children}
    </div>
  )
}
