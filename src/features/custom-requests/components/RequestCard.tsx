import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { ArrowLeftIcon, CheckCircleIcon, ImagePlaceholderIcon } from "@/components/ui/icons";
import type { CustomRequest } from "../types";

export interface RequestCardProps {
  request: CustomRequest;
  onSelect: (request: CustomRequest) => void;
}

export function RequestCard({ request, onSelect }: RequestCardProps) {
  const getBadgeVariant = (status: CustomRequest["status"]) => {
    switch (status) {
      case "completed":
        return "success";
      case "in_progress":
        return "warning";
      case "pending_review":
        return "neutral";
      default:
        return "neutral";
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 16px 32px -12px rgba(38, 47, 26, 0.12)" }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      onClick={() => onSelect(request)}
      className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-brand-border/80 bg-brand-surface/30 p-6 sm:p-7 shadow-xs hover:border-brand-olive-600/40 cursor-pointer transition-all duration-300"
    >
      <div>
        {/* Top Header: Badge & Date */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <span className="text-xs text-brand-muted font-medium">{request.date}</span>
          <Badge variant={getBadgeVariant(request.status)}>
            {request.stageText ?? request.statusText}
          </Badge>
        </div>

        {/* Content Layout (Grid or flex with thumbnail image) */}
        <div className="flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-brand-ink font-display line-clamp-1 group-hover:text-brand-olive-700 transition-colors">
              {request.title}
            </h3>
            <p className="text-sm text-brand-ink/75 mt-2 line-clamp-2 leading-relaxed">
              {request.description}
            </p>
            <p className="mt-3 text-xs font-bold text-brand-olive-700">
              المرحلة الحالية: {request.stageText ?? request.statusText}
            </p>
          </div>

          {/* Thumbnail Image */}
          <div className="relative h-24 w-24 sm:h-28 sm:w-28 shrink-0 overflow-hidden rounded-2xl border border-brand-border/60 bg-brand-surface">
            {request.imageUrl ? (
              <img
                src={request.imageUrl}
                alt={request.title}
                className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-brand-surface">
                <ImagePlaceholderIcon />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Status & Action */}
      <div className="mt-6 pt-4 border-t border-brand-border/50 flex items-center justify-between text-xs text-brand-ink/80 font-medium">
        <div className="flex items-center gap-2">
          {request.status === "completed" && (
            <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <CheckCircleIcon className="h-4 w-4" />
              <span>تم التسليم بنجاح</span>
            </span>
          )}

          {request.artisanName && (
            <div className="flex items-center gap-2 text-brand-ink/90">
              <Avatar size="sm" initials={request.artisanInitials || "ع"} />
              <span className="font-semibold">{request.artisanName}</span>
            </div>
          )}

          {request.status === "pending_review" && (
            <span className="text-brand-muted">بانتظار مراجعة الفريق</span>
          )}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(request);
          }}
          className="flex items-center gap-1 text-brand-olive-700 group-hover:translate-x-[-2px] transition-transform font-bold"
        >
          <span>عرض التفاصيل</span>
          <ArrowLeftIcon />
        </button>
      </div>
    </motion.div>
  );
}
