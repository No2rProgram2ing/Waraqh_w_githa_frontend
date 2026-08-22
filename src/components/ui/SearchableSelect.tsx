import { useState, useEffect, useRef, useId, useMemo } from 'react'
import { ChevronDown, Search, X, Loader2 } from 'lucide-react'
import { clsx } from 'clsx'
import { useDebounce } from '../../hooks/useDebounce'

export interface SelectOption {
  id: number | string
  label: string
  sublabel?: string
  disabled?: boolean
}

export interface SearchableSelectProps {
  label: string
  value?: number | string | null
  onChange: (value: number | string | null) => void
  options: SelectOption[]
  onSearch?: (query: string) => void
  placeholder?: string
  disabled?: boolean
  loading?: boolean
  error?: string
  hint?: string
  emptyMessage?: string
  clearable?: boolean
  className?: string
  id?: string
}

export function SearchableSelect({
  label,
  value,
  onChange,
  options,
  onSearch,
  placeholder = 'اختر...',
  disabled = false,
  loading = false,
  error,
  hint,
  emptyMessage = 'لا توجد نتائج',
  clearable = true,
  className,
  id,
}: SearchableSelectProps) {
  const generatedId = useId()
  const selectId = id ?? generatedId
  const errorId = `${selectId}-error`
  const hintId = `${selectId}-hint`

  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearch = useDebounce(searchQuery, 300)
  
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listboxRef = useRef<HTMLUListElement>(null)

  const [activeIndex, setActiveIndex] = useState(-1)

  const selectedOption = useMemo(() => options.find((opt) => opt.id === value), [options, value])

  // Call onSearch when debounced string changes
  useEffect(() => {
    if (onSearch) {
      onSearch(debouncedSearch)
    }
  }, [debouncedSearch, onSearch])

  // Reset search and active index when closed
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('')
      setActiveIndex(-1)
    } else {
      // Focus input when opened
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus()
      }, 0)
    }
  }, [isOpen])

  // Click outside to close
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return

    switch (e.key) {
      case 'Enter':
        e.preventDefault()
        if (isOpen && activeIndex >= 0 && activeIndex < options.length) {
          const opt = options[activeIndex]
          if (!opt.disabled) {
            onChange(opt.id)
            setIsOpen(false)
          }
        } else if (!isOpen) {
          setIsOpen(true)
        }
        break
      case 'ArrowDown':
        e.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
        } else {
          setActiveIndex((prev) => (prev < options.length - 1 ? prev + 1 : prev))
          scrollActiveIntoView(activeIndex + 1)
        }
        break
      case 'ArrowUp':
        e.preventDefault()
        if (isOpen) {
          setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0))
          scrollActiveIntoView(activeIndex - 1)
        }
        break
      case 'Escape':
        e.preventDefault()
        setIsOpen(false)
        break
      case 'Tab':
        setIsOpen(false)
        break
    }
  }

  const scrollActiveIntoView = (index: number) => {
    if (listboxRef.current && index >= 0 && index < options.length) {
      const activeEl = listboxRef.current.children[index] as HTMLElement
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' })
      }
    }
  }

  const handleSelect = (opt: SelectOption) => {
    if (opt.disabled) return
    onChange(opt.id)
    setIsOpen(false)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!disabled) {
      onChange(null)
      if (onSearch) onSearch('')
    }
  }

  return (
    <div className={clsx('flex flex-col gap-2', className)} ref={containerRef}>
      <label htmlFor={selectId} className="text-sm font-medium text-brand-ink text-[var(--color-text-secondary)]">
        {label}
      </label>

      <div className="relative">
        <div
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls={`${selectId}-listbox`}
          aria-owns={`${selectId}-listbox`}
          tabIndex={disabled ? -1 : 0}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          className={clsx(
            'flex w-full items-center justify-between rounded-xl border bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none transition cursor-pointer',
            disabled ? 'opacity-50 cursor-not-allowed bg-brand-cream/50' : 'hover:border-[var(--color-accent)]',
            error ? 'border-red-400 focus:border-red-500' : isOpen ? 'border-[var(--color-accent)] shadow-md shadow-[var(--color-accent)]/5' : 'border-[var(--color-border)]'
          )}
        >
          <span className={clsx('truncate', !selectedOption && 'text-brand-muted text-[var(--color-text-muted)]')}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>

          <div className="flex items-center gap-2">
            {clearable && selectedOption && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="text-brand-muted hover:text-red-500 text-[var(--color-text-muted)] p-1 rounded hover:bg-[var(--color-surface-subtle)]"
                aria-label="مسح الاختيار"
              >
                <X size={14} />
              </button>
            )}
            <ChevronDown
              size={16}
              className={clsx('text-brand-muted text-[var(--color-text-muted)] transition-transform', isOpen && 'rotate-180')}
            />
          </div>
        </div>

        {isOpen && (
          <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg shadow-black/5 flex flex-col">
            <div className="flex items-center gap-2 border-b border-[var(--color-border)] px-3 py-2 bg-[var(--color-surface-subtle)]">
              <Search size={16} className="text-[var(--color-text-muted)]" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="ابحث..."
                className="w-full bg-transparent text-sm outline-none text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]"
              />
              {loading && <Loader2 size={16} className="animate-spin text-[var(--color-accent)]" />}
            </div>

            <ul
              id={`${selectId}-listbox`}
              ref={listboxRef}
              role="listbox"
              className="flex-1 overflow-y-auto py-1"
            >
              {options.length === 0 && !loading ? (
                <li className="px-4 py-3 text-center text-sm text-[var(--color-text-muted)]">
                  {emptyMessage}
                </li>
              ) : (
                options.map((opt, index) => (
                  <li
                    key={opt.id}
                    role="option"
                    aria-selected={opt.id === value}
                    onClick={() => handleSelect(opt)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={clsx(
                      'flex flex-col px-4 py-2 text-sm cursor-pointer transition',
                      activeIndex === index && 'bg-[var(--color-surface-subtle)]',
                      opt.id === value && 'font-semibold text-[var(--color-accent)]',
                      opt.disabled && 'opacity-50 cursor-not-allowed',
                      !opt.disabled && activeIndex !== index && 'hover:bg-[var(--color-surface-subtle)]'
                    )}
                  >
                    <span>{opt.label}</span>
                    {opt.sublabel && (
                      <span className="text-xs font-normal text-[var(--color-text-muted)] mt-0.5">
                        {opt.sublabel}
                      </span>
                    )}
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>

      {error ? (
        <p id={errorId} role="alert" className="text-sm text-red-500 mt-1">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-sm text-[var(--color-text-muted)] mt-1">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
