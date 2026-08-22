import { Helmet } from 'react-helmet-async'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { useNotifications, useMarkRead } from '../hooks/useNotifications'
import { NotificationsList } from '../components/NotificationsList'
import { OpPageHeader } from '../components/OpPageHeader'
import { OpCard } from '../components/OpCard'
import { OpButton } from '../components/OpButton'
import { OpEmptyState } from '../components/OpEmptyState'

export default function NotificationsPage() {
  const query = useNotifications({ per_page: 50 })
  const items = query.data?.data ?? []
  const markRead = useMarkRead()

  const handleMark = async (ids: number[]) => {
    if (!ids.length) return
    try {
      for (const id of ids) await markRead.mutateAsync(id)
    } catch (err) {
      console.error(err)
      alert('فشل تحديث الإشعارات')
    }
  }

  return (
    <div dir="rtl" className="space-y-6">
      <Helmet><title>الإشعارات — لوحة الإدارة</title></Helmet>
      <OpPageHeader title="الإشعارات" description="متابعة إشعارات النظام والتنبيهات الواردة" action={<OpButton size="sm" onClick={() => void query.refetch()} disabled={query.isFetching} icon={<RefreshCw size={15} className={query.isFetching ? 'animate-spin' : ''} />}>تحديث</OpButton>} />
      {query.isError ? <OpCard><div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"><AlertCircle size={19} /><span>تعذر تحميل الإشعارات. تأكد من تشغيل آخر نسخة من مسار إشعارات الإدارة في الـ Backend.</span></div></OpCard> : query.isLoading ? <OpEmptyState>جارٍ تحميل الإشعارات...</OpEmptyState> : <OpCard variant="table"><NotificationsList items={items} onMarkRead={handleMark} /></OpCard>}
    </div>
  )
}
