import { useState } from 'react'
import { GripVertical, Plus, Pencil, Trash2, Save } from 'lucide-react'
import { OpButton } from '../components/OpButton'
import { OpCard, OpCardSection } from '../components/OpCard'
import { OpEmptyState } from '../components/OpEmptyState'
import { OpPageHeader } from '../components/OpPageHeader'
import { OpModal } from '../components/OpModal'
import { Link } from 'react-router-dom'
import {
  useCreateProductionStage,
  useDeleteProductionStage,
  useProductionStages,
  useReorderProductionStages,
  useUpdateProductionStageDefinition,
} from '../hooks/useProduction'
import { showErrorToast, showSuccessToast } from '@/lib/toast'

interface StageForm {
  name: string
  sort_order: string
}

const initialForm: StageForm = {
  name: '',
  sort_order: '1',
}

export default function ProductionPage() {
  const { data: stages, isLoading, isError } = useProductionStages()

  const create = useCreateProductionStage()
  const update = useUpdateProductionStageDefinition()
  const remove = useDeleteProductionStage()
  const reorder = useReorderProductionStages()
  const [draggedId, setDraggedId] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<StageForm>(initialForm)
  const [error, setError] = useState('')

  const openCreate = () => {
    const nextSortOrder = stages?.length ? stages.length + 1 : 1

    setEditingId(null)
    setForm({
      name: '',
      sort_order: String(nextSortOrder),
    })
    setError('')
    setIsModalOpen(true)
  }

  const openEdit = (stage: {
    id: number
    name: string
    sort_order: number
  }) => {
    setEditingId(stage.id)
    setForm({
      name: stage.name,
      sort_order: String(stage.sort_order),
    })
    setError('')
    setIsModalOpen(true)
  }

  const closeModal = () => {
    if (create.isPending || update.isPending) return

    setIsModalOpen(false)
    setEditingId(null)
    setForm(initialForm)
    setError('')
  }

  const handleSave = async () => {
    const name = form.name.trim()
    const sortOrder = Number(form.sort_order)

    if (!name) {
      setError('اسم مرحلة الإنتاج مطلوب.')
      return
    }

    if (!Number.isInteger(sortOrder) || sortOrder < 1) {
      setError('ترتيب المرحلة يجب أن يكون رقمًا صحيحًا أكبر من صفر.')
      return
    }

    setError('')

    try {
      if (editingId === null) {
        await create.mutateAsync({
          name,
          sort_order: sortOrder,
        })
      } else {
        await update.mutateAsync({
          id: editingId,
          name,
          sort_order: sortOrder,
        })
      }

      closeModal()
    } catch (err: unknown) {
      const response = (
        err as {
          response?: {
            data?: {
              message?: string
              errors?: Record<string, string[]>
            }
          }
        }
      )?.response

      const validationErrors = response?.data?.errors

      if (validationErrors) {
        const firstMessage = Object.values(validationErrors).flat()[0]

        setError(
          firstMessage ??
            'تعذر حفظ مرحلة الإنتاج. يرجى التحقق من البيانات.',
        )
        return
      }

      setError(
        response?.data?.message ??
          'تعذر حفظ مرحلة الإنتاج. يرجى المحاولة مرة أخرى.',
      )
    }
  }

  const handleDelete = async (id: number, name: string) => {
    const confirmed = window.confirm(
      `هل أنت متأكد من حذف مرحلة "${name}"؟`,
    )

    if (!confirmed) return

    try {
      await remove.mutateAsync(id)
    } catch (err: unknown) {
      const response = (
        err as {
          response?: {
            data?: {
              message?: string
            }
          }
        }
      )?.response

      window.alert(
        response?.data?.message ??
          'تعذر حذف مرحلة الإنتاج. يرجى المحاولة مرة أخرى.',
      )
    }
  }

  const busy =
    create.isPending ||
    update.isPending ||
    remove.isPending

  const handleDrop = async (targetId: number) => {
    if (draggedId === null || draggedId === targetId || !stages) {
      setDraggedId(null)
      return
    }

    const currentIndex = stages.findIndex((stage) => stage.id === draggedId)
    const targetIndex = stages.findIndex((stage) => stage.id === targetId)

    if (currentIndex === -1 || targetIndex === -1) {
      setDraggedId(null)
      return
    }

    const reordered = [...stages]
    const [movedStage] = reordered.splice(currentIndex, 1)

    if (!movedStage) {
      setDraggedId(null)
      return
    }

    reordered.splice(targetIndex, 0, movedStage)

    try {
      await reorder.mutateAsync(reordered.map((stage) => stage.id))
      showSuccessToast('تم تحديث ترتيب مراحل الإنتاج بنجاح')
    } catch (error: unknown) {
      const response = (
        error as {
          response?: {
            data?: {
              message?: string
            }
          }
        }
      )?.response

      showErrorToast(
        response?.data?.message ??
          'تعذر تحديث ترتيب مراحل الإنتاج، يرجى المحاولة مرة أخرى.',
      )
    } finally {
      setDraggedId(null)
    }
  }
  return (
    <div className="space-y-6" dir="rtl">
      <OpPageHeader
          title="مراحل الإنتاج"
          description="إدارة مراحل الإنتاج المعتمدة في النظام وترتيبها الحالي."
          action={
            <div className="flex items-center gap-2">
              <Link
                to="../orders"
                className="inline-flex items-center justify-center rounded-xl bg-[var(--color-accent)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--color-accent-hover)]"
              >
                الانتقال إلى الطلبات
              </Link>

              <OpButton
                size="sm"
                variant="primary"
                onClick={openCreate}
                icon={<Plus size={16} />}
              >
                إضافة مرحلة
              </OpButton>
            </div>
          }
        />

      <OpCard variant="table">
        <OpCardSection>
          <div>
            <h2 className="text-sm font-bold text-[var(--color-text-primary)]">
              تسلسل مراحل الإنتاج
            </h2>
          
          </div>

          {stages?.length ? (
            <span className="rounded-full bg-[var(--color-surface-subtle)] px-3 py-1 text-xs text-[var(--color-text-muted)]">
              {stages.length} مراحل
            </span>
          ) : null}
        </OpCardSection>

        {isLoading ? (
          <OpEmptyState>
            جارٍ تحميل مراحل الإنتاج...
          </OpEmptyState>
        ) : isError ? (
          <OpEmptyState tone="error">
            تعذر تحميل مراحل الإنتاج من الخادم.
          </OpEmptyState>
        ) : !stages?.length ? (
          <OpEmptyState>
            لا توجد مراحل إنتاج معرفة في النظام.
          </OpEmptyState>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {stages.map((stage, index) => (
              <div
                key={stage.id}
                draggable={!busy && !reorder.isPending}
                onDragStart={() => setDraggedId(stage.id)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => void handleDrop(stage.id)}
                onDragEnd={() => setDraggedId(null)}
                className={[
                  'flex flex-wrap items-center gap-4 px-5 py-4 transition',
                  'hover:bg-[var(--color-surface-subtle)]',
                  draggedId === stage.id ? 'opacity-50' : '',
                  !busy && !reorder.isPending ? 'cursor-grab active:cursor-grabbing' : '',
                ].join(' ')}
              >
                <div
                  className="flex h-10 w-8 shrink-0 items-center justify-center text-[var(--color-text-muted)]"
                  aria-hidden="true"
                >
                  <GripVertical size={18} />
                </div>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-surface-subtle)] font-bold text-[var(--color-text-primary)]">
                  {index + 1}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-[var(--color-text-primary)]">
                    {stage.name}
                  </div>

                  <div className="mt-1 text-xs text-[var(--color-text-muted)]">
                    ترتيب المرحلة: {stage.sort_order}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <OpButton
                    size="sm"
                    variant="ghost"
                    onClick={() => openEdit(stage)}
                    icon={<Pencil size={15} />}
                    disabled={busy || reorder.isPending}
                  >
                    تعديل
                  </OpButton>

                  <OpButton
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      void handleDelete(stage.id, stage.name)
                    }
                    icon={<Trash2 size={15} />}
                    disabled={busy || reorder.isPending}
                  >
                    حذف
                  </OpButton>
                </div>
              </div>
            ))}
          </div>
        )}
      </OpCard>

      <OpCard>
        <div className="space-y-3">
          <h2 className="font-bold text-[var(--color-text-primary)]">
            تغيير مرحلة طلب
          </h2>

          <p className="text-sm leading-6 text-[var(--color-text-muted)]">
            إدارة مراحل الطلب نفسه تتم من داخل تفاصيل الطلب باستخدام مدير مراحل الإنتاج.
          </p>

          <Link
            to="../orders"
            className="inline-flex text-sm font-semibold text-[var(--color-accent)] hover:underline"
          >
            عرض الطلبات
          </Link>
        </div>
      </OpCard>

      <OpModal
        open={isModalOpen}
        onClose={closeModal}
        title={
          editingId === null
            ? 'إضافة مرحلة إنتاج'
            : 'تعديل مرحلة الإنتاج'
        }
        description="أدخل اسم المرحلة وترتيبها ثم احفظ التغييرات."
      >
        <div className="space-y-5">
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
              اسم المرحلة
            </span>

            <input
              type="text"
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
              placeholder="مثال: القص"
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
              disabled={busy}
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
              ترتيب المرحلة
            </span>

            <input
              type="number"
              min="1"
              step="1"
              value={form.sort_order}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  sort_order: event.target.value,
                }))
              }
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)]"
              disabled={busy}
            />
          </label>

          {error ? (
            <div className="rounded-xl bg-[var(--color-danger-subtle)] px-4 py-3 text-sm text-[var(--color-danger)]">
              {error}
            </div>
          ) : null}

          <div className="flex justify-end gap-2 border-t border-[var(--color-border)] pt-4">
            <OpButton
              variant="ghost"
              onClick={closeModal}
              disabled={busy}
            >
              إلغاء
            </OpButton>

            <OpButton
              variant="primary"
              onClick={() => void handleSave()}
              disabled={busy}
              icon={<Save size={16} />}
            >
              {busy
                ? 'جارٍ الحفظ...'
                : editingId === null
                  ? 'إضافة المرحلة'
                  : 'حفظ التعديل'}
            </OpButton>
          </div>
        </div>
      </OpModal>
    </div>
  )
}
