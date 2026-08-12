import { axiosAdminClient } from '@/api/axiosAdminClient'
import type { Color, CreateColorPayload, UpdateColorPayload } from '../types/color'

export interface ColorListResponse {
    data: Color[]
}

export interface ColorResponse {
    data: Color
}

export const colorsApi = {
    async getAll(): Promise<Color[]> {
        const response = await axiosAdminClient.get<ColorListResponse>(
            '/admin/colors' // Placeholder endpoint
        )
        return response.data.data
    },

    async create(data: CreateColorPayload): Promise<Color> {
        const response = await axiosAdminClient.post<ColorResponse>(
            '/admin/colors', // Placeholder endpoint
            data
        )
        return response.data.data
    },

    async update(id: number, data: UpdateColorPayload): Promise<Color> {
        const response = await axiosAdminClient.put<ColorResponse>(
            `/admin/colors/${id}`, // Placeholder endpoint
            data
        )
        return response.data.data
    },

    async delete(id: number): Promise<void> {
        await axiosAdminClient.delete(`/admin/colors/${id}`) // Placeholder endpoint
    }
}
