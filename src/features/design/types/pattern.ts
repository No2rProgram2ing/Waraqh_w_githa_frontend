export interface DesignPattern {
    id: number
    name: string
    description?: string | null
    preview_image_url?: string | null
    image_url?: string | null
    created_at: string
    updated_at: string | null
}

export interface CreatePatternPayload {
    name: string
    description?: string | null
    image_url?: string | null
    preview_image_url?: string | null
}

export interface UpdatePatternPayload {
    name?: string
    description?: string | null
    image_url?: string | null
    preview_image_url?: string | null
}
