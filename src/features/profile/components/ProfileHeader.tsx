import { useRef } from "react";
import { Avatar } from "@/components/ui/Avatar";

export interface ProfileHeaderProps {
  fullName?: string;
  avatarUrl?: string;
  isOnline?: boolean;
  isUploadingAvatar?: boolean;
  onAvatarChange?: (file: File) => void;
}

export function ProfileHeader({
  fullName,
  avatarUrl,
  isOnline = true,
  isUploadingAvatar = false,
  onAvatarChange,
}: ProfileHeaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (file && onAvatarChange) {
      onAvatarChange(file);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-brand-border/60">
      <div className="text-center sm:text-right">
        <h1 className="text-3xl font-extrabold text-brand-ink font-display tracking-tight">
          البيانات الشخصية
        </h1>
        <p className="text-sm text-brand-muted mt-1.5 font-medium">
          تحديث المعلومات الأساسية الخاصة بك
        </p>
      </div>

      <div className="relative group">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploadingAvatar}
        />

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploadingAvatar}
          className="relative block rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-olive-700/60 disabled:cursor-not-allowed"
          aria-label="تغيير صورة الملف الشخصي"
        >
          <Avatar
            src={avatarUrl}
            alt={fullName}
            size="xl"
            online={isOnline}
            initials={fullName ? fullName.charAt(0) : "أ"}
            className="ring-4 ring-brand-surface group-hover:scale-105 transition-transform duration-300 shadow-lg"
          />

          <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/20 text-[11px] font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
            {isUploadingAvatar ? "جاري الحفظ..." : "تغيير الصورة"}
          </span>
        </button>
      </div>
    </div>
  );
}
