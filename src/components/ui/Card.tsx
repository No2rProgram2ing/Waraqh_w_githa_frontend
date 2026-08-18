import type { ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { clsx } from "clsx";

export interface CardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  interactive?: boolean;
}

/** Generic surface container with an optional hover-elevation micro-interaction. */
export function Card({
  children,
  interactive = false,
  className,
  ...props
}: CardProps) {
  return (
    <motion.div
      whileHover={
        interactive
          ? {
              y: -3,
              boxShadow: "0 12px 24px -12px rgb(0 0 0 / 0.18)",
            }
          : undefined
      }
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className={clsx(
        "rounded-2xl border border-[var(--color-border)]",
        "bg-[var(--color-surface-card)] p-6",
        "shadow-sm shadow-black/5",
        className,
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
