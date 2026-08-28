import { motion } from "framer-motion";
import { MapPinIcon } from "@/components/ui/icons";

export function AddressMapCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut", delay: 0.1 }}
      className="overflow-hidden rounded-[24px] border border-[#dfe5d8] bg-[#edf1eb] shadow-[0_12px_30px_-24px_rgba(38,47,26,0.25)]"
    >
      <div className="relative h-[280px] w-full overflow-hidden bg-[#e9efe8]">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-80"
          style={{
            backgroundImage:
              "linear-gradient(rgba(148,163,126,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,126,0.08) 1px, transparent 1px), radial-gradient(circle at 30% 20%, rgba(145,156,124,0.14), transparent 26%), radial-gradient(circle at 70% 60%, rgba(145,156,124,0.16), transparent 18%)",
            backgroundSize: "28px 28px, 28px 28px, 100% 100%, 100% 100%",
          }}
        />

        <div className="absolute inset-0 opacity-50" style={{ backgroundImage: "linear-gradient(120deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.15) 100%)" }} />

        <div className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f2efe8]/80 shadow-[0_0_0_8px_rgba(255,255,255,0.5)] ring-1 ring-[#c4d0b8]" />
        <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#4c5f3a] p-3 text-white shadow-lg shadow-[#4c5f3a]/25">
          <MapPinIcon className="h-5 w-5" />
        </div>

        <div className="absolute right-4 top-4 rounded-full border border-[#d2d8c8] bg-white/80 px-3 py-2 text-[12px] font-medium text-[#3d4f32] backdrop-blur-sm">
          متصل
        </div>

        <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full border border-[#d2d8c8] bg-white/90 px-3 py-2 text-[12px] font-medium text-[#3e483a] shadow-sm">
          <span>تحديد على الخريطة</span>
        </div>
      </div>
    </motion.div>
  );
}
