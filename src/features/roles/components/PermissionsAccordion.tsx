import { useMemo } from 'react'
import type { RolePermission } from '../types/role'

interface PermissionsAccordionProps {
    permissions: RolePermission[]
    selectedIds: Set<number>
    onChange: (id: number, checked: boolean) => void
}

export default function PermissionsAccordion({
    permissions,
    selectedIds,
    onChange,
}: PermissionsAccordionProps) {
    const groups = useMemo(() => {
        const map = new Map<string, RolePermission[]>()
        permissions.forEach((perm) => {
            if (!map.has(perm.group)) map.set(perm.group, [])
            map.get(perm.group)!.push(perm)
        })
        return Array.from(map.entries())
    }, [permissions])

    if (!groups.length) {
        return (
            <p className="text-sm text-[var(--color-text-muted)] text-center py-6">
                لا توجد صلاحيات متاحة.
            </p>
        )
    }

    return (
        <div className="divide-y divide-[#EBE1D7]" dir="rtl">
            {groups.map(([group, perms]) => {
                const groupSelected = perms.filter((p) => selectedIds.has(p.id)).length
                const allSelected = groupSelected === perms.length

                const toggleGroup = () => {
                    perms.forEach((p) => onChange(p.id, !allSelected))
                }

                return (
                    <details key={group} className="group" open>
                        <summary className="flex items-center justify-between cursor-pointer select-none py-3 px-1 hover:bg-[var(--color-surface)] rounded-lg list-none">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm text-[var(--color-text-primary)]">{group}</span>
                                <span className="text-xs bg-[#EBE1D7] text-[var(--color-text-secondary)] rounded-full px-2 py-0.5">
                                    {groupSelected}/{perms.length}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={(e) => { e.preventDefault(); toggleGroup() }}
                                    className="text-xs text-[#45592D] hover:underline"
                                >
                                    {allSelected ? 'إلغاء الكل' : 'تحديد الكل'}
                                </button>
                                <svg className="w-4 h-4 text-[var(--color-text-muted)] transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </summary>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pb-3 pt-1 px-2">
                            {perms.map((perm) => (
                                <label
                                    key={perm.id}
                                    className="flex items-center gap-2.5 cursor-pointer rounded-lg p-2 hover:bg-[var(--color-surface)] transition-colors"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.has(perm.id)}
                                        onChange={(e) => onChange(perm.id, e.target.checked)}
                                        className="h-4 w-4 accent-[#45592D] rounded"
                                    />
                                    <span className="text-sm text-[var(--color-text-secondary)]">{perm.display_name}</span>
                                </label>
                            ))}
                        </div>
                    </details>
                )
            })}
        </div>
    )
}
