    import { useEffect, useState } from 'react'
    import { Link, useNavigate, useParams } from 'react-router-dom'
    //import { Pencil, Star, Trash2, X } from 'lucide-react'
    import { useQueryClient } from '@tanstack/react-query'

    import { useProduct } from '../hooks/useProduct'
    import {
    useUpdateProduct,
    type UpdateProductData,
    } from '../hooks/useUpdateProduct'
    import MediaUploader from '../components/media/MediaUploader'
    import MediaGallery from '../components/media/MediaGallery'

    function ProductEditPage() {
    const { productId } = useParams<{ productId: string }>()
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const id = Number(productId)

    const {
        data: product,
        isLoading,
        isError,
        refetch,
    } = useProduct(id)

    const updateProduct = useUpdateProduct()
    const [form, setForm] = useState<UpdateProductData>({
        name: '',
        sku: '',
        description: null,
        price: '',
        stock_quantity: 0,
        status: 'active',
        is_customizable: false,
        category_id: 0,
    })

    useEffect(() => {
        if (!product) {
        return
        }

        setForm({
        name: product.name,
        sku: product.sku,
        description: product.description,
        price: product.price,
        stock_quantity: product.stock_quantity,
        status: product.status,
        is_customizable: product.is_customizable,
        category_id: product.category?.id ?? 0,
        })
    }, [product])

    const handleChange = (
        field: keyof UpdateProductData,
        value: string | number | boolean | null,
    ) => {
        setForm((previous) => ({
        ...previous,
        [field]: value,
        }))
    }

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault()

        try {
        await updateProduct.mutateAsync({
            id,
            data: form,
        })

        await queryClient.invalidateQueries({
            queryKey: ['admin', 'product', id],
        })

        await queryClient.invalidateQueries({
            queryKey: ['admin', 'products'],
        })

        navigate(`/admin/products/${id}`)
        } catch {
        // Error is displayed through updateProduct.isError.
        }
    }

    // Media management logic is now inside MediaUploader and MediaGallery components.

    if (isLoading) {
        return (
        <div dir="rtl" className="space-y-6">
            <div>
            <h1 className="text-[28px] font-extrabold text-[var(--color-text-primary)]">
                تعديل المنتج
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
                تعديل المنتج
            </h1>

            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                تعديل بيانات المنتج ووسائطه
            </p>
            </div>

            <Link
            to={`/admin/products/${id}`}
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] px-4 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] transition hover:bg-[var(--color-surface)]"
            >
            العودة للتفاصيل
            </Link>
        </div>

        {/* Product Information */}
        <section className="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface-card)] p-6">
            <form
            onSubmit={handleSubmit}
            className="space-y-6"
            >
            <div className="grid gap-5 sm:grid-cols-2">
                <div>
                <label
                    htmlFor="product-name"
                    className="text-sm font-medium text-[var(--color-text-secondary)]"
                >
                    اسم المنتج
                </label>

                <input
                    id="product-name"
                    type="text"
                    value={form.name}
                    onChange={(event) =>
                    handleChange(
                        'name',
                        event.target.value,
                    )
                    }
                    className="mt-2 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[#45592D]"
                />
                </div>

                <div>
                <label
                    htmlFor="product-sku"
                    className="text-sm font-medium text-[var(--color-text-secondary)]"
                >
                    SKU
                </label>

                <input
                    id="product-sku"
                    type="text"
                    value={form.sku}
                    onChange={(event) =>
                    handleChange(
                        'sku',
                        event.target.value,
                    )
                    }
                    className="mt-2 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[#45592D]"
                />
                </div>

                <div>
                <label
                    htmlFor="product-price"
                    className="text-sm font-medium text-[var(--color-text-secondary)]"
                >
                    السعر
                </label>

                <input
                    id="product-price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.price}
                    onChange={(event) =>
                    handleChange(
                        'price',
                        event.target.value,
                    )
                    }
                    className="mt-2 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[#45592D]"
                />
                </div>

                <div>
                <label
                    htmlFor="product-stock"
                    className="text-sm font-medium text-[var(--color-text-secondary)]"
                >
                    المخزون
                </label>

                <input
                    id="product-stock"
                    type="number"
                    min="0"
                    value={form.stock_quantity}
                    onChange={(event) =>
                    handleChange(
                        'stock_quantity',
                        Number(event.target.value),
                    )
                    }
                    className="mt-2 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[#45592D]"
                />
                </div>

                <div>
                <label
                    htmlFor="product-status"
                    className="text-sm font-medium text-[var(--color-text-secondary)]"
                >
                    الحالة
                </label>

                <select
                    id="product-status"
                    value={form.status}
                    onChange={(event) =>
                    handleChange(
                        'status',
                        event.target.value as UpdateProductData['status'],
                    )
                    }
                    className="mt-2 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[#45592D]"
                >
                    <option value="active">
                    نشط
                    </option>

                    <option value="inactive">
                    غير نشط
                    </option>
                </select>
                </div>

                <div>
                <label
                    htmlFor="product-category"
                    className="text-sm font-medium text-[var(--color-text-secondary)]"
                >
                    رقم الفئة
                </label>

                <input
                    id="product-category"
                    type="number"
                    min="1"
                    value={form.category_id}
                    onChange={(event) =>
                    handleChange(
                        'category_id',
                        Number(event.target.value),
                    )
                    }
                    className="mt-2 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[#45592D]"
                />
                </div>
            </div>

            <div>
                <label
                htmlFor="product-description"
                className="text-sm font-medium text-[var(--color-text-secondary)]"
                >
                الوصف
                </label>

                <textarea
                id="product-description"
                rows={5}
                value={form.description ?? ''}
                onChange={(event) =>
                    handleChange(
                    'description',
                    event.target.value || null,
                    )
                }
                className="mt-2 w-full resize-none rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm leading-7 text-[var(--color-text-primary)] outline-none transition focus:border-[#45592D]"
                />
            </div>

            <label className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)]">
                <input
                type="checkbox"
                checked={form.is_customizable}
                onChange={(event) =>
                    handleChange(
                    'is_customizable',
                    event.target.checked,
                    )
                }
                className="h-4 w-4 accent-[#45592D]"
                />

                المنتج قابل للتخصيص
            </label>

            {updateProduct.isError && (
                <p className="rounded-xl bg-[#FDF0ED] px-4 py-3 text-sm text-[#A44938]">
                تعذر تحديث المنتج. يرجى التحقق من البيانات والمحاولة مرة أخرى.
                </p>
            )}

            <div className="flex items-center gap-3 border-t border-[#EBE1E7] pt-6">
                <button
                type="submit"
                disabled={updateProduct.isPending}
                className="rounded-xl bg-[#45592D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5D7243] disabled:cursor-not-allowed disabled:opacity-50"
                >
                {updateProduct.isPending
                    ? 'جاري الحفظ...'
                    : 'حفظ التعديلات'}
                </button>

                <Link
                to={`/admin/products/${id}`}
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] px-5 py-3 text-sm font-medium text-[var(--color-text-secondary)] transition hover:bg-[var(--color-surface)]"
                >
                إلغاء
                </Link>
            </div>
            </form>
        </section>

        {/* Product Media */}
        <section>
            <MediaUploader productId={id} />
            <MediaGallery productId={id} />
        </section>
        </div>
    )
    }

    export default ProductEditPage