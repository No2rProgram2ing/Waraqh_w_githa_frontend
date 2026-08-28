import { motion, AnimatePresence } from "framer-motion";
import { CheckCircleIcon, XMarkIcon } from "./icons";

export interface ToastProps {
  isVisible: boolean;
  message: string;
  onClose: () => void;
  type?: "success" | "error" | "info";
}

export function Toast({ isVisible, message, onClose, type = "success" }: ToastProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-stone-900 text-brand-cream shadow-xl border border-stone-700/50 min-w-[300px] max-w-md"
        >
          {type === "success" && <CheckCircleIcon className="h-5 w-5 text-emerald-400 shrink-0" />}
          <span className="text-sm font-medium flex-1">{message}</span>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
