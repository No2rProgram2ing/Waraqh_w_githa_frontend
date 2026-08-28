import { clsx } from "clsx";

export interface AvatarProps {
  src?: string;
  alt?: string;
  size?: "sm" | "md" | "lg" | "xl";
  online?: boolean;
  className?: string;
  initials?: string;
}

const sizeClasses = {
  sm: "h-9 w-9 text-xs",
  md: "h-12 w-12 text-sm",
  lg: "h-20 w-20 text-lg",
  xl: "h-28 w-28 text-2xl",
};

const dotSizeClasses = {
  sm: "h-2.5 w-2.5 bottom-0 right-0",
  md: "h-3.5 w-3.5 bottom-0 right-0",
  lg: "h-5 w-5 bottom-1 right-1 border-2",
  xl: "h-6 w-6 bottom-1 right-1 border-3",
};

export function Avatar({
  src,
  alt = "الصورة الشخصية",
  size = "md",
  online = false,
  className,
  initials = "أ",
}: AvatarProps) {
  return (
    <div className="relative inline-block shrink-0">
      <div
        className={clsx(
          "relative overflow-hidden rounded-full border-2 border-brand-border bg-brand-surface font-bold text-brand-olive-900 flex items-center justify-center shadow-md",
          sizeClasses[size],
          className
        )}
      >
        {src ? (
          <img src={src} alt={alt} className="h-full w-full object-cover object-center" />
        ) : (
          <span>{initials}</span>
        )}
      </div>
      {online && (
        <span
          className={clsx(
            "absolute rounded-full bg-emerald-500 border-brand-cream shadow-xs",
            dotSizeClasses[size]
          )}
          title="متصل"
        />
      )}
    </div>
  );
}
