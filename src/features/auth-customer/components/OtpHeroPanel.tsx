import { motion } from "framer-motion";
import { SparkleIcon } from "@/components/ui/icons";

export function OtpHeroPanel() {
  return (
    <div className="relative hidden h-full min-h-160 overflow-hidden bg-brand-olive-900 lg:block">
      {/* الصورة الجانبية */}
      <motion.img
        src="/src/assets/images/Warqah & Jitha Weavers.png"
        alt="حرفة تتوارثها الأجيال - نساج يمني"
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* طبقة تظليل لتوضيح النص */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10 z-0" />

      {/* الشعار العلوي */}
      <div className="absolute top-8 end-8 z-10 flex items-center gap-2 rounded-full border border-white/20 bg-black/20 px-4 py-2 backdrop-blur-md">
        <span className="text-sm font-semibold text-white">ورقة وجذع</span>
        <span className="grid h-6 w-6 place-items-center rounded-full bg-white/20 text-white">
          <SparkleIcon className="h-3.5 w-3.5" />
        </span>
      </div>

      {/* النص السفلي */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.35, ease: "easeOut" }}
        className="absolute inset-x-0 bottom-12 p-12 z-10 text-white text-center"
      >
        <h2 className="text-3xl font-bold">حرفة تتوارثها الأجيال</h2>
        <p className="mt-3 max-w-sm mx-auto text-[15px] leading-7 text-white/85">
          نجمع بين الأصالة والحداثة في كل قطعة نصنعها.
        </p>
      </motion.div>
    </div>
  );
}