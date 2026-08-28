export interface Color {
    id: number
    name: string
    hex_code: string
    created_at: string
    updated_at: string | null
}

export interface CreateColorPayload {
    name: string
    hex_code: string
}

export interface UpdateColorPayload {
    name?: string
    hex_code?: string
}
