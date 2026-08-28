import { axiosAdminClient } from '@/api/axiosAdminClient'
import type { ProductAttribute, CreateAttributePayload, UpdateAttributePayload } from '../types/product-attribute'

export interface AttributeListResponse {
    data: ProductAttribute[]
}

export interface AttributeResponse {
    data: ProductAttribute
}

export const attributesApi = {
    async getAll(): Promise<ProductAttribute[]> {
        const response = await axiosAdminClient.get<AttributeListResponse>(
            '/admin/product-attributes'
        )
        return response.data.data
    },

    async getById(id: number): Promise<ProductAttribute> {
        const response = await axiosAdminClient.get<AttributeResponse>(
            `/admin/product-attributes/${id}`
        )
        return response.data.data
    },

    async create(data: CreateAttributePayload): Promise<ProductAttribute> {
        const response = await axiosAdminClient.post<AttributeResponse>(
            '/admin/product-attributes',
            data
        )
        return response.data.data
    },

    async update(id: number, data: UpdateAttributePayload): Promise<ProductAttribute> {
        const response = await axiosAdminClient.put<AttributeResponse>(
            `/admin/product-attributes/${id}`,
            data
        )
        return response.data.data
    },

    async delete(id: number): Promise<void> {
        await axiosAdminClient.delete(`/admin/product-attributes/${id}`)
    },
}
