import { useEffect, useState } from 'react'
import { X, Eye, EyeOff } from 'lucide-react'
import { useCreateCustomer, useUpdateCustomer } from '../hooks/useCustomers'
import type { Customer, CustomerCategory } from '../types/customer'
import { validatePhone, validateEmail, validateFullName } from '../../../utils/validation'

interface CustomerFormModalProps {
    isOpen: boolean
    onClose: () => void
    customerToEdit?: Customer | null
}

const defaultForm = {
    full_name: '',
    email: '',
    phone_country_code: '+966',
    phone: '',
    category: 'regular' as CustomerCategory,
    password: '',
}

export default function CustomerFormModal({ isOpen, onClose, customerToEdit }: CustomerFormModalProps) {
    const { mutate: createCustomer, isPending: isCreating } = useCreateCustomer()
    const { mutate: updateCustomer, isPending: isUpdating } = useUpdateCustomer()

    const [form, setForm] = useState(defaultForm)
    const [showPassword, setShowPassword] = useState(false)
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        if (customerToEdit) {
            setForm({
                full_name: customerToEdit.full_name ?? '',
                email: customerToEdit.email ?? '',
                phone_country_code: customerToEdit.phone_country_code ?? '+966',
                phone: customerToEdit.phone ?? '',
                category: customerToEdit.category ?? 'regular',
                password: '',
            })
        } else {
            setForm(defaultForm)
        }

        setShowPassword(false)
        setFieldErrors({})
    }, [customerToEdit, isOpen])

    if (!isOpen) return null

    const isPending = isCreating || isUpdating

    const handleChange = (field: keyof typeof defaultForm, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }))
        setFieldErrors((prev) => ({ ...prev, [field]: '' }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const nextErrors: Record<string, string> = {}

        const nameErr = validateFullName(form.full_name)
        if (nameErr) nextErrors.full_name = nameErr

        const emailErr = validateEmail(form.email)
        if (emailErr) nextErrors.email = emailErr

        if (!form.phone_country_code.trim()) nextErrors.phone_country_code = 'يرجى إدخال كود الدولة.'

        const phoneErr = validatePhone(form.phone)
        if (phoneErr) nextErrors.phone = phoneErr

        if (!form.category) nextErrors.category = 'يرجى اختيار فئة العميل.'
        if (!customerToEdit && !form.password.trim()) nextErrors.password = 'يرجى إدخال كلمة المرور.'

        if (Object.keys(nextErrors).length) {
            setFieldErrors(nextErrors)
            return
        }

        const payload = {
            full_name: form.full_name.trim(),
            email: form.email.trim(),
            phone_country_code: form.phone_country_code.trim(),
            phone: form.phone.trim(),
            category: form.category,
            ...(customerToEdit ? (form.password ? { password: form.password } : {}) : { password: form.password }),
        }

        if (customerToEdit) {
            updateCustomer(
                { id: customerToEdit.id, data: payload },
                { onSuccess: onClose },
            )
            return
        }

        createCustomer(payload, { onSuccess: onClose })
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-[var(--color-surface-card)] rounded-2xl w-full max-w-xl shadow-xl max-h-[90vh] flex flex-col" dir="rtl">
                <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)] bg-[var(--color-surface)] rounded-t-2xl shrink-0">
                    <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
                        {customerToEdit ? 'تعديل العميل' : 'إضافة عميل جديد'}
                    </h2>
                    <button onClick={onClose} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-5 overflow-y-auto">
                    <form id="customer-form" onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">الاسم الكامل</label>
                            <input
                                type="text"
                                value={form.full_name}
                                onChange={(e) => handleChange('full_name', e.target.value)}
                                className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none focus:border-[#45592D] transition-colors"
                            />
                            {fieldErrors.full_name && <p className="mt-1 text-xs text-[var(--color-danger)]">{fieldErrors.full_name}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">البريد الإلكتروني</label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none focus:border-[#45592D] transition-colors"
                                    dir="ltr"
                                />
                                {fieldErrors.email && <p className="mt-1 text-xs text-[var(--color-danger)]">{fieldErrors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">الفئة</label>
                                <select
                                    value={form.category}
                                    onChange={(e) => handleChange('category', e.target.value as CustomerCategory)}
                                    className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none focus:border-[#45592D] bg-[var(--color-surface-card)] transition-colors"
                                >
                                    <option value="regular">عادي</option>
                                    <option value="vip">مميز</option>
                                </select>
                                {fieldErrors.category && <p className="mt-1 text-xs text-[var(--color-danger)]">{fieldErrors.category}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">كود الدولة</label>
                                <input
                                    type="text"
                                    value={form.phone_country_code}
                                    placeholder="+966"
                                    onChange={(e) => handleChange('phone_country_code', e.target.value)}
                                    className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none focus:border-[#45592D] transition-colors"
                                    dir="ltr"
                                />
                                {fieldErrors.phone_country_code && <p className="mt-1 text-xs text-[var(--color-danger)]">{fieldErrors.phone_country_code}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">رقم الهاتف</label>
                                <input
                                    type="text"
                                    value={form.phone}
                                    onChange={(e) => handleChange('phone', e.target.value)}
                                    className="w-full rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none focus:border-[#45592D] transition-colors"
                                    dir="ltr"
                                />
                                {fieldErrors.phone && <p className="mt-1 text-xs text-[var(--color-danger)]">{fieldErrors.phone}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                                كلمة المرور
                                {customerToEdit && <span className="text-[var(--color-text-muted)] text-xs mr-2">(اتركها فارغة إذا لم ترد تغييرها)</span>}
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={form.password}
                                    required={!customerToEdit}
                                    onChange={(e) => handleChange('password', e.target.value)}
                                    className="w-full rounded-xl border border-[var(--color-border)] pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#45592D] transition-colors"
                                    dir="ltr"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {fieldErrors.password && <p className="mt-1 text-xs text-[var(--color-danger)]">{fieldErrors.password}</p>}
                        </div>
                    </form>
                </div>

                <div className="p-5 flex items-center justify-end gap-3 border-t border-[var(--color-border)] shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2.5 rounded-xl border border-[var(--color-border)] text-[var(--color-text-secondary)] text-sm font-medium hover:bg-[var(--color-surface)] transition-colors"
                    >
                        إلغاء
                    </button>
                    <button
                        type="submit"
                        form="customer-form"
                        disabled={isPending}
                        className="px-4 py-2.5 rounded-xl bg-[#45592D] text-white text-sm font-semibold hover:bg-[#5D7243] transition-colors disabled:opacity-50"
                    >
                        {isPending ? 'جاري الحفظ...' : customerToEdit ? 'تحديث' : 'حفظ'}
                    </button>
                </div>
            </div>
        </div>
    )
}
