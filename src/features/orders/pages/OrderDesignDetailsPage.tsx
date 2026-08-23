import { motion } from "framer-motion";
import { ArrowRight, PackageCheck, Truck, WalletCards } from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { customerApi } from "@/api/customerApi";
import { AccountLayout } from "@/layouts/AccountLayout";
import type { CustomRequest } from "@/features/custom-requests/types";
import { showErrorToast } from "@/lib/toast";

interface OrderDesignApiResource {
  id: number | string;
  order_number?: string;
  status?: string;
  customer?: {
    name?: string;
    phone?: string;
  };
  design_details?: {
    dimensions?: string;
    material_type?: string;
    notes?: string;
    attachments?: Array<{ url?: string; name?: string } | string>;
  };
  created_at?: string;
}

const normalizeOrderDesignDetail = (payload: any): OrderDesignApiResource => {
  const data = payload?.data ?? payload;

  return {
    id: data?.id ?? "-",
    order_number: data?.order_number ?? data?.orderNumber ?? "-",
    status: data?.status ?? "pending",
    customer: data?.customer ?? {},
    design_details: data?.design_details ?? data?.designDetails ?? {
      dimensions: "-",
      material_type: "-",
      notes: "-",
      attachments: [],
    },
    created_at: data?.created_at ?? data?.createdAt ?? null,
  };
};

const fetchOrderDesignDetail = async (id: string) => {
  const endpoints = [`/customer/orders/${id}`, `/orders/${id}`];
  let lastError: unknown;

  for (const endpoint of endpoints) {
    try {
      const res = await customerApi.get(endpoint);
      return normalizeOrderDesignDetail(res.data);
    } catch (error) {
      lastError = error;
      const status = (error as any)?.response?.status;
      if (status !== 404 && status !== 405) {
        throw error;
      }
    }
  }

  throw lastError ?? new Error("Failed to load order design details");
};

