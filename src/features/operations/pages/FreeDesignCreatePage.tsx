import { useRef , useState } from 'react'
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
  const [images, setImages] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const { data: customersData, isLoading: isLoadingCustomers } = useCustomers({
    search: customerSearch,
    per_page: 50,
  })

  const customerOptions = customersData?.data?.map(c => ({
    id: c.id,
    label: c.full_name,
    sublabel: c.phone || undefined
  })) || []

  const save = () => {
    const formData = new FormData()

    formData.append(
      'customer_id',
      String(Number(customerId)),
    )

    formData.append(
      'description',
      description.trim(),
    )

    formData.append(
      'status',
      'new',
    )

    images.forEach((file) => {
      formData.append('images[]', file)
    })

    create.mutate(formData, {
      onSuccess: () =>
        navigate('/admin/free-design-requests'),
    })
  }
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
          <div className="space-y-3">
            <div>
              <label
                htmlFor="free-design-images"
                className="text-xs font-semibold text-[var(--color-text-secondary)]"
              >
                الصور المرجعية (اختياري)
              </label>

              <p className="mt-1 text-xs leading-5 text-[var(--color-text-muted)]">
                يمكنك إرفاق حتى 10 صور مرجعية، بحد أقصى 10MB للصورة الواحدة.
              </p>
            </div>

            <input
              id="free-design-images"
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              onChange={(event) => {
                const selectedFiles = Array.from(event.target.files ?? [])
                setImages(selectedFiles.slice(0, 10))
              }}
              className="block w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--color-accent-subtle)] file:px-3 file:py-2 file:text-sm file:font-medium file:text-[var(--color-accent)]"
            />

            {images.length > 0 && (
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-3">
                <p className="text-xs font-semibold text-[var(--color-text-secondary)]">
                  الصور المحددة: {images.length}
                </p>

                <div className="mt-2 space-y-1">
                  {images.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className="flex items-center justify-between gap-3 text-xs text-[var(--color-text-muted)]"
                    >
                      <span className="truncate">{file.name}</span>

                      <span className="shrink-0">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <p className="rounded-xl bg-[var(--color-surface-subtle)] p-3 text-xs leading-5 text-[var(--color-text-muted)]">سيتم إنشاء الطلب بحالة «جديد» ويمكن تعديل حالته لاحقاً من صفحة التفاصيل.</p>
        </div>
      </OpCard>
    </div>
  )
}
