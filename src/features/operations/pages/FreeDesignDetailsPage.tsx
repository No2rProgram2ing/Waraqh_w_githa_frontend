import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowRight, Save, Trash2 } from 'lucide-react'
import { useDeleteFreeDesign, useFreeDesign, useUpdateFreeDesign } from '../hooks/useFreeDesigns'
import type { FreeDesignStatus } from '../types/freeDesign.types'
import { OpButton } from '../components/OpButton'
import { OpCard } from '../components/OpCard'
import { OpEmptyState } from '../components/OpEmptyState'
import { OpPageHeader } from '../components/OpPageHeader'
import { OpStatusBadge } from '../components/OpStatusBadge'

export default function FreeDesignDetailsPage() {
  const { id } = useParams()
  const requestId = Number(id)
  const navigate = useNavigate()
  const query = useFreeDesign(requestId)
  const update = useUpdateFreeDesign()
  const remove = useDeleteFreeDesign()
  const item = query.data?.data
  const [status, setStatus] = useState<FreeDesignStatus | ''>('')
  const [description, setDescription] = useState('')

  if (query.isLoading) return <div dir="rtl" className="min-h-[300px]"><OpEmptyState>جاري تحميل الطلب...</OpEmptyState></div>
  if (query.isError || !item) return <div dir="rtl" className="min-h-[300px]"><OpEmptyState tone="error">تعذر تحميل الطلب.</OpEmptyState></div>

  const currentStatus = status || item.status
  const currentDescription = description || item.description || ''

  const save = () => update.mutate({ id: requestId, payload: { status: currentStatus, description: currentDescription } })

  const destroy = () => {
    if (!window.confirm('هل أنت متأكد من حذف الطلب؟')) return
    remove.mutate(requestId, { onSuccess: () => navigate('/admin/free-design-requests') })
  }

  return (
    <div dir="rtl" className="space-y-6">
      <Helmet><title>{`تفاصيل طلب التصميم الحر #${item.id}`}</title></Helmet>

      <OpPageHeader
        title={`طلب التصميم #${item.id}`}
        description="تفاصيل الطلب وتحديث حالته ومحتواه"
        action={
          <>
            <OpButton size="sm" variant="ghost" onClick={() => navigate('/admin/free-design-requests')} icon={<ArrowRight className="h-4 w-4" />}>العودة</OpButton>
            <OpButton size="sm" variant="primary" onClick={save} disabled={update.isPending} icon={<Save className="h-4 w-4" />}>{update.isPending ? 'جاري الحفظ...' : 'حفظ'}</OpButton>
            <OpButton size="sm" variant="danger" onClick={destroy} disabled={remove.isPending} icon={<Trash2 className="h-4 w-4" />}>{remove.isPending ? 'جاري الحذف...' : 'حذف'}</OpButton>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <OpCard className="lg:col-span-2">
          <div className="space-y-4">
            <div>
              <h2 className="font-bold text-[var(--color-text-primary)]">وصف الطلب</h2>
              <p className="mt-1 text-xs text-[var(--color-text-muted)]">يمكن تعديل الوصف ثم حفظ التغييرات</p>
            </div>
            <textarea
              value={currentDescription}
              onChange={(event) => setDescription(event.target.value)}
              rows={12}
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm leading-6 text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/10"
            />
          </div>
        </OpCard>

        <OpCard>
          <div className="space-y-5 text-sm">
            <div>
              <h2 className="font-bold text-[var(--color-text-primary)]">بيانات الطلب</h2>
            </div>
            <div>
              <span className="text-xs text-[var(--color-text-muted)]">العميل</span>
              <div className="mt-1 font-semibold text-[var(--color-text-primary)]">{item.customer?.full_name ?? '—'}</div>
            </div>
            <div>
              <span className="text-xs text-[var(--color-text-muted)]">الحالة الحالية</span>
              <div className="mt-2"><OpStatusBadge status={String(currentStatus)} /></div>
            </div>
            <div>
              <span className="text-xs text-[var(--color-text-muted)]">تغيير الحالة</span>
              <select
                value={currentStatus}
                onChange={(event) => setStatus(event.target.value as FreeDesignStatus)}
                className="mt-2 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
              >
                <option value="new">جديد</option>
                <option value="in_review">قيد المراجعة</option>
                <option value="quoted">تم التسعير</option>
                <option value="converted">تم التحويل</option>
                <option value="rejected">مرفوض</option>
              </select>
            </div>
            <div>
              <span className="text-xs text-[var(--color-text-muted)]">تاريخ الإنشاء</span>
              <div className="mt-1 text-[var(--color-text-primary)]">{item.created_at ? new Date(item.created_at).toLocaleString('ar-SA') : '—'}</div>
            </div>
          </div>
        </OpCard>
      </div>
    </div>
  )
}
