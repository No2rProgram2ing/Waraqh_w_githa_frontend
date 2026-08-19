import { useRef } from 'react'
import type { FeaturedProduct } from '../types/dashboard.types'
import { ChevronLeft, ChevronRight, Package } from 'lucide-react'

interface Props {
  products?: FeaturedProduct[] | null
}

export function FeaturedProductsCarousel({ products }: Props) {
  const ref = useRef<HTMLDivElement | null>(null)

  const scroll = (dir: 'left' | 'right') => {
    if (!ref.current) return
    // Scroll distance based on approximate card width + gap
    ref.current.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' })
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface-card)] shadow-sm lg:col-span-2 xl:col-span-5">
      {/* Card Header with Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--color-border)] px-5 py-4">
        <div>
          <h2 className="text-sm font-bold text-[var(--color-text-primary)]">
            المنتجات المميزة
          </h2>
          <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
            أحدث المنتجات في الكتالوج
          </p>
        </div>
        
        {products && products.length > 0 && (
          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={() => scroll('right')}
              aria-label="تمرير لليمين"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] transition hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-text-primary)]"
            >
              <ChevronRight size={16} aria-hidden="true" />
            </button>
            <button
              onClick={() => scroll('left')}
              aria-label="تمرير لليسار"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] transition hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-text-primary)]"
            >
              <ChevronLeft size={16} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      {/* Carousel Body */}
      <div className="p-4">
        {!products ? (
          <div className="flex h-32 items-center justify-center">
            <p className="text-sm text-[var(--color-text-muted)]">جارٍ تحميل المنتجات...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="flex h-32 flex-col items-center justify-center text-center">
            <Package size={28} className="mb-2 text-[var(--color-text-muted)]" aria-hidden="true" />
            <p className="text-sm text-[var(--color-text-muted)]">لا توجد منتجات مميزة حالياً</p>
          </div>
        ) : (
          <div
            ref={ref}
            className="flex gap-4 overflow-x-auto scroll-smooth pb-2 snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none' }}
          >
            {products.map((p) => (
              <article
                key={p.id}
                className="group flex w-[160px] shrink-0 snap-start flex-col rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface-card)] p-3 shadow-sm transition hover:border-[#45592D]/40 hover:shadow-md sm:w-[180px] md:w-[200px]"
              >
                {/* Product image */}
                {p.image ? (
                  <div className="aspect-[4/3] w-full overflow-hidden rounded-[12px]">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-[4/3] w-full items-center justify-center rounded-[12px] bg-[var(--color-surface-subtle)]">
                    <Package size={24} className="text-[var(--color-text-muted)]" aria-hidden="true" />
                  </div>
                )}

                {/* Product info */}
                <div className="mt-3 flex flex-1 flex-col justify-between text-right">
                  <p className="line-clamp-1 text-sm font-semibold text-[var(--color-text-primary)]" title={p.name}>
                    {p.name}
                  </p>
                  {p.price && (
                    <p className="mt-1 text-sm font-bold text-[#45592D]">
                      {Number(p.price).toLocaleString('ar-SA')}
                      <span className="mr-1 text-xs font-normal text-[var(--color-text-muted)]">ر.س</span>
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
