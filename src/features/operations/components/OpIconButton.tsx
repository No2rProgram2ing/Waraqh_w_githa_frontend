import type { ButtonHTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'

interface OpIconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode
  label: string
  tone?: 'default' | 'danger'
}

/** Icon-only action used inside Operations tables. No border, background, or pill. */
export function OpIconButton({ icon, label, tone = 'default', className, ...props }: OpIconButtonProps) {
  return (
    <button
      {...props}
      type={props.type ?? 'button'}
      aria-label={label}
      title={label}
      className={clsx(
        'inline-flex h-8 w-8 items-center justify-center rounded-md bg-transparent p-0 shadow-none transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20',
        tone === 'danger'
          ? 'text-red-600 hover:bg-transparent hover:text-red-700 dark:text-red-400 dark:hover:text-red-300'
          : 'text-[var(--color-text-secondary)] hover:bg-transparent hover:text-[var(--color-accent)]',
        className,
      )}
    >
      {icon}
    </button>
  )
}
