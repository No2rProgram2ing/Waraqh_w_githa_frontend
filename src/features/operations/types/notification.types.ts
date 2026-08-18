export interface NotificationItem {
  id: number
  title: string
  message?: string
  type?: string
  read?: boolean
  related?: { type: string; id: number }
  created_at?: string
}
