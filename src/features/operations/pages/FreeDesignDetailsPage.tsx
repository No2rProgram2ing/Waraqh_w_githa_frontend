import { useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowRight, Image, Save, Trash2 } from 'lucide-react'

import {
  useDeleteFreeDesign,
  useDeleteFreeDesignImage,
  useFreeDesign,
  useUpdateFreeDesign,
} from '../hooks/useFreeDesigns'

import type { FreeDesignStatus } from '../types/freeDesign.types'

import { OpButton } from '../components/OpButton'
import { OpCard } from '../components/OpCard'
import { OpEmptyState } from '../components/OpEmptyState'
import { OpPageHeader } from '../components/OpPageHeader'
import { OpStatusBadge } from '../components/OpStatusBadge'
import { showErrorToast, showSuccessToast } from '@/lib/toast'

export default function FreeDesignDetailsPage() {
  const { id } = useParams()
  const requestId = Number(id)
  const navigate = useNavigate()
  const query = useFreeDesign(requestId)
  const update = useUpdateFreeDesign()
  const remove = useDeleteFreeDesign()
  const removeImage = useDeleteFreeDesignImage()
  const item = query.data?.data
  const [status, setStatus] = useState<FreeDesignStatus | ''>('')
  const [description, setDescription] = useState<string | null>(null)
  const [images, setImages] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  if (query.isLoading) return <div dir="rtl" className="min-h-[300px]"><OpEmptyState>جاري تحميل الطلب...</OpEmptyState></div>
  if (query.isError || !item) return <div dir="rtl" className="min-h-[300px]"><OpEmptyState tone="error">تعذر تحميل الطلب.</OpEmptyState></div>

  const currentStatus = status || item.status
  const currentDescription =
    description !== null
      ? description
      : item.description || ''

    const save = () => {
      const formData = new FormData()

      formData.append('status', currentStatus)
      formData.append('description', currentDescription)

      images.forEach((file) => {
        formData.append('images[]', file)
      })

      update.mutate(
        {
          id: requestId,
          payload: formData,
        },
        {
          onSuccess: () => {
            showSuccessToast('تم تحديث طلب التصميم الحر بنجاح')
            setImages([])

            if (fileInputRef.current) {
              fileInputRef.current.value = ''
            }
          },
          onError: (error: any) => {
            showErrorToast(
              error?.response?.data?.message ||
                'فشل في تحديث طلب التصميم الحر، يرجى المحاولة مرة أخرى.',
            )
          },
        },
      )
    }

  const destroy = () => {
    if (!window.confirm('هل أنت متأكد من حذف الطلب؟')) return

    remove.mutate(requestId, {
      onSuccess: () => {
        showSuccessToast('تم حذف طلب التصميم الحر بنجاح')
        navigate('/admin/free-design-requests')
    },
    onError: (error: any) => {
      showErrorToast(
        error?.response?.data?.message ||
          'فشل في حذف طلب التصميم الحر، يرجى المحاولة مرة أخرى.',
      )
    },
  })
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
        <OpCard className="lg:col-span-3">
          <div className="space-y-5">
            <div>
              <h2 className="font-bold text-[var(--color-text-primary)]">
                الصور المرجعية
              </h2>

              <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                الصور المرفقة لتوضيح التصميم المطلوب.
              </p>
            </div>

            {item.images && item.images.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {item.images.map((image) => (
                  <div
                    key={image.id}
                    className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)]"
                  >
                    <a
                      href={image.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group block"
                    >
                      <img
                        src={image.url}
                        alt="صورة مرجعية للتصميم"
                        className="aspect-square w-full object-cover transition-transform duration-200 group-hover:scale-105"
                      />
                    </a>

                    <div className="flex items-center justify-between gap-2 px-3 py-2">
                      <a
                        href={image.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-accent)]"
                      >
                        <Image className="h-3.5 w-3.5" />
                        <span>فتح الصورة</span>
                      </a>

                      <button
                        type="button"
                        disabled={removeImage.isPending}
                        onClick={() => {
                          if (!window.confirm('هل أنت متأكد من حذف هذه الصورة؟')) {
                            return
                          }

                          removeImage.mutate(
                            {
                              requestId,
                              imageId: image.id,
                            },
                            {
                              onSuccess: () => {
                                showSuccessToast('تم حذف الصورة بنجاح')
                              },
                              onError: (error: any) => {
                                showErrorToast(
                                  error?.response?.data?.message ||
                                    'فشل في حذف الصورة، يرجى المحاولة مرة أخرى.',
                                )
                              },
                            },
                          )   
                        }}
                        className="rounded-lg p-2 text-[var(--color-text-muted)] transition hover:bg-[var(--color-danger-subtle)] hover:text-[var(--color-danger)] disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="حذف الصورة"
                        title="حذف الصورة"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-[var(--color-border)] p-4 text-center text-sm text-[var(--color-text-muted)]">
                لا توجد صور مرجعية مرفقة حاليًا.
              </div>
            )}

            <div className="space-y-3 border-t border-[var(--color-border)] pt-5">
              <div>
                <label
                  htmlFor="free-design-additional-images"
                  className="text-xs font-semibold text-[var(--color-text-secondary)]"
                >
                  إضافة صور مرجعية جديدة (اختياري)
                </label>

                <p className="mt-1 text-xs leading-5 text-[var(--color-text-muted)]">
                  يمكنك إضافة صور جديدة إلى الطلب، بحد أقصى 10 صور، وحجم 10MB للصورة الواحدة.
                </p>
              </div>

              <input
                id="free-design-additional-images"
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                multiple
                onChange={(event) => {
                  const selectedFiles = Array.from(event.target.files ?? [])
                  setImages(selectedFiles.slice(0, 10))
                }}
                className="block w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)]"
              />

              {images.length > 0 && (
                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-3">
                  <p className="text-xs font-semibold text-[var(--color-text-secondary)]">
                    الصور الجديدة: {images.length}
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
          </div>
        </OpCard>
              
      
        
        
      </div>
    </div>
  )
}
