import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { customersApi } from '../api/customersApi'
import type { CustomerFilters, CustomerStatus } from '../types/customer'

export const customerKeys = {
    all: ['admin', 'customers'] as const,
    list: (filters: CustomerFilters) => [...customerKeys.all, 'list', filters] as const,
    detail: (id: number) => [...customerKeys.all, 'detail', id] as const,
}

export function useCustomers(filters: CustomerFilters = {}) {
    return useQuery({
        queryKey: customerKeys.list(filters),
        queryFn: () => customersApi.getAll(filters),
        placeholderData: (prev) => prev,
    })
}

export function useCustomer(id: number) {
    return useQuery({
        queryKey: customerKeys.detail(id),
        queryFn: () => customersApi.getById(id),
        enabled: id > 0,
    })
}

export function useUpdateCustomerStatus() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, status }: { id: number; status: CustomerStatus }) =>
            customersApi.updateStatus(id, status),
        onSuccess: async (_, variables) => {
            await queryClient.invalidateQueries({ queryKey: customerKeys.detail(variables.id) })
            await queryClient.invalidateQueries({ queryKey: customerKeys.all })
        },
    })
}
