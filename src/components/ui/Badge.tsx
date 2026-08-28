import type { ReactNode } from "react";
import { clsx } from "clsx";

export type BadgeVariant = "success" | "warning" | "info" | "neutral" | "danger";

export interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  success:
    "border-[var(--color-success)]/30 bg-[var(--color-success-subtle)] text-[var(--color-success)]",
  warning:
    "border-[var(--color-warning)]/30 bg-[var(--color-warning-subtle)] text-[var(--color-warning)]",
  info:
    "border-[var(--color-info)]/30 bg-[var(--color-info-subtle)] text-[var(--color-info)]",
  neutral:
    "border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-secondary)]",
  danger:
    "border-[var(--color-danger)]/30 bg-[var(--color-danger-subtle)] text-[var(--color-danger)]",
};

export function Badge({ variant = "neutral", children, className }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border px-3 py-1",
        "text-xs font-semibold transition-colors duration-200",
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
