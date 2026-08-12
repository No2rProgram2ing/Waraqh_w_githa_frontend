import { Link, useParams } from 'react-router-dom'

import { useProduct } from '../hooks/useProduct'

function ProductDetailsPage() {
    const { productId } = useParams<{ productId: string }>()

    const id = Number(productId)

    const {
        data: product,
        isLoading,
        isError,
        refetch,
    } = useProduct(id)

    if (isLoading) {
        return (
        <div dir="rtl" className="space-y-6">
            <div>
            <h1 className="text-[28px] font-extrabold text-[var(--color-text-primary)]">
                تفاصيل المنتج
            </h1>

            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                جاري تحميل بيانات المنتج...
            </p>
            </div>
        </div>
        )
    }

    if (isError || !product) {
        return (
        <div dir="rtl" className="space-y-6">
            <div>
            <h1 className="text-[28px] font-extrabold text-[var(--color-text-primary)]">
                تعذر تحميل المنتج
            </h1>

            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                حدث خطأ أثناء تحميل بيانات المنتج.
            </p>
            </div>

            <div className="flex items-center gap-3">
            <button
                type="button"
                onClick={() => void refetch()}
                className="rounded-xl bg-[#45592D] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5D7243]"
            >
                إعادة المحاولة
            </button>

            <Link
                to="/admin/products"
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] px-4 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] transition hover:bg-[var(--color-surface)]"
            >
                العودة للمنتجات
            </Link>
            </div>
        </div>
        )
    }

    return (
        <div dir="rtl" className="space-y-6">
        <div className="flex items-center justify-between">
            <div>
            <h1 className="text-[28px] font-extrabold text-[var(--color-text-primary)]">
                {product.name}
            </h1>

            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                تفاصيل المنتج ومعلوماته
            </p>
            </div>

            <Link
            to="/admin/products"
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] px-4 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] transition hover:bg-[var(--color-surface)]"
            >
            العودة للمنتجات
            </Link>
        </div>

        <section className="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface-card)] p-6">
            <div className="grid gap-6 sm:grid-cols-2">
            <div>
                <p className="text-xs text-[var(--color-text-muted)]">
                اسم المنتج
                </p>

                <p className="mt-1 text-sm font-semibold text-[var(--color-text-primary)]">
                {product.name}
                </p>
            </div>

            <div>
                <p className="text-xs text-[var(--color-text-muted)]">
                SKU
                </p>

                <p className="mt-1 text-sm font-semibold text-[var(--color-text-primary)]">
                {product.sku}
                </p>
            </div>

            <div>
                <p className="text-xs text-[var(--color-text-muted)]">
                الفئة
                </p>

                <p className="mt-1 text-sm font-semibold text-[var(--color-text-primary)]">
                {product.category?.name ?? '—'}
                </p>
            </div>

            <div>
                <p className="text-xs text-[var(--color-text-muted)]">
                السعر
                </p>

                <p className="mt-1 text-sm font-semibold text-[var(--color-text-primary)]">
                {product.price}
                </p>
            </div>

            <div>
                <p className="text-xs text-[var(--color-text-muted)]">
                المخزون
                </p>

                <p className="mt-1 text-sm font-semibold text-[var(--color-text-primary)]">
                {product.stock_quantity}                </p>
            </div>

            <div>
                <p className="text-xs text-[var(--color-text-muted)]">
                الحالة
                </p>

                <p className="mt-1 text-sm font-semibold text-[var(--color-text-primary)]">
                {product.status === 'active'
                    ? 'نشط'
                    : 'غير نشط'}
                </p>
            </div>
            </div>

            {product.description && (
            <div className="mt-6 border-t border-[#EBE1E7] pt-6">
                <p className="text-xs text-[var(--color-text-muted)]">
                الوصف
                </p>

                <p className="mt-2 text-sm leading-7 text-[var(--color-text-secondary)]">
                {product.description}
                </p>
            </div>
            )}
            {product.media && product.media.length > 0 && (
            <div className="mt-6 border-t border-[var(--color-border)] pt-6">
                <div className="mb-4">
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                    الوسائط
                </p>

                <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                    صور وفيديوهات المنتج
                </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {product.media
                    .slice()
                    .sort((a, b) => a.sort_order - b.sort_order)
                    .map((media) => (
                    <div
                        key={media.id}
                        className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]"
                    >
                        {media.media_type === 'image' ? (
                        <img
                            src={media.url}
                            alt={product.name}
                            className="aspect-square w-full object-cover"
                        />
                        ) : (
                        <video
                            src={media.url}
                            controls
                            className="aspect-square w-full object-cover"
                        />
                        )}

                        {media.is_primary && (
                        <div className="px-3 py-2">
                            <span className="inline-flex rounded-full bg-[var(--color-accent-subtle)] px-2.5 py-1 text-xs font-semibold text-[#45592D]">
                            الصورة الرئيسية
                            </span>
                        </div>
                        )}
                    </div>
                    ))}
                </div>
            </div>
            )}
        </section>
        </div>
    )
}

export default ProductDetailsPage