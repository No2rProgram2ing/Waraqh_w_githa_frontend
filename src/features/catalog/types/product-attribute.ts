export type AttributeType = 'text' | 'select' | 'boolean'

export interface ProductAttribute {
    id: number
    name: string           // e.g. "size"
    display_name: string   // e.g. "المقاس"
    type: AttributeType
    is_required: boolean
    options: string[] | null // Populated if type is "select"
    created_at: string
    updated_at: string | null
}

export interface CreateAttributePayload {
    name: string
    display_name: string
    type: AttributeType
    is_required: boolean
    options?: string[] | null
}

export interface UpdateAttributePayload {
    name?: string
    display_name?: string
    type?: AttributeType
    is_required?: boolean
    options?: string[] | null
}
