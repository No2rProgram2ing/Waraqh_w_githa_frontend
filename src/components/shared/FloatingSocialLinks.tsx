import { InstagramIcon, WhatsAppIcon } from "@/components/ui/icons";

export function FloatingSocialLinks() {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 sm:bottom-6 sm:right-6">
      <a
        href="https://wa.me/967700000000"
        target="_blank"
        rel="noreferrer"
        aria-label="واتساب"
        title="واتساب"
        className="flex h-12 w-12 items-center justify-center rounded-full border border-[#D9D0C3] bg-[#F8F5EE] text-[#1E7F47] shadow-[0_8px_24px_rgba(25,60,35,0.14)] transition-all duration-200 hover:scale-105 hover:bg-[#EAF5EE]"
      >
        <WhatsAppIcon className="h-5 w-5" />
      </a>

      <a
        href="https://instagram.com/warqahjitha"
        target="_blank"
        rel="noreferrer"
        aria-label="إنستغرام"
        title="إنستغرام"
        className="flex h-12 w-12 items-center justify-center rounded-full border border-[#D9D0C3] bg-[#F8F5EE] text-[#A34D64] shadow-[0_8px_24px_rgba(25,60,35,0.14)] transition-all duration-200 hover:scale-105 hover:bg-[#FDECEF]"
      >
        <InstagramIcon className="h-5 w-5" />
      </a>
    </div>
  );
}
