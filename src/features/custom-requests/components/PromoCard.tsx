import { motion } from "framer-motion";
import { SparkleIcon } from "@/components/ui/icons";

export interface PromoCardProps {
  onConsultationClick: () => void;
}

export function PromoCard({ onConsultationClick }: PromoCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className="relative overflow-hidden rounded-3xl bg-brand-olive-900 text-brand-cream p-7 sm:p-8 flex flex-col justify-between shadow-xl shadow-brand-olive-900/20"
    >
      {/* Decorative background glow circle */}
      <div className="pointer-events-none absolute -top-12 -left-12 h-44 w-44 rounded-full bg-brand-olive-600/30 blur-2xl" />

      <div className="relative z-10">
        <div className="inline-flex items-center justify-center p-3.5 rounded-full bg-brand-olive-700/80 text-amber-300 mb-6 shadow-inner">
          <SparkleIcon className="h-6 w-6" />
        </div>

        <h3 className="text-xl font-bold font-display text-white mb-2">
          هل لديك فكرة فريدة؟
        </h3>
        
        <p className="text-sm text-brand-cream/80 leading-relaxed max-w-sm mb-6">
          يمكن لخبرائنا مساعدتك في اختيار أفضل المواد والتصاميم لتحقيق رؤيتك العالية.
        </p>
      </div>

      <div className="relative z-10 pt-2">
        <button
          onClick={onConsultationClick}
          className="w-full rounded-2xl bg-[#c59b27] text-stone-950 hover:bg-[#d4a832] font-bold py-3.5 px-6 text-sm transition-all duration-200 shadow-md hover:shadow-lg active:scale-98"
        >
          استشارة مجانية
        </button>
      </div>
    </motion.div>
  );
}
