import { clsx } from "clsx";

export interface LoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

const sizeClasses = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-9 w-9 border-[3px]",
};

/** Generic spinner used for full-page or inline loading states. */
export function Loader({ size = "md", className, label = "جارٍ التحميل" }: LoaderProps) {
  return (
    <span role="status" aria-label={label} className="inline-flex items-center justify-center">
      <span
        className={clsx(
          "animate-spin rounded-full border-brand-olive-700 border-t-transparent",
          sizeClasses[size],
          className,
        )}
      />
    </span>
  );
}
