import type { ActivityLogAction } from '../types/activity-log'

const config: Record<ActivityLogAction, { label: string; className: string }> = {
    created: {
        label: 'إنشاء',
        className: 'bg-[var(--color-accent-subtle)] text-[#45592D]',
    },
    updated: {
        label: 'تعديل',
        className: 'bg-[#EAF0FB] text-[#2F5FAC]',
    },
    deleted: {
        label: 'حذف',
        className: 'bg-[var(--color-danger-subtle)] text-[var(--color-danger)]',
    },
}

interface ActivityLogBadgeProps {
    action: ActivityLogAction
}

export default function ActivityLogBadge({ action }: ActivityLogBadgeProps) {
    const { label, className } = config[action] ?? {
        label: action,
        className: 'bg-[#EBE1D7] text-[var(--color-text-secondary)]',
    }

    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${className}`}>
            {label}
        </span>
    )
}
