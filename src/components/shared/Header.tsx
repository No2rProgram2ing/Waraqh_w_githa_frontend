import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/images/Warqah & Jitha Logo.png";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBagIcon,
  HeartIcon,
  SearchIcon,
  BellIcon,
  MenuIcon,
  XMarkIcon,
} from "@/components/ui/icons";
import { ROUTES } from "@/routes/paths";

export function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navLinks = [
    { label: "الرئيسية", path: ROUTES.dashboard },
    { label: "منتجات", path: ROUTES.products },
    { label: "قصتنا", path: ROUTES.story },
    { label: "طلب خاص", path: ROUTES.customRequests },
    { label: "تواصل معنا", path: ROUTES.contact },
    { label: "تسجيل الدخول", path: ROUTES.login },
    { label: "إنشاء الحساب", path: ROUTES.signup },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      className={`
        sticky top-0 z-40
        transition-all duration-300 ease-in-out
        ${
          isScrolled
            ? "bg-[#F8F6F1]/95 backdrop-blur-md shadow-sm border-b border-[#D8D2C5]"
            : "bg-[#F8F6F1] border-b border-[#D8D2C5]/70"
        }
      `}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">

          {/* Logo */}
          <Link
            to={ROUTES.dashboard}
            className="flex items-center gap-3 group"
          >
            <img
              src={logo}
              alt="ورقة وجذع"
              className="h-10 w-10 object-contain transition-transform duration-300 group-hover:scale-105"
            />

            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-brand-ink font-display">
                ورقة وجذع
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => {
              const active = isActive(link.path);

              return (
                <Link
                  key={link.path + link.label}
                  to={link.path}
                  className={`
                    relative py-1
                    text-sm font-semibold
                    transition-colors duration-200
                    ${
                      active
                        ? "text-brand-olive-700"
                        : "text-brand-ink/80 hover:text-brand-olive-600"
                    }
                  `}
                >
                  {link.label}

                  {active && (
                    <motion.div
                      layoutId="activeHeaderNav"
                      className="
                        absolute
                        bottom-0 right-0 left-0
                        h-0.5
                        bg-brand-olive-700
                        rounded-full
                      "
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3 sm:gap-4">

            {/* Notification */}
            <Link
              to={ROUTES.notifications}
              className="
                relative rounded-full p-2
                text-brand-ink/75
                transition-colors
                hover:bg-brand-surface
                hover:text-brand-olive-700
              "
              title="التنبيهات"
            >
              <BellIcon />

              <span
                className="
                  absolute right-1.5 top-1.5
                  h-2 w-2
                  rounded-full
                  bg-amber-500
                  ring-2 ring-[#F8F6F1]
                "
              />
            </Link>

            {/* Search */}
            <Link
              to={ROUTES.search}
              className="
                rounded-full p-2
                text-brand-ink/75
                transition-colors
                hover:bg-brand-surface
                hover:text-brand-olive-700
              "
              title="البحث"
            >
              <SearchIcon />
            </Link>

            {/* Wishlist */}
            <Link
              to={ROUTES.wishlist}
              className="
                rounded-full p-2
                text-brand-ink/75
                transition-colors
                hover:bg-brand-surface
                hover:text-brand-olive-700
              "
              title="قائمة الأمنيات"
            >
              <HeartIcon />
            </Link>

            {/* Shopping Bag */}
            <Link
              to={ROUTES.orders}
              className="
                relative rounded-full p-2
                text-brand-ink/75
                transition-colors
                hover:bg-brand-surface
                hover:text-brand-olive-700
              "
              title="حقيبة التسوق"
            >
              <ShoppingBagIcon />

              <span
                className="
                  absolute -right-0.5 -top-0.5
                  flex h-4 w-4
                  items-center justify-center
                  rounded-full
                  bg-brand-olive-700
                  text-[10px] font-bold text-white
                  shadow-sm
                "
              >
                2
              </span>
            </Link>

            {/* Mobile Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="
                rounded-lg p-2
                text-brand-ink
                transition-colors
                hover:bg-brand-surface
                hover:text-brand-olive-700
                lg:hidden
              "
              aria-label="القائمة"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <XMarkIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="
              overflow-hidden
              border-b border-[#D8D2C5]
              bg-[#F8F6F1]
              px-6 py-4
              lg:hidden
            "
          >
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path + link.label}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    rounded-lg
                    px-3 py-2
                    text-base font-medium
                    transition-colors
                    ${
                      isActive(link.path)
                        ? "bg-brand-olive-50 text-brand-olive-700 font-bold"
                        : "text-brand-ink hover:bg-brand-surface"
                    }
                  `}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}