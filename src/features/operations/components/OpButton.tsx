import type { ButtonHTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'

interface OpButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md'
  icon?: ReactNode
}

export function OpButton({
  children,
  variant = 'secondary',
  size = 'md',
  icon,
  className,
  ...props
}: OpButtonProps) {
  return (
    <button
      {...props}
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold shadow-sm transition focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 disabled:cursor-not-allowed disabled:opacity-50',
        size === 'sm' ? 'px-3 py-2 text-xs' : 'px-4 py-2.5 text-sm',
        variant === 'primary' && 'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)]',
        variant === 'secondary' && 'border border-[var(--color-border)] bg-[var(--color-surface-card)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-subtle)]',
        variant === 'danger' && 'border border-red-200 bg-white text-red-600 hover:bg-red-50 dark:border-red-900/60 dark:bg-[var(--color-surface-card)] dark:text-red-300 dark:hover:bg-red-950/30',
        variant === 'ghost' && 'bg-transparent text-[var(--color-text-muted)] shadow-none hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-text-primary)]',
        className,
      )}
    >
      {icon}
      {children}
    </button>
  )
}
