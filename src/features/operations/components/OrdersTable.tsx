import type { Order } from '../types/orders.types'

function stageClass(status: string) {
  switch (status) {
    case 'done':
      return 'bg-emerald-100 text-emerald-700'
    case 'in_progress':
      return 'bg-amber-100 text-amber-700'
    case 'blocked':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

export function OrdersTable({ orders, onOpen }: { orders: Order[]; onOpen: (id: number) => void }) {
  return (
    <div className="rounded-2xl border bg-white p-4">
      <table className="w-full text-right">
        <thead>
          <tr className="text-sm text-[#6d6d6d]">
            <th className="p-3">رقم الطلب</th>
            <th>العميل</th>
            <th>المنتج</th>
            <th>السعر</th>
            <th>الحالة</th>
            <th>تاريخ الإنشاء</th>
            <th>إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-t align-top">
              <td className="p-3 text-sm font-semibold">{o.order_number}</td>
              <td className="p-3 text-sm">{o.customer?.name ?? 'عميل'}</td>
              <td className="p-3 text-sm">{o.items && o.items.length ? o.items[0].name : '—'}</td>
              <td className="p-3 text-sm">{o.total.toLocaleString('ar-SA')} ر.س</td>
              <td className="p-3 text-sm"><span className={`inline-block px-3 py-1 rounded-full text-xs ${stageClass(o.status)}`}>{o.status}</span></td>
              <td className="p-3 text-sm">{new Date(o.created_at).toLocaleString('ar-SA')}</td>
              <td className="p-3 text-sm"><button onClick={() => onOpen(o.id)} className="text-sm text-[#2563eb]">عرض</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
