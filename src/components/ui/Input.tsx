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
        <label htmlFor={inputId} className="text-sm font-medium text-brand-ink">
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : hint ? hintId : undefined}
            className={clsx(
              "w-full rounded-[var(--radius-field)] border bg-brand-surface py-3.5 text-[15px] text-right",
              "text-brand-ink placeholder:text-brand-muted",
              "transition-all duration-200 ease-out",
              "focus:bg-brand-cream focus:shadow-md focus:shadow-brand-olive-900/5 focus:outline-none",
              error
                ? "border-red-400 focus:border-red-500"
                : "border-brand-border focus:border-brand-olive-600",
              icon && (iconPosition === "left" ? "pl-11 pr-4" : "pr-11 pl-4"),
              !icon && "px-4",
              className,
            )}
            {...props}
          />
          {icon && (
            <span
              className={clsx(
                "pointer-events-none absolute inset-y-0 flex items-center text-brand-muted",
                iconPosition === "left" ? "left-4" : "right-4"
              )}
            >
              {icon}
            </span>
          )}
        </div>
        {error ? (
          <p id={errorId} role="alert" className="text-sm text-red-500">
            {error}
          </p>
        ) : hint ? (
          <p id={hintId} className="text-sm text-brand-muted">
            {hint}
          </p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = "Input";