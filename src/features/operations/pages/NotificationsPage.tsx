import React from 'react'
import { Helmet } from 'react-helmet-async'
import { useNotifications, useMarkRead } from '../hooks/useNotifications'
import { NotificationsList } from '../components/NotificationsList'

export default function NotificationsPage(){
  const { data } = useNotifications({ per_page: 50 })
  const items = data?.data ?? []
  const markRead = useMarkRead()

  const handleMark = async (ids: number[]) => {
    if (!ids.length) return alert('اختر إشعارات أولاً')
    try {
      await markRead.mutateAsync(ids)
      alert('تم وضع علامة كمقروء')
    } catch (err) {
      console.error(err)
      alert('فشل تحديث الإشعارات')
    }
  }

  return (
    <div dir="rtl" className="space-y-6">
      <Helmet><title>الإشعارات — لوحة الإدارة</title></Helmet>
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold">الإشعارات</h1></div>
      <NotificationsList items={items} onMarkRead={handleMark} />
    </div>
  )
}
