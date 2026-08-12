export type ProductMediaType = 'image' | 'video'

export interface ProductMedia {
    id: number
    product_id: number
    media_type: ProductMediaType
    url: string
    sort_order: number
    is_primary: boolean
    created_at: string
}

export interface MediaPreview {
    file: File
    previewUrl: string
    type: ProductMediaType
}

export interface ReorderMediaPayload {
    orderedIds: number[]
}