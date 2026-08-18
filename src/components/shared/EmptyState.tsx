    import type { ReactNode } from 'react'
    import { clsx } from 'clsx'

    interface EmptyStateProps {
    children: ReactNode
    className?: string
    }

    export function EmptyState({ children, className }: EmptyStateProps) {
    return (
        <div
        className={clsx(
            'flex min-h-40 items-center justify-center',
            'rounded-2xl border border-dashed border-[var(--color-border-muted)]',
            'bg-[var(--color-surface)] px-6 py-12 text-center',
            'text-sm text-[var(--color-text-muted)]',
            className,
        )}
        >
        {children}
        </div>
    )
    }