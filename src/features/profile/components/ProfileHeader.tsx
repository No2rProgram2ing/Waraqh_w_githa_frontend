import { Avatar } from "@/components/ui/Avatar";

export interface ProfileHeaderProps {
  fullName?: string;
  avatarUrl?: string;
  isOnline?: boolean;
}

export function ProfileHeader({ fullName, avatarUrl, isOnline = true }: ProfileHeaderProps) {
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

      <div className="relative group cursor-pointer">
        <Avatar
          src={avatarUrl}
          alt={fullName}
          size="xl"
          online={isOnline}
          initials={fullName ? fullName.charAt(0) : "أ"}
          className="ring-4 ring-brand-surface group-hover:scale-105 transition-transform duration-300 shadow-lg"
        />
        <div className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold">
          تغيير الصورة
        </div>
      </div>
    </div>
  );
}
