export const validatePhone = (phone: string): string | null => {
    const trimmed = phone.trim()
    if (!trimmed) {
        return 'يرجى إدخال رقم الهاتف.'
    }
    if (!/^\d+$/.test(trimmed)) {
        return 'رقم الهاتف يجب أن يتكون من أرقام فقط.'
    }
    if (trimmed.length < 7 || trimmed.length > 15) {
        return 'رقم الهاتف غير صحيح، يجب أن يكون الطول بين 7 و 15 رقماً.'
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
