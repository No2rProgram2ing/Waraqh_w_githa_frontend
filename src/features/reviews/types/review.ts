export type ReviewStatus = 'pending' | 'published' | 'rejected'

export interface Review {
    id: number
    product_id: number
    product_name: string
    customer_id: number
    customer_name: string
    rating: number // 1 to 5
    comment: string | null
    admin_reply: string | null
    status: ReviewStatus
    image_urls: string[] | null // Read-only view for images attached by the customer
    created_at: string
    updated_at: string | null
}

export interface ReviewFilters {
    search?: string
    status?: ReviewStatus | ''
    rating?: number | ''
    date_from?: string
    date_to?: string
    page?: number
}

export interface ReviewMeta {
    current_page: number
    last_page: number
    per_page: number
    total: number
}

export interface ReviewListResponse {
    data: Review[]
    meta: ReviewMeta
}

export interface ReplyReviewPayload {
    admin_reply: string
}

export interface UpdateReviewStatusPayload {
    status: ReviewStatus
}
