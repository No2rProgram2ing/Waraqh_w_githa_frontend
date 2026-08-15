import type { ReactNode } from "react";
import { clsx } from "clsx";

export type BadgeVariant = "success" | "warning" | "info" | "neutral" | "danger";

export interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: "bg-emerald-100/90 text-emerald-800 border-emerald-200",
  warning: "bg-amber-100/90 text-amber-900 border-amber-200",
  info: "bg-sky-100/90 text-sky-800 border-sky-200",
  neutral: "bg-stone-200/80 text-stone-700 border-stone-300",
  danger: "bg-red-100/90 text-red-800 border-red-200",
};

export function Badge({ variant = "neutral", children, className }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-xs transition-all duration-200",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
