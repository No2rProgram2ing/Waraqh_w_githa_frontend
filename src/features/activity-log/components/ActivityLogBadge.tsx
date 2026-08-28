import type { ActivityLogAction } from '../types/activity-log'
import { Badge, type BadgeVariant } from '@/components/ui/Badge'

const config: Record<
  ActivityLogAction,
  { label: string; variant: BadgeVariant }
> = {
  created: {
    label: 'إنشاء',
    variant: 'success',
  },
  updated: {
    label: 'تعديل',
    variant: 'info',
  },
  deleted: {
    label: 'حذف',
    variant: 'danger',
  },
}

interface ActivityLogBadgeProps {
  action: ActivityLogAction
}

export default function ActivityLogBadge({
  action,
}: ActivityLogBadgeProps) {
  const current = config[action]

  return (
    <Badge variant={current?.variant ?? 'neutral'}>
      {current?.label ?? action}
    </Badge>
  )
}
