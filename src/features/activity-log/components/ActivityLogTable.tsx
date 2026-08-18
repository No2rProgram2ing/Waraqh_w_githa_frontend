import type { ActivityLog } from '../types/activity-log'
import ActivityLogBadge from './ActivityLogBadge'
import { EmptyState } from '@/components/shared/EmptyState'
import { TableShell } from '@/components/shared/TableShell'

interface ActivityLogTableProps {
    logs: ActivityLog[]
}

function formatDate(iso: string): string {
    return new Intl.DateTimeFormat('ar-SA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(iso))
}

export default function ActivityLogTable({ logs }: ActivityLogTableProps) {
    if (!logs.length) {
        return <EmptyState>لا توجد سجلات نشاط.</EmptyState>
    }
    return (
        <TableShell>
                <thead>
                    <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)] text-right">
                        <th className="px-5 py-3.5 font-semibold text-[var(--color-text-secondary)]">المستخدم</th>
                        <th className="px-5 py-3.5 font-semibold text-[var(--color-text-secondary)]">الإجراء</th>
                        <th className="px-5 py-3.5 font-semibold text-[var(--color-text-secondary)]">النوع</th>
                        <th className="px-5 py-3.5 font-semibold text-[var(--color-text-secondary)]">المعرّف</th>
                        <th className="px-5 py-3.5 font-semibold text-[var(--color-text-secondary)]">الوصف</th>
                        <th className="px-5 py-3.5 font-semibold text-[var(--color-text-secondary)] text-left whitespace-nowrap">الوقت</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                    {logs.map((log) => (
                        <tr key={log.id} className="hover:bg-[var(--color-surface)] transition-colors">
                            <td className="px-5 py-4 font-medium text-[var(--color-text-primary)] whitespace-nowrap">
                                {log.user_name ?? '—'}
                            </td>
                            <td className="px-5 py-4">
                                <ActivityLogBadge action={log.action} />
                            </td>
                            <td className="px-5 py-4">
                                <code className="inline-block rounded-md border border-[var(--color-border)] bg-[var(--color-surface-subtle)] px-2.5 py-1 text-xs font-medium text-[var(--color-text-primary)]">
                                    {log.subject_type}
                                </code>
                            </td>
                            <td className="px-5 py-4 font-mono text-sm text-[var(--color-text-primary)] text-center">
                                {log.subject_id ?? '—'}
                            </td>
                            <td className="px-5 py-4 text-[var(--color-text-primary)] max-w-md break-words leading-6">
                                {log.description ?? '—'}
                            </td>
                            <td className="px-5 py-4 text-[var(--color-text-muted)] text-left whitespace-nowrap text-xs">
                                {formatDate(log.created_at)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </TableShell>
    )
}
