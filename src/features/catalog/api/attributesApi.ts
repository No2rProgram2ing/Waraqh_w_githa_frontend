import { adminClient } from '@/lib/api/adminClient'
import type { ProductAttribute, CreateAttributePayload, UpdateAttributePayload } from '../types/product-attribute'

export interface AttributeListResponse {
    data: ProductAttribute[]
}

export interface AttributeResponse {
    data: ProductAttribute
}

export const attributesApi = {
    async getAll(): Promise<ProductAttribute[]> {
        const response = await adminClient.get<AttributeListResponse>(
            '/admin/product-attributes'
        )
        return response.data.data
    },

    async getById(id: number): Promise<ProductAttribute> {
        const response = await adminClient.get<AttributeResponse>(
            `/admin/product-attributes/${id}`
        )
        return response.data.data
    },

    async create(data: CreateAttributePayload): Promise<ProductAttribute> {
        const response = await adminClient.post<AttributeResponse>(
            '/admin/product-attributes',
            data
        )
        return response.data.data
    },

    async update(id: number, data: UpdateAttributePayload): Promise<ProductAttribute> {
        const response = await adminClient.put<AttributeResponse>(
            `/admin/product-attributes/${id}`,
            data
        )
        return response.data.data
    },

    async delete(id: number): Promise<void> {
        await adminClient.delete(`/admin/product-attributes/${id}`)
    },
}
