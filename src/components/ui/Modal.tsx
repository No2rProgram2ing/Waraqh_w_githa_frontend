import { useEffect } from "react";
import type { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon } from "./icons";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
}

const maxWidthMap = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
};

export function Modal({ isOpen, onClose, title, children, maxWidth = "lg" }: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className={`relative w-full ${maxWidthMap[maxWidth]} rounded-3xl bg-brand-cream border border-brand-border p-6 sm:p-8 shadow-2xl shadow-stone-950/15 z-10`}
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-brand-border/60 pb-4 mb-6">
              {title && <h3 className="text-xl font-bold text-brand-ink">{title}</h3>}
              <button
                onClick={onClose}
                className="mr-auto text-brand-muted hover:text-brand-ink p-1.5 rounded-full hover:bg-brand-surface transition-colors"
                aria-label="إغلاق"
              >
                <XMarkIcon />
              </button>
            </div>

            {/* Content */}
            <div>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
