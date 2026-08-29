import { motion } from "framer-motion";
import { ArrowLeftIcon } from "@/components/ui/icons";
import type { ShowcaseCardData } from "@/features/dashboard/types";

interface ShowcaseCardProps {
  card: ShowcaseCardData;
  index: number;
}

export function ShowcaseCard({ card, index }: ShowcaseCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ y: -4, boxShadow: "0 18px 32px -20px rgba(38, 47, 26, 0.22)" }}
      className="group overflow-hidden rounded-[24px] border border-[#e4dfd8] bg-[#f7f4ef] shadow-[0_8px_24px_-16px_rgba(38,47,26,0.2)]"
    >
      <div className="flex items-center justify-between gap-3 border-b border-[#ece8e2] px-4 py-3 sm:px-5">
        <span className="text-[11px] font-medium text-[#7e7d74]">{card.date}</span>
        <span className="rounded-full border border-[#d7d1c8] bg-[#f1efe9] px-2.5 py-1 text-[11px] font-medium text-[#4b5e37]">
          {card.status}
        </span>
      </div>

      <div className="flex items-stretch gap-4 p-4 sm:p-5">
        <div className="min-w-0 flex-1">
          <h3 className="text-[17px] font-bold text-[#1f231d] leading-7">{card.title}</h3>
          <p className="mt-2 text-[13px] leading-7 text-[#5b5d57]">{card.subtitle}</p>
        </div>

        <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-[18px] border border-[#dad4ca] bg-[#efeae2] sm:h-32 sm:w-32">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url(${card.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/10" />
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-[#ece8e2] px-4 py-3 text-[12px] text-[#5f625a] sm:px-5">
        <span className="inline-flex items-center gap-1.5 text-[#4a5d37] font-bold">
          <span>مشاهدة التفاصيل</span>
          <ArrowLeftIcon className="h-4 w-4" />
        </span>
        <span>{card.accent}</span>
      </div>
    </motion.article>
  );
}
