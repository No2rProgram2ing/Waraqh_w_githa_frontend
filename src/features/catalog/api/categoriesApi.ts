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
        const response = await axiosAdminClient.get<CategoryListResponse>('/admin/categories')
        return response.data
    },

    async getById(id: number): Promise<ProductCategory> {
        const response = await axiosAdminClient.get<CategoryResponse>(`/admin/categories/${id}`)
        return response.data.data
    },

    async create(data: CreateCategoryPayload): Promise<ProductCategory> {
        const response = await axiosAdminClient.post<CategoryResponse>('/admin/categories', data)
        return response.data.data
    },

    async update(id: number, data: UpdateCategoryPayload): Promise<ProductCategory> {
        const response = await axiosAdminClient.put<CategoryResponse>(`/admin/categories/${id}`, data)
        return response.data.data
    },

    async delete(id: number): Promise<void> {
        await axiosAdminClient.delete(`/admin/categories/${id}`)
    }
}
