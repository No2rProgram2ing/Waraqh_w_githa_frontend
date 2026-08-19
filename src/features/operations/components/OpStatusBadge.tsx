/**
 * OpStatusBadge — Unified status badge for operations pages ONLY.
 * Used by: Orders, Payments, Notifications, Inventory, and any other
 * operations-scoped component.
 *
 * ⚠️  Do NOT import this from catalog or shared pages (Products, Customers, etc.)
 *
 * Color strategy:
 *  Light: colored bg (100-level) + dark text (700-level) + subtle ring for contrast against white cards
 *  Dark:  /40 opacity bg for visibility against dark cards + light text (200-level) for readability
 */

interface OpStatusBadgeProps {
  status: string
  /** Optional label override; if omitted falls back to Arabic status map then raw status */
  label?: string
}

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  // ── Orders ──────────────────────────────────────────────────────────
  pending:      { label: 'قيد الانتظار', cls: 'bg-amber-100   text-amber-800   ring-1 ring-amber-300   dark:bg-amber-900/40   dark:text-amber-200   dark:ring-amber-700/60'   },
  processing:   { label: 'قيد المعالجة', cls: 'bg-blue-100    text-blue-800    ring-1 ring-blue-300    dark:bg-blue-900/40    dark:text-blue-200    dark:ring-blue-700/60'    },
  in_progress:  { label: 'قيد التنفيذ',  cls: 'bg-blue-100    text-blue-800    ring-1 ring-blue-300    dark:bg-blue-900/40    dark:text-blue-200    dark:ring-blue-700/60'    },
  completed:    { label: 'مكتمل',         cls: 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-200 dark:ring-emerald-700/60' },
  done:         { label: 'مكتمل',         cls: 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-200 dark:ring-emerald-700/60' },
  cancelled:    { label: 'ملغي',          cls: 'bg-red-100     text-red-800     ring-1 ring-red-300     dark:bg-red-900/40     dark:text-red-200     dark:ring-red-700/60'     },
  blocked:      { label: 'متوقف',         cls: 'bg-red-100     text-red-800     ring-1 ring-red-300     dark:bg-red-900/40     dark:text-red-200     dark:ring-red-700/60'     },
  refunded:     { label: 'مُستردّ',       cls: 'bg-slate-100   text-slate-700   ring-1 ring-slate-300   dark:bg-slate-700/40   dark:text-slate-200   dark:ring-slate-500/50'   },
  failed:       { label: 'فشل',          cls: 'bg-red-100     text-red-800     ring-1 ring-red-300     dark:bg-red-900/40     dark:text-red-200     dark:ring-red-700/60'     },
  in_transit:   { label: 'قيد التوصيل',   cls: 'bg-indigo-100  text-indigo-800  ring-1 ring-indigo-300  dark:bg-indigo-900/40  dark:text-indigo-200  dark:ring-indigo-700/60'  },
  received:     { label: 'مُستلم',        cls: 'bg-teal-100    text-teal-800    ring-1 ring-teal-300    dark:bg-teal-900/40    dark:text-teal-200    dark:ring-teal-700/60'    },
  // ── Payments ────────────────────────────────────────────────────────
  success:      { label: 'ناجح',         cls: 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-200 dark:ring-emerald-700/60' },
  paid:         { label: 'مدفوع',        cls: 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-200 dark:ring-emerald-700/60' },
  // ── Inventory ───────────────────────────────────────────────────────
  available:    { label: 'متوفر',        cls: 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-200 dark:ring-emerald-700/60' },
  low_stock:    { label: 'مخزون منخفض', cls: 'bg-amber-100   text-amber-800   ring-1 ring-amber-300   dark:bg-amber-900/40   dark:text-amber-200   dark:ring-amber-700/60'   },
  out_of_stock: { label: 'نفد المخزون', cls: 'bg-red-100     text-red-800     ring-1 ring-red-300     dark:bg-red-900/40     dark:text-red-200     dark:ring-red-700/60'     },
}

export function OpStatusBadge({ status, label }: OpStatusBadgeProps) {
  const entry = STATUS_MAP[status]
  const displayLabel = label ?? entry?.label ?? status
  const cls =
    entry?.cls ??
    'bg-gray-100 text-gray-700 ring-1 ring-gray-300 dark:bg-gray-700/40 dark:text-gray-200 dark:ring-gray-500/50'

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium leading-5 ${cls}`}
    >
      {displayLabel}
    </span>
  )
}
