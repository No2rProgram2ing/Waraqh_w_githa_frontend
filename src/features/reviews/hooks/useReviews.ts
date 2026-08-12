import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { reviewsApi } from '../api/reviewsApi'
import type { ReviewFilters, ReviewStatus } from '../types/review'

export const reviewKeys = {
    all: ['admin', 'reviews'] as const,
    list: (filters: ReviewFilters) => [...reviewKeys.all, 'list', filters] as const,
}

export function useReviews(filters: ReviewFilters = {}) {
    return useQuery({
        queryKey: reviewKeys.list(filters),
        queryFn: () => reviewsApi.getAll(filters),
        placeholderData: (prev) => prev,
    })
}

export function useUpdateReviewStatus() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, status }: { id: number; status: ReviewStatus }) =>
            reviewsApi.updateStatus(id, { status }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: reviewKeys.all })
        },
    })
}

export function useReplyToReview() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, admin_reply }: { id: number; admin_reply: string }) =>
            reviewsApi.reply(id, { admin_reply }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: reviewKeys.all })
        },
    })
}

export function useDeleteReview() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: number) => reviewsApi.delete(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: reviewKeys.all })
        },
    })
}
