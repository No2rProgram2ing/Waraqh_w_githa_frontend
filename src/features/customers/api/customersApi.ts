import { axiosAdminClient } from '@/api/axiosAdminClient'
import type { CustomerListResponse, CustomerDetails, CustomerFilters, CustomerStatus } from '../types/customer'

export interface CustomerResponse {
    data: CustomerDetails
}

export const customersApi = {
    async getAll(filters: CustomerFilters = {}): Promise<CustomerListResponse> {
        const params: Record<string, string | number> = {}

        if (filters.search) params.search = filters.search
        if (filters.status) params.status = filters.status
        if (filters.page) params.page = filters.page

        const response = await axiosAdminClient.get<CustomerListResponse>(
            '/admin/customers', // Placeholder endpoint
            { params }
        )
        return response.data
    },

    async getById(id: number): Promise<CustomerDetails> {
        const response = await axiosAdminClient.get<CustomerResponse>(
            `/admin/customers/${id}` // Placeholder endpoint
        )
        return response.data.data
    },

    async updateStatus(id: number, status: CustomerStatus): Promise<CustomerDetails> {
        const response = await axiosAdminClient.patch<CustomerResponse>(
            `/admin/customers/${id}/status`, // Placeholder endpoint
            { status }
        )
        return response.data.data
    },
}
