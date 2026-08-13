export interface AdminProfile {
    id: number
    first_name: string
    last_name: string
    email: string
    role_name: string
    avatar_url: string | null
    created_at: string
}

export interface UpdateProfilePayload {
    first_name: string
    last_name: string
    email: string
    avatar?: File | null
    avatar_url?: string | null
    current_password?: string
    new_password?: string
    new_password_confirmation?: string
}
