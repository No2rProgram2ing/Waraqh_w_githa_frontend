import { forwardRef, useId } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { clsx } from "clsx";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "prefix"> {
  label: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
}

/**
 * Base text field. Pairs a floating label pattern with an optional
 * icon (positioned left or right) and inline validation message.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, iconPosition = "left", id, className, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const hintId = `${inputId}-hint`;
    const errorId = `${inputId}-error`;

    return (
      <div className="flex flex-col gap-2">
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-[var(--color-text-primary)]"
        >
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : hint ? hintId : undefined}
            className={clsx(
              "w-full rounded-[var(--radius-field)] border bg-[var(--color-surface-subtle)]",
              "py-3.5 text-[15px] text-right text-[var(--color-text-primary)]",
              "placeholder:text-[var(--color-text-faint)]",
              "transition-colors duration-200 ease-out",
              "focus:bg-[var(--color-surface-card)] focus:outline-none",
              "focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-subtle)]",
              "disabled:cursor-not-allowed disabled:opacity-60",
              error
                ? "border-[var(--color-danger)] focus:border-[var(--color-danger)] focus:ring-[var(--color-danger-subtle)]"
                : "border-[var(--color-border)]",
              icon && (iconPosition === "left" ? "ps-11 pe-4" : "pe-11 ps-4"),
              !icon && "px-4",
              className,
            )}
            {...props}
          />
          {icon && (
            <span
              className={clsx(
                "pointer-events-none absolute inset-y-0 flex items-center text-[var(--color-text-muted)]",
                iconPosition === "left" ? "start-4" : "end-4",
              )}
            >
              {icon}
            </span>
          )}
        </div>
        {error ? (
          <p
            id={errorId}
            role="alert"
            className="text-sm text-[var(--color-danger)]"
          >
            {error}
          </p>
        ) : hint ? (
          <p id={hintId} className="text-sm text-[var(--color-text-muted)]">
            {hint}
</p>        ) : null}
      </div>
    );
  },
);

Input.displayName = "Input";