import type { ReactNode } from 'react'
import { X } from 'lucide-react'

interface OpModalProps {
  open: boolean
  title: string
  description?: string
  children: ReactNode
  onClose: () => void
  maxWidth?: string
}

export function OpModal({ open, title, description, children, onClose, maxWidth = 'max-w-[620px]' }: OpModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" dir="rtl" role="dialog" aria-modal="true" aria-label={title}>
      <button type="button" className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" onClick={onClose} aria-label="إغلاق النافذة" />
      <div className={`relative z-10 max-h-[90vh] w-full ${maxWidth} overflow-y-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-card)] shadow-2xl`}>
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-[var(--color-border)] bg-[var(--color-surface-card)] px-5 py-4">
          <div>
            <h2 className="text-lg font-extrabold text-[var(--color-text-primary)]">{title}</h2>
            {description && <p className="mt-1 text-xs leading-5 text-[var(--color-text-muted)]">{description}</p>}
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-[var(--color-text-muted)] transition hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-text-primary)]" aria-label="إغلاق">
            <X size={20} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}
