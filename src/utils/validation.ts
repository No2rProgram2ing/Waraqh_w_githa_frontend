export const validatePhone = (phone: string): string | null => {
    const trimmed = phone.trim()
    if (!trimmed) {
        return 'يرجى إدخال رقم الهاتف.'
    }
    if (!/^\d+$/.test(trimmed)) {
        return 'رقم الهاتف يجب أن يتكون من أرقام فقط.'
    }
    if (trimmed.length !== 9) {
        return 'رقم الهاتف غير صحيح، يجب أن يتكون من 9 أرقام.'
    }
    if (!/^(70|71|73|77|78)\d{7}$/.test(trimmed)) {
        return 'رقم الهاتف يجب أن يكون رقم جوال يمني صحيحاً مكوناً من 9 أرقام ويبدأ بـ 70 أو 71 أو 73 أو 77 أو 78.'
    }
    return null
}

export const validateEmail = (email: string): string | null => {
    const trimmed = email.trim()
    if (!trimmed) {
        return 'يرجى إدخال البريد الإلكتروني.'
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(trimmed)) {
        return 'البريد الإلكتروني غير صحيح.'
    }
    return null
}

export const validateFullName = (name: string): string | null => {
    const trimmed = name.trim()
    if (!trimmed) {
        return 'يرجى إدخال الاسم الكامل.'
    }
    if (trimmed.length > 255) {
        return 'الاسم الكامل يجب ألا يتجاوز 255 حرفاً.'
    }
    return null
}
