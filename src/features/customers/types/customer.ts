export type CustomerStatus = 'active' | 'inactive'

export interface Customer {
    id: number
    first_name: string
    last_name: string
    email: string
    phone: string | null
    status: CustomerStatus
    total_orders: number
    created_at: string
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
    total_spent: string // e.g. "1500.00"
    last_order_date: string | null
}

export interface CustomerFilters {
    search?: string
    status?: CustomerStatus | ''
    page?: number
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
