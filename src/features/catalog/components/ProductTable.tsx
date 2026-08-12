import type { Product } from '../types/product'

import { Pencil, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import ProductStatusBadge from './ProductStatusBadge'
interface ProductTableProps {
  products: Product[]
  isLoading?: boolean
  onView?: (productId: number) => void
}

function ProductTable({
  products,
  isLoading = false,
  //onView,
}: ProductTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px] text-right">
        <thead className="bg-[var(--color-surface)]">
          <tr className="border-b border-[var(--color-border)]">
            <th className="px-5 py-4 text-sm font-semibold text-[var(--color-text-secondary)]">
              المنتج
            </th>

            <th className="px-5 py-4 text-sm font-semibold text-[var(--color-text-secondary)]">
              الفئة
            </th>

            <th className="px-5 py-4 text-sm font-semibold text-[var(--color-text-secondary)]">
              السعر
            </th>

            <th className="px-5 py-4 text-sm font-semibold text-[var(--color-text-secondary)]">
              المخزون
            </th>

            <th className="px-5 py-4 text-sm font-semibold text-[var(--color-text-secondary)]">
              الحالة
            </th>

            <th className="px-5 py-4 text-sm font-semibold text-[var(--color-text-secondary)]">
              الإجراءات
            </th>
          </tr>
        </thead>

        <tbody>
          {isLoading ? (
            <tr>
              <td
                colSpan={6}
                className="px-5 py-16 text-center text-sm text-[var(--color-text-muted)]"
              >
                جاري تحميل المنتجات...
              </td>
            </tr>
          ) : products.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="px-5 py-16 text-center text-sm text-[var(--color-text-muted)]"
              >
                لا توجد منتجات لعرضها.
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr
                key={product.id}
                className="border-b border-[var(--color-border)] last:border-b-0 hover:bg-[var(--color-surface-subtle)] transition-colors"
              >
                <td className="px-5 py-4">
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                      {product.name}
                    </p>

                    <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                      {product.sku}
                    </p>
                  </div>
                </td>

                <td className="px-5 py-4 text-sm text-[var(--color-text-secondary)]">
                  {product.category?.name ?? '—'}
                </td>

                <td className="px-5 py-4 text-sm font-semibold text-[var(--color-text-primary)]">
                  {product.price}
                </td>

                <td className="px-5 py-4 text-sm text-[var(--color-text-secondary)]">
                  {product.stock_quantity}                </td>

                <td className="px-5 py-4">
                  <ProductStatusBadge
                    isActive={product.status === 'active'}
                  />
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <Link
                        to={`/admin/products/${product.id}/edit`}
                        aria-label={`تعديل ${product.name}`}
                        title="تعديل المنتج"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[#45592D] transition hover:bg-[var(--color-accent-subtle)] hover:text-[#5D7243]"
                      >
                        <Pencil
                          size={17}
                          strokeWidth={1.8}
                          aria-hidden="true"
                        />
                      </Link>

                    <button
                      type="button"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[var(--color-danger)] transition hover:bg-[var(--color-danger-subtle)] hover:text-[#8C382A]"
                      aria-label="حذف المنتج"
                      title="حذف المنتج"
                    >
                      <Trash2 size={17} aria-hidden="true" />
                    </button>
                  </div>
                  
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default ProductTable