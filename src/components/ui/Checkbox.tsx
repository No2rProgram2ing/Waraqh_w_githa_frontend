import { forwardRef, useId } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { clsx } from "clsx";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: ReactNode;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, id, className, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={inputId} className="flex cursor-pointer items-start gap-2.5 text-sm text-brand-ink">
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            aria-invalid={Boolean(error)}
            className={clsx(
              "mt-0.5 h-4 w-4 shrink-0 rounded border-brand-border text-brand-olive-700",
              "focus-visible:ring-2 focus-visible:ring-brand-olive-600 focus-visible:ring-offset-1",
              "accent-[var(--color-brand-olive-700)]",
              className,
            )}
            {...props}
          />
          <span className="leading-6">{label}</span>
        </label>
        {error && (
          <p role="alert" className="text-sm text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";
