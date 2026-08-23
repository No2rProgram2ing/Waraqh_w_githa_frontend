import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
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

interface NavLink {
  label: string;
  path: string;
}

const navLinks: NavLink[] = [
  { label: "الرئيسية", path: ROUTES.home },
  { label: "منتجات", path: ROUTES.products },
  { label: "من نحن", path: ROUTES.aboutUs },
  { label: "طلب خاص", path: ROUTES.customRequests },
  { label: "تواصل معنا", path: ROUTES.contact },
  { label: "تسجيل الدخول", path: ROUTES.login },
  { label: "إنشاء الحساب", path: ROUTES.signup },
];

const iconButtonClass =
  "relative p-2.5 text-[#20251B] transition-colors hover:text-[#536A3A]";

export function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-all duration-300 ${
        isScrolled
          ? "border-[#BEB6A8] bg-[#F8F6F1]/98 shadow-sm backdrop-blur-md"
          : "border-[#C9C1B4] bg-[#F8F6F1]"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[84px] items-center justify-between gap-4">
          <Link to={ROUTES.home} className="group flex shrink-0 items-center gap-3">
            <img
              src={logo}
              alt="ورقة وجذع"
              className="h-14 w-14 object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <span className="font-display text-2xl font-extrabold tracking-tight text-[#20251B]">
              ورقة وجذع
            </span>
          </Link>

          <nav className="hidden items-center gap-6 lg:flex xl:gap-8" aria-label="التنقل الرئيسي">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative py-2 text-[15px] font-bold transition-colors ${
                  isActive(link.path)
                    ? "text-[#3E522C]"
                    : "text-[#25291F] hover:text-[#536A3A]"
                }`}
              >
                {link.label}
                {isActive(link.path) && (
                  <motion.span
                    layoutId="activeHeaderNav"
                    className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-[#536A3A]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link to={ROUTES.notifications} className={iconButtonClass} title="التنبيهات" aria-label="التنبيهات">
              <BellIcon className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-amber-500 ring-2 ring-[#F8F6F1]" />
            </Link>
            <Link to={ROUTES.search} className={iconButtonClass} title="البحث" aria-label="البحث">
              <SearchIcon className="h-5 w-5" />
            </Link>
            <Link to={ROUTES.wishlist} className={iconButtonClass} title="قائمة الأمنيات" aria-label="قائمة الأمنيات">
              <HeartIcon className="h-5 w-5" />
            </Link>
            <Link to={ROUTES.cart} className={iconButtonClass} title="حقيبة التسوق" aria-label="حقيبة التسوق">
              <ShoppingBagIcon className="h-5 w-5" />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#536A3A] text-[10px] font-bold text-white">
                2
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className={iconButtonClass + " lg:hidden"}
              aria-label="القائمة"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <XMarkIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

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
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`rounded-lg px-3 py-3 text-base font-bold ${
                    isActive(link.path)
                      ? "bg-[#E5EBDD] text-[#3E522C]"
                      : "text-[#25291F] hover:bg-[#F2EEE6]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
