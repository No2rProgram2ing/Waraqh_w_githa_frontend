import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { showErrorToast, showSuccessToast, showValidationErrorToast } from '@/lib/toast'
import ProductPagination from '../components/ProductPagination'
import ProductTable from '../components/ProductTable'
import ProductToolbar from '../components/ProductToolbar'
import ProductFormModal from '../components/ProductFormModal'
import { useProducts, useDeleteProduct } from '../hooks/useProducts'

function ProductsPage() {
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const navigate = useNavigate()

  const { mutate: deleteProduct } = useDeleteProduct()

  const handleDelete = (productId: number) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء.')) {
      deleteProduct(productId, {
        onSuccess: () => showSuccessToast('تم حذف المنتج بنجاح'),
        onError: (error: any) => {
          const validationErrors = error?.response?.data?.errors as Record<string, string[]> | undefined
          if (validationErrors) {
            showValidationErrorToast(validationErrors)
            return
          }

          showErrorToast(error?.response?.data?.message || 'فشل في حذف المنتج، يرجى المحاولة مرة أخرى.')
        },
      })
    }
  }

  const {
    data,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useProducts({
    page: currentPage,
    search,
  })

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div dir="rtl" className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-extrabold text-[var(--color-text-primary)]">
            إدارة المنتجات
          </h1>

          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            إدارة المنتجات وحالتها بكل سهولة
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="rounded-xl bg-[#45592D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5D7243]"
        >
          + إضافة منتج
        </button>
      </div>

      {/* Products Card */}
      <section className="overflow-hidden rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface-card)]">
        <ProductToolbar
          searchValue={search}
          onSearchChange={handleSearchChange}
        />

        {isError ? (
          <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
            <p className="text-sm font-medium text-[var(--color-text-muted)]">
              تعذر تحميل المنتجات.
            </p>

            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-4 rounded-xl bg-[#45592D] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5D7243]"
            >
              إعادة المحاولة
            </button>
          </div>
        ) : (
          <>
            <ProductTable
              products={data?.data ?? []}
              isLoading={isLoading}
              onView={(productId) =>
                navigate(`/admin/products/${productId}`)
              }
              onDelete={handleDelete}
            />

            {data?.meta && (
              <ProductPagination
                currentPage={data.meta.current_page}
                lastPage={data.meta.last_page}
                total={data.meta.total}
                from={data.meta.from}
                to={data.meta.to}
                onPageChange={handlePageChange}
                disabled={isFetching}
              />
            )}
          </>
        )}
      </section>

      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}

export default ProductsPage
