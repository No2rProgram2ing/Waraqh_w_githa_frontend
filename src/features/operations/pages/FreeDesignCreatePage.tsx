import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { ArrowRight, Save } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCreateFreeDesign } from '../hooks/useFreeDesigns'
import { OpButton } from '../components/OpButton'
import { OpCard } from '../components/OpCard'
import { OpPageHeader } from '../components/OpPageHeader'
import { SearchableSelect } from '@/components/ui/SearchableSelect'
import { useCustomers } from '@/features/customers/hooks/useCustomers'

export default function FreeDesignCreatePage() {
  const navigate = useNavigate()
  const create = useCreateFreeDesign()
  const [customerId, setCustomerId] = useState<number | string | null>('')
  const [description, setDescription] = useState('')
  const [customerSearch, setCustomerSearch] = useState('')

  const { data: customersData, isLoading: isLoadingCustomers } = useCustomers({
    search: customerSearch,
    per_page: 50,
  })

  const customerOptions = customersData?.data?.map(c => ({
    id: c.id,
    label: c.full_name,
    sublabel: c.phone || undefined
  })) || []

  const save = () => create.mutate({ customer_id: Number(customerId), description: description.trim(), status: 'new' }, { onSuccess: () => navigate('/admin/free-design-requests') })
  const valid = Number(customerId) > 0 && description.trim().length > 0

  return (
    <div dir="rtl" className="space-y-6">
      <Helmet><title>تصميم جديد — لوحة الإدارة</title></Helmet>
      <OpPageHeader title="تصميم جديد" description="إنشاء طلب تصميم حر جديد من لوحة الإدارة" action={<><OpButton size="sm" variant="ghost" onClick={() => navigate('/admin/free-design-requests')} icon={<ArrowRight size={16} />}>العودة</OpButton><OpButton size="sm" variant="primary" onClick={save} disabled={!valid || create.isPending} icon={<Save size={16} />}>{create.isPending ? 'جارٍ الحفظ...' : 'حفظ الطلب'}</OpButton></>} />
      <OpCard>
        <div className="space-y-5">
          <SearchableSelect
            label="العميل"
            value={customerId}
            onChange={setCustomerId}
            options={customerOptions}
            onSearch={setCustomerSearch}
            loading={isLoadingCustomers}
            placeholder="ابحث عن اسم العميل أو الهاتف..."
            emptyMessage="لم يتم العثور على عملاء"
          />
          <label className="block space-y-1.5"><span className="text-xs font-semibold text-[var(--color-text-secondary)]">وصف التصميم المطلوب</span><textarea rows={10} value={description} onChange={e => setDescription(e.target.value)} placeholder="اكتب تفاصيل التصميم والمقاسات والمتطلبات..." className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm leading-6 outline-none focus:border-[var(--color-accent)]" /></label>
          <p className="rounded-xl bg-[var(--color-surface-subtle)] p-3 text-xs leading-5 text-[var(--color-text-muted)]">سيتم إنشاء الطلب بحالة «جديد» ويمكن تعديل حالته لاحقاً من صفحة التفاصيل.</p>
        </div>
      </OpCard>
    </div>
  )
}
