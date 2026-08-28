import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import {
  MapPinIcon,
  PhoneIcon,
  CheckCircleIcon,
} from '@/components/ui/icons'
import type { AddressItem } from '@/features/addresses/types'

interface AddressCardProps {
  address: AddressItem
}

export function AddressCard({
  address,
}: AddressCardProps) {
  const isPrimary = address.isPrimary

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Card
        interactive
        className="flex h-full flex-col justify-between gap-5 rounded-[22px] p-5 text-right"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-[var(--color-accent-subtle)] px-2.5 py-1 text-[11px] font-semibold text-[var(--color-accent)]">
              {address.type === 'work'
                ? 'عنوان العمل'
                : address.type === 'home'
                  ? 'العنوان الأساسي'
                  : 'عنوان آخر'}
            </span>

            {isPrimary && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-success-subtle)] px-2 py-1 text-[10px] font-bold text-[var(--color-success)]">
                <CheckCircleIcon
                  className="h-3.5 w-3.5"
                  aria-hidden="true"
                />
                مفضل
              </span>
            )}
          </div>

          <Button
            type="button"
            variant="ghost"
            className="h-9 rounded-full px-3 text-xs font-medium text-[var(--color-accent)] hover:bg-[var(--color-accent-subtle)]"
          >
            تعديل
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-surface-subtle)] text-[var(--color-accent)]">
              <MapPinIcon
                className="h-4 w-4"
                aria-hidden="true"
              />
            </div>

            <div>
              <p className="text-[15px] font-bold text-[var(--color-text-primary)]">
                {address.title}
              </p>

              <p className="text-xs text-[var(--color-text-muted)]">
                {address.city}
              </p>
            </div>
          </div>

          <p className="text-[13px] leading-7 text-[var(--color-text-secondary)]">
            {address.address}
          </p>

          <div className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] px-3 py-2 text-[13px] text-[var(--color-text-secondary)]">
            <PhoneIcon
              className="h-4 w-4 text-[var(--color-accent)]"
              aria-hidden="true"
            />

            <span dir="ltr">{address.phone}</span>
          </div>
        </div>

        {address.note && (
          <p className="rounded-xl bg-[var(--color-surface-subtle)] px-3 py-2 text-xs text-[var(--color-text-secondary)]">
            {address.note}
          </p>
        )}
      </Card>
    </motion.article>
  )
}