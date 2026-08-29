import React, { useEffect } from 'react'
import { useNotifications } from '../hooks/useNotifications'

export function NotificationsBell(){
  const { data, refetch } = useNotifications({ per_page: 10 })
  const items = data?.data ?? []
  const unread = items.filter((i: any) => !i.read).length

  useEffect(() => {
    const iv = setInterval(() => {
      refetch()
    }, 30_000)
    return () => clearInterval(iv)
  }, [])

  return (
    <div className="relative">
      <button className="p-2 rounded-full bg-gray-100" title="الإشعارات">
        🔔
      </button>
      {unread > 0 && (
        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-xs bg-red-600 text-white">{unread}</span>
      )}
    </div>
  )
}
