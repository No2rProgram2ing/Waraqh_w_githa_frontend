import { motion } from "framer-motion";
import { Check, ChevronLeft, CircleHelp, CreditCard, MapPin, PackageCheck, Pencil, Truck } from "lucide-react";
import { Link } from "react-router-dom";

import { AccountLayout } from "@/layouts/AccountLayout";
import { OrderListCard } from "@/features/orders/components/OrderListCard";
import { useOrders } from "@/features/orders/useOrders";
import { ROUTES } from "@/routes/paths";

interface TimelineStep {
  title: string;
  detail: string;
  status: "complete" | "current" | "upcoming";
  icon: typeof Check;
}

const timeline: TimelineStep[] = [
  { title: "تم الاستلام", detail: "14 يونيو 2023", status: "complete", icon: Check },
  { title: "قيد التصنيع", detail: "15 يونيو 2023", status: "complete", icon: PackageCheck },
  { title: "بانتظار الموافقة", detail: "إجراء مطلوب", status: "current", icon: CreditCard },
  { title: "في الطريق", detail: "متوقع 22 يونيو", status: "upcoming", icon: Truck },
  { title: "تم التوصيل", detail: "لم يتم التوصيل", status: "upcoming", icon: PackageCheck },
];

const products = [
  { name: "صينية ورقة يدوية", subtitle: "خشب طبيعي - مقاس متوسط", price: "450 ر.س", image: "https://images.unsplash.com/photo-1595521624992-48a59aef95c3?auto=format&fit=crop&w=300&q=85" },
  { name: "طقم قواعد أكواب جِذع", subtitle: "خشب طبيعي - 6 قطع", price: "180 ر.س", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=300&q=85" },
];

function Timeline() {
  return (
    <div className="relative flex items-start justify-between gap-1 px-1 py-2">
      <div className="absolute right-[9%] left-[9%] top-7 h-px bg-[#d5d3ca]" />
      <div className="absolute right-[9%] top-7 h-px w-[43%] bg-[#52663c]" />

      {timeline.map(({ title, detail, status, icon: Icon }) => (
        <div key={title} className="relative z-10 flex min-w-0 flex-1 flex-col items-center text-center">
          <span
            className={`flex size-9 items-center justify-center rounded-full border-2 ${
              status === "complete"
                ? "border-[#52663c] bg-[#52663c] text-white"
                : status === "current"
                  ? "border-[#52663c] bg-[#718658] text-white"
                  : "border-[#d5d3ca] bg-[#f8f6f1] text-[#aaa99f]"
            }`}
          >
            <Icon className="size-4" />
          </span>
          <strong className={`mt-3 text-[10px] sm:text-xs ${status === "upcoming" ? "text-[#aaa99f]" : "text-[#52663c]"}`}>
            {title}
          </strong>
          <span className="mt-1 text-[9px] text-[#8e8d84]">{detail}</span>
        </div>
      ))}
    </div>
  );
}

export function OrdersPage() {
  const { data, isLoading, isError, error } = useOrders();
  const orders = data?.data ?? [];

  return (
    <AccountLayout>
      <motion.main
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        dir="rtl"
        className="bg-[#f5f3ef] px-5 py-12 text-[#26291f] sm:py-16"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-xs font-bold tracking-[0.16em] text-[#8b7652]">طلباتي</p>
              <h1 className="mt-2 text-3xl font-bold text-[#52663c] sm:text-4xl">قائمة الطلبات</h1>
              <p className="mt-2 text-xs text-[#77766d]">عرض سجلك من الطلبات السابقة والحالية. اضغط على "التفاصيل" أو "تتبع الطلب" لكل طلب.</p>
            </div>
            <Link to={ROUTES.products} className="hidden items-center gap-1 text-xs font-bold text-[#52663c] sm:flex">
              متابعة التسوق <ChevronLeft className="size-4" />
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_270px]">
            <div className="space-y-5">
              <section className="grid gap-5 border border-[#e0ddd5] bg-[#fbfaf7] p-5 shadow-sm sm:grid-cols-[1fr_230px] sm:items-center">
                <div>
                  <p className="text-xs font-bold text-[#8b7652]">الحالة الحالية</p>
                  <h2 className="mt-2 text-2xl font-bold text-[#52663c]">مراجعة مرحلة الإنتاج</h2>
                  <p className="mt-3 text-sm leading-7 text-[#77766d]">
                    وصلت قطعتك لمرحلة التشطيب النهائي. يرجى مراجعة التفاصيل أدناه قبل أن نبدأ في عملية التغليف والشحن.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button type="button" className="inline-flex items-center gap-2 rounded-sm bg-[#52663c] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#3e522c]">
                      موافقة على المنتج <Check className="size-4" />
                    </button>
                    <button type="button" className="inline-flex items-center gap-2 rounded-sm border border-[#b99b7e] bg-[#fbfaf7] px-5 py-3 text-xs font-bold text-[#795238]">
                      طلب تعديل <Pencil className="size-4" />
                    </button>
                  </div>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=700&q=85"
                  alt="كرسي خشبي مصنوع يدوياً"
                  className="h-48 w-full object-cover sm:h-44"
                />
              </section>

              <section className="border border-[#e0ddd5] bg-[#fbfaf7] p-5">
                <h2 className="border-b border-[#e6e2da] pb-4 text-lg font-bold text-[#52663c]">تفاصيل المنتجات</h2>
                <div className="divide-y divide-[#e6e2da]">
                  {products.map((product) => (
                    <article key={product.name} className="flex items-center gap-4 py-4">
                      <img src={product.image} alt={product.name} className="size-14 object-cover" />
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-bold text-[#26291f]">{product.name}</h3>
                        <p className="mt-1 text-[10px] text-[#77766d]">{product.subtitle}</p>
                      </div>
                      <strong className="text-sm text-[#795238]">{product.price}</strong>
                    </article>
                  ))}
                </div>
              </section>
            </div>

            <aside className="space-y-5">
              <section className="border border-[#e0ddd5] bg-[#eeece7] p-5">
                <div className="flex items-center gap-2 text-[#52663c]">
                  <MapPin className="size-4" />
                  <h2 className="font-bold">عنوان الشحن</h2>
                </div>
                <p className="mt-4 text-sm font-bold">أحمد بن محمد</p>
                <p className="mt-2 text-xs leading-6 text-[#77766d]">
                  حي السلام، شارع الأمل
                  <br />
                  الرياض، 13524
                  <br />
                  المملكة العربية السعودية
                </p>
                <p className="mt-3 text-[10px] text-[#77766d]">+967 65 xxx xxxx</p>
              </section>

              <section className="border border-[#e0ddd5] bg-[#eeece7] p-5">
                <div className="flex items-center gap-2 text-[#52663c]">
                  <CreditCard className="size-4" />
                  <h2 className="font-bold">طريقة الدفع</h2>
                </div>
                <p className="mt-4 flex justify-between text-xs">
                  <span>مدى (بطاقة الولاء)</span>
                  <strong>•••• 4421</strong>
                </p>
                <div className="mt-4 space-y-3 border-t border-[#d8d4cb] pt-4 text-xs">
                  <p className="flex justify-between">
                    <span>المجموع الفرعي</span>
                    <strong>630 ر.س</strong>
                  </p>
                  <p className="flex justify-between">
                    <span>الشحن</span>
                    <strong className="text-[#52663c]">مجاني</strong>
                  </p>
                  <p className="flex justify-between text-base font-bold text-[#52663c]">
                    <span>الإجمالي</span>
                    <strong>630 ر.س</strong>
                  </p>
                </div>
              </section>

              <section className="border border-[#abd7b4] bg-[#e3f2e4] p-5 text-center">
                <CircleHelp className="mx-auto size-5 text-[#35a95c]" />
                <h2 className="mt-3 text-sm font-bold text-[#315a38]">هل تحتاج مساعدة؟</h2>
                <p className="mt-2 text-[10px] text-[#5d7860]">نحن هنا دائماً لمساعدتك</p>
              </section>
            </aside>
          </div>

          <p className="mt-6 border border-[#e3dfd6] bg-[#fbfaf7] p-4 text-center text-[10px] text-[#77766d]">
            يمكنك تعديل طلبك قبل أن ينتقل إلى مرحلة التغليف. سياسة التعديل والشروط تنطبق.
          </p>

          <div className="mt-8 space-y-3">
            {isLoading && <div className="text-center text-sm text-[#666a61]">جارٍ تحميل الطلبات...</div>}
            {isError && (
              <div className="text-center text-sm text-[#cc3333]">
                فشل تحميل الطلبات.
                <div className="mt-1 text-xs text-[#aa3333]">
                  {(() => {
                    const resp = (error as any)?.response;
                    if (resp) return `رمز الاستجابة: ${resp.status} — ${resp.data?.message ?? JSON.stringify(resp.data)}`;
                    return (error as any)?.message ?? String(error);
                  })()}
                </div>
              </div>
            )}
            {!isLoading && !isError && orders.length === 0 && (
              <div className="text-center text-sm text-[#666a61]">لا توجد طلبات لعرضها.</div>
            )}

            {orders.map((order) => (
              <OrderListCard key={order.id} order={order} />
            ))}
          </div>
        </div>
      </motion.main>
    </AccountLayout>
  );
}

