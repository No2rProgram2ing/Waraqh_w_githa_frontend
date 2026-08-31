import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingBagIcon } from '@/components/ui/icons'
import { AccountLayout } from '@/layouts/AccountLayout'
import { useSearchProducts, useSearchCategories } from '@/features/search/hooks/useSearchProducts'
import type { SearchFiltersDTO } from '@/api/search'
import type { Product } from '@/features/catalog/types/product'
import { getProductImage } from '@/features/products/data/productImages'

const SKELETON_COUNT = 6

function formatPrice(price: string | number) {
  const num = typeof price === 'string' ? Number(price) : price
  if (Number.isNaN(num)) return price
  return num.toLocaleString('ar-SA')
}

export function SearchPage() {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState(query)
  const [filters, setFilters] = useState<SearchFiltersDTO>({ page: 1, per_page: 12 })

  // Debounce input (300ms)
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 300)
    return () => clearTimeout(t)
  }, [query])

  useEffect(() => {
    setFilters((prev) => ({ ...prev, q: debouncedQuery, page: 1 }))
  }, [debouncedQuery])

  // Use the existing hooks
  const productsQuery = useSearchProducts(filters)
  const categoriesQuery = useSearchCategories()

  const products: Product[] = useMemo(() => productsQuery.data?.data ?? [], [productsQuery.data])
  const total = productsQuery.data?.meta?.total ?? products.length

  const suggestedTerms = useMemo(() => {
    if (categoriesQuery.data?.data) return categoriesQuery.data.data.slice(0, 6).map((c: any) => c.name)
    return ['خيزران', 'ديكور', 'سلة', 'مصباح', 'طاولة', 'تراث']
  }, [categoriesQuery.data])

  return (
    <AccountLayout hideSidebar>
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="flex flex-col gap-6"
        dir="rtl"
      >
        <div className="rounded-[24px] border border-[#e3ddd5] bg-[#f8f4f0] p-4 shadow-[0_8px_22px_-18px_rgba(38,47,26,0.2)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 items-center gap-3 rounded-2xl border border-[#d7cec2] bg-white px-4 py-3">
              <span className="text-[#5e634f]">⌕</span>
              <input
                aria-label="ابحث في المنتجات"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ابحث عن منتج أو فئة..."
                className="w-full border-0 bg-transparent text-right text-[15px] text-[#20251f] placeholder:text-[#7f827b] focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={() => setDebouncedQuery(query)}
              className="rounded-xl bg-[#4f5f3d] px-5 py-3 text-sm font-bold text-white shadow-[0_12px_18px_-12px_rgba(79,95,61,0.8)] hover:bg-[#45593a]"
            >
              بحث
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {suggestedTerms.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => setQuery(term)}
                className="rounded-full border border-[#d9d1c6] bg-white px-3 py-1.5 text-[12px] text-[#4a5149] transition-colors hover:bg-[#f0e9e1]"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <h1 className="text-[28px] font-extrabold text-[#1d2218]">نتائج البحث</h1>
          <span className="rounded-full border border-[#dacfbf] bg-[#f3efe9] px-3 py-1.5 text-[12px] font-medium text-[#4f5f3d]">
            {productsQuery.isLoading ? '...' : `${total} نتائج`}
          </span>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {productsQuery.isLoading &&
            Array.from({ length: SKELETON_COUNT }).map((_, index) => (
              <motion.article
                key={`s-${index}`}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.03, ease: 'easeOut' }}
                className="animate-pulse overflow-hidden rounded-[20px] border border-[#e9e0d5] bg-[#f6f1ea] p-6"
              >
                <div className="mb-4 h-48 w-full rounded bg-[#e6e0d6]" />
                <div className="h-4 w-3/4 rounded bg-[#e6e0d6] mb-2" />
                <div className="h-3 w-1/2 rounded bg-[#e6e0d6]" />
              </motion.article>
            ))}

          {!productsQuery.isLoading && products.length === 0 && (
            <div className="col-span-full rounded-[20px] border border-[#e9e0d5] bg-[#fff7f4] p-6 text-center text-[#6b6b66]">
              لا توجد نتائج تطابق بحثك
            </div>
          )}

          {!productsQuery.isLoading &&
            products.map((item, index) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.06, ease: 'easeOut' }}
                className="group overflow-hidden rounded-[20px] border border-[#e9e0d5] bg-[#f6f1ea] shadow-[0_10px_20px_-18px_rgba(38,47,26,0.25)]"
              >
                <img
                  src={getProductImage(item.id)}
                  alt={item.name}
                  className="h-60 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />

                <div className="space-y-3 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-[#eef2e8] px-2 py-1 text-[9px] font-medium text-[#4d6340]">
                      {item.status === 'active' ? 'متوفر' : 'غير متوفر'}
                    </span>
                    <span className="text-[11px] text-[#7a7b75]">{item.category?.name ?? ''}</span>
                  </div>

                  <p className="text-[16px] font-bold text-[#1c211b]">{item.name}</p>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[17px] font-extrabold text-[#1d2218]">
                      {formatPrice(item.price)} ر.س
                    </span>
                    <button
                      type="button"
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-[#4f5f3d] text-white shadow-[0_12px_18px_-12px_rgba(79,95,61,0.8)] transition-transform duration-200 hover:scale-105"
                      aria-label={`إضافة ${item.name} إلى السلة`}
                    >
                      <ShoppingBagIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
        </div>
      </motion.section>
    </AccountLayout>
  )
}
