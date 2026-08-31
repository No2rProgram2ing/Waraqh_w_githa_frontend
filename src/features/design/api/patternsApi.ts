import { adminClient } from '@/lib/api/adminClient'
import type { DesignPattern, CreatePatternPayload, UpdatePatternPayload } from '../types/pattern'

export interface PatternListResponse {
    data: DesignPattern[]
}

export interface PatternResponse {
    data: DesignPattern
}

export const patternsApi = {
    async getAll(): Promise<DesignPattern[]> {
        const response = await adminClient.get<PatternListResponse>(
            '/admin/design-patterns'
        )
        return response.data.data
    },

    async create(data: CreatePatternPayload | FormData): Promise<DesignPattern> {
        const payload = data instanceof FormData ? data : Object.entries(data).reduce((form, [key, value]) => {
            if (value !== undefined && value !== null) {
                form.append(key, String(value))
            }
            return form
        }, new FormData())

        const response = await adminClient.post<PatternResponse>(
            '/admin/design-patterns',
            payload,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        )
        return response.data.data
    },

    async update(id: number, data: UpdatePatternPayload | FormData): Promise<DesignPattern> {
        const payload = data instanceof FormData ? data : Object.entries(data).reduce((form, [key, value]) => {
            if (value !== undefined && value !== null) {
                form.append(key, String(value))
            }
            return form
        }, new FormData())

        payload.append('_method', 'PUT')

        const response = await adminClient.post<PatternResponse>(
            `/admin/design-patterns/${id}`,
            payload,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        )
        return response.data.data
    },

    async delete(id: number): Promise<void> {
        await adminClient.delete(`/admin/design-patterns/${id}`)
    }
}
