import { forwardRef, useId } from "react";
import type { TextareaHTMLAttributes } from "react";
import { clsx } from "clsx";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, id, className, ...props }, ref) => {
    const generatedId = useId();
    const textareaId = id ?? generatedId;
    const hintId = `${textareaId}-hint`;
    const errorId = `${textareaId}-error`;

    return (
      <div className="flex flex-col gap-2">
        <label htmlFor={textareaId} className="text-sm font-medium text-brand-ink">
          {label}
        </label>
        <textarea
          ref={ref}
          id={textareaId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={clsx(
            "w-full rounded-[var(--radius-field)] border bg-brand-surface p-3.5 text-[15px] text-right min-h-[110px]",
            "text-brand-ink placeholder:text-brand-muted",
            "transition-all duration-200 ease-out",
            "focus:bg-brand-cream focus:shadow-md focus:shadow-brand-olive-900/5 focus:outline-none",
            error
              ? "border-red-400 focus:border-red-500"
              : "border-brand-border focus:border-brand-olive-600",
            className
          )}
          {...props}
        />
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
  }
);

Textarea.displayName = "Textarea";
