import { Mail, Phone, Calendar, ShoppingBag, ShieldCheck, ShieldAlert } from 'lucide-react'
import type { CustomerDetails } from '../types/customer'

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
    const isVerified = !!customer.email_verified_at
    const initials = (customer.full_name || 'ع')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? '')
        .join('') || 'ع'

    return (
        <div className="bg-[var(--color-surface-card)] rounded-[24px] border border-[var(--color-border)] p-6 shadow-sm flex flex-col md:flex-row gap-6 md:items-start justify-between" dir="rtl">
            <div className="flex gap-4">
                <div className="w-16 h-16 rounded-full bg-[#EBE1D7] flex items-center justify-center shrink-0">
                    <span className="text-2xl font-bold text-[#45592D]">{initials}</span>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                        {customer.full_name || 'اسم غير متوفر'}
                        {isVerified ? (
                            <span className="inline-flex items-center justify-center rounded-full bg-[var(--color-accent-subtle)] px-2 py-0.5 text-xs font-semibold text-[#45592D]">مؤكد</span>
                        ) : (
                            <span className="inline-flex items-center justify-center rounded-full bg-[var(--color-danger-subtle)] px-2 py-0.5 text-xs font-semibold text-[var(--color-danger)]">غير مؤكد</span>
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
                            {Number(customer.total_purchases ?? 0).toLocaleString('ar-SA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ر.س
                        </p>
                    </div>
                </div>

                <div className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold ${
                    isVerified
                        ? 'bg-[var(--color-accent-subtle)] text-[#45592D]'
                        : 'bg-[var(--color-danger-subtle)] text-[var(--color-danger)]'
                }`}>
                    {isVerified ? <ShieldCheck size={16} /> : <ShieldAlert size={16} />}
                    {isVerified ? 'الحساب مؤكد' : 'الحساب غير مؤكد'}
                </div>
            </div>
        </div>
    )
}
