interface Props {
  from?: string
  to?: string
  onChange: (values: { from?: string; to?: string }) => void
}

export function ReportsFilters({ from, to, onChange }: Props) {
  return (
    <div
      dir="rtl"
      className="flex flex-wrap items-end gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-card)] p-4"
    >
      <div className="min-w-[180px]">
        <label className="mb-1 block text-xs font-medium text-[var(--color-text-secondary)]">
          من
        </label>

        <input
          type="date"
          defaultValue={from}
          onChange={(e) =>
            onChange({
              from: e.target.value,
              to,
            })
          }
          className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] px-4 py-2.5 text-sm text-[var(--color-text-primary)] outline-none transition-colors focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-subtle)]"
        />
      </div>

      <div className="min-w-[180px]">
        <label className="mb-1 block text-xs font-medium text-[var(--color-text-secondary)]">
          إلى
        </label>

        <input
          type="date"
          defaultValue={to}
          onChange={(e) =>
            onChange({
              from,
              to: e.target.value,
            })
          }
          className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] px-4 py-2.5 text-sm text-[var(--color-text-primary)] outline-none transition-colors focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-subtle)]"
        />
      </div>

      <button
        type="button"
        onClick={() => onChange({})}
        className="rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
      >
        إعادة تعيين
      </button>
    </div>
  )
}
