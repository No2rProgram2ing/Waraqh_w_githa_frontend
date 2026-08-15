export type ActivityLogAction = 'created' | 'updated' | 'deleted'

export interface ActivityLog {
    id: number
    user_id: number | null
    user_name: string | null      // اسم المستخدم الذي نفّذ الإجراء
    action: ActivityLogAction     // نوع الإجراء
    subject_type: string          // نوع الكيان المتأثر e.g. "Product", "Category"
    subject_id: number | null     // معرّف الكيان المتأثر
    description: string | null    // وصف بشري للحدث
    created_at: string
}

export interface ActivityLogFilters {
    search?: string
    action?: ActivityLogAction | ''
    date_from?: string
    date_to?: string
    page?: number
}

export interface ActivityLogMeta {
    current_page: number
    last_page: number
    per_page: number
    total: number
}

export interface ActivityLogListResponse {
    data: ActivityLog[]
    meta: ActivityLogMeta
}
