import { motion } from "framer-motion";
import { SparkleIcon } from "@/components/ui/icons";
import loginImg from "@/assets/images/LoginImage.png";

export interface AuthHeroPanelProps {
  title?: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
  badgeText?: string;
}

/**
 * Right-hand brand panel displaying the artisan photograph asset
 * with smooth entrance animations and high-contrast text overlay.
 * Reusable across all auth pages with optional props and default fallbacks.
 */
export function AuthHeroPanel({
  title = "حرفة تتوارثها الأجيال",
  description = "نجمع بين الأصالة والحداثة في كل قطعة نصنعها.",
  imageSrc = loginImg,
  imageAlt = "حرفة تتوارثها الأجيال",
  badgeText,
}: AuthHeroPanelProps) {
  return (
    <div className="relative hidden h-full min-h-160 overflow-hidden bg-brand-olive-900 lg:block">
      {/* الصورة الجانبية مع تأثير التكبير التدريجي عند التحميل */}
      <motion.img
        src={imageSrc}
        alt={imageAlt}
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* طبقة تظليل لتوضيح النصوص والشعار العلوي فوق الصورة */}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-black/10" />

      {/* الشعار العلوي (يظهر فقط في حال تمرير badgeText) */}
      {badgeText && (
        <div className="absolute top-8 end-8 z-10 flex items-center gap-2 rounded-full border border-white/20 bg-black/20 px-4 py-2 backdrop-blur-md">
          <span className="text-sm font-semibold text-white">{badgeText}</span>
          <span className="grid h-6 w-6 place-items-center rounded-full bg-white/20 text-white">
            <SparkleIcon className="h-3.5 w-3.5" />
          </span>
        </div>
      )}

      {/* النص السفلي المباشر من تصميم Figma */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.35, ease: "easeOut" }}
        className="absolute inset-x-0 bottom-0 p-10 z-10"
      >
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <p className="mt-2 max-w-md text-[15px] leading-7 text-white/80">
          {description}
        </p>
      </motion.div>
    </div>
  );
}