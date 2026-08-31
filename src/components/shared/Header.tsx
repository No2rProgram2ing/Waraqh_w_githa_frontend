import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import logo from "@/assets/images/Warqah & Jitha Logo.png";
import {
  BellIcon,
  HeartIcon,
  MenuIcon,
  SearchIcon,
  ShoppingBagIcon,
  XMarkIcon,
} from "@/components/ui/icons";
import { ROUTES } from "@/routes/paths";
import { useCustomerAuthStore } from "@/features/auth-customer/stores/customerAuthStore";
import { useUnreadNotificationsCount } from "@/features/notifications/hooks/useNotifications";
import { cartApi } from '@/api/cartApi';
import { useCartStore } from "@/features/cart/stores/cartStore";

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Returns the user's initials (first letter of first name) for the fallback avatar. */
function getInitials(fullName: string): string {
  return fullName.trim().charAt(0).toUpperCase() || "؟";
}

// ── Profile Avatar (simple link — no dropdown) ───────────────────────────────

interface AvatarProps {
  avatarUrl?: string | null;
  fullName: string;
}

function ProfileAvatar({ avatarUrl, fullName }: AvatarProps) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(ROUTES.profile)}
      id="header-profile-avatar-btn"
      aria-label="الملف الشخصي"
      className="
        relative flex items-center justify-center
        h-9 w-9 rounded-full overflow-hidden
        ring-2 ring-brand-olive-700/30
        transition-all duration-200
        hover:ring-brand-olive-700
        hover:scale-105
        focus:outline-none focus:ring-brand-olive-700
      "
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={fullName}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="
          flex h-full w-full items-center justify-center
          bg-brand-olive-700 text-white
          text-sm font-bold select-none
        ">
          {getInitials(fullName)}
        </span>
      )}
    </button>
  );
}

// ── Main Header ───────────────────────────────────────────────────────────────

const navLinks = [
  { label: "الرئيسية", path: ROUTES.home },
  { label: "منتجات", path: ROUTES.products },
  { label: "قصتنا", path: ROUTES.aboutUs },
  { label: "طلب خاص", path: ROUTES.customRequests },
];

