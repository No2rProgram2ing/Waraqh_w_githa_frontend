import { axiosAdminClient } from '@/api/axiosAdminClient'

import type {
    ProductMedia,
    ProductMediaType,
    } from '../types/product-media'

    export interface CreateProductMediaPayload {
    product_id: number
    media_type: ProductMediaType
    url: string
    sort_order?: number
    is_primary?: boolean
    }

    export interface UpdateProductMediaPayload {
    media_type?: ProductMediaType
    url?: string
    sort_order?: number
    is_primary?: boolean
    }

    export interface ProductMediaResponse {
    data: ProductMedia
    }

    export interface ProductMediaListResponse {
    data: ProductMedia[]
    }

    export const productMediaApi = {
    async getAll(): Promise<ProductMediaListResponse> {
        const response =
        await axiosAdminClient.get<ProductMediaListResponse>(
            '/admin/product-media',
        )

        return response.data
    },

    async getById(id: number): Promise<ProductMedia> {
        const response =
        await axiosAdminClient.get<ProductMediaResponse>(
            `/admin/product-media/${id}`,
        )

        return response.data.data
    },

    async create(
        data: CreateProductMediaPayload,
    ): Promise<ProductMedia> {
        const response =
        await axiosAdminClient.post<ProductMediaResponse>(
            '/admin/product-media',
            data,
        )

        return response.data.data
    },

    async update(
        id: number,
        data: UpdateProductMediaPayload,
    ): Promise<ProductMedia> {
        const response =
        await axiosAdminClient.put<ProductMediaResponse>(
            `/admin/product-media/${id}`,
            data,
        )

        return response.data.data
    },

    async delete(id: number): Promise<void> {
        await axiosAdminClient.delete(
        `/admin/product-media/${id}`,
        )
    },

    async upload(productId: number, files: File[]): Promise<ProductMediaListResponse> {
        const formData = new FormData()
        formData.append('product_id', productId.toString())
        files.forEach((file) => {
            formData.append('media[]', file)
        })

        const response = await axiosAdminClient.post<ProductMediaListResponse>(
            '/admin/product-media/upload', // Placeholder endpoint
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        )
        return response.data
    },

    async reorder(productId: number, orderedIds: number[]): Promise<void> {
        await axiosAdminClient.put(
            '/admin/product-media/reorder', // Placeholder endpoint
            { product_id: productId, orderedIds }
        )
    },

    async setPrimary(productId: number, mediaId: number): Promise<void> {
        await axiosAdminClient.put(
            `/admin/product-media/${mediaId}/primary`, // Placeholder endpoint
            { product_id: productId }
        )
    },
}