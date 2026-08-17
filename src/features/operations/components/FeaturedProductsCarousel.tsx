import { useRef } from 'react'
import type { FeaturedProduct } from '../types/dashboard.types'

interface Props {
  products?: FeaturedProduct[] | null
}

export function FeaturedProductsCarousel({ products }: Props) {
  const ref = useRef<HTMLDivElement | null>(null)

  if (!products) {
    return <div className="p-4">جارٍ تحميل المنتجات...</div>
  }

  if (products.length === 0) {
    return <div className="p-4">لا توجد منتجات مميزة حالياً.</div>
  }

  const scroll = (dir: 'left' | 'right') => {
    if (!ref.current) return
    const delta = dir === 'left' ? -300 : 300
    ref.current.scrollBy({ left: delta, behavior: 'smooth' })
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2 overflow-hidden">
        <button onClick={() => scroll('left')} className="px-2 py-2 rounded-md bg-white/80 shadow">◀</button>
        <div ref={ref} className="flex gap-3 overflow-x-auto py-2 scrollbar-hide">
          {products.map((p) => (
            <article key={p.id} className="min-w-[160px] max-w-[220px] rounded-xl border bg-white p-3 text-right shadow-sm">
              {p.image ? (
                <img src={p.image} alt={p.name} className="h-24 w-full object-cover rounded-md" />
              ) : (
                <div className="h-24 w-full rounded-md bg-[#f1f1ea]" />
              )}
              <div className="mt-2 text-sm font-semibold">{p.name}</div>
              {p.price && <div className="text-xs text-[#6d6d6d]">{String(p.price)} ر.س</div>}
            </article>
          ))}
        </div>
        <button onClick={() => scroll('right')} className="px-2 py-2 rounded-md bg-white/80 shadow">▶</button>
      </div>
    </div>
  )
}
