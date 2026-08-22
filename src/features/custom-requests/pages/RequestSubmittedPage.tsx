import { motion } from "framer-motion";
import { CheckCircle2, Home, PackageSearch } from "lucide-react";
import { Link } from "react-router-dom";
import { CatalogLayout } from "@/layouts/CatalogLayout";
import { ROUTES } from "@/routes/paths";

export function RequestSubmittedPage() {
  return (
    <CatalogLayout>
      <motion.main initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} dir="rtl" className="flex min-h-[calc(100vh-20rem)] items-center justify-center bg-[#f2f0ec] px-5 py-16 text-[#211f1b]">
        <section className="w-full max-w-xl border border-[#ded9d0] bg-white px-6 py-12 text-center shadow-[0_16px_34px_-24px_rgba(48,42,35,0.55)] sm:px-12">
          <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#e5eddc] text-[#3e522c]"><CheckCircle2 className="size-9" /></span>
          <p className="mt-6 text-xs font-extrabold tracking-[0.16em] text-[#9b6a3d]">تم استلام طلبك</p>
          <h1 className="mt-3 text-3xl font-extrabold text-[#3e522c] sm:text-4xl">شكراً لثقتك بورقة وجذع</h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-8 text-[#504b44]">تم إرسال طلب التصميم الخاص بنجاح. سيراجع فريقنا التفاصيل وسنتواصل معك قريباً لتأكيد الخطوات القادمة.</p>
          <div className="mt-8 border-y border-[#e2ddd4] py-5 text-sm text-[#403c36]"><p>رقم الطلب</p><strong className="mt-2 block text-lg text-[#795238]">#WJ-{new Date().getTime().toString().slice(-6)}</strong></div>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Link to={ROUTES.customRequestDetails("req-1")} className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#52663c] px-6 py-3 text-sm font-extrabold text-white transition hover:bg-[#3e522c]"><PackageSearch className="size-4" /> متابعة الطلب</Link><Link to={ROUTES.home} className="inline-flex items-center justify-center gap-2 rounded-sm border border-[#9b7655] px-6 py-3 text-sm font-extrabold text-[#603e27] transition hover:bg-[#f8f1e8]"><Home className="size-4" /> العودة للرئيسية</Link></div>
        </section>
      </motion.main>
    </CatalogLayout>
  );
}
