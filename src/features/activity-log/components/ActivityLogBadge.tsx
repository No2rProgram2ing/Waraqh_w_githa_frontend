import type { ActivityLogAction } from '../types/activity-log'

const actionConfig: Record<
    'created' | 'updated' | 'deleted',
    { label: string; className: string }
> = {
    created: {
        label: 'إنشاء',
        className:
            'bg-[#EAF5DA] text-[#285B27] border border-[#B7D98B]',
    },
    updated: {
        label: 'تعديل',
        className:
            'bg-[#E8F0FF] text-[#214DA0] border border-[#A8C2F1]',
    },
    deleted: {
        label: 'حذف',
        className:
            'bg-[#FDE7E6] text-[#7E2A2A] border border-[#F0A9A4]',
    },
}

const typeConfig: Record<
    string,
    { label: string; className: string }
> = {
    AdminUser: {
        label: 'مستخدم إداري',
        className: 'bg-[#F3E8FF] text-[#6B21A8] border border-[#D8B4FE]',
    },
    Customer: {
        label: 'عميل',
        className: 'bg-[#E0F2FE] text-[#075985] border border-[#A5D8F3]',
    },
    Product: {
        label: 'منتج',
        className: 'bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]',
    },
    ProductCategory: {
        label: 'فئة منتج',
        className: 'bg-[#F0FDFF] text-[#0F766E] border border-[#99F6E4]',
    },
    ProductAttribute: {
        label: 'خاصية منتج',
        className: 'bg-[#FFF7ED] text-[#C2410C] border border-[#FED7AA]',
    },
    Order: {
        label: 'طلب',
        className: 'bg-[#EEF2FF] text-[#3730A3] border border-[#C7D2FE]',
    },
    Payment: {
        label: 'دفعة',
        className: 'bg-[#F0FDFA] text-[#115E59] border border-[#99F6E4]',
    },
    RawMaterial: {
        label: 'مادة خام',
        className: 'bg-[#FEFCE8] text-[#854D0E] border border-[#FDE68A]',
    },
    Review: {
        label: 'مراجعة',
        className: 'bg-[#FFF1F2] text-[#BE123C] border border-[#FECDD3]',
    },
    Role: {
        label: 'دور',
        className: 'bg-[#F5F3FF] text-[#5B21B6] border border-[#DDD6FE]',
    },
    Permission: {
        label: 'صلاحية',
        className: 'bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]',
    },
    Color: {
        label: 'لون',
        className: 'bg-[#FAF5FF] text-[#7E22CE] border border-[#E9D5FF]',
    },
    DesignPattern: {
        label: 'نقشة',
        className: 'bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0]',
    },
    CustomDesignRequest: {
        label: 'تصميم حر',
        className: 'bg-[#FDF2F8] text-[#9D174D] border border-[#FBCFE8]',
    },
}

function getAction(action: string): 'created' | 'updated' | 'deleted' | null {
    const normalized = action.trim().toLowerCase()

    if (normalized.startsWith('created')) return 'created'
    if (normalized.startsWith('updated')) return 'updated'
    if (normalized.startsWith('deleted')) return 'deleted'

    return null
}

function normalizeSubjectType(subjectType: string): string {
    return (subjectType.split('\\').pop() ?? subjectType).replace(
        /Model$/,
        '',
    )
}

export default function ActivityLogBadge({
    action,
}: {
    action: ActivityLogAction
}) {
    const normalizedAction = getAction(String(action))
    const badge = normalizedAction
        ? actionConfig[normalizedAction]
        : null

    return (
        <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap ${
                badge?.className ??
                'bg-[var(--color-surface-subtle)] text-[var(--color-text-secondary)] border border-[var(--color-border)]'
            }`}
        >
            {badge?.label ?? action}
        </span>
    )
}

export function ActivityLogTypeBadge({
    subjectType,
}: {
    subjectType: string
}) {
    const normalized = normalizeSubjectType(subjectType)
    const badge = typeConfig[normalized]

    return (
        <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap ${
                badge?.className ??
                'bg-[var(--color-surface-subtle)] text-[var(--color-text-secondary)] border border-[var(--color-border)]'
            }`}
        >
            {badge?.label ?? normalized}
        </span>
    )
}
