import { Card } from '@/components/ui/Card'

export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <div dir="rtl">
      <Card className="p-6">
        <h2 className="text-lg font-bold mb-2">{title}</h2>
        <p className="text-sm text-[#6d6d6d]">هذه الصفحة تم إعدادها كسكِلتون. سيتم ربطها بالـ API عند تنفيذ الميّزات المتعلقة بها.</p>
      </Card>
    </div>
  )
}
