    import type { DashboardOrder } from '../types/dashboard.types'

    interface LatestOrdersProps {
    orders?: DashboardOrder[]
    }

    function statusClass(status: string): string {
    switch (status) {
        case 'done':
        return 'bg-emerald-100 text-emerald-700'
        case 'in_progress':
        return 'bg-amber-100 text-amber-700'
        case 'blocked':
        return 'bg-red-100 text-red-700'
        case 'pending':
        return 'bg-blue-100 text-blue-700'
        default:
        return 'bg-gray-100 text-gray-700'
    }
    }

    function statusLabel(status: string): string {
    switch (status) {
        case 'done':
        return 'مكتمل'
        case 'in_progress':
        return 'قيد التنفيذ'
        case 'blocked':
        return 'متوقف'
        case 'pending':
        return 'قيد الانتظار'
        default:
        return status
    }
    }

    export function LatestOrders({ orders = [] }: LatestOrdersProps) {
    if (orders.length === 0) {
        return (
        <div className="rounded-2xl border bg-white p-6 text-center text-sm text-gray-500">
            لا توجد طلبات حديثة
        </div>
        )
    }

    return (
        <div className="rounded-2xl border bg-white p-4">
        <div className="space-y-3">
            {orders.map((order) => (
            <div
                key={order.id}
                className="flex items-center justify-between gap-4 border-b pb-3 last:border-b-0 last:pb-0"
            >
                <div className="min-w-0 text-right">
                <p className="truncate text-sm font-semibold">
                    #{order.order_number}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                    {order.customer?.name ?? 'عميل'}
                </p>

                <p className="mt-1 text-xs text-gray-400">
                    {new Date(order.created_at).toLocaleDateString('ar-SA')}
                </p>
                </div>

                <div className="shrink-0 text-left">
                <p className="text-sm font-semibold">
                    {Number(order.total).toLocaleString('ar-SA')} ر.س
                </p>

                <span
                    className={`mt-1 inline-block rounded-full px-3 py-1 text-xs ${statusClass(order.status)}`}
                >
                    {statusLabel(order.status)}
                </span>
                </div>
            </div>
            ))}
        </div>
        </div>
    )
    }