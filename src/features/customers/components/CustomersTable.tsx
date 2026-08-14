import { Link } from 'react-router-dom'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import type { Customer } from '../types/customer'

interface CustomersTableProps {
    customers: Customer[]
    onEdit: (customer: Customer) => void
    onDelete: (customer: Customer) => void
}

function formatDate(iso: string): string {
    return new Intl.DateTimeFormat('ar-SA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(new Date(iso))
}

export default function CustomersTable({ customers, onEdit, onDelete }: CustomersTableProps) {
    if (!customers.length) {
        return (
            <div className="text-center py-16 text-[var(--color-text-muted)] text-sm bg-[var(--color-surface)] rounded-2xl border border-dashed border-[var(--color-border-muted)]">
                لا يوجد عملاء.
            </div>
        )
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-card)]" dir="rtl">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)] text-right">
                        <th className="px-5 py-3.5 font-semibold text-[var(--color-text-secondary)]">الاسم</th>
                        <th className="px-5 py-3.5 font-semibold text-[var(--color-text-secondary)]">البريد الإلكتروني</th>
                        <th className="px-5 py-3.5 font-semibold text-[var(--color-text-secondary)]">الجوال</th>
                        <th className="px-5 py-3.5 font-semibold text-[var(--color-text-secondary)] text-center">الطلبات</th>
                        <th className="px-5 py-3.5 font-semibold text-[var(--color-text-secondary)] text-center">الحالة</th>
                        <th className="px-5 py-3.5 font-semibold text-[var(--color-text-secondary)]">تاريخ التسجيل</th>
                        <th className="px-5 py-3.5 font-semibold text-[var(--color-text-secondary)] text-left">الإجراءات</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#EBE1D7]">
                    {customers.map((customer) => {
                        const isVerified = !!customer.email_verified_at

                        return (
                            <tr key={customer.id} className="hover:bg-[var(--color-surface)] transition-colors group">
                                <td className="px-5 py-4 font-medium text-[var(--color-text-primary)] whitespace-nowrap">
                                    {customer.full_name || '—'}
                                </td>
                                <td className="px-5 py-4 text-[var(--color-text-muted)]">{customer.email}</td>
                                <td className="px-5 py-4 text-[var(--color-text-muted)]" dir="ltr">
                                    {customer.phone ?? '—'}
                                </td>
                                <td className="px-5 py-4 text-center">
                                    <span className="inline-flex items-center justify-center min-w-[28px] h-7 rounded-full bg-[#EBE1D7] text-[var(--color-text-secondary)] text-xs font-bold px-2">
                                        {customer.total_orders}
                                    </span>
                                </td>
                                <td className="px-5 py-4 text-center">
                                    {isVerified ? (
                                        <span className="inline-flex items-center justify-center rounded-full bg-[var(--color-accent-subtle)] px-2 py-0.5 text-xs font-semibold text-[#45592D]">
                                            مؤكد
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center justify-center rounded-full bg-[var(--color-danger-subtle)] px-2 py-0.5 text-xs font-semibold text-[var(--color-danger)]">
                                            غير مؤكد
                                        </span>
                                    )}
                                </td>
                                <td className="px-5 py-4 text-[var(--color-text-muted)] text-xs whitespace-nowrap">
                                    {formatDate(customer.created_at)}
                                </td>
                                <td className="px-5 py-4">
                                    <div className="flex items-center justify-end gap-1">
                                        <Link
                                            to={`/admin/customers/${customer.id}`}
                                            className="p-2 rounded-lg text-[#45592D] hover:bg-[var(--color-accent-subtle)] transition-colors flex items-center gap-1.5"
                                            title="عرض الملف"
                                        >
                                            <Eye size={16} />
                                            <span className="text-xs font-medium">عرض الملف</span>
                                        </Link>

                                        <button
                                            type="button"
                                            onClick={() => onEdit(customer)}
                                            className="p-2 rounded-lg text-[#45592D] hover:bg-[var(--color-accent-subtle)] transition-colors"
                                            title="تعديل العميل"
                                        >
                                            <Pencil size={16} />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => onDelete(customer)}
                                            className="p-2 rounded-lg text-[var(--color-danger)] hover:bg-[var(--color-danger-subtle)] transition-colors"
                                            title="حذف العميل"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}
