import { useParams, useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useCustomer } from '../hooks/useCustomers'
import CustomerProfile from '../components/CustomerProfile'
import CustomerTabs from '../components/CustomerTabs'

export default function CustomerDetailsPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    
    const customerId = Number(id)
    const { data: customer, isLoading, isError, refetch } = useCustomer(customerId)

    if (isLoading) {
        return (
            <div dir="rtl" className="space-y-6">
                <button
                    onClick={() => navigate('/admin/customers')}
                    className="flex items-center gap-2 text-sm font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                    <ArrowRight size={18} />
                    العودة لقائمة العملاء
                </button>
                <p className="text-sm text-[var(--color-text-muted)]">جاري تحميل بيانات العميل...</p>
            </div>
        )
    }

    if (isError || !customer) {
        return (
            <div dir="rtl" className="space-y-6">
                <button
                    onClick={() => navigate('/admin/customers')}
                    className="flex items-center gap-2 text-sm font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                    <ArrowRight size={18} />
                    العودة لقائمة العملاء
                </button>
                <div className="bg-[var(--color-surface-card)] rounded-2xl border border-[var(--color-border)] p-8 text-center">
                    <p className="text-sm text-[var(--color-danger)] mb-4">حدث خطأ أو أن العميل غير موجود.</p>
                    <button
                        onClick={() => void refetch()}
                        className="rounded-xl bg-[#45592D] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5D7243]"
                    >
                        إعادة المحاولة
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div dir="rtl" className="space-y-6">
            <button
                onClick={() => navigate('/admin/customers')}
                className="flex items-center gap-2 text-sm font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors w-fit"
            >
                <ArrowRight size={18} />
                العودة لقائمة العملاء
            </button>

            <CustomerProfile customer={customer} />
            <CustomerTabs customer={customer} />
        </div>
    )
}
