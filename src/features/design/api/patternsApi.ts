import { axiosAdminClient } from '@/api/axiosAdminClient'
import type { DesignPattern, CreatePatternPayload, UpdatePatternPayload } from '../types/pattern'

export interface PatternListResponse {
    data: DesignPattern[]
}

export interface PatternResponse {
    data: DesignPattern
}

export const patternsApi = {
    async getAll(): Promise<DesignPattern[]> {
        const response = await axiosAdminClient.get<PatternListResponse>(
            '/admin/patterns' // Placeholder endpoint
        )
        return response.data.data
    },

    async create(data: CreatePatternPayload): Promise<DesignPattern> {
        // Typically requires FormData if uploading an actual file
        const response = await axiosAdminClient.post<PatternResponse>(
            '/admin/patterns', // Placeholder endpoint
            data
        )
        return response.data.data
    },

    async update(id: number, data: UpdatePatternPayload): Promise<DesignPattern> {
        const response = await axiosAdminClient.put<PatternResponse>(
            `/admin/patterns/${id}`, // Placeholder endpoint
            data
        )
        return response.data.data
    },

    async delete(id: number): Promise<void> {
        await axiosAdminClient.delete(`/admin/patterns/${id}`) // Placeholder endpoint
    }
}
