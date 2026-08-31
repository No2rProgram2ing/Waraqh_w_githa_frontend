import { motion } from "framer-motion";
import { AddressMap } from "./AddressMap";

interface AddressMapCardProps {
  onOpenModal?: () => void;
}

export function AddressMapCard({ onOpenModal }: AddressMapCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut", delay: 0.1 }}
      className="overflow-hidden rounded-[24px] border border-[#dfe5d8] bg-[#edf1eb] shadow-[0_12px_30px_-24px_rgba(38,47,26,0.25)] relative"
    >
      <div className="relative min-h-[400px] w-full z-0">
        <AddressMap
          latitude={null}
          longitude={null}
          onChange={() => {}}
        />

        <div className="absolute right-4 top-4 z-20 rounded-full border border-[#d2d8c8] bg-white/80 px-3 py-2 text-[12px] font-medium text-[#3d4f32] backdrop-blur-sm shadow-sm pointer-events-none">
          متصل
        </div>

        {onOpenModal && (
          <button
            type="button"
            onClick={onOpenModal}
            className="absolute bottom-6 right-4 z-20 flex items-center gap-2 rounded-full border border-[#d2d8c8] bg-white/95 px-4 py-2.5 text-[13px] font-semibold text-[#3e483a] shadow-md transition-all hover:bg-gray-50 focus:outline-none"
          >
            <span>إضافة عنوان هنا</span>
          </button>
        )}
      </div>
    </motion.div>
  );
}
