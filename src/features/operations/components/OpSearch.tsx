import { Search } from 'lucide-react'

interface OpSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function OpSearch({ value, onChange, placeholder = 'بحث...', className = '' }: OpSearchProps) {
  return (
    <div className={`relative min-w-0 flex-1 ${className}`}>
      <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] py-2.5 pl-4 pr-10 text-sm text-[var(--color-text-primary)] outline-none transition placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/10"
        aria-label={placeholder}
      />
    </div>
  )
}
