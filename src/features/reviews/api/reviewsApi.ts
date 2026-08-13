import { axiosAdminClient } from '@/api/axiosAdminClient'
import type { Review, ReviewListResponse, ReviewFilters, ReplyReviewPayload, UpdateReviewStatusPayload } from '../types/review'

export interface ReviewResponse {
    data: Review
}

export const reviewsApi = {
    async getAll(filters: ReviewFilters = {}): Promise<ReviewListResponse> {
        const params: Record<string, string | number> = {}

        if (filters.search) params.search = filters.search
        if (filters.status) params.status = filters.status
        if (filters.rating !== '' && filters.rating !== undefined && filters.rating !== null) params.rating = filters.rating
        if (filters.date_from) params.date_from = filters.date_from
        if (filters.date_to) params.date_to = filters.date_to
        if (filters.page) params.page = filters.page

        const response = await axiosAdminClient.get<ReviewListResponse>(
            '/admin/reviews',
            { params }
        )
        return response.data
    },

    async updateStatus(id: number, data: UpdateReviewStatusPayload): Promise<Review> {
        const response = await axiosAdminClient.patch<ReviewResponse>(
            `/admin/reviews/${id}/status`, // Placeholder endpoint
            data
        )
        return response.data.data
    },

    async reply(id: number, data: ReplyReviewPayload): Promise<Review> {
        const response = await axiosAdminClient.patch<ReviewResponse>(
            `/admin/reviews/${id}/reply`, // Placeholder endpoint
            data
        )
        return response.data.data
    },

    async delete(id: number): Promise<void> {
        await axiosAdminClient.delete(`/admin/reviews/${id}`) // Placeholder endpoint
    }
}
