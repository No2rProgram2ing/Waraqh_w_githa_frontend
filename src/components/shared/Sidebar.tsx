import { Link, useLocation } from "react-router-dom";
import {
  UserIcon,
  MapPinIcon,
  ShoppingBagIcon,
  HeartIcon,
  CustomCraftIcon,
  BellIcon,
  HelpCircleIcon,
  LogoutIcon,
} from "@/components/ui/icons";
import { ROUTES } from "@/routes/paths";
import { useCustomerAuthStore } from "@/features/auth-customer/stores/customerAuthStore";

export function Sidebar() {
  const location = useLocation();
  const user = useCustomerAuthStore((state) => state.user);

  const primaryMenuItems = [
    { label: "البيانات الشخصية", path: ROUTES.profile, icon: UserIcon },
    { label: "عناويني", path: ROUTES.addresses, icon: MapPinIcon },
    { label: "طلباتي", path: ROUTES.orders, icon: ShoppingBagIcon },
    { label: "قائمة الأمنيات", path: ROUTES.wishlist, icon: HeartIcon },
    { label: "طلبات التصميم الخاص", path: ROUTES.customRequests, icon: CustomCraftIcon },
  ];

  const secondaryMenuItems = [
    { label: "مركز المساعدة", path: ROUTES.help, icon: HelpCircleIcon },
    { label: "تسجيل الخروج", path: ROUTES.login, icon: LogoutIcon, isDanger: true },
  ];

  return (
    <aside className="w-14 sm:w-16 md:w-56 lg:w-64 shrink-0 bg-brand-olive-900 text-brand-cream border-l border-brand-olive-700/50 self-stretch min-h-full py-6 px-1.5 sm:px-3 md:px-4 lg:px-6 shadow-md transition-all">
      <div className="sticky top-24">
        {/* Header Section - shown on tablet/laptop screens and up */}
        <div className="hidden md:block mb-6 px-1">
          <p className="text-xs text-brand-cream/60 font-body">مرحباً،</p>
          <h2 className="text-base lg:text-xl font-bold text-white font-display tracking-tight truncate">
            {user?.fullName ?? ""}
          </h2>
        </div>

        {/* Primary Navigation Menu */}
        <nav className="flex flex-col gap-1.5">
          {primaryMenuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                title={item.label}
                className={`flex items-center justify-center md:justify-start gap-3 p-2.5 md:px-3 md:py-2.5 text-sm transition-all duration-200 rounded-xl ${
                  isActive
                    ? "font-bold text-white bg-brand-olive-700/90 shadow-xs border border-brand-olive-600/60"
                    : "font-medium text-brand-cream/80 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon
                  className={`h-5 w-5 shrink-0 transition-colors ${
                    isActive ? "text-amber-300" : "text-brand-cream/60"
                  }`}
                />
                <span className="hidden md:inline text-xs lg:text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Separator Divider */}
        <div className="my-4 lg:my-6 border-t border-brand-olive-700/50" />

        {/* Secondary Navigation Menu */}
        <nav className="flex flex-col gap-1.5">
          {secondaryMenuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                title={item.label}
                className={`flex items-center justify-center md:justify-start gap-3 p-2.5 md:px-3 md:py-2.5 text-sm transition-all duration-200 rounded-xl ${
                  item.isDanger
                    ? "font-medium text-red-400 hover:text-red-300 hover:bg-red-500/15"
                    : isActive
                    ? "font-bold text-white bg-brand-olive-700/90 shadow-xs border border-brand-olive-600/60"
                    : "font-medium text-brand-cream/80 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon
                  className={`h-5 w-5 shrink-0 transition-colors ${
                    item.isDanger
                      ? "text-red-400"
                      : isActive
                      ? "text-amber-300"
                      : "text-brand-cream/60"
                  }`}
                />
                <span className="hidden md:inline text-xs lg:text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}


