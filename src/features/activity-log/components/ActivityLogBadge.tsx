import type { ActivityLogAction } from '../types/activity-log'

const config: Record<ActivityLogAction, { label: string; className: string }> = {
    created: {
        label: 'إنشاء',
        className: 'bg-[#EAF5DA] text-[#285B27] border border-[#B7D98B]',
    },
    updated: {
        label: 'تعديل',
        className: 'bg-[#E8F0FF] text-[#214DA0] border border-[#A8C2F1]',
    },
    deleted: {
        label: 'حذف',
        className: 'bg-[#FDE7E6] text-[#7E2A2A] border border-[#F0A9A4]',
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
