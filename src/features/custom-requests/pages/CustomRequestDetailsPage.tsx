import { motion } from "framer-motion";
import { CalendarDays, Check, ChevronLeft, Image as ImageIcon, Ruler, Sparkles } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { CatalogLayout } from "@/layouts/CatalogLayout";
import { ROUTES } from "@/routes/paths";
import { useEffect, useState } from "react";
import { customRequestsApi, type CustomRequestItem } from "@/api/customRequestsApi";

const gallery = [
  "https://images.unsplash.com/photo-1595521624992-48a59aef95c3?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=500&q=85",
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=500&q=85",
];

const stages = ["تم إرسال الطلب", "قيد المراجعة", "بانتظار الموافقة", "قيد التنفيذ", "تم التسليم"];

export function CustomRequestDetailsPage() {
  const { requestId } = useParams<{ requestId: string }>();
  const [request, setRequest] = useState<CustomRequestItem | null>(null);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!requestId) return;

    let mounted = true;
    setIsLoading(true);
    customRequestsApi.getCustomRequest(requestId)
      .then((data) => {
        if (!mounted) return;

        const savedReview = localStorage.getItem(`custom-request-review-${requestId}`);
        const localRequest = savedReview ? JSON.parse(savedReview) as Partial<CustomRequestItem> : {};
        setRequest({ ...data, ...localRequest, status: data.status, statusText: data.statusText });
        setReferenceImage(localRequest.referenceImageUrl ?? localStorage.getItem(`custom-request-reference-image-${requestId}`));
      })
      .catch((error) => { console.error("Failed to load custom request", error); if (mounted) setIsError(true); })
      .finally(() => { if (mounted) setIsLoading(false); });

    return () => { mounted = false; };
  }, [requestId]);

  if (isLoading) {
    return <CatalogLayout><main dir="rtl" className="min-h-[50vh] px-5 py-16 text-center text-sm text-[#666a61]">جارٍ تحميل بيانات الطلب...</main></CatalogLayout>;
  }

  if (isError || !request) {
    return <CatalogLayout><main dir="rtl" className="min-h-[50vh] px-5 py-16 text-center text-sm text-[#a04a3a]">تعذر تحميل الطلب. يرجى المحاولة مرة أخرى.</main></CatalogLayout>;
  }

  return (
    <CatalogLayout>
      <motion.main initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} dir="rtl" className="bg-[#f4f2ee] px-5 py-12 text-[#211f1b] sm:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4"><div><p className="text-xs font-bold tracking-[0.14em] text-[#9b6a3d]">تفاصيل طلب التصميم الخاص</p><h1 className="mt-2 text-3xl font-extrabold text-[#3e522c]">مراجعة الطلب</h1><p className="mt-2 text-xs text-[#504b44]">رقم الطلب: <strong className="text-[#795238]">#{request.requestCode ?? request.id}</strong></p></div><span className="rounded-full bg-[#f7ecda] px-4 py-2 text-xs font-bold text-[#9b6a3d]">{request.statusText}</span></div>

          <section className="mb-8 flex items-center gap-1 overflow-x-auto pb-2">{stages.map((stage, index) => <div key={stage} className="flex min-w-[125px] flex-1 items-center"><div className="flex flex-1 flex-col items-center gap-2"><span className={`flex size-9 items-center justify-center rounded-full border-2 ${index <= request.stageIndex ? "border-[#52663c] bg-[#52663c] text-white" : "border-[#d7d2c8] bg-[#f8f6f1] text-[#99958b]"}`}>{index <= request.stageIndex ? <Check className="size-4" /> : index + 1}</span><span className={`text-center text-[10px] font-bold ${index <= request.stageIndex ? "text-[#3e522c]" : "text-[#77736b]"}`}>{stage}</span></div>{index < stages.length - 1 && <span className="h-px flex-1 bg-[#d0cbc1]" />}</div>)}</section>

          <div className="grid gap-6 lg:grid-cols-[1fr_270px]">
            <div className="space-y-5">
              <section className="border border-[#e2ddd4] bg-white p-5 shadow-sm"><div className="flex items-center justify-between border-b border-[#eee9e1] pb-4"><h2 className="font-extrabold text-[#3e522c]">نوع القطعة والتفاصيل</h2><Sparkles className="size-5 text-[#9b6a3d]" /></div><div className="mt-5"><p className="text-xs font-bold text-[#77736b]">المنتج</p><p className="mt-2 text-sm font-extrabold text-[#211f1b]">{request.productName ?? "منتج مخصص"}</p><p className="mt-5 text-xs font-bold text-[#77736b]">وصف الطلب</p><p className="mt-2 whitespace-pre-line text-sm leading-8 text-[#403c36]">{request.description}</p></div></section>
              <section className="border border-[#e2ddd4] bg-white p-5 shadow-sm"><div className="flex items-center gap-2 border-b border-[#eee9e1] pb-4"><Ruler className="size-4 text-[#9b6a3d]" /><h2 className="font-extrabold text-[#3e522c]">المواصفات الفنية</h2></div><div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">{[["الطول", request.dimensions?.length ? `${request.dimensions.length} سم` : "غير محدد"], ["العرض", request.dimensions?.width ? `${request.dimensions.width} سم` : "غير محدد"], ["الارتفاع", request.dimensions?.height ? `${request.dimensions.height} سم` : "غير محدد"], ["الكمية", request.quantity ? String(request.quantity) : "1"]].map(([label, value]) => <div key={label} className="bg-[#f8f5ef] p-4 text-center"><p className="text-[10px] text-[#77736b]">{label}</p><strong className="mt-2 block text-sm text-[#211f1b]">{value}</strong></div>)}</div><div className="mt-5 flex items-center justify-between border-t border-[#eee9e1] pt-4 text-sm"><span className="text-[#77736b]">النمط واللون المختار</span><strong className="text-[#211f1b]">{request.designPattern ?? request.color ?? "غير محدد"}</strong></div></section>
              <section className="border border-[#e2ddd4] bg-white p-5 shadow-sm"><div className="flex items-center gap-2 border-b border-[#eee9e1] pb-4"><CalendarDays className="size-4 text-[#9b6a3d]" /><h2 className="font-extrabold text-[#3e522c]">السعر والطلب</h2></div><div className="mt-5 grid gap-4 text-sm sm:grid-cols-2"><div><p className="text-xs text-[#77736b]">الكمية</p><strong className="mt-2 block text-[#3e522c]">{request.quantity ?? 1}</strong></div><div><p className="text-xs text-[#77736b]">الإجمالي</p><strong className="mt-2 block text-[#211f1b]">{request.price?.total ?? "قيد التحديد"}</strong></div></div></section>
            </div>

            <aside className="border border-[#e2ddd4] bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><h2 className="font-extrabold text-[#3e522c]">الصور المرجعية</h2><ImageIcon className="size-4 text-[#9b6a3d]" /></div><div className="mt-5 space-y-4"><img src={referenceImage ?? gallery[0]} alt="الصورة المرجعية الرئيسية" className="aspect-[1.12] w-full object-cover" />{!referenceImage && <div className="grid grid-cols-2 gap-3">{gallery.slice(1).map((image) => <img key={image} src={image} alt="صورة مرجعية" className="aspect-square w-full object-cover" />)}</div>}</div><p className="mt-6 text-center text-[10px] text-[#77736b]">{referenceImage ? "الصورة التي اخترتها في الطلب" : "لم يتم اختيار صورة مرجعية"}</p></aside>
          </div>

          <div className="mt-6 flex items-center justify-end border border-[#e3dfd6] bg-[#fbfaf7] px-5 py-4 text-xs text-[#504b44]"><Link to={ROUTES.orders} className="inline-flex items-center gap-1 font-bold text-[#3e522c]">متابعة جميع الطلبات <ChevronLeft className="size-4" /></Link></div>
        </div>
      </motion.main>
    </CatalogLayout>
  );
}
