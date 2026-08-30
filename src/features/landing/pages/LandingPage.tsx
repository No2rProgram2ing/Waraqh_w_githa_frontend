import { motion } from "framer-motion";
import { ArrowLeft, Leaf, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/images/Warqah & Jitha Logo.png";
import artisanImage from "@/assets/images/LoginImage.png";
import { ROUTES } from "@/routes/paths";

function LandingPage() {
  return (
    <main dir="rtl" className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_#f9f6f2_0%,_#f2e9dd_35%,_#e6d9c5_100%)] text-[#40382e]">
      <div className="grid min-h-screen lg:grid-cols-[1.2fr_0.88fr] lg:[direction:ltr]">
        <motion.section
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative order-2 min-h-[58vh] overflow-hidden lg:order-1 lg:min-h-screen lg:[direction:rtl]"
        >
          <img src={artisanImage} alt="حرفي يمني يصنع قطعة يدوية" className="absolute inset-0 h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-[#3a2a1c]/20" />
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="absolute bottom-8 right-8 max-w-[230px] rounded-xl border border-white/15 bg-[#3a291b]/75 px-5 py-4 text-right text-white shadow-xl backdrop-blur-sm sm:bottom-12 sm:right-12"
          >
            <p className="text-sm font-bold">صناعة الأمل اليمنية</p>
            <p className="mt-1 text-xs leading-6 text-white/75">ننقل التراث من جيل إلى جيل بكل فخر</p>
          </motion.div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="order-1 flex min-h-[42vh] flex-col justify-between bg-[#f7f2ea] px-7 py-8 text-right shadow-[inset_0_0_0_1px_rgba(109,121,81,0.08)] sm:px-14 sm:py-12 lg:order-2 lg:min-h-screen lg:px-[12%] lg:py-14 lg:[direction:rtl]"
        >
          <header className="flex items-center justify-center">
            <img src={logo} alt="شعار ورقة وجذع" className="h-20 w-auto object-contain drop-shadow-sm sm:h-24" />
          </header>

          <div className="mx-auto w-full max-w-[390px] py-10 text-right lg:py-0">
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="mb-5 text-xs font-bold tracking-[0.12em] text-[#8b7652]">أهلاً بك في عالمنا</motion.p>
            <h1 className="text-lg font-bold leading-[1.55] text-[#40382e] sm:text-5xl">حرفية يمنية أصيلة...<br /><span className="text-[#596d3f]">بروح مستدامة</span></h1>
            <p className="mt-6 max-w-[350px] text-sm leading-8 text-[#716859]">انضم إلى مجتمعنا لنكتشف ونقتني قطعاً فنية فريدة تجسد التراث اليمني العريق.</p>
            <div className="mt-9 space-y-3">
              <Link to={ROUTES.signup} className="group flex w-full items-center justify-center gap-2 rounded-md bg-[#52663c] px-5 py-3.5 text-sm font-bold text-white shadow-[0_12px_22px_-14px_rgba(52,70,35,0.9)] transition hover:bg-[#40532f] hover:shadow-lg">إنشاء حساب <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" /></Link>
              <Link to={ROUTES.login} className="flex w-full items-center justify-center rounded-md border-2 border-[#6c7950] px-5 py-3 text-sm font-bold text-[#52613d] transition hover:bg-[#f4eadb]">تسجيل الدخول</Link>
            </div>
            <Link to={ROUTES.home} className="mt-8 mb-8 flex items-center justify-center gap-2 text-xs text-[#9a8c79] transition hover:text-[#52663c]">تصفح كزائر <ArrowLeft className="size-3" /></Link>
          </div>

          <footer className="flex items-center justify-between gap-4 text-[10px] text-[#887d6d]">
            <span className="flex items-center gap-1.5"><ShieldCheck className="size-4 text-[#6d7951]" />أمان موثوق</span>
            <span className="flex items-center gap-1.5"><Leaf className="size-4 text-[#6d7951]" />مواد طبيعية</span>
            <span>© 2024 ورقة وجذع</span>
          </footer>
        </motion.section>
      </div>
    </main>
  );
}

export { LandingPage };
