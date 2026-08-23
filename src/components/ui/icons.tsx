import type { SVGProps } from "react";
import {
  ArrowLeft as LucideArrowLeft,
  Bell as LucideBell,
  CheckCircle as LucideCheckCircle,
  CircleHelp as LucideHelpCircle,
  Heart as LucideHeart,
  Image as LucideImage,
  LogOut as LucideLogOut,
  Mail as LucideMail,
  MessageCircle as LucideMessageCircle,
  MapPin as LucideMapPin,
  Menu as LucideMenu,
  Package as LucidePackage,
  Palette as LucidePalette,
  Plus as LucidePlus,
  Search as LucideSearch,
  ShoppingBag as LucideShoppingBag,
  Sparkles as LucideSparkles,
  Trash2 as LucideTrash,
  User as LucideUser,
  X as LucideX,
} from "lucide-react";

export const ArrowLeftIcon = LucideArrowLeft;
export const BellIcon = LucideBell;
export const BrandLogoIcon = LucideSparkles;
export const CheckCircleIcon = LucideCheckCircle;
export const CustomCraftIcon = LucidePalette;
export const HeartIcon = LucideHeart;
export const HelpCircleIcon = LucideHelpCircle;
export const ImagePlaceholderIcon = LucideImage;
export const LogoutIcon = LucideLogOut;
export const MailIcon = LucideMail;
export const WhatsAppIcon = LucideMessageCircle;
export const MapPinIcon = LucideMapPin;
export const MenuIcon = LucideMenu;
export const PackageIcon = LucidePackage;
export const PlusIcon = LucidePlus;
export const SearchIcon = LucideSearch;
export const ShoppingBagIcon = LucideShoppingBag;
export const TrashIcon = LucideTrash;
export const UserIcon = LucideUser;
export const XMarkIcon = LucideX;

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TwitterIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 4l16 16" />
      <path d="M20 4L4 20" />
    </svg>
  );
}

export function ShieldCheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

export function ArrowRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  );
}

export function EyeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="h-5 w-5" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

export function EyeOffIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="h-5 w-5" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a8.959 8.959 0 012.122-.19c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21M3 3l18 18" />
    </svg>
  );
}

export function SparkleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
    </svg>
  );
}

export function PhoneIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}