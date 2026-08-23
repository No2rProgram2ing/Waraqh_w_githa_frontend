import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { AccountLayout } from "@/layouts/AccountLayout";
import { ordersApi } from "@/api/ordersApi";
import { ROUTES } from "@/routes/paths";

export function OrderTrackingPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const [tracking, setTracking] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (!orderId) return;

    const fetchTracking = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const resp = await ordersApi.getTracking(orderId);
        const payload = resp.data?.data ?? resp.data;
        if (mounted) setTracking(payload ?? null);
      } catch (err) {
        console.error("Failed to fetch tracking", err);
        if (mounted) setIsError(true);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchTracking();
    return () => { mounted = false };
  }, [orderId]);

  return (
    <AccountLayout>
      <motion.main initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} dir="rtl" className="bg-[#f5f3ef] px-5 py-12 text-[#26291f] sm:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#52663c]">تتبع الطلب</h1>
            <p className="mt-2 text-sm text-[#77766d]">عرض حالة الشحن والتحديثات الحية للطلب #{orderId}</p>
            <div className="mt-4">
              <Link to={ROUTES.orders} className="text-sm text-[#52663c]">العودة إلى الطلبات</Link>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center text-sm text-[#666a61]">جارٍ تحميل بيانات التتبع…</div>
          ) : isError ? (
            <div className="text-center text-sm text-[#cc3333]">فشل تحميل بيانات التتبع. يرجى المحاولة لاحقاً.</div>
          ) : !tracking ? (
            <div className="text-center text-sm text-[#666a61]">لا توجد بيانات تتبع لهذا الطلب.</div>
          ) : (
            <section className="space-y-6">
              {/* Example rendering: adapt to backend payload shape */}
              <div className="rounded-[18px] border bg-white p-4">
                <h2 className="text-lg font-bold text-[#52663c]">حالة الشحنة الحالية</h2>
                <p className="mt-2 text-sm text-[#444]">{tracking.current_status ?? tracking.status ?? '—'}</p>
                {tracking.eta && <p className="mt-1 text-xs text-[#77766d]">المتوقع: {tracking.eta}</p>}
              </div>

              {Array.isArray(tracking.timeline) && (
                <div className="rounded-[18px] border bg-white p-4">
                  <h3 className="text-sm font-bold text-[#52663c]">سجل التتبع</h3>
                  <ol className="mt-3 divide-y">
                    {tracking.timeline.map((step: any, idx: number) => (
                      <li key={idx} className="py-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-semibold">{step.title ?? step.status}</div>
                            <div className="text-xs text-[#77766d]">{step.detail ?? step.date}</div>
                          </div>
                          <div className="text-xs text-[#666a61]">{step.location ?? ''}</div>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {tracking.shipper && (
                <div className="rounded-[18px] border bg-white p-4">
                  <h3 className="text-sm font-bold text-[#52663c]">تفاصيل الناقل</h3>
                  <p className="text-sm">{tracking.shipper.name ?? tracking.shipper}</p>
                  {tracking.shipper.tracking_url && (
                    <p className="mt-2 text-xs text-[#52663c]"><a href={tracking.shipper.tracking_url} target="_blank" rel="noreferrer">فتح صفحة تتبع الناقل</a></p>
                  )}
                </div>
              )}
            </section>
          )}
        </div>
      </motion.main>
    </AccountLayout>
  );
}