const iconButtonClass = "relative p-2.5 text-[#20251B] transition-colors hover:text-[#536A3A]";

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Auth state
  const isAuthenticated = useCustomerAuthStore((state) => state.isAuthenticated);
  const user = useCustomerAuthStore((state) => state.user);
  const isHydrated = useCustomerAuthStore((state) => state.isHydrated);
  const logout = useCustomerAuthStore((state) => state.logout);
  const cartItemCount = useCartStore((state) => state.items.reduce((total, item) => total + item.quantity, 0));
  const unreadNotificationsQuery = useUnreadNotificationsCount(isAuthenticated);
  const unreadNotificationsCount = unreadNotificationsQuery.data ?? 0;

  // Scroll shadow
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate(ROUTES.home, { replace: true });
    }
  };

  const isActive = (path: string) => location.pathname === path;
  const visibleNavLinks = navLinks.filter(
    (link) => link.path !== ROUTES.customRequests || isAuthenticated
  );

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-all duration-300 ${
        isScrolled
          ? "border-[#BEB6A8] bg-[#F8F6F1]/98 shadow-sm backdrop-blur-md"
          : "border-[#C9C1B4] bg-[#F8F6F1]"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">

          {/* ── Logo ─── */}
          {/* Changed: logo navigates to ROUTES.home instead of ROUTES.dashboard to ensure clicking the logo goes to the application's main landing page */}
          <Link to={ROUTES.home} className="flex items-center gap-3 group">
            <img
              src={logo}
              alt="ورقة وجذع"
              className="h-20 w-20 object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <div className="flex flex-col">
            </div>
          </Link>

          {/* ── Desktop Navigation ─── */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {visibleNavLinks.map((link) => (
              /* Switched to NavLink to be route-aware and render active state reliably */
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive: navIsActive }) => `relative py-1 text-sm font-semibold transition-colors duration-200 ${navIsActive ? "text-brand-olive-700" : "text-brand-ink/80 hover:text-brand-olive-600"}`}
              >
                {({ isActive: navIsActive }) => (
                  <>
                    {link.label}
                    {navIsActive && (
                      <motion.div
                        layoutId="activeHeaderNav"
                        className="absolute bottom-0 right-0 left-0 h-0.5 bg-brand-olive-700 rounded-full"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}

            {/* Auth links — unauthenticated only */}
            {!isAuthenticated && (
              <>
                <Link
                  to={ROUTES.login}
                  className={`relative py-1 text-sm font-semibold transition-colors duration-200 ${isActive(ROUTES.login) ? "text-brand-olive-700" : "text-brand-ink/80 hover:text-brand-olive-600"}`}
                >
                  تسجيل الدخول
                </Link>
                <Link
                  to={ROUTES.signup}
                  className="px-4 py-1.5 rounded-full text-sm font-semibold bg-brand-olive-700 text-white transition-all duration-200 hover:bg-brand-olive-800 hover:shadow-md"
                >
                  إنشاء حساب
                </Link>
              </>
            )}
          </nav>

          {/* ── Actions ─── */}
          <div className="flex items-center gap-3 sm:gap-4">

            {isAuthenticated ? (
              <>
                {/* Notification */}
                <button
                  type="button"
                  onClick={() => navigate(ROUTES.notifications)}
                  className="relative rounded-full p-2 text-brand-ink/75 transition-colors hover:bg-brand-surface hover:text-brand-olive-700"
                  title="التنبيهات"
                >
                  <BellIcon className="h-5 w-5 text-brand-olive-700" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute -right-1 -top-1 min-w-4 rounded-full bg-amber-500 px-1 text-center text-[10px] font-bold leading-4 text-white ring-2 ring-[#F8F6F1]">
                      {unreadNotificationsCount > 99 ? "99+" : unreadNotificationsCount}
                    </span>
                  )}
                </button>

                {/* Wishlist */}
                <button
                  type="button"
                  onClick={() => navigate(ROUTES.wishlist)}
                  className="rounded-full p-2 text-brand-ink/75 transition-colors hover:bg-brand-surface hover:text-brand-olive-700"
                  title="قائمة الأمنيات"
                >
                  <HeartIcon className="h-5 w-5 text-brand-olive-700" />
                </button>
              </>
            ) : null}

            {/* Search */}
            <button
              type="button"
              onClick={() => navigate(ROUTES.search)}
              className="rounded-full p-2 text-brand-ink/75 transition-colors hover:bg-brand-surface hover:text-brand-olive-700"
              title="البحث"
            >
              <SearchIcon className="h-5 w-5 text-brand-olive-700" />
            </button>

            {/* Shopping Bag */}
            <Link to={ROUTES.cart} className="relative rounded-full p-2 text-brand-ink/75 transition-colors hover:bg-brand-surface hover:text-brand-olive-700" title="حقيبة التسوق">
              <ShoppingBagIcon className="h-5 w-5 text-brand-olive-700" />
              {cartItemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-olive-700 text-[10px] font-bold text-white shadow-sm">
                  {cartItemCount > 99 ? "99+" : cartItemCount}
                </span>
              )}
            </Link>

            {/* ── Auth: Profile avatar (authenticated) OR Login/Register (unauthenticated) ── */}
            {isAuthenticated ? (
              isHydrated && user ? (
                <ProfileAvatar avatarUrl={user.avatar ?? user.avatarUrl ?? null} fullName={user.fullName ?? ""} />
              ) : (
                <div className="h-9 w-9 animate-pulse rounded-full bg-brand-olive-700/15 ring-2 ring-brand-olive-700/20" aria-label="جارٍ تحميل الملف الشخصي" />
              )
            ) : (
              <div className="hidden sm:flex lg:hidden items-center gap-2">
                <Link to={ROUTES.login} className="text-sm font-semibold text-brand-ink/80 hover:text-brand-olive-600 transition-colors">تسجيل الدخول</Link>
                <Link to={ROUTES.signup} className="px-3 py-1.5 rounded-full text-sm font-semibold bg-brand-olive-700 text-white hover:bg-brand-olive-800 transition-colors">إنشاء حساب</Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              id="header-mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-brand-ink lg:hidden"
              aria-label="القائمة"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <XMarkIcon className="h-5 w-5 text-brand-olive-700" /> : <MenuIcon className="h-5 w-5 text-brand-olive-700" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Drawer ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-[#D8D2C5] bg-[#F8F6F1] px-6 py-4 lg:hidden"
            aria-label="قائمة الهاتف"
          >
            <div className="flex flex-col gap-2">
              {visibleNavLinks.map((link) => (
                              /* Use NavLink here too so mobile items are route-aware; keep onClick to close the drawer */
                              <NavLink
                                key={link.path}
                                to={link.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className={({ isActive: navIsActive }) => `rounded-lg px-3 py-3 text-base font-bold ${navIsActive ? "bg-[#E5EBDD] text-[#3E522C]" : "text-[#25291F] hover:bg-[#F2EEE6]"}`}
                              >
                                {link.label}
                              </NavLink>
                            ))}

              {/* Mobile auth section */}
              <div className="mt-2 pt-3 border-t border-[#D8D2C5]/70 flex flex-col gap-2">
                {isAuthenticated ? (
                  <>
                    <p className="px-3 text-xs text-brand-muted">مرحباً، <span className="font-semibold text-brand-ink">{user?.fullName}</span></p>
                    <Link to={ROUTES.profile} onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-2 text-base font-medium text-brand-ink hover:bg-brand-surface transition-colors">الملف الشخصي</Link>
                    <Link to={ROUTES.orders} onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-2 text-base font-medium text-brand-ink hover:bg-brand-surface transition-colors">طلباتي</Link>
                    <Link to={ROUTES.wishlist} onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-2 text-base font-medium text-brand-ink hover:bg-brand-surface transition-colors">قائمة الأمنيات</Link>
                    <button onClick={() => { setMobileMenuOpen(false); handleLogout(); }} className="rounded-lg px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 transition-colors text-right w-full">تسجيل الخروج</button>
                  </>
                ) : (
                  <>
                    <Link to={ROUTES.login} onClick={() => setMobileMenuOpen(false)} className={`rounded-lg px-3 py-2 text-base font-medium transition-colors ${isActive(ROUTES.login) ? "bg-brand-olive-50 text-brand-olive-700 font-bold" : "text-brand-ink hover:bg-brand-surface"}`}>تسجيل الدخول</Link>
                    <Link to={ROUTES.signup} onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-2 text-base font-semibold bg-brand-olive-700 text-white text-center hover:bg-brand-olive-800 transition-colors">إنشاء حساب</Link>
                  </>
                )}
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
