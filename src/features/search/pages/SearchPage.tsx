import { motion } from 'framer-motion'
import { ShoppingBagIcon } from '@/components/ui/icons'
import { AccountLayout } from '@/layouts/AccountLayout'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

const results = [
  {
    id: 'sr-1',
    name: 'سلة يدوية مزخرفة',
    price: 390,
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'سلة يدوية مزخرفة',
    category: 'ديكور منزلي',
    tag: 'مميز',
  },
  {
    id: 'sr-2',
    name: 'طاولة خشبية فاخرة',
    price: 540,
    image:
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'طاولة خشبية فاخرة',
    category: 'أثاث',
    tag: 'جديد',
  },
  {
    id: 'sr-3',
    name: 'مقعد خيزران عربي',
    price: 480,
    image:
      'https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'مقعد خيزران عربي',
    category: 'مفروشات',
    tag: 'حصري',
  },
  {
    id: 'sr-4',
    name: 'مصباح خشبي أنيق',
    price: 425,
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'مصباح خشبي أنيق',
    category: 'إضاءة',
    tag: 'شائع',
  },
  {
    id: 'sr-5',
    name: 'مجموعة أقمشة فاخرة',
    price: 620,
    image:
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'مجموعة أقمشة فاخرة',
    category: 'ديكور',
    tag: 'أفضل قيمة',
  },
  {
    id: 'sr-6',
    name: 'سلة نخل ريفية',
    price: 570,
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'سلة نخل ريفية',
    category: 'استوديو',
    tag: 'مميز',
  },
]

const suggestedTerms = [
  'خيزران',
  'ديكور',
  'سلة',
  'مصباح',
  'طاولة',
  'تراث',
]

export function SearchPage() {
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
        <Card className="p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] px-4 py-3">
              <span
                className="text-lg text-[var(--color-text-muted)]"
                aria-hidden="true"
              >
                ⌕
              </span>

              <input
                aria-label="ابحث في المنتجات"
                defaultValue="سلة"
                className="w-full border-0 bg-transparent text-right text-[15px] text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-faint)]"
              />
            </div>

            <Button type="button">
              بحث
            </Button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {suggestedTerms.map((term) => (
              <button
                key={term}
                type="button"
                className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface-card)] px-3 py-1.5 text-xs text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
              >
                {term}
              </button>
            ))}
          </div>
        </Card>

        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-extrabold text-[var(--color-text-primary)] sm:text-[28px]">
            نتائج البحث
          </h1>

          <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-accent-subtle)] px-3 py-1.5 text-xs font-medium text-[var(--color-accent)]">
            {results.length} نتائج
          </span>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {results.map((item, index) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.06,
                ease: 'easeOut',
              }}
              className="group overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-card)] shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="overflow-hidden bg-[var(--color-surface-subtle)]">
                <img
                  src={item.image}
                  alt={item.imageAlt}
                  className="h-60 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>

              <div className="space-y-3 p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-[var(--color-accent-subtle)] px-2 py-1 text-[10px] font-medium text-[var(--color-accent)]">
                    {item.tag}
                  </span>

                  <span className="text-xs text-[var(--color-text-muted)]">
                    {item.category}
                  </span>
                </div>

                <p className="text-base font-bold text-[var(--color-text-primary)]">
                  {item.name}
                </p>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-[17px] font-extrabold text-[var(--color-text-primary)]">
                    {item.price.toLocaleString('ar-SA')} ر.س
                  </span>

                  <button
                    type="button"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-accent)] text-white transition-all duration-200 hover:bg-[var(--color-accent-hover)] hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
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