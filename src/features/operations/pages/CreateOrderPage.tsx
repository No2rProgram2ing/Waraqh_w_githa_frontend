import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  User,
  ShoppingBag,
  CreditCard,
  Plus,
  Trash2,
  Edit2,
  Search,
  CheckCircle2,
  MapPin,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { OpPageHeader } from '../components/OpPageHeader'
import { OpCard } from '../components/OpCard'
import { useCreateOrder } from '../hooks/useOrders'

interface OrderItem {
  id: string
  product_name: string
  quantity: number
  unit_price: number
  customization?: string
  image_url?: string
}

export default function CreateOrderPage() {
  const navigate = useNavigate()
  const createOrderMutation = useCreateOrder()

  // حالة العميل
  const [searchCustomer, setSearchCustomer] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState({
    name: 'فيصل القحطاني',
    phone: '+966 50 123 4567',
    address: 'الرياض، حي الملقا، طريق أنس بن مالك'
  })

  // حالة المنتجات
  const [items, setItems] = useState<OrderItem[]>([
    {
      id: '1',
      product_name: 'سلة ملكية فاخرة',
      quantity: 1,
      unit_price: 850,
      customization: 'تعديل التخصيص',
      image_url: 'https://images.unsplash.com/photo-1590736704728-f4730bb30770?w=150'
    }
  ])

  // حالة الدفع والتحصيل
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'unpaid'>('paid')
  const [paymentMethod, setPaymentMethod] = useState<'jawwal' | 'jeep' | 'kuraimi'>('kuraimi')

  // حالات التحقق والأخطاء
  const [validationError, setValidationError] = useState<string | null>(null)

  // حسابات المبالغ (مطابقة للتصميم)
  const itemsTotal = items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0)
  const customizationFee = 0 // مجاني
  const vatAmount = itemsTotal * 0.15 // ضريبة القيمة المضافة 15%
  const shippingFee = 25
  const grandTotal = itemsTotal + customizationFee + vatAmount + shippingFee

  // إضافة منتج جديد
  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        product_name: '',
        quantity: 1,
        unit_price: 0
      }
    ])
  }

  // حذف منتج
  const handleRemoveItem = (id: string) => {
    if (items.length === 1) return
    setItems(items.filter((item) => item.id !== id))
  }

  // تحديث منتج
  const handleItemChange = (id: string, field: keyof OrderItem, value: any) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    )
  }

  // التحقق الإرسال
  const validateForm = () => {
    if (!selectedCustomer.name) {
      setValidationError('يرجى اختيار العميل.')
      return false
    }
    if (items.length === 0) {
      setValidationError('يجب إضافة منتج واحد على الأقل.')
      return false
    }
    for (let i = 0; i < items.length; i++) {
      if (!items[i].product_name.trim()) {
        setValidationError(`يرجى تحديد اسم المنتج رقم ${i + 1}`)
        return false
      }
    }
    setValidationError(null)
    return true
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    const payload = {
      customer_name: selectedCustomer.name,
      customer_phone: selectedCustomer.phone,
      shipping_address: selectedCustomer.address,
      payment_status: paymentStatus,
      payment_method: paymentMethod,
      items: items.map(({ product_name, quantity, unit_price, customization }) => ({
        product_name,
        quantity,
        unit_price,
        customization
      })),
      subtotal: itemsTotal,
      vat_amount: vatAmount,
      shipping_fee: shippingFee,
      total_amount: grandTotal
    }

    createOrderMutation.mutate(payload, {
      onSuccess: () => navigate('/admin/orders')
    })
  }

  const isSubmitting = createOrderMutation.isPending
  const serverError = createOrderMutation.error
    ? (createOrderMutation.error as any)?.response?.data?.message || 'حدث خطأ أثناء إضافة الطلب'
    : null

  return (
    <div dir="rtl" className="p-6 max-w-7xl mx-auto text-right font-sans space-y-6">
      {/* الهيدر الرئيسي */}
      <div className="flex justify-between items-center pb-2">
        <div>
          <h1 className="text-xl font-bold text-gray-900">إضافة طلب جديد</h1>
          <p className="text-xs text-gray-500 mt-1">
            قم بإنشاء وتخصيص طلب جديد للعملاء عبر الخطوات التالية بكل سهولة واحترافية.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/admin/orders')}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" /> العودة للطلبات
        </button>
      </div>

      {/* شريط المساعد / الخطوات (Stepper) */}
      <div className="flex items-center justify-between bg-white p-3 px-6 rounded-2xl border border-gray-100 shadow-sm text-xs font-semibold text-gray-600">
        <div className="flex items-center gap-2 text-[#3d4b32]">
          <span className="w-6 h-6 rounded-full bg-[#3d4b32] text-white flex items-center justify-center text-[11px]">1</span>
          <span>اختيار العميل</span>
        </div>
        <div className="h-px bg-gray-200 flex-1 mx-4" />
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-[11px]">2</span>
          <span>اختيار المنتجات</span>
        </div>
        <div className="h-px bg-gray-200 flex-1 mx-4" />
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-[11px]">3</span>
          <span>تفاصيل الطلب</span>
        </div>
        <div className="h-px bg-gray-200 flex-1 mx-4" />
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-[11px]">4</span>
          <span>الدفع</span>
        </div>
      </div>

      {/* أخطاء */}
      {(validationError || serverError) && (
        <div className="flex items-center gap-2 p-4 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-xl">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{validationError || serverError}</span>
        </div>
      )}

      {/* جسم الصفحة الرئيسي: شق أيسر وشق أيمين */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* قسم النموذج الرئيسي (اليمين) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* 1. اختيار العميل */}
          <OpCard className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
                <User className="w-4 h-4 text-[#3d4b32]" />
                <h2>اختيار العميل</h2>
              </div>
              <button
                type="button"
                className="text-xs text-[#3d4b32] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> عميل جديد
              </button>
            </div>

            {/* مربع البحث */}
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute right-3.5 top-2.5" />
              <input
                type="text"
                placeholder="ابحث باسم العميل أو رقم الجوال..."
                value={searchCustomer}
                onChange={(e) => setSearchCustomer(e.target.value)}
                className="w-full pl-3 pr-10 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#3d4b32]"
              />
            </div>

            {/* العميل المحدد */}
            {selectedCustomer && (
              <div className="flex items-center justify-between p-3 bg-gray-50/80 rounded-xl border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#3d4b32]/10 text-[#3d4b32] font-bold text-xs flex items-center justify-center">
                    ف
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-gray-900">{selectedCustomer.name}</h3>
                    <p className="text-[11px] text-gray-500">{selectedCustomer.phone}</p>
                  </div>
                </div>
                <CheckCircle2 className="w-5 h-5 text-[#3d4b32] fill-[#3d4b32]/20" />
              </div>
            )}
          </OpCard>

          {/* 2. اختيار المنتجات */}
          <OpCard className="p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
                <ShoppingBag className="w-4 h-4 text-[#3d4b32]" />
                <h2>اختيار المنتجات</h2>
              </div>
              <button
                type="button"
                onClick={handleAddItem}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#3d4b32] text-white rounded-lg text-xs font-medium hover:bg-[#2e3926] transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> إضافة منتج
              </button>
            </div>

            {/* جدول المنتجات المضافة */}
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="text-gray-500 border-b border-gray-100">
                    <th className="pb-3 font-medium">المنتج</th>
                    <th className="pb-3 font-medium text-center">الكمية</th>
                    <th className="pb-3 font-medium text-center">السعر</th>
                    <th className="pb-3 font-medium text-center">التخصيص</th>
                    <th className="pb-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.map((item) => (
                    <tr key={item.id} className="align-middle">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt=""
                              className="w-10 h-10 object-cover rounded-lg border border-gray-100"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-100 rounded-lg" />
                          )}
                          <div>
                            <input
                              type="text"
                              value={item.product_name}
                              onChange={(e) =>
                                handleItemChange(item.id, 'product_name', e.target.value)
                              }
                              placeholder="اسم المنتج..."
                              className="font-semibold text-gray-900 bg-transparent border-b border-dashed border-gray-300 focus:outline-none focus:border-[#3d4b32]"
                            />
                            <p className="text-[10px] text-gray-400 mt-0.5">الوزن: 1.2 كجم</p>
                          </div>
                        </div>
                      </td>

                      {/* الكمية */}
                      <td className="py-3 text-center">
                        <div className="inline-flex items-center border border-gray-200 rounded-lg bg-white">
                          <button
                            type="button"
                            onClick={() =>
                              handleItemChange(
                                item.id,
                                'quantity',
                                Math.max(1, item.quantity - 1)
                              )
                            }
                            className="px-2 py-1 text-gray-500 hover:bg-gray-50"
                          >
                            -
                          </button>
                          <span className="px-3 font-bold text-gray-800">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() =>
                              handleItemChange(item.id, 'quantity', item.quantity + 1)
                            }
                            className="px-2 py-1 text-gray-500 hover:bg-gray-50"
                          >
                            +
                          </button>
                        </div>
                      </td>

                      {/* السعر */}
                      <td className="py-3 text-center font-bold text-gray-900">
                        <input
                          type="number"
                          value={item.unit_price}
                          onChange={(e) =>
                            handleItemChange(item.id, 'unit_price', Number(e.target.value))
                          }
                          className="w-16 text-center font-bold text-gray-900 bg-transparent border-b border-dashed border-gray-300 focus:outline-none"
                        />
                        <span className="text-[10px] text-gray-500 mr-1">ر.س</span>
                      </td>

                      {/* التخصيص */}
                      <td className="py-3 text-center">
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 text-[11px] text-amber-700 hover:underline"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>{item.customization || 'إضافة تخصيص'}</span>
                        </button>
                      </td>

                      {/* الإجراءات */}
                      <td className="py-3 text-left">
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </OpCard>

          {/* 3. الدفع والتحصيل */}
          <OpCard className="p-5 space-y-4">
            <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
              <CreditCard className="w-4 h-4 text-[#3d4b32]" />
              <h2>الدفع والتحصيل</h2>
            </div>

            {/* حالة الدفع */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentStatus('paid')}
                className={`p-3 rounded-xl border text-right transition cursor-pointer ${
                  paymentStatus === 'paid'
                    ? 'border-[#3d4b32] bg-[#3d4b32]/5 text-gray-900 font-bold'
                    : 'border-gray-200 text-gray-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs">مدفوع</span>
                  <input
                    type="radio"
                    checked={paymentStatus === 'paid'}
                    readOnly
                    className="accent-[#3d4b32]"
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-1">تم تحصيل المبلغ بالكامل</p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentStatus('unpaid')}
                className={`p-3 rounded-xl border text-right transition cursor-pointer ${
                  paymentStatus === 'unpaid'
                    ? 'border-[#3d4b32] bg-[#3d4b32]/5 text-gray-900 font-bold'
                    : 'border-gray-200 text-gray-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs">غير مدفوع</span>
                  <input
                    type="radio"
                    checked={paymentStatus === 'unpaid'}
                    readOnly
                    className="accent-[#3d4b32]"
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-1">سيتم الدفع عند الاستلام</p>
              </button>
            </div>

            {/* طريقة الدفع */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">طريقة الدفع</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'jawwal', name: 'جوال' },
                  { id: 'jeep', name: 'جيب' },
                  { id: 'kuraimi', name: 'الكريمي' }
                ].map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id as any)}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border transition cursor-pointer ${
                      paymentMethod === method.id
                        ? 'border-[#3d4b32] bg-[#3d4b32]/10 text-[#3d4b32]'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {method.name}
                  </button>
                ))}
              </div>
            </div>
          </OpCard>

          {/* أزرار الإجراء السفلية */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/admin/orders')}
              className="px-5 py-2.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 text-xs font-semibold text-white bg-[#3d4b32] hover:bg-[#2e3926] rounded-xl transition shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> جاري الحفظ...
                </>
              ) : (
                'إنشاء الطلب'
              )}
            </button>
          </div>
        </div>

        {/* قسم ملخص الطلب الجانبي (اليسار - المطابق تماماً لفيجما) */}
        <div className="lg:col-span-4 space-y-4 sticky top-6">
          <OpCard className="p-5 space-y-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100 font-bold text-sm text-gray-900">
              <ShoppingBag className="w-4 h-4 text-[#3d4b32]" />
              <h3>ملخص الطلب</h3>
            </div>

            {/* تفاصيل الحساب */}
            <div className="space-y-2.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>إجمالي المنتجات ({items.length})</span>
                <span className="font-bold text-gray-900">{itemsTotal.toLocaleString()} ر.س</span>
              </div>
              <div className="flex justify-between">
                <span>رسوم التخصيص</span>
                <span className="font-bold text-emerald-600">مجاني</span>
              </div>
              <div className="flex justify-between">
                <span>ضريبة القيمة المضافة (15%)</span>
                <span className="font-bold text-gray-900">{vatAmount.toFixed(2)} ر.س</span>
              </div>
              <div className="flex justify-between">
                <span>رسوم الشحن</span>
                <span className="font-bold text-gray-900">{shippingFee.toFixed(2)} ر.س</span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-3 flex justify-between items-center text-sm font-bold text-gray-900">
              <span>المجموع الكلي</span>
              <span className="text-base text-[#3d4b32]">{grandTotal.toLocaleString()} ر.س</span>
            </div>

            {/* عنوان الشحن */}
            <div className="bg-gray-50 p-3 rounded-xl space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5 text-gray-500 font-semibold">
                <MapPin className="w-3.5 h-3.5 text-[#3d4b32]" />
                <span>عنوان الشحن</span>
              </div>
              <p className="text-gray-800 text-[11px] font-medium leading-relaxed">
                {selectedCustomer.address}
              </p>
              <button
                type="button"
                className="text-[10px] text-[#3d4b32] font-bold hover:underline pt-1 block"
              >
                تغيير العنوان
              </button>
            </div>

            {/* بطاقة ملاحظات التخصيص/التوجيه */}
            <div className="bg-[#3d4b32]/10 p-3 rounded-xl border border-[#3d4b32]/20 text-[11px] text-[#2e3926] leading-relaxed">
              بناءً على تاريخ العميل "فيصل"، يفضل دائماً استخدام الحياكة بـ نمط "Diamond Weave" لمنتجات السلال.
            </div>
          </OpCard>
        </div>
      </form>
    </div>
  )
}