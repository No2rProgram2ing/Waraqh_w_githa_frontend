import { Mail, Phone, Calendar, ShoppingBag, ShieldBan, ShieldCheck } from 'lucide-react'
import type { CustomerDetails } from '../types/customer'
import { useUpdateCustomerStatus } from '../hooks/useCustomers'

interface CustomerProfileProps {
    customer: CustomerDetails
}

function formatDate(iso: string): string {
    return new Intl.DateTimeFormat('ar-SA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(new Date(iso))
}

export default function CustomerProfile({ customer }: CustomerProfileProps) {
    const { mutate: updateStatus, isPending } = useUpdateCustomerStatus()

    const handleToggleStatus = () => {
        const newStatus = customer.status === 'active' ? 'inactive' : 'active'
        const actionLabel = newStatus === 'active' ? 'تفعيل' : 'إيقاف'
        
        if (confirm(`هل أنت متأكد من ${actionLabel} حساب العميل "${customer.first_name}"؟`)) {
            updateStatus({ id: customer.id, status: newStatus })
        }
    }

    return (
        <div className="bg-[var(--color-surface-card)] rounded-[24px] border border-[var(--color-border)] p-6 shadow-sm flex flex-col md:flex-row gap-6 md:items-start justify-between" dir="rtl">
            
            {/* User Info */}
            <div className="flex gap-4">
                <div className="w-16 h-16 rounded-full bg-[#EBE1D7] flex items-center justify-center shrink-0">
                    <span className="text-2xl font-bold text-[#45592D]">
                        {customer.first_name[0]}{customer.last_name[0]}
                    </span>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                        {customer.first_name} {customer.last_name}
                        {customer.status === 'active' ? (
                            <span className="inline-flex items-center justify-center rounded-full bg-[var(--color-accent-subtle)] px-2 py-0.5 text-xs font-semibold text-[#45592D]">نشط</span>
                        ) : (
                            <span className="inline-flex items-center justify-center rounded-full bg-[var(--color-danger-subtle)] px-2 py-0.5 text-xs font-semibold text-[var(--color-danger)]">موقوف</span>
                        )}
                    </h2>
                    
                    <div className="mt-3 flex flex-col gap-2 text-sm text-[var(--color-text-muted)]">
                        <div className="flex items-center gap-2">
                            <Mail size={16} className="text-[var(--color-text-faint)]" />
                            <span dir="ltr">{customer.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone size={16} className="text-[var(--color-text-faint)]" />
                            <span dir="ltr">{customer.phone ?? 'لا يوجد رقم هاتف'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-[var(--color-text-faint)]" />
                            <span>عضو منذ {formatDate(customer.created_at)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats & Actions */}
            <div className="flex flex-col md:items-end gap-6 border-t md:border-t-0 md:border-r border-[var(--color-border)] pt-6 md:pt-0 md:pr-6">
                <div className="flex gap-8">
                    <div className="text-center">
                        <p className="text-xs text-[var(--color-text-muted)] mb-1">إجمالي الطلبات</p>
                        <p className="text-lg font-bold text-[#45592D] flex items-center justify-center gap-1">
                            <ShoppingBag size={18} />
                            {customer.total_orders}
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-[var(--color-text-muted)] mb-1">إجمالي المدفوعات</p>
                        <p className="text-lg font-bold text-[var(--color-text-primary)]">
                            {customer.total_spent} ر.س
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleToggleStatus}
                    disabled={isPending}
                    className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 ${
                        customer.status === 'active' 
                            ? 'bg-[var(--color-danger-subtle)] text-[var(--color-danger)] hover:bg-[var(--color-danger-subtle-hover)]'
                            : 'bg-[var(--color-accent-subtle)] text-[#45592D] hover:bg-[var(--color-accent-subtle-hover)]'
                    }`}
                >
                    {customer.status === 'active' ? (
                        <>
                            <ShieldBan size={16} />
                            إيقاف الحساب
                        </>
                    ) : (
                        <>
                            <ShieldCheck size={16} />
                            تفعيل الحساب
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}
