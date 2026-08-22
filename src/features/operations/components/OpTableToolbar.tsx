import type { ReactNode } from 'react'
import { OpSearch } from './OpSearch'

interface OpTableToolbarProps {
  search?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
  filters?: ReactNode
  left?: ReactNode
  right?: ReactNode
}

export function OpTableToolbar({ search, onSearchChange, searchPlaceholder, filters, left, right }: OpTableToolbarProps) {
  return (
    <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
        {search !== undefined && onSearchChange && (
          <OpSearch value={search} onChange={onSearchChange} placeholder={searchPlaceholder} className="w-full sm:max-w-[420px]" />
        )}
        {filters}
        {left}
      </div>
      {right && <div className="flex shrink-0 items-center gap-2">{right}</div>}
    </div>
  )
}
