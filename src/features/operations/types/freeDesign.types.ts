export interface FreeDesignRequest {
  id: number
  customer_name?: string
  title?: string
  description?: string
  attachments?: string[]
  status?: 'new' | 'assigned' | 'in_progress' | 'done' | 'rejected'
  assignee?: string | null
  created_at?: string
}
