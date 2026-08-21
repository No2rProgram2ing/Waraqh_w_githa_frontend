import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowRight, 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  SlidersHorizontal,
  FileText,
  Palette,
  Ruler,
  Image as ImageIcon,
  Download,
  CreditCard,
  Edit3,
  Loader2,
  Printer
} from 'lucide-react'
import { toast } from 'sonner'

export default function CustomizationDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  // حالة للتحديث وتحديث الحالة
  const [isUpdating, setIsUpdating] = useState(false)

  // بيانات توضيحية لطلب التخصيص (يمكن استبدالها بـ React Query Hook لاحقاً)
  const [order, setOrder] = useState({
    id: id || 'CUST-1001',
    customer_name: 'أحمد علي',
    customer_phone: '0501234567',
    address: 'الرياض - حي النخيل - شارع التخصصي',
    created_at: '2026-08-20',
    status: 'pending' as 'pending' | 'in_progress' | 'completed' | 'cancelled',
    product_name: 'كرسي روتان مخصص (مقاس خاص)',
    color: 'روتان طبيعي فاتح / خشب طبيعي',
    quantity: 2,
    dimensions_notes: 'الارتفاع: 95 سم، العرض: 65 سم، العمق: 60 سم. يرجى التركيز على صقل أطراف الروتان بدقة عالية، وتغليف المقبض بخشب الخيزران.',
    base_price: 350,
    customization_fee: 100,
    shipping: 50,
    total: 500,
    attachments: [
      { id: 1, name: 'مخطط_الكرسي_الروتان.png', url: '#', size: '1.2 MB' },
      { id: 2, name: 'عينة_اللون_المطلوب.jpg', url: '#', size: '850 KB' },
    ],
    timeline: [
      { title: 'تم استلام طلب التخصيص', time: '2026-08-20 10:30 ص', desc: 'تم إنشاء الطلب بواسطة العميل' },
      { title: 'تحت المراجعة والتسعير', time: '2026-08-20 11:15 ص', desc: 'تم مراجعة المخططات والمواصفات من الفني' },
    ]
  })

  // تغيير حالة الطلب
  const handleStatusChange = async (newStatus: typeof order.status) => {
    setIsUpdating(true)
    try {
      // هنا يتم استدعاء API تحديث الحالة
      await new Promise((res) => setTimeout(res, 600)) // محاكاة الـ API
      setOrder((prev) => ({ ...prev, status: newStatus }))
      toast.success('تم تحديث حالة الطلب بنجاح')
    } catch (err) {
      toast.error('حدث خطأ أثناء تحديث الحالة')
    } finally {
      setIsUpdating(false)
    }
  }

  // شارة الحالة Visual
  const renderStatusBadge = (status: typeof order.status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5" /> قيد المراجعة
          </span>
        )
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <SlidersHorizontal className="w-3.5 h-3.5" /> جاري التنفيذ
          </span>
        )
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> مكتمل
          </span>
        )
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5" /> ملغى
          </span>
        )
    }
  }

  return (
    <motion.div
      dir="rtl"
      className="p-6 max-w-7xl mx-auto space-y-6 pb-12"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* 1. الشريط العلوي والتحكم */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/customizations')}
            className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 transition"
            title="رجوع للقائمة"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-gray-900">طلب تخصيص #{order.id}</h1>
              {renderStatusBadge(order.status)}
            </div>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" /> تاريخ الطلب: {order.created_at}
            </p>
          </div>
        </div>

        {/* إتاحة طباعة الطلب وتغيير الحالة */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            <Printer className="w-4 h-4" /> طباعة
          </button>

          <div className="relative">
            <select
              disabled={isUpdating}
              value={order.status}
              onChange={(e) => handleStatusChange(e.target.value as any)}
              className="appearance-none bg-gray-50 border border-gray-300 rounded-xl pr-3 pl-8 py-2 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#3d4b32] disabled:opacity-50 cursor-pointer"
            >
              <option value="pending">قيد المراجعة</option>
              <option value="in_progress">جاري التنفيذ</option>
              <option value="completed">مكتمل</option>
              <option value="cancelled">ملغى</option>
            </select>
            {isUpdating && (
              <Loader2 className="w-3.5 h-3.5 animate-spin absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
            )}
          </div>
        </div>
      </div>

      {/* 2. شبكة المحتوى الرئيسي */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* العمود الأيمن (2/3): التفاصيل والمرفقات */}
        <div className="lg:col-span-2 space-y-6">

          {/* كرت تفاصيل الطلب والمواصفات */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5">
            <h2 className="flex items-center gap-2 text-base font-bold text-gray-800 border-b pb-3">
              <Ruler className="w-5 h-5 text-[#3d4b32]" />
              مواصفات التخصيص والمقاسات
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50/70 p-4 rounded-xl border border-gray-100">
              <div>
                <span className="text-xs text-gray-500 block mb-1">المنتج / الخامة المطلوبة:</span>
                <span className="text-sm font-semibold text-gray-800">{order.product_name}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block mb-1">اللون / اللمسة النهائية:</span>
                <span className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-[#3d4b32]" />
                  {order.color}
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block mb-1">الكمية المطلوبة:</span>
                <span className="text-sm font-semibold text-gray-800">{order.quantity} قطع</span>
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-gray-700 block mb-2">تعليمات القياسات والتفصيل:</span>
              <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-100 text-sm text-gray-700 leading-relaxed">
                {order.dimensions_notes || 'لا توجد ملاحظات قياسات إضافية.'}
              </div>
            </div>
          </div>

          {/* كرت المرفقات والمخططات المرفقة */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="flex items-center gap-2 text-base font-bold text-gray-800 border-b pb-3">
              <ImageIcon className="w-5 h-5 text-[#3d4b32]" />
              المخططات والصور المرجعية ({order.attachments.length})
            </h2>

            {order.attachments.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {order.attachments.map((file) => (
                  <div 
                    key={file.id} 
                    className="flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:border-[#3d4b32] transition group bg-white shadow-xs"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#3d4b32] flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-semibold text-gray-800 truncate group-hover:text-[#3d4b32]">
                          {file.name}
                        </p>
                        <span className="text-[10px] text-gray-400">{file.size}</span>
                      </div>
                    </div>

                    <a 
                      href={file.url} 
                      download 
                      className="p-2 text-gray-400 hover:text-[#3d4b32] hover:bg-gray-100 rounded-lg transition"
                      title="تحميل"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 text-center py-6">لا توجد صور أو صور مرفقة مع هذا الطلب</p>
            )}
          </div>

          {/* خط زمني للأحداث (Timeline) */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="flex items-center gap-2 text-base font-bold text-gray-800 border-b pb-3">
              <Clock className="w-5 h-5 text-[#3d4b32]" />
              سجل نشاط الطلب
            </h2>

            <div className="relative pr-4 border-r-2 border-gray-100 space-y-6 my-2">
              {order.timeline.map((item, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute -right-[21px] top-1 w-3 h-3 rounded-full bg-[#3d4b32] ring-4 ring-white" />
                  <div>
                    <h4 className="text-xs font-bold text-gray-800">{item.title}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                    <span className="text-[10px] text-gray-400 mt-1 block">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* العمود الأيسر (1/3): العميل والمالية */}
        <div className="space-y-6">

          {/* كرت بيانات العميل */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="flex items-center gap-2 text-base font-bold text-gray-800 border-b pb-3">
              <User className="w-5 h-5 text-[#3d4b32]" />
              معلومات العميل
            </h2>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-start gap-3">
                <User className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <span className="text-gray-400 block">اسم العميل</span>
                  <span className="font-semibold text-gray-800 text-sm">{order.customer_name}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <span className="text-gray-400 block">رقم الهاتف</span>
                  <a href={`tel:${order.customer_phone}`} className="font-semibold text-[#3d4b32] hover:underline dir-ltr text-sm block">
                    {order.customer_phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <span className="text-gray-400 block">عنوان التوصيل</span>
                  <span className="font-medium text-gray-700">{order.address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* كرت ملخص التسعير والتكلفة */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="flex items-center gap-2 text-base font-bold text-gray-800 border-b pb-3">
              <CreditCard className="w-5 h-5 text-[#3d4b32]" />
              التسعير والحساب الإجمالي
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>السعر الأساسي ({order.quantity} قطع):</span>
                <span className="font-semibold text-gray-800">{order.base_price * order.quantity} ر.س</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>رسوم التخصيص والتفصيل:</span>
                <span className="font-semibold text-gray-800">{order.customization_fee} ر.س</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>رسوم الشحن التقديرية:</span>
                <span className="font-semibold text-gray-800">{order.shipping} ر.س</span>
              </div>

              <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between items-center text-sm">
                <span className="font-bold text-gray-900">المبلغ الإجمالي:</span>
                <span className="text-base font-extrabold text-[#3d4b32]">{order.total} ر.س</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </motion.div>
  )
}