    import type { ReactNode } from 'react'
    import { clsx } from 'clsx'

    interface TableShellProps {
    children: ReactNode
    minWidth?: string
    className?: string
    dir?: 'ltr' | 'rtl'
    }

    export function TableShell({
    children,
    minWidth = '900px',
    className,
    dir = 'rtl',
    }: TableShellProps) {
    return (
        <div
        className={clsx(
            'overflow-x-auto rounded-2xl border border-[var(--color-border)]',
            'bg-[var(--color-surface-card)]',
            className,
        )}
        dir={dir}
        >
        <table
            className="w-full text-right"
            style={{ minWidth }}
        >
            {children}
        </table>
        </div>
    )
    }