export function OrderDesignDetailsPage() {
  const navigate = useNavigate();
  const { orderId, designId } = useParams<{ orderId?: string; designId?: string }>();
  const location = useLocation();
  const customRequest = (location.state as any)?.customRequest as CustomRequest | undefined;
  const detailId = orderId ?? designId;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["order-design-detail", detailId],
    queryFn: () => {
      if (!detailId) {
        throw new Error("لا يوجد معرف الطلب");
      }
      return fetchOrderDesignDetail(detailId);
    },
    enabled: !!detailId,
    retry: false,
  });

  const details = data ?? null;

  const statusText =
    details?.status && typeof details.status === "string"
      ? details.status
      : customRequest?.statusText ?? customRequest?.status ?? "غير محدد";

  const customerName = details?.customer?.name ?? customRequest?.customerName ?? "غير محدد";
  const orderNumber = details?.order_number ?? customRequest?.id ?? detailId ?? "-";
  const createdAt = details?.created_at ? new Date(details.created_at).toLocaleDateString("ar-EG") : customRequest?.date ?? "-";
  const dimensions = details?.design_details?.dimensions ?? (customRequest as any)?.dimensions ?? "غير محدد";
  const material = details?.design_details?.material_type ?? (customRequest as any)?.material ?? "غير محدد";
  const notes = details?.design_details?.notes ?? customRequest?.description ?? "لا توجد معلومات وصفية.";
  const attachments = details?.design_details?.attachments ?? [];

  if (isError) {
    const message = (error as any)?.response?.data?.message ?? "تعذر تحميل تفاصيل الطلب.";
    showErrorToast(message);
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
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#4a5c39] transition hover:text-[#37482d]"
        >
          <ArrowRight size={18} />
          العودة
        </button>

        {isLoading ? (
          <div className="rounded-[24px] border border-[#e4dfd8] bg-[#f8f5f1] p-8 text-center text-sm text-[#5b6156]">
            جارٍ تحميل تفاصيل الطلب...
          </div>
        ) : isError ? (
          <div className="rounded-[24px] border border-[#f1d3d3] bg-[#fff7f7] p-6 text-right text-sm text-[#7a2d2d]">
            <p className="font-semibold">تعذر تحميل تفاصيل الطلب.</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-3 rounded-xl bg-[#4a5c39] px-3 py-2 text-white transition hover:bg-[#3f4f32]"
            >
              إعادة المحاولة
            </button>
          </div>
        ) : (
          <>
            <div className="rounded-[24px] border border-[#e4dfd8] bg-[#f8f5f1] p-4 shadow-[0_10px_22px_-18px_rgba(38,47,26,0.25)] sm:p-5">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[12px] font-bold tracking-[0.2em] text-[#7e7d75]">رقم الطلب</p>
                  <h1 className="mt-1 text-[30px] font-black text-[#1f231d]">{orderNumber}</h1>
                </div>

                <div className="rounded-2xl border border-[#dfe3d0] bg-[#edf2e7] px-4 py-2 text-[13px] font-bold text-[#3d4d2d]">
                  {statusText}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-[18px] border border-[#e8e0d5] bg-white p-4">
                  <div className="mb-3 flex items-center gap-2 text-[#4a5c39]">
                    <WalletCards size={18} />
                    <span className="text-[12px] font-bold">العميل</span>
                  </div>
                  <p className="text-[16px] font-bold text-[#1f231d]">{customerName}</p>
                </div>

                <div className="rounded-[18px] border border-[#e8e0d5] bg-white p-4">
                  <div className="mb-3 flex items-center gap-2 text-[#4a5c39]">
                    <Truck size={18} />
                    <span className="text-[12px] font-bold">تاريخ الطلب</span>
                  </div>
                  <p className="text-[18px] font-bold text-[#1f231d]">{createdAt}</p>
                </div>

                <div className="rounded-[18px] border border-[#e8e0d5] bg-white p-4">
                  <div className="mb-3 flex items-center gap-2 text-[#4a5c39]">
                    <PackageCheck size={18} />
                    <span className="text-[12px] font-bold">حالة</span>
                  </div>
                  <p className="text-[18px] font-bold text-[#1f231d]">{statusText}</p>
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-[#e4dfd8] bg-[#f5f2ed] p-4 sm:p-5">
              <h2 className="mb-4 text-[18px] font-extrabold text-[#1f231d]">تفاصيل التصميم</h2>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="col-span-2 space-y-4">
                  <div className="rounded-[14px] bg-white p-4">
                    <h3 className="mb-2 text-[14px] font-bold">وصف التصميم</h3>
                    <p className="text-[#666a61]">{notes}</p>
                  </div>

                  <div className="rounded-[14px] bg-white p-4">
                    <h3 className="mb-2 text-[14px] font-bold">مواصفات فنية</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm text-[#444]">
                      <div className="flex flex-col">
                        <span className="text-[#7e7d75]">الخامة</span>
                        <span className="font-semibold">{material}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[#7e7d75]">الأبعاد</span>
                        <span className="font-semibold">{dimensions}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[#7e7d75]">الهاتف</span>
                        <span className="font-semibold">{details?.customer?.phone ?? "-"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[14px] bg-white p-4">
                    <h3 className="mb-2 text-[14px] font-bold">مرفقات ورسومات</h3>
                    {attachments.length > 0 ? (
                      <div className="grid grid-cols-2 gap-3">
                        {attachments.map((attachment, index) => {
                          const src = typeof attachment === "string" ? attachment : attachment?.url;
                          const name = typeof attachment === "string" ? `مرفق ${index + 1}` : attachment?.name ?? `مرفق ${index + 1}`;

                          return (
                            <div key={`${name}-${index}`} className="h-36 overflow-hidden rounded-lg border border-[#ece7e2] bg-[#faf7f4]">
                              {src ? (
                                <img src={src} alt={name} className="h-full w-full object-cover" />
                              ) : (
                                <div className="flex h-full items-center justify-center text-sm text-[#6c7268]">{name}</div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-[#666a61]">لا توجد صور مرفقة.</div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-[14px] bg-white p-4">
                    <h4 className="text-[13px] font-bold text-[#7e7d75]">تفاصيل الطلب</h4>
                    <div className="mt-3 space-y-2 text-sm text-[#555]">
                      <div><strong>العميل:</strong> {customerName}</div>
                      <div><strong>رقم الطلب:</strong> {orderNumber}</div>
                      <div><strong>التاريخ:</strong> {createdAt}</div>
                    </div>
                  </div>

                  <div className="rounded-[14px] bg-white p-4">
                    <h4 className="text-[13px] font-bold text-[#7e7d75]">ملاحظات التصميم</h4>
                    <p className="mt-2 text-sm text-[#555]">{notes}</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </motion.section>
    </AccountLayout>
  );
}