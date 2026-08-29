export type AttributeType =
    | 'text'
    | 'number'
    | 'select'
    | 'color'
    | 'boolean'
export interface ProductAttribute {
    id: number
    name: string
    display_name: string
    input_type: AttributeType
    is_required: boolean
    options: string[] | null
    created_at: string
    updated_at?: string | null
}

export interface CreateAttributePayload {
    name: string
    display_name: string
    input_type: AttributeType
    is_required: boolean
    options?: string[] | null
}

export interface UpdateAttributePayload {

    name?: string
    display_name?: string
    input_type?: AttributeType
    is_required?: boolean
    options?: string[] | null
}
