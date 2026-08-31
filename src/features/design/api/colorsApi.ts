import { adminClient } from '@/lib/api/adminClient'
import type { Color, CreateColorPayload, UpdateColorPayload } from '../types/color'

export interface ColorListResponse {
    data: Color[]
}

export interface ColorResponse {
    data: Color
}

export const colorsApi = {
    async getAll(): Promise<Color[]> {
        const response = await adminClient.get<ColorListResponse>(
            '/admin/colors' // Placeholder endpoint
        )
        return response.data.data
    },

    async create(data: CreateColorPayload): Promise<Color> {
        const response = await adminClient.post<ColorResponse>(
            '/admin/colors', // Placeholder endpoint
            data
        )
        return response.data.data
    },

    async update(id: number, data: UpdateColorPayload): Promise<Color> {
        const response = await adminClient.put<ColorResponse>(
            `/admin/colors/${id}`, // Placeholder endpoint
            data
        )
        return response.data.data
    },

    async delete(id: number): Promise<void> {
        await adminClient.delete(`/admin/colors/${id}`) // Placeholder endpoint
    }
}
