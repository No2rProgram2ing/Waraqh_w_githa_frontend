import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { AccountLayout } from '@/layouts/AccountLayout'
import { useSearchProducts, useSearchCategories } from '@/features/search/hooks/useSearchProducts'
import type { SearchFiltersDTO } from '@/api/search'
import type { Product } from '@/features/catalog/types/product'
import { ProductCard } from '@/features/products/components/ProductCard'
import { getProductImage } from '@/features/products/data/productImages'

const SKELETON_COUNT = 6

function formatPrice(price: string | number) {
  const num = typeof price === 'string' ? Number(price) : price
  if (Number.isNaN(num)) return price
  return num.toLocaleString('ar-SA')
}

function normalizeImageUrl(value: unknown): string | null {
  if (typeof value !== 'string' || !value.trim()) return null

  const imageUrl = value.trim()
  if (/^(https?:|data:|blob:)/i.test(imageUrl)) return imageUrl

  const configuredApiBase = String(import.meta.env.VITE_API_BASE_URL ?? '').trim().replace(/\/+$/, '')
  const apiOrigin = configuredApiBase.replace(/\/api(?:\/v\d+)?$/i, '')
  const normalizedPath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`

  return apiOrigin ? `${apiOrigin}${normalizedPath}` : normalizedPath
}

function getSearchProductImage(item: Record<string, unknown>, productId: string): string {
  const directImage = [
    item.image_url,
    item.image,
    item.imageUrl,
    item.thumbnail,
    item.cover,
  ]
    .map(normalizeImageUrl)
    .find(Boolean)

  if (directImage) return directImage

  const media = Array.isArray(item.media) ? item.media : []
  const images = Array.isArray(item.images) ? item.images : []
  const mediaCandidates = [...media, ...images]

  for (const candidate of mediaCandidates) {
    const imageUrl = normalizeImageUrl(
      typeof candidate === 'string'
        ? candidate
        : candidate && typeof candidate === 'object'
          ? (candidate as Record<string, unknown>).url ??
            (candidate as Record<string, unknown>).image_url ??
            (candidate as Record<string, unknown>).image ??
            (candidate as Record<string, unknown>).path
          : null,
    )
    if (imageUrl) return imageUrl
  }

  return getProductImage(productId)
}

export function SearchPage() {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [filters, setFilters] = useState<SearchFiltersDTO>({ page: 1, per_page: 12 })

  const productsQuery = useSearchProducts(filters)
  const categoriesQuery = useSearchCategories()

  const applySearch = (nextValue: string) => {
    const normalized = nextValue.trim()
    setQuery(normalized)
    setDebouncedQuery(normalized)
    
    const categories = categoriesQuery.data?.data ?? []
    const matchedCategory = categories.find((c: any) => c.name === normalized)

    setFilters((prev) => ({ 
      ...prev, 
      q: matchedCategory ? undefined : (normalized || undefined),
      category_id: matchedCategory ? matchedCategory.id : undefined,
      page: 1 
    }))
  }

  useEffect(() => {
    const t = setTimeout(() => {
      const normalized = query.trim()
      setDebouncedQuery(normalized)
      
      const categories = categoriesQuery.data?.data ?? []
      const matchedCategory = categories.find((c: any) => c.name === normalized)

      setFilters((prev) => ({ 
        ...prev, 
        q: matchedCategory ? undefined : (normalized || undefined),
        category_id: matchedCategory ? matchedCategory.id : undefined,
        page: 1 
      }))
    }, 300)

    return () => clearTimeout(t)
  }, [query, categoriesQuery.data])

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
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    applySearch(query)
                  }
                }}
                placeholder="ابحث عن منتج أو فئة..."
                className="w-full border-0 bg-transparent text-right text-[15px] text-[#20251f] placeholder:text-[#7f827b] focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={() => applySearch(query)}
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
                onClick={() => applySearch(term)}
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
            products.map((item, index) => {
              const productId = String(item.id)
              const normalizedProduct = {
                id: productId,
                name: item.name,
                subtitle: item.description ?? item.category?.name ?? 'منتج',
                description: item.description ?? '',
                price: Number(item.price ?? 0),
                image: getSearchProductImage(item as unknown as Record<string, unknown>, productId),
                imageAlt: item.name,
                rating: 4.8,
                badge: item.status === 'active' ? 'متوفر' : 'غير متوفر',
                categoryName: item.category?.name ?? '',
                inStock: item.status === 'active',
                stock_quantity: item.stock_quantity,
                available_stock: item.available_stock ?? item.stock_quantity,
                is_favorited: false,
              };

              return (
                <ProductCard
                  key={item.id}
                  product={normalizedProduct as any}
                  index={index}
                  featured={index < 3}
                />
              );
            })}
        </div>
      </motion.section>
    </AccountLayout>
  )
}
