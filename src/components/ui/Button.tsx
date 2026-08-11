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
    "bg-brand-olive-700 text-brand-cream hover:bg-brand-olive-900 disabled:bg-brand-olive-400/60 shadow-sm shadow-brand-olive-900/10",
  ghost: "bg-transparent text-brand-olive-700 hover:bg-brand-olive-50",
  outline: "bg-transparent border border-brand-border text-brand-ink hover:border-brand-olive-600",
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