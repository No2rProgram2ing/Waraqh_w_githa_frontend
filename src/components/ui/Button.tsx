import { forwardRef } from "react";
import type { ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { clsx } from "clsx";

type ButtonVariant = "primary" | "ghost" | "outline";

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: ButtonVariant;
  isLoading?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--color-accent)] text-[var(--color-surface-card)] hover:bg-[var(--color-accent-hover)] disabled:bg-[var(--color-accent)] disabled:opacity-50 shadow-sm shadow-black/10",
  ghost:
    "bg-transparent text-[var(--color-accent)] hover:bg-[var(--color-accent-subtle)]",
  outline:
    "bg-transparent border border-[var(--color-border)] text-[var(--color-text-primary)] hover:border-[var(--color-accent)]",
};

/**
 * Base action button. Handles loading state, disabled state, and a
 * consistent hover/tap micro-interaction across the app.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", isLoading, fullWidth, className, disabled, children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        type={props.type ?? "button"}
        disabled={disabled || isLoading}
        whileHover={disabled || isLoading ? undefined : { scale: 1.01 }}
        whileTap={disabled || isLoading ? undefined : { scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className={clsx(
          "relative inline-flex items-center justify-center gap-2 rounded-[var(--radius-field)]",
          "px-5 py-3.5 text-[15px] font-semibold transition-colors duration-200",
          "disabled:cursor-not-allowed",
          fullWidth && "w-full",
          variantClasses[variant],
          className,
        )}
        {...props}
      >
        {isLoading && (
          <span
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-hidden="true"
          />
        )}
        <span className={clsx("inline-flex items-center justify-center gap-2", isLoading && "opacity-90")}>
          {children}
        </span>
      </motion.button>
    );
  },
);

Button.displayName = "Button";