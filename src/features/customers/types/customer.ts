export type CustomerStatus = 'active' | 'inactive'
export type CustomerCategory = 'regular' | 'vip'

export interface Customer {
    id: number
    full_name: string
    email: string
    phone_country_code?: string | null
    phone: string | null
    avatar_url?: string | null
    category?: CustomerCategory | null
    email_verified_at?: string | null
    phone_verified_at?: string | null
    total_orders: number
    total_purchases?: number | string
    last_order_at?: string | null
    created_at: string
    updated_at?: string | null
}

export interface CustomerAddress {
    id: number
    title: string
    address_line_1: string
    city: string
    country: string
    is_default: boolean
}

export interface CustomerDetails extends Customer {
    addresses: CustomerAddress[]
    orders?: unknown[]
    reviews?: unknown[]
    favorites?: unknown[]
    notifications?: unknown[]
    cart?: unknown
}

export interface CustomerFilters {
    search?: string
    category?: CustomerCategory | ''
    verified?: boolean | ''
    sort_by?: 'created_at' | 'full_name' | 'email' | 'total_orders'
    sort_direction?: 'asc' | 'desc'
    page?: number
    per_page?: number
}

export interface CustomerMeta {
    current_page: number
    last_page: number
    per_page: number
    total: number
}

export interface CustomerListResponse {
    data: Customer[]
    meta: CustomerMeta
}

export interface CreateCustomerPayload {
    full_name: string
    email: string
    phone_country_code: string
    phone: string
    password: string
    category: CustomerCategory
}

export type UpdateCustomerPayload = Partial<CreateCustomerPayload>
