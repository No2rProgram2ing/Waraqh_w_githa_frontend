import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ShieldCheck, Info, Lock } from "lucide-react";
import { useCartStore, DEFAULT_RESERVATION_MINUTES } from "@/features/cart/stores/cartStore";
import { cartApi } from "@/api/cartApi";
import { customerAuthStorage } from "@/features/auth-customer/services/customerAuthStorage";
import { showInfoToast } from "@/lib/toast";

interface CartReservationTimerProps {
  variant?: "banner" | "mini" | "compact";
  onExpired?: () => void;
}

export function CartReservationTimer({
  variant = "banner",
  onExpired,
}: CartReservationTimerProps) {
  const items = useCartStore((state) => state.items);
  const reservationExpiresAt = useCartStore((state) => state.reservationExpiresAt);
  const isReservationExpired = useCartStore((state) => state.isReservationExpired);
  const expireReservation = useCartStore((state) => state.expireReservation);
  const refreshCart = useCartStore((state) => state.refreshCart);
  const hasActiveReservation =
    items.some((item) => item.isReserved && (item.reservedQuantity ?? 0) > 0) &&
    Boolean(reservationExpiresAt && reservationExpiresAt > Date.now());
  const shouldShowReservationStatus = hasActiveReservation || isReservationExpired;

  const [remainingSeconds, setRemainingSeconds] = useState<number>(() => {
    if (!reservationExpiresAt || !hasActiveReservation) return 0;
    return Math.max(0, Math.floor((reservationExpiresAt - Date.now()) / 1000));
  });

  const [showInfoModal, setShowInfoModal] = useState(false);

  useEffect(() => {
    if (isReservationExpired) {
      setRemainingSeconds(0);
      return;
    }

    if (!reservationExpiresAt || !hasActiveReservation) {
      setRemainingSeconds(0);
      return;
    }

    const updateTimer = () => {
      const remaining = Math.max(0, Math.floor((reservationExpiresAt - Date.now()) / 1000));
      setRemainingSeconds(remaining);

      if (remaining === 0) {
        expireReservation();
        if (customerAuthStorage.getToken()) {
          void cartApi.releaseReservation()
            .then(() => refreshCart())
            .catch((error) => {
              console.error("Failed to release expired cart reservation", error);
            });
        }
        showInfoToast("انتهت مدة حجز المنتجات وتم إعادة الكمية إلى المخزون.");
        onExpired?.();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [
    reservationExpiresAt,
    hasActiveReservation,
    isReservationExpired,
    expireReservation,
    refreshCart,
    onExpired,
  ]);

  if (!shouldShowReservationStatus) return null;

  const totalDurationSeconds = DEFAULT_RESERVATION_MINUTES * 60;
  const progressPercent = Math.min(
    100,
    Math.max(0, (remainingSeconds / totalDurationSeconds) * 100)
  );

  const hours = Math.floor(remainingSeconds / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;

  const formattedTime = hours > 0
    ? `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
    : `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const isUrgent = remainingSeconds > 0 && remainingSeconds <= 60;
  const isExpired = remainingSeconds === 0 || isReservationExpired;

  // ----------------------------------------------------
  // MINI / SIDEBAR VARIANT
  // ----------------------------------------------------
  if (variant === "mini") {
    return (
      <div className={`rounded-xl border p-3.5 text-xs transition-colors duration-300 ${
        isExpired
          ? "border-[#e0b0b0] bg-[#fdf2f2] text-[#922b2b]"
          : isUrgent
            ? "border-[#e9c69d] bg-[#fef7ee] text-[#8f4b14]"
            : "border-[#d0dac4] bg-[#f2f6ee] text-[#3d5029]"
      }`}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {isExpired ? (
              <Lock className="size-4 shrink-0 text-[#52663c]" />
            ) : (
              <Lock className={`size-3.5 shrink-0 ${isUrgent ? "text-[#c2410c] animate-pulse" : "text-[#52663c]"}`} />
            )}
            <span className="font-bold">
              {"المخزون محجوز لك"}
            </span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-sm font-black">
            {!isExpired ? (
              <span className={`rounded px-1.5 py-0.5 ${
                isUrgent ? "bg-[#fed7aa] text-[#9a3412]" : "bg-[#dfead8] text-[#2c3d1b]"
              }`}>
                {formattedTime}
              </span>
            ) : null}
          </div>
        </div>

        {/* Mini progress bar */}
        {!isExpired && (
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-black/10">
            <motion.div
              className={`h-full transition-all duration-500 ${
                isUrgent ? "bg-[#ea580c]" : "bg-[#52663c]"
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
      </div>
    );
  }

  // ----------------------------------------------------
  // FULL BANNER VARIANT (TOP OF CART)
  // ----------------------------------------------------
  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative mb-8 overflow-hidden rounded-2xl border p-4 sm:p-5 shadow-sm transition-all duration-300 ${
          isExpired
            ? "border-[#f0b4b4] bg-[#fef2f2] text-[#7f1d1d]"
            : isUrgent
              ? "border-[#fcd34d] bg-[#fffbeb] text-[#92400e]"
              : "border-[#d3ded0] bg-[#f4f7f2] text-[#2d3a22]"
        }`}
        aria-live="polite"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Left / Info Section */}
          <div className="flex items-start gap-3.5">
            <div
              className={`flex size-11 shrink-0 items-center justify-center rounded-xl shadow-sm ${
                isExpired
                  ? "bg-[#fee2e2] text-[#b91c1c]"
                  : isUrgent
                    ? "bg-[#fef3c7] text-[#d97706] animate-bounce"
                    : "bg-[#e5eedf] text-[#4a5f33]"
              }`}
            >
              {isExpired ? (
                <Lock className="size-6" />
              ) : (
                <Clock className="size-6" />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-bold sm:text-lg">
                  {"تم حجز كمية المنتجات مؤقتاً لسلتك"}
                </h2>

                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    isExpired
                      ? "bg-[#fee2e2] text-[#991b1b]"
                      : isUrgent
                        ? "bg-[#fde68a] text-[#b45309]"
                        : "bg-[#d8e6d2] text-[#3e522c]"
                  }`}
                >
                  <ShieldCheck className="size-3" />
                  {"حجز مؤقت نشط"}
                </span>
              </div>

              <p className="mt-1 text-xs sm:text-sm leading-relaxed text-black/70">
                {`المنتجات في سلتك محجوزة حصرياً لك لمدة ${DEFAULT_RESERVATION_MINUTES} دقائق لمنع شرائها من عملاء آخرين أثناء إتمام الطلب.`}
              </p>
            </div>
          </div>

          {/* Right / Timer & Actions Section */}
          <div className="flex items-center justify-between sm:justify-end gap-3 self-stretch sm:self-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-black/10">
            {!isExpired ? (
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-black/60">
                  الوقت المتبقي
                </span>
                <div
                  className={`mt-0.5 flex items-center gap-1 font-mono text-2xl font-black tracking-wider px-3 py-1 rounded-lg border shadow-inner ${
                    isUrgent
                      ? "bg-[#fee2e2] border-[#fca5a5] text-[#b91c1c] animate-pulse"
                      : "bg-white/80 border-[#cfdac7] text-[#2c3e1b]"
                  }`}
                >
                  <span>{formattedTime}</span>
                </div>
              </div>
            ) : null}

            <div className="flex items-center gap-2">

              <button
                type="button"
                onClick={() => setShowInfoModal(true)}
                aria-label="معلومات حجز المخزون"
                className="inline-flex size-9 items-center justify-center rounded-xl border border-black/10 bg-white/60 text-black/70 hover:bg-white hover:text-black transition"
              >
                <Info className="size-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Visual Progress Bar */}
        {!isExpired && (
          <div className="mt-3.5 h-2 w-full overflow-hidden rounded-full bg-black/10">
            <motion.div
              className={`h-full transition-all duration-700 ${
                isUrgent ? "bg-[#ea580c]" : "bg-[#52663c]"
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
      </motion.section>

      {/* Info Modal on Temporary Reservation Mechanism */}
      <AnimatePresence>
        {showInfoModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
            dir="rtl"
            onClick={() => setShowInfoModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl border border-[#d8d0c3] bg-[#fbf9f5] p-6 shadow-2xl text-[#26291f]"
            >
              <div className="flex items-center justify-between border-b border-[#e5dfd5] pb-4">
                <div className="flex items-center gap-2">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-[#eef3ea] text-[#52663c]">
                    <ShieldCheck className="size-5" />
                  </div>
                  <h3 className="text-lg font-bold text-[#3e522c]">
                    آلية حجز المخزون المؤقت
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowInfoModal(false)}
                  className="rounded-full p-1 text-[#77766d] hover:bg-[#eae4d9] transition"
                >
                  ✕
                </button>
              </div>

              <div className="mt-4 space-y-4 text-sm leading-relaxed text-[#54564c]">
                <div className="rounded-xl border border-[#e2d8c9] bg-[#f5efe7] p-3.5">
                  <h4 className="font-bold text-[#2d3a22] flex items-center gap-2">
                    <Lock className="size-4 text-[#52663c]" />
                    لماذا نستخدم نظام الحجز المؤقت؟
                  </h4>
                  <p className="mt-1 text-xs text-[#6e7265] leading-6">
                    منتجات ورقة وجذع تُصنع يدويًا بمواد طبيعية وبكميات محددة. لحمايتك من نفاد المنتج أثناء الدفع، يتم حجز القطعة في قاعدة البيانات فور إضافتها لسلتك وخصمها من المخزون المتاح للآخرين.
                  </p>
                </div>

                <ul className="space-y-3 text-xs sm:text-sm">
                  <li className="flex items-start gap-2.5">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#52663c] text-white font-bold text-[10px]">
                      1
                    </span>
                    <div>
                      <strong>حجز فوري ومؤقت:</strong> تضمن خلال فترة الحجز ألا يتمكن أي متسوق آخر من شراء نفس القطعة أو الكمية المحجوزة.
                    </div>
                  </li>

                  <li className="flex items-start gap-2.5">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#52663c] text-white font-bold text-[10px]">
                      2
                    </span>
                    <div>
                      <strong>إعادة المخزون تلقائيًا:</strong> عند انتهاء مدة الحجز دون إتمام الشراء، تتم إعادة القطعة تلقائيًا للمخزون العام لإتاحة الفرصة للآخرين.
                    </div>
                  </li>

                  <li className="flex items-start gap-2.5">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#52663c] text-white font-bold text-[10px]">
                      3
                    </span>
                    <div>
                      <strong>إمكانية التجديد:</strong> يمكنك الضغط على "تجديد الحجز" في أي وقت لإعادة ضبط العداد إذا كنت ترغب في مواصلة التسوق.
                    </div>
                  </li>
                </ul>
              </div>

              <div className="mt-6 flex justify-end border-t border-[#e5dfd5] pt-4">
                <button
                  type="button"
                  onClick={() => setShowInfoModal(false)}
                  className="rounded-xl bg-[#52663c] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#3e522c]"
                >
                  فهمت ذلك
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
