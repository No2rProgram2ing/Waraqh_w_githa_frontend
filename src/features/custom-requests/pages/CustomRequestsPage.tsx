import { useState } from 'react'
import { motion } from 'framer-motion'
import { AccountLayout } from '@/layouts/AccountLayout'
import { Button } from '@/components/ui/Button'
import { PlusIcon, SparkleIcon } from '@/components/ui/icons'
import { Card } from '@/components/ui/Card'
import { ShowcaseCard } from '@/features/custom-requests/components/ShowcaseCard'
import type { ShowcaseCardData } from '@/features/custom-requests/types'
import { NewRequestModal } from '@/features/custom-requests/components/NewRequestModal'
import { useCustomRequests } from '@/features/custom-requests/hooks/useCustomRequests'
import type { CreateCustomRequestInput } from '@/api/customRequestsApi'

const cards: ShowcaseCardData[] = [
  {
    id: 'panel-1',
    title: 'لوحة جدارية فاخرة',
    subtitle:
      'تغليف عربي أنيق مع لمسات من الخشب الطبيعي وراحة عصرية في تفاصيل كل زاوية.',
    date: '٢٨ أبريل ٢٠٢٤',
    status: 'مكتمل',
    accent: '8/10',
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'ديكور خشبي',
  },
  {
    id: 'panel-2',
    title: 'طاولة وركيزة مغروسة',
    subtitle:
      'تصميم مخصص يجمع بين العمارة اليمنية والهوية الحديثة مع خيط دقيق في التشطيبات.',
    date: '١٦ أبريل ٢٠٢٤',
    status: 'قيد التنفيذ',
    accent: '٧/١٠',
    image:
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'طاولة خشبية',
  },
]

export function CustomRequestsPage() {
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false)
  const { createRequest, isCreating } = useCustomRequests()

  const handleCreateRequest = async (
    input: CreateCustomRequestInput,
  ) => {
    await createRequest(input)
  }

  return (
    <AccountLayout>
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="flex flex-col gap-6"
        dir="rtl"
      >
        <div className="flex items-center justify-between gap-3 pt-1">
          <h1 className="text-2xl font-extrabold text-[var(--color-text-primary)] sm:text-[27px]">
            طلبات التصميم الخاص
          </h1>

          <Button
            type="button"
            onClick={() => setIsRequestModalOpen(true)}
            className="h-12 rounded-xl px-5 text-[15px] font-bold"
          >
            <span>طلب جديد</span>
            <PlusIcon className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          {cards.map((card, index) => (
            <ShowcaseCard
              key={card.id}
              card={card}
              index={index}
            />
          ))}
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, delay: 0.12 }}
            className="flex min-h-57.5 flex-col items-center justify-center gap-5 rounded-3xl border border-[var(--color-accent)]/20 bg-[var(--color-accent)] p-6 text-center text-white shadow-sm"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-white/10">
              <SparkleIcon className="h-7 w-7 text-[var(--color-warning)]" />
            </div>

            <div className="space-y-2">
              <p className="text-lg font-bold">
                هل لديك فكرة فريدة؟
              </p>

              <p className="max-w-xs text-[13px] leading-7 text-white/80">
                نساعدك في تحويل أفكارك إلى قطعة فنية متكاملة تناسب
                أسلوب منزلك وتراثك المميز.
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => setIsRequestModalOpen(true)}
              className="h-11 rounded-xl border-transparent bg-[var(--color-warning)] px-6 font-bold text-[var(--color-text-primary)] hover:bg-[var(--color-accent-hover)]"
            >
              <span>استئناف الطلب</span>
            </Button>
          </motion.div>

          <Card className="flex min-h-57.5 flex-col justify-between overflow-hidden p-5">
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-accent)]">
                <SparkleIcon className="h-4 w-4" />
              </div>

              <span className="text-[11px] font-medium text-[var(--color-text-muted)]">
                سبت ١٢ يوليو
              </span>
            </div>

            <div className="space-y-2">
              <p className="text-[15px] font-bold text-[var(--color-text-primary)]">
                مواصفات مشروعك
              </p>

              <p className="text-[13px] leading-7 text-[var(--color-text-secondary)]">
                نقدم لك متابعة دقيقة لكل مرحلة من الخطة، من اختيار
                الخامة إلى التنفيذ النهائي لضمان النتيجة المتوقعة.
              </p>
            </div>

            <div className="rounded-[18px] border border-dashed border-[var(--color-border-muted)] bg-[var(--color-surface-subtle)] p-3">
              <div className="h-24 rounded-[14px] bg-[linear-gradient(135deg,var(--color-border-muted)_0%,var(--color-surface-subtle)_50%,var(--color-border-muted)_100%)]" />
            </div>
          </Card>
        </div>
      </motion.section>

      <NewRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onSubmit={handleCreateRequest}
        isLoading={isCreating}
      />
    </AccountLayout>
  )
}