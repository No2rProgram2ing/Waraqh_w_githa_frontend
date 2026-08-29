import { useState } from 'react'
import { ChevronRight, ChevronLeft, Plus } from 'lucide-react'
import { useCustomers, useDeleteCustomer } from '../hooks/useCustomers'
import CustomersTable from '../components/CustomersTable'
import CustomerFiltersBar from '../components/CustomerFiltersBar'
import CustomerFormModal from '../components/CustomerFormModal'
import type { Customer, CustomerFilters } from '../types/customer'

const DEFAULT_FILTERS: CustomerFilters = {
    search: '',
    category: '',
    verified: '',
    page: 1,
}

export default function CustomersPage() {
    const [filters, setFilters] = useState<CustomerFilters>(DEFAULT_FILTERS)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null)

    const { data, isLoading, isError, refetch } = useCustomers(filters)
    const { mutate: deleteCustomer } = useDeleteCustomer()

    const customers = data?.data ?? []
    const meta = data?.meta

    const handleOpenCreateModal = () => {
        setCustomerToEdit(null)
        setIsModalOpen(true)
    }

    const handleOpenEditModal = (customer: Customer) => {
        setCustomerToEdit(customer)
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setCustomerToEdit(null)
    }

    const handleDeleteCustomer = (customer: Customer) => {
        const confirmed = window.confirm('هل أنت متأكد من حذف هذا العميل؟ لا يمكن التراجع عن هذا الإجراء.')
        if (!confirmed) return

        deleteCustomer(customer.id)
    }

    if (isError) {
        return (
            <div dir="rtl" className="space-y-6">
                <h1 className="text-[28px] font-extrabold text-[var(--color-text-primary)]">إدارة العملاء</h1>
                <p className="text-sm text-[var(--color-danger)]">حدث خطأ أثناء تحميل العملاء.</p>
                <button
                    onClick={() => void refetch()}
                    className="rounded-xl bg-[#45592D] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5D7243]"
                >
                    إعادة المحاولة
                </button>
            </div>
        )
    }

    return (
        <div dir="rtl" className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-[28px] font-extrabold text-[var(--color-text-primary)]">إدارة العملاء</h1>
                    <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                        عرض قائمة العملاء وإدارة حساباتهم
                        {meta && ` — ${meta.total} عميل إجمالاً`}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleOpenCreateModal}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#45592D] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5D7243]"
                >
                    <Plus size={18} />
                    إضافة عميل
                </button>
            </div>

            {/* Filters */}
            <div className="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface-card)] p-5">
                <CustomerFiltersBar
                    filters={filters}
                    onChange={setFilters}
                    onReset={() => setFilters(DEFAULT_FILTERS)}
                />
            </div>

            {/* Table */}
            {isLoading ? (
                <div className="text-center py-16 text-sm text-[var(--color-text-muted)]">جاري التحميل...</div>
            ) : (
                <CustomersTable
                    customers={customers}
                    onEdit={handleOpenEditModal}
                    onDelete={handleDeleteCustomer}
                />
            )}

            <CustomerFormModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                customerToEdit={customerToEdit}
            />

            {/* Pagination */}
            {meta && meta.last_page > 1 && (
                <div className="flex items-center justify-between" dir="rtl">
                    <p className="text-sm text-[var(--color-text-muted)]">
                        صفحة {meta.current_page} من {meta.last_page}
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            disabled={meta.current_page <= 1}
                            onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) - 1 }))}
                            className="flex items-center gap-1 rounded-xl border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight size={16} />
                            السابق
                        </button>
                        <button
                            disabled={meta.current_page >= meta.last_page}
                            onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) + 1 }))}
                            className="flex items-center gap-1 rounded-xl border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            التالي
                            <ChevronLeft size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
