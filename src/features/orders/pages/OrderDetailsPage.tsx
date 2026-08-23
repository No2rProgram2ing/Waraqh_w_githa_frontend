import { motion } from "framer-motion";
import { ArrowRight, PackageCheck, Truck, WalletCards } from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { AccountLayout } from "@/layouts/AccountLayout";
import { useOrderDetails } from "@/features/orders/useOrderDetails";
import type { CustomRequest } from "@/features/custom-requests/types";

export function OrderDetailsPage() {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();
  const customRequest = (location.state as any)?.customRequest as CustomRequest | undefined;

  // If a custom request was passed via navigation state, render its details
  if (customRequest) {
    return (
      <AccountLayout>
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          dir="rtl"
          className="space-y-5"
        >
          <button
            type="button"
            aria-label="العودة إلى الطلبات المخصصة"
            onClick={() => navigate("/custom-requests")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#4a5c39] transition hover:text-[#37482d]"
          >
            <ArrowRight size={18} />
            العودة إلى الطلبات المخصصة
          </button>

          <div className="rounded-[24px] border border-[#e4dfd8] bg-[#f8f5f1] p-4 shadow-[0_10px_22px_-18px_rgba(38,47,26,0.25)] sm:p-5">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[12px] font-bold tracking-[0.2em] text-[#7e7d75]">رقم الطلب المخصص</p>
                <h1 className="mt-1 text-[30px] font-black text-[#1f231d]">{customRequest.id}</h1>
              </div>

              <div className="rounded-2xl border border-[#dfe3d0] bg-[#edf2e7] px-4 py-2 text-[13px] font-bold text-[#3d4d2d]">
                {customRequest.statusText || customRequest.status}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-[18px] border border-[#e8e0d5] bg-white p-4">
                <div className="mb-3 flex items-center gap-2 text-[#4a5c39]">
                  <WalletCards size={18} />
                  <span className="text-[12px] font-bold">تاريخ الإنشاء</span>
                </div>
                <p className="text-[22px] font-extrabold text-[#1f231d]">{customRequest.date}</p>
              </div>

              <div className="rounded-[18px] border border-[#e8e0d5] bg-white p-4">
                <div className="mb-3 flex items-center gap-2 text-[#4a5c39]">
                  <Truck size={18} />
                  <span className="text-[12px] font-bold">حالة الطلب</span>
                </div>
                <p className="text-[18px] font-bold text-[#1f231d]">{customRequest.statusText || customRequest.status}</p>
              </div>

              <div className="rounded-[18px] border border-[#e8e0d5] bg-white p-4">
                <div className="mb-3 flex items-center gap-2 text-[#4a5c39]">
                  <PackageCheck size={18} />
                  <span className="text-[12px] font-bold">الحرفي المكلف</span>
                </div>
                <p className="text-[18px] font-bold text-[#1f231d]">{customRequest.artisanName ?? "غير محدد"}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-[#e4dfd8] bg-[#f5f2ed] p-4 sm:p-5">
            <h2 className="mb-4 text-[18px] font-extrabold text-[#1f231d]">تفاصيل التصميم</h2>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="col-span-2 space-y-4">
                <div className="bg-white rounded-[14px] p-4">
                  <h3 className="text-[14px] font-bold mb-2">الوصف</h3>
                  <p className="text-[#666a61]">{customRequest.title} — {customRequest.description}</p>
                </div>

                <div className="bg-white rounded-[14px] p-4">
                  <h3 className="text-[14px] font-bold mb-2">المواصفات الفنية</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm text-[#444]">
                    <div className="flex flex-col">
                      <span className="text-[#7e7d75]">الخامة</span>
                      <span className="font-semibold">خشب طبيعي (مثال)</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[#7e7d75]">اللمسات النهائية</span>
                      <span className="font-semibold">طلي زيتي مع تشطيب مات</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[#7e7d75]">الأبعاد</span>
                      <span className="font-semibold">120 × 60 × 40 سم</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[#7e7d75]">اللون / لوحة الألوان</span>
                      <span className="font-semibold">بني داكن مع لمسات ذهبية</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-[14px] p-4">
                  <h3 className="text-[14px] font-bold mb-2">الملفات المرفقة والرسومات</h3>
                  {customRequest.imageUrl ? (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="h-36 overflow-hidden rounded-lg">
                        <img src={customRequest.imageUrl} alt={customRequest.title} className="h-full w-full object-cover" />
                      </div>
                      <div className="h-36 overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center text-[#888]">مرفق إضافي</div>
                    </div>
                  ) : (
                    <div className="text-[#666a61]">لا توجد ملفات مرفقة.</div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button aria-label="طلب تعديل التصميم" className="rounded-xl bg-[#4f5f3d] px-4 py-2 text-white font-bold">طلب تعديل التصميم</button>
                  <button aria-label="اعتماد التصميم" className="rounded-xl border border-[#4f5f3d] px-4 py-2 font-bold">اعتماد التصميم</button>
                  <button aria-label="تنزيل الملفات" className="rounded-xl bg-[#f3f3f3] px-4 py-2 font-bold">تنزيل الملفات</button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white rounded-[14px] p-4">
                  <h4 className="text-[13px] font-bold text-[#7e7d75]">حالة التصميم</h4>
                  <div className="mt-2">
                    <span className="inline-block rounded-full bg-[#e6f4ea] px-3 py-1 text-sm font-semibold text-[#28723b]">{customRequest.statusText || customRequest.status}</span>
                  </div>

                  <div className="mt-4 text-sm text-[#555]">
                    <div><strong>الحرفي المكلف:</strong> {customRequest.artisanName ?? "غير محدد"}</div>
                    <div className="mt-1"><strong>تاريخ الإنشاء:</strong> {customRequest.date}</div>
                    <div className="mt-1"><strong>الميزانية التقريبية:</strong> غير محددة</div>
                  </div>
                </div>

                <div className="bg-white rounded-[14px] p-4">
                  <h4 className="text-[13px] font-bold text-[#7e7d75]">الجدول الزمني</h4>
                  <ul className="mt-3 space-y-2 text-sm text-[#555]">
                  <li>تأكيد الطلب — مكتمل</li>
                    <li>إعداد التصميم — قيد التنفيذ</li>
                  <li>التنفيذ — لم يبدأ بعد</li>
                  </ul>
                </div>

                <div className="bg-white rounded-[14px] p-4">
                  <h4 className="text-[13px] font-bold text-[#7e7d75]">التواصل والملاحظات</h4>
                  <div className="mt-2 text-sm text-[#666]">لم تبدأ أي محادثات بعد. ابدأ محادثة مع الحرفي أو فريق الدعم لمناقشة التفاصيل والموارد المطلوبة.</div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      </AccountLayout>
    );
  }

  // Use hook to fetch order details from backend
  const idParam = (orderId ?? "").trim();
  const { data: order, isLoading, isError, error } = useOrderDetails(idParam);

  if (isLoading) {
    return (
      <AccountLayout>
        <div dir="rtl" className="space-y-4 rounded-[20px] border border-[#e3ddd2] bg-[#f8f5f1] p-6 shadow-sm">
          <div className="text-center text-sm text-[#666a61]">جارٍ تحميل تفاصيل الطلب...</div>
        </div>
      </AccountLayout>
    );
  }

  if (isError) {
    const status = (error as any)?.response?.status;

    if (status === 404) {
      return (
        <AccountLayout>
          <div dir="rtl" className="space-y-4 rounded-[20px] border border-[#e3ddd2] bg-[#f8f5f1] p-6 shadow-sm">
            <button
              type="button"
              aria-label="العودة إلى قائمة الطلبات"
              onClick={() => navigate("/orders")}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#4a5c39]"
            >
              <ArrowRight size={18} />
              العودة إلى قائمة الطلبات
            </button>

            <div className="rounded-[18px] border border-dashed border-[#d2c9bc] bg-[#f2ede7] p-8 text-center">
              <p className="text-[16px] font-bold text-[#1f231d]">لم نتمكن من العثور على الطلب</p>
              <p className="mt-2 text-[13px] text-[#666a61]">الرجاء التحقق من الرابط أو العودة إلى قائمة الطلبات لمراجعة طلباتك.</p>
            </div>
          </div>
        </AccountLayout>
      );
    }

    return (
      <AccountLayout>
        <div dir="rtl" className="space-y-4 rounded-[20px] border border-[#e3ddd2] bg-[#f8f5f1] p-6 shadow-sm">
          <div className="text-center text-sm text-[#cc3333]">فشل تحميل تفاصيل الطلب. يرجى المحاولة لاحقًا.</div>
        </div>
      </AccountLayout>
    );
  }

  if (!order) {
    return (
      <AccountLayout>
        <div dir="rtl" className="space-y-4 rounded-[20px] border border-[#e3ddd2] bg-[#f8f5f1] p-6 shadow-sm">
          <div className="text-center text-sm text-[#666a61]">لا توجد بيانات متاحة لهذا الطلب.</div>
        </div>
      </AccountLayout>
    );
  }

  return (
    <AccountLayout>
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        dir="rtl"
        className="space-y-5"
      >
        <button
          type="button"
          aria-label="العودة إلى قائمة الطلبات"
          onClick={() => navigate("/orders")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#4a5c39] transition hover:text-[#37482d]"
        >
          <ArrowRight size={18} />
          العودة إلى قائمة الطلبات
        </button>

        <div className="rounded-[24px] border border-[#e4dfd8] bg-[#f8f5f1] p-4 shadow-[0_10px_22px_-18px_rgba(38,47,26,0.25)] sm:p-5">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[12px] font-bold tracking-[0.2em] text-[#7e7d75]">رقم الطلب</p>
              <h1 className="mt-1 text-[30px] font-black text-[#1f231d]">{order?.id ?? "-"}</h1>
            </div>

            <div className="rounded-2xl border border-[#dfe3d0] bg-[#edf2e7] px-4 py-2 text-[13px] font-bold text-[#3d4d2d]">
              {order?.status ?? "-"}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[18px] border border-[#e8e0d5] bg-white p-4">
              <div className="mb-3 flex items-center gap-2 text-[#4a5c39]">
                <WalletCards size={18} />
                <span className="text-[12px] font-bold">المبلغ الإجمالي</span>
              </div>
              <p className="text-[22px] font-extrabold text-[#1f231d]">{order?.price ?? "0.00"}</p>
            </div>

            <div className="rounded-[18px] border border-[#e8e0d5] bg-white p-4">
              <div className="mb-3 flex items-center gap-2 text-[#4a5c39]">
                <Truck size={18} />
                <span className="text-[12px] font-bold">تاريخ الإنشاء</span>
              </div>
              <p className="text-[18px] font-bold text-[#1f231d]">{order?.year ?? "-"}/{order?.month ?? "-"}</p>
            </div>

            <div className="rounded-[18px] border border-[#e8e0d5] bg-white p-4">
              <div className="mb-3 flex items-center gap-2 text-[#4a5c39]">
                <PackageCheck size={18} />
                <span className="text-[12px] font-bold">حالة الشحن</span>
              </div>
              <p className="text-[18px] font-bold text-[#1f231d]">{order?.status ?? "-"}</p>
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-[#e4dfd8] bg-[#f5f2ed] p-4 sm:p-5">
          <h2 className="mb-4 text-[18px] font-extrabold text-[#1f231d]">تفاصيل الطلب</h2>

          <div className="mb-4">
            <h3 className="mb-3 text-[15px] font-bold">المنتجات في هذا الطلب</h3>

            {order?.items && order.items.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-right text-[#444]">
                  <thead className="text-xs text-[#7e7d75]">
                    <tr>
                      <th className="p-3">المنتج</th>
                      <th className="p-3">الكمية</th>
                      <th className="p-3">سعر الوحدة</th>
                      <th className="p-3">المجموع</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((it) => {
                      const parsePrice = (s: string) => Number(String(s).replace(/,/g, ""));
                      const unit = parsePrice(it.unitPrice || "0");
                      const lineTotal = unit * (it.quantity || 0);
                      const fmt = (n: number) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

                      return (
                        <tr key={it.id} className="border-t border-[#efe8df]">
                          <td className="p-3">{it.name}</td>
                          <td className="p-3">{it.quantity}</td>
                          <td className="p-3">{fmt(unit)}</td>
                          <td className="p-3 font-semibold">{fmt(lineTotal)}</td>
                        </tr>
                      );
                    })}

                    <tr className="border-t border-[#e6ddd0]">
                      <td className="p-3 font-bold">الإجمالي</td>
                      <td />
                      <td />
                      <td className="p-3 font-extrabold">
                        {(() => {
                          const parsePrice = (s: string) => Number(String(s).replace(/,/g, ""));
                          const total = parsePrice(order?.price || "0");
                          return total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                        })()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-[#666a61]">لا توجد منتجات مضافة لهذا الطلب.</div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 text-[14px] text-[#484d46] md:grid-cols-2">
            <div className="flex items-start gap-3 rounded-[14px] bg-white p-4">
              <div className="rounded-md bg-[#eef6f9] p-2 text-[#3b5568]">
                <WalletCards size={20} />
              </div>
              <div className="flex-1">
                <div className="text-[13px] text-[#7e7d75]">طريقة الدفع</div>
                <div className="mt-1 font-bold text-[#1f231d]">{(order as any)?.paymentMethod || "بطاقة بنكية"}</div>
                <div className="mt-1 text-sm text-[#666]">{(order as any)?.paymentNote || ""}</div>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-[14px] bg-white p-4">
              <div className="rounded-md bg-[#f6f6f1] p-2 text-[#4a5c39]">
                <Truck size={20} />
              </div>
              <div className="flex-1">
                <div className="text-[13px] text-[#7e7d75]">عنوان التسليم</div>
                <div className="mt-1 font-bold text-[#1f231d]">{(order as any)?.deliveryAddress || "الرياض، المملكة العربية السعودية"}</div>
                <div className="mt-1 text-sm text-[#666]">{(order as any)?.deliveryInstructions || ""}</div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </AccountLayout>
  );
}
