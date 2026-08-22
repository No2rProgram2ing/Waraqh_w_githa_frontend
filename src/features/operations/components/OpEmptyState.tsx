import type { ReactNode } from 'react'

interface OpEmptyStateProps {
  children: ReactNode
  tone?: 'neutral' | 'error'
}

export function OpEmptyState({ children, tone = 'neutral' }: OpEmptyStateProps) {
  return (
    <div
      className={
        tone === 'error'
          ? 'px-6 py-12 text-center text-sm font-medium text-red-600'
          : 'px-6 py-12 text-center text-sm text-[var(--color-text-muted)]'
      }
    >
      {children}
    </div>
  )
}
