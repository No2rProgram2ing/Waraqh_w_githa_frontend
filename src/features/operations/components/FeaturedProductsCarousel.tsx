import { useRef } from 'react'
import type { FeaturedProduct } from '../types/dashboard.types'
import { EmptyState } from '@/components/shared/EmptyState'
import { Card } from '@/components/ui/Card'
import { ChevronLeft, ChevronRight } from 'lucide-react'
interface Props {
  products?: FeaturedProduct[] | null
}

export function FeaturedProductsCarousel({ products }: Props) {
  const ref = useRef<HTMLDivElement | null>(null)

  if (!products) {
    return <EmptyState>جارٍ تحميل المنتجات...</EmptyState>
  }

  if (products.length === 0) {
    return <EmptyState>لا توجد منتجات مميزة حالياً.</EmptyState>
  }

  const scroll = (direction: 'left' | 'right') => {
    if (!ref.current) return

    const delta = direction === 'left' ? -300 : 300

    ref.current.scrollBy({
      left: delta,
      behavior: 'smooth',
    })
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => scroll('left')}
          aria-label="المنتجات السابقة"
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-card)] text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
        >
          <ChevronLeft size={17} aria-hidden="true" />
        </button>

        <div
          ref={ref}
          className="flex min-w-0 gap-3 overflow-x-auto py-2 scrollbar-hide"
        >
          {products.map((product) => (
            <Card
              key={product.id}
              className="min-w-[160px] max-w-[220px] shrink-0 p-3"
            >
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-24 w-full rounded-lg object-cover"
                />
              ) : (
                <div
                  className="h-24 w-full rounded-lg bg-[var(--color-surface-subtle)]"
                  aria-hidden="true"
                />
              )}

              <div className="mt-2 text-sm font-semibold text-[var(--color-text-primary)]">
                {product.name}
              </div>

              {product.price && (
                <div className="mt-1 text-xs text-[var(--color-text-muted)]">
                  {String(product.price)} ر.س
                </div>
              )}
            </Card>
          ))}
        </div>

        <button
          type="button"
          onClick={() => scroll('right')}
          aria-label="المنتجات التالية"
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-card)] text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
        >
          <ChevronRight size={17} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
