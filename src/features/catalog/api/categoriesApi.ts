import { axiosAdminClient } from '@/api/axiosAdminClient'
import type { ProductCategory, CreateCategoryPayload, UpdateCategoryPayload } from '../types/product-category'

export interface CategoryResponse {
    data: ProductCategory
}

export interface CategoryListResponse {
    data: ProductCategory[]
}

export const categoriesApi = {
    async getAll(): Promise<CategoryListResponse> {
        const response = await axiosAdminClient.get<CategoryListResponse>('/admin/product-categories')
        return response.data
    },

    async getById(id: number): Promise<ProductCategory> {
        const response = await axiosAdminClient.get<CategoryResponse>(`/admin/product-categories/${id}`)
        return response.data.data
    },

    async create(data: CreateCategoryPayload | FormData): Promise<ProductCategory> {
        const payload = data instanceof FormData ? data : Object.entries(data).reduce((form, [key, value]) => {
            if (value !== undefined && value !== null) {
                form.append(key, String(value))
            }
            return form
        }, new FormData())

        const response = await axiosAdminClient.post<CategoryResponse>('/admin/product-categories', payload, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
        return response.data.data
    },

    async update(id: number, data: UpdateCategoryPayload | FormData): Promise<ProductCategory> {
        const payload = data instanceof FormData ? data : Object.entries(data).reduce((form, [key, value]) => {
            if (value !== undefined && value !== null) {
                form.append(key, String(value))
            }
            return form
        }, new FormData())

        payload.append('_method', 'PUT')

        const response = await axiosAdminClient.post<CategoryResponse>(`/admin/product-categories/${id}`, payload, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
        return response.data.data
    },

    async delete(id: number): Promise<void> {
        await axiosAdminClient.delete(`/admin/product-categories/${id}`)
    }
}
