import { axiosAdminClient } from '@/api/axiosAdminClient'
import type { CustomerListResponse, CustomerDetails, CustomerFilters, CustomerStatus } from '../types/customer'

export interface CustomerResponse {
    data: CustomerDetails
}

export const customersApi = {
    async getAll(filters: CustomerFilters = {}): Promise<CustomerListResponse> {
        const params: Record<string, string | number | boolean> = {}

        if (filters.search) params.search = filters.search.trim()
        if (filters.category) params.category = filters.category
        if (filters.verified !== undefined && filters.verified !== '') params.verified = filters.verified
        if (filters.sort_by) params.sort_by = filters.sort_by
        if (filters.sort_direction) params.sort_direction = filters.sort_direction
        if (filters.per_page) params.per_page = filters.per_page
        if (filters.page) params.page = filters.page

        const response = await axiosAdminClient.get<CustomerListResponse>(
            '/admin/customers',
            { params }
        )
        return response.data
    },

    async getById(id: number): Promise<CustomerDetails> {
        const response = await axiosAdminClient.get<CustomerResponse>(
            `/admin/customers/${id}`
        )
        return response.data.data
    },

    async updateStatus(id: number, status: CustomerStatus): Promise<CustomerDetails> {
        const response = await axiosAdminClient.patch<CustomerResponse>(
            `/admin/customers/${id}/status`,
            { status }
        )
        return response.data.data
    },
}
