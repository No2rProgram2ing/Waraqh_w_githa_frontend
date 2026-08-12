export interface DesignPattern {
    id: number
    name: string
    image_url: string
    created_at: string
    updated_at: string | null
}

export interface CreatePatternPayload {
    name: string
    image_url: string // Note: Can be changed to File if backend supports multipart
}

export interface UpdatePatternPayload {
    name?: string
    image_url?: string
}
