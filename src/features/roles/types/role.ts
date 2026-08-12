export type RolePermission = {
    id: number
    name: string           // machine name e.g. "products.create"
    display_name: string   // human label e.g. "إنشاء منتج"
    group: string          // grouping key e.g. "المنتجات"
}

export interface Role {
    id: number
    name: string           // machine name e.g. "admin"
    display_name: string   // human label e.g. "مدير"
    description: string | null
    permissions_count: number
    created_at: string
    updated_at: string | null
}

export interface RoleWithPermissions extends Role {
    permissions: RolePermission[]
}

export interface CreateRolePayload {
    name: string
    display_name: string
    description?: string | null
}

export interface UpdateRolePayload {
    name?: string
    display_name?: string
    description?: string | null
}

export interface SyncPermissionsPayload {
    permission_ids: number[]
}
