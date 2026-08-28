import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { customersApi } from '../api/customersApi'
import type { CustomerFilters, CustomerStatus, CreateCustomerPayload, UpdateCustomerPayload } from '../types/customer'
import { showErrorToast, showSuccessToast, showValidationErrorToast } from '@/lib/toast'

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

export function useCreateCustomer() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateCustomerPayload) => customersApi.create(data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: customerKeys.all })
            showSuccessToast('تمت إضافة العميل بنجاح')
        },
        onError: (error: any) => {
            const validationErrors = error?.response?.data?.errors as Record<string, string[]> | undefined
            if (validationErrors) {
                showValidationErrorToast(validationErrors)
                return
            }
            showErrorToast('فشل في إضافة العميل، يرجى المحاولة مرة أخرى.')
        },
    })
}

export function useUpdateCustomer() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateCustomerPayload }) => customersApi.update(id, data),
        onSuccess: async (_, variables) => {
            await queryClient.invalidateQueries({ queryKey: customerKeys.detail(variables.id) })
            await queryClient.invalidateQueries({ queryKey: customerKeys.all })
            showSuccessToast('تم تحديث بيانات العميل بنجاح')
        },
        onError: (error: any) => {
            const validationErrors = error?.response?.data?.errors as Record<string, string[]> | undefined
            if (validationErrors) {
                showValidationErrorToast(validationErrors)
                return
            }
            showErrorToast('فشل في تحديث بيانات العميل، يرجى المحاولة مرة أخرى.')
        },
    })
}

export function useDeleteCustomer() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: number) => customersApi.delete(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: customerKeys.all })
            showSuccessToast('تم حذف العميل بنجاح')
        },
        onError: (error: any) => {
            const validationErrors = error?.response?.data?.errors as Record<string, string[]> | undefined
            if (validationErrors) {
                showValidationErrorToast(validationErrors)
                return
            }
            showErrorToast('فشل في حذف العميل، يرجى المحاولة مرة أخرى.')
        },
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